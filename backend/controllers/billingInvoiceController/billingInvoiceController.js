const Invoice = require("../../models/billingAndInvoice/billingAndInvoice.model");

// get all invoice controller
const getBillingInvoiceQuery = async (req, res) => {
  try {
    const { search, page = 1, limit = 10 } = req.query;

    let query = {};
    if (search) {
      query = {
        $or: [
          { patientName: { $regex: search, $options: "i" } },
          { invoiceId: { $regex: search, $options: "i" } },
        ],
      };
    }

    const invoices = await Invoice.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await Invoice.countDocuments(query);

    res.json({
      invoices,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// get Single invoice controller
const getSingleBillingInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.findOne({ invoiceId: req.params.id });
    if (!invoice) {
      return res.status(404).json({ message: "ইনভয়েস পাওয়া যায়নি" });
    }
    res.json(invoice);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create invoice controller
const createBillingInvoice = async (req, res) => {
  try {
    const {
      patientId,
      patientName,
      services,
      discount = 0,
      tax = 0,
      paidAmount = 0,
      paymentMethod = "cash",
    } = req.body;

    // total Amount calculate
    const totalAmount = services.reduce((sum, service) => {
      return sum + service.price * service.quantity;
    }, 0);

    // Status identify
    const netAmount = totalAmount - discount + tax;
    let status = "pending";
    if (paidAmount >= netAmount) {
      status = "paid";
    } else if (paidAmount > 0) {
      status = "partial";
    }

    // Invoice id generate
    const currentYear = new Date().getFullYear();
    const invoiceCount = await Invoice.countDocuments();
    const invoiceId = `INV-${currentYear}-${String(invoiceCount + 1).padStart(
      3,
      "0"
    )}`;

    const newInvoice = new Invoice({
      invoiceId,
      patientId,
      patientName,
      services,
      totalAmount,
      discount,
      tax,
      paidAmount,
      paymentMethod,
      status,
    });

    const savedInvoice = await newInvoice.save();
    res.status(201).json(savedInvoice);
  } catch (error) {
    res.status(400).json({ message: error.message, status: false });
  }
};

// payment Update controller
const paymentUpadete = async (req, res) => {
  try {
    const { paidAmount, paymentMethod } = req.body;
    const invoice = await Invoice.findOne({ invoiceId: req.params.id });

    if (!invoice) {
      return res.status(404).json({ message: "ইনভয়েস পাওয়া যায়নি" });
    }

    const netAmount = invoice.totalAmount - invoice.discount + invoice.tax;
    let status = "pending";
    if (paidAmount >= netAmount) {
      status = "paid";
    } else if (paidAmount > 0) {
      status = "partial";
    }

    const updatedInvoice = await Invoice.findOneAndUpdate(
      { invoiceId: req.params.id },
      {
        paidAmount,
        paymentMethod,
        status,
      },
      { new: true }
    );

    res.json(updatedInvoice);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Invoice delete controller
const deleteBillingInvoice = async (req, res) => {
  try {
    const deletedInvoice = await Invoice.findOneAndDelete({
      invoiceId: req.params.id,
    });
    if (!deletedInvoice) {
      return res.status(404).json({ message: "ইনভয়েস পাওয়া যায়নি" });
    }
    res.json({ message: "ইনভয়েস ডিলিট করা হয়েছে" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getBillingInvoiceQuery,
  getSingleBillingInvoice,
  createBillingInvoice,
  paymentUpadete,
  deleteBillingInvoice,
};
