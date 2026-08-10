/* ShiftFile Tools © 2026 — https://shiftfile.tools — All rights reserved. */

(function () {
  'use strict';
  var state = { file: null, originalBlob: null };

  function detectWebP() {
    var c = document.createElement('canvas');
    c.width = 1; c.height = 1;
    return c.toDataURL('image/webp').indexOf('data:image/webp') === 0;
  }

  function formatSize(bytes) {
    if (bytes === 0) return '0 B';
    var k = 1024, sizes = ['B', 'KB', 'MB', 'GB'];
    var i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  function dataUrlToBlob(dataUrl) {
    var parts = dataUrl.split(',');
    var mime = parts[0].match(/:(.*?);/)[1];
    var b64 = atob(parts[1]);
    var arr = new Uint8Array(b64.length);
    for (var i = 0; i < b64.length; i++) arr[i] = b64.charCodeAt(i);
    return new Blob([arr], { type: mime });
  }

  function init() {
    if (!detectWebP()) {
      var opt = document.querySelector('option[value="webp"]');
      if (opt) opt.disabled = true;
    }
    var input = document.getElementById('fileInput');
    var drop = document.getElementById('dropZone');
    if (drop && input) {
      drop.addEventListener('click', function () { input.click(); });
      drop.addEventListener('dragover', function (e) { e.preventDefault(); drop.classList.add('dragover'); });
      drop.addEventListener('dragleave', function () { drop.classList.remove('dragover'); });
      drop.addEventListener('drop', function (e) {
        e.preventDefault(); drop.classList.remove('dragover');
        if (e.dataTransfer.files.length) { input.files = e.dataTransfer.files; handleFile(e.dataTransfer.files[0]); }
      });
      input.addEventListener('change', function () { if (input.files.length) handleFile(input.files[0]); });
    }
  }

  function handleFile(file) {
    state.file = file;
    state.originalBlob = file;
    var reader = new FileReader();
    reader.onload = function () {
      var img = new Image();
      img.onload = function () {
        var preview = document.getElementById('preview');
        if (preview) { preview.innerHTML = '<img src="' + img.src + '" alt="preview"><div class="meta">' + img.naturalWidth + '×' + img.naturalHeight + ' · ' + formatSize(file.size) + '</div>'; }
        document.getElementById('originalSize')?.textContent && (document.getElementById('originalSize').textContent = formatSize(file.size));
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  }

  document.getElementById('convertBtn')?.addEventListener('click', function () {
    if (!state.file) return;
    var q = parseFloat(document.getElementById('quality').value) / 100;
    var fmt = document.getElementById('format').value;
    var reader = new FileReader();
    reader.onload = function () {
      var img = new Image();
      img.onload = function () {
        var canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth; canvas.height = img.naturalHeight;
        var ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        var dataUrl = canvas.toDataURL('image/png');
        if (typeof signPngDataUrl === 'function' && fmt === 'png') dataUrl = signPngDataUrl(dataUrl);
        var blob = dataUrlToBlob(dataUrl);
        var url = URL.createObjectURL(blob);
        var a = document.createElement('a'); a.href = url; a.download = 'converted.' + fmt; a.click();
        if (document.getElementById('newSize')) document.getElementById('newSize').textContent = formatSize(blob.size);
        if (document.getElementById('savings')) {
          var s = ((state.originalBlob.size - blob.size) / state.originalBlob.size * 100).toFixed(1);
          document.getElementById('savings').textContent = s + '%';
        }
        URL.revokeObjectURL(url);
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(state.file);
  });

  init();
})();
