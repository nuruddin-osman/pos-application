const Appointment = require("../../models/appointment/appointment.model");

exports.getAppointmentStatusCount = async (startDate, endDate) => {
  return await Appointment.aggregate([
    {
      $match: {
        date: { $gte: startDate, $lte: endDate },
      },
    },
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
      },
    },
  ]);
};
