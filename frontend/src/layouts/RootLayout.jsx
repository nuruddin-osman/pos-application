import React, { useState } from "react";
import Sidebar from "./Sidebar";
import PatientManagement from "../pages/patient-management/Index";
import BillingAndInvoicing from "../pages/billingAndInvoicing/Index";
import InventoryManagement from "../pages/inventoryManagement/Index";
import AppoientmentScheduling from "../pages/appoientmentScheduling/Index";
import Reporting from "../pages/reporting/Index";
import AdminProfile from "../pages/admin-pannel/Index";
import Logo from "../assets/image/logo/logo.webp";
import Avater from "../assets/image/logo/avater.png";
import DoctorsManagement from "../pages/doctors/Index";

const RootLayout = () => {
  const [activePage, setActivePage] = useState("রোগী ব্যবস্থাপনা");

  const handleAdminProfileClick = () => {
    setActivePage("অ্যাডমিন প্রোফাইল");
  };

  const renderPage = () => {
    switch (activePage) {
      case "রোগী ব্যবস্থাপনা":
        return <PatientManagement />;
      case "বিলিং ও ইনভয়েসিং":
        return <BillingAndInvoicing />;
      case "ইনভেন্টরি ব্যবস্থাপনা":
        return <InventoryManagement />;
      case "অ্যাপয়েন্টমেন্ট সময়সূচী":
        return <AppoientmentScheduling />;
      case "রিপোর্টিং":
        return <Reporting />;
      case "অ্যাডমিন প্রোফাইল":
        return <AdminProfile />;
      case "Docotrs":
        return <DoctorsManagement />;
      default:
        return <PatientManagement />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 font-roboto">
      <Sidebar activePage={activePage} setActivePage={setActivePage} />
      <main className="flex-1 overflow-y-auto md:ml-0">
        <div className="md:px-6 md:pt-2">
          <div className="flex justify-end md:justify-between items-start md:items-center mb-6 bg-gradient-to-r from-purple-600 to-green-600 shadow-xl px-6 py-3 rounded-xl ">
            <div className="hidden md:block text-2xl font-bold text-gray-800 font-open-sans">
              <div className="w-24 h-18 overflow-hidden ">
                <img
                  className="w-full h-full object-cover"
                  src={Logo}
                  alt="hospital logo"
                />
              </div>
            </div>

            <div
              onClick={handleAdminProfileClick}
              className="flex items-center gap-4 md:px-4 md:py-2 rounded-lg transition-colors cursor-pointer md:bg-slate-300"
            >
              <div className="w-14 h-14 md:w-18 md:h-18 overflow-hidden rounded-full bg-amber-200">
                <img
                  className="w-full h-full object-cover"
                  src={Avater}
                  alt="Profile logo"
                />
              </div>
              <h2 className="hidden md:block text-3xl font-bold text-gray-800 font-open-sans">
                Md Nuruddin Osman
              </h2>
            </div>
          </div>
          {renderPage()}
        </div>
      </main>
    </div>
  );
};

export default RootLayout;
