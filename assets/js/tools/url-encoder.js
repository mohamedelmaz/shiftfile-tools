/* ShiftFile Tools © 2026 — https://shiftfile.tools — All rights reserved. */

(function () {
  'use strict';
  var mode = 'component';

  function init() {
    var input = document.getElementById('urlInput');
    var output = document.getElementById('urlOutput');
    var modeRadios = document.querySelectorAll('input[name="urlMode"]');

    modeRadios.forEach(function (r) {
      r.addEventListener('change', function () { mode = r.value; process(); });
    });

    input?.addEventListener('input', process);

    document.getElementById('copyBtn')?.addEventListener('click', function () {
      if (output?.value) { navigator.clipboard?.writeText(output.value); }
    });
  }

  function process() {
    var input = document.getElementById('urlInput');
    var output = document.getElementById('urlOutput');
    if (!input || !output) return;
    var val = input.value;
    try {
      if (mode === 'component') output.value = encodeURIComponent(val);
      else output.value = encodeURI(val);
    } catch (e) { output.value = ''; }
  }

  init();
})();
