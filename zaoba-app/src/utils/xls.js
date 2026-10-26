// 旧版 .xls（Excel 97-2003）读取：OLE2 复合文档 + BIFF8 记录。
// 只取单元格文本，不处理格式、公式计算和加密；无第三方依赖，App WebView / Node 都能跑。

const CFB_SIGNATURE = [0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1]

const END_OF_CHAIN = 0xfffffffe
const FREESECT = 0xffffffff

function viewOf(bytes) {
  return new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength)
}

export function parseXls(input) {
  const bytes = input instanceof Uint8Array ? input : new Uint8Array(input)
  if (bytes.length >= 4 && bytes[0] === 0x50 && bytes[1] === 0x4b && bytes[2] === 0x03 && bytes[3] === 0x04) {
    throw new Error('这是 .xlsx 文件，请在 Excel/WPS 里另存为「Excel 97-2003 工作簿 (*.xls)」再导入')
  }
  for (let i = 0; i < CFB_SIGNATURE.length; i++) {
    if (bytes[i] !== CFB_SIGNATURE[i]) throw new Error('不是 Excel 97-2003 (.xls) 文件')
  }
  return parseBiff(readWorkbookStream(bytes))
}

// ---------- OLE2 复合文档 ----------

function readWorkbookStream(bytes) {
  const dv = viewOf(bytes)
  const sectorSize = 1 << dv.getUint16(0x1e, true)
  const miniSectorSize = 1 << dv.getUint16(0x20, true)
  const fatSectorCount = dv.getUint32(0x2c, true)
  const firstDirSector = dv.getUint32(0x30, true)
  const miniCutoff = dv.getUint32(0x38, true)
  const firstMiniFatSector = dv.getUint32(0x3c, true)
  const miniFatSectorCount = dv.getUint32(0x40, true)
  const firstDifatSector = dv.getUint32(0x44, true)
  const difatSectorCount = dv.getUint32(0x48, true)

  const sectorOffset = (sid) => (sid + 1) * sectorSize

  const difat = []
  for (let i = 0; i < 109; i++) difat.push(dv.getUint32(0x4c + i * 4, true))
  let difatSector = firstDifatSector
  const difatPerSector = sectorSize / 4 - 1
  for (let n = 0; n < difatSectorCount && difatSector < END_OF_CHAIN; n++) {
    const off = sectorOffset(difatSector)
    for (let i = 0; i < difatPerSector; i++) difat.push(dv.getUint32(off + i * 4, true))
    difatSector = dv.getUint32(off + difatPerSector * 4, true)
  }

  const fat = []
  for (let i = 0; i < fatSectorCount; i++) {
    const sid = difat[i]
    if (sid === undefined || sid >= END_OF_CHAIN) continue
    const off = sectorOffset(sid)
    for (let j = 0; j < sectorSize / 4; j++) fat.push(dv.getUint32(off + j * 4, true))
  }

  function chainOf(start, table, free) {
    const ids = []
    const seen = new Set()
    let sid = start
    while (sid !== END_OF_CHAIN && sid !== free && sid < table.length && !seen.has(sid)) {
      seen.add(sid)
      ids.push(sid)
      sid = table[sid]
    }
    return ids
  }

  function readChain(start, size, table, free, stride) {
    const ids = chainOf(start, table, free)
    const buf = new Uint8Array(ids.length * stride)
    for (let i = 0; i < ids.length; i++) {
      const from = sectorOffset(ids[i])
      buf.set(bytes.subarray(from, from + stride), i * stride)
    }
    return size == null ? buf : buf.subarray(0, Math.min(size, buf.length))
  }

  const dirBytes = readChain(firstDirSector, null, fat, FREESECT, sectorSize)
  const dirView = viewOf(dirBytes)
  const entries = []
  for (let off = 0; off + 128 <= dirBytes.length; off += 128) {
    const type = dirBytes[off + 0x42]
    if (type !== 1 && type !== 2 && type !== 5) continue
    const nameLen = Math.max(0, dirView.getUint16(off + 0x40, true) - 2)
    let name = ''
    for (let i = 0; i < nameLen; i += 2) {
      name += String.fromCharCode(dirView.getUint16(off + i, true))
    }
    entries.push({
      name,
      type,
      start: dirView.getUint32(off + 0x74, true),
      size: dirView.getUint32(off + 0x78, true)
    })
  }

  const root = entries.find((e) => e.type === 5)
  const workbook = entries.find((e) => e.type === 2 && (e.name === 'Workbook' || e.name === 'Book'))
  if (!workbook) throw new Error('文件里没有 Excel 工作簿数据')
  if (!root) throw new Error('文件结构损坏')

  if (workbook.size >= miniCutoff) {
    return readChain(workbook.start, workbook.size, fat, FREESECT, sectorSize)
  }

  const miniFatBytes = readChain(firstMiniFatSector, null, fat, FREESECT, sectorSize)
  const miniFatView = viewOf(miniFatBytes)
  const miniFat = []
  for (let i = 0; i + 4 <= miniFatBytes.length; i += 4) miniFat.push(miniFatView.getUint32(i, true))

  const miniStream = readChain(root.start, root.size, fat, FREESECT, sectorSize)
  const ids = chainOf(workbook.start, miniFat, FREESECT)
  const miniBuf = new Uint8Array(ids.length * miniSectorSize)
  for (let i = 0; i < ids.length; i++) {
    const from = ids[i] * miniSectorSize
    miniBuf.set(miniStream.subarray(from, from + miniSectorSize), i * miniSectorSize)
  }
  return miniBuf.subarray(0, Math.min(workbook.size, miniBuf.length))
}

