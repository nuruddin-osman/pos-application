import React, { createContext, useContext, useState } from "react";
import AlertModal from "../components/AlertModal";

const AlertContext = createContext();

export const AlertProvider = ({ children }) => {
  const [alertModal, setAlertModal] = useState({
    isOpen: false,
    title: "",
    message: "",
    type: "success",
  });

  const showAlert = (title, message, type = "success") => {
    setAlertModal({ isOpen: true, title, message, type });
  };

  const closeAlert = () => {
    setAlertModal({ isOpen: false, title: "", message: "", type: "success" });
  };

  return (
    <AlertContext.Provider value={{ showAlert, closeAlert }}>
      {children}
      {/* modal সবসময় render হবে */}
      <AlertModal
        isOpen={alertModal.isOpen}
        onClose={closeAlert}
        title={alertModal.title}
        message={alertModal.message}
        type={alertModal.type}
      />
    </AlertContext.Provider>
  );
};

// custom hook
export const useAlert = () => useContext(AlertContext);
