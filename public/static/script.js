// AGURI - Vanilla JavaScript

// ==================== Data ====================
const productsData = [
  {
    id: "product-1",
    name: "Aguri Active Bike 2",
    category: "Bagażniki rowerowe",
    price: 899.00,
    description: "Platforma rowerowa na hak",
    image: "https://images.pexels.com/photos/5835359/pexels-photo-5835359.jpeg?w=400"
  },
  {
    id: "product-2",
    name: "Uchwyt bagażowy Aguri Marathon Basic srebrny",
    category: "Bagażniki dachowe",
    price: 316.00,
    description: "Belki dachowe aluminiowe",
    image: "https://images.pexels.com/photos/3806288/pexels-photo-3806288.jpeg?w=400"
  },
  {
    id: "product-3",
    name: "Aguri Active E-Bike platforma rowerowa na 2 rowery elektryczne",
    category: "Bagażniki rowerowe",
    price: 2066.00,
    description: "Platforma rowerowa na hak",
    image: "https://images.pexels.com/photos/100582/pexels-photo-100582.jpeg?w=400"
  },
  {
    id: "product-4",
    name: "Box dachowy Boks Aguri Wind 43 Black 430l",
    category: "Boxy dachowe",
    price: 1320.00,
    description: "Duży box dachowy do auta",
    image: "https://images.pexels.com/photos/3764984/pexels-photo-3764984.jpeg?w=400"
  },
  {
    id: "product-5",
    name: "Uchwyt bagażnik rowerowy na dach AGURI ACUDA III wersja black 3",
    category: "Bagażniki dachowe",
    price: 359.00,
    description: "Uchwyt rowerowy na dach",
    image: "https://images.pexels.com/photos/5462562/pexels-photo-5462562.jpeg?w=400"
  },
  {
    id: "product-6",
    name: "Bagażnik Aguri Prestige 2 TOYOTA RAV 4 II 00-05",
    category: "Bagażnik dachowy na relingi",
    price: 359.00,
    description: "Bagażnik dachowy na relingi",
    image: "https://images.pexels.com/photos/3786091/pexels-photo-3786091.jpeg?w=400"
  }
];

const carDatabase = {
  "Audi": {
    "A3": [2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016, 2015, 2014, 2013, 2012],
    "A4": [2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016, 2015],
    "A6": [2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016, 2015, 2014],
    "Q3": [2024, 2023, 2022, 2021, 2020, 2019, 2018],
    "Q5": [2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016]
  },
  "BMW": {
    "Seria 3": [2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016, 2015],
    "Seria 5": [2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016],
    "X3": [2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017],
    "X5": [2024, 2023, 2022, 2021, 2020, 2019, 2018]
  },
  "Mercedes-Benz": {
    "Klasa A": [2024, 2023, 2022, 2021, 2020, 2019, 2018],
    "Klasa C": [2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016, 2015, 2014],
    "Klasa E": [2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016],
    "GLC": [2024, 2023, 2022, 2021, 2020, 2019]
  },
  "Volkswagen": {
    "Golf": [2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016, 2015, 2014, 2013, 2012],
    "Passat": [2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016, 2015, 2014],
    "Tiguan": [2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016],
    "Touareg": [2024, 2023, 2022, 2021, 2020, 2019, 2018]
  },
  "Toyota": {
    "Corolla": [2024, 2023, 2022, 2021, 2020, 2019, 2018],
    "RAV4": [2024, 2023, 2022, 2021, 2020, 2019, 2018],
    "Camry": [2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017],
    "Highlander": [2024, 2023, 2022, 2021, 2020, 2019]
  },
  "Skoda": {
    "Octavia": [2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016, 2015, 2014, 2013, 2012],
    "Superb": [2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016, 2015],
    "Kodiaq": [2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017],
    "Karoq": [2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017]
  },
  "Ford": {
    "Focus": [2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016, 2015, 2014],
    "Mondeo": [2022, 2021, 2020, 2019, 2018, 2017, 2016, 2015, 2014],
    "Kuga": [2024, 2023, 2022, 2021, 2020, 2019],
    "Explorer": [2024, 2023, 2022, 2021, 2020, 2019]
  }
};

