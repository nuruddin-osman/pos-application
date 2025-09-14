import React, { useEffect, useState } from "react";
import axios from "axios";
import ReactPaginate from "react-paginate";
import {
  FaSearch,
  FaEdit,
  FaTrash,
  FaUserInjured,
  FaPhone,
  FaCog,
} from "react-icons/fa";
import { getItemsPerPageOptions } from "./itemsPerPageOptions";

const DruftApi = () => {
  const [patients, setPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(4);
  const [showItemsPerPageDropdown, setShowItemsPerPageDropdown] =
    useState(false);

  // Get patients and search patients
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
      // showAlert("ত্রুটি", "রোগী লোড করতে সমস্যা হয়েছে", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchPatients(searchTerm);
    }, 500); // 500ms debounce

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

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

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {/* Items per page selector */}
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <div className="text-sm text-gray-600">
            মোট রোগী: {patients.length} জন
          </div>
          <div className="flex items-center gap-3">
            <span>hello</span>
            <div className="relative">
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
                <div className="origin-top-right absolute right-0 mt-2 w-32 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                  <div className="py-1" role="menu" aria-orientation="vertical">
                    {itemsPerPageOptions.map((option) => (
                      <button
                        key={option}
                        className={`block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 w-full text-left ${
                          itemsPerPage === option
                            ? "bg-blue-100 text-blue-800"
                            : ""
                        }`}
                        onClick={() => handleItemsPerPageChange(option)}
                      >
                        {option} টি আইটেম
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

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

        {/* Pagination Controls */}
        <div className="px-6 py-4 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between">
          <div className="text-sm text-gray-700 mb-4 sm:mb-0">
            দেখানো হচ্ছে <span className="font-medium">{startOffset + 1}</span>{" "}
            থেকে{" "}
            <span className="font-medium">
              {Math.min(endOffset, patients.length)}
            </span>{" "}
            এর মধ্যে, মোট <span className="font-medium">{patients.length}</span>{" "}
            রোগী
          </div>

          <ReactPaginate
            previousLabel={"পূর্বের"}
            nextLabel={"পরের"}
            breakLabel={"..."}
            pageCount={pageCount}
            marginPagesDisplayed={2}
            pageRangeDisplayed={5}
            onPageChange={handlePageClick}
            containerClassName={"flex items-center space-x-2"}
            pageClassName={
              "px-3 py-2 rounded border border-gray-300 hover:bg-gray-50  cursor-pointer"
            }
            pageLinkClassName={"text-gray-700"}
            previousClassName={
              "px-3 py-2 rounded border border-gray-300 hover:bg-gray-50  cursor-pointer"
            }
            previousLinkClassName={"text-gray-700"}
            nextClassName={
              "px-3 py-2 rounded border border-gray-300 hover:bg-gray-50 cursor-pointer"
            }
            nextLinkClassName={"text-gray-700"}
            breakClassName={"px-3 py-2"}
            activeClassName={"bg-blue-500 text-white border-blue-500"}
            disabledClassName={"opacity-50 cursor-not-allowed"}
            forcePage={currentPage}
          />
        </div>
      </div>
    </>
  );
};

export default DruftApi;
