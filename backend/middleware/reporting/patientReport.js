const Appointment = require("../../models/appointment/appointment.model");
const Patients = require("../../models/appointment/patients.model");
const {
  getAppointmentStatusCount,
} = require("../appointment/appointmentStatusCount");

exports.generatePatientReport = async (
  startDate,
  endDate,
  subType,
  filters
) => {
  let query = {
    createdAt: {
      $gte: startDate,
      $lte: endDate,
    },
  };

  if (filters.department && filters.department !== "all") {
    //在实际应用中, এটি ডিপার্টমেন্ট দ্বারা ফিল্টার করবে
  }

  const patients = await Patients.find(query);
  const appointments = await Appointment.find({
    date: { $gte: startDate, $lte: endDate },
  }).populate("patientId", "name gender dateOfBirth");

  // রোগী নিবন্ধন ট্রেন্ড
  const registrationTrend = await Patient.aggregate([
    {
      $match: {
        createdAt: {
          $gte: new Date(startDate.getFullYear(), startDate.getMonth() - 11, 1),
          $lte: endDate,
        },
      },
    },
    {
      $group: {
        _id: {
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" },
        },
        count: { $sum: 1 },
      },
    },
    {
      $sort: {
        "_id.year": 1,
        "_id.month": 1,
      },
    },
  ]);

  // বয়স গ্রুপ অনুযায়ী রোগী
  const ageGroups = await Patients.aggregate([
    {
      $match: query,
    },
    {
      $group: {
        _id: {
          $switch: {
            branches: [
              {
                case: {
                  $lte: [
                    { $subtract: [new Date(), "$dateOfBirth"] },
                    18 * 365 * 24 * 60 * 60 * 1000,
                  ],
                },
                then: "0-18",
              },
              {
                case: {
                  $lte: [
                    { $subtract: [new Date(), "$dateOfBirth"] },
                    30 * 365 * 24 * 60 * 60 * 1000,
                  ],
                },
                then: "19-30",
              },
              {
                case: {
                  $lte: [
                    { $subtract: [new Date(), "$dateOfBirth"] },
                    45 * 365 * 24 * 60 * 60 * 1000,
                  ],
                },
                then: "31-45",
              },
              {
                case: {
                  $lte: [
                    { $subtract: [new Date(), "$dateOfBirth"] },
                    60 * 365 * 24 * 60 * 60 * 1000,
                  ],
                },
                then: "46-60",
              },
            ],
            default: "60+",
          },
        },
        count: { $sum: 1 },
      },
    },
  ]);

  // লিঙ্গ অনুযায়ী রোগী
  const genderDistribution = await Patients.aggregate([
    {
      $match: query,
    },
    {
      $group: {
        _id: "$gender",
        count: { $sum: 1 },
      },
    },
  ]);

  return {
    summary: {
      totalPatients: patients.length,
      totalAppointments: appointments.length,
      newPatients: patients.filter(
        (p) => p.createdAt >= startDate && p.createdAt <= endDate
      ).length,
      averageAppointmentsPerPatient:
        appointments.length / (patients.length || 1),
    },
    registrationTrend,
    ageGroups,
    genderDistribution,
    appointmentsByStatus: await getAppointmentStatusCount(startDate, endDate),
    generatedAt: new Date(),
  };
};