const faqData = [
  {
    question: "Jak dobrać odpowiedni bagażnik do mojego auta?",
    answer: "Skorzystaj z naszego konfiguratora online, gdzie po podaniu marki, modelu i roku produkcji pojazdu otrzymasz listę kompatybilnych produktów. Możesz też skontaktować się z naszym działem technicznym."
  },
  {
    question: "Czy mogę zamontować bagażnik samodzielnie?",
    answer: "Tak! Nasze produkty są zaprojektowane z myślą o łatwym montażu. Do każdego bagażnika dołączamy szczegółową instrukcję. Montaż zazwyczaj zajmuje 15-30 minut i nie wymaga specjalistycznych narzędzi."
  },
  {
    question: "Jaka jest maksymalna ładowność platform rowerowych?",
    answer: "Zależy od modelu. Nasze platformy na hak holowniczy mają ładowność od 45 do 60 kg. Zawsze sprawdzaj specyfikację konkretnego modelu oraz dopuszczalną ładowność haka w Twoim pojeździe."
  },
  {
    question: "Czy produkty są objęte gwarancją?",
    answer: "Tak, wszystkie nasze produkty objęte są 3-letnią gwarancją producenta. Gwarancja obejmuje wady materiałowe i produkcyjne. Szczegóły znajdziesz w karcie gwarancyjnej dołączonej do produktu."
  },
  {
    question: "Jak długo trwa dostawa?",
    answer: "Standardowa realizacja zamówienia to 24 godziny. Wysyłka kurierem zazwyczaj trwa 1-2 dni robocze. Oferujemy darmową dostawę przy zamówieniach powyżej 500 zł."
  },
  {
    question: "Czy mogę zwrócić produkt, jeśli nie pasuje do mojego auta?",
    answer: "Tak, masz 14 dni na zwrot produktu bez podania przyczyny. Produkt musi być nieużywany, w oryginalnym opakowaniu. Zwracamy pełną wartość zamówienia."
  }
];

// ==================== Cart State ====================
let cart = JSON.parse(localStorage.getItem('cart')) || [];

function saveCart() {
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartBadge();
}

function updateCartBadge() {
  const badge = document.querySelector('.cart-badge');
  const total = cart.reduce((sum, item) => sum + item.quantity, 0);
  if (badge) {
    badge.textContent = total > 9 ? '9+' : total;
    badge.style.display = total > 0 ? 'flex' : 'none';
  }
}

function addToCart(product) {
  const existing = cart.find(item => item.id === product.id);
  if (existing) {
    existing.quantity += 1;
    showToast(`${product.name} - ilość zwiększona`);
  } else {
    cart.push({ ...product, quantity: 1 });
    showToast(`Dodano: ${product.name}`);
  }
  saveCart();
  openCartDrawer();
}

function removeFromCart(id) {
  cart = cart.filter(item => item.id !== id);
  saveCart();
  renderCartItems();
  showToast('Usunięto z koszyka');
}

function updateQuantity(id, delta) {
  const item = cart.find(i => i.id === id);
  if (item) {
    item.quantity += delta;
    if (item.quantity < 1) {
      removeFromCart(id);
    } else {
      saveCart();
      renderCartItems();
    }
  }
}

function clearCart() {
  cart = [];
  saveCart();
  renderCartItems();
  showToast('Koszyk wyczyszczony');
}

