import React, { useState, useEffect } from "react";
import {
  FaPlus,
  FaSearch,
  FaEdit,
  FaTrash,
  FaCalendarAlt,
  FaUserMd,
  FaUserInjured,
  FaClock,
  FaStethoscope,
  FaNotesMedical,
} from "react-icons/fa";

const AppoientmentScheduling = () => {
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [filterDoctor, setFilterDoctor] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState(null);
  const [formData, setFormData] = useState({
    patientId: "",
    doctorId: "",
    date: "",
    time: "",
    duration: "30",
    reason: "",
    status: "scheduled",
    notes: "",
  });

  // নমুনা ডেটা -在实际应用中，这将来自API
  useEffect(() => {
    const sampleDoctors = [
      {
        id: 1,
        name: "ডাঃ আহমেদ হাসান",
        specialization: "কার্ডিওলজিস্ট",
        availableDays: ["সোম", "মঙ্গল", "বুধ", "বৃহস্পতি"],
      },
      {
        id: 2,
        name: "ডাঃ সুলতানা আক্তার",
        specialization: "গাইনোকোলজিস্ট",
        availableDays: ["মঙ্গল", "বুধ", "শুক্র", "শনি"],
      },
      {
        id: 3,
        name: "ডাঃ রফিকুল ইসলাম",
        specialization: "অর্থোপেডিক সার্জন",
        availableDays: ["সোম", "বুধ", "শুক্র", "রবি"],
      },
      {
        id: 4,
        name: "ডাঃ ফারহানা খান",
        specialization: "পেডিয়াট্রিশিয়ান",
        availableDays: ["সোম", "মঙ্গল", "বৃহস্পতি", "শনি"],
      },
    ];

    const samplePatients = [
      { id: 1, name: "রহিম মিয়া", phone: "01712345678" },
      { id: 2, name: "সালমা খাতুন", phone: "01898765432" },
      { id: 3, name: "আব্দুল্লাহ আল মামুন", phone: "01911223344" },
      { id: 4, name: "নাসরিন আক্তার", phone: "01556789012" },
    ];

    const sampleAppointments = [
      {
        id: 1,
        patientId: 1,
        doctorId: 1,
        date: "২০২৩-১১-১০",
        time: "১০:৩০",
        duration: "30",
        reason: "হার্টের চেকআপ",
        status: "confirmed",
        notes: "রোগীর পূর্বে হার্ট অ্যাটাকের ইতিহাস আছে",
        createdAt: "২০২৩-১১-০৫",
      },
      {
        id: 2,
        patientId: 2,
        doctorId: 2,
        date: "২০২৩-১১-১১",
        time: "১১:০০",
        duration: "45",
        reason: "নিয়মিত চেকআপ",
        status: "scheduled",
        notes: "",
        createdAt: "২০২৩-১১-০৬",
      },
      {
        id: 3,
        patientId: 3,
        doctorId: 3,
        date: "২০২৩-১১-১২",
        time: "০৯:১৫",
        duration: "60",
        reason: "হাঁটুর ব্যথা",
        status: "completed",
        notes: "এক্স-রে রিপোর্ট নিয়ে আসতে বলেছেন",
        createdAt: "২০২৩-১১-০৭",
      },
      {
        id: 4,
        patientId: 4,
        doctorId: 4,
        date: "২০২৩-১1-১০",
        time: "১৪:০০",
        duration: "30",
        reason: "শিশুর জ্বর",
        status: "cancelled",
        notes: "রোগী বাড়িতে ভালো আছে, পরবর্তী সময়ে আসবে",
        createdAt: "২০২৩-১১-০৮",
      },
    ];

    setDoctors(sampleDoctors);
    setPatients(samplePatients);
    setAppointments(sampleAppointments);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingAppointment) {
      // এডিট মোড
      const updatedAppointments = appointments.map((appointment) =>
        appointment.id === editingAppointment.id
          ? { ...formData, id: editingAppointment.id }
          : appointment
      );
      setAppointments(updatedAppointments);
    } else {
      // নতুন অ্যাপয়েন্টমেন্ট যোগ করুন
      const newAppointment = {
        id: appointments.length + 1,
        ...formData,
        createdAt: new Date().toLocaleDateString("bn-BD"),
      };
      setAppointments([...appointments, newAppointment]);
    }
    setIsModalOpen(false);
    setFormData({
      patientId: "",
      doctorId: "",
      date: "",
      time: "",
      duration: "30",
      reason: "",
      status: "scheduled",
      notes: "",
    });
    setEditingAppointment(null);
  };

  const handleEdit = (appointment) => {
    setFormData(appointment);
    setEditingAppointment(appointment);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("আপনি কি এই অ্যাপয়েন্টমেন্টটি ডিলিট করতে চান?")) {
      const updatedAppointments = appointments.filter(
        (appointment) => appointment.id !== id
      );
      setAppointments(updatedAppointments);
    }
  };

  const handleStatusChange = (id, newStatus) => {
    const updatedAppointments = appointments.map((appointment) =>
      appointment.id === id
        ? { ...appointment, status: newStatus }
        : appointment
    );
    setAppointments(updatedAppointments);
  };

  const getPatientName = (patientId) => {
    const patient = patients.find((p) => p.id === parseInt(patientId));
    return patient ? patient.name : "অজানা রোগী";
  };

  const getDoctorName = (doctorId) => {
    const doctor = doctors.find((d) => d.id === parseInt(doctorId));
    return doctor ? doctor.name : "অজানা ডাক্তার";
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      scheduled: { color: "bg-blue-100 text-blue-800", text: "শিডিউল্ড" },
      confirmed: { color: "bg-green-100 text-green-800", text: "কনফার্মড" },
      completed: { color: "bg-purple-100 text-purple-800", text: "সম্পন্ন" },
      cancelled: { color: "bg-red-100 text-red-800", text: "বাতিল" },
      noshow: { color: "bg-yellow-100 text-yellow-800", text: "অনুপস্থিত" },
    };

    const config = statusConfig[status] || statusConfig.scheduled;
    return (
      <span
        className={`px-2 py-1 text-xs font-medium rounded-full ${config.color}`}
      >
        {config.text}
      </span>
    );
  };

  const filteredAppointments = appointments.filter((appointment) => {
    const matchesSearch =
      getPatientName(appointment.patientId)
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      getDoctorName(appointment.doctorId)
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      appointment.reason.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDate = filterDate ? appointment.date === filterDate : true;
    const matchesDoctor = filterDoctor
      ? appointment.doctorId === parseInt(filterDoctor)
      : true;

    return matchesSearch && matchesDate && matchesDoctor;
  });

  return (
    <div className="p-6 bg-gray-50 min-h-screen font-inter">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 bg-white p-6 rounded-xl shadow-sm">
        <h2 className="text-2xl font-bold text-gray-800 font-open-sans mb-4 md:mb-0">
          অ্যাপয়েন্টমেন্ট সময়সূচী
        </h2>
        <button
          className="flex items-center btn"
          onClick={() => setIsModalOpen(true)}
        >
          <FaPlus className="mr-2" />
          নতুন অ্যাপয়েন্টমেন্ট
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-xl shadow-sm">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="রোগী, ডাক্তার বা কারণ দিয়ে খুঁজুন..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm">
          <label className="block text-sm font-medium text-gray-700 mb-1 font-open-sans">
            তারিখ দ্বারা ফিল্টার
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaCalendarAlt className="text-gray-400" />
            </div>
            <input
              type="date"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
            />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm">
          <label className="block text-sm font-medium text-gray-700 mb-1 font-open-sans">
            ডাক্তার দ্বারা ফিল্টার
          </label>
          <select
            className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={filterDoctor}
            onChange={(e) => setFilterDoctor(e.target.value)}
          >
            <option value="">সব ডাক্তার</option>
            {doctors.map((doctor) => (
              <option key={doctor.id} value={doctor.id}>
                {doctor.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-blue-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider font-open-sans"
                >
                  তারিখ ও সময়
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider font-open-sans"
                >
                  রোগী
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider font-open-sans"
                >
                  ডাক্তার
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider font-open-sans"
                >
                  কারণ
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider font-open-sans"
                >
                  স্থিতি
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider font-open-sans"
                >
                  কর্ম
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAppointments.map((appointment) => (
                <tr
                  key={appointment.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {appointment.date}
                    </div>
                    <div className="text-sm text-gray-500 flex items-center">
                      <FaClock className="h-3 w-3 text-gray-400 mr-1" />
                      {appointment.time} ({appointment.duration} মিনিট)
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <FaUserInjured className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="ml-4">
                        <div className="font-medium text-gray-900">
                          {getPatientName(appointment.patientId)}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-green-100 rounded-full flex items-center justify-center">
                        <FaUserMd className="h-5 w-5 text-green-600" />
                      </div>
                      <div className="ml-4">
                        <div className="font-medium text-gray-900">
                          {getDoctorName(appointment.doctorId)}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      {appointment.reason}
                    </div>
                    {appointment.notes && (
                      <div className="text-sm text-gray-500 flex items-start mt-1">
                        <FaNotesMedical className="h-3 w-3 text-gray-400 mr-1 mt-0.5" />
                        {appointment.notes}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm">
                      {getStatusBadge(appointment.status)}
                    </div>
                    <div className="mt-2">
                      <select
                        className="text-xs border border-gray-300 rounded px-2 py-1"
                        value={appointment.status}
                        onChange={(e) =>
                          handleStatusChange(appointment.id, e.target.value)
                        }
                      >
                        <option value="scheduled">শিডিউল্ড</option>
                        <option value="confirmed">কনফার্মড</option>
                        <option value="completed">সম্পন্ন</option>
                        <option value="cancelled">বাতিল</option>
                        <option value="noshow">অনুপস্থিত</option>
                      </select>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      className="text-indigo-600 hover:text-indigo-900 mr-3"
                      onClick={() => handleEdit(appointment)}
                    >
                      <FaEdit className="inline mr-1" /> এডিট
                    </button>
                    <button
                      className="text-red-600 hover:text-red-900"
                      onClick={() => handleDelete(appointment.id)}
                    >
                      <FaTrash className="inline mr-1" /> ডিলিট
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredAppointments.length === 0 && (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center rounded-full bg-gray-100 p-4 mb-4">
              <FaCalendarAlt className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1 font-open-sans">
              কোন অ্যাপয়েন্টমেন্ট পাওয়া যায়নি
            </h3>
            <p className="text-gray-500 font-roboto">
              আপনার ফিল্টারের সাথে মিলিয়ে কোন অ্যাপয়েন্টমেন্ট পাওয়া যায়নি
            </p>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-4 border w-full max-w-2xl shadow-lg rounded-md bg-white">
            <div className="modal-content">
              <div className="flex justify-between items-center pb-3 border-b">
                <h3 className="text-xl font-semibold text-gray-800 font-open-sans">
                  {editingAppointment
                    ? "অ্যাপয়েন্টমেন্ট এডিট করুন"
                    : "নতুন অ্যাপয়েন্টমেন্ট যোগ করুন"}
                </h3>
                <button
                  onClick={() => {
                    setIsModalOpen(false);
                    setEditingAppointment(null);
                    setFormData({
                      patientId: "",
                      doctorId: "",
                      date: "",
                      time: "",
                      duration: "30",
                      reason: "",
                      status: "scheduled",
                      notes: "",
                    });
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    ></path>
                  </svg>
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 py-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 font-open-sans">
                      রোগী *
                    </label>
                    <select
                      name="patientId"
                      value={formData.patientId}
                      onChange={handleInputChange}
                      className="mt-1 block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      required
                    >
                      <option value="">রোগী নির্বাচন করুন</option>
                      {patients.map((patient) => (
                        <option key={patient.id} value={patient.id}>
                          {patient.name} - {patient.phone}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 font-open-sans">
                      ডাক্তার *
                    </label>
                    <select
                      name="doctorId"
                      value={formData.doctorId}
                      onChange={handleInputChange}
                      className="mt-1 block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      required
                    >
                      <option value="">ডাক্তার নির্বাচন করুন</option>
                      {doctors.map((doctor) => (
                        <option key={doctor.id} value={doctor.id}>
                          {doctor.name} - {doctor.specialization}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 font-open-sans">
                      তারিখ *
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaCalendarAlt className="h-4 w-4 text-gray-400" />
                      </div>
                      <input
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleInputChange}
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 font-open-sans">
                      সময় *
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaClock className="h-4 w-4 text-gray-400" />
                      </div>
                      <input
                        type="time"
                        name="time"
                        value={formData.time}
                        onChange={handleInputChange}
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 font-open-sans">
                      স্থিতিকাল (মিনিট) *
                    </label>
                    <select
                      name="duration"
                      value={formData.duration}
                      onChange={handleInputChange}
                      className="mt-1 block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      required
                    >
                      <option value="15">15 মিনিট</option>
                      <option value="30">30 মিনিট</option>
                      <option value="45">45 মিনিট</option>
                      <option value="60">60 মিনিট</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 font-open-sans">
                    অ্যাপয়েন্টমেন্টের কারণ *
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 pt-3 flex items-start pointer-events-none">
                      <FaStethoscope className="h-4 w-4 text-gray-400" />
                    </div>
                    <textarea
                      name="reason"
                      value={formData.reason}
                      onChange={handleInputChange}
                      rows="2"
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 font-open-sans">
                      স্থিতি
                    </label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className="mt-1 block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="scheduled">শিডিউল্ড</option>
                      <option value="confirmed">কনফার্মড</option>
                      <option value="completed">সম্পন্ন</option>
                      <option value="cancelled">বাতিল</option>
                      <option value="noshow">অনুপস্থিত</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 font-open-sans">
                      নোটস
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 pt-3 flex items-start pointer-events-none">
                        <FaNotesMedical className="h-4 w-4 text-gray-400" />
                      </div>
                      <textarea
                        name="notes"
                        value={formData.notes}
                        onChange={handleInputChange}
                        rows="2"
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-4 border-t">
                  <button
                    type="button"
                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-4 rounded-lg mr-3 transition-colors"
                    onClick={() => {
                      setIsModalOpen(false);
                      setEditingAppointment(null);
                      setFormData({
                        patientId: "",
                        doctorId: "",
                        date: "",
                        time: "",
                        duration: "30",
                        reason: "",
                        status: "scheduled",
                        notes: "",
                      });
                    }}
                  >
                    বাতিল
                  </button>
                  <button type="submit" className="btn">
                    {editingAppointment ? "আপডেট করুন" : "যোগ করুন"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppoientmentScheduling;
