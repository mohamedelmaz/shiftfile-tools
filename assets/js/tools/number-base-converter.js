/* ShiftFile Tools © 2026 — https://shiftfile.tools — All rights reserved. */

(function () {
  'use strict';

  function toBase(n, base) {
    base = base || 10;
    var chars = '0123456789abcdefghijklmnopqrstuvwxyz';
    if (base < 2 || base > chars.length) return '';
    n = parseInt(n, 10);
    if (isNaN(n)) return '';
    var result = '';
    var sign = n < 0 ? '-' : '';
    n = Math.abs(n);
    while (n >= base) { result = chars[n % base] + result; n = Math.floor(n / base); }
    return sign + chars[n] + result;
  }

  function fromBase(str, base) {
    base = parseInt(base, 10);
    var chars = '0123456789abcdefghijklmnopqrstuvwxyz';
    str = String(str).toLowerCase().replace(/[^0-9a-z]/g, '');
    if (str.length === 0) return NaN;
    var result = 0;
    for (var i = 0; i < str.length; i++) {
      var val = chars.indexOf(str[i]);
      if (val === -1 || val >= base) return NaN;
      result = result * base + val;
    }
    return result;
  }

  function init() {
    var bin = document.getElementById('bin');
    var oct = document.getElementById('oct');
    var dec = document.getElementById('dec');
    var hex = document.getElementById('hex');

    function sync(source) {
      var val = source.value.trim();
      if (!val) return;
      var n;
      if (source === bin) n = fromBase(val, 2);
      else if (source === oct) n = fromBase(val, 8);
      else if (source === hex) n = fromBase(val, 16);
      else n = parseInt(val, 10);
      if (isNaN(n)) return;
      if (bin) bin.value = toBase(n, 2);
      if (oct) oct.value = toBase(n, 8);
      if (dec) dec.value = String(n);
      if (hex) hex.value = toBase(n, 16).toUpperCase();
    }

    [bin, oct, dec, hex].forEach(function (el) { el?.addEventListener('input', function () { sync(el); }); });
  }

  init();
})();
