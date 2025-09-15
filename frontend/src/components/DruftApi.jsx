import { useState } from "react";
import Pagination from "./Drupt";

const DruptApi = ({ patients }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [showItemsPerPageDropdown, setShowItemsPerPageDropdown] =
    useState(false);

  const itemsPerPageOptions = [5, 10, 20, 50];

  // Slice current data
  const startOffset = currentPage * itemsPerPage;
  const endOffset = startOffset + itemsPerPage;
  const currentPatients = patients.slice(startOffset, endOffset);

  return (
    <div>
      {/* Table */}
      <table className="w-full">
        <thead>
          <tr>
            <th>নাম</th>
            <th>বয়স</th>
          </tr>
        </thead>
        <tbody>
          {currentPatients.map((p, i) => (
            <tr key={i}>
              <td>{p.name}</td>
              <td>{p.age}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination Component */}
      <Pagination
        dataLength={patients.length}
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        setItemsPerPage={setItemsPerPage}
        setCurrentPage={setCurrentPage}
        itemsPerPageOptions={itemsPerPageOptions}
        showItemsPerPageDropdown={showItemsPerPageDropdown}
        setShowItemsPerPageDropdown={setShowItemsPerPageDropdown}
      />
    </div>
  );
};

export default DruptApi;
