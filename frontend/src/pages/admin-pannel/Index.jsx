import React, { useState } from "react";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaEdit,
  FaSave,
  FaTimes,
  FaShieldAlt,
  FaBell,
  FaLock,
  FaGlobe,
  FaUserShield,
  FaHistory,
  FaChartLine,
  FaCog,
} from "react-icons/fa";

const AdminProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const [adminData, setAdminData] = useState({
    name: "ডাঃ আহমেদ হাসান",
    email: "ahmed.hasan@hospital.com",
    phone: "+8801712345678",
    address: "১২৩/বি, ধানমন্ডি, ঢাকা-১২০৫",
    position: "সিনিয়র অ্যাডমিনিস্ট্রেটর",
    joinDate: "২০২২-০১-১৫",
    department: "হাসপাতাল ব্যবস্থাপনা",
    bio: "১০ বছর অভিজ্ঞতা সহ হাসপাতাল ব্যবস্থাপনায় বিশেষজ্ঞ। রোগী সেবা এবং হাসপাতালের দক্ষতা বৃদ্ধিতে আগ্রহী।",
    emergencyContact: "+8801912345678",
    dateOfBirth: "১৯৮৫-০৬-২০",
  });

  const [formData, setFormData] = useState({ ...adminData });

  const activityLogs = [
    {
      id: 1,
      action: "নতুন রোগী নিবন্ধন",
      time: "২০২৩-১০-২৫ ১০:৩০ AM",
      details: "মোঃ রাজু আহমেদ",
    },
    {
      id: 2,
      action: "বিল তৈরি করেছেন",
      time: "২০২৩-১০-২৫ ০৯:১৫ AM",
      details: "বিল নং: BIL-2023-1025",
    },
    {
      id: 3,
      action: "অ্যাপয়েন্টমেন্ট কনফার্ম করেছেন",
      time: "২০২৩-১০-২৪ ০৩:৪৫ PM",
      details: "ডাঃ করিমের সাথে",
    },
    {
      id: 4,
      action: "ইনভেন্টরি আপডেট করেছেন",
      time: "২০২৩-১০-২৪ ১১:২০ AM",
      details: "প্যারাসিটামল ট্যাবলেট",
    },
    {
      id: 5,
      action: "রিপোর্ট জেনারেট করেছেন",
      time: "২০২৩-১০-২৩ ০৪:১০ PM",
      details: "মাসিক আয় রিপোর্ট",
    },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSave = () => {
    setAdminData(formData);
    setIsEditing(false);
    // এখানে API কল যোগ করতে হবে
  };

  const handleCancel = () => {
    setFormData(adminData);
    setIsEditing(false);
  };

  const renderProfileTab = () => (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-gray-800 font-open-sans">
              প্রোফাইল তথ্য
            </h3>
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors"
              >
                <FaEdit className="mr-2" /> এডিট করুন
              </button>
            ) : (
              <div className="flex space-x-2">
                <button
                  onClick={handleSave}
                  className="flex items-center bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition-colors"
                >
                  <FaSave className="mr-2" /> সেভ করুন
                </button>
                <button
                  onClick={handleCancel}
                  className="flex items-center bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-lg transition-colors"
                >
                  <FaTimes className="mr-2" /> বাতিল
                </button>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-group">
                <label className="block text-sm font-medium text-gray-700 mb-1 font-open-sans">
                  নাম
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                ) : (
                  <p className="mt-1 text-gray-900 font-roboto">
                    {adminData.name}
                  </p>
                )}
              </div>
              <div className="form-group">
                <label className="block text-sm font-medium text-gray-700 mb-1 font-open-sans">
                  ইমেইল
                </label>
                {isEditing ? (
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                ) : (
                  <div className="flex items-center mt-1">
                    <FaEnvelope className="text-gray-400 mr-2" />
                    <span className="text-gray-900 font-roboto">
                      {adminData.email}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-group">
                <label className="block text-sm font-medium text-gray-700 mb-1 font-open-sans">
                  ফোন নম্বর
                </label>
                {isEditing ? (
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                ) : (
                  <div className="flex items-center mt-1">
                    <FaPhone className="text-gray-400 mr-2" />
                    <span className="text-gray-900 font-roboto">
                      {adminData.phone}
                    </span>
                  </div>
                )}
              </div>
              <div className="form-group">
                <label className="block text-sm font-medium text-gray-700 mb-1 font-open-sans">
                  জরুরী যোগাযোগ
                </label>
                {isEditing ? (
                  <input
                    type="tel"
                    name="emergencyContact"
                    value={formData.emergencyContact}
                    onChange={handleInputChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                ) : (
                  <div className="flex items-center mt-1">
                    <FaPhone className="text-gray-400 mr-2" />
                    <span className="text-gray-900 font-roboto">
                      {adminData.emergencyContact}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="form-group">
              <label className="block text-sm font-medium text-gray-700 mb-1 font-open-sans">
                ঠিকানা
              </label>
              {isEditing ? (
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  rows="2"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              ) : (
                <div className="flex items-start mt-1">
                  <FaMapMarkerAlt className="text-gray-400 mr-2 mt-1" />
                  <span className="text-gray-900 font-roboto">
                    {adminData.address}
                  </span>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-group">
                <label className="block text-sm font-medium text-gray-700 mb-1 font-open-sans">
                  পদবী
                </label>
                <p className="mt-1 text-gray-900 font-roboto">
                  {adminData.position}
                </p>
              </div>
              <div className="form-group">
                <label className="block text-sm font-medium text-gray-700 mb-1 font-open-sans">
                  ডিপার্টমেন্ট
                </label>
                <p className="mt-1 text-gray-900 font-roboto">
                  {adminData.department}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-group">
                <label className="block text-sm font-medium text-gray-700 mb-1 font-open-sans">
                  জন্ম তারিখ
                </label>
                {isEditing ? (
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleInputChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                ) : (
                  <div className="flex items-center mt-1">
                    <FaCalendarAlt className="text-gray-400 mr-2" />
                    <span className="text-gray-900 font-roboto">
                      {adminData.dateOfBirth}
                    </span>
                  </div>
                )}
              </div>
              <div className="form-group">
                <label className="block text-sm font-medium text-gray-700 mb-1 font-open-sans">
                  যোগদানের তারিখ
                </label>
                <div className="flex items-center mt-1">
                  <FaCalendarAlt className="text-gray-400 mr-2" />
                  <span className="text-gray-900 font-roboto">
                    {adminData.joinDate}
                  </span>
                </div>
              </div>
            </div>

            <div className="form-group">
              <label className="block text-sm font-medium text-gray-700 mb-1 font-open-sans">
                বায়ো
              </label>
              {isEditing ? (
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  rows="3"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              ) : (
                <p className="mt-1 text-gray-900 font-roboto">
                  {adminData.bio}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="lg:col-span-1">
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex flex-col items-center">
            <div className="relative mb-4">
              <div className="h-24 w-24 rounded-full bg-blue-100 flex items-center justify-center">
                <FaUser className="h-12 w-12 text-blue-600" />
              </div>
              <button className="absolute bottom-0 right-0 h-8 w-8 bg-blue-600 rounded-full flex items-center justify-center">
                <FaEdit className="h-4 w-4 text-white" />
              </button>
            </div>
            <h2 className="text-xl font-bold text-gray-800 text-center font-open-sans">
              {adminData.name}
            </h2>
            <p className="text-gray-600 text-center font-roboto">
              {adminData.position}
            </p>
            <p className="text-gray-500 text-center text-sm font-roboto">
              {adminData.department}
            </p>

            <div className="w-full mt-6 space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600 font-roboto">অবস্থা:</span>
                <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                  অনলাইন
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 font-roboto">ভেরিফাইড:</span>
                <span className="text-green-600">হ্যাঁ</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 font-roboto">শেষ লগইন:</span>
                <span className="text-gray-900 font-roboto">
                  ২০২৩-১০-২৫ ০৯:৪৫ AM
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 font-open-sans">
            দ্রুত কর্ম
          </h3>
          <div className="space-y-2">
            <button className="flex items-center w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors">
              <FaShieldAlt className="text-blue-600 mr-3" />
              <span>পাসওয়ার্ড পরিবর্তন</span>
            </button>
            <button className="flex items-center w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors">
              <FaBell className="text-yellow-600 mr-3" />
              <span>নোটিফিকেশন সেটিংস</span>
            </button>
            <button className="flex items-center w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors">
              <FaLock className="text-green-600 mr-3" />
              <span>প্রাইভেসি সেটিংস</span>
            </button>
            <button className="flex items-center w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors">
              <FaGlobe className="text-purple-600 mr-3" />
              <span>ভাষা পরিবর্তন</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderActivityTab = () => (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-6 font-open-sans">
        সাম্প্রতিক এক্টিভিটি
      </h3>
      <div className="space-y-4">
        {activityLogs.map((log) => (
          <div
            key={log.id}
            className="flex items-start p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center mr-4">
              <FaHistory className="h-5 w-5 text-blue-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 font-open-sans">
                {log.action}
              </p>
              <p className="text-sm text-gray-500 font-roboto">{log.details}</p>
              <p className="text-xs text-gray-400 mt-1 font-roboto">
                {log.time}
              </p>
            </div>
          </div>
        ))}
      </div>
      <button className="w-full mt-6 text-center text-blue-600 hover:text-blue-800 py-2 font-roboto">
        সমস্ত এক্টিভিটি দেখুন
      </button>
    </div>
  );

  const renderSecurityTab = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-6 font-open-sans">
          সুরক্ষা সেটিংস
        </h3>

        <div className="space-y-6">
          <div>
            <h4 className="text-md font-medium text-gray-800 mb-3 font-open-sans">
              পাসওয়ার্ড
            </h4>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-3 font-roboto">
                শেষ পরিবর্তন: ২০২৩-০৮-১৫
              </p>
              <button className="flex items-center text-blue-600 hover:text-blue-800">
                <FaLock className="mr-2" /> পাসওয়ার্ড পরিবর্তন করুন
              </button>
            </div>
          </div>

          <div>
            <h4 className="text-md font-medium text-gray-800 mb-3 font-open-sans">
              ২-ফ্যাক্টর অথেন্টিকেশন
            </h4>
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm text-gray-600 font-roboto">
                  বর্তমান অবস্থা:
                </span>
                <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                  নিষ্ক্রিয়
                </span>
              </div>
              <button className="flex items-center text-blue-600 hover:text-blue-800">
                <FaShieldAlt className="mr-2" /> ২-ফ্যাক্টর অথেন্টিকেশন সক্রিয়
                করুন
              </button>
            </div>
          </div>

          <div>
            <h4 className="text-md font-medium text-gray-800 mb-3 font-open-sans">
              লগইন সেশন
            </h4>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-3 font-roboto">
                বর্তমান সেশন: Dhaka, Bangladesh (Chrome, Windows)
              </p>
              <button className="flex items-center text-blue-600 hover:text-blue-800">
                <FaUserShield className="mr-2" /> সমস্ত সেশন দেখুন
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-6 font-open-sans">
          অনুমতি এবং এক্সেস
        </h3>

        <div className="space-y-4">
          <div className="p-4 border border-gray-200 rounded-lg">
            <h4 className="text-md font-medium text-gray-800 mb-2 font-open-sans">
              রোল: সিনিয়র অ্যাডমিন
            </h4>
            <p className="text-sm text-gray-600 font-roboto">
              সমস্ত মডিউলে সম্পূর্ণ এক্সেস
            </p>
          </div>

          <div>
            <h4 className="text-md font-medium text-gray-800 mb-3 font-open-sans">
              মডিউল অনুমতি
            </h4>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-700 font-roboto">
                  রোগী ব্যবস্থাপনা
                </span>
                <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                  পূর্ণ এক্সেস
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-700 font-roboto">বিলিং</span>
                <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                  পূর্ণ এক্সেস
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-700 font-roboto">
                  ইনভেন্টরি
                </span>
                <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                  পূর্ণ এক্সেস
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-700 font-roboto">
                  রিপোর্টিং
                </span>
                <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                  পূর্ণ এক্সেস
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-700 font-roboto">
                  সিস্টেম সেটিংস
                </span>
                <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                  পূর্ণ এক্সেস
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen font-inter">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 font-open-sans">
          অ্যাডমিন প্রোফাইল
        </h2>
        <p className="text-gray-600 font-roboto mt-1">
          আপনার প্রোফাইল পরিচালনা করুন এবং সিস্টেম সেটিংস কনফিগার করুন
        </p>
      </div>

      {/* ট্যাব নেভিগেশন */}
      <div className="bg-white rounded-xl shadow-sm mb-6">
        <div className="flex flex-wrap border-b border-gray-200">
          <button
            className={`py-4 px-6 text-sm font-medium border-b-2 transition-colors ${
              activeTab === "profile"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("profile")}
          >
            <FaUser className="inline mr-2" /> প্রোফাইল
          </button>
          <button
            className={`py-4 px-6 text-sm font-medium border-b-2 transition-colors ${
              activeTab === "activity"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("activity")}
          >
            <FaHistory className="inline mr-2" /> এক্টিভিটি
          </button>
          <button
            className={`py-4 px-6 text-sm font-medium border-b-2 transition-colors ${
              activeTab === "security"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("security")}
          >
            <FaShieldAlt className="inline mr-2" /> সুরক্ষা
          </button>
          <button
            className={`py-4 px-6 text-sm font-medium border-b-2 transition-colors ${
              activeTab === "settings"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("settings")}
          >
            <FaCog className="inline mr-2" /> সেটিংস
          </button>
        </div>

        <div className="p-6">
          {activeTab === "profile" && renderProfileTab()}
          {activeTab === "activity" && renderActivityTab()}
          {activeTab === "security" && renderSecurityTab()}
          {activeTab === "settings" && (
            <div className="text-center py-12">
              <FaCog className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2 font-open-sans">
                সেটিংস পেজ উন্নয়নাধীন
              </h3>
              <p className="text-gray-500 font-roboto">
                এই সেকশনটি দ্রুতই আসছে
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;
