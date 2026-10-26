// 选一个本地文件并读出字节。
// App 端走系统文件选择器（ACTION_GET_CONTENT）；H5 端用 uni.chooseFile，方便浏览器里调试。

const MAX_FILE_SIZE = 8 * 1024 * 1024
// 逐字节读的上限：过一次桥读一字节，只够小文件
const BYTE_READ_LIMIT = 512 * 1024
const REQUEST_CODE = 0x5a0b
// 系统选择器如果没把结果回调回来（被运行时拦掉等），不能让「读取文件…」的遮罩永远挂着
const PICK_TIMEOUT = 60 * 1000

export function pickBinaryFile() {
  if (typeof plus !== 'undefined' && plus.android) return pickWithAndroid()
  if (typeof uni !== 'undefined' && typeof uni.chooseFile === 'function') return pickWithH5()
  return Promise.reject(new Error('当前平台不支持选择文件'))
}

function pickWithAndroid() {
  return new Promise((resolve, reject) => {
    const main = plus.android.runtimeMainActivity()
    const Intent = plus.android.importClass('android.content.Intent')
    const intent = new Intent(Intent.ACTION_GET_CONTENT)
    intent.setType('*/*')
    intent.addCategory(Intent.CATEGORY_OPENABLE)

    let settled = false
    let timer = null
    const finish = (ok, value) => {
      if (settled) return
      settled = true
      if (timer) clearTimeout(timer)
      if (ok) resolve(value)
      else reject(value)
    }

    const previous = main.onActivityResult
    main.onActivityResult = function (requestCode, resultCode, data) {
      if (requestCode !== REQUEST_CODE) {
        if (typeof previous === 'function') previous.apply(main, arguments)
        return
      }
      main.onActivityResult = previous
      if (resultCode !== -1 || !data) {
        finish(false, new Error('已取消'))
        return
      }
      const uri = pickUriFromResult(data)
      if (!uri) {
        finish(false, new Error('没有选中文件'))
        return
      }
      readUri(uri).then((bytes) => finish(true, bytes), (error) => finish(false, error))
    }

    timer = setTimeout(() => {
      main.onActivityResult = previous
      finish(false, new Error('没有拿到文件，再试一次'))
    }, PICK_TIMEOUT)

    main.startActivityForResult(intent, REQUEST_CODE)
  })
}

// 单选用 getData()；像 ColorOS「选择文件」这种多选面板只把结果放进 ClipData
function pickUriFromResult(data) {
  try {
    const direct = callNative(data, 'getData')
    if (direct) return direct
  } catch (e) {
    // 继续看 ClipData
  }
  try {
    const clip = callNative(data, 'getClipData')
    if (!clip) return null
    const item = callNative(clip, 'getItemAt', 0)
    if (!item) return null
    return callNative(item, 'getUri')
  } catch (e) {
    return null
  }
}

function readUri(uri) {
  let raw = ''
  try {
    raw = String(uri || '')
  } catch (e) {
    raw = ''
  }
  // 有些文件管理器直接给 file:// 路径，能走 plus.io 就别绕 ContentResolver
  if (/^file:\/\//i.test(raw)) {
    return readLocalPath(raw).catch(() => readContentStream(uri))
  }

  let path = ''
  try {
    if (typeof plus.android.resolveNativeUri === 'function') path = plus.android.resolveNativeUri(uri) || ''
  } catch (e) {
    path = ''
  }

  if (path && typeof path === 'string') {
    return readLocalPath(path).catch(() => readContentStream(uri))
  }
  return readContentStream(uri)
}

function readLocalPath(path) {
  return new Promise((resolve, reject) => {
    const url = /^file:\/\//i.test(path) ? path : `file://${path.charAt(0) === '/' ? path : '/' + path}`
    plus.io.resolveLocalFileSystemURL(url, (entry) => {
      entry.file((file) => {
        if (file.size > MAX_FILE_SIZE) {
          reject(new Error('文件太大'))
          return
        }
        const reader = new plus.io.FileReader()
        if (typeof reader.readAsDataURL !== 'function') {
          reject(new Error('无法读取文件'))
          return
        }
        reader.onloadend = (event) => {
          try {
            const dataUrl = String((event.target && event.target.result) || '')
            const base64 = dataUrl.split(',')[1] || ''
            resolve(base64ToBytes(base64))
          } catch (error) {
            reject(error)
          }
        }
        reader.onerror = () => reject(new Error('读取文件失败'))
        reader.readAsDataURL(file)
      }, reject)
    }, reject)
  })
}

