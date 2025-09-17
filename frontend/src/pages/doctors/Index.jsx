import axios from "axios";
import React, { useState, useEffect } from "react";
import {
  FaUserMd,
  FaPlus,
  FaEdit,
  FaTrash,
  FaSearch,
  FaFilter,
  FaPhone,
  FaEnvelope,
  FaGraduationCap,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaStar,
  FaIdCard,
} from "react-icons/fa";
import { useAlert } from "../../components/AlertMessage";
import { getItemsPerPageOptions } from "../../components/itemsPerPageOptions";
import ItemsPerPageSelector from "../../components/ItemsPerPageSelector";
import PaginationControls from "../../components/PaginationControls";

const DoctorsManagement = () => {
  const [doctors, setDoctors] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterSpecialization, setFilterSpecialization] = useState("all");
  const [availabilities, setAvailabilities] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState(null);

  //pagination perpose
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(3);
  const [showItemsPerPageDropdown, setShowItemsPerPageDropdown] =
    useState(false);

  const [formData, setFormData] = useState({
    name: "",
    specialization: "",
    phone: "",
    email: "",
    qualification: "",
    experience: "",
    consultationFee: "",
    availability: "available",
    bio: "",
    address: "",
  });

  const { showAlert } = useAlert();
  const BASE_URL = "https://pos-application-qj7p.onrender.com/api";

  // বিশেষত্বের লিস্ট
  const specializations = [
    "কার্ডিওলজিস্ট",
    "নিউরোলজিস্ট",
    "অর্থোপেডিক সার্জন",
    "গাইনোকোলজিস্ট",
    "পেডিয়াট্রিশিয়ান",
    "ডার্মাটোলজিস্ট",
    "গ্যাস্ট্রোএন্টেরোলজিস্ট",
    "ইএনটি স্পেশালিস্ট",
    "আই স্পেশালিস্ট",
    "সাইকিয়াট্রিস্ট",
  ];

  // Get all Doctors
  const fetchDoctors = async ({
    searchTerm = "",
    filterSpecialization = "all",
  }) => {
    try {
      const response = await axios.get(`${BASE_URL}/doctors`, {
        params: {
          search: searchTerm,
          specialization: filterSpecialization,
        },
      });
      if (response.data) {
        setDoctors(response.data.doctors);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // First time load
  useEffect(() => {
    fetchDoctors({ searchTerm: "", filterSpecialization });
  }, []);

  // Per cahange load
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchDoctors({ searchTerm, filterSpecialization });
      setCurrentPage(0);
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, filterSpecialization]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingDoctor) {
        const response = await axios.put(
          `${BASE_URL}/doctors/${editingDoctor._id}`,
          formData
        );
        if (response.data) {
          showAlert("Success", " doctors is updated", "success");
        } else {
          showAlert("Error", "Doctors is not updated", "error");
        }
      } else {
        const response = await axios.post(`${BASE_URL}/doctors`, formData);
        if (response.data) {
          showAlert("Success", "New doctors is created", "success");
        } else {
          showAlert("Error", "Doctors is not created", "error");
        }
      }
    } catch (error) {
      console.log(error);
    }

    setIsModalOpen(false);
    setFormData({
      name: "",
      specialization: "",
      phone: "",
      email: "",
      qualification: "",
      experience: "",
      consultationFee: "",
      availability: "available",
      bio: "",
      address: "",
    });
    fetchDoctors("");
    setEditingDoctor(null);
  };

  const handleEdit = (doctor) => {
    setFormData(doctor);
    setEditingDoctor(doctor);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(`${BASE_URL}/doctors/${id}`);
      if (response.data) {
        showAlert("Success", "this doctors is deleted", "success");
        fetchDoctors("");
      } else {
        showAlert("Error", "Doctors is not delete", "error");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getAvailabilityStatus = (status) => {
    switch (status) {
      case "available":
        return { text: "উপলব্ধ", class: "bg-green-100 text-green-800" };
      case "busy":
        return { text: "ব্যস্ত", class: "bg-yellow-100 text-yellow-800" };
      case "on_leave":
        return { text: "ছুটিতে", class: "bg-red-100 text-red-800" };
      default:
        return { text: "অজানা", class: "bg-gray-100 text-gray-800" };
    }
  };

  // Pagination calculation
  const startOffset = currentPage * itemsPerPage;
  const endOffset = startOffset + itemsPerPage;
  const pageCount = Math.ceil(doctors.length / itemsPerPage);
  const currentDoctors = doctors.slice(startOffset, endOffset);

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
        <div>
          <h2 className="text-2xl font-bold text-gray-800 font-open-sans">
            ডাক্তার ব্যবস্থাপনা
          </h2>
          <p className="text-gray-600 font-roboto mt-1">
            হাসপাতালের ডাক্তারদের তালিকা পরিচালনা করুন
          </p>
        </div>
        <button
          className="flex items-center btn mt-4 md:mt-0"
          onClick={() => setIsModalOpen(true)}
        >
          <FaPlus className="mr-2" />
          নতুন ডাক্তার যোগ করুন
        </button>
      </div>

      {/* সার্চ এবং ফিল্টার বিভাগ */}
      <div className="bg-white p-4 rounded-xl shadow-sm mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="ডাক্তারের নাম, বিশেষত্ব বা qualification দিয়ে খুঁজুন..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaFilter className="text-gray-400" />
              </div>
              <select
                value={filterSpecialization}
                onChange={(e) => setFilterSpecialization(e.target.value)}
                className="block pl-10 pr-10 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">সব বিশেষত্ব</option>
                {specializations.map((spec) => (
                  <option key={spec} value={spec}>
                    {spec}
                  </option>
                ))}
              </select>
            </div>
          </div>
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

      {/* ডাক্তার কার্ড গ্রিড */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentDoctors.map((doctor) => {
          const availabilityStatus = getAvailabilityStatus(doctor.availability);
          return (
            <div
              key={doctor._id}
              className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center">
                      <FaUserMd className="h-8 w-8 text-blue-600" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-semibold text-gray-800 font-open-sans">
                        {doctor.name}
                      </h3>
                      <p className="text-sm text-blue-600 font-roboto">
                        {doctor.specialization}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${availabilityStatus.class}`}
                  >
                    {availabilityStatus.text}
                  </span>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <FaGraduationCap className="mr-2 text-gray-400" />
                    <span>{doctor.qualification}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <FaCalendarAlt className="mr-2 text-gray-400" />
                    <span>অভিজ্ঞতা: {doctor.experience}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <FaPhone className="mr-2 text-gray-400" />
                    <span>{doctor.phone}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <FaEnvelope className="mr-2 text-gray-400" />
                    <span>{doctor.email}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <FaMapMarkerAlt className="mr-2 text-gray-400" />
                    <span className="truncate">{doctor.address}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center">
                    <div className="flex items-center">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <FaStar
                          key={star}
                          className={`h-4 w-4 ${
                            star <= Math.floor(doctor.rating)
                              ? "text-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="ml-2 text-sm text-gray-600">
                      {doctor.rating}
                    </span>
                  </div>
                  <div className="text-lg font-semibold text-green-600">
                    {doctor.consultationFee} ৳
                  </div>
                </div>

                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {doctor.bio}
                </p>

                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">
                    যোগদান: {doctor.joinDate}
                  </span>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(doctor)}
                      className="text-blue-600 hover:text-blue-800 p-2 rounded-lg hover:bg-blue-50 transition-colors"
                      title="এডিট করুন"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(doctor._id)}
                      className="text-red-600 hover:text-red-800 p-2 rounded-lg hover:bg-red-50 transition-colors"
                      title="ডিলিট করুন"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {doctors.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl shadow-sm mt-6">
          <div className="inline-flex items-center justify-center rounded-full bg-gray-100 p-4 mb-4">
            <FaUserMd className="h-12 w-12 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-1 font-open-sans">
            কোন ডাক্তার পাওয়া যায়নি
          </h3>
          <p className="text-gray-500 font-roboto">
            আপনার ফিল্টারের সাথে মিলিয়ে কোন ডাক্তার পাওয়া যায়নি
          </p>
        </div>
      )}

      {/* pagination controlls */}
      <PaginationControls
        currentPage={currentPage}
        startOffset={startOffset}
        endOffset={endOffset}
        totalItems={doctors.length}
        pageCount={pageCount}
        handlePageClick={handlePageClick}
        label="Item"
      />

      {/* ডাক্তার এডিট/অ্যাড মডাল */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-4 border w-full max-w-2xl shadow-lg rounded-md bg-white">
            <div className="modal-content">
              <div className="flex justify-between items-center pb-3 border-b">
                <h3 className="text-xl font-semibold text-gray-800 font-open-sans">
                  {editingDoctor
                    ? "ডাক্তার এডিট করুন"
                    : "নতুন ডাক্তার যোগ করুন"}
                </h3>
                <button
                  onClick={() => {
                    setIsModalOpen(false);
                    setEditingDoctor(null);
                    setFormData({
                      name: "",
                      specialization: "",
                      phone: "",
                      email: "",
                      qualification: "",
                      experience: "",
                      consultationFee: "",
                      availability: "available",
                      bio: "",
                      address: "",
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
                      বিশেষত্ব *
                    </label>
                    <select
                      name="specialization"
                      value={formData.specialization}
                      onChange={handleInputChange}
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                      required
                    >
                      <option value="">বিশেষত্ব নির্বাচন করুন</option>
                      {specializations.map((spec) => (
                        <option key={spec} value={spec}>
                          {spec}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 font-open-sans">
                      ফোন নম্বর *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 font-open-sans">
                      ইমেইল *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 font-open-sans">
                      Qualification *
                    </label>
                    <input
                      type="text"
                      name="qualification"
                      value={formData.qualification}
                      onChange={handleInputChange}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 font-open-sans">
                      অভিজ্ঞতা (বছর) *
                    </label>
                    <input
                      type="text"
                      name="experience"
                      value={formData.experience}
                      onChange={handleInputChange}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 font-open-sans">
                      Consultation Fee (৳) *
                    </label>
                    <input
                      type="number"
                      name="consultationFee"
                      value={formData.consultationFee}
                      onChange={handleInputChange}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 font-open-sans">
                      Availability *
                    </label>
                    <select
                      name="availability"
                      value={formData.availability}
                      onChange={handleInputChange}
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                      required
                    >
                      <option value="available">উপলব্ধ</option>
                      <option value="busy">ব্যস্ত</option>
                      <option value="on_leave">ছুটিতে</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 font-open-sans">
                    ঠিকানা
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 font-open-sans">
                    বায়ো
                  </label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    rows="3"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="ডাক্তারের সম্পর্কে সংক্ষিপ্ত বিবরণ..."
                  />
                </div>

                <div className="flex justify-end pt-4 border-t">
                  <button
                    type="button"
                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-4 rounded-lg mr-3 transition-colors"
                    onClick={() => {
                      setIsModalOpen(false);
                      setEditingDoctor(null);
                      setFormData({
                        name: "",
                        specialization: "",
                        phone: "",
                        email: "",
                        qualification: "",
                        experience: "",
                        consultationFee: "",
                        availability: "available",
                        bio: "",
                        address: "",
                      });
                    }}
                  >
                    বাতিল
                  </button>
                  <button type="submit" className="btn">
                    {editingDoctor ? "আপডেট করুন" : "যোগ করুন"}
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

export default DoctorsManagement;
