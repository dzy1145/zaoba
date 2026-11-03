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
const PAGE_LOAD_TIMEOUT = 25000

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

// 注入到教务页里的「传输层」脚本：把消息分片后发回宿主。
//
// 两条通道同时发，宿主按 (sid, 分片号) 去重：
//   1) location.href = 'shiguang-import://...'，宿主用 overrideUrlLoading 拦截 —— 传统做法，
//      但在部分 Android WebView 上拦截不到（脚本的 showAlert 就永远送不出来）。
//   2) document.title = 'SQMSG|sid|i|n|<base64>'，宿主轮询 wv.getTitle() 读取 —— 不依赖 URL 拦截，
//      比较土但很稳。每片发完等宿主 evalJS 回的 ack（window.__sqAckIdx），1.5 秒没等到就重发一次。
export function buildShimScript() {
  return '(function(){' +
    'if(window.__sqBridgeReady){return}window.__sqBridgeReady=true;' +
    'window.__sqAckIdx=-1;' +
    'var origTitle=document.title;' +
    'function sqB64(s){return btoa(unescape(encodeURIComponent(s)))}' +
    'function sqSend(str){window.__sqLastMsg=str;' +
    '  var enc=sqB64(str);var total=Math.max(1,Math.ceil(enc.length/' + CHUNK + '));' +
    '  var sid="m"+Date.now().toString(36)+Math.floor(Math.random()*1e6).toString(36);' +
    '  var i=0;' +
    '  function sendOne(){' +
    '    if(i>=total){try{document.title=origTitle}catch(e){}return}' +
    '    var idx=i;var chunk=enc.substr(idx*' + CHUNK + ',' + CHUNK + ');var tries=0;' +
    '    function attempt(){' +
    '      tries++;' +
    '      try{window.location.href="' + SCHEME + 'msg?sid="+sid+"&i="+idx+"&n="+total+"&d="+encodeURIComponent(chunk)}catch(e){}' +
    '      try{document.title="SQMSG|"+sid+"|"+idx+"|"+total+"|"+chunk}catch(e){}' +
    '      var waited=0;' +
    '      var t=setInterval(function(){' +
    '        if(window.__sqAckIdx>=idx){clearInterval(t);i=idx+1;sendOne();return}' +
    '        waited+=120;' +
    '        if(waited>=1500){clearInterval(t);if(tries<2){attempt()}else{i=idx+1;sendOne()}}' +
    '      },120);' +
    '    }' +
    '    attempt()' +
    '  }' +
    '  sendOne()}' +
    'window._shiguangNativeBridge={postMessage:function(m){sqSend(m)}};' +
    'window.__sqResend=function(){if(window.__sqLastMsg){sqSend(window.__sqLastMsg)}};' +
    'window.__sqRunValidator=function(id,fnName,input){var out=false;try{var fn=window[fnName];out=(typeof fn==="function")?fn(input):false}catch(e){out="校验出错："+e}' +
    '  sqSend(JSON.stringify({action:"__validatorResult",id:id,result:(out===undefined?"":out)}))};' +
    '})();'
}

