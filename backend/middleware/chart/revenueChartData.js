const Transaction = require("../../models/reporting/transaction.model");

exports.getRevenueChartData = async (period) => {
  const groupByFormat = period === "monthly" ? "%Y-%m" : "%Y-%m-%d";
  const dateFormat = period === "monthly" ? "YYYY-MM" : "YYYY-MM-DD";

  const revenueData = await Transaction.aggregate([
    {
      $match: {
        type: "income",
        date: {
          $gte: new Date(new Date().setMonth(new Date().getMonth() - 11)),
        },
      },
    },
    {
      $group: {
        _id: {
          $dateToString: { format: dateFormat, date: "$date" },
        },
        income: {
          $sum: {
            $cond: [{ $eq: ["$type", "income"] }, "$amount", 0],
          },
        },
        expense: {
          $sum: {
            $cond: [{ $eq: ["$type", "expense"] }, "$amount", 0],
          },
        },
      },
    },
    {
      $sort: { _id: 1 },
    },
  ]);

  return {
    labels: revenueData.map((item) => item._id),
    datasets: [
      {
        label: "আয়",
        data: revenueData.map((item) => item.income),
        backgroundColor: "rgba(54, 162, 235, 0.5)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 2,
      },
      {
        label: "ব্যয়",
        data: revenueData.map((item) => item.expense),
        backgroundColor: "rgba(255, 99, 132, 0.5)",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 2,
      },
    ],
  };
};
