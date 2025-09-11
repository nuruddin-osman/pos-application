import React, { useState } from "react";
import Sidebar from "./Sidebar";
import PatientManagement from "../pages/patient-management/Index";
import BillingAndInvoicing from "../pages/billingAndInvoicing/Index";
import InventoryManagement from "../pages/inventoryManagement/Index";
import AppoientmentScheduling from "../pages/appoientmentScheduling/Index";
import Reporting from "../pages/reporting/Index";

const RootLayout = () => {
  const [activePage, setActivePage] = useState("রোগী ব্যবস্থাপনা");

  const renderPage = () => {
    switch (activePage) {
      case "রোগী ব্যবস্থাপনা":
        return <PatientManagement />;
      case "বিলিং ও ইনভয়েসিং":
        return <BillingAndInvoicing />;
      case "ইনভেন্টরি ব্যবস্থাপনা":
        return <InventoryManagement />;
      case "অ্যাপয়েন্টমেন্ট Scheduling":
        return <AppoientmentScheduling />;
      case "রিপোর্টিং":
        return <Reporting />;
      default:
        return <PatientManagement />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 font-roboto">
      <Sidebar activePage={activePage} setActivePage={setActivePage} />
      <main className="flex-1 overflow-y-auto md:ml-0">
        <div className="p-6">
          {/* <h1 className="text-2xl font-bold text-gray-800 mb-6">
            {activePage}
          </h1> */}
          {renderPage()}
        </div>
      </main>
    </div>
  );
};

export default RootLayout;
