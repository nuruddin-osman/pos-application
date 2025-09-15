const express = require("express");
const InventoryItem = require("../../models/inventory/inventory.model");
const {
  getInventoryItems,
  getInventoryItem,
  createInventoryItems,
  updateInventoryItem,
  stockUpdateInventory,
  deleteInventory,
  getInventorySummary,
} = require("../../controllers/inventoryController/inventoryController");
const router = express.Router();

// get all items
router.get("/", getInventoryItems);

// Inventory stock summary api
router.get("/summary", getInventorySummary);

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
// router.get("/dashboard/stats", async (req, res) => {
//   try {
//     const totalItems = await InventoryItem.countDocuments();

//     // minimum stock items
//     const lowStockItems = await InventoryItem.find({
//       $expr: { $lte: ["$stock", "$minStockLevel"] },
//     });

//     // out of stock items
//     const outOfStockItems = await InventoryItem.find({ stock: 0 });

//     // total price of inventorty
//     const allItems = await InventoryItem.find({});
//     const totalValue = allItems.reduce((sum, item) => {
//       return sum + item.stock * item.price;
//     }, 0);

//     // category based items number
//     const categoryStats = await InventoryItem.aggregate([
//       {
//         $group: {
//           _id: "$category",
//           count: { $sum: 1 },
//           totalValue: { $sum: { $multiply: ["$stock", "$price"] } },
//         },
//       },
//     ]);

//     res.json({
//       totalItems,
//       lowStockItems: lowStockItems.length,
//       outOfStockItems: outOfStockItems.length,
//       totalValue,
//       categoryStats,
//     });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

// Expired items check
// router.get("/alerts/expiry", async (req, res) => {
//   try {
//     const thirtyDaysFromNow = new Date();
//     thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

//     const expiringSoonItems = await InventoryItem.find({
//       expiryDate: {
//         $ne: null,
//         $lte: thirtyDaysFromNow,
//         $gte: new Date(),
//       },
//     });

//     res.json(expiringSoonItems);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

module.exports = router;
