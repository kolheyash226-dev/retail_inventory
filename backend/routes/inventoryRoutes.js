const express = require("express");
const router = express.Router();
const inventoryController = require("../controllers/inventoryController");

router.post("/add", inventoryController.addInventory);
router.get("/", inventoryController.getInventory);

module.exports = router;