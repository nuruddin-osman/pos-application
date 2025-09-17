const Appointment = require("../../models/appointment/appointment.model");
const Doctor = require("../../models/doctors/doctors.model");

const PaientsManagement = require("../../models/patient-management/patient_management.model");
const { v4: uuidv4 } = require("uuid");

const getAllAppointment = async (req, res) => {
  try {
    const { search, date, doctor, status } = req.query;

    let query = {};

    //  Date filter
    if (date) {
      const parsedDate = new Date(date);

      if (!isNaN(parsedDate)) {
        const startDate = new Date(parsedDate);
        startDate.setHours(0, 0, 0, 0);

        const endDate = new Date(parsedDate);
        endDate.setHours(23, 59, 59, 999);

        query.date = {
          $gte: startDate,
          $lte: endDate,
        };
      }
    }

    // doctors filter
    if (doctor) {
      query.doctorId = doctor;
    }

    // status filter
    if (status) {
      query.status = status;
    }

    // Filter with patients name or desease
    if (search) {
      const patients = await PaientsManagement.find({
        name: { $regex: search, $options: "i" },
      });

      query.$or = [
        { reason: { $regex: search, $options: "i" } },
        { patientId: { $in: patients.map((p) => p._id) } },
      ];
    }

    const appointments = await Appointment.find(query)
      .populate("patientId", "name phone")
      .populate("doctorId", "name specialization")
      .sort({ date: 1, time: 1 });

    const total = await Appointment.countDocuments(query);

    res.json({
      appointments,
      total,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getSingleAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate("patientId")
      .populate("doctorId");

    if (!appointment) {
      return res
        .status(404)
        .json({ message: "অ্যাপয়েন্টমেন্ট পাওয়া যায়নি" });
    }

    res.json(appointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createAppointment = async (req, res) => {
  try {
    const { patientId, doctorId, date, time, duration, reason, status, notes } =
      req.body;

    // frontend থেকে আসা তারিখ parse করা
    // যদি mm/dd/yy আসে → mm/dd/yyyy এ convert করতে হবে
    let dateObject;

    if (date.includes("/")) {
      // ধরুন 09/16/25 → 2025 বানাতে হবে
      const parts = date.split("/"); // [09, 16, 25]
      let [month, day, year] = parts;

      // year ছোট হলে 20 যোগ করা
      if (year.length === 2) {
        year = "20" + year;
      }

      dateObject = new Date(`${year}-${month}-${day}`); // yyyy-mm-dd
    } else {
      // fallback: সরাসরি new Date()
      dateObject = new Date(date);
    }

    // date valid কিনা check
    if (isNaN(dateObject.getTime())) {
      return res.status(400).json({
        message:
          "অবৈধ তারিখ ফরম্যাট। অনুগ্রহ করে mm/dd/yyyy ফরম্যাটে তারিখ প্রদান করুন",
      });
    }

    // appointment ID generate
    const appointmentId = `APT-${new Date().getFullYear()}-${uuidv4().slice(
      0,
      8
    )}`;

    // time slot availability check
    const existingAppointment = await Appointment.findOne({
      doctorId,
      date: dateObject,
      time,
      status: { $in: ["scheduled", "confirmed"] },
    });

    if (existingAppointment) {
      return res.status(400).json({
        message: "এই সময় স্লটটি ইতিমধ্যেই বুক করা আছে",
      });
    }

    const newAppointment = new Appointment({
      appointmentId,
      patientId,
      doctorId,
      date: dateObject,
      time,
      duration: duration || 30,
      reason,
      status: status || "scheduled",
      notes,
      createdBy: "admin",
    });

    const savedAppointment = await newAppointment.save();
    const populatedAppointment = await Appointment.findById(
      savedAppointment._id
    )
      .populate("patientId", "name phone")
      .populate("doctorId", "name specialization");

    res.status(201).json({ populatedAppointment, savedAppointment });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateAppointment = async (req, res) => {
  try {
    const { patientId, doctorId, date, time, duration, reason, status, notes } =
      req.body;

    // time slot availability check (without current appointment)
    if (doctorId || date || time) {
      const existingAppointment = await Appointment.findOne({
        _id: { $ne: req.params.id },
        doctorId: doctorId || req.body.doctorId,
        date: date ? new Date(date) : req.body.date,
        time: time || req.body.time,
        status: { $in: ["scheduled", "confirmed"] },
      });

      if (existingAppointment) {
        return res.status(400).json({
          message: "এই সময় স্লটটি ইতিমধ্যেই বুক করা আছে",
        });
      }
    }

    const updatedAppointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      {
        patientId,
        doctorId,
        date: date ? new Date(date) : undefined,
        time,
        duration,
        reason,
        status,
        notes,
      },
      { new: true, runValidators: true }
    )
      .populate("patientId", "name phone")
      .populate("doctorId", "name specialization");

    if (!updatedAppointment) {
      return res
        .status(404)
        .json({ message: "অ্যাপয়েন্টমেন্ট পাওয়া যায়নি" });
    }

    res.json(updatedAppointment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const appointmentStatusUpdate = async (req, res) => {
  try {
    const { status } = req.body;

    const updatedAppointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    )
      .populate("patientId", "name phone")
      .populate("doctorId", "name specialization");

    if (!updatedAppointment) {
      return res
        .status(404)
        .json({ message: "অ্যাপয়েন্টমেন্ট পাওয়া যায়নি" });
    }

    res.json(updatedAppointment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteAppointment = async (req, res) => {
  try {
    const deletedAppointment = await Appointment.findByIdAndDelete(
      req.params.id
    );

    if (!deletedAppointment) {
      return res
        .status(404)
        .json({ message: "অ্যাপয়েন্টমেন্ট পাওয়া যায়নি" });
    }

    res.json({ message: "অ্যাপয়েন্টমেন্ট ডিলিট করা হয়েছে" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getDoctorsAvility = async (req, res) => {
  try {
    const { date } = req.query;
    const doctorId = req.params.id;

    if (!date) {
      return res.status(400).json({ message: "তারিখ প্রয়োজন" });
    }

    const selectedDate = new Date(date);
    const dayOfWeek = selectedDate.toLocaleDateString("en-US", {
      weekday: "long",
    });

    // Doctors availability check
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ message: "ডাক্তার পাওয়া যায়নি" });
    }

    if (!doctor.availableDays.includes(dayOfWeek)) {
      return res.json({ available: false, slots: [] });
    }

    // previous booking slot
    const bookedAppointments = await Appointment.find({
      doctorId,
      date: {
        $gte: new Date(selectedDate.setHours(0, 0, 0, 0)),
        $lt: new Date(selectedDate.setHours(23, 59, 59, 999)),
      },
      status: { $in: ["scheduled", "confirmed"] },
    });

    const bookedSlots = bookedAppointments.map((apt) => apt.time);

    // available slot generator
    const availableSlots = [];
    const startTime = 9; // 9 AM
    const endTime = 17; // 5 PM
    const slotDuration = 30; // minutes

    for (let hour = startTime; hour < endTime; hour++) {
      for (let minute = 0; minute < 60; minute += slotDuration) {
        const timeString = `${hour.toString().padStart(2, "0")}:${minute
          .toString()
          .padStart(2, "0")}`;

        if (!bookedSlots.includes(timeString)) {
          availableSlots.push(timeString);
        }
      }
    }

    res.json({ available: true, slots: availableSlots });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const upcomingAppointment = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const upcomingAppointments = await Appointment.find({
      date: { $gte: today },
      status: { $in: ["scheduled", "confirmed"] },
    })
      .populate("patientId", "name phone")
      .populate("doctorId", "name specialization")
      .sort({ date: 1, time: 1 })
      .limit(10);

    res.json(upcomingAppointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllAppointment,
  getSingleAppointment,
  createAppointment,
  updateAppointment,
  appointmentStatusUpdate,
  deleteAppointment,
  getDoctorsAvility,
  upcomingAppointment,
};
