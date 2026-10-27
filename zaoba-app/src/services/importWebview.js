// 拾光适配脚本的 WebView 宿主（仅 App 端可用）
//
// 背景：拾光课程表的「教务导入」是在开了教务网页的 WebView 里注入一段学校适配脚本，
// 脚本抓页面/调接口，再通过 window.shiguangBridgePromise 把标准 JSON 回传原生。
// 早八要复用这套适配库（shiguang_warehouse，269 校），就得在 App 里重现这个宿主。
//
// 早八没有原生代码，通信这么搭：
//   脚本 -> 早八：注入的桥把消息分片，用 location.href = 'shiguang-import://...' 发出去，
//                 宿主用 Webview.overrideUrlLoading 拦截（拦截后不会真跳转）。分片是为了
//                 绕开 URL 长度限制（课程 JSON 动辄几十 KB）。
//   早八 -> 脚本：Webview.evalJS（原生回调脚本里的 window._shiguangNativeCallback）。
//
// 适配脚本本身来自 shiguang_warehouse（MIT），桥协议来自 shiguangschedule（Apache-2.0），
// 细节见仓库根目录 NOTICE。

const SCHEME = 'shiguang-import://'
const CHUNK = 1800
const INJECT_DELAY = 150
const VALIDATOR_TIMEOUT = 4000

// 拾光原版桥的 JS 端实现（与 shiguangschedule 的 JS_BRIDGE_INIT 等价），
// 只把「怎么发给原生」换成早八的实现：_shiguangNativeBridge.postMessage 由宿主注入。
export const BRIDGE_JS = `(function() {
  if (window._shiguangBridgeInjected) return;
  window._shiguangBridgeInjected = true;

  var callbacks = {};
  var callbackCounter = 0;

  function postRawMessage(msg) {
    if (window._shiguangNativeBridge && typeof window._shiguangNativeBridge.postMessage === 'function') {
      window._shiguangNativeBridge.postMessage(msg);
      return;
    }
    console.warn('[ShiguangBridge] Native bridge unavailable');
  }

  function postMessageToNative(action, payload, callbackId) {
    var msg = JSON.stringify({
      action: action,
      callbackId: callbackId || null,
      payload: payload ? JSON.stringify(payload) : null
    });
    postRawMessage(msg);
  }

  window._shiguangNativeCallback = function(callbackId, isSuccess, result) {
    var cb = callbacks[callbackId];
    if (cb) {
      if (isSuccess) cb.resolve(result);
      else cb.reject(result);
      delete callbacks[callbackId];
    }
  };

  var p = {
    showAlert: function(titleText, contentText, confirmText) {
      return new Promise(function(resolve, reject) {
        var id = 'cb_' + (++callbackCounter) + '_' + Date.now();
        callbacks[id] = { resolve: resolve, reject: reject };
        postMessageToNative('showAlert', { titleText: titleText || '', contentText: contentText || '', confirmText: confirmText || null }, id);
      });
    },
    showPrompt: function(titleText, tipText, defaultText, validatorJsFunction) {
      return new Promise(function(resolve, reject) {
        var id = 'cb_' + (++callbackCounter) + '_' + Date.now();
        callbacks[id] = { resolve: resolve, reject: reject };
        postMessageToNative('showPrompt', { titleText: titleText || '', tipText: tipText || '', defaultText: defaultText || '', validatorJsFunction: validatorJsFunction || '' }, id);
      });
    },
    showSingleSelection: function(titleText, items, defaultSelectedIndex) {
      return new Promise(function(resolve, reject) {
        var id = 'cb_' + (++callbackCounter) + '_' + Date.now();
        callbacks[id] = { resolve: resolve, reject: reject };
        var itemsJson = (typeof items === 'string') ? items : JSON.stringify(items || []);
        postMessageToNative('showSingleSelection', { titleText: titleText || '', itemsJsonString: itemsJson, defaultSelectedIndex: defaultSelectedIndex !== undefined ? defaultSelectedIndex : -1 }, id);
      });
    },
    saveImportedCourses: function(coursesJsonString) {
      return new Promise(function(resolve, reject) {
        var id = 'cb_' + (++callbackCounter) + '_' + Date.now();
        callbacks[id] = { resolve: resolve, reject: reject };
        postMessageToNative('saveImportedCourses', { coursesJsonString: coursesJsonString }, id);
      });
    },
    saveCourseConfig: function(configJsonString) {
      return new Promise(function(resolve, reject) {
        var id = 'cb_' + (++callbackCounter) + '_' + Date.now();
        callbacks[id] = { resolve: resolve, reject: reject };
        postMessageToNative('saveCourseConfig', { configJsonString: configJsonString }, id);
      });
    },
    savePresetTimeSlots: function(timeSlotsJsonString) {
      return new Promise(function(resolve, reject) {
        var id = 'cb_' + (++callbackCounter) + '_' + Date.now();
        callbacks[id] = { resolve: resolve, reject: reject };
        postMessageToNative('savePresetTimeSlots', { timeSlotsJsonString: timeSlotsJsonString }, id);
      });
    },
    saveComboSchedule: function(comboScheduleJsonString) {
      return new Promise(function(resolve, reject) {
        var id = 'cb_' + (++callbackCounter) + '_' + Date.now();
        callbacks[id] = { resolve: resolve, reject: reject };
        var comboJson = (typeof comboScheduleJsonString === 'string') ? comboScheduleJsonString : JSON.stringify(comboScheduleJsonString || {});
        postMessageToNative('saveComboSchedule', { comboScheduleJsonString: comboJson }, id);
      });
    }
  };

  var sync = {
    showToast: function(message) { postMessageToNative('showToast', { message: message }); },
    notifyTaskCompletion: function() { postMessageToNative('notifyTaskCompletion'); }
  };

  window.shiguangBridgePromise = p;
  window.shiguangBridge = sync;
  window.AndroidBridgePromise = p;
  window.AndroidBridge = sync;
})();`

