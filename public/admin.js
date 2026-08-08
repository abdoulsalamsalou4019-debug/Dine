const form = document.getElementById('productForm');
const adminProducts = document.getElementById('adminProducts');
const clearBtn = document.getElementById('clearBtn');
const nameInput = document.getElementById('name');
const categoryInput = document.getElementById('category');
const priceInput = document.getElementById('price');
const imageUrlInput = document.getElementById('imageUrl');
const imageFileInput = document.getElementById('imageFile');
const whatsappInput = document.getElementById('whatsapp');
const descriptionInput = document.getElementById('description');

let editingId = null;
let products = [];

function resetForm() {
  editingId = null;
  form.reset();
}

function createAdminCard(product) {
  const card = document.createElement('div');
  card.className = 'admin-card';
    card.innerHTML = `
    <strong>${product.name}</strong>
    <span>Catégorie : ${product.category}</span>
    <span>Prix : FCFA ${Number(product.price).toLocaleString('fr-FR')}</span>
    <span>WhatsApp : ${product.whatsapp || '0190620444'}</span>
    <div class="admin-actions">
      <button class="btn btn-secondary" type="button" data-edit="${product.id}">Modifier</button>
      <button class="btn btn-secondary" type="button" data-delete="${product.id}">Supprimer</button>
    </div>
  `;

  card.querySelector('[data-edit]').addEventListener('click', () => startEdit(product));
  card.querySelector('[data-delete]').addEventListener('click', () => deleteProduct(product.id));
  return card;
}

function renderAdminProducts() {
  adminProducts.innerHTML = '';
  if (!products.length) {
    adminProducts.innerHTML = '<p>Aucun produit pour le moment. Ajoutez-en un avec le formulaire ci-dessus.</p>';
    return;
  }
  products.forEach((product) => adminProducts.appendChild(createAdminCard(product)));
}

async function loadProducts() {
  try {
    const response = await fetch('/api/products');
    products = await response.json();
    renderAdminProducts();
  } catch (error) {
    adminProducts.innerHTML = '<p>Impossible de charger les produits.</p>';
  }
}

function startEdit(product) {
  editingId = product.id;
  nameInput.value = product.name;
  categoryInput.value = product.category;
  priceInput.value = product.price;
  imageUrlInput.value = product.imageUrl || '';
  whatsappInput.value = product.whatsapp || '0190620444';
  descriptionInput.value = product.description || '';
}

async function uploadImage(file) {
  try {
    const formData = new FormData();
    formData.append('image', file);
    const response = await fetch('/api/upload-image', {
      method: 'POST',
      body: formData
    });
    if (!response.ok) {
      const error = await response.json();
      alert(error.error || 'Échec du téléversement de l\'image');
      return null;
    }
    return await response.json();
  } catch (error) {
    alert('Image upload failed');
    return null;
  }
}

async function saveProduct(data) {
  const url = editingId ? `/api/products/${editingId}` : '/api/products';
  const method = editingId ? 'PUT' : 'POST';
  const response = await fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
  if (!response.ok) {
    const error = await response.json();
    alert(error.error || 'Impossible d\'enregistrer le produit');
    return;
  }
  resetForm();
  await loadProducts();
}

async function deleteProduct(id) {
  if (!confirm('Supprimer ce produit ?')) {
    return;
  }
  await fetch(`/api/products/${id}`, { method: 'DELETE' });
  await loadProducts();
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  let imageUrl = imageUrlInput.value.trim();
  const file = imageFileInput.files[0];
  if (file) {
    const uploadResult = await uploadImage(file);
    if (!uploadResult) {
      return;
    }
    imageUrl = uploadResult.imageUrl;
  }

  const newProduct = {
    name: nameInput.value.trim(),
    category: categoryInput.value.trim(),
    price: Number(priceInput.value),
    imageUrl: imageUrl || 'https://via.placeholder.com/640x800?text=No+Image',
    whatsapp: whatsappInput.value.trim(),
    description: descriptionInput.value.trim()
  };
  await saveProduct(newProduct);
});

clearBtn.addEventListener('click', resetForm);
loadProducts();
