const db = require("../db");

exports.createOrder = (req, res) => {

  const { customer_name, product_id, quantity } = req.body;               //take data send by user

  if (!customer_name || !product_id || !quantity) {                      //check if anything is misssing
    return res.send({
      success: false,
      message: "Missing fields"
    });
  }
  //check for duplicate order
  const checkOrder = `  
  SELECT * FROM orders o
  JOIN order_items oi ON o.order_id = oi.order_id
  WHERE o.customer_name = ?
  AND oi.product_id = ?
  AND o.status = 'Created'
  `;

  db.query(checkOrder, [customer_name, product_id], (err, result) => {

    if (err) return res.status(500).send(err);

    if (result.length > 0) {
      return res.send({
        success: false,
        message: "Order already exists for this product"
      });
    }

    const orderRef = "ORD-" + Date.now();                                       //order reference create unique number

    db.beginTransaction((err) => {                                              //fully complete or none

      if (err) return res.status(500).send(err);

      db.query(
        "SELECT stock_quantity FROM inventory WHERE product_id=?",
        [product_id],
        (err, stockResult) => {

          if (err) return db.rollback(() => res.status(500).send(err));        
          if (stockResult.length === 0) {                                          //product not found then rollback
            return db.rollback(() =>
              res.send({
                success: false,
                message: "Product not found"
              })
            );
          }

          const stock = stockResult[0].stock_quantity;

          if (stock < quantity) {                                                 //if stock is not enough rollback
            return db.rollback(() =>
              res.send({
                success: false,
                message: "Not enough stock"
              })
            );
          }

          // Create new order
          db.query(
            "INSERT INTO orders(order_reference, customer_name, order_date, status) VALUES(?,?,NOW(),'Created')",
            [orderRef, customer_name],
            (err, orderResult) => {

              if (err) return db.rollback(() => res.status(500).send(err));

              const orderId = orderResult.insertId;

              db.query(
                "INSERT INTO order_items(order_id, product_id, quantity) VALUES(?,?,?)",
                [orderId, product_id, quantity],
                (err) => {

                  if (err) return db.rollback(() => res.status(500).send(err));

                  db.query(
                    "UPDATE inventory SET stock_quantity = stock_quantity - ? WHERE product_id=?",     //stock decrease after order
                    [quantity, product_id],
                    (err) => {

                      if (err) return db.rollback(() => res.status(500).send(err));

                      db.commit((err) => {

                        if (err) return db.rollback(() => res.status(500).send(err));

                        res.send({
                          success: true,
                          message: "Order created successfully"                                     //save everything permanently
                        });

                      });

                    }
                  );

                }
              );

            }
          );

        }
      );

    });

  });

};

// GET ALL ORDERS

exports.getOrders = (req, res) => {
                                                                              //joining all three table to get full order details
  const sql = `
  SELECT 
    o.order_id,
    o.order_reference,
    o.customer_name,
    o.order_date,
    o.status,
    p.product_name,
    oi.quantity
  FROM orders o
  JOIN order_items oi ON o.order_id = oi.order_id
  JOIN products p ON oi.product_id = p.product_id
  ORDER BY o.order_date DESC
  `;

  db.query(sql, (err, result) => {

    if (err) return res.status(500).send(err);

    res.send(result);

  });

};

// UPDATE ORDER STATUS

exports.updateOrderStatus = (req, res) => {

  const orderId = req.params.id;                                  //get data
  const { status } = req.body;

  if (!status) {
    return res.send({
      success: false,
      message: "Status required"
    });
  }

  const sql = `
  UPDATE orders
  SET status = ?
  WHERE order_id = ?
  `;

  db.query(sql, [status, orderId], (err) => {

    if (err) return res.status(500).send(err);

    res.send({
      success: true,
      message: "Order status updated"
    });

  });

};