const Transaction = require("../../models/reporting/transaction.model");

exports.generateFinancialReport = async (
  startDate,
  endDate,
  subType,
  filters
) => {
  let query = {
    date: {
      $gte: startDate,
      $lte: endDate,
    },
  };

  if (subType && subType !== "all") {
    query.type = subType;
  }

  if (filters.category && filters.category !== "all") {
    query.category = filters.category;
  }

  const transactions = await Transaction.find(query)
    .populate("patientId", "name")
    .populate("doctorId", "name");

  // মোট আয় এবং ব্যয়
  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  // ক্যাটাগরি অনুযায়ী breakdown
  const incomeByCategory = await Transaction.aggregate([
    {
      $match: {
        ...query,
        type: "income",
      },
    },
    {
      $group: {
        _id: "$category",
        total: { $sum: "$amount" },
        count: { $sum: 1 },
      },
    },
  ]);

  const expenseByCategory = await Transaction.aggregate([
    {
      $match: {
        ...query,
        type: "expense",
      },
    },
    {
      $group: {
        _id: "$category",
        total: { $sum: "$amount" },
        count: { $sum: 1 },
      },
    },
  ]);

  // মাসিক ট্রেন্ড ডেটা
  const monthlyTrend = await Transaction.aggregate([
    {
      $match: {
        date: {
          $gte: new Date(startDate.getFullYear(), startDate.getMonth() - 11, 1),
          $lte: endDate,
        },
      },
    },
    {
      $group: {
        _id: {
          year: { $year: "$date" },
          month: { $month: "$date" },
          type: "$type",
        },
        total: { $sum: "$amount" },
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
      totalIncome,
      totalExpense,
      netProfit: totalIncome - totalExpense,
      totalTransactions: transactions.length,
    },
    incomeByCategory,
    expenseByCategory,
    transactions: transactions.slice(0, 50), // Last 50 transactions
    monthlyTrend,
    generatedAt: new Date(),
  };
};
