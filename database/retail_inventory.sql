create DATABASE retail_inventory;
USE retail_inventory;

CREATE TABLE products(
    product_id INT AUTO_INCREMENT PRIMARY KEY,
    product_name VARCHAR(100),
    price DECIMAL(10,2)
);

CREATE TABLE inventory(
    inventory_id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT UNIQUE,
    stock_quantity INT CHECK (stock_quantity >= 0),
    FOREIGN KEY(product_id) REFERENCES products(product_id)
);

CREATE TABLE orders(
    order_id INT AUTO_INCREMENT PRIMARY KEY,
    order_reference VARCHAR(100) NOT NULL UNIQUE,
    customer_name VARCHAR(100),
    order_date DATETIME,
    status VARCHAR(50) DEFAULT 'Created'
);

CREATE TABLE order_items(
    order_item_id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT,
    product_id INT,
    quantity INT,
    FOREIGN KEY(order_id) REFERENCES orders(order_id),
    FOREIGN KEY(product_id) REFERENCES products(product_id)
);

CREATE INDEX idx_product_id_inventory 
ON inventory(product_id);

CREATE INDEX idx_order_items_order 
ON order_items(order_id);

CREATE INDEX idx_order_items_product 
ON order_items(product_id);
USE retail_inventory;

ALTER USER 'root'@'localhost'
IDENTIFIED WITH mysql_native_password
BY 'root123';
FLUSH PRIVILEGES;


