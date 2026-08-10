/* ShiftFile Tools © 2026 — https://shiftfile.tools — All rights reserved. */

(function () {
  'use strict';
  var state = { file: null, aspect: 1 };

  function formatSize(bytes) {
    if (bytes === 0) return '0 B';
    var k = 1024, sizes = ['B', 'KB', 'MB'];
    var i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  function init() {
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
    document.getElementById('lockRatio')?.addEventListener('change', function (e) { updateLock(e.target.checked); });
  }

  function updateLock(locked) {
    var w = document.getElementById('widthInput');
    var h = document.getElementById('heightInput');
    if (locked && w && h && state.aspect) {
      w.addEventListener('input', function () { if (locked) h.value = Math.round(w.value / state.aspect); });
      h.addEventListener('input', function () { if (locked) w.value = Math.round(h.value * state.aspect); });
    }
  }

  function handleFile(file) {
    state.file = file;
    var reader = new FileReader();
    reader.onload = function () {
      var img = new Image();
      img.onload = function () {
        state.aspect = img.naturalWidth / img.naturalHeight;
        var w = document.getElementById('widthInput');
        var h = document.getElementById('heightInput');
        if (w) w.value = img.naturalWidth;
        if (h) h.value = img.naturalHeight;
        var prev = document.getElementById('preview');
        if (prev) prev.innerHTML = '<img src="' + img.src + '" alt="preview"><div class="meta">' + img.naturalWidth + '×' + img.naturalHeight + ' · ' + formatSize(file.size) + '</div>';
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  }

  document.getElementById('resizeBtn')?.addEventListener('click', function () {
    if (!state.file) return;
    var w = parseInt(document.getElementById('widthInput').value, 10);
    var h = parseInt(document.getElementById('heightInput').value, 10);
    var reader = new FileReader();
    reader.onload = function () {
      var img = new Image();
      img.onload = function () {
        var canvas = document.createElement('canvas');
        canvas.width = w; canvas.height = h;
        var ctx = canvas.getContext('2d');
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, w, h);
        canvas.toBlob(function (blob) {
          var url = URL.createObjectURL(blob);
          var a = document.createElement('a'); a.href = url; a.download = 'resized.png'; a.click();
          if (document.getElementById('newSize')) document.getElementById('newSize').textContent = w + '×' + h;
          URL.revokeObjectURL(url);
        }, 'image/png');
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(state.file);
  });

  init();
})();
