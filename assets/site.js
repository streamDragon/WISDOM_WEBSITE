(function () {
  const body = document.body;
  const root = body.dataset.root || './';
  const isHebrew = document.documentElement.lang === 'he';

  function path(url) {
    if (!url) return '#';
    return root + url;
  }

  function counterpartUrl() {
    const p = window.location.pathname;
    let next;
    if (isHebrew) {
      next = p.replace(/\/he(?=\/|$)/, '') || '/';
    } else {
      next = p === '/' ? '/he/' : '/he' + p;
    }
    return next + window.location.search + window.location.hash;
  }

  document.querySelectorAll('.header-inner').forEach((header) => {
    if (header.querySelector('.lang-switch')) return;
    const a = document.createElement('a');
    a.className = 'lang-switch';
    a.href = counterpartUrl();
    a.lang = isHebrew ? 'en' : 'he';
    a.dir = isHebrew ? 'ltr' : 'rtl';
    a.textContent = isHebrew ? 'English' : 'עברית';
    a.setAttribute('aria-label', isHebrew ? 'Switch to English' : 'מעבר לעברית');
    const toggle = header.querySelector('.nav-toggle');
    header.insertBefore(a, toggle || null);
  });

  document.querySelectorAll('[data-nav-toggle]').forEach((button) => {
    button.addEventListener('click', () => {
      const nav = document.querySelector('[data-mobile-nav]');
      const open = nav.classList.toggle('is-open');
      button.setAttribute('aria-expanded', String(open));
    });
  });

  document.querySelectorAll('[data-product-grid]').forEach((grid) => {
    const limit = Number(grid.dataset.limit || 999);
    const source = isHebrew ? window.WISDOM_PRODUCTS_HE : window.WISDOM_PRODUCTS;
    const products = (source || []).slice(0, limit);
    grid.innerHTML = products.map((product, index) => `
      <a class="product-card" href="${path(product.productPage)}" style="--card-index:${index}">
        <div class="product-card__top"><span class="eyebrow">${product.category}</span></div>
        <div><h3>${product.name}</h3><p>${product.shortDescription}</p></div>
        <div class="product-card__footer"><span class="status-dot" aria-hidden="true"></span><span>${product.status}</span><span class="arrow" aria-hidden="true">↗</span></div>
      </a>`).join('');
  });

  document.querySelectorAll('[data-asset-store-cta]').forEach((el) => {
    const url = window.WISDOM_CONFIG && window.WISDOM_CONFIG.assetStoreUrl;
    if (url) {
      el.textContent = isHebrew ? 'לצפייה ב-Unity Asset Store' : 'View on Unity Asset Store';
      el.setAttribute('href', url);
      el.removeAttribute('aria-disabled');
    } else {
      el.textContent = isHebrew ? 'בקרוב' : 'Coming Soon';
      el.removeAttribute('href');
      el.setAttribute('aria-disabled', 'true');
      el.classList.add('button--disabled');
    }
  });

  document.querySelectorAll('[data-documentation-link]').forEach((el) => {
    const url = window.WISDOM_CONFIG && window.WISDOM_CONFIG.documentationUrl;
    if (url) {
      el.setAttribute('href', url);
      el.textContent = isHebrew ? 'תיעוד' : 'Documentation';
    } else {
      el.textContent = isHebrew ? 'התיעוד יעלה בהמשך' : 'Documentation coming soon';
      el.removeAttribute('href');
      el.setAttribute('aria-disabled', 'true');
    }
  });

  document.querySelectorAll('[data-contact]').forEach((el) => {
    const contact = window.WISDOM_CONFIG && window.WISDOM_CONFIG.generalContact;
    el.textContent = contact || (isHebrew ? 'פרטי קשר יתווספו בקרוב' : 'Contact details coming soon');
  });

  document.querySelectorAll('[data-year]').forEach((el) => { el.textContent = new Date().getFullYear(); });
})();
