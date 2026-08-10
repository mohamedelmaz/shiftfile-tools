/* ShiftFile Tools © 2026 — https://shiftfile.tools — All rights reserved. */

(function () {
  'use strict';

  function parseCsvLine(line) {
    var result = [], current = '', inQuotes = false;
    for (var i = 0; i < line.length; i++) {
      var ch = line[i];
      if (inQuotes) {
        if (ch === '"') { if (line[i+1] === '"') { current += '"'; i++; } else { inQuotes = false; } }
        else { current += ch; }
      } else {
        if (ch === '"') { inQuotes = true; }
        else if (ch === ',') { result.push(current); current = ''; }
        else { current += ch; }
      }
    }
    result.push(current);
    return result;
  }

  function escapeCsv(val) {
    if (typeof val === 'undefined' || val === null) return '';
    val = String(val);
    if (val.indexOf(',') !== -1 || val.indexOf('"') !== -1 || val.indexOf('\n') !== -1) {
      return '"' + val.replace(/"/g, '""') + '"';
    }
    return val;
  }

  function jsonToCsv(json) {
    if (typeof json === 'string') { try { json = JSON.parse(json); } catch (e) { return ''; } }
    if (!Array.isArray(json) || json.length === 0) return '';
    var keys = Object.keys(json[0]);
    var rows = [keys.join(',')];
    json.forEach(function (row) { rows.push(keys.map(escapeCsv).join(',')); });
    return rows.join('\n');
  }

  function csvToJson(csv) {
    var lines = csv.replace(/\r\n/g, '\n').replace(/\r/g, '\n').split('\n').filter(function (l) { return l.trim(); });
    if (lines.length < 1) return [];
    var headers = parseCsvLine(lines[0]);
    var result = [];
    for (var i = 1; i < lines.length; i++) {
      var values = parseCsvLine(lines[i]);
      var obj = {};
      headers.forEach(function (h, idx) { obj[h] = values[idx]; });
      result.push(obj);
    }
    return result;
  }

  function init() {
    var jsonInput = document.getElementById('jsonInput');
    var csvInput = document.getElementById('csvInput');
    var preview = document.getElementById('preview');

    document.getElementById('jsonToCsvBtn')?.addEventListener('click', function () {
      var out = jsonToCsv(jsonInput?.value || '');
      if (csvInput) csvInput.value = out;
      renderTable(csvToJson(out));
    });

    document.getElementById('csvToJsonBtn')?.addEventListener('click', function () {
      var out = csvToJson(csvInput?.value || '');
      if (jsonInput) jsonInput.value = JSON.stringify(out, null, 2);
      renderTable(out);
    });
  }

  function renderTable(data) {
    var el = document.getElementById('preview');
    if (!el || !data.length) return;
    var keys = Object.keys(data[0]);
    var html = '<table><thead><tr>' + keys.map(function (k) { return '<th>' + escapeHtml(k) + '</th>'; }).join('') + '</tr></thead><tbody>';
    data.forEach(function (row) {
      html += '<tr>' + keys.map(function (k) { return '<td>' + escapeHtml(String(row[k] != null ? row[k] : '')) + '</td>'; }).join('') + '</tr>';
    });
    html += '</tbody></table>';
    el.innerHTML = html;
  }

  function escapeHtml(s) { return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }

  init();
})();
