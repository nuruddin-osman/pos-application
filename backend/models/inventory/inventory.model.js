const mongoose = require("mongoose");

const inventoryItemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    category: {
      type: String,
      required: true,
      enum: ["medicine", "equipment", "disposable", "surgical", "diagnostic"],
    },
    stock: { type: Number, required: true, min: 0 },
    price: { type: Number, required: true, min: 0 },
    supplier: { type: String, required: true },
    expiryDate: { type: Date },
    minStockLevel: { type: Number, required: true, min: 1 },
    description: { type: String },
    lastRestocked: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const InventoryItem = mongoose.model("InventoryItem", inventoryItemSchema);

module.exports = InventoryItem;
