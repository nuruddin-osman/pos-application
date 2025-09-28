import React, { useState, useRef, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from "axios";
import {
  FaUser,
  FaPhone,
  FaEnvelope,
  FaCalendarAlt,
  FaLock,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";

const Register = ({ placeholder }) => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const config = useMemo(
    () => ({
      readonly: false, // all options from https://xdsoft.net/jodit/docs/,
      placeholder: placeholder || "",
    }),
    [placeholder]
  );

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const response = await axios.post(
        `http://localhost:4000/api/register`,
        data
      );
      if (response.data) {
        console.log(response.data);
        console.log("success");
        navigate("/login");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4 font-inter">
        <div className="max-w-4xl w-full bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#FAB12F] to-[#8C1007] p-6 text-center">
            <h2 className="text-xl font-semibold text-white font-open-sans">
              নতুন অ্যাকাউন্ট তৈরি করুন
            </h2>
          </div>

          {/* Registration Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
            {/* Full Name */}
            <div className="flex flex-col md:flex-row gap-5">
              <div className="space-y-2 w-full md:w-1/2">
                <label
                  htmlFor="fullName"
                  className="block text-sm font-medium text-gray-700 font-open-sans"
                >
                  পুরো নাম *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaUser className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    {...register("fullName", {
                      required: "please fullName must fillup",
                    })}
                    type="text"
                    id="fullName"
                    name="fullName"
                    className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors form-control ${
                      errors.fullName
                        ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                        : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                    }`}
                    placeholder="আপনার পুরো নাম লিখুন"
                  />
                </div>
                {errors.fullName && (
                  <p className="text-red-600 text-sm font-roboto">
                    {errors.fullName.message}
                  </p>
                )}
              </div>

              {/* Phone Number */}
              <div className="space-y-2 w-full md:w-1/2">
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-gray-700 font-open-sans"
                >
                  ফোন নম্বর *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaPhone className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    {...register("phone", {
                      required: "please phone must fillup",
                    })}
                    type="tel"
                    id="phone"
                    name="phone"
                    className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors form-control ${
                      errors.phone
                        ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                        : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                    }`}
                    placeholder="01XXXXXXXXX"
                  />
                </div>
                {errors.phone && (
                  <p className="text-red-600 text-sm font-roboto">
                    {errors.phone.message}
                  </p>
                )}
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-5">
              {/* Email */}
              <div className="space-y-2  w-full md:w-1/2">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 font-open-sans"
                >
                  ইমেইল *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaEnvelope className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    {...register("email", {
                      required: "please email must fillup",
                    })}
                    type="email"
                    id="email"
                    name="email"
                    className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors  ${
                      errors.email
                        ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                        : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                    }`}
                    placeholder="you@example.com"
                  />
                </div>
                {errors.email && (
                  <p className="text-red-600 text-sm font-roboto">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-2  w-full md:w-1/2">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 font-open-sans"
                >
                  পাসওয়ার্ড *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaLock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    {...register("password", {
                      required: "please password must fillup",
                    })}
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    className={`block w-full pl-10 pr-10 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                      errors.password
                        ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                        : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                    }`}
                    placeholder="কমপক্ষে ৬ অক্ষর"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <FaEyeSlash className="h-5 w-5 text-gray-400" />
                    ) : (
                      <FaEye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-600 text-sm font-roboto">
                    {errors.password.message}
                  </p>
                )}
              </div>
            </div>

            {/* Date of Birth and Gender */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Date of Birth */}
              <div className="space-y-2">
                <label
                  htmlFor="dob"
                  className="block text-sm font-medium text-gray-700 font-open-sans"
                >
                  জন্ম তারিখ *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaCalendarAlt className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    {...register("dob")}
                    type="date"
                    id="dob"
                    name="dob"
                    className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                      errors.dob
                        ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                        : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                    }`}
                  />
                </div>
              </div>

              {/* Gender */}
              <div className="space-y-2">
                <label
                  htmlFor="gender"
                  className="block text-sm font-medium text-gray-700 font-open-sans"
                >
                  লিঙ্গ *
                </label>
                <select
                  {...register("gender")}
                  id="gender"
                  name="gender"
                  className={`block w-full px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                    errors.gender
                      ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                      : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                  }`}
                >
                  <option value="">নির্বাচন করুন</option>
                  <option value="male">পুরুষ</option>
                  <option value="female">মহিলা</option>
                  <option value="others">অন্যান্য</option>
                </select>
              </div>
            </div>

            {/* Terms and Conditions */}
            <div className="flex items-center">
              <input
                {...register("terms", {
                  required: "please terms must fillup",
                })}
                name="terms"
                type="checkbox"
                id="terms"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label
                htmlFor="terms"
                className="ml-2 block text-sm text-gray-700 font-roboto"
              >
                আমি{" "}
                <a href="#" className="text-blue-600 hover:text-blue-500">
                  শর্তাবলী
                </a>{" "}
                এবং{" "}
                <a href="#" className="text-blue-600 hover:text-blue-500">
                  গোপনীয়তা নীতি
                </a>{" "}
                মেনে নিচ্ছি
              </label>
            </div>
            {errors.terms && (
              <p className="text-red-600 text-sm font-roboto">
                {errors.terms.message}
              </p>
            )}

            {/* Submit Button */}
            <div className="flex justify-end items-center">
              <button
                type="submit"
                className="w-fit cursor-pointer bg-gradient-to-r from-[#FAB12F] to-[#8C1007] text-white py-3 px-4 rounded-lg font-semibold hover:from-[#FAB12F]/70 hover:to-[#8C1007]/70 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
              >
                রেজিস্ট্রেশন সম্পন্ন করুন
              </button>
            </div>

            {/* Login Link */}
            <div className="text-center">
              <p className="text-sm text-gray-600 font-roboto">
                ইতিমধ্যে অ্যাকাউন্ট আছে?{" "}
                <a
                  href="/login"
                  className="font-medium text-blue-600 hover:text-blue-500"
                >
                  লগইন করুন
                </a>
              </p>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Register;