function getCartTotal() {
  return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

// ==================== Toast ====================
function showToast(message) {
  const container = document.querySelector('.toast-container') || createToastContainer();
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

function createToastContainer() {
  const container = document.createElement('div');
  container.className = 'toast-container';
  document.body.appendChild(container);
  return container;
}

// ==================== Cart Drawer ====================
function openCartDrawer() {
  document.querySelector('.cart-overlay').classList.add('open');
  document.body.style.overflow = 'hidden';
  renderCartItems();
}

function closeCartDrawer() {
  document.querySelector('.cart-overlay').classList.remove('open');
  document.body.style.overflow = '';
}

function renderCartItems() {
  const container = document.querySelector('.cart-items');
  const total = getCartTotal();
  const shipping = total >= 500 ? 0 : 19.99;
  
  if (cart.length === 0) {
    container.innerHTML = `
      <div class="cart-empty">
        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
        <p><strong>Koszyk jest pusty</strong></p>
        <p>Dodaj produkty, aby kontynuować zakupy</p>
        <button class="btn btn-primary" onclick="closeCartDrawer()">Kontynuuj zakupy</button>
      </div>
    `;
  } else {
    container.innerHTML = cart.map(item => `
      <div class="cart-item">
        <img src="${item.image}" alt="${item.name}">
        <div class="cart-item-info">
          <h4>${item.name}</h4>
          <p class="cart-item-category">${item.category}</p>
          <p class="cart-item-price">${item.price.toFixed(2)} zł</p>
          <div class="cart-item-controls">
            <button class="quantity-btn" onclick="updateQuantity('${item.id}', -1)">−</button>
            <span class="quantity-value">${item.quantity}</span>
            <button class="quantity-btn" onclick="updateQuantity('${item.id}', 1)">+</button>
            <button class="remove-btn" onclick="removeFromCart('${item.id}')">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
            </button>
          </div>
        </div>
      </div>
    `).join('');
  }
  
  // Update summary
  const summaryEl = document.querySelector('.cart-summary');
  if (summaryEl) {
    summaryEl.innerHTML = `
      <div class="cart-summary-row">
        <span>Suma częściowa</span>
        <span>${total.toFixed(2)} zł</span>
      </div>
      <div class="cart-summary-row">
        <span>Dostawa</span>
        <span style="color: var(--primary)">${shipping === 0 ? 'Gratis' : 'od 19.99 zł'}</span>
      </div>
      <div class="cart-summary-row total">
        <span>Razem</span>
        <span>${(total + shipping).toFixed(2)} zł</span>
      </div>
    `;
  }
}

// ==================== Header Scroll ====================
function initHeaderScroll() {
  const header = document.querySelector('.header');
  let lastScrollY = 0;
  
  window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;
    
    if (currentScrollY > lastScrollY && currentScrollY > 100) {
      header.classList.add('hidden');
    } else {
      header.classList.remove('hidden');
    }
    
    lastScrollY = currentScrollY;
  }, { passive: true });
}

// ==================== Mobile Menu ====================
function initMobileMenu() {
  const menuBtn = document.querySelector('.mobile-menu-btn');
  const mobileMenu = document.querySelector('.mobile-menu');
  
  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('open');
      const icon = menuBtn.querySelector('svg');
      if (mobileMenu.classList.contains('open')) {
        icon.innerHTML = '<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>';
      } else {
        icon.innerHTML = '<line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="6" x2="20" y2="6"/><line x1="4" y1="18" x2="20" y2="18"/>';
      }
    });
    
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
      });
    });
  }
}

// ==================== FAQ Accordion ====================
function initFAQ() {
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.parentElement;
      const wasOpen = item.classList.contains('open');
      
      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
      
      if (!wasOpen) {
        item.classList.add('open');
      }
    });
  });
}

