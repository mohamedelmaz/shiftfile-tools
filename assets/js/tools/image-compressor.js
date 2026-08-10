/* ShiftFile Tools © 2026 — https://shiftfile.tools — All rights reserved. */

(function () {
  'use strict';
  var files = [];

  function formatSize(bytes) {
    if (bytes === 0) return '0 B';
    var k = 1024, sizes = ['B', 'KB', 'MB', 'GB'];
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
        for (var i = 0; i < e.dataTransfer.files.length; i++) addFile(e.dataTransfer.files[i]);
      });
      input.addEventListener('change', function () { for (var i = 0; i < input.files.length; i++) addFile(input.files[i]); });
    }
  }

  function addFile(file) {
    files.push({ file: file, name: file.name, size: file.size });
    renderList();
  }

  function renderList() {
    var el = document.getElementById('fileList');
    if (!el) return;
    el.innerHTML = files.map(function (f) {
      return '<div class="preview-item"><div class="meta">' + f.name + '<br>' + formatSize(f.size) + '</div></div>';
    }).join('');
  }

  document.getElementById('compressBtn')?.addEventListener('click', function () {
    if (!files.length) return;
    var q = parseFloat(document.getElementById('quality').value) / 100;
    var fmt = document.getElementById('format').value || 'webp';
    var results = [], totalOrig = 0, totalNew = 0;
    var pending = files.length;

    files.forEach(function (f, idx) {
      totalOrig += f.size;
      var reader = new FileReader();
      reader.onload = function () {
        var img = new Image();
        img.onload = function () {
          var canvas = document.createElement('canvas');
          canvas.width = img.naturalWidth; canvas.height = img.naturalHeight;
          var ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0);
          var mime = fmt === 'jpg' ? 'image/jpeg' : 'image/webp';
          canvas.toBlob(function (blob) {
            results[idx] = { blob: blob, name: f.name.replace(/\.[^.]+$/, '') + '.' + fmt, orig: f.size };
            totalNew += blob.size;
            pending--;
            if (pending === 0) finish(results, totalOrig, totalNew);
          }, mime, q);
        };
        img.src = reader.result;
      };
      reader.readAsDataURL(f.file);
    });
  });

  function finish(results, totalOrig, totalNew) {
    var savings = ((totalOrig - totalNew) / totalOrig * 100).toFixed(1);
    var el = document.getElementById('result');
    if (el) {
      el.classList.remove('hidden');
      el.innerHTML = '<p><strong>Total savings:</strong> ' + savings + '% (' + formatSize(totalOrig) + ' → ' + formatSize(totalNew) + ')</p>' +
        results.map(function (r) {
          var url = URL.createObjectURL(r.blob);
          return '<a href="' + url + '" download="' + r.name + '">Download ' + r.name + '</a>';
        }).join('<br>');
    }
  }

  init();
})();
