import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  FaPlus,
  FaSearch,
  FaEdit,
  FaTrash,
  FaUserInjured,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaNotesMedical,
} from "react-icons/fa";

const PatientManagement = () => {
  const [patients, setPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState(null);
  const [loading, setLoading] = useState(false);
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

  // API base URL
  const API_BASE_URL = 'http://localhost:5000/api';

  // রোগীদের লোড করার ফাংশন
  const loadPatients = async (search = "") => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/patients?search=${search}`);
      setPatients(response.data.patients);
    } catch (error) {
      console.error('রোগী লোড করতে সমস্যা:', error);
      alert('রোগী লোড করতে সমস্যা হয়েছে');
    } finally {
      setLoading(false);
    }
  };

  // কম্পোনেন্ট মাউন্ট হলে রোগীদের লোড করুন
  useEffect(() => {
    loadPatients();
  }, []);

  // সার্চ টার্ম পরিবর্তন হলে রোগীদের আবার লোড করুন
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      loadPatients(searchTerm);
    }, 500);

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
    
    try {
      if (editingPatient) {
        // এডিট মোড
        await axios.put(`${API_BASE_URL}/patients/${editingPatient._id}`, formData);
        alert('রোগীর তথ্য সফলভাবে আপডেট করা হয়েছে');
      } else {
        // নতুন রোগী যোগ করুন
        await axios.post(`${API_BASE_URL}/patients`, formData);
        alert('নতুন রোগী সফলভাবে যোগ করা হয়েছে');
      }
      
      // ফর্ম রিসেট এবং মোডাল বন্ধ করুন
      setIsModalOpen(false);
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
      setEditingPatient(null);
      
      // রোগীদের তালিকা রিফ্রেশ করুন
      loadPatients(searchTerm);
    } catch (error) {
      console.error('ত্রুটি:', error);
      alert(error.message || 'কিছু একটা সমস্যা হয়েছে');
    }
  };

  const handleEdit = (patient) => {
    setFormData({
      name: patient.name,
      age: patient.age,
      gender: patient.gender,
      phone: patient.phone,
      email: patient.email || "",
      address: patient.address || "",
      bloodGroup: patient.bloodGroup || "",
      medicalHistory: patient.medicalHistory || "",
    });
    setEditingPatient(patient);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("আপনি কি এই রোগীর তথ্য ডিলিট করতে চান?")) {
      try {
        await axios.delete(`${API_BASE_URL}/patients/${id}`);
        alert('রোগী ডিলিট করা হয়েছে');
        loadPatients(searchTerm);
      } catch (error) {
        console.error('ডিলিট করতে সমস্যা:', error);
        alert('রোগী ডিলিট করতে সমস্যা হয়েছে');
      }
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen font-inter">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 bg-white p-6 rounded-xl shadow-sm">
        <h2 className="text-2xl font-bold text-gray-800 font-open-sans mb-4 md:mb-0">
          রোগী ব্যবস্থাপনা
        </h2>
        <button
          className="flex items-center btn"
          onClick={() => setIsModalOpen(true)}
        >
          <FaPlus className="mr-2" />
          নতুন রোগী যোগ করুন
        </button>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm mb-6">
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

      {loading && (
        <div className="bg-white p-4 rounded-xl shadow-sm mb-6 text-center">
          <p>লোড হচ্ছে...</p>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-blue-50">
              <tr>
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
              {patients.map((patient) => (
                <tr
                  key={patient._id}
                  className="hover:bg-gray-50 transition-colors"
                >
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
                          : "bg-pink-100 text-pink-800"
                      }`}
                    >
                      {patient.gender === "male" ? "পুরুষ" : "মহিলা"}
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
                    {new Date(patient.registrationDate).toLocaleDateString('bn-BD')}
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

      {/* মোডাল ফর্ম একই থাকবে */}
      {isModalOpen && (
        // ... আপনার মোডাল ফর্ম কোড এখানে থাকবে
      )}
    </div>
  );
};

export default PatientManagement;