// ==================== Configurator ====================
function initConfigurator() {
  const brandSelect = document.getElementById('brand');
  const modelSelect = document.getElementById('model');
  const yearSelect = document.getElementById('year');
  const searchBtn = document.getElementById('configurator-search');
  const resultsContainer = document.getElementById('configurator-results');
  
  if (!brandSelect) return;
  
  // Populate brands
  Object.keys(carDatabase).sort().forEach(brand => {
    const option = document.createElement('option');
    option.value = brand;
    option.textContent = brand;
    brandSelect.appendChild(option);
  });
  
  brandSelect.addEventListener('change', () => {
    const brand = brandSelect.value;
    modelSelect.innerHTML = '<option value="">Wybierz model</option>';
    yearSelect.innerHTML = '<option value="">Wybierz rok</option>';
    modelSelect.disabled = !brand;
    yearSelect.disabled = true;
    
    if (brand) {
      Object.keys(carDatabase[brand]).sort().forEach(model => {
        const option = document.createElement('option');
        option.value = model;
        option.textContent = model;
        modelSelect.appendChild(option);
      });
    }
  });
  
  modelSelect.addEventListener('change', () => {
    const brand = brandSelect.value;
    const model = modelSelect.value;
    yearSelect.innerHTML = '<option value="">Wybierz rok</option>';
    yearSelect.disabled = !model;
    
    if (brand && model) {
      carDatabase[brand][model].forEach(year => {
        const option = document.createElement('option');
        option.value = year;
        option.textContent = year;
        yearSelect.appendChild(option);
      });
    }
  });
  
  searchBtn.addEventListener('click', () => {
    const brand = brandSelect.value;
    const model = modelSelect.value;
    const year = yearSelect.value;
    
    if (brand && model && year) {
      // Show random products as "compatible"
      const compatible = productsData.slice(0, 3);
      resultsContainer.innerHTML = `
        <div class="configurator-results">
          <h3 style="margin-bottom: 1rem">Kompatybilne bagażniki dla ${brand} ${model} (${year})</h3>
          <p style="color: var(--muted-foreground); margin-bottom: 2rem">Znaleziono ${compatible.length} produktów</p>
          <div class="products-grid">
            ${compatible.map(product => createProductCard(product)).join('')}
          </div>
        </div>
      `;
      attachProductCardListeners();
    }
  });
}

// ==================== Products Rendering ====================
function createProductCard(product) {
  return `
    <div class="product-card" data-id="${product.id}">
      <div class="product-image">
        <img src="${product.image}" alt="${product.name}">
        <div class="product-badge">
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
          Bestseller
        </div>
      </div>
      <div class="product-content">
        <span class="product-category">${product.category}</span>
        <h3>${product.name}</h3>
        <p class="product-description">${product.description}</p>
        <p class="product-price">${product.price.toFixed(2)} zł</p>
      </div>
      <div class="product-footer">
        <button class="btn btn-primary add-to-cart-btn">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
          Do koszyka
        </button>
      </div>
    </div>
  `;
}

function renderProducts() {
  const container = document.querySelector('.products-grid');
  if (container) {
    container.innerHTML = productsData.map(product => createProductCard(product)).join('');
    attachProductCardListeners();
  }
}

function attachProductCardListeners() {
  document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const card = btn.closest('.product-card');
      const id = card.dataset.id;
      const product = productsData.find(p => p.id === id);
      if (product) addToCart(product);
    });
  });
}

// ==================== Smooth Scroll ====================
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
}

// ==================== Initialize ====================
document.addEventListener('DOMContentLoaded', () => {
  initHeaderScroll();
  initMobileMenu();
  initFAQ();
  initConfigurator();
  initSmoothScroll();
  renderProducts();
  updateCartBadge();
  
  // Cart drawer events
  document.querySelector('.cart-overlay')?.addEventListener('click', (e) => {
    if (e.target.classList.contains('cart-overlay')) {
      closeCartDrawer();
    }
  });
  
  document.querySelector('.cart-close-btn')?.addEventListener('click', closeCartDrawer);
  document.querySelector('.cart-clear-btn')?.addEventListener('click', clearCart);
  document.querySelector('.cart-btn')?.addEventListener('click', openCartDrawer);
});
