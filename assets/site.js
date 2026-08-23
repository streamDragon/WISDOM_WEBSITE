(function () {
  const body = document.body;
  const root = body.dataset.root || './';
  const storageKey = 'wisdom-language';

  function path(url) {
    if (!url) return '#';
    if (url.startsWith('/')) return url;
    return root + url;
  }

  function resolveLanguage() {
    const params = new URLSearchParams(window.location.search);
    const queryLang = params.get('lang');
    if (queryLang === 'he' || queryLang === 'en') return queryLang;
    const stored = localStorage.getItem(storageKey);
    if (stored === 'he' || stored === 'en') return stored;
    return 'en';
  }

  function setLanguage(lang, persist) {
    const isHebrew = lang === 'he';
    document.documentElement.lang = lang;
    document.documentElement.dir = isHebrew ? 'rtl' : 'ltr';
    body.classList.toggle('lang-he', isHebrew);
    body.classList.toggle('lang-en', !isHebrew);
    if (persist !== false) localStorage.setItem(storageKey, lang);

    document.querySelectorAll('[data-en][data-he]').forEach((el) => {
      el.innerHTML = isHebrew ? el.dataset.he : el.dataset.en;
    });

    document.querySelectorAll('[data-set-lang]').forEach((button) => {
      const active = button.dataset.setLang === lang;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-pressed', String(active));
    });

    document.querySelectorAll('[data-contact]').forEach((el) => {
      const config = window.WISDOM_CONFIG || {};
      el.textContent = config.generalContact || (isHebrew ? 'פרטי קשר יתווספו בקרוב' : 'Contact details coming soon');
    });

    document.querySelectorAll('[data-documentation-link]').forEach((el) => {
      const url = window.WISDOM_CONFIG && window.WISDOM_CONFIG.documentationUrl;
      if (url) {
        el.setAttribute('href', url);
        el.textContent = isHebrew ? 'תיעוד' : 'Documentation';
      } else {
        el.removeAttribute('href');
        el.setAttribute('aria-disabled', 'true');
        el.textContent = isHebrew ? 'התיעוד יעלה בהמשך' : 'Documentation coming soon';
      }
    });

    document.querySelectorAll('[data-asset-store-cta]').forEach((el) => {
      const url = window.WISDOM_CONFIG && window.WISDOM_CONFIG.assetStoreUrl;
      if (url) {
        el.setAttribute('href', url);
        el.removeAttribute('aria-disabled');
        el.classList.remove('button--disabled');
        el.textContent = isHebrew ? 'לצפייה ב-Unity Asset Store' : 'View on Unity Asset Store';
      } else {
        el.removeAttribute('href');
        el.setAttribute('aria-disabled', 'true');
        el.classList.add('button--disabled');
        el.textContent = isHebrew ? 'בקרוב' : 'Coming Soon';
      }
    });

    renderProductGrids(lang);
  }

  function mediaFor(product) {
    const canonical = (window.WISDOM_PRODUCTS || []).find((x) => x.slug === product.slug) || product;
    if (canonical.media && canonical.media.type === 'image') {
      return `<div class="product-card__media"><img src="${canonical.media.src}" alt="${canonical.media.alt || ''}" loading="lazy"></div>`;
    }
    return '';
  }

  function renderProductGrids(lang) {
    const isHebrew = lang === 'he';
    document.querySelectorAll('[data-product-grid]').forEach((grid) => {
      const limit = Number(grid.dataset.limit || 999);
      const source = isHebrew ? window.WISDOM_PRODUCTS_HE : window.WISDOM_PRODUCTS;
      const products = (source || []).slice(0, limit);
      grid.innerHTML = products.map((product, index) => `
        <a class="product-card" href="${path(product.productPage)}" style="--card-index:${index}">
          ${mediaFor(product)}
          <div class="product-card__top"><span class="eyebrow">${product.category}</span></div>
          <div><h3>${product.name}</h3><p>${product.shortDescription}</p></div>
          <div class="product-card__footer"><span class="status-dot" aria-hidden="true"></span><span>${product.status}</span><span class="arrow" aria-hidden="true">↗</span></div>
        </a>`).join('');
    });
  }

  document.querySelectorAll('.header-inner').forEach((header) => {
    if (header.querySelector('.language-toggle')) return;
    const wrap = document.createElement('div');
    wrap.className = 'language-toggle';
    wrap.innerHTML = '<button type="button" data-set-lang="en">EN</button><button type="button" data-set-lang="he">עב</button>';
    const toggle = header.querySelector('.nav-toggle');
    header.insertBefore(wrap, toggle || null);
  });

  document.querySelectorAll('[data-set-lang]').forEach((button) => {
    button.addEventListener('click', () => setLanguage(button.dataset.setLang === 'he' ? 'he' : 'en', true));
  });

  document.querySelectorAll('[data-nav-toggle]').forEach((button) => {
    button.addEventListener('click', () => {
      const nav = document.querySelector('[data-mobile-nav]');
      if (!nav) return;
      const open = nav.classList.toggle('is-open');
      button.setAttribute('aria-expanded', String(open));
    });
  });

  document.querySelectorAll('[data-year]').forEach((el) => { el.textContent = new Date().getFullYear(); });

  setLanguage(resolveLanguage(), false);
})();
