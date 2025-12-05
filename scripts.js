document.addEventListener('DOMContentLoaded', () => {
  // Set current year in footer
  const yearSpan = document.getElementById('year');
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  // Helpers to fetch JSON data
  async function loadJSON(path) {
    try {
      const response = await fetch(path);
      if (!response.ok) throw new Error('Network error');
      return await response.json();
    } catch (err) {
      console.error(`Failed to load ${path}:`, err);
      return null;
    }
  }

  // Populate promotions on home and promotions page
  async function loadPromotions() {
    const data = await loadJSON('data/promotions.json');
    if (!data) return;
    const previewContainer = document.getElementById('promotions-preview');
    const listContainer = document.getElementById('promotions-list');
    // Build card element for each promotion
    data.forEach((promo, index) => {
      const card = document.createElement('div');
      card.className = 'card';
      card.innerHTML = `
        <img src="${promo.image}" alt="${promo.title}" style="width:100%;height:150px;object-fit:cover;border-radius:4px;">
        <h4>${promo.title}</h4>
        <p>${promo.description}</p>
      `;
      // Add to preview only first 3 items
      if (previewContainer && index < 3) {
        previewContainer.appendChild(card.cloneNode(true));
      }
      if (listContainer) {
        listContainer.appendChild(card);
      }
    });
  }

  // Populate reviews on home and reviews page
  async function loadReviews() {
    const data = await loadJSON('data/reviews.json');
    if (!data) return;
    const previewContainer = document.getElementById('reviews-preview');
    const listContainer = document.getElementById('reviews-list');
    data.forEach((review, index) => {
      const item = document.createElement('div');
      item.className = 'review';
      // Build rating stars
      let stars = '';
      for (let i = 0; i < 5; i++) {
        stars += `<i class="fa${i < review.rating ? 's' : 'r'} fa-star"></i>`;
      }
      item.innerHTML = `
        <h4>${review.name}</h4>
        <div class="rating">${stars}</div>
        <p>${review.comment}</p>
      `;
      if (previewContainer && index < 3) {
        previewContainer.appendChild(item.cloneNode(true));
      }
      if (listContainer) {
        listContainer.appendChild(item);
      }
    });
  }

  // Populate catalog page
  async function loadCatalog() {
    const data = await loadJSON('data/catalog.json');
    if (!data) return;
    const container = document.getElementById('catalog');
    if (!container) return;
    data.forEach((category) => {
      const section = document.createElement('div');
      section.className = 'catalog-category';
      section.innerHTML = `<h3>${category.category}</h3>`;
      const itemsWrapper = document.createElement('div');
      itemsWrapper.className = 'catalog-items';
      category.items.forEach((item) => {
        const itemCard = document.createElement('div');
        itemCard.className = 'catalog-item';
        itemCard.innerHTML = `
          <img src="${item.image}" alt="${item.name}">
          <div class="item-info">
            <h4>${item.name}</h4>
            <p>${item.description}</p>
            <span class="price">$${item.price.toFixed(2)}</span>
          </div>
        `;
        itemsWrapper.appendChild(itemCard);
      });
      section.appendChild(itemsWrapper);
      container.appendChild(section);
    });
  }

  // Populate gas prices page
  async function loadGasPrices() {
    const data = await loadJSON('data/gasprices.json');
    if (!data) return;
    const tbody = document.querySelector('#gas-table tbody');
    const updatedEl = document.getElementById('gas-updated');
    if (!tbody) return;
    ['regular', 'mid_grade', 'premium'].forEach((type) => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${type.replace('_', ' ').replace(/\b\w/g, (c) => c.toUpperCase())}</td>
        <td>$${data[type].toFixed(2)}</td>
      `;
      tbody.appendChild(row);
    });
    if (updatedEl) {
      updatedEl.textContent = `Last updated: ${data.last_updated}`;
    }
  }

  // Contact form handler
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      alert('Thank you for contacting us! We will get back to you soon.');
      contactForm.reset();
    });
  }

  // Initialize page content based on presence of specific containers
  loadPromotions();
  loadReviews();
  loadCatalog();
  loadGasPrices();
});