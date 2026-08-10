/* ShiftFile Tools © 2026 — https://shiftfile.tools — All rights reserved. */

(function () {
  'use strict';

  function slugify(text, maxLen) {
    var map = { 'à':'a','á':'a','â':'a','ã':'a','ä':'a','å':'a','æ':'a','ç':'c','è':'e','é':'e','ê':'e','ë':'e','ì':'i','í':'i','î':'i','ï':'i','ð':'d','ñ':'n','ò':'o','ó':'o','ô':'o','õ':'o','ö':'o','ø':'o','ù':'u','ú':'u','û':'u','ü':'u','ý':'y','þ':'th','ÿ':'y','ß':'ss','œ':'oe','æ':'ae' };
    var result = '';
    for (var i = 0; i < text.length; i++) {
      var ch = text[i].toLowerCase();
      if (ch in map) ch = map[ch];
      if (/[a-z0-9]/.test(ch)) result += ch;
      else if (result.length && result[result.length-1] !== '-') result += '-';
    }
    result = result.replace(/-+/g, '-').replace(/^-+|-+$/g, '');
    if (maxLen && result.length > maxLen) result = result.slice(0, maxLen).replace(/-+$/g, '');
    return result;
  }

  function init() {
    var input = document.getElementById('input');
    var output = document.getElementById('output');
    var maxInput = document.getElementById('maxLen');

    input?.addEventListener('input', function () {
      var max = maxInput?.value ? parseInt(maxInput.value, 10) : null;
      if (output) output.value = slugify(input.value || '', max);
    });

    document.getElementById('copyBtn')?.addEventListener('click', function () {
      if (output?.value) navigator.clipboard?.writeText(output.value);
    });
  }

  init();
})();