// native.js 里，实例上的方法只有「导入过类」才会挂出来；
// 直接 obj.method() 可能报 not a function，所以先试直接调，再退回 plus.android.invoke。
function callNative(target, method, ...args) {
  if (target) {
    try {
      const fn = target[method]
      if (typeof fn === 'function') return fn.apply(target, args)
    } catch (e) {
      // 落到 invoke
    }
  }
  return plus.android.invoke(target, method, ...args)
}

// content:// 走不了文件路径时直接读流。三条路，按可靠性从高到低：
//   1) android.os.FileUtils.copy 把流拷进 App 私有目录（API 29+，不碰 byte[]，最稳）
//   2) 分块读 byte[] + Base64
//   3) 逐字节读（只给小文件兜底）
function readContentStream(uri) {
  return new Promise((resolve, reject) => {
    let stream
    try {
      stream = openContentStream(uri)
    } catch (error) {
      reject(error)
      return
    }

    const done = (fn) => {
      try {
        callNative(stream, 'close')
      } catch (e) {
        // 关流失败不影响已经读到的数据
      }
      fn()
    }

    const finish = (bytes) => {
      done(() => resolve(bytes))
    }

    const fail = (error) => {
      const message = (error && error.message) || String(error)
      done(() => reject(new Error(/文件太大/.test(message) ? message : `读不出文件内容：${message}`)))
    }

    // 1) 拷到私有目录再用 plus.io 读（plus.io 的读取在真机上是验过的）
    if (canCopyStream()) {
      copyStreamToAppFile(stream)
        .then((bytes) => finish(bytes))
        .catch((error) => fail(error))
      return
    }

    // 2) / 3) 纯 JS 读流
    let bytes
    try {
      bytes = readStream(stream)
    } catch (error) {
      fail(error)
      return
    }
    finish(bytes)
  })
}

function canCopyStream() {
  try {
    const FileUtils = plus.android.importClass('android.os.FileUtils')
    return !!(FileUtils && typeof FileUtils.copy === 'function')
  } catch (e) {
    return false
  }
}

// 流落盘 + 读回来；失败不回溯（流已经被读走了，再读会错位）
function copyStreamToAppFile(stream) {
  const target = '_doc/import_temp.xls'
  try {
    const FileUtils = plus.android.importClass('android.os.FileUtils')
    const FileOutputStream = plus.android.importClass('java.io.FileOutputStream')
    const absolute = plus.io.convertLocalFileSystemURL(target)
    if (!absolute) throw new Error('拿不到临时目录')
    const output = new FileOutputStream(absolute)
    try {
      callNative(FileUtils, 'copy', stream, output)
    } finally {
      try {
        callNative(output, 'flush')
      } catch (e) {
        // 忽略
      }
      try {
        callNative(output, 'close')
      } catch (e) {
        // 忽略
      }
    }
  } catch (error) {
    return Promise.reject(error)
  }

  return readAppFile(target)
}

function readAppFile(relativePath) {
  return new Promise((resolve, reject) => {
    plus.io.resolveLocalFileSystemURL(relativePath, (entry) => {
      entry.file((file) => {
        if (!file.size) {
          reject(new Error('临时文件是空的'))
          return
        }
        if (file.size > MAX_FILE_SIZE) {
          reject(new Error('文件太大'))
          return
        }
        const reader = new plus.io.FileReader()
        if (typeof reader.readAsDataURL !== 'function') {
          reject(new Error('无法读取文件'))
          return
        }
        reader.onloadend = (event) => {
          try {
            const dataUrl = String((event.target && event.target.result) || '')
            resolve(base64ToBytes(dataUrl.split(',')[1] || ''))
          } catch (e) {
            reject(e)
          }
        }
        reader.onerror = () => reject(new Error('读取文件失败'))
        reader.readAsDataURL(file)
      }, reject)
    }, reject)
  })
}

