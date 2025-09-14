const PaientsManagement = require("../../models/patient-management/patient_management.model");

//patients query controller
const PaientsManagementSearchQuery = async (req, res) => {
  try {
    const { search } = req.query;

    let query = {};

    // Searce functionality
    if (search) {
      query = {
        $or: [
          { name: { $regex: search, $options: "i" } },
          { phone: { $regex: search, $options: "i" } },
        ],
      };
    }

    const patients = await PaientsManagement.find(query).sort({
      createdAt: -1,
    });

    const total = await PaientsManagement.countDocuments(query);

    res.json({
      status: "success",
      patients,
      total,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//patients create controller
const createPaientsManagement = async (req, res) => {
  try {
    const {
      name,
      age,
      gender,
      phone,
      email,
      address,
      bloodGroup,
      medicalHistory,
    } = req.body;

    // Phone number is all ready used check
    const existingPatient = await PaientsManagement.findOne({ phone });
    if (existingPatient) {
      return res
        .status(400)
        .json({ message: "এই ফোন নম্বরটি ইতিমধ্যে রয়েছে" });
    }

    const patient = new PaientsManagement({
      name,
      age,
      gender,
      phone,
      email,
      address,
      bloodGroup,
      medicalHistory,
    });

    const newPatient = await patient.save();
    res.status(201).json({ status: true, newPatient });
  } catch (error) {
    res.status(400).json({ status: false, message: error.message });
  }
};

const getSinglePaientsManagement = async (req, res) => {
  try {
    const patient = await PaientsManagement.findById(req.params.id);
    if (!patient) {
      return res
        .status(404)
        .json({ status: false, message: "রোগী পাওয়া যায়নি" });
    }
    res.json({ status: true, patient });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//patients update controller
const updatePaientsManagement = async (req, res) => {
  try {
    const {
      name,
      age,
      gender,
      phone,
      email,
      address,
      bloodGroup,
      medicalHistory,
    } = req.body;

    // Phone number already have an use check in onther patients
    const existingPatient = await PaientsManagement.findOne({
      phone,
      _id: { $ne: req.params.id },
    });

    if (existingPatient) {
      return res.status(400).json({ message: "এই ফোন নম্বরটি অন্য রোগীর আছে" });
    }

    const updatedPatient = await PaientsManagement.findByIdAndUpdate(
      req.params.id,
      {
        name,
        age,
        gender,
        phone,
        email,
        address,
        bloodGroup,
        medicalHistory,
      },
      { new: true, runValidators: true }
    );

    if (!updatedPatient) {
      return res.status(404).json({ message: "রোগী পাওয়া যায়নি" });
    }

    res.json(updatedPatient);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

//patients delete controller
const deletePaientsManagement = async (req, res) => {
  try {
    const patient = await PaientsManagement.findByIdAndDelete(req.params.id);

    if (!patient) {
      return res.status(404).json({ message: "রোগী পাওয়া যায়নি" });
    }

    res.json({ message: "রোগী ডিলিট করা হয়েছে" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  PaientsManagementSearchQuery,
  createPaientsManagement,
  getSinglePaientsManagement,
  updatePaientsManagement,
  deletePaientsManagement,
};
