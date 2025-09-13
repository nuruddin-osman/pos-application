const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    // ফোন নম্বর validation (শুধু数字 allowed)
    const phoneRegex = /^[0-9]+$/;
    if (!phoneRegex.test(formData.phone)) {
      alert("ফোন নম্বর শুধুমাত্র数字 হতে পারে");
      return;
    }

    // বয়স validation
    if (formData.age < 0 || formData.age > 150) {
      alert("বয়স ০ থেকে ১৫০ এর মধ্যে হতে হবে");
      return;
    }

    if (editingPatient) {
      // এডিট মোড - PUT request
      const response = await axios.put(
        `http://localhost:4000/api/patients/${editingPatient._id}`,
        formData
      );

      if (response.data.status) {
        alert("রোগীর তথ্য সফলভাবে আপডেট করা হয়েছে");
      } else {
        alert(response.data.message || "আপডেট করতে সমস্যা হয়েছে");
      }
    } else {
      // নতুন রোগী যোগ করুন - POST request
      const response = await axios.post(
        "http://localhost:4000/api/patients",
        formData
      );

      if (response.data.status) {
        alert("নতুন রোগী সফলভাবে যোগ করা হয়েছে");
      } else {
        alert(response.data.message || "যোগ করতে সমস্যা হয়েছে");
      }
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
    console.error("ত্রুটি:", error);
    // Backend থেকে error message দেখানো
    if (error.response?.data?.message) {
      alert(error.response.data.message);
    } else {
      alert("কিছু একটা সমস্যা হয়েছে");
    }
  }
};
