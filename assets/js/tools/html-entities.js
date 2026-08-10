/* ShiftFile Tools © 2026 — https://shiftfile.tools — All rights reserved. */

(function () {
  'use strict';

  function escapeEntities(text) {
    return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
  }

  function unescapeEntities(text) {
    var map = { '&amp;': '&', '&lt;': '<', '&gt;': '>', '&quot;': '"', '&#039;': "'", '&#39;': "'" };
    text = text.replace(/&(#x?[0-9a-fA-F]+);/g, function (m, n) {
      var code = n.startsWith('#x') ? parseInt(n.slice(2), 16) : parseInt(n.slice(1), 10);
      return String.fromCharCode(code);
    });
    return text.replace(/&(amp|lt|gt|quot|#039|#39);/g, function (m) { return map[m] || m; });
  }

  function init() {
    var input = document.getElementById('input');
    var output = document.getElementById('output');
    document.getElementById('escapeBtn')?.addEventListener('click', function () { if (output) output.value = escapeEntities(input?.value || ''); });
    document.getElementById('unescapeBtn')?.addEventListener('click', function () { if (output) output.value = unescapeEntities(input?.value || ''); });
    document.getElementById('copyBtn')?.addEventListener('click', function () { if (output?.value) navigator.clipboard?.writeText(output.value); });
  }

  init();
})();
