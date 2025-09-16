const express = require("express");
const InventoryItem = require("../../models/inventory/inventory.model");
const {
  getInventoryItems,
  getInventoryItem,
  createInventoryItems,
  updateInventoryItem,
  stockUpdateInventory,
  deleteInventory,
  getDashboardStats,
} = require("../../controllers/inventoryController/inventoryController");
const router = express.Router();

// get all items
router.get("/", getInventoryItems);

// get single items
router.get("/:id", getInventoryItem);

// create items
router.post("/", createInventoryItems);

// update items
router.put("/:id", updateInventoryItem);

// stock update api
router.patch("/:id/stock", stockUpdateInventory);

// items delete
router.delete("/:id", deleteInventory);

// Statistics for dashboard
router.get("/dashboard/stats", getDashboardStats);

// Expired items check
router.get("/alerts/expiry", async (req, res) => {
  try {
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

    const expiringSoonItems = await InventoryItem.find({
      expiryDate: {
        $ne: null,
        $lte: thirtyDaysFromNow,
        $gte: new Date(),
      },
    });

    res.json({ expiringSoonItems });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