let session = null

// 注入到教务页里的「传输层」脚本：把消息分片、用自定义 scheme 发出去。
// 抽成独立函数是为了能在 Node 里跑回归（见 scripts/test-shiguang-bridge.mjs）。
export function buildShimScript() {
  return '(function(){' +
    'if(window.__sqBridgeReady){return}window.__sqBridgeReady=true;' +
    'function sqB64(s){return btoa(unescape(encodeURIComponent(s)))}' +
    'function sqSend(str){' +
    '  var enc=sqB64(str);var total=Math.max(1,Math.ceil(enc.length/' + CHUNK + '));' +
    '  var sid="m"+Date.now().toString(36)+Math.floor(Math.random()*1e6).toString(36);' +
    '  var i=0;function step(){if(i>=total){return}' +
    '    var d=enc.substr(i*' + CHUNK + ',' + CHUNK + ');' +
    '    try{window.location.href="' + SCHEME + 'msg?sid="+sid+"&i="+i+"&n="+total+"&d="+d}catch(e){}' +
    '    i++;setTimeout(step,25)}' +
    '  step()}' +
    'window._shiguangNativeBridge={postMessage:function(m){sqSend(m)}};' +
    'window.__sqRunValidator=function(id,fnName,input){var out=false;try{var fn=window[fnName];out=(typeof fn==="function")?fn(input):false}catch(e){out="校验出错："+e}' +
    '  sqSend(JSON.stringify({action:"__validatorResult",id:id,result:(out===undefined?"":out)}))};' +
    '})();'
}

// 把学校适配脚本包一层：同一页面只跑一次，异常不炸宿主，只 toast
export function buildAdapterScript(script) {
  return 'if(!window.__sqAdapterRan){window.__sqAdapterRan=true;try{' +
    '(function(){' + String(script || '') + '\n})();' +
    '}catch(e){window.shiguangBridge&&window.shiguangBridge.showToast&&window.shiguangBridge.showToast("适配脚本执行出错："+e)}}'
}

// 分片大小与协议前缀，测试里也用得到
export const BRIDGE_SCHEME = SCHEME
export const BRIDGE_CHUNK_SIZE = CHUNK

export function isImportSupported() {
  return typeof plus !== 'undefined' && !!plus.webview && !!plus.webview.create
}

// 关掉当前会话（页面被卸载、或用户点取消时调用）
export function closeImportWebview() {
  if (session) {
    session.abort('cancelled')
  }
}

/**
 * 跑一个学校的适配脚本。
 *
 * @param {object} opts
 * @param {string} opts.schoolName 学校名（只用于标题）
 * @param {object} opts.adapter    { id, name, importUrl }
 * @param {string} opts.script     适配脚本源码
 * @param {(e:{type:string,message?:string,count?:number})=>void} [opts.onEvent]
 * @returns {Promise<{coursesJson:string,timeSlotsJson:string,configJson:string,comboScheduleJson:string,completed:boolean}>}
 */
