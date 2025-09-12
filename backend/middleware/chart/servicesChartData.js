const Transaction = require("../../models/reporting/transaction.model");

exports.getServicesChartData = async (period) => {
  const serviceData = await Transaction.aggregate([
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
        _id: "$category",
        total: { $sum: "$amount" },
        count: { $sum: 1 },
      },
    },
  ]);

  return {
    labels: serviceData.map((item) => item._id),
    datasets: [
      {
        label: "সেবার পরিমাণ",
        data: serviceData.map((item) => item.count),
        backgroundColor: [
          "rgba(255, 99, 132, 0.7)",
          "rgba(54, 162, 235, 0.7)",
          "rgba(255, 206, 86, 0.7)",
          "rgba(75, 192, 192, 0.7)",
          "rgba(153, 102, 255, 0.7)",
        ],
        borderWidth: 1,
      },
    ],
  };
};
