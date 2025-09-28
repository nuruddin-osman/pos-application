import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import ReactPaginate from "react-paginate";
import {
  FaPlus,
  FaSearch,
  FaEdit,
  FaTrash,
  FaUserInjured,
  FaPhone,
  FaCog,
  FaEnvelope,
  FaMapMarkerAlt,
  FaNotesMedical,
} from "react-icons/fa";
import { getItemsPerPageOptions } from "../../components/itemsPerPageOptions";
import { useAlert } from "../../components/AlertMessage";
import PaginationControls from "../../components/PaginationControls";
import { useNavigate } from "react-router-dom";

const PatientManagement = () => {
  const [patients, setPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState(null);

  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [showItemsPerPageDropdown, setShowItemsPerPageDropdown] =
    useState(false);

  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "male",
    phone: "",
    email: "",
    address: "",
    bloodGroup: "",
    medicalHistory: "",
  });
  const { showAlert } = useAlert();
  const navigate = useNavigate();
  const BASE_URL = import.meta.env.VITE_API_URL;

  // Get patients and serach patients
  const fetchPatients = async (searchTerm) => {
    setLoading(true);
    try {
      const response = await axios.get(`${BASE_URL}/patients`, {
        params: {
          search: searchTerm,
        },
      });
      setPatients(response.data.patients);
    } catch (error) {
      console.error("রোগী লোড করতে সমস্যা:", error);
      showAlert("ত্রুটি", "রোগী লোড করতে সমস্যা হয়েছে", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients(searchTerm);
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchPatients(searchTerm);
      setCurrentPage(0);
    }, 500); // 500ms debounce

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingPatient) {
      // Update patients. PUT request
      const response = await axios.put(
        `${BASE_URL}/patients/${editingPatient._id}`,
        formData
      );

      if (response.data) {
        showAlert("সফল", "রোগীর তথ্য সফলভাবে আপডেট করা হয়েছে", "success");
      } else {
        showAlert(
          "ত্রুটি",
          response.data.message || "আপডেট করতে সমস্যা হয়েছে",
          "error"
        );
      }
    } else {
      // New patients add. POST request
      const response = await axios.post(`${BASE_URL}/patients`, formData);

      if (response.data) {
        showAlert("সফল", "নতুন রোগী সফলভাবে যোগ করা হয়েছে", "success");
      } else {
        showAlert(
          "ত্রুটি",
          response.data.message || "যোগ করতে সমস্যা হয়েছে",
          "error"
        );
      }
    }

    setIsModalOpen(false);
    setEditingPatient(null);
    fetchPatients(searchTerm);
  };

  const handleEdit = (patient) => {
    const token = localStorage.getItem("token");
    if (token) {
      setFormData(patient);
      setEditingPatient(patient);
      setIsModalOpen(true);
    } else {
      navigate("/login");
    }
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");
    if (token) {
      const response = await axios.delete(`${BASE_URL}/patients/${id}`);
      if (response.data) {
        showAlert("সফল", response.data.message, "success");
      } else {
        showAlert("ত্রুটি", response.data.message, "error");
      }
      fetchPatients(searchTerm);
    } else {
      navigate("/login");
    }
  };

  // Pagination calculation
  const startOffset = currentPage * itemsPerPage;
  const endOffset = startOffset + itemsPerPage;
  const pageCount = Math.ceil(patients.length / itemsPerPage);
  const currentPatients = patients.slice(startOffset, endOffset);

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

  const handleAddPatient = () => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsModalOpen(true);
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen font-inter">
      {/* Items per page selector */}

      <div className=" flex flex-col md:flex-row justify-between items-start md:items-center mb-6 bg-white p-6 rounded-xl shadow-sm">
        <h2 className="text-2xl font-bold text-gray-800 font-open-sans mb-4 md:mb-0">
          রোগী ব্যবস্থাপনা
        </h2>
        <button className="flex items-center btn" onClick={handleAddPatient}>
          <FaPlus className="mr-2" />
          নতুন রোগী যোগ করুন
        </button>
      </div>

      <div className="xl:hidden bg-white p-4 rounded-xl shadow-sm">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="রোগীর নাম বা ফোন নম্বর দিয়ে খুঁজুন..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="w-full flex justify-between items-center py-4 md:p-4 border-b border-gray-200">
        <div className="xl:w-[16%] text-sm text-gray-600">
          মোট রোগী: {patients.length} জন
        </div>
        <div className="w-[68%] hidden xl:block bg-white p-4 rounded-xl shadow-sm">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="রোগীর নাম বা ফোন নম্বর দিয়ে খুঁজুন..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="xl:w-[16%] flex justify-end">
          <div className=" relative">
            <button
              className="flex items-center px-3 py-2 border border-gray-300 rounded-md bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
              onClick={() =>
                setShowItemsPerPageDropdown(!showItemsPerPageDropdown)
              }
            >
              <FaCog className="mr-2" />
              প্রতি পেজে: {itemsPerPage}
            </button>

            {showItemsPerPageDropdown && (
              <div className="origin-top-right absolute right-0 mt-2 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 w-full">
                <div className="py-1 " role="menu" aria-orientation="vertical">
                  {itemsPerPageOptions.map((option) => (
                    <button
                      key={option}
                      className={`block px-4 py-2 text-base text-gray-700 hover:bg-gray-100 hover:text-gray-900 w-full text-left ${
                        itemsPerPage === option
                          ? "bg-blue-100 text-blue-800"
                          : ""
                      }`}
                      onClick={() => handleItemsPerPageChange(option)}
                    >
                      {option}টি আইটেম
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
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
                  আইডি
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider font-open-sans"
                >
                  নাম
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider font-open-sans"
                >
                  বয়স
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider font-open-sans"
                >
                  লিঙ্গ
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider font-open-sans"
                >
                  ফোন
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider font-open-sans"
                >
                  রক্তের গ্রুপ
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider font-open-sans"
                >
                  নিবন্ধনের তারিখ
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
              {currentPatients.map((patient, index) => (
                <tr
                  key={patient._id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {startOffset + index + 1}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <FaUserInjured className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="ml-4">
                        <div className="font-medium text-gray-900">
                          {patient.name}
                        </div>
                        <div className="text-gray-500">{patient.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {patient.age}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        patient.gender === "male"
                          ? "bg-blue-100 text-blue-800"
                          : patient.gender === "female"
                          ? "bg-pink-100 text-[#1aa33f]"
                          : "bg-pink-100 text-red-800"
                      }`}
                    >
                      {patient.gender}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    <div className="flex items-center">
                      <FaPhone className="h-4 w-4 text-gray-400 mr-1" />
                      {patient.phone}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">
                      {patient.bloodGroup}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {patient.registrationDate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      className="text-indigo-600 hover:text-indigo-900 mr-3"
                      onClick={() => handleEdit(patient)}
                    >
                      <FaEdit className="inline mr-1" /> এডিট
                    </button>
                    <button
                      className="text-red-600 hover:text-red-900"
                      onClick={() => handleDelete(patient._id)}
                    >
                      <FaTrash className="inline mr-1" /> ডিলিট
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {patients.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center rounded-full bg-gray-100 p-4 mb-4">
              <FaUserInjured className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1 font-open-sans">
              কোন রোগী পাওয়া যায়নি
            </h3>
            <p className="text-gray-500 font-roboto">
              আপনার খোঁজার সাথে মিলিয়ে কোন রোগী পাওয়া যায়নি
            </p>
          </div>
        )}
      </div>

      {/* pagination controlls */}
      <PaginationControls
        currentPage={currentPage}
        startOffset={startOffset}
        endOffset={endOffset}
        totalItems={patients.length}
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
                  {editingPatient
                    ? "রোগীর তথ্য এডিট করুন"
                    : "নতুন রোগী যোগ করুন"}
                </h3>
                <button
                  onClick={() => {
                    setIsModalOpen(false);
                    setEditingPatient(null);
                    setFormData({
                      name: "",
                      age: "",
                      gender: "male",
                      phone: "",
                      email: "",
                      address: "",
                      bloodGroup: "",
                      medicalHistory: "",
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
                      নাম *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 font-open-sans">
                      বয়স *
                    </label>
                    <input
                      type="number"
                      name="age"
                      value={formData.age}
                      onChange={handleInputChange}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 font-open-sans">
                      লিঙ্গ *
                    </label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleInputChange}
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                      required
                    >
                      <option value="male">পুরুষ</option>
                      <option value="female">মহিলা</option>
                      <option value="other">অন্যান্য</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 font-open-sans">
                      রক্তের গ্রুপ
                    </label>
                    <select
                      name="bloodGroup"
                      value={formData.bloodGroup}
                      onChange={handleInputChange}
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                    >
                      <option value="">নির্বাচন করুন</option>
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 font-open-sans">
                      ফোন নম্বর *
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaPhone className="h-4 w-4 text-gray-400" />
                      </div>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 font-open-sans">
                      ইমেইল
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaEnvelope className="h-4 w-4 text-gray-400" />
                      </div>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 font-open-sans">
                    ঠিকানা
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 pt-3 flex items-start pointer-events-none">
                      <FaMapMarkerAlt className="h-4 w-4 text-gray-400" />
                    </div>
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      rows="2"
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 font-open-sans">
                    চিকিৎসা ইতিহাস
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 pt-3 flex items-start pointer-events-none">
                      <FaNotesMedical className="h-4 w-4 text-gray-400" />
                    </div>
                    <textarea
                      name="medicalHistory"
                      value={formData.medicalHistory}
                      onChange={handleInputChange}
                      rows="3"
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="পূর্বের রোগ, অ্যালার্জি, বা অন্যান্য গুরুত্বপূর্ণ তথ্য..."
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-4 border-t">
                  <button
                    type="button"
                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-4 rounded-lg mr-3 transition-colors"
                    onClick={() => {
                      setIsModalOpen(false);
                      setEditingPatient(null);
                      setFormData({
                        name: "",
                        age: "",
                        gender: "male",
                        phone: "",
                        email: "",
                        address: "",
                        bloodGroup: "",
                        medicalHistory: "",
                      });
                    }}
                  >
                    বাতিল
                  </button>
                  <button type="submit" className="btn">
                    {editingPatient ? "আপডেট করুন" : "যোগ করুন"}
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

export default PatientManagement;
