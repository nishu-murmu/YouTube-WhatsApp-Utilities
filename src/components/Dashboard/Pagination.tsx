const Pagination = ({
  currentPage,
  totalPages,
  setCurrentPage,
}: PaginationProps) => {
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };
  return (
    <div className="flex justify-center mt-8">
      <div className="bg-white border border-gray-300 p-2.5 rounded-2xl flex items-center space-x-4">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`p-2 rounded-2xl cursor-pointer transition-colors duration-150 ${
            currentPage === 1
              ? "text-gray-400 cursor-not-allowed"
              : "text-gray-700 hover:bg-gray-50 border border-gray-300"
          }`}
        >
          &lt;
        </button>

        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i + 1}
            onClick={() => handlePageChange(i + 1)}
            className={`w-9 h-9 flex items-center justify-center rounded-2xl cursor-pointer transition-colors duration-150 border ${
              currentPage === i + 1
                ? "bg-blue-500 text-white border-blue-600"
                : "text-gray-700 bg-white border-gray-300 hover:bg-gray-50"
            }`}
          >
            {i + 1}
          </button>
        ))}

        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`p-2 rounded-2xl cursor-pointer transition-colors duration-150 ${
            currentPage === totalPages
              ? "text-gray-400 cursor-not-allowed"
              : "text-gray-700 hover:bg-gray-50 border border-gray-300"
          }`}
        >
          &gt;
        </button>
      </div>
    </div>
  );
};

export default Pagination;
