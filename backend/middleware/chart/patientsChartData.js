const Patients = require("../../models/appointment/patients.model");

exports.getPatientsChartData = async (period) => {
  const dateFormat = period === "monthly" ? "YYYY-MM" : "YYYY-MM-DD";

  const patientData = await Patients.aggregate([
    {
      $match: {
        createdAt: {
          $gte: new Date(new Date().setMonth(new Date().getMonth() - 11)),
        },
      },
    },
    {
      $group: {
        _id: {
          $dateToString: { format: dateFormat, date: "$createdAt" },
        },
        count: { $sum: 1 },
      },
    },
    {
      $sort: { _id: 1 },
    },
  ]);

  return {
    labels: patientData.map((item) => item._id),
    datasets: [
      {
        label: "রোগীর সংখ্যা",
        data: patientData.map((item) => item.count),
        backgroundColor: "rgba(75, 192, 192, 0.5)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 2,
        tension: 0.3,
      },
    ],
  };
};
