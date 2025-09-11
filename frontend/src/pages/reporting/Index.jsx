import React, { useState } from "react";
import {
  FaFilter,
  FaDownload,
  FaPrint,
  FaCalendarAlt,
  FaMoneyBillWave,
  FaProcedures,
  FaPills,
  FaChartLine,
  FaChartBar,
  FaFileMedical,
  FaUserInjured,
} from "react-icons/fa";
import { Bar, Line, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const Reporting = () => {
  const [dateRange, setDateRange] = useState({
    start: "2023-10-01",
    end: "2023-10-31",
  });
  const [reportType, setReportType] = useState("financial");
  const [showFilters, setShowFilters] = useState(false);

  // রিপোর্ট ডেটা
  const financialReports = [
    {
      id: 1,
      title: "মাসিক আয় রিপোর্ট",
      date: "অক্টোবর ২০২৩",
      amount: "২,৫০,০০০৳",
      type: "আয়",
    },
    {
      id: 2,
      title: "সেবা ভিত্তিক আয়",
      date: "অক্টোবর ২০২৩",
      amount: "১,৭৫,০০০৳",
      type: "আয়",
    },
    {
      id: 3,
      title: "ওষুধ বিক্রয় রিপোর্ট",
      date: "অক্টোবর ২০২৩",
      amount: "৭৫,০০০৳",
      type: "আয়",
    },
    {
      id: 4,
      title: "মাসিক ব্যয় রিপোর্ট",
      date: "অক্টোবর ২০২৩",
      amount: "১,২০,০০০৳",
      type: "ব্যয়",
    },
    {
      id: 5,
      title: "কর্মচারী বেতন",
      date: "অক্টোবর ২০২৩",
      amount: "৮০,০০০৳",
      type: "ব্যয়",
    },
    {
      id: 6,
      title: "ওষুধ ক্রয় রিপোর্ট",
      date: "অক্টোবর ২০২৩",
      amount: "৪০,০০০৳",
      type: "ব্যয়",
    },
  ];

  const patientReports = [
    {
      id: 1,
      title: "রোগী নিবন্ধন রিপোর্ট",
      date: "অক্টোবর ২০২৩",
      count: "১৫০ জন",
      type: "রোগী",
    },
    {
      id: 2,
      title: "রোগী ধরণ অনুযায়ী রিপোর্ট",
      date: "অক্টোবর ২০২৩",
      count: "১০ ধরণ",
      type: "রোগী",
    },
    {
      id: 3,
      title: "সেবা গ্রহণ রিপোর্ট",
      date: "অক্টোবর ২০২৩",
      count: "৩২০ টি",
      type: "সেবা",
    },
    {
      id: 4,
      title: "বয়স ভিত্তিক রিপোর্ট",
      date: "অক্টোবর ২০২৩",
      count: "৫ ক্যাটাগরি",
      type: "বয়স",
    },
  ];

  const inventoryReports = [
    {
      id: 1,
      title: "ওষুধ স্টক রিপোর্ট",
      date: "৩১ অক্টোবর ২০২৩",
      status: "নিম্ন স্টক",
      type: "ওষুধ",
    },
    {
      id: 2,
      title: "ওষুধ ব্যবহার রিপোর্ট",
      date: "অক্টোবর ২০২৩",
      status: "স্বাভাবিক",
      type: "ওষুধ",
    },
    {
      id: 3,
      title: "মেডিকেল সরঞ্জাম রিপোর্ট",
      date: "৩১ অক্টোবর ২০২৩",
      status: "পর্যাপ্ত",
      type: "সরঞ্জাম",
    },
    {
      id: 4,
      title: "ক্রয় রিপোর্ট",
      date: "অক্টোবর ২০২৩",
      status: "১০ টি অর্ডার",
      type: "ক্রয়",
    },
  ];

  // চার্ট ডেটা
  const revenueData = {
    labels: [
      "জানু",
      "ফেব্রু",
      "মার্চ",
      "এপ্রিল",
      "মে",
      "জুন",
      "জুলাই",
      "আগস্ট",
      "সেপ্ট",
      "অক্টো",
    ],
    datasets: [
      {
        label: "আয়",
        data: [
          120000, 150000, 180000, 190000, 210000, 230000, 220000, 240000,
          235000, 250000,
        ],
        backgroundColor: "rgba(54, 162, 235, 0.5)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 2,
      },
      {
        label: "ব্যয়",
        data: [
          80000, 90000, 110000, 115000, 120000, 125000, 130000, 120000, 125000,
          120000,
        ],
        backgroundColor: "rgba(255, 99, 132, 0.5)",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 2,
      },
    ],
  };

  const patientData = {
    labels: [
      "জানু",
      "ফেব্রু",
      "মার্চ",
      "এপ্রিল",
      "মে",
      "জুন",
      "জুলাই",
      "আগস্ট",
      "সেপ্ট",
      "অক্টো",
    ],
    datasets: [
      {
        label: "রোগীর সংখ্যা",
        data: [85, 95, 110, 120, 130, 125, 140, 145, 150, 150],
        backgroundColor: "rgba(75, 192, 192, 0.5)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 2,
        tension: 0.3,
      },
    ],
  };

  const serviceTypeData = {
    labels: [
      "সাধারণ চেকআপ",
      "ডাক্তার পরামর্শ",
      "ল্যাব টেস্ট",
      "ইমার্জেন্সি",
      "ফার্মেসি",
    ],
    datasets: [
      {
        label: "সেবার পরিমাণ",
        data: [120, 85, 65, 40, 320],
        backgroundColor: [
          "rgba(255, 99, 132, 0.7)",
          "rgba(54, 162, 235, 0.7)",
          "rgba(255, 206, 86, 0.7)",
          "rgba(75, 192, 192, 0.7)",
          "rgba(153, 102, 255, 0.7)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function (value) {
            return value.toLocaleString();
          },
        },
      },
    },
  };

  const pieOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
    },
  };

  const getReportsByType = () => {
    switch (reportType) {
      case "financial":
        return financialReports;
      case "patient":
        return patientReports;
      case "inventory":
        return inventoryReports;
      default:
        return financialReports;
    }
  };

  const getChartByType = () => {
    switch (reportType) {
      case "financial":
        return <Bar data={revenueData} options={chartOptions} />;
      case "patient":
        return <Line data={patientData} options={chartOptions} />;
      case "inventory":
        return <Pie data={serviceTypeData} options={pieOptions} />;
      default:
        return <Bar data={revenueData} options={chartOptions} />;
    }
  };

  const getReportTitle = () => {
    switch (reportType) {
      case "financial":
        return "আর্থিক রিপোর্ট";
      case "patient":
        return "রোগী সম্পর্কিত রিপোর্ট";
      case "inventory":
        return "ইনভেন্টরি রিপোর্ট";
      default:
        return "আর্থিক রিপোর্ট";
    }
  };

  const getIconByType = () => {
    switch (reportType) {
      case "financial":
        return <FaMoneyBillWave className="text-blue-500" />;
      case "patient":
        return <FaUserInjured className="text-green-500" />;
      case "inventory":
        return <FaPills className="text-purple-500" />;
      default:
        return <FaFileMedical className="text-gray-500" />;
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen font-inter">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 font-open-sans">
            রিপোর্টিং
          </h2>
          <p className="text-gray-600 font-roboto mt-1">
            হাসপাতালের বিভিন্ন রিপোর্ট দেখুন এবং ডাউনলোড করুন
          </p>
        </div>
        <div className="flex space-x-2 mt-4 md:mt-0">
          <button className="flex items-center bg-white text-gray-700 py-2 px-4 rounded-lg border border-gray-300 hover:bg-gray-50">
            <FaDownload className="mr-2" /> এক্সপোর্ট
          </button>
          <button className="flex items-center bg-white text-gray-700 py-2 px-4 rounded-lg border border-gray-300 hover:bg-gray-50">
            <FaPrint className="mr-2" /> প্রিন্ট
          </button>
        </div>
      </div>

      {/* ফিল্টার সেকশন */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
              <FaFilter className="h-5 w-5 text-blue-600" />
            </div>
            <div className="ml-3">
              <h3 className="text-lg font-medium text-gray-800 font-open-sans">
                রিপোর্ট ফিল্টার
              </h3>
              <p className="text-sm text-gray-500 font-roboto">
                রিপোর্ট ফিল্টার করুন এবং কাস্টমাইজ করুন
              </p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 w-full md:w-auto">
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="border border-gray-300 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="financial">আর্থিক রিপোর্ট</option>
              <option value="patient">রোগী রিপোর্ট</option>
              <option value="inventory">ইনভেন্টরি রিপোর্ট</option>
            </select>

            <div className="flex space-x-2">
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) =>
                  setDateRange({ ...dateRange, start: e.target.value })
                }
                className="border border-gray-300 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <span className="self-center text-gray-500">至</span>
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) =>
                  setDateRange({ ...dateRange, end: e.target.value })
                }
                className="border border-gray-300 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="btn !py-2 !px-3"
            >
              Apply Filters
            </button>
          </div>
        </div>

        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 font-open-sans">
                রিপোর্ট ধরণ
              </label>
              <select className="border border-gray-300 rounded-lg py-2 px-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                <option>সমস্ত রিপোর্ট</option>
                <option>আয় রিপোর্ট</option>
                <option>ব্যয় রিপোর্ট</option>
                <option>রোগী রিপোর্ট</option>
                <option>ইনভেন্টরি রিপো르্ট</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 font-open-sans">
                বিভাগ
              </label>
              <select className="border border-gray-300 rounded-lg py-2 px-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                <option>সমস্ত বিভাগ</option>
                <option>কার্ডিওলজি</option>
                <option>নিউরোলজি</option>
                <option>অর্থোপেডিক্স</option>
                <option>জেনারেল মেডিসিন</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 font-open-sans">
                রিপোর্ট ফরম্যাট
              </label>
              <select className="border border-gray-300 rounded-lg py-2 px-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                <option>তালিকা ভিউ</option>
                <option>সারাংশ</option>
                <option>বিস্তারিত</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* রিপোর্ট সারাংশ */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-xl shadow-sm p-5">
          <div className="flex items-center">
            <div className="flex-shrink-0 h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
              <FaMoneyBillWave className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-700 font-open-sans">
                মোট আয়
              </h3>
              <p className="text-2xl font-bold text-gray-900">২,৫০,০০০৳</p>
              <p className="text-sm text-green-600 font-roboto">
                +১৫% গত মাস থেকে
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-5">
          <div className="flex items-center">
            <div className="flex-shrink-0 h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
              <FaUserInjured className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-700 font-open-sans">
                মোট রোগী
              </h3>
              <p className="text-2xl font-bold text-gray-900">১৫০ জন</p>
              <p className="text-sm text-green-600 font-roboto">
                +১০% গত মাস থেকে
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-5">
          <div className="flex items-center">
            <div className="flex-shrink-0 h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center">
              <FaPills className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-700 font-open-sans">
                ওষুধ বিক্রয়
              </h3>
              <p className="text-2xl font-bold text-gray-900">৭৫,০০০৳</p>
              <p className="text-sm text-green-600 font-roboto">
                +৮% গত মাস থেকে
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* চার্ট সেকশন */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-gray-800 font-open-sans">
            {getReportTitle()} - ভিজুয়ালাইজেশন
          </h3>
          <div className="flex items-center space-x-2">
            <button className="text-gray-500 hover:text-gray-700">
              <FaChartBar className="h-5 w-5" />
            </button>
            <button className="text-gray-500 hover:text-gray-700">
              <FaChartLine className="h-5 w-5" />
            </button>
          </div>
        </div>
        <div className="h-80">{getChartByType()}</div>
      </div>

      {/* রিপোর্ট তালিকা */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center">
            {getIconByType()}
            <h3 className="ml-2 text-lg font-semibold text-gray-800 font-open-sans">
              {getReportTitle()}
            </h3>
          </div>
        </div>
        <div className="divide-y divide-gray-200">
          {getReportsByType().map((report) => (
            <div
              key={report.id}
              className="px-6 py-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="text-md font-medium text-gray-800 font-open-sans">
                    {report.title}
                  </h4>
                  <p className="text-sm text-gray-500 font-roboto mt-1">
                    {report.date}
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    {report.amount && (
                      <p className="text-md font-semibold text-gray-900">
                        {report.amount}
                      </p>
                    )}
                    {report.count && (
                      <p className="text-md font-semibold text-gray-900">
                        {report.count}
                      </p>
                    )}
                    {report.status && (
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          report.status === "নিম্ন স্টক"
                            ? "bg-red-100 text-red-800"
                            : report.status === "স্বাভাবিক"
                            ? "bg-green-100 text-green-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {report.status}
                      </span>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    <button className="text-blue-600 hover:text-blue-800">
                      <FaDownload />
                    </button>
                    <button className="text-gray-600 hover:text-gray-800">
                      <FaPrint />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Reporting;