// 把学校适配脚本包一层：同一 URL 只跑一次（站内跳转/换页要允许再跑一次），异常不炸宿主，只 toast
export function buildAdapterScript(script) {
  return 'var __sqU=(window.location&&window.location.href)||"";' +
    'if(window.__sqAdapterUrl!==__sqU){window.__sqAdapterUrl=__sqU;try{' +
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
    // 教务窗口是独立原生窗口，页面里的状态文字被挡住 —— 关键节点用原生 toast 报给用户看
    try {
      const type = e && e.type
      const keyTypes = ['injected', 'courses', 'timeSlots', 'config', 'done', 'error']
      if (type && keyTypes.indexOf(type) >= 0 && e.message) {
        plus.nativeUI.toast(String(e.message), { duration: 'long', verticalAlign: 'bottom' })
      }
    } catch (err) { /* 忽略 */ }
  }

  return new Promise((resolve, reject) => {
    const id = 'shiguang-import-' + Date.now()
    let wv = null
    let settled = false
    let injectTimer = null
    let urlTimer = null
    let titleTimer = null
    let pageUrl = ''
    let didInject = false
    let validatorSeq = 0
    const validatorWaiters = {}
    const chunkBuffer = new Map()
    const resendCount = {}
    const collected = { coursesJson: '', timeSlotsJson: '', configJson: '', comboScheduleJson: '' }

    function cleanup() {
      if (injectTimer) { clearTimeout(injectTimer); injectTimer = null }
      if (urlTimer) { clearInterval(urlTimer); urlTimer = null }
      if (titleTimer) { clearInterval(titleTimer); titleTimer = null }
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
      // shim 侧做了 encodeURIComponent；平台若已解码，这里对纯 base64 是 no-op，两种情况都安全
      let data = get('d')
      try { data = decodeURIComponent(data) } catch (e) { /* 保持原样 */ }
      if (!sid || !isFinite(index) || !isFinite(total) || !data) return
      acceptChunk(sid, index, total, data)
    }

    // 收到一个分片：攒够了一片一片拼回来；顺便回 ack 给脚本（title 通道靠它推进）
    function acceptChunk(sid, index, total, data) {
      if (wv) {
        try { wv.evalJS('window.__sqAckIdx=' + index) } catch (e) { /* 页面可能已关闭 */ }
      }

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
      // 拼出来却解析不了（分片在传输中丢了/被截断）→ 让脚本把最后一条消息重发，最多两次
      try {
        JSON.parse(text)
      } catch (e) {
        const tried = resendCount[sid] || 0
        if (tried < 2) {
          resendCount[sid] = tried + 1
          try { wv.evalJS('window.__sqResend && window.__sqResend()') } catch (err) { /* 忽略 */ }
        } else {
          delete resendCount[sid]
          emit({ type: 'error', message: '收到的数据不完整，请重试' })
        }
        return
      }
      delete resendCount[sid]
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
        const text = String(payload.message || '')
        if (text) {
          // 教务窗口是独立的原生窗口，盖住了整个页面 —— uni.showToast 画在页面里，看不见。
          // 必须用原生 toast，否则适配脚本的「请先登录」「导入失败」这类提示全是静默的。
          try {
            plus.nativeUI.toast(text, { duration: 'long', verticalAlign: 'bottom' })
          } catch (e) {
            uni.showToast({ title: text, icon: 'none' })
          }
          emit({ type: 'toast', message: text })
        }
        return
      }

      if (action === 'showAlert') {
        const title = String(payload.titleText || '提示')
        const content = String(payload.contentText || '')
        const confirmText = String(payload.confirmText || '确定')
        // 同样必须走原生弹窗：uni.showModal 画在页面里，会被教务窗口盖住
        const ok = await new Promise((res) => {
          try {
            plus.nativeUI.confirm(content, (e) => res(!!e && e.index === 1), title, ['取消', confirmText])
          } catch (e) {
            uni.showModal({
              title,
              content,
              showCancel: true,
              cancelText: '取消',
              confirmText,
              success: (r) => res(!!r.confirm),
              fail: () => res(false)
            })
          }
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
        const title = String(payload.titleText || '')
        const index = await new Promise((res) => {
          if (!items.length) { res(null); return }
          try {
            plus.nativeUI.actionSheet({
              title,
              cancel: '取消',
              buttons: items.map((x) => ({ title: String(x) }))
            }, (e) => {
              const i = e && typeof e.index === 'number' ? e.index : 0
              res(i > 0 ? i - 1 : null) // 0 是取消，按钮从 1 开始
            })
          } catch (err) {
            uni.showActionSheet({
              itemList: items.map((x) => String(x)),
              success: (r) => res(r.tapIndex),
              fail: () => res(null)
            })
          }
        })
        resolveJs(callbackId, index === null ? 'null' : String(index))
        return
      }

      if (action === 'saveImportedCourses') {
        collected.coursesJson = String(payload.coursesJsonString || '')
        let courseCount = 0
        try { const arr = JSON.parse(collected.coursesJson); courseCount = Array.isArray(arr) ? arr.length : 0 } catch (e) { courseCount = 0 }
        emit({ type: 'courses', message: courseCount ? ('已抓到 ' + courseCount + ' 门课程') : '已收到课程数据' })
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
    // 只在 loaded 里注入是不够的：不少教务（智慧校园门户）是站内跳转/SPA，
    // 从首页切到「课表查询」不会触发 loaded，脚本就永远等不到运行时机。
    // 所以再加一个 URL 轮询：地址一变就再注入一次（适配脚本自己按 URL 去重）。
    let lastInjectedUrl = ''

    function injectScripts(url) {
      if (!wv) return
      const target = String(url || '')
      if (target && target === lastInjectedUrl) return
      lastInjectedUrl = target
      const shim = buildShimScript()
      const adapterGuard = buildAdapterScript(script)
      try {
        wv.evalJS(shim)
        wv.evalJS(BRIDGE_JS)
        wv.evalJS(adapterGuard)
        didInject = true
        const host = (target.match(/^https?:\/\/([^/]+)/i) || [])[1] || ''
        emit({ type: 'injected', message: '已注入适配脚本' + (host ? '（' + host + '）' : '') })
      } catch (e) {
        emit({ type: 'error', message: '注入脚本失败：' + e.message })
      }
    }

    function onLoaded() {
      if (!wv) return
      if (injectTimer) clearTimeout(injectTimer)
      injectTimer = setTimeout(() => {
        injectScripts(pageUrl)
      }, INJECT_DELAY)
    }

    // 标题通道：脚本把分片写进 document.title，这里轮询读取。
    // 不依赖 overrideUrlLoading，所以在拦截不到自定义 scheme 的 WebView 上也能通。
    function startTitleWatcher() {
      let lastTitle = ''
      titleTimer = setInterval(() => {
        if (!wv || settled) return
        let title = ''
        try { title = String(wv.getTitle ? wv.getTitle() || '' : '') } catch (e) { title = '' }
        if (!title || title === lastTitle) return
        lastTitle = title
        if (title.indexOf('SQMSG|') !== 0) return
        const parts = title.split('|')
        if (parts.length < 5) return
        const sid = parts[1]
        const index = parseInt(parts[2], 10)
        const total = parseInt(parts[3], 10)
        const data = parts.slice(4).join('|')
        if (!sid || !isFinite(index) || !isFinite(total) || !data) return
        acceptChunk(sid, index, total, data)
      }, 150)
    }
    function startUrlWatcher() {
      urlTimer = setInterval(() => {
        if (!wv || settled) return
        let current = ''
        try { current = String(wv.getURL ? wv.getURL() || '' : '') } catch (e) { current = '' }
        if (!current || !/^https?:\/\//i.test(current)) return
        if (current === pageUrl) return
        pageUrl = current
        if (injectTimer) clearTimeout(injectTimer)
        injectTimer = setTimeout(() => injectScripts(current), INJECT_DELAY)
      }, 900)
    }

    function onClose() {
      if (settled) return
      if (collected.coursesJson) finish(false)
      else abort('cancelled')
    }

    // ---------- 建窗口 ----------
    // 注意：不要用 plus.webview.currentWebview().append(wv)。
    // uni-app 的页面自己就是 plus.webview.create 建出来的窗口，append() 是给 nvue 容器塞子窗口用的；
    // 往页面窗口上挂子窗口再 show()，Android 上会出现「窗口存在、能加载、evalJS 也生效，但看不见」
    // —— 表现就是只打印「已注入适配脚本」，屏幕上什么也没有。
    // 正确姿势：独立窗口 + show()，靠 titleNView 的返回键关闭。
    try {
      const style = {
        left: '0px',
        right: '0px',
        top: '0px',
        bottom: '0px',
        zindex: 99,
        render: 'always',
        titleNView: {
          type: 'default',
          titleText: '教务导入 · ' + (schoolName || adapter.name || ''),
          autoBackButton: true
        }
      }
      wv = plus.webview.create(adapter.importUrl, id, style)
      if (!wv) throw new Error('创建窗口失败')

      wv.addEventListener('loaded', () => {
        try { pageUrl = wv.getURL ? String(wv.getURL() || '') : '' } catch (e) { pageUrl = '' }
        // about:blank / 明确的错误页不注入（否则会出现「注入了但页面还没打开」的假象）；
        // getURL() 取不到时（部分内核在 loaded 回调里返回空串）当作未知页照常注入。
        if (pageUrl && !/^https?:\/\//i.test(pageUrl)) return
        onLoaded()
      })
      wv.addEventListener('show', () => {
        emit({ type: 'open', message: '已打开教务系统' })
        // 给个一次性提示：很多人不知道打开后要干什么
        try {
          plus.nativeUI.toast('在这里登录教务系统，登录后会自动开始导入', { duration: 'long', verticalAlign: 'bottom' })
        } catch (e) { /* 忽略 */ }
      })
      wv.addEventListener('error', (err) => {
        const code = (err && (err.code || err.message)) || ''
        emit({ type: 'error', message: '页面加载失败' + (code ? '（' + code + '）' : '') })
      })
      wv.addEventListener('close', onClose)
      startUrlWatcher()
      startTitleWatcher()
      wv.overrideUrlLoading(
        { mode: 'reject', match: '^shiguang-import://', effect: 'instant' },
        (result) => onIntercept(result)
      )

      try {
        wv.show('slide-in-right', 250, () => {
          emit({ type: 'open', message: '已打开教务系统' })
        })
      } catch (e) {
        emit({ type: 'error', message: '窗口没能显示：' + (e && e.message ? e.message : e) })
      }

      // 看门狗：一段时间内没进到真正的教务页，就把原因说出来，别让界面一直卡着
      setTimeout(() => {
        if (settled || !wv) return
        if (!didInject) {
          emit({ type: 'error', message: '教务页面没能打开' })
          abort('教务页面打不开（地址：' + adapter.importUrl + '）。如果是 http:// 开头的学校，可能是系统拦了明文传输。')
        }
      }, PAGE_LOAD_TIMEOUT)
    } catch (e) {
      settled = true
      cleanup()
      reject(new Error('打不开教务系统页面：' + e.message))
    }
  })
}
