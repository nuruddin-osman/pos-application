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

const DruftApi = () => {
  const [patients, setPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);

  // Get patients and serach patients
  const fetchPatients = async (searchTerm) => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:4000/api/patients`, {
        params: {
          search: searchTerm,
        },
      });

      setPatients(response.data.patients);
    } catch (error) {
      console.error("রোগী লোড করতে সমস্যা:", error);
      alert("রোগী লোড করতে সমস্যা হয়েছে");
    } finally {
      setLoading(false);
    }
  };

  // কম্পোনেন্ট মাউন্ট হলে রোগীদের লোড করুন
  useEffect(() => {
    fetchPatients(searchTerm);
  }, []);

  // সার্চ টার্ম পরিবর্তন হলে রোগীদের আবার লোড করুন (Debounce সহ)
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchPatients(searchTerm);
    }, 500); // 500ms debounce

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* সার্চ ইনপুট */}
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

      {/* লোডিং স্টেট */}
      {loading && (
        <div className="text-center py-8">
          <p>লোড হচ্ছে...</p>
        </div>
      )}

      {/* রোগীদের তালিকা */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-blue-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                নাম
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                ফোন
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                বয়স
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                লিঙ্গ
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {patients.map((patient) => (
              <tr key={patient._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <FaUserInjured className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="ml-4">
                      <div className="font-medium text-gray-900">
                        {patient.name}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <FaPhone className="h-4 w-4 text-gray-400 mr-1" />
                    {patient.phone}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{patient.age}</td>
                <td className="px-6 py-4 whitespace-nowrap">
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
              </tr>
            ))}
          </tbody>
        </table>

        {/* কোন রোগী না পাওয়া গেলে */}
        {patients.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center rounded-full bg-gray-100 p-4 mb-4">
              <FaUserInjured className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">
              কোন রোগী পাওয়া যায়নি
            </h3>
            <p className="text-gray-500">
              আপনার খোঁজার সাথে মিলিয়ে কোন রোগী পাওয়া যায়নি
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DruftApi;