function openContentStream(uri) {
  const main = plus.android.runtimeMainActivity()
  // 不导入这两个类，getContentResolver() 拿回来的代理上没有 openInputStream
  try {
    plus.android.importClass('android.content.Context')
  } catch (e) {
    // 导入失败下面还有 invoke 兜底
  }
  try {
    plus.android.importClass('android.content.ContentResolver')
  } catch (e) {
    // 同上
  }
  const resolver = callNative(main, 'getContentResolver')
  if (!resolver) throw new Error('打不开文件')
  const stream = callNative(resolver, 'openInputStream', uri)
  if (!stream) throw new Error('打不开文件')
  return stream
}

// byte 的原始类型（java.lang.Byte.TYPE）在 native.js 里偶尔读不到，
// 换个方式再取一次；实在拿不到就走逐字节。
function byteTypeOf(Byte) {
  try {
    if (Byte && Byte.TYPE != null) return Byte.TYPE
  } catch (e) {
    // 继续换法子
  }
  try {
    const value = plus.android.getAttribute(Byte, 'TYPE')
    if (value != null) return value
  } catch (e) {
    // 放弃
  }
  return null
}

// 先准备好 byte[]，准备好了才用分块读；建不出来就整段走逐字节，
// 绝不能读到一半再退回逐字节（那样数据会错位）。
function readStream(stream) {
  let buffer = null
  try {
    const Byte = plus.android.importClass('java.lang.Byte')
    const type = byteTypeOf(Byte)
    if (type != null) {
      buffer = plus.android.invoke('java.lang.reflect.Array', 'newInstance', type, 8192)
    }
  } catch (e) {
    buffer = null
  }
  if (!buffer) {
    return readStreamByByte(stream)
  }

  let output
  try {
    output = plus.android.newObject('java.io.ByteArrayOutputStream')
  } catch (e) {
    const ByteArrayOutputStream = plus.android.importClass('java.io.ByteArrayOutputStream')
    output = new ByteArrayOutputStream()
  }

  let total = 0
  let read
  while ((read = callNative(stream, 'read', buffer)) > 0) {
    callNative(output, 'write', buffer, 0, read)
    total += read
    if (total > MAX_FILE_SIZE) throw new Error('文件太大')
  }

  const Base64 = plus.android.importClass('android.util.Base64')
  const encoded = callNative(Base64, 'encodeToString', callNative(output, 'toByteArray'), 0)
  return base64ToBytes(String(encoded))
}

// 逐字节是最后手段：每次过一次桥，所以只给几万字节的小文件用
function readStreamByByte(stream) {
  const bytes = []
  let value
  while ((value = callNative(stream, 'read')) !== -1) {
    bytes.push(value & 0xff)
    if (bytes.length > BYTE_READ_LIMIT) throw new Error('文件太大，请在电脑上另存成更小的 .xls 再导入')
  }
  return Uint8Array.from(bytes)
}

function pickWithH5() {
  return new Promise((resolve, reject) => {
    uni.chooseFile({
      count: 1,
      type: 'file',
      extension: ['.xls'],
      success: (res) => {
        const temp = res.tempFiles && res.tempFiles[0]
        const file = temp && (typeof File !== 'undefined' && temp instanceof File ? temp : temp.file || temp)
        if (!file) {
          reject(new Error('没有选中文件'))
          return
        }
        if (file.size > MAX_FILE_SIZE) {
          reject(new Error('文件太大'))
          return
        }
        const reader = new FileReader()
        reader.onload = () => resolve(new Uint8Array(reader.result))
        reader.onerror = () => reject(new Error('读取文件失败'))
        reader.readAsArrayBuffer(file)
      },
      fail: (error) => {
        const message = (error && error.errMsg) || ''
        reject(new Error(/cancel/i.test(message) ? '已取消' : '选择文件失败'))
      }
    })
  })
}

function base64ToBytes(base64) {
  const binary = atob(base64)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)
  return bytes
}