// ---------- BIFF8 记录 ----------

function parseBiff(data) {
  const dv = viewOf(data)
  const records = []
  let off = 0
  while (off + 4 <= data.length) {
    const type = dv.getUint16(off, true)
    const len = dv.getUint16(off + 2, true)
    if (off + 4 + len > data.length) break
    records.push({ type, start: off + 4, len })
    off += 4 + len
  }

  const sheets = []
  const boundsheets = []
  const sst = []
  let current = null

  for (let i = 0; i < records.length; i++) {
    const rec = records[i]

    if (rec.type === 0x0809) {
      const version = dv.getUint16(rec.start, true)
      if (version !== 0x0600) throw new Error('只支持 Excel 97-2003 格式（BIFF8）')
      const substream = dv.getUint16(rec.start + 2, true)
      if (substream === 0x0010) {
        current = { name: boundsheets[sheets.length] || `Sheet${sheets.length + 1}`, rows: [] }
        sheets.push(current)
      }
      continue
    }

    if (rec.type === 0x000a) {
      current = null
      continue
    }

    if (rec.type === 0x0085) {
      boundsheets.push(readShortString(data, rec.start + 6))
      continue
    }

    if (rec.type === 0x00fc) {
      parseSst(records, i, data, sst)
      continue
    }

    if (!current) continue

    if (rec.type === 0x00fd) {
      const row = dv.getUint16(rec.start, true)
      const col = dv.getUint16(rec.start + 2, true)
      const isst = dv.getUint32(rec.start + 6, true)
      setCell(current, row, col, sst[isst] || '')
    } else if (rec.type === 0x0204) {
      const row = dv.getUint16(rec.start, true)
      const col = dv.getUint16(rec.start + 2, true)
      setCell(current, row, col, readUnicodeString(data, rec.start + 6))
    } else if (rec.type === 0x0203) {
      const row = dv.getUint16(rec.start, true)
      const col = dv.getUint16(rec.start + 2, true)
      setCell(current, row, col, formatNumber(dv.getFloat64(rec.start + 6, true)))
    } else if (rec.type === 0x027e) {
      const row = dv.getUint16(rec.start, true)
      const col = dv.getUint16(rec.start + 2, true)
      setCell(current, row, col, formatNumber(decodeRk(dv.getUint32(rec.start + 6, true))))
    } else if (rec.type === 0x00bd) {
      const row = dv.getUint16(rec.start, true)
      const firstCol = dv.getUint16(rec.start + 2, true)
      const count = Math.floor((rec.len - 6) / 6)
      for (let k = 0; k < count; k++) {
        const rk = dv.getUint32(rec.start + 4 + k * 6 + 2, true)
        setCell(current, row, firstCol + k, formatNumber(decodeRk(rk)))
      }
    } else if (rec.type === 0x0006) {
      const row = dv.getUint16(rec.start, true)
      const col = dv.getUint16(rec.start + 2, true)
      if (dv.getUint16(rec.start + 12, true) !== 0xffff) {
        setCell(current, row, col, formatNumber(dv.getFloat64(rec.start + 6, true)))
      }
    }
  }

  return {
    sheets: sheets.map((sheet) => ({
      name: sheet.name,
      rows: sheet.rows.map((row) => Array.from(row || [], (v) => (v == null ? '' : String(v))))
    }))
  }
}

