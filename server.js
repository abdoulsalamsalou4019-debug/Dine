const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const multer = require('multer');
const cookieParser = require('cookie-parser');

const app = express();
const PORT = process.env.PORT || 3000;
const dataDir = path.join(__dirname, 'data');
const productsFile = path.join(dataDir, 'products.json');
const uploadsDir = path.join(__dirname, 'uploads');
const ADMIN_KEY = process.env.ADMIN_KEY || 'Amsardine229';
const ADMIN_COOKIE_NAME = 'admin_access';
const ADMIN_COOKIE_VALUE = 'true';

fs.mkdirSync(uploadsDir, { recursive: true });

const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadsDir),
    filename: (req, file, cb) => {
      const timestamp = Date.now();
      const cleanName = file.originalname.toLowerCase().replace(/[^a-z0-9.-]/g, '-');
      cb(null, `${timestamp}-${cleanName}`);
    }
  }),
  limits: { fileSize: 5 * 1024 * 1024 }
});

app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static(uploadsDir));

function isAdmin(req) {
  return req.cookies[ADMIN_COOKIE_NAME] === ADMIN_COOKIE_VALUE || req.headers['x-admin-key'] === ADMIN_KEY;
}

function verifyAdminKey(req, res, next) {
  if (!isAdmin(req)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
}

function loadProducts() {
  try {
    const raw = fs.readFileSync(productsFile, 'utf8');
    return JSON.parse(raw);
  } catch (error) {
    return [];
  }
}

function saveProducts(products) {
  fs.mkdirSync(dataDir, { recursive: true });
  fs.writeFileSync(productsFile, JSON.stringify(products, null, 2), 'utf8');
}

function nextProductId(products) {
  return products.reduce((max, item) => Math.max(max, Number(item.id) || 0), 0) + 1;
}

app.get('/api/products', (req, res) => {
  const products = loadProducts();
  res.json(products);
});

app.get('/admin.html', (req, res, next) => {
  if (!isAdmin(req)) {
    return res.redirect('/admin-login.html');
  }
  res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

app.post('/admin-login', express.urlencoded({ extended: false }), (req, res) => {
  const password = req.body.password || '';
  if (password === ADMIN_KEY) {
    res.cookie(ADMIN_COOKIE_NAME, ADMIN_COOKIE_VALUE, {
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000
    });
    return res.redirect('/admin.html');
  }
  return res.status(401).redirect('/admin-login.html?error=1');
});

app.get('/logout', (req, res) => {
  res.clearCookie(ADMIN_COOKIE_NAME);
  res.redirect('/admin-login.html');
});

app.post('/api/products', verifyAdminKey, (req, res) => {
  const products = loadProducts();
  const { name, category, price, imageUrl, description, whatsapp } = req.body;
  if (!name || !category || !price) {
    return res.status(400).json({ error: 'name, category, and price are required' });
  }
  const newProduct = {
    id: String(nextProductId(products)),
    name,
    category,
    price,
    imageUrl: imageUrl || 'https://via.placeholder.com/640x800?text=No+Image',
    description: description || '',
    whatsapp: whatsapp || '0190620444'
  };
  products.push(newProduct);
  saveProducts(products);
  res.status(201).json(newProduct);
});

app.put('/api/products/:id', verifyAdminKey, (req, res) => {
  const products = loadProducts();
  const productId = req.params.id;
  const index = products.findIndex((item) => item.id === productId);
  if (index === -1) {
    return res.status(404).json({ error: 'Product not found' });
  }
  const updated = {
    ...products[index],
    ...(req.body || {})
  };
  products[index] = updated;
  saveProducts(products);
  res.json(updated);
});

app.delete('/api/products/:id', verifyAdminKey, (req, res) => {
  const products = loadProducts();
  const productId = req.params.id;
  const filtered = products.filter((item) => item.id !== productId);
  if (filtered.length === products.length) {
    return res.status(404).json({ error: 'Product not found' });
  }
  saveProducts(filtered);
  res.json({ success: true });
});

app.post('/api/upload-image', verifyAdminKey, upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No image uploaded' });
  }
  const imageUrl = `/uploads/${req.file.filename}`;
  res.json({ imageUrl });
});

app.use(express.static(path.join(__dirname, 'public')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Marketplace running on http://localhost:${PORT}`);
});
