(function () {
  const body = document.body;
  const root = body.dataset.root || './';

  function path(url) {
    if (!url) return '#';
    return root + url;
  }

  document.querySelectorAll('[data-nav-toggle]').forEach((button) => {
    button.addEventListener('click', () => {
      const nav = document.querySelector('[data-mobile-nav]');
      const open = nav.classList.toggle('is-open');
      button.setAttribute('aria-expanded', String(open));
    });
  });

  document.querySelectorAll('[data-product-grid]').forEach((grid) => {
    const limit = Number(grid.dataset.limit || 999);
    const products = (window.WISDOM_PRODUCTS || []).slice(0, limit);

    grid.innerHTML = products.map((product, index) => {
      const featureClass = product.featured ? ' product-card--featured' : '';
      const featureTag = product.featured ? '<span class="feature-tag">Featured</span>' : '';
      return `
        <a class="product-card${featureClass}" href="${path(product.productPage)}" style="--card-index:${index}">
          <div class="product-card__top">
            <span class="eyebrow">${product.category}</span>
            ${featureTag}
          </div>
          <div>
            <h3>${product.name}</h3>
            <p>${product.shortDescription}</p>
          </div>
          <div class="product-card__footer">
            <span class="status-dot" aria-hidden="true"></span>
            <span>${product.status}</span>
            <span class="arrow" aria-hidden="true">↗</span>
          </div>
        </a>`;
    }).join('');
  });

  document.querySelectorAll('[data-asset-store-cta]').forEach((el) => {
    const url = window.WISDOM_CONFIG && window.WISDOM_CONFIG.assetStoreUrl;
    if (url) {
      el.textContent = 'View on Unity Asset Store';
      el.setAttribute('href', url);
      el.removeAttribute('aria-disabled');
    } else {
      el.textContent = 'Coming Soon';
      el.removeAttribute('href');
      el.setAttribute('aria-disabled', 'true');
      el.classList.add('button--disabled');
    }
  });

  document.querySelectorAll('[data-documentation-link]').forEach((el) => {
    const url = window.WISDOM_CONFIG && window.WISDOM_CONFIG.documentationUrl;
    if (url) {
      el.setAttribute('href', url);
      el.textContent = 'Documentation';
    } else {
      el.textContent = 'Documentation coming soon';
      el.removeAttribute('href');
      el.setAttribute('aria-disabled', 'true');
    }
  });

  document.querySelectorAll('[data-contact]').forEach((el) => {
    const contact = window.WISDOM_CONFIG && window.WISDOM_CONFIG.generalContact;
    el.textContent = contact || 'Contact details coming soon';
  });

  const year = document.querySelector('[data-year]');
  if (year) year.textContent = new Date().getFullYear();
})();
