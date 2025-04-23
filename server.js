// server.js
const express = require('express');
const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

// 🧠 Create MySQL connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'productdb',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// ✅ GET /products – Retrieve all products
app.get('/products', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM products');
    res.json(rows);
  } catch (err) {
    console.error('Error fetching products:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// ✅ POST /products – Add a new product
app.post('/products', async (req, res) => {
  const { name, quantity, price } = req.body;
  if (!name || quantity == null || price == null) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const [result] = await pool.query(
      'INSERT INTO products (name, quantity, price) VALUES (?, ?, ?)',
      [name, quantity, price]
    );
    res.status(201).json({ message: 'Product created', productId: result.insertId });
  } catch (err) {
    console.error('Error adding product:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// ✅ PUT /products – Update a product (by ID)
app.put('/products/:id', async (req, res) => {
  const { id } = req.params;
  const { name, quantity, price } = req.body;

  try {
    const [result] = await pool.query(
      'UPDATE products SET name = ?, quantity = ?, price = ? WHERE id = ?',
      [name, quantity, price, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json({ message: 'Product updated' });
  } catch (err) {
    console.error('Error updating product:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// ✅ DELETE /products/:id – Delete a product
app.delete('/products/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await pool.query('DELETE FROM products WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json({ message: 'Product deleted' });
  } catch (err) {
    console.error('Error deleting product:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// ✅ GET /products/health – Health Check
app.get('/products/health', async (req, res) => {
    res.status(200).json({ message: 'Product Service is healthy' });
});

// 🔥 Start server
app.listen(PORT, () => {
  console.log(`Product Service running on port ${PORT}`);
});
