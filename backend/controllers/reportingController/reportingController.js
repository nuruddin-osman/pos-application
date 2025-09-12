const {
  getPatientsChartData,
} = require("../../middleware/chart/patientsChartData");
const {
  getRevenueChartData,
} = require("../../middleware/chart/revenueChartData");
const {
  getServicesChartData,
} = require("../../middleware/chart/servicesChartData");
const {
  generateFinancialReport,
} = require("../../middleware/reporting/financialReport");
const {
  generatePatientReport,
} = require("../../middleware/reporting/patientReport");
const Appointment = require("../../models/appointment/appointment.model");
const Patients = require("../../models/appointment/patients.model");
const InventoryItem = require("../../models/inventory/inventory.model");
const Report = require("../../models/reporting/reporting.model");
const Transaction = require("../../models/reporting/transaction.model");

const reportGenerate = async (req, res) => {
  try {
    const {
      type,
      subType,
      period,
      startDate,
      endDate,
      filters = {},
    } = req.body;

    let reportData;
    const start = new Date(startDate);
    const end = new Date(endDate);

    // রিপোর্ট টাইপ অনুযায়ী ডেটা প্রস্তুত করা
    switch (type) {
      case "financial":
        reportData = await generateFinancialReport(
          start,
          end,
          subType,
          filters
        );
        break;
      case "patient":
        reportData = await generatePatientReport(start, end, subType, filters);
        break;
      case "inventory":
        reportData = await generateInventoryReport(
          start,
          end,
          subType,
          filters
        );
        break;
      case "service":
        reportData = await generateServiceReport(start, end, subType, filters);
        break;
      default:
        return res.status(400).json({ message: "অবৈধ রিপোর্ট টাইপ" });
    }

    // রিপোর্ট আইডি জেনারেট করা
    const reportCount = await Report.countDocuments();
    const reportId = `RPT-${new Date().getFullYear()}-${String(
      reportCount + 1
    ).padStart(4, "0")}`;

    const newReport = new Report({
      reportId,
      title: `${subType} রিপোর্ট - ${period}`,
      type,
      subType,
      period,
      startDate: start,
      endDate: end,
      data: reportData,
      generatedBy: "admin",
    });

    const savedReport = await newReport.save();
    res.status(201).json(savedReport);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getReport = async (req, res) => {
  try {
    const { type, startDate, endDate, page = 1, limit = 10 } = req.query;

    let query = {};

    if (type) {
      query.type = type;
    }

    if (startDate && endDate) {
      query.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    const reports = await Report.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Report.countDocuments(query);

    res.json({
      reports,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getSingleReport = async (req, res) => {
  try {
    const report = await Report.findOne({ reportId: req.params.id });

    if (!report) {
      return res.status(404).json({ message: "রিপোর্ট পাওয়া যায়নি" });
    }

    res.json(report);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getDashBoardSummary = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // আজকের আয়
    const todayIncome = await Transaction.aggregate([
      {
        $match: {
          type: "income",
          date: { $gte: today, $lt: tomorrow },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$amount" },
        },
      },
    ]);

    // মাসিক আয়
    const monthlyIncome = await Transaction.aggregate([
      {
        $match: {
          type: "income",
          date: { $gte: thirtyDaysAgo },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$amount" },
        },
      },
    ]);

    // আজকের রোগী
    const todayPatients = await Patients.countDocuments({
      createdAt: { $gte: today, $lt: tomorrow },
    });

    // মাসিক রোগী
    const monthlyPatients = await Patients.countDocuments({
      createdAt: { $gte: thirtyDaysAgo },
    });

    // আজকের অ্যাপয়েন্টমেন্ট
    const todayAppointments = await Appointment.countDocuments({
      date: { $gte: today, $lt: tomorrow },
    });

    // নিম্ন স্টক আইটেম
    const lowStockItems = await InventoryItem.countDocuments({
      $expr: { $lte: ["$stock", "$minStockLevel"] },
    });

    res.json({
      todayIncome: todayIncome[0]?.total || 0,
      monthlyIncome: monthlyIncome[0]?.total || 0,
      todayPatients,
      monthlyPatients,
      todayAppointments,
      lowStockItems,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getChart = async (req, res) => {
  try {
    const { type } = req.params;
    const { period = "monthly" } = req.query;

    let chartData;

    switch (type) {
      case "revenue":
        chartData = await getRevenueChartData(period);
        break;
      case "patients":
        chartData = await getPatientsChartData(period);
        break;
      case "services":
        chartData = await getServicesChartData(period);
        break;
      default:
        return res.status(400).json({ message: "অবৈধ চার্ট টাইপ" });
    }

    res.json(chartData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  reportGenerate,
  getReport,
  getSingleReport,
  getDashBoardSummary,
  getChart,
};
