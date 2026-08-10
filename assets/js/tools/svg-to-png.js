/* ShiftFile Tools © 2026 — https://shiftfile.tools — All rights reserved. */

(function () {
  'use strict';

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
  }

  function handleFile(file) {
    var reader = new FileReader();
    reader.onload = function () {
      var text = reader.result;
      var encoded = encodeURIComponent(text);
      var dataUrl = 'data:image/svg+xml;charset=utf-8,' + encoded;
      var prev = document.getElementById('preview');
      if (prev) prev.innerHTML = '<img src="' + dataUrl + '" alt="svg preview">';
      state.svgData = text;
    };
    reader.readAsText(file);
  }

  document.getElementById('convertBtn')?.addEventListener('click', function () {
    if (!state.svgData) return;
    var scale = parseInt(document.getElementById('scale')?.value || '1', 10);
    var dataUrl = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(state.svgData);
    var img = new Image();
    img.onload = function () {
      var canvas = document.createElement('canvas');
      canvas.width = img.width * scale; canvas.height = img.height * scale;
      var ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      canvas.toBlob(function (blob) {
        var url = URL.createObjectURL(blob);
        var a = document.createElement('a'); a.href = url; a.download = 'svg.png'; a.click();
        URL.revokeObjectURL(url);
      }, 'image/png');
    };
    img.src = dataUrl;
  });

  init();
})();
