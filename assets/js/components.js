/* ShiftFile Tools © 2026 — https://shiftfile.tools — All rights reserved. */

(function () {
  'use strict';

  const HEADER = `<header class="site-header">
  <div class="header-inner">
    <a href="/" class="logo" aria-label="ShiftFile Tools Home">
      <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="32" height="32" rx="8" fill="#10b981"/>
        <path d="M16 8L24 16L16 24" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M16 8L8 16L16 24" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      ShiftFile Tools
    </a>
    <button class="mobile-menu-toggle" aria-label="Toggle menu" aria-expanded="false">☰</button>
    <nav class="nav" aria-label="Main navigation">
      <div class="dropdown">
        <button class="dropdown-toggle" aria-expanded="false">Tools</button>
        <div class="dropdown-menu">
          <div class="dropdown-group">
            <div class="dropdown-label">Images</div>
            <a href="/tools/image-converter/">Image Converter</a>
            <a href="/tools/image-compressor/">Image Compressor</a>
            <a href="/tools/image-resizer/">Image Resizer</a>
            <a href="/tools/svg-to-png/">SVG to PNG</a>
            <a href="/tools/images-to-pdf/">Images to PDF</a>
          </div>
          <div class="dropdown-group">
            <div class="dropdown-label">Data &amp; Text</div>
            <a href="/tools/json-csv-converter/">JSON ↔ CSV</a>
            <a href="/tools/markdown-html-converter/">Markdown ↔ HTML</a>
            <a href="/tools/base64-converter/">Base64 Converter</a>
            <a href="/tools/url-encoder/">URL Encoder</a>
            <a href="/tools/html-entities/">HTML Entities</a>
            <a href="/tools/case-converter/">Case Converter</a>
            <a href="/tools/slug-generator/">Slug Generator</a>
            <a href="/tools/color-converter/">Color Converter</a>
            <a href="/tools/number-base-converter/">Number Base Converter</a>
          </div>
        </div>
      </div>
      <a href="/guides/">Guides</a>
      <a href="/developers/">Developers</a>
      <button id="themeToggle" class="theme-toggle" aria-label="Toggle dark mode">🌙</button>
    </nav>
  </div>
  <div class="dropdown-overlay" aria-hidden="true"></div>
</header>`;

  const FOOTER = `<footer class="site-footer">
  <div class="container">
    <div class="footer-inner">
      <div class="footer-col">
        <h4>Tools</h4>
        <a href="/tools/image-converter/">Image Converter</a>
        <a href="/tools/json-csv-converter/">JSON ↔ CSV</a>
        <a href="/tools/base64-converter/">Base64</a>
        <a href="/tools/number-base-converter/">Number Base</a>
      </div>
      <div class="footer-col">
        <h4>Resources</h4>
        <a href="/guides/">Guides</a>
        <a href="/developers/">Developers</a>
        <a href="/about/">About</a>
        <a href="/contact/">Contact</a>
      </div>
      <div class="footer-col">
        <h4>Legal</h4>
        <a href="/privacy-policy/">Privacy Policy</a>
        <a href="/terms/">Terms of Service</a>
      </div>
    </div>
    <div class="footer-bottom">
      <p>🔒 Runs 100% in your browser — your files never leave your device. Free forever · Unlimited · No watermarks.</p>
      <p style="margin-top:8px;">© 2026 ShiftFile Tools — <a href="https://shiftfile.tools">https://shiftfile.tools</a> — All rights reserved.</p>
    </div>
  </div>
</footer>`;

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

  function closeAllDropdowns() {
    document.querySelectorAll('.dropdown.open').forEach(function (d) { d.classList.remove('open'); });
    const overlay = document.querySelector('.dropdown-overlay');
    if (overlay) overlay.classList.remove('show');
  }

  function closeMobileNav() {
    const nav = document.querySelector('.nav');
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    if (nav) nav.classList.remove('nav-open');
    if (mobileToggle) {
      mobileToggle.setAttribute('aria-expanded', 'false');
      mobileToggle.textContent = '☰';
    }
  }

  function closeAll() {
    closeAllDropdowns();
    closeMobileNav();
  }

  function getRelPrefix() {
    const path = window.location.pathname;
    const segments = path.split('/').filter(Boolean);
    const firstLevel = ['tools', 'guides', 'about', 'contact', 'developers', 'privacy-policy', 'terms'];
    let baseSegments = 0;
    if (segments.length >= 2 && firstLevel.indexOf(segments[1]) !== -1) {
      baseSegments = 1;
    }
    const depth = segments.length - baseSegments;
    if (depth <= 0) return './';
    return '../'.repeat(depth);
  }

  function fixInjectedLinks(container, rel) {
    container.querySelectorAll('a[href^="/"]').forEach(function (a) {
      a.setAttribute('href', rel + a.getAttribute('href').slice(1));
    });
    container.querySelectorAll('script[src^="/"]').forEach(function (s) {
      s.setAttribute('src', rel + s.getAttribute('src').slice(1));
    });
    container.querySelectorAll('link[href^="/"]').forEach(function (l) {
      l.setAttribute('href', rel + l.getAttribute('href').slice(1));
    });
  }

  function initComponents() {
    const rel = getRelPrefix();
    const headerEl = document.getElementById('site-header');
    const footerEl = document.getElementById('site-footer');
    if (headerEl) {
      headerEl.innerHTML = HEADER;
      fixInjectedLinks(headerEl, rel);
    }
    if (footerEl) {
      footerEl.innerHTML = FOOTER;
      fixInjectedLinks(footerEl, rel);
    }

    applyTheme(getTheme());

    const toggle = document.getElementById('themeToggle');
    if (toggle) toggle.addEventListener('click', toggleTheme);

    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    const nav = document.querySelector('.nav');
    if (mobileToggle && nav) {
      mobileToggle.addEventListener('click', function () {
        const isOpen = nav.classList.contains('nav-open');
        closeAllDropdowns();
        if (!isOpen) {
          nav.classList.add('nav-open');
          mobileToggle.setAttribute('aria-expanded', 'true');
          mobileToggle.textContent = '✕';
        } else {
          closeMobileNav();
        }
      });
    }

    document.querySelectorAll('.dropdown-toggle').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.stopPropagation();
        const dropdown = btn.closest('.dropdown');
        const isOpen = dropdown.classList.contains('open');
        closeAllDropdowns();
        if (!isOpen) {
          dropdown.classList.add('open');
          const overlay = document.querySelector('.dropdown-overlay');
          if (overlay) overlay.classList.add('show');
        }
      });
    });

    document.addEventListener('click', closeAll);

    const overlay = document.querySelector('.dropdown-overlay');
    if (overlay) {
      overlay.addEventListener('click', closeAll);
    }

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

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('sw.js').catch(function () {});
    }

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
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initComponents);
  } else {
    initComponents();
  }
})();
