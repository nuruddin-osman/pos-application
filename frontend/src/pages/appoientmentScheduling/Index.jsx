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
import { useAlert } from "../../components/AlertMessage";
import axios from "axios";
import ItemsPerPageSelector from "../../components/ItemsPerPageSelector";
import PaginationControls from "../../components/PaginationControls";
import { getItemsPerPageOptions } from "../../components/itemsPerPageOptions";

const AppoientmentScheduling = () => {
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [filterDoctor, setFilterDoctor] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  //pagination perpose
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [showItemsPerPageDropdown, setShowItemsPerPageDropdown] =
    useState(false);

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

  const { showAlert } = useAlert();

  const fetchAppointments = async ({
    searchTerm = "",
    filterDoctor = "all",
    filterDate,
  }) => {
    try {
      const response = await axios.get(
        `http://localhost:4000/api/appointments`,
        {
          params: {
            search: searchTerm,
            doctor: filterDoctor,
            date: filterDate,
          },
        }
      );
      if (response.data) {
        setAppointments(response.data.appointments);
      } else {
        showAlert("Error", "Data is not fetch", "error");
      }
    } catch (error) {
      console.error("অ্যাপয়েন্টমেন্ট ফেচ করতে সমস্যা:", error);
      throw error;
    }
  };

  // রোগী ফেচ করা
  const fetchPatients = async () => {
    try {
      const response = await axios.get(`http://localhost:4000/api/patients`);
      setPatients(response.data.patients);
    } catch (error) {
      console.error("রোগী ফেচ করতে সমস্যা:", error);
      throw error;
    }
  };

  // ডাক্তার ফেচ করা
  const fetchDoctors = async () => {
    try {
      const response = await axios.get(`http://localhost:4000/api/doctors`);
      setDoctors(response.data.doctors);
    } catch (error) {
      console.error("ডাক্তার ফেচ করতে সমস্যা:", error);
      throw error;
    }
  };

  // First time load
  useEffect(() => {
    fetchAppointments({ searchTerm: "", filterDoctor, filterDate });
    fetchDoctors();
    fetchPatients();
  }, []);
  // সার্চ টার্ম পরিবর্তন হলে
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      // handleSearch();
      fetchAppointments({ searchTerm, filterDoctor, filterDate });
      setCurrentPage(0);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, filterDate, filterDoctor]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (editingAppointment) {
        const response = await axios.put(
          `http://localhost:4000/api/appointments/${editingAppointment._id}`,
          formData
        );
        if (response.data) {
          showAlert(
            "Success",
            "অ্যাপয়েন্টমেন্ট সফলভাবে আপডেট হয়েছে",
            "success"
          );
        } else {
          showAlert("Error", "Data is not updated", "error");
        }
      } else {
        const response = await axios.post(
          `http://localhost:4000/api/appointments`,
          formData
        );
        if (response.data) {
          showAlert("Success", "New Appointment is created", "success");
        } else {
          showAlert("Error", "Appointment is not created", "error");
        }
      }

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
      setIsModalOpen(false);
      setEditingAppointment(null);
    } catch (error) {
      showAlert("অ্যাপয়েন্টমেন্ট সেভ করতে সমস্যা হয়েছে", "error");
    } finally {
      setIsLoading(false);
      fetchAppointments("");
    }
  };

  const handleEdit = (appointment) => {
    setFormData({
      patientId: appointment.patientId?._id || appointment.patientId,
      doctorId: appointment.doctorId?._id || appointment.doctorId,
      date: appointment.date
        ? new Date(appointment.date).toISOString().split("T")[0]
        : "",
      time: appointment.time || "",
      duration: appointment.duration || "30",
      reason: appointment.reason || "",
      status: appointment.status || "scheduled",
      notes: appointment.notes || "",
    });
    setEditingAppointment(appointment);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(
        `http://localhost:4000/api/appointments/${id}`
      );
      if (response.data) {
        showAlert(
          "Success",
          "অ্যাপয়েন্টমেন্ট সফলভাবে ডিলিট হয়েছে",
          "success"
        );
        setAppointments((prev) => prev.filter((item) => item._id !== id));
      } else {
        showAlert("Error", "Something is wrong", "error");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      const response = await axios.patch(
        `http://localhost:4000/api/appointments/${id}/status`,
        { status }
      );
      if (response.data) {
        setAppointments((prev) =>
          prev.map((appt) => (appt._id === id ? { ...appt, status } : appt))
        );
      } else {
        showAlert("Error", "Something is wrong", "error");
      }
    } catch (error) {
      console.error("স্ট্যাটাস আপডেট করতে সমস্যা:", error);
    }
  };

  // Pagination calculation
  const startOffset = currentPage * itemsPerPage;
  const endOffset = startOffset + itemsPerPage;
  const pageCount = Math.ceil(appointments.length / itemsPerPage);
  const currentDoctors = appointments.slice(startOffset, endOffset);

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  // Items per page options
  const itemsPerPageOptions = getItemsPerPageOptions();

  const handleItemsPerPageChange = (value) => {
    setItemsPerPage(value);
    setCurrentPage(0); // Reset to first page when changing items per page
    setShowItemsPerPageDropdown(false);
  };

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
              <option key={doctor._id} value={doctor._id}>
                {doctor.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Items per page selector */}
      <ItemsPerPageSelector
        totalItems={doctors.length}
        itemsPerPage={itemsPerPage}
        itemsPerPageOptions={itemsPerPageOptions}
        showDropdown={showItemsPerPageDropdown}
        setShowDropdown={setShowItemsPerPageDropdown}
        handleItemsPerPageChange={handleItemsPerPageChange}
        label="মোট আইটেম"
      />

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
              {currentDoctors.map((appointment) => (
                <tr
                  key={appointment._id}
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
                          {appointment.patientId.name}
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
                          {appointment.doctorId.name}
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
                    <div className="text-sm">{appointment.status}</div>
                    <div className="mt-2">
                      <select
                        className="text-xs border border-gray-300 rounded px-2 py-1"
                        value={appointment.status}
                        onChange={(e) =>
                          handleStatusChange(appointment._id, e.target.value)
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
                      onClick={() => handleDelete(appointment._id)}
                    >
                      <FaTrash className="inline mr-1" /> ডিলিট
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {appointments.length === 0 && (
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

      {/* pagination controlls */}
      <PaginationControls
        currentPage={currentPage}
        startOffset={startOffset}
        endOffset={endOffset}
        totalItems={appointments.length}
        pageCount={pageCount}
        handlePageClick={handlePageClick}
        label="Item"
      />

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
                        <option key={patient._id} value={patient._id}>
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
                        <option key={doctor._id} value={doctor._id}>
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
