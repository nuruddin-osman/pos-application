const Appointment = require("../../models/appointment/appointment.model");
const {
  getAppointmentStatusCount,
} = require("../appointment/appointmentStatusCount");

exports.generateServiceReport = async (
  startDate,
  endDate,
  subType,
  filters
) => {
  const appointments = await Appointment.find({
    date: { $gte: startDate, $lte: endDate },
  })
    .populate("doctorId", "name specialization")
    .populate("patientId", "name");

  // ডাক্তার অনুযায়ী অ্যাপয়েন্টমেন্ট
  const appointmentsByDoctor = await Appointment.aggregate([
    {
      $match: {
        date: { $gte: startDate, $lte: endDate },
      },
    },
    {
      $group: {
        _id: "$doctorId",
        count: { $sum: 1 },
        totalDuration: { $sum: "$duration" },
      },
    },
    {
      $lookup: {
        from: "doctors",
        localField: "_id",
        foreignField: "_id",
        as: "doctor",
      },
    },
  ]);

  // সার্ভিস টাইপ অনুযায়ী revenue
  const revenueByService = await Transaction.aggregate([
    {
      $match: {
        type: "income",
        date: { $gte: startDate, $lte: endDate },
      },
    },
    {
      $group: {
        _id: "$category",
        totalRevenue: { $sum: "$amount" },
        count: { $sum: 1 },
      },
    },
  ]);

  return {
    summary: {
      totalServices: appointments.length,
      totalServiceHours:
        appointments.reduce((sum, apt) => sum + apt.duration, 0) / 60,
      averageServiceDuration:
        appointments.reduce((sum, apt) => sum + apt.duration, 0) /
        (appointments.length || 1),
      totalServiceRevenue: revenueByService.reduce(
        (sum, service) => sum + service.totalRevenue,
        0
      ),
    },
    appointmentsByDoctor,
    revenueByService,
    appointmentStatus: await getAppointmentStatusCount(startDate, endDate),
    generatedAt: new Date(),
  };
};
