const InventoryItem = require("../../models/inventory/inventory.model");

// get all items controller
const getInventoryItems = async (req, res) => {
  try {
    const {
      search,
      category,
      lowStock,
      page = 1,
      limit = 10,
      sortBy = "name",
      sortOrder = "asc",
    } = req.query;

    let query = {};

    // search filter
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { supplier: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    // category filter
    if (category && category !== "all") {
      query.category = category;
    }

    // Low stock filter
    if (lowStock === "true") {
      query.$expr = { $lte: ["$stock", "$minStockLevel"] };
    }

    // sorting
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === "asc" ? 1 : -1;

    const items = await InventoryItem.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort(sortOptions);

    const total = await InventoryItem.countDocuments(query);

    res.json({
      items,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// get single items controller
const getInventoryItem = async (req, res) => {
  try {
    const item = await InventoryItem.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: "আইটেম পাওয়া যায়নি" });
    }
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// create items controller
const createInventoryItems = async (req, res) => {
  try {
    const {
      name,
      category,
      stock,
      price,
      supplier,
      expiryDate,
      minStockLevel,
      description,
    } = req.body;

    const newItem = new InventoryItem({
      name,
      category,
      stock,
      price,
      supplier,
      expiryDate: expiryDate || null,
      minStockLevel,
      description,
    });

    const savedItem = await newItem.save();
    res.status(201).json(savedItem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// update items controller
const updateInventoryItem = async (req, res) => {
  try {
    const {
      name,
      category,
      stock,
      price,
      supplier,
      expiryDate,
      minStockLevel,
      description,
    } = req.body;

    const updatedItem = await InventoryItem.findByIdAndUpdate(
      req.params.id,
      {
        name,
        category,
        stock,
        price,
        supplier,
        expiryDate: expiryDate || null,
        minStockLevel,
        description,
      },
      { new: true, runValidators: true }
    );

    if (!updatedItem) {
      return res.status(404).json({ message: "আইটেম পাওয়া যায়নি" });
    }

    res.json(updatedItem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// stock update api controller
const stockUpdateInventory = async (req, res) => {
  try {
    const { stock, action = "set" } = req.body;

    const item = await InventoryItem.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: "আইটেম পাওয়া যায়নি" });
    }

    let newStock = item.stock;
    if (action === "set") {
      newStock = stock;
    } else if (action === "add") {
      newStock = item.stock + stock;
    } else if (action === "subtract") {
      newStock = item.stock - stock;
      if (newStock < 0) newStock = 0;
    }

    item.stock = newStock;
    item.lastRestocked = new Date();

    const updatedItem = await item.save();
    res.json(updatedItem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// items delete controller
const deleteInventory = async (req, res) => {
  try {
    const deletedItem = await InventoryItem.findByIdAndDelete(req.params.id);
    if (!deletedItem) {
      return res.status(404).json({ message: "আইটেম পাওয়া যায়নি" });
    }
    res.json({ message: "আইটেম ডিলিট করা হয়েছে" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// get Dashboard Stats summary controller
const getDashboardStats = async (req, res) => {
  try {
    const totalItems = await InventoryItem.countDocuments();

    // minimum stock items
    const lowStockItems = await InventoryItem.find({
      $expr: { $lte: ["$stock", "$minStockLevel"] },
    });

    // out of stock items
    const outOfStockItems = await InventoryItem.find({ stock: 0 });

    // total price of inventorty
    const allItems = await InventoryItem.find({});
    const totalValue = allItems.reduce((sum, item) => {
      return sum + item.stock * item.price;
    }, 0);

    // category based items number
    const categoryStats = await InventoryItem.aggregate([
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
          totalValue: { $sum: { $multiply: ["$stock", "$price"] } },
          lowStock: {
            $sum: {
              $cond: [{ $lte: ["$stock", "$minStockLevel"] }, 1, 0],
            },
          },
          outOfStock: {
            $sum: {
              $cond: [{ $eq: ["$stock", 0] }, 1, 0],
            },
          },
        },
      },
    ]);

    res.json({
      totalItems,
      lowStockItems: lowStockItems.length,
      outOfStockItems: outOfStockItems.length,
      totalValue,
      categoryStats,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getInventoryItems,
  getInventoryItem,
  createInventoryItems,
  updateInventoryItem,
  stockUpdateInventory,
  deleteInventory,
  getDashboardStats,
};
