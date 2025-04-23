-- init.sql

CREATE DATABASE IF NOT EXISTS productdb;
USE productdb;
DROP TABLE IF EXISTS products;

CREATE TABLE products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  quantity INT NOT NULL DEFAULT 0,
  price DECIMAL(10,2) NOT NULL
);

INSERT INTO products (name, quantity, price) VALUES
('Wireless Mouse', 50, 19.99),
('Mechanical Keyboard', 30, 89.99),
('USB-C Cable', 100, 9.99),
('Laptop Stand', 40, 29.99),
('Webcam 1080p', 25, 49.99),
('Noise Cancelling Headphones', 20, 149.99),
('Monitor 27"', 15, 229.99),
('Portable SSD 1TB', 35, 119.99),
('Smartphone Tripod', 60, 24.99),
('Bluetooth Speaker', 45, 39.99);
