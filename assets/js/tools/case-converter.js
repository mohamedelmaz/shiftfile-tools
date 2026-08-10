/* ShiftFile Tools © 2026 — https://shiftfile.tools — All rights reserved. */

(function () {
  'use strict';

  function toUpper(s) { return s.toUpperCase(); }
  function toLower(s) { return s.toLowerCase(); }
  function toTitle(s) { return s.replace(/\b\w/g, function (c) { return c.toUpperCase(); }); }
  function toSentence(s) { return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase(); }
  function toCamel(s) { return s.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, function (m, c) { return c.toUpperCase(); }); }
  function toPascal(s) { var c = toCamel(s); return c.charAt(0).toUpperCase() + c.slice(1); }
  function toSnake(s) { return s.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, ''); }
  function toKebab(s) { return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, ''); }

  function init() {
    var input = document.getElementById('input');
    var outputs = {
      upper: document.getElementById('upper'),
      lower: document.getElementById('lower'),
      title: document.getElementById('title'),
      sentence: document.getElementById('sentence'),
      camel: document.getElementById('camel'),
      pascal: document.getElementById('pascal'),
      snake: document.getElementById('snake'),
      kebab: document.getElementById('kebab')
    };

    input?.addEventListener('input', function () {
      var v = input.value || '';
      if (outputs.upper) outputs.upper.value = toUpper(v);
      if (outputs.lower) outputs.lower.value = toLower(v);
      if (outputs.title) outputs.title.value = toTitle(v);
      if (outputs.sentence) outputs.sentence.value = toSentence(v);
      if (outputs.camel) outputs.camel.value = toCamel(v);
      if (outputs.pascal) outputs.pascal.value = toPascal(v);
      if (outputs.snake) outputs.snake.value = toSnake(v);
      if (outputs.kebab) outputs.kebab.value = toKebab(v);
    });
  }

  init();
})();
