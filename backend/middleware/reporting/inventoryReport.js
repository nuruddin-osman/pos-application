const InventoryItem = require("../../models/inventory/inventory.model");

exports.generateInventoryReport = async (
  startDate,
  endDate,
  subType,
  filters
) => {
  let query = {};

  if (filters.category && filters.category !== "all") {
    query.category = filters.category;
  }

  const inventoryItems = await InventoryItem.find(query);
  const lowStockItems = inventoryItems.filter(
    (item) => item.stock <= item.minStockLevel
  );
  const outOfStockItems = inventoryItems.filter((item) => item.stock === 0);

  // ক্যাটাগরি অনুযায়ী ইনভেন্টরি মূল্য
  const inventoryValueByCategory = await InventoryItem.aggregate([
    {
      $group: {
        _id: "$category",
        totalValue: { $sum: { $multiply: ["$stock", "$price"] } },
        totalItems: { $sum: 1 },
        lowStockItems: {
          $sum: {
            $cond: [{ $lte: ["$stock", "$minStockLevel"] }, 1, 0],
          },
        },
      },
    },
  ]);

  // ইনভেন্টরি ব্যবহার ট্রেন্ড
  const usageTrend = await Transaction.aggregate([
    {
      $match: {
        category: "medication_purchase",
        date: { $gte: startDate, $lte: endDate },
      },
    },
    {
      $group: {
        _id: {
          year: { $year: "$date" },
          month: { $month: "$date" },
        },
        totalAmount: { $sum: "$amount" },
        count: { $sum: 1 },
      },
    },
    {
      $sort: {
        "_id.year": 1,
        "_id.month": 1,
      },
    },
  ]);

  return {
    summary: {
      totalItems: inventoryItems.length,
      totalInventoryValue: inventoryItems.reduce(
        (sum, item) => sum + item.stock * item.price,
        0
      ),
      lowStockItems: lowStockItems.length,
      outOfStockItems: outOfStockItems.length,
    },
    inventoryValueByCategory,
    lowStockItems: lowStockItems.map((item) => ({
      name: item.name,
      currentStock: item.stock,
      minStockLevel: item.minStockLevel,
      needed: item.minStockLevel - item.stock,
    })),
    usageTrend,
    generatedAt: new Date(),
  };
};
