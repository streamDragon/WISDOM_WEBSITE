(function () {
  const body = document.body;
  const root = body.dataset.root || './';

  function path(url) {
    if (!url) return '#';
    if (url.startsWith('/')) return url;
    return root + url;
  }

  function currentLanguage() {
    return window.location.pathname === '/he' || window.location.pathname.startsWith('/he/') ? 'he' : 'en';
  }

  function counterpartUrl(targetLanguage) {
    let pathname = window.location.pathname || '/';

    if (targetLanguage === 'he') {
      if (!(pathname === '/he' || pathname.startsWith('/he/'))) {
        pathname = pathname === '/' ? '/he/' : '/he' + pathname;
      }
    } else {
      if (pathname === '/he' || pathname === '/he/') {
        pathname = '/';
      } else if (pathname.startsWith('/he/')) {
        pathname = pathname.slice(3) || '/';
      }
    }

    return pathname + window.location.search + window.location.hash;
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

  const language = currentLanguage();
  document.documentElement.lang = language;
  document.documentElement.dir = language === 'he' ? 'rtl' : 'ltr';
  body.classList.toggle('lang-he', language === 'he');
  body.classList.toggle('lang-en', language === 'en');

  document.querySelectorAll('.header-inner').forEach((header) => {
    if (header.querySelector('.language-toggle')) return;
    const wrap = document.createElement('div');
    wrap.className = 'language-toggle';
    wrap.setAttribute('aria-label', language === 'he' ? 'בחירת שפה' : 'Language');
    wrap.innerHTML = '<button type="button" data-set-lang="en">EN</button><button type="button" data-set-lang="he">עברית</button>';
    const toggle = header.querySelector('.nav-toggle');
    header.insertBefore(wrap, toggle || null);
  });

  document.querySelectorAll('[data-set-lang]').forEach((button) => {
    const targetLanguage = button.dataset.setLang === 'he' ? 'he' : 'en';
    const active = targetLanguage === language;
    button.classList.toggle('is-active', active);
    button.setAttribute('aria-pressed', String(active));
    button.addEventListener('click', () => {
      if (!active) window.location.href = counterpartUrl(targetLanguage);
    });
  });

  document.querySelectorAll('[data-nav-toggle]').forEach((button) => {
    button.addEventListener('click', () => {
      const nav = document.querySelector('[data-mobile-nav]');
      if (!nav) return;
      const open = nav.classList.toggle('is-open');
      button.setAttribute('aria-expanded', String(open));
    });
  });

  document.querySelectorAll('[data-contact]').forEach((el) => {
    const config = window.WISDOM_CONFIG || {};
    el.textContent = config.generalContact || (language === 'he' ? 'פרטי קשר יתווספו בקרוב' : 'Contact details coming soon');
  });

  document.querySelectorAll('[data-documentation-link]').forEach((el) => {
    const url = window.WISDOM_CONFIG && window.WISDOM_CONFIG.documentationUrl;
    if (url) {
      el.setAttribute('href', url);
      el.textContent = language === 'he' ? 'תיעוד' : 'Documentation';
    } else {
      el.removeAttribute('href');
      el.setAttribute('aria-disabled', 'true');
      el.textContent = language === 'he' ? 'התיעוד יעלה בהמשך' : 'Documentation coming soon';
    }
  });

  document.querySelectorAll('[data-asset-store-cta]').forEach((el) => {
    const url = window.WISDOM_CONFIG && window.WISDOM_CONFIG.assetStoreUrl;
    if (url) {
      el.setAttribute('href', url);
      el.removeAttribute('aria-disabled');
      el.classList.remove('button--disabled');
      el.textContent = language === 'he' ? 'לצפייה ב-Unity Asset Store' : 'View on Unity Asset Store';
    } else {
      el.removeAttribute('href');
      el.setAttribute('aria-disabled', 'true');
      el.classList.add('button--disabled');
      el.textContent = language === 'he' ? 'בקרוב' : 'Coming Soon';
    }
  });

  document.querySelectorAll('[data-year]').forEach((el) => {
    el.textContent = new Date().getFullYear();
  });

  renderProductGrids(language);
})();
