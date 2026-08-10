/* ShiftFile Tools © 2026 — https://shiftfile.tools — All rights reserved. */

(function () {
  'use strict';

  function hexToRgb(hex) {
    hex = hex.replace('#', '');
    if (hex.length === 3) hex = hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2];
    var r = parseInt(hex.substring(0,2), 16);
    var g = parseInt(hex.substring(2,4), 16);
    var b = parseInt(hex.substring(4,6), 16);
    return { r: r, g: g, b: b };
  }

  function rgbToHsl(r, g, b) {
    r /= 255; g /= 255; b /= 255;
    var max = Math.max(r, g, b), min = Math.min(r, g, b);
    var h, s, l = (max + min) / 2;
    if (max === min) { h = s = 0; }
    else {
      var d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }
    return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
  }

  function hslToHex(h, s, l) {
    l /= 100; s /= 100;
    var c = (1 - Math.abs(2 * l - 1)) * s;
    var x = c * (1 - Math.abs(((h / 60) % 2) - 1));
    var m = l - c / 2;
    var r = 0, g = 0, b = 0;
    if (0 <= h && h < 60) { r = c; g = x; b = 0; }
    else if (60 <= h && h < 120) { r = x; g = c; b = 0; }
    else if (120 <= h && h < 180) { r = 0; g = c; b = x; }
    else if (180 <= h && h < 240) { r = 0; g = x; b = c; }
    else if (240 <= h && h < 300) { r = x; g = 0; b = c; }
    else { r = c; g = 0; b = x; }
    r = Math.round((r + m) * 255); g = Math.round((g + m) * 255); b = Math.round((b + m) * 255);
    return '#' + [r, g, b].map(function (x) { return x.toString(16).padStart(2, '0'); }).join('');
  }

  function rgbToHex(r, g, b) { return '#' + [r, g, b].map(function (x) { return x.toString(16).padStart(2, '0'); }).join(''); }

  function init() {
    var hexInput = document.getElementById('hexInput');
    var rgbInput = document.getElementById('rgbInput');
    var hslInput = document.getElementById('hslInput');
    var preview = document.getElementById('colorPreview');

    hexInput?.addEventListener('input', function () {
      var hex = hexInput.value;
      if (!/^#?[0-9a-fA-F]{6}$/.test(hex)) return;
      var rgb = hexToRgb(hex);
      var hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
      if (rgbInput) rgbInput.value = 'rgb(' + rgb.r + ', ' + rgb.g + ', ' + rgb.b + ')';
      if (hslInput) hslInput.value = 'hsl(' + hsl.h + ', ' + hsl.s + '%, ' + hsl.l + '%)';
      if (preview) preview.style.background = hex;
    });

    rgbInput?.addEventListener('input', function () {
      var match = rgbInput.value.match(/(\d+),\s*(\d+),\s*(\d+)/);
      if (!match) return;
      var rgb = { r: parseInt(match[1]), g: parseInt(match[2]), b: parseInt(match[3]) };
      var hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
      if (hexInput) hexInput.value = rgbToHex(rgb.r, rgb.g, rgb.b);
      if (hslInput) hslInput.value = 'hsl(' + hsl.h + ', ' + hsl.s + '%, ' + hsl.l + '%)';
      if (preview) preview.style.background = rgbInput.value;
    });

    hslInput?.addEventListener('input', function () {
      var match = hslInput.value.match(/(\d+),\s*(\d+)%,\s*(\d+)%/);
      if (!match) return;
      var hex = hslToHex(parseInt(match[1]), parseInt(match[2]), parseInt(match[3]));
      var rgb = hexToRgb(hex);
      if (hexInput) hexInput.value = hex;
      if (rgbInput) rgbInput.value = 'rgb(' + rgb.r + ', ' + rgb.g + ', ' + rgb.b + ')';
      if (preview) preview.style.background = hex;
    });

    document.getElementById('copyHex')?.addEventListener('click', function () { if (hexInput?.value) navigator.clipboard?.writeText(hexInput.value); });
    document.getElementById('copyRgb')?.addEventListener('click', function () { if (rgbInput?.value) navigator.clipboard?.writeText(rgbInput.value); });
    document.getElementById('copyHsl')?.addEventListener('click', function () { if (hslInput?.value) navigator.clipboard?.writeText(hslInput.value); });
  }

  init();
})();
