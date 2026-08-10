function crc32(buf) {
  var table = new Uint32Array(256);
  for (var n = 0; n < 256; n++) {
    var c = n;
    for (var k = 0; k < 8; k++) { if (c & 1) c = 0xedb88320 ^ (c >>> 1); else c = c >>> 1; }
    table[n] = c;
  }
  var crc = 0 ^ (-1);
  for (var i = 0; i < buf.length; i++) { crc = table[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8); }
  return (crc ^ (-1)) >>> 0;
}

function makeChunk(type, data) {
  var typeBytes = new Uint8Array(type.split('').map(function (c) { return c.charCodeAt(0); }));
  var buf = new Uint8Array(typeBytes.length + data.length);
  buf.set(typeBytes);
  buf.set(data, typeBytes.length);
  var crc = crc32(buf);
  var len = new Uint8Array(4);
  var dv = new DataView(len.buffer);
  dv.setUint32(0, data.length, false);
  var crcBytes = new Uint8Array(4);
  new DataView(crcBytes.buffer).setUint32(0, crc, false);
  var chunk = new Uint8Array(4 + typeBytes.length + data.length + 4);
  chunk.set(len, 0);
  chunk.set(typeBytes, 4);
  chunk.set(data, 8);
  chunk.set(crcBytes, 8 + typeBytes.length + data.length);
  return chunk;
}

function signPngDataUrl(dataUrl) {
  try {
    var base64 = dataUrl.replace(/^data:image\/png;base64,/, '');
    var binary = atob(base64);
    var bytes = new Uint8Array(binary.length);
    for (var i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);

    if (bytes.length < 8) return dataUrl;
    if (bytes[0] !== 0x89 || bytes[1] !== 0x50 || bytes[2] !== 0x4E || bytes[3] !== 0x47) return dataUrl;

    var offset = 8;
    var foundIHDR = false;
    var ihdrEnd = 0;

    while (offset < bytes.length) {
      var len = (bytes[offset] << 24) | (bytes[offset+1] << 16) | (bytes[offset+2] << 8) | bytes[offset+3];
      var type = String.fromCharCode(bytes[offset+4], bytes[offset+5], bytes[offset+6], bytes[offset+7]);
      if (type === 'IHDR') {
        foundIHDR = true;
        ihdrEnd = offset + 8 + len + 4;
        break;
      }
      offset += 12 + len;
    }

    if (!foundIHDR) return dataUrl;

    var keyword = 'Copyright';
    var text = 'ShiftFile Tools - https://shiftfile.tools - Free in-browser file conversion';
    var textBytes = new Uint8Array(keyword.length + 1 + text.length);
    for (var j = 0; j < keyword.length; j++) textBytes[j] = keyword.charCodeAt(j);
    textBytes[keyword.length] = 0;
    for (var k = 0; k < text.length; k++) textBytes[keyword.length + 1 + k] = text.charCodeAt(k);

    var tEXtChunk = makeChunk('tEXt', textBytes);
    console.log('tEXtChunk length:', tEXtChunk.length);
    console.log('bytes.length:', bytes.length);
    console.log('ihdrEnd:', ihdrEnd);
    var totalLen = bytes.length + tEXtChunk.length;
    console.log('totalLen:', totalLen);
    var out = new Uint8Array(totalLen);
    out.set(bytes.subarray(0, ihdrEnd), 0);
    out.set(tEXtChunk, ihdrEnd);
    out.set(bytes.subarray(ihdrEnd), ihdrEnd + tEXtChunk.length);

    var outBase64 = '';
    for (var m = 0; m < out.length; m++) outBase64 += String.fromCharCode(out[m]);
    return 'data:image/png;base64,' + btoa(outBase64);
  } catch (e) {
    console.log('ERROR:', e.message);
    return dataUrl;
  }
}

var base64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==';
var dataUrl = 'data:image/png;base64,' + base64;
console.log('Input length:', dataUrl.length);
var signed = signPngDataUrl(dataUrl);
console.log('Signed length:', signed.length);
