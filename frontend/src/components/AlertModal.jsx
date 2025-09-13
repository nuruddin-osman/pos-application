import React from "react";

const AlertModal = ({ isOpen, onClose, title, message, type = "success" }) => {
  if (!isOpen) return null;

  const bgColor = type === "success" ? "bg-green-100" : "bg-red-100";
  const textColor = type === "success" ? "text-green-800" : "text-red-800";
  const borderColor =
    type === "success" ? "border-green-400" : "border-red-400";

  return (
    <div className="fixed inset-0 bg-gray-600  overflow-y-auto h-full w-full z-50 flex items-center justify-center">
      <div
        className={`relative mx-auto p-5 border w-96 shadow-lg rounded-md ${bgColor} ${borderColor}`}
      >
        <div className="mt-3 text-center">
          <div
            className={`mx-auto flex items-center justify-center h-12 w-12 rounded-full ${bgColor}`}
          >
            {type === "success" ? (
              <svg
                className="h-6 w-6 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                ></path>
              </svg>
            ) : (
              <svg
                className="h-6 w-6 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
            )}
          </div>
          <h3 className={`text-lg leading-6 font-medium ${textColor}`}>
            {title}
          </h3>
          <div className="mt-2 px-7 py-3">
            <p className="text-sm text-gray-700">{message}</p>
          </div>
          <div className="items-center px-4 py-3">
            <button
              onClick={onClose}
              className={`px-4 py-2 ${
                type === "success" ? "bg-green-500" : "bg-red-500"
              } text-white text-base font-medium rounded-md w-full shadow-sm hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-green-300`}
            >
              ঠিক আছে
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlertModal;
