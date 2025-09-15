import { FaCog } from "react-icons/fa";

const ItemsPerPageSelector = ({
  totalItems,
  itemsPerPage,
  itemsPerPageOptions,
  showDropdown,
  setShowDropdown,
  handleItemsPerPageChange,
  label,
}) => {
  return (
    <div className="flex justify-between items-center p-4 border-b border-gray-200">
      <div className="text-sm text-gray-600">
        {label}: {totalItems}
      </div>

      <div className="relative">
        <button
          className="flex items-center px-3 py-2 border border-gray-300 rounded-md bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
          onClick={() => setShowDropdown(!showDropdown)}
        >
          <FaCog className="mr-2" />
          প্রতি পেজে: {itemsPerPage}
        </button>

        {showDropdown && (
          <div className="origin-top-right absolute right-0 mt-2 w-32 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
            <div className="py-1" role="menu" aria-orientation="vertical">
              {itemsPerPageOptions.map((option) => (
                <button
                  key={option}
                  className={`block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 w-full text-left ${
                    itemsPerPage === option ? "bg-blue-100 text-blue-800" : ""
                  }`}
                  onClick={() => handleItemsPerPageChange(option)}
                >
                  {option} টি আইটেম
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ItemsPerPageSelector;