function setCell(sheet, row, col, value) {
  if (!sheet.rows[row]) sheet.rows[row] = []
  sheet.rows[row][col] = value
}

function decodeRk(rk) {
  let value
  if (rk & 0x02) {
    value = (rk >> 2) | 0
  } else {
    const buf = new ArrayBuffer(8)
    const dv = new DataView(buf)
    dv.setUint32(4, rk & 0xfffffffc, true)
    value = dv.getFloat64(0, true)
  }
  return rk & 0x01 ? value / 100 : value
}

function formatNumber(n) {
  if (!Number.isFinite(n)) return ''
  return Number.isInteger(n) ? String(n) : String(Math.round(n * 1e6) / 1e6)
}

function readShortString(data, off) {
  const dv = viewOf(data)
  const cch = data[off]
  const high = data[off + 1] & 0x01
  let p = off + 2
  let s = ''
  for (let i = 0; i < cch; i++) {
    if (high) {
      s += String.fromCharCode(dv.getUint16(p, true))
      p += 2
    } else {
      s += String.fromCharCode(data[p])
      p += 1
    }
  }
  return s
}

function readUnicodeString(data, off) {
  const dv = viewOf(data)
  const cch = dv.getUint16(off, true)
  const high = data[off + 2] & 0x01
  let p = off + 3
  let s = ''
  for (let i = 0; i < cch; i++) {
    if (high) {
      s += String.fromCharCode(dv.getUint16(p, true))
      p += 2
    } else {
      s += String.fromCharCode(data[p])
      p += 1
    }
  }
  return s
}

// SST 后面可能跟若干个 CONTINUE 记录；字符串本身也可能被切在两条记录之间，
// 切过去后的第一个字节是新的「是否双字节」标志。
function parseSst(records, index, data, out) {
  const chunks = [data.subarray(records[index].start, records[index].start + records[index].len)]
  let j = index + 1
  while (j < records.length && records[j].type === 0x003c) {
    chunks.push(data.subarray(records[j].start, records[j].start + records[j].len))
    j++
  }

  let ci = 0
  let pos = 0

  function ensure() {
    while (ci < chunks.length && pos >= chunks[ci].length) {
      ci++
      pos = 0
    }
    if (ci >= chunks.length) throw new Error('共享字符串表损坏')
  }

  function u8() {
    ensure()
    return chunks[ci][pos++]
  }

  function u16() {
    const low = u8()
    const high = u8()
    return low | (high << 8)
  }

  function u32() {
    return (u16() | (u16() << 16)) >>> 0
  }

  function skip(n) {
    while (n > 0) {
      ensure()
      const take = Math.min(n, chunks[ci].length - pos)
      pos += take
      n -= take
    }
  }

  u32()
  const unique = u32()

  for (let k = 0; k < unique; k++) {
    const cch = u16()
    const grbit = u8()
    const rich = grbit & 0x08
    const ext = grbit & 0x04
    const runs = rich ? u16() : 0
    const extBytes = ext ? u32() : 0

    let high = grbit & 0x01
    let text = ''
    for (let i = 0; i < cch; i++) {
      if (pos >= chunks[ci].length) {
        ci++
        pos = 0
        if (ci >= chunks.length) break
        high = chunks[ci][pos++] & 0x01
      }
      if (high) {
        const low = chunks[ci][pos]
        const highByte = chunks[ci][pos + 1] || 0
        pos += 2
        text += String.fromCharCode(low | (highByte << 8))
      } else {
        text += String.fromCharCode(chunks[ci][pos])
        pos += 1
      }
    }

    skip(runs * 4)
    skip(extBytes)
    out.push(text)
  }
}
