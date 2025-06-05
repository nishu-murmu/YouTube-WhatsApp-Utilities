const Pagination = ({ currentPage, totalPages, setCurrentPage }) => {
  const handlePageChange = (page: any) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };
  return (
    <div className="flex justify-center mt-8">
      <div
        className="bg-gray-200 p-3 rounded-2xl flex items-center space-x-2"
        style={{
          boxShadow: "12px 12px 24px #c1c5c9, -12px -12px 24px #ffffff",
        }}
      >
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`p-3 rounded-xl transition-all duration-200 hover:scale-105 ${
            currentPage === 1
              ? "text-gray-400 cursor-not-allowed"
              : "text-gray-700"
          }`}
          style={{
            boxShadow:
              currentPage === 1
                ? "inset 4px 4px 8px #c1c5c9, inset -4px -4px 8px #ffffff"
                : "4px 4px 8px #c1c5c9, -4px -4px 8px #ffffff",
          }}
        >
          &lt;
        </button>

        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i + 1}
            onClick={() => handlePageChange(i + 1)}
            className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all duration-200 hover:scale-105 ${
              currentPage === i + 1
                ? "bg-blue-200 text-blue-700 font-semibold"
                : "text-gray-700"
            }`}
            style={{
              boxShadow:
                currentPage === i + 1
                  ? "inset 6px 6px 12px #bfdbfe, inset -6px -6px 12px #ffffff"
                  : "6px 6px 12px #c1c5c9, -6px -6px 12px #ffffff",
            }}
          >
            {i + 1}
          </button>
        ))}

        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`p-3 rounded-xl transition-all duration-200 hover:scale-105 ${
            currentPage === totalPages
              ? "text-gray-400 cursor-not-allowed"
              : "text-gray-700"
          }`}
          style={{
            boxShadow:
              currentPage === totalPages
                ? "inset 4px 4px 8px #c1c5c9, inset -4px -4px 8px #ffffff"
                : "4px 4px 8px #c1c5c9, -4px -4px 8px #ffffff",
          }}
        >
          &gt;
        </button>
      </div>
    </div>
  );
};

export default Pagination;
