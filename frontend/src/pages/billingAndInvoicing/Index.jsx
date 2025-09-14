import axios from "axios";
import React, { useState, useEffect } from "react";
import {
  FaFileInvoice,
  FaMoneyBillWave,
  FaPrint,
  FaDownload,
  FaSearch,
  FaPlus,
  FaTrash,
  FaUserInjured,
  FaNotesMedical,
  FaCog,
} from "react-icons/fa";
import { getItemsPerPageOptions } from "../../components/itemsPerPageOptions";
import ReactPaginate from "react-paginate";
import { useAlert } from "../../components/AlertMessage";

const BillingAndInvoicing = () => {
  const [invoices, setInvoices] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [loading, setLoading] = useState(false);
  const [earningAmount, setEarningAmount] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [showItemsPerPageDropdown, setShowItemsPerPageDropdown] =
    useState(false);

  const [formData, setFormData] = useState({
    patientId: "",
    patientName: "",
    services: [],
    totalAmount: 0,
    discount: 0,
    tax: 0,
    paidAmount: 0,
    paymentMethod: "cash",
    status: "pending",
  });

  const [serviceForm, setServiceForm] = useState({
    name: "",
    price: "",
    quantity: 1,
  });

  const { showAlert } = useAlert();

  const addService = () => {
    if (!serviceForm.name || !serviceForm.price) {
      showAlert("ত্রুটি", "সার্ভিসের নাম এবং দাম দিতে হবে", "error");
      return;
    }

    setFormData((prev) => ({
      ...prev,
      services: [...prev.services, serviceForm], // service
    }));

    // Reset input fields
    setServiceForm({ name: "", price: "", quantity: 1 });
  };

  const removeService = (index) => {
    setFormData((prev) => ({
      ...prev,
      services: prev.services.filter((_, i) => i !== index),
    }));
  };

  // Get all patients invoice
  const fetchInvoice = async (searchTerm = "") => {
    setLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:4000/api/billing-invoice/`,
        {
          params: {
            search: searchTerm,
          },
        }
      );
      if (response.data) {
        setInvoices(response.data.invoices);
      } else {
        showAlert("Error", "Data get false", "error");
      }
    } catch (error) {
      showAlert("error", error.response?.data?.message, "error");
    } finally {
      setLoading(false);
    }
  };
  // First time fetch api
  useEffect(() => {
    fetchInvoice("");
  }, []);

  // Search term change in debounce with fetch
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchInvoice(searchTerm);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  // Invoice submit handle
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `http://localhost:4000/api/billing-invoice`,
        formData
      );

      if (response.data) {
        showAlert("Success", "New invoices created", "success");

        // 🔄 modal  reset
        setFormData({
          patientId: "",
          patientName: "",
          services: [],
          totalAmount: 0,
          discount: 0,
          tax: 0,
          paidAmount: 0,
          paymentMethod: "cash",
          status: "pending",
        });

        setServiceForm({
          name: "",
          price: "",
          quantity: 1,
        });

        setIsInvoiceModalOpen(false);
      } else {
        showAlert("Error", response.data.message, "error");
      }
    } catch (error) {
      showAlert("Error", error.response?.data?.message, "error");
    }
  };

  // payment proccess
  const updatePayment = async () => {
    if (!selectedInvoice) return;

    try {
      const response = await axios.patch(
        `http://localhost:4000/api/billing-invoice/${selectedInvoice.invoiceId}/payment`,
        {
          paidAmount: formData.paidAmount,
          paymentMethod: formData.paymentMethod,
        }
      );

      // Update UI
      const updatedInvoice = response.data;
      console.log(updatedInvoice);
      setInvoices((prev) =>
        prev.map((inv) =>
          inv.invoiceId === updatedInvoice.invoiceId ? updatedInvoice : inv
        )
      );

      await earningAmounts();

      setIsPaymentModalOpen(false);
      setSelectedInvoice(null);
      showAlert("Success", "Payment updated successfully!", "success");
    } catch (error) {
      console.error(error);
      alert("Payment update failed!");
    }
  };

  //Dashoard stats calculation
  const earningAmounts = async () => {
    const response = await axios.get(
      `http://localhost:4000/api/billing-invoice/dashboard/stats`
    );
    if (response.data) {
      setEarningAmount(response.data);
    }
  };
  useEffect(() => {
    earningAmounts();
  }, [searchTerm]);

  // Pagination calculation
  const startOffset = currentPage * itemsPerPage;
  const endOffset = startOffset + itemsPerPage;
  const pageCount = Math.ceil(invoices.length / itemsPerPage);
  const currentInvoices = invoices.slice(startOffset, endOffset);

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
          বিলিং ও ইনভয়েসিং
        </h2>
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            className="flex items-center btn"
            onClick={() => setIsInvoiceModalOpen(true)}
          >
            <FaFileInvoice className="mr-2" />
            নতুন বিল তৈরি
          </button>
          <button className="flex items-center bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition-colors">
            <FaDownload className="mr-2" />
            রিপোর্ট ডাউনলোড
          </button>
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm mb-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="ইনভয়েস নম্বর বা রোগীর নাম দিয়ে খুঁজুন..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-5 rounded-xl shadow-sm">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-700 font-open-sans">
              মোট আয়
            </h3>
            <div className="p-3 bg-red-100 rounded-full">
              <FaMoneyBillWave className="h-6 w-6 text-red-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900 mt-3">
            {earningAmount.totalPrice}
          </p>
        </div>
        <div className="bg-white p-5 rounded-xl shadow-sm">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-700 font-open-sans">
              মোট
            </h3>
            <div className="p-3 bg-red-100 rounded-full">
              <FaMoneyBillWave className="h-6 w-6 text-red-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900 mt-3">
            {earningAmount.totalNetAmount}
          </p>
        </div>
        <div className="bg-white p-5 rounded-xl shadow-sm">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-700 font-open-sans">
              মোট বকেয়া
            </h3>
            <div className="p-3 bg-red-100 rounded-full">
              <FaMoneyBillWave className="h-6 w-6 text-red-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900 mt-3">
            {earningAmount.totalPendingAmount}
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-700 font-open-sans">
              আজকের আয়
            </h3>
            <div className="p-3 bg-green-100 rounded-full">
              <FaMoneyBillWave className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900 mt-3">
            {earningAmount.todayIncome}
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-700 font-open-sans">
              মোট ইনভয়েস
            </h3>
            <div className="p-3 bg-blue-100 rounded-full">
              <FaFileInvoice className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900 mt-3">
            {earningAmount.totalInvoices}
          </p>
        </div>
      </div>

      {/* Items per page selector */}
      <div className="flex justify-between items-center p-4 border-b border-gray-200">
        <div className="text-sm text-gray-600">
          মোট রোগী: {invoices.length} জন
        </div>

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
                      itemsPerPage === option ? "bg-blue-100 text-blue-800" : ""
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

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-blue-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider font-open-sans"
                >
                  ইনভয়েস নং
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider font-open-sans"
                >
                  রোগীর নাম
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider font-open-sans"
                >
                  তারিখ
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider font-open-sans"
                >
                  মোট Amount
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider font-open-sans"
                >
                  পরিশোধিত
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider font-open-sans"
                >
                  স্ট্যাটাস
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
              {currentInvoices.map((invoice, index) => (
                <tr
                  key={invoice._id}
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
                          {invoice.patientName}
                        </div>
                        <div className="text-gray-500">
                          ID: {invoice.patientId}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {invoice.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {invoice.totalAmount} ৳
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {invoice.paidAmount} ৳
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        invoice.status === "paid"
                          ? "bg-green-100 text-green-800"
                          : invoice.status === "partial"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {invoice.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      className="text-indigo-600 hover:text-indigo-900 mr-3"
                      onClick={() => {
                        setSelectedInvoice(invoice);
                        setIsPaymentModalOpen(true);
                        setFormData({
                          ...formData,
                          paidAmount: invoice.paidAmount,
                          paymentMethod: invoice.paymentMethod,
                        });
                      }}
                    >
                      <FaMoneyBillWave className="inline mr-1" /> পেমেন্ট
                    </button>

                    <button className="text-green-600 hover:text-green-900">
                      <FaPrint className="inline mr-1" /> প্রিন্ট
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {invoices.length === 0 && loading && (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center rounded-full bg-gray-100 p-4 mb-4">
              <FaFileInvoice className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1 font-open-sans">
              কোন ইনভয়েস পাওয়া যায়নি
            </h3>
            <p className="text-gray-500 font-roboto">
              এখনও কোন ইনভয়েস তৈরি করা হয়নি
            </p>
          </div>
        )}
      </div>

      {/* Pagination Controls */}
      <div className="xl:px-6 py-4 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-end xl:justify-between">
        <div className="hidden xl:block text-sm text-gray-700 mb-4 sm:mb-0">
          দেখানো হচ্ছে <span className="font-medium">{startOffset + 1}</span>{" "}
          থেকে{" "}
          <span className="font-medium">
            {Math.min(endOffset, invoices.length)}
          </span>{" "}
          এর মধ্যে, মোট <span className="font-medium">{invoices.length}</span>{" "}
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
            "py-2 rounded border border-gray-300 hover:bg-gray-50 cursor-pointer"
          }
          pageLinkClassName={"text-gray-700 px-5 py-3"}
          previousClassName={
            "py-2 rounded border border-gray-300 hover:bg-gray-50  cursor-pointer"
          }
          previousLinkClassName={"text-gray-700 px-5 py-3"}
          nextClassName={
            "py-2 rounded border border-gray-300 hover:bg-gray-50  cursor-pointer"
          }
          nextLinkClassName={"text-gray-700 px-5 py-3"}
          breakClassName={"px-3 py-2"}
          activeClassName={"bg-blue-500 text-white border-blue-500"}
          disabledClassName={"opacity-50 cursor-not-allowed"}
          forcePage={currentPage}
        />
      </div>

      {/* নতুন বিল মডাল */}
      {isInvoiceModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-4 border w-full max-w-4xl shadow-lg rounded-md bg-white">
            <div className="modal-content">
              <div className="flex justify-between items-center pb-3 border-b">
                <h3 className="text-xl font-semibold text-gray-800 font-open-sans">
                  নতুন বিল তৈরি করুন
                </h3>
                <button
                  onClick={() => setIsInvoiceModalOpen(false)}
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
                      রোগী আইডি *
                    </label>
                    <input
                      type="text"
                      name="patientId"
                      value={formData.patientId}
                      onChange={(e) =>
                        setFormData({ ...formData, patientId: e.target.value })
                      }
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 font-open-sans">
                      রোগীর নাম *
                    </label>
                    <input
                      type="text"
                      name="patientName"
                      value={formData.patientName}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          patientName: e.target.value,
                        })
                      }
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h4 className="text-lg font-medium text-gray-800 mb-3 font-open-sans">
                    পরিষেবা যোগ করুন
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1 font-open-sans">
                        পরিষেবার নাম
                      </label>
                      <input
                        type="text"
                        value={serviceForm.name}
                        onChange={(e) =>
                          setServiceForm({
                            ...serviceForm,
                            name: e.target.value,
                          })
                        }
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1 font-open-sans">
                        দাম (৳)
                      </label>
                      <input
                        type="number"
                        value={serviceForm.price}
                        onChange={(e) =>
                          setServiceForm({
                            ...serviceForm,
                            price: Number(e.target.value),
                          })
                        }
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1 font-open-sans">
                        পরিমাণ
                      </label>
                      <input
                        type="number"
                        value={serviceForm.quantity}
                        onChange={(e) =>
                          setServiceForm({
                            ...serviceForm,
                            quantity: Number(e.target.value),
                          })
                        }
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        min="1"
                      />
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={addService}
                    className="flex items-center bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded-lg transition-colors"
                  >
                    <FaPlus className="mr-2" /> পরিষেবা যোগ করুন
                  </button>
                </div>

                {formData.services.length > 0 && (
                  <div className="border rounded-lg overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider"
                          >
                            পরিষেবা
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider"
                          >
                            দাম
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider"
                          >
                            পরিমাণ
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider"
                          >
                            মোট
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider"
                          >
                            কর্ম
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {formData.services.map((service, index) => (
                          <tr key={index}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                              {service.name}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                              {service.price} ৳
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                              {service.quantity}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                              {service.price * service.quantity} ৳
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                              <button
                                type="button"
                                onClick={() => removeService(index)}
                                className="text-red-600 hover:text-red-900"
                              >
                                <FaTrash />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 font-open-sans">
                      ডিসকাউন্ট (৳)
                    </label>
                    <input
                      type="number"
                      value={formData.discount}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          discount: parseFloat(e.target.value) || 0,
                        })
                      }
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 font-open-sans">
                      ট্যাক্স (৳)
                    </label>
                    <input
                      type="number"
                      value={formData.tax}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          tax: parseFloat(e.target.value) || 0,
                        })
                      }
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <div className="flex justify-between">
                      <span className="font-medium">নিট Amount:</span>
                      <span className="font-bold">
                        {(
                          serviceForm.quantity * serviceForm.price -
                          formData.discount +
                          formData.tax
                        ).toFixed(2)}{" "}
                        ৳
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-4 border-t">
                  <button
                    type="button"
                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-4 rounded-lg mr-3 transition-colors"
                    onClick={() => setIsInvoiceModalOpen(false)}
                  >
                    বাতিল
                  </button>
                  <button type="submit" className="btn">
                    বিল তৈরি করুন
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* পেমেন্ট মডাল */}
      {isPaymentModalOpen && selectedInvoice && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-4 border w-full max-w-md shadow-lg rounded-md bg-white">
            <div className="modal-content">
              <div className="flex justify-between items-center pb-3 border-b">
                <h3 className="text-xl font-semibold text-gray-800 font-open-sans">
                  পেমেন্ট গ্রহণ করুন
                </h3>
                <button
                  onClick={() => setIsPaymentModalOpen(false)}
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

              <div className="py-4">
                <div className="bg-blue-50 p-4 rounded-lg mb-4">
                  <h4 className="font-medium text-gray-800 font-open-sans">
                    ইনভয়েস বিবরণ
                  </h4>
                  <p className="text-sm">ইনভয়েস নং: {selectedInvoice.id}</p>
                  <p className="text-sm">রোগী: {selectedInvoice.patientName}</p>
                  <div className="flex justify-between mt-2">
                    <span>মোট Amount:</span>
                    <span className="font-bold">
                      {selectedInvoice.totalAmount} ৳
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>ডিসকাউন্ট:</span>
                    <span className="font-bold">
                      -{selectedInvoice.discount} ৳
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>ট্যাক্স:</span>
                    <span className="font-bold">+{selectedInvoice.tax} ৳</span>
                  </div>
                  <div className="flex justify-between border-t mt-2 pt-2">
                    <span>পরিশোধ করতে বাকি:</span>
                    <span className="font-bold text-red-600">
                      {(
                        selectedInvoice.totalAmount -
                        selectedInvoice.discount +
                        selectedInvoice.tax -
                        selectedInvoice.paidAmount
                      ).toFixed(2)}{" "}
                      ৳
                    </span>
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1 font-open-sans">
                    পরিশোধিত Amount (৳) *
                  </label>
                  <input
                    type="number"
                    value={formData.paidAmount}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        paidAmount: parseFloat(e.target.value) || 0,
                      })
                    }
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                    max={
                      selectedInvoice.totalAmount -
                      selectedInvoice.discount +
                      selectedInvoice.tax
                    }
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1 font-open-sans">
                    পেমেন্ট পদ্ধতি *
                  </label>
                  <select
                    value={formData.paymentMethod}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        paymentMethod: e.target.value,
                      })
                    }
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                    required
                  >
                    <option value="cash">নগদ</option>
                    <option value="card">কার্ড</option>
                    <option value="bkash">bKash</option>
                    <option value="bank">ব্যাংক ট্রান্সফার</option>
                  </select>
                </div>

                <div className="flex justify-end pt-4 border-t">
                  <button
                    type="button"
                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-4 rounded-lg mr-3 transition-colors"
                    onClick={() => setIsPaymentModalOpen(false)}
                  >
                    বাতিল
                  </button>
                  <button type="button" onClick={updatePayment} className="btn">
                    পেমেন্ট নিশ্চিত করুন
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BillingAndInvoicing;
