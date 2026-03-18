const db = require("../db");
// ADD OR UPDATE INVENTORY

exports.addInventory = (req, res) => {

  const { product_id, stock_quantity } = req.body;

  if (!product_id || !stock_quantity) {
    return res.status(400).send({
      success: false,
      message: "product_id and stock_quantity are required"
    });
  }

  const sql = `
    INSERT INTO inventory(product_id, stock_quantity)
    VALUES (?, ?)
    ON DUPLICATE KEY UPDATE
    stock_quantity = stock_quantity + ?
  `;

  db.query(sql, [product_id, stock_quantity, stock_quantity], (err, result) => {

    if (err) {
      console.log("Inventory error:", err);
      return res.status(500).send(err);
    }

    res.send({
      success: true,
      message: "Inventory added/updated successfully"
    });

  });

};

// GET INVENTORY

exports.getInventory = (req, res) => {

  const sql = `
    SELECT 
      p.product_id,
      p.product_name,
      p.price,
      i.stock_quantity
    FROM inventory i
    JOIN products p
    ON i.product_id = p.product_id
  `;

  db.query(sql, (err, result) => {

    if (err) {
      console.log("Inventory fetch error:", err);
      return res.status(500).send(err);
    }

    res.send(result);

  });

};