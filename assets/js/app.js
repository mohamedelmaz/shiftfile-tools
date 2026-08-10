/* ShiftFile Tools © 2026 — https://shiftfile.tools — All rights reserved. */

(function () {
  'use strict';

  const THEME_KEY = 'sf-theme';

  function getTheme() {
    const stored = localStorage.getItem(THEME_KEY);
    if (stored) return stored;
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark';
    return 'light';
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(THEME_KEY, theme);
    const btn = document.getElementById('themeToggle');
    if (btn) btn.textContent = theme === 'dark' ? '☀️' : '🌙';
  }

  function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme');
    applyTheme(current === 'dark' ? 'light' : 'dark');
  }

  document.addEventListener('DOMContentLoaded', function () {
    applyTheme(getTheme());

    const toggle = document.getElementById('themeToggle');
    if (toggle) toggle.addEventListener('click', toggleTheme);

    // Dropdowns
    document.querySelectorAll('.dropdown-toggle').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.stopPropagation();
        const dropdown = btn.closest('.dropdown');
        const isOpen = dropdown.classList.contains('open');
        closeAllDropdowns();
        if (!isOpen) dropdown.classList.add('open');
      });
    });

    document.addEventListener('click', closeAllDropdowns);

    function closeAllDropdowns() {
      document.querySelectorAll('.dropdown.open').forEach(function (d) { d.classList.remove('open'); });
      const overlay = document.querySelector('.dropdown-overlay');
      if (overlay) overlay.classList.remove('show');
    }

    // Mobile overlay
    const overlay = document.querySelector('.dropdown-overlay');
    if (overlay) {
      overlay.addEventListener('click', function () {
        closeAllDropdowns();
      });
    }

    // Search filter
    const searchInput = document.getElementById('toolSearch');
    if (searchInput) {
      searchInput.addEventListener('input', function () {
        const query = searchInput.value.toLowerCase().trim();
        document.querySelectorAll('.tool-card').forEach(function (card) {
          const title = card.querySelector('h3')?.textContent.toLowerCase() || '';
          const desc = card.querySelector('p')?.textContent.toLowerCase() || '';
          card.style.display = (title.includes(query) || desc.includes(query)) ? '' : 'none';
        });
      });
    }

    // PWA
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('sw.js').catch(function () {});
    }

    // Drag and drop zones
    document.querySelectorAll('.tool-area').forEach(function (zone) {
      zone.addEventListener('dragover', function (e) { e.preventDefault(); zone.classList.add('dragover'); });
      zone.addEventListener('dragleave', function () { zone.classList.remove('dragover'); });
      zone.addEventListener('drop', function (e) {
        e.preventDefault(); zone.classList.remove('dragover');
        const input = zone.querySelector('input[type="file"]');
        const files = e.dataTransfer.files;
        if (input && files.length) {
          const dt = new DataTransfer();
          dt.items.add(files[0]);
          input.files = dt.files;
          input.dispatchEvent(new Event('change'));
        }
      });
    });
  });
})();
