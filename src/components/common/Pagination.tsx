export type CommonPaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  rounded?: "md" | "2xl";
  padding?: "p-2" | "p-2.5";
  spacing?: "space-x-2" | "space-x-4";
};

export const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  rounded = "md",
  padding = "p-2",
  spacing = "space-x-2",
}: CommonPaginationProps) => {
  const containerRounded = rounded === "2xl" ? "rounded-2xl" : "rounded-md";
  const itemRounded = rounded === "2xl" ? "rounded-2xl" : "rounded-md";

  return (
    <div className="flex justify-center mt-8">
      <div
        className={`bg-white border border-gray-300 ${padding} ${containerRounded} flex items-center ${spacing}`}
      >
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`p-2 ${itemRounded} transition-colors duration-150 ${
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
            onClick={() => onPageChange(i + 1)}
            className={`w-9 h-9 flex items-center justify-center ${itemRounded} transition-colors duration-150 border ${
              currentPage === i + 1
                ? "bg-blue-500 text-white border-blue-600"
                : "text-gray-700 bg-white border-gray-300 hover:bg-gray-50"
            }`}
          >
            {i + 1}
          </button>
        ))}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`p-2 ${itemRounded} transition-colors duration-150 ${
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
