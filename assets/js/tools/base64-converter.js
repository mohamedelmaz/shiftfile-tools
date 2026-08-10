/* ShiftFile Tools © 2026 — https://shiftfile.tools — All rights reserved. */

(function () {
  'use strict';

  function init() {
    var textInput = document.getElementById('textInput');
    var b64Input = document.getElementById('b64Input');
    var drop = document.getElementById('dropZone');

    document.getElementById('textToB64Btn')?.addEventListener('click', function () {
      var out = btoa(unescape(encodeURIComponent(textInput?.value || '')));
      if (b64Input) b64Input.value = out;
    });

    document.getElementById('b64ToTextBtn')?.addEventListener('click', function () {
      try { if (b64Input) textInput.value = decodeURIComponent(escape(atob(b64Input.value || ''))); }
      catch (e) { if (b64Input) textInput.value = ''; }
    });

    if (drop) {
      drop.addEventListener('dragover', function (e) { e.preventDefault(); drop.classList.add('dragover'); });
      drop.addEventListener('dragleave', function () { drop.classList.remove('dragover'); });
      drop.addEventListener('drop', function (e) {
        e.preventDefault(); drop.classList.remove('dragover');
        var file = e.dataTransfer.files[0]; if (!file) return;
        var reader = new FileReader();
        reader.onload = function () {
          var base64 = reader.result.replace(/^data:[^;]+;base64,/, '');
          if (b64Input) b64Input.value = base64;
          document.getElementById('fileName')?.textContent && (document.getElementById('fileName').textContent = file.name);
        };
        reader.readAsDataURL(file);
      });
    }

    document.getElementById('downloadBtn')?.addEventListener('click', function () {
      var b64 = b64Input?.value || '';
      if (!b64) return;
      var binary = atob(b64);
      var bytes = new Uint8Array(binary.length);
      for (var i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
      var blob = new Blob([bytes], { type: 'application/octet-stream' });
      var url = URL.createObjectURL(blob);
      var a = document.createElement('a'); a.href = url; a.download = 'decoded'; a.click();
      URL.revokeObjectURL(url);
    });
  }

  init();
})();
