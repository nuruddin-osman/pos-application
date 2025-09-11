import React, { useState, useEffect } from "react";
import {
  FaPlus,
  FaSearch,
  FaEdit,
  FaTrash,
  FaBox,
  FaShoppingCart,
  FaExclamationTriangle,
  FaFilter,
  FaArrowUp,
  FaArrowDown,
  FaEye,
} from "react-icons/fa";

const InventoryManagement = () => {
  const [inventory, setInventory] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [filterCategory, setFilterCategory] = useState("all");
  const [lowStockFilter, setLowStockFilter] = useState(false);
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });
  const [formData, setFormData] = useState({
    name: "",
    category: "medicine",
    stock: "",
    price: "",
    supplier: "",
    expiryDate: "",
    minStockLevel: "",
    description: "",
  });

  // ক্যাটাগরি লিস্ট
  const categories = [
    { value: "medicine", label: "ঔষধ" },
    { value: "equipment", label: "মেডিকেল সরঞ্জাম" },
    { value: "disposable", label: "ডিসপোজেবল" },
    { value: "surgical", label: "সার্জিক্যাল" },
    { value: "diagnostic", label: "ডায়াগনস্টিক" },
  ];

  // নমুনা ডেটা
  useEffect(() => {
    const sampleInventory = [
      {
        id: 1,
        name: "প্যারাসিটামল ট্যাবলেট",
        category: "medicine",
        stock: 150,
        price: 5.5,
        supplier: "স্কয়ার ফার্মা",
        expiryDate: "২০২৪-১২-১৫",
        minStockLevel: 50,
        description: "৫০০ মিগ্রা, ১০০ ট্যাবলেট প্রতি প্যাক",
      },
      {
        id: 2,
        name: "স্যালাইন ড্রিপ",
        category: "disposable",
        stock: 75,
        price: 85.0,
        supplier: "অ্যাপোলো হসপিটালস",
        expiryDate: "২০২৪-০৮-২০",
        minStockLevel: 30,
        description: "৫০০ মিলি, স্টেরাইল",
      },
      {
        id: 3,
        name: "স্ট্রেচার",
        category: "equipment",
        stock: 5,
        price: 12500.0,
        supplier: "মেডিকেল ইকুইপমেন্ট লিমিটেড",
        expiryDate: "N/A",
        minStockLevel: 2,
        description: "এডজাস্টেবল হাইট, অ্যালুমিনিয়াম ফ্রেম",
      },
      {
        id: 4,
        name: "ব্লাড প্রেশার মনিটর",
        category: "diagnostic",
        stock: 8,
        price: 3500.0,
        supplier: "ওমরন হেলথকের",
        expiryDate: "২০২৫-০৩-১০",
        minStockLevel: 5,
        description: "ডিজিটাল, আপার আর্ম",
      },
      {
        id: 5,
        name: "সার্জিক্যাল গ্লাভস",
        category: "surgical",
        stock: 25,
        price: 120.0,
        supplier: "আনসেল কর্পোরেশন",
        expiryDate: "২০২৪-১১-০৫",
        minStockLevel: 40,
        description: "লেটেক্স ফ্রি, স্টেরাইল, সাইজ M",
      },
      {
        id: 6,
        name: "অ্যামোক্সিসিলিন ক্যাপসুল",
        category: "medicine",
        stock: 45,
        price: 8.75,
        supplier: "বেক্সিমকো ফার্মা",
        expiryDate: "২০২৪-০৯-৩০",
        minStockLevel: 60,
        description: "৫০০ মিগ্রা, ১০ ক্যাপসুল স্ট্রিপ",
      },
    ];
    setInventory(sampleInventory);
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
    if (editingItem) {
      // এডিট মোড
      const updatedInventory = inventory.map((item) =>
        item.id === editingItem.id ? { ...formData, id: editingItem.id } : item
      );
      setInventory(updatedInventory);
    } else {
      // নতুন আইটেম যোগ করুন
      const newItem = {
        id: inventory.length + 1,
        ...formData,
        stock: parseInt(formData.stock),
        price: parseFloat(formData.price),
        minStockLevel: parseInt(formData.minStockLevel),
      };
      setInventory([...inventory, newItem]);
    }
    setIsModalOpen(false);
    setFormData({
      name: "",
      category: "medicine",
      stock: "",
      price: "",
      supplier: "",
      expiryDate: "",
      minStockLevel: "",
      description: "",
    });
    setEditingItem(null);
  };

  const handleEdit = (item) => {
    setFormData(item);
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("আপনি কি এই আইটেম ডিলিট করতে চান?")) {
      const updatedInventory = inventory.filter((item) => item.id !== id);
      setInventory(updatedInventory);
    }
  };

  const handleSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const sortedInventory = React.useMemo(() => {
    let sortableItems = [...inventory];
    if (sortConfig.key !== null) {
      sortableItems.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [inventory, sortConfig]);

  const filteredInventory = sortedInventory.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.supplier.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      filterCategory === "all" || item.category === filterCategory;
    const matchesLowStock = !lowStockFilter || item.stock <= item.minStockLevel;

    return matchesSearch && matchesCategory && matchesLowStock;
  });

  const getCategoryLabel = (categoryValue) => {
    const category = categories.find((cat) => cat.value === categoryValue);
    return category ? category.label : categoryValue;
  };

  const getStockStatus = (stock, minStockLevel) => {
    if (stock === 0) {
      return { text: "স্টক নেই", class: "bg-red-100 text-red-800" };
    } else if (stock <= minStockLevel) {
      return { text: "নিম্ন স্টক", class: "bg-yellow-100 text-yellow-800" };
    } else {
      return { text: "স্টক আছে", class: "bg-green-100 text-green-800" };
    }
  };

  // ইনভেন্টরি সংক্ষিপ্ত তথ্য
  const inventorySummary = {
    totalItems: inventory.length,
    lowStockItems: inventory.filter((item) => item.stock <= item.minStockLevel)
      .length,
    outOfStockItems: inventory.filter((item) => item.stock === 0).length,
    totalValue: inventory.reduce(
      (sum, item) => sum + item.stock * item.price,
      0
    ),
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen font-inter">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 bg-white p-6 rounded-xl shadow-sm">
        <h2 className="text-2xl font-bold text-gray-800 font-open-sans mb-4 md:mb-0">
          ইনভেন্টরি ব্যবস্থাপনা
        </h2>
        <button
          className="flex items-center btn"
          onClick={() => setIsModalOpen(true)}
        >
          <FaPlus className="mr-2" />
          নতুন আইটেম যোগ করুন
        </button>
      </div>

      {/* সারাংশ কার্ড */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-blue-500">
          <h3 className="text-lg font-semibold text-gray-600 font-open-sans">
            মোট আইটেম
          </h3>
          <p className="text-3xl font-bold text-gray-800">
            {inventorySummary.totalItems}
          </p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-yellow-500">
          <h3 className="text-lg font-semibold text-gray-600 font-open-sans">
            নিম্ন স্টক
          </h3>
          <p className="text-3xl font-bold text-gray-800">
            {inventorySummary.lowStockItems}
          </p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-red-500">
          <h3 className="text-lg font-semibold text-gray-600 font-open-sans">
            স্টক নেই
          </h3>
          <p className="text-3xl font-bold text-gray-800">
            {inventorySummary.outOfStockItems}
          </p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-green-500">
          <h3 className="text-lg font-semibold text-gray-600 font-open-sans">
            মোট মূল্য
          </h3>
          <p className="text-3xl font-bold text-gray-800">
            ৳{inventorySummary.totalValue.toFixed(2)}
          </p>
        </div>
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
              placeholder="আইটেম বা সরবরাহকারী দ্বারা খুঁজুন..."
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
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="block pl-10 pr-10 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">সব ক্যাটাগরি</option>
                {categories.map((category) => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>

            <label className="inline-flex items-center mt-2 sm:mt-0">
              <input
                type="checkbox"
                checked={lowStockFilter}
                onChange={(e) => setLowStockFilter(e.target.checked)}
                className="form-checkbox h-5 w-5 text-blue-600"
              />
              <span className="ml-2 text-gray-700">শুধু নিম্ন স্টক দেখান</span>
            </label>
          </div>
        </div>
      </div>

      {/* ইনভেন্টরি টেবিল */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-blue-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider font-open-sans cursor-pointer"
                  onClick={() => handleSort("name")}
                >
                  <div className="flex items-center">
                    নাম
                    {sortConfig.key === "name" &&
                      (sortConfig.direction === "ascending" ? (
                        <FaArrowUp className="ml-1" />
                      ) : (
                        <FaArrowDown className="ml-1" />
                      ))}
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider font-open-sans"
                >
                  ক্যাটাগরি
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider font-open-sans cursor-pointer"
                  onClick={() => handleSort("stock")}
                >
                  <div className="flex items-center">
                    স্টক
                    {sortConfig.key === "stock" &&
                      (sortConfig.direction === "ascending" ? (
                        <FaArrowUp className="ml-1" />
                      ) : (
                        <FaArrowDown className="ml-1" />
                      ))}
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider font-open-sans cursor-pointer"
                  onClick={() => handleSort("price")}
                >
                  <div className="flex items-center">
                    দাম
                    {sortConfig.key === "price" &&
                      (sortConfig.direction === "ascending" ? (
                        <FaArrowUp className="ml-1" />
                      ) : (
                        <FaArrowDown className="ml-1" />
                      ))}
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider font-open-sans"
                >
                  সরবরাহকারী
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider font-open-sans"
                >
                  মেয়াদ শেষ
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider font-open-sans"
                >
                  অবস্থা
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
              {filteredInventory.map((item) => {
                const stockStatus = getStockStatus(
                  item.stock,
                  item.minStockLevel
                );
                return (
                  <tr
                    key={item.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <FaBox className="h-5 w-5 text-blue-600" />
                        </div>
                        <div className="ml-4">
                          <div className="font-medium text-gray-900">
                            {item.name}
                          </div>
                          <div className="text-gray-500 text-sm font-roboto">
                            {item.description.substring(0, 30)}...
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {getCategoryLabel(item.category)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      <div>
                        <span className="font-medium">{item.stock}</span>
                        <span className="text-gray-500 text-xs ml-1">
                          / ন্যূনতম: {item.minStockLevel}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      ৳{item.price.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {item.supplier}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {item.expiryDate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${stockStatus.class}`}
                      >
                        {stockStatus.text}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        className="text-indigo-600 hover:text-indigo-900 mr-3"
                        onClick={() => handleEdit(item)}
                      >
                        <FaEdit className="inline mr-1" /> এডিট
                      </button>
                      <button
                        className="text-red-600 hover:text-red-900"
                        onClick={() => handleDelete(item.id)}
                      >
                        <FaTrash className="inline mr-1" /> ডিলিট
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {filteredInventory.length === 0 && (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center rounded-full bg-gray-100 p-4 mb-4">
              <FaBox className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1 font-open-sans">
              কোন ইনভেন্টরি আইটেম পাওয়া যায়নি
            </h3>
            <p className="text-gray-500 font-roboto">
              আপনার ফিল্টারের সাথে মিলিয়ে কোন আইটেম পাওয়া যায়নি
            </p>
          </div>
        )}
      </div>

      {/* মডাল ফর্ম */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-4 border w-full max-w-2xl shadow-lg rounded-md bg-white">
            <div className="modal-content">
              <div className="flex justify-between items-center pb-3 border-b">
                <h3 className="text-xl font-semibold text-gray-800 font-open-sans">
                  {editingItem ? "আইটেম এডিট করুন" : "নতুন আইটেম যোগ করুন"}
                </h3>
                <button
                  onClick={() => {
                    setIsModalOpen(false);
                    setEditingItem(null);
                    setFormData({
                      name: "",
                      category: "medicine",
                      stock: "",
                      price: "",
                      supplier: "",
                      expiryDate: "",
                      minStockLevel: "",
                      description: "",
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
                      আইটেমের নাম *
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
                      ক্যাটাগরি *
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                      required
                    >
                      {categories.map((category) => (
                        <option key={category.value} value={category.value}>
                          {category.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 font-open-sans">
                      বর্তমান স্টক *
                    </label>
                    <input
                      type="number"
                      name="stock"
                      value={formData.stock}
                      onChange={handleInputChange}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      required
                      min="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 font-open-sans">
                      দাম (৳) *
                    </label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      required
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 font-open-sans">
                      ন্যূনতম স্টক লেভেল *
                    </label>
                    <input
                      type="number"
                      name="minStockLevel"
                      value={formData.minStockLevel}
                      onChange={handleInputChange}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      required
                      min="1"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 font-open-sans">
                      সরবরাহকারী *
                    </label>
                    <input
                      type="text"
                      name="supplier"
                      value={formData.supplier}
                      onChange={handleInputChange}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 font-open-sans">
                      মেয়াদ শেষ তারিখ
                    </label>
                    <input
                      type="date"
                      name="expiryDate"
                      value={formData.expiryDate}
                      onChange={handleInputChange}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 font-open-sans">
                    বিবরণ
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows="3"
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="আইটেমের বিস্তারিত বিবরণ..."
                  />
                </div>

                <div className="flex justify-end pt-4 border-t">
                  <button
                    type="button"
                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-4 rounded-lg mr-3 transition-colors"
                    onClick={() => {
                      setIsModalOpen(false);
                      setEditingItem(null);
                      setFormData({
                        name: "",
                        category: "medicine",
                        stock: "",
                        price: "",
                        supplier: "",
                        expiryDate: "",
                        minStockLevel: "",
                        description: "",
                      });
                    }}
                  >
                    বাতিল
                  </button>
                  <button type="submit" className="btn">
                    {editingItem ? "আপডেট করুন" : "যোগ করুন"}
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

export default InventoryManagement;
