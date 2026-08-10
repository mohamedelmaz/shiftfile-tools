/* ShiftFile Tools © 2026 — https://shiftfile.tools — All rights reserved. */

(function () {
  'use strict';
  var files = [];

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
    files.push(file);
    renderList();
  }

  function renderList() {
    var el = document.getElementById('fileList');
    if (!el) return;
    el.innerHTML = files.map(function (f) { return '<div class="preview-item"><div class="meta">' + f.name + '</div></div>'; }).join('');
  }

  document.getElementById('generateBtn')?.addEventListener('click', function () {
    if (!files.length) return;
    if (typeof window.jspdf === 'undefined') { alert('PDF library is still loading. Please wait a moment and try again.'); return; }
    var doc = new window.jspdf.jsPDF({ unit: 'mm', format: 'a4' });
    var pageW = 210, pageH = 297, margin = 10;
    var imgW = pageW - margin * 2, imgH = pageH - margin * 2;

    files.forEach(function (file, idx) {
      var reader = new FileReader();
      reader.onload = function () {
        var img = new Image();
        img.onload = function () {
          var ratio = Math.min(imgW / img.width, imgH / img.height);
          var w = img.width * ratio, h = img.height * ratio;
          var x = (pageW - w) / 2, y = (pageH - h) / 2;
          if (idx > 0) doc.addPage();
          doc.addImage(img, 'JPEG', x, y, w, h);
          if (idx === files.length - 1) {
            doc.save('merged.pdf');
          }
        };
        img.src = reader.result;
      };
      reader.readAsDataURL(file);
    });
  });

  init();
})();
