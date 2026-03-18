const db = require("../db");

// ADD PRODUCT

exports.addProduct = (req, res) => {

  const { product_name, price } = req.body;

  // Validation
  if (!product_name || !price) {
    return res.status(400).send({
      success: false,
      message: "product_name and price are required"
    });
  }

  const sql = "INSERT INTO products(product_name, price) VALUES (?, ?)";

  db.query(sql, [product_name, price], (err, result) => {

    if (err) {
      console.log("Product insert error:", err);
      return res.status(500).send(err);
    }

    console.log("Product inserted ID:", result.insertId);

    res.send({
      success: true,
      message: "Product added successfully",
      product_id: result.insertId
    });

  });

};
// GET ALL PRODUCTS

exports.getProducts = (req, res) => {

  const sql = "SELECT * FROM products";

  db.query(sql, (err, result) => {

    if (err) {
      console.log("Fetch products error:", err);
      return res.status(500).send(err);
    }

    res.send(result);

  });

};