// API ইউটিলিটি ফাংশন (api.js)
import axios from "axios";

const API_BASE_URL = "http://localhost:4000/api";

// অ্যাপয়েন্টমেন্ট ফেচ করা
export const fetchAppointments = async (params = {}) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/appointments`, {
      params: params,
    });
    return response.data;
  } catch (error) {
    console.error("অ্যাপয়েন্টমেন্ট ফেচ করতে সমস্যা:", error);
    throw error;
  }
};

// রোগী ফেচ করা
export const fetchPatients = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/patients`);
    return response.data;
  } catch (error) {
    console.error("রোগী ফেচ করতে সমস্যা:", error);
    throw error;
  }
};

// ডাক্তার ফেচ করা
export const fetchDoctors = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/doctors`);
    return response.data;
  } catch (error) {
    console.error("ডাক্তার ফেচ করতে সমস্যা:", error);
    throw error;
  }
};

// নতুন অ্যাপয়েন্টমেন্ট তৈরি করা
export const createAppointment = async (appointmentData) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/appointments`,
      appointmentData
    );
    console.log(response.data);

    return response.data;
  } catch (error) {
    console.error("অ্যাপয়েন্টমেন্ট তৈরি করতে সমস্যা:", error);
    throw error;
  }
};

// অ্যাপয়েন্টমেন্ট আপডেট করা
export const updateAppointment = async (id, appointmentData) => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/appointments/${id}`,
      appointmentData
    );
    return response.data;
  } catch (error) {
    console.error("অ্যাপয়েন্টমেন্ট আপডেট করতে সমস্যা:", error);
    throw error;
  }
};

// অ্যাপয়েন্টমেন্ট ডিলিট করা
export const deleteAppointment = async (id) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/appointments/${id}`);
    return response.data;
  } catch (error) {
    console.error("অ্যাপয়েন্টমেন্ট ডিলিট করতে সমস্যা:", error);
    throw error;
  }
};

// অ্যাপয়েন্টমেন্ট স্ট্যাটাস আপডেট করা
export const updateAppointmentStatus = async (id, status) => {
  try {
    const response = await axios.patch(
      `${API_BASE_URL}/appointments/${id}/status`,
      { status }
    );
    return response.data;
  } catch (error) {
    console.error("স্ট্যাটাস আপডেট করতে সমস্যা:", error);
    throw error;
  }
};
