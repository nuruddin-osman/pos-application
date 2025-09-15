import ReactPaginate from "react-paginate";

const PaginationControls = ({
  currentPage,
  startOffset,
  endOffset,
  totalItems,
  pageCount,
  handlePageClick,
  label = "রোগী",
}) => {
  return (
    <div className="xl:px-6 py-4 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-end xl:justify-between">
      <div className="hidden xl:block text-sm text-gray-700 mb-4 sm:mb-0">
        দেখানো হচ্ছে <span className="font-medium">{startOffset + 1}</span> থেকে{" "}
        <span className="font-medium">{Math.min(endOffset, totalItems)}</span>{" "}
        এর মধ্যে, মোট <span className="font-medium">{totalItems}</span> {label}
      </div>

      <ReactPaginate
        previousLabel={"পূর্বের"}
        nextLabel={"পরের"}
        breakLabel={"..."}
        pageCount={pageCount}
        marginPagesDisplayed={2}
        pageRangeDisplayed={5}
        onPageChange={handlePageClick}
        containerClassName={"flex items-center space-x-2"}
        pageClassName={
          "py-2 rounded border border-gray-300 hover:bg-gray-50 cursor-pointer"
        }
        pageLinkClassName={"text-gray-700 px-5 py-3"}
        previousClassName={
          "py-2 rounded border border-gray-300 hover:bg-gray-50  cursor-pointer"
        }
        previousLinkClassName={"text-gray-700 px-5 py-3"}
        nextClassName={
          "py-2 rounded border border-gray-300 hover:bg-gray-50  cursor-pointer"
        }
        nextLinkClassName={"text-gray-700 px-5 py-3"}
        breakClassName={"px-3 py-2"}
        activeClassName={"bg-blue-500 text-white border-blue-500"}
        disabledClassName={"opacity-50 cursor-not-allowed"}
        forcePage={currentPage}
      />
    </div>
  );
};

export default PaginationControls;
