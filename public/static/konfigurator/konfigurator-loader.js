(function () {
  'use strict';

  const root = document.getElementById('cfg-dropdown');
  if (!root) return;

  const excelUrl = root.getAttribute('data-excel-url');
  const appSrc = 'konfigurator-app.js';
  let started = false;

  function loadApp() {
    if (started) return;
    started = true;

    const s = document.createElement('script');
    s.src = appSrc;
    s.async = true;
    s.onload = () => {
      if (window.ConfiguratorApp?.init) {
        window.ConfiguratorApp.init({
          excelUrl,
          rootId: 'cfg-dropdown'
        });
      }
    };
    s.onerror = () => {
      console.error('[Configurator] Failed to load app script:', s.src);
      const err = document.getElementById('cfg-error');
      const errText = document.getElementById('cfg-error-text');
      if (errText) errText.textContent = 'Błąd ładowania danych';
      if (err) err.style.display = '';
    };
    document.head.appendChild(s);
  }

  if ('IntersectionObserver' in window) {
    const obs = new IntersectionObserver((entries) => {
      if (entries.some(e => e.isIntersecting)) {
        obs.disconnect();
        loadApp();
      }
    }, { rootMargin: '200px' });
    obs.observe(root);
  } else {
    loadApp();
  }

  const triggerOnce = () => {
    loadApp();
    window.removeEventListener('pointerdown', triggerOnce);
    window.removeEventListener('keydown', triggerOnce);
    window.removeEventListener('scroll', triggerOnce);
  };

  window.addEventListener('pointerdown', triggerOnce, { once: true });
  window.addEventListener('keydown', triggerOnce, { once: true });
  window.addEventListener('scroll', triggerOnce, { once: true, passive: true });
})();
