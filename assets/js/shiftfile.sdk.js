/* ShiftFile Tools © 2026 — https://shiftfile.tools — All rights reserved. */

var ShiftFile = (function () {
  'use strict';

  function readFile(file) {
    return new Promise(function (resolve, reject) {
      var reader = new FileReader();
      reader.onload = function () { resolve(reader.result); };
      reader.onerror = function () { reject(reader.error); };
      reader.readAsDataURL(file);
    });
  }

  function dataUrlToBlob(dataUrl) {
    var parts = dataUrl.split(',');
    var mime = parts[0].match(/:(.*?);/)[1];
    var b64 = atob(parts[1]);
    var arr = new Uint8Array(b64.length);
    for (var i = 0; i < b64.length; i++) arr[i] = b64.charCodeAt(i);
    return new Blob([arr], { type: mime });
  }

  function loadImage(src) {
    return new Promise(function (resolve, reject) {
      var img = new Image();
      img.onload = function () { resolve(img); };
      img.onerror = function () { reject(new Error('Image load failed')); };
      img.src = src;
    });
  }

  function canvasToBlob(canvas, type, quality) {
    return new Promise(function (resolve) {
      canvas.toBlob(function (blob) { resolve(blob); }, type, quality);
    });
  }

  function convertImage(file, format, quality) {
    return readFile(file).then(function (dataUrl) {
      return loadImage(dataUrl).then(function (img) {
        var canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        var ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        var mime = 'image/' + format;
        if (format === 'jpg') mime = 'image/jpeg';
        return canvasToBlob(canvas, mime, quality);
      });
    });
  }

  function compressImage(file, quality) {
    return convertImage(file, 'webp', quality);
  }

  function resizeImage(file, width, height, smoothing) {
    return readFile(file).then(function (dataUrl) {
      return loadImage(dataUrl).then(function (img) {
        var canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        var ctx = canvas.getContext('2d');
        if (smoothing) { ctx.imageSmoothingEnabled = true; ctx.imageSmoothingQuality = 'high'; }
        ctx.drawImage(img, 0, 0, width, height);
        return canvasToBlob(canvas, 'image/png');
      });
    });
  }

  function jsonToCsv(json) {
    if (typeof json === 'string') json = JSON.parse(json);
    if (!Array.isArray(json) || json.length === 0) return '';
    var keys = Object.keys(json[0]);
    var rows = [keys.join(',')];
    json.forEach(function (row) {
      rows.push(keys.map(function (k) {
        var val = String(row[k] != null ? row[k] : '');
        if (val.indexOf(',') !== -1 || val.indexOf('"') !== -1 || val.indexOf('\n') !== -1) {
          val = '"' + val.replace(/"/g, '""') + '"';
        }
        return val;
      }).join(','));
    });
    return rows.join('\n');
  }

  function csvToJson(csv) {
    var lines = csv.replace(/\r\n/g, '\n').replace(/\r/g, '\n').split('\n').filter(function (l) { return l.trim(); });
    if (lines.length < 1) return [];
    var headers = parseCsvLine(lines[0]);
    var result = [];
    for (var i = 1; i < lines.length; i++) {
      var values = parseCsvLine(lines[i]);
      var obj = {};
      headers.forEach(function (h, idx) { obj[h] = values[idx]; });
      result.push(obj);
    }
    return result;
  }

  function parseCsvLine(line) {
    var result = []; var current = ''; var inQuotes = false;
    for (var i = 0; i < line.length; i++) {
      var ch = line[i];
      if (inQuotes) {
        if (ch === '"') { if (line[i+1] === '"') { current += '"'; i++; } else { inQuotes = false; } }
        else { current += ch; }
      } else {
        if (ch === '"') { inQuotes = true; }
        else if (ch === ',') { result.push(current); current = ''; }
        else { current += ch; }
      }
    }
    result.push(current);
    return result;
  }

  function markdownToHtml(md) {
    var html = md.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    html = html.replace(/^###### (.*$)/gim, '<h6>$1</h6>');
    html = html.replace(/^##### (.*$)/gim, '<h5>$1</h5>');
    html = html.replace(/^#### (.*$)/gim, '<h4>$1</h4>');
    html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
    html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
    html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
    html = html.replace(/`([^`]+)`/g, '<code>$1</code>');
    html = html.replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>');
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
    html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img alt="$1" src="$2">');
    html = html.replace(/^\> (.*$)/gim, '<blockquote>$1</blockquote>');
    html = html.replace(/^---$/gim, '<hr>');
    html = html.replace(/^\d+\. (.*$)/gim, '<li>$1</li>');
    html = html.replace(/^\- (.*$)/gim, '<li>$1</li>');
    html = html.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>');
    html = html.replace(/^(?!<[hlu])[^\n]+\n(?!<)/g, function (p) { return p.trim() ? '<p>' + p + '</p>' : p; });
    return html;
  }

  function htmlToMarkdown(html) {
    var md = html.replace(/<h1[^>]*>(.*?)<\/h1>/gi, '# $1\n');
    md = md.replace(/<h2[^>]*>(.*?)<\/h2>/gi, '## $1\n');
    md = md.replace(/<h3[^>]*>(.*?)<\/h3>/gi, '### $1\n');
    md = md.replace(/<strong[^>]*>(.*?)<\/strong>/gi, '**$1**');
    md = md.replace(/<b[^>]*>(.*?)<\/b>/gi, '**$1**');
    md = md.replace(/<em[^>]*>(.*?)<\/em>/gi, '*$1*');
    md = md.replace(/<i[^>]*>(.*?)<\/i>/gi, '*$1*');
    md = md.replace(/<code[^>]*>(.*?)<\/code>/gi, '`$1`');
    md = md.replace(/<a[^>]*href="([^"]*)"[^>]*>(.*?)<\/a>/gi, '[$2]($1)');
    md = md.replace(/<[^>]+>/g, '');
    return md;
  }

  function base64EncodeText(text) {
    return btoa(unescape(encodeURIComponent(text)));
  }

  function base64DecodeText(b64) {
    return decodeURIComponent(escape(atob(b64)));
  }

  function slugify(text) {
    return text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/[\s_]+/g, '-').replace(/^-+|-+$/g, '');
  }

  function hexToRgb(hex) {
    hex = hex.replace('#', '');
    if (hex.length === 3) hex = hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2];
    var r = parseInt(hex.substring(0,2), 16);
    var g = parseInt(hex.substring(2,4), 16);
    var b = parseInt(hex.substring(4,6), 16);
    return 'rgb(' + r + ', ' + g + ', ' + b + ')';
  }

  function rgbToHsl(r, g, b) {
    r /= 255; g /= 255; b /= 255;
    var max = Math.max(r, g, b), min = Math.min(r, g, b);
    var h, s, l = (max + min) / 2;
    if (max === min) { h = s = 0; }
    else {
      var d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }
    return 'hsl(' + Math.round(h * 360) + ', ' + Math.round(s * 100) + '%, ' + Math.round(l * 100) + '%)';
  }

  function toBase(n, base) {
    base = base || 10;
    var chars = '0123456789abcdefghijklmnopqrstuvwxyz';
    if (base < 2 || base > chars.length) throw new Error('Unsupported base');
    n = parseInt(n, 10);
    if (isNaN(n)) return '';
    var result = '';
    var sign = n < 0 ? '-' : '';
    n = Math.abs(n);
    while (n >= base) { result = chars[n % base] + result; n = Math.floor(n / base); }
    result = chars[n] + result;
    return sign + result;
  }

  return {
    convertImage: convertImage,
    compressImage: compressImage,
    resizeImage: resizeImage,
    jsonToCsv: jsonToCsv,
    csvToJson: csvToJson,
    markdownToHtml: markdownToHtml,
    htmlToMarkdown: htmlToMarkdown,
    base64EncodeText: base64EncodeText,
    base64DecodeText: base64DecodeText,
    slugify: slugify,
    hexToRgb: hexToRgb,
    rgbToHsl: rgbToHsl,
    toBase: toBase
  };
})();
