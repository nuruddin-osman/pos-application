const express = require("express");
const Invoice = require("../../models/billingAndInvoice/billingAndInvoice.model");
const {
  getBillingInvoiceQuery,
  createBillingInvoice,
  getSingleBillingInvoice,
  paymentUpadete,
  deleteBillingInvoice,
} = require("../../controllers/billingInvoiceController/billingInvoiceController");
const router = express.Router();

// get all invoice routes
router.get("/", getBillingInvoiceQuery);

// get Single invoice routes
router.get("/:id", getSingleBillingInvoice);

// Create invoice routes
router.post("/", createBillingInvoice);

// payment Update routes
router.patch("/:id/payment", paymentUpadete);

// Invoice delete routes
router.delete("/:id", deleteBillingInvoice);

//
router.get("/dashboard/stats", async (req, res) => {
  try {
    const totalInvoices = await Invoice.countDocuments();

    const invoices = await Invoice.find();

    const totalNetAmount = invoices.reduce((sum, inv) => {
      const netAmount = inv.totalAmount - inv.discount + inv.tax;
      return sum + netAmount;
    }, 0);

    let totalPrice = 0;

    invoices.forEach((invoice) => {
      invoice.services.forEach((service) => {
        totalPrice += service.price * service.quantity;
      });
    });
    // মোট বকেয়া Amount
    const pendingInvoices = await Invoice.find({
      status: { $in: ["pending", "partial"] },
    });
    const totalPendingAmount = pendingInvoices.reduce((sum, invoice) => {
      const netAmount = invoice.totalAmount - invoice.discount + invoice.tax;
      return sum + (netAmount - invoice.paidAmount);
    }, 0);

    // আজকের আয়
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayInvoices = await Invoice.find({
      createdAt: { $gte: today, $lt: tomorrow },
      status: { $in: ["paid", "partial"] },
    });

    const todayIncome = todayInvoices.reduce((sum, invoice) => {
      return sum + invoice.paidAmount;
    }, 0);

    res.json({
      totalPrice,
      totalPendingAmount,
      todayIncome,
      totalInvoices,
      totalNetAmount,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