export function runAdapterImport(opts) {
  const { schoolName, adapter, script, onEvent } = opts
  if (!isImportSupported()) {
    return Promise.reject(new Error('教务导入只能在 App 内使用'))
  }
  if (!adapter || !adapter.importUrl) {
    return Promise.reject(new Error('这个学校没有配置教务系统地址'))
  }

  const emit = (e) => {
    try { if (onEvent) onEvent(e) } catch (err) { /* 忽略 UI 回调异常 */ }
  }

  return new Promise((resolve, reject) => {
    const id = 'shiguang-import-' + Date.now()
    let wv = null
    let settled = false
    let injectTimer = null
    let pageUrl = ''
    let validatorSeq = 0
    const validatorWaiters = {}
    const chunkBuffer = new Map()
    const collected = { coursesJson: '', timeSlotsJson: '', configJson: '', comboScheduleJson: '' }

    function cleanup() {
      if (injectTimer) { clearTimeout(injectTimer); injectTimer = null }
      Object.keys(validatorWaiters).forEach((k) => {
        const w = validatorWaiters[k]
        delete validatorWaiters[k]
        w('')
      })
      if (wv) {
        try { wv.removeEventListener('loaded', onLoaded) } catch (e) { /* 忽略 */ }
        try { wv.removeEventListener('close', onClose) } catch (e) { /* 忽略 */ }
        try { wv.close('fade-out') } catch (e) { /* 忽略 */ }
      }
      session = null
    }

    function finish(completed) {
      if (settled) return
      settled = true
      const payload = { ...collected, completed }
      cleanup()
      if (!completed && !payload.coursesJson) {
        reject(new Error('已取消'))
        return
      }
      resolve(payload)
    }

    function abort(reason) {
      if (settled) return
      settled = true
      cleanup()
      reject(new Error(reason === 'cancelled' ? '已取消' : String(reason)))
    }

    session = { abort }

    // ---------- 脚本 -> 原生：分片消息 ----------
    function onIntercept(result) {
      let url = ''
      if (typeof result === 'string') url = result
      else if (result && typeof result.url === 'string') url = result.url
      if (!url || url.indexOf(SCHEME) !== 0) return
      const query = url.slice(SCHEME.length)
      const get = (key) => {
        const m = query.match(new RegExp('[?&]' + key + '=([^&]*)'))
        return m ? m[1] : ''
      }
      const sid = get('sid')
      const index = parseInt(get('i'), 10)
      const total = parseInt(get('n'), 10)
      const data = get('d')
      if (!sid || !isFinite(index) || !isFinite(total) || !data) return

      let bucket = chunkBuffer.get(sid)
      if (!bucket) {
        bucket = { total, parts: {} }
        chunkBuffer.set(sid, bucket)
      }
      bucket.parts[index] = data
      if (Object.keys(bucket.parts).length < bucket.total) return

      chunkBuffer.delete(sid)
      let raw = ''
      for (let i = 0; i < bucket.total; i++) {
        if (bucket.parts[i] === undefined) return
        raw += bucket.parts[i]
      }
      let text = ''
      try {
        text = decodeURIComponent(escape(atob(raw)))
      } catch (e) {
        // base64 里混进 + / = 之外的字符时按原样尝试
        try { text = atob(raw) } catch (err) { return }
      }
      handleMessage(text)
    }

    // ---------- 原生 -> 脚本 ----------
    function resolveJs(callbackId, rawJs) {
      if (!callbackId || !wv) return
      const script = 'window._shiguangNativeCallback(' + JSON.stringify(callbackId) + ', true, ' + rawJs + ');'
      try { wv.evalJS(script) } catch (e) { /* 页面可能已关闭 */ }
    }

    function runValidator(fnName, input) {
      const vid = 'v' + (++validatorSeq)
      return new Promise((res) => {
        validatorWaiters[vid] = (msg) => res(msg)
        const js = 'window.__sqRunValidator && window.__sqRunValidator(' +
          JSON.stringify(vid) + ', ' + JSON.stringify(fnName) + ', ' + JSON.stringify(input) + ')'
        try { wv.evalJS(js) } catch (e) { delete validatorWaiters[vid]; res(''); return }
        setTimeout(() => {
          if (validatorWaiters[vid]) { delete validatorWaiters[vid]; res('') }
        }, VALIDATOR_TIMEOUT)
      })
    }

    async function promptWithValidator(p) {
      let def = p.defaultText || ''
      for (let attempt = 0; attempt < 3; attempt++) {
        const value = await nativePrompt(p.titleText, p.tipText, def)
        if (value === null) return null
        if (!p.validatorJsFunction) return value
        const err = await runValidator(p.validatorJsFunction, value)
        if (!err) return value
        uni.showToast({ title: String(err), icon: 'none' })
        def = value
      }
      return null
    }

    function nativePrompt(title, tip, defaultText) {
      return new Promise((res) => {
        try {
          plus.nativeUI.prompt(String(defaultText || ''), (r) => {
            if (!r || r.index === 1) { res(null); return }
            res(r.value === undefined ? '' : String(r.value))
          }, String(title || ''), String(tip || ''), ['确定', '取消'])
        } catch (e) {
          res(null)
        }
      })
    }

    async function handleMessage(text) {
      let msg = null
      try { msg = JSON.parse(text) } catch (e) { return }

      // 校验函数的回传
      if (msg.action === '__validatorResult') {
        const waiter = validatorWaiters[msg.id]
        if (waiter) { delete validatorWaiters[msg.id]; waiter(msg.result || '') }
        return
      }

      const action = msg.action
      const callbackId = msg.callbackId
      let payload = null
      if (msg.payload) {
        try { payload = JSON.parse(msg.payload) } catch (e) { payload = null }
      }
      payload = payload || {}

      if (action === 'showToast') {
        uni.showToast({ title: String(payload.message || ''), icon: 'none' })
        return
      }

      if (action === 'showAlert') {
        const ok = await new Promise((res) => {
          uni.showModal({
            title: String(payload.titleText || '提示'),
            content: String(payload.contentText || ''),
            showCancel: true,
            cancelText: '取消',
            confirmText: String(payload.confirmText || '确定'),
            success: (r) => res(!!r.confirm),
            fail: () => res(false)
          })
        })
        resolveJs(callbackId, ok ? 'true' : 'false')
        return
      }

      if (action === 'showPrompt') {
        const value = await promptWithValidator(payload)
        resolveJs(callbackId, value === null ? 'null' : JSON.stringify(value))
        return
      }

      if (action === 'showSingleSelection') {
        let items = []
        try { items = JSON.parse(payload.itemsJsonString || '[]') } catch (e) { items = [] }
        const index = await new Promise((res) => {
          if (!items.length) { res(null); return }
          uni.showActionSheet({
            itemList: items.map((x) => String(x)),
            success: (r) => res(r.tapIndex),
            fail: () => res(null)
          })
        })
        resolveJs(callbackId, index === null ? 'null' : String(index))
        return
      }

      if (action === 'saveImportedCourses') {
        collected.coursesJson = String(payload.coursesJsonString || '')
        emit({ type: 'courses', message: '已收到课程数据' })
        resolveJs(callbackId, 'true')
        return
      }

      if (action === 'savePresetTimeSlots') {
        collected.timeSlotsJson = String(payload.timeSlotsJsonString || '')
        emit({ type: 'timeSlots', message: '已收到节次时间' })
        resolveJs(callbackId, 'true')
        return
      }

      if (action === 'saveCourseConfig') {
        collected.configJson = String(payload.configJsonString || '')
        emit({ type: 'config', message: '已收到学期配置' })
        resolveJs(callbackId, 'true')
        return
      }

      if (action === 'saveComboSchedule') {
        collected.comboScheduleJson = String(payload.comboScheduleJsonString || '')
        emit({ type: 'combo', message: '已收到作息方案' })
        resolveJs(callbackId, 'true')
        return
      }

      if (action === 'notifyTaskCompletion') {
        emit({ type: 'done', message: '导入完成' })
        finish(true)
      }
    }

    // ---------- 页面加载后注入 ----------
    function onLoaded() {
      if (!wv) return
      if (injectTimer) clearTimeout(injectTimer)
      injectTimer = setTimeout(() => {
        if (!wv) return
        const shim = buildShimScript()
        const adapterGuard = buildAdapterScript(script)
        try {
          wv.evalJS(shim)
          wv.evalJS(BRIDGE_JS)
          wv.evalJS(adapterGuard)
          emit({ type: 'injected', message: '已注入适配脚本' })
        } catch (e) {
          emit({ type: 'error', message: '注入脚本失败：' + e.message })
        }
      }, INJECT_DELAY)
    }

    function onClose() {
      if (settled) return
      if (collected.coursesJson) finish(false)
      else abort('cancelled')
    }

    // ---------- 建窗口 ----------
    try {
      const style = {
        top: '0px',
        bottom: '0px',
        render: 'always',
        titleNView: {
          type: 'default',
          titleText: '教务导入 · ' + (schoolName || adapter.name || ''),
          titleSize: '17px',
          titleColor: '#17181c',
          backgroundColor: '#ffffff',
          autoBackButton: true
        }
      }
      wv = plus.webview.create(adapter.importUrl, id, style)
      wv.addEventListener('loaded', () => {
        try { pageUrl = wv.getURL ? wv.getURL() : '' } catch (e) { pageUrl = '' }
        onLoaded()
      })
      wv.addEventListener('close', onClose)
      wv.overrideUrlLoading(
        { mode: 'reject', match: '^shiguang-import://', effect: 'instant' },
        (result) => onIntercept(result)
      )
      plus.webview.currentWebview().append(wv)
      // append 之后子窗口已经显示了；show 只是保险，失败不影响流程
      try { wv.show('slide-in-right', 200) } catch (e) { /* 忽略动画失败 */ }
      emit({ type: 'open', message: '已打开教务系统' })
    } catch (e) {
      settled = true
      cleanup()
      reject(new Error('打不开教务系统页面：' + e.message))
    }
  })
}
