const productsGrid = document.getElementById('products');
const categorySelect = document.getElementById('categorySelect');
const searchInput = document.getElementById('searchInput');
let products = [];

function formatPrice(value) {
  return `FCFA ${Number(value).toLocaleString('fr-FR')}`;
}

function createCard(product) {
  const card = document.createElement('article');
  card.className = 'card';
  card.innerHTML = `
    <img class="product-image" src="${product.imageUrl || 'https://via.placeholder.com/640x800?text=No+Image'}" alt="${product.name}" />
    <div class="card-body">
      <span class="product-category">${product.category}</span>
      <h3 class="product-title">${product.name}</h3>
      <p class="product-description">${product.description || 'Stylé et prêt à commander.'}</p>
      <div class="product-footer">
        <span class="price">${formatPrice(product.price)}</span>
        <a class="btn btn-primary" href="https://wa.me/${product.whatsapp || '0190620444'}?text=Hello%20I%20want%20this%20product%20${encodeURIComponent(product.name)}" target="_blank" rel="noopener noreferrer">
          Chat WhatsApp
        </a>
      </div>
    </div>
  `;
  return card;
}

function renderProducts(items) {
  productsGrid.innerHTML = '';
    if (!items.length) {
    productsGrid.innerHTML = '<p>Aucun produit trouvé. Ajoutez des articles dans l\'administration.</p>';
    return;
  }
  items.forEach((product) => productsGrid.appendChild(createCard(product)));
}

function updateCategories() {
  const categories = Array.from(new Set(products.map((p) => p.category))).sort();
  categorySelect.innerHTML = '<option value="all">Tous</option>' + categories.map((category) => `<option value="${category}">${category}</option>`).join('');
}

function getFilteredProducts() {
  const query = searchInput.value.trim().toLowerCase();
  const selected = categorySelect.value;
  return products.filter((product) => {
    const textMatch = `${product.name} ${product.description}`.toLowerCase().includes(query);
    const categoryMatch = selected === 'all' || product.category === selected;
    return textMatch && categoryMatch;
  });
}

async function loadProducts() {
  try {
    const response = await fetch('/api/products');
    products = await response.json();
    updateCategories();
    renderProducts(getFilteredProducts());
  } catch (error) {
    productsGrid.innerHTML = '<p>Impossible de charger les produits pour le moment.</p>';
  }
}

searchInput.addEventListener('input', () => renderProducts(getFilteredProducts()));
categorySelect.addEventListener('change', () => renderProducts(getFilteredProducts()));

loadProducts();
