import { Search, X } from "lucide-react";

export const SearchBar = ({
  searchTerm,
  onSearchChange,
  onClearSearch,
  totalResults,
}) => {
  return (
    <div className="mb-6">
      <div
        className="bg-gray-200 rounded-2xl p-6"
        style={{
          boxShadow: "inset 8px 8px 16px #d1d5db, inset -8px -8px 16px #ffffff",
        }}
      >
        <div className="flex items-center space-x-4">
          <div className="flex-1 relative">
            <div
              className="bg-gray-200 rounded-xl p-5 flex items-center space-x-3" // Increased padding here (from p-4 to p-5)
              style={{
                boxShadow:
                  "inset 6px 6px 12px #c1c5c9, inset -6px -6px 12px #ffffff",
              }}
            >
              <Search className="w-5 h-5 text-gray-500" />
              <input
                type="text"
                placeholder="Search videos by title..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="flex-1 bg-transparent text-gray-800 placeholder-gray-500 outline-none text-sm"
              />
              {searchTerm && (
                <button
                  onClick={onClearSearch}
                  className="p-1 rounded-lg transition-all duration-200 hover:scale-110"
                  style={{
                    boxShadow: "3px 3px 6px #c1c5c9, -3px -3px 6px #ffffff",
                  }}
                >
                  <X className="w-4 h-4 text-gray-500" />
                </button>
              )}
            </div>
          </div>

          {searchTerm && (
            <div
              className="bg-gray-200 rounded-xl px-4 py-2"
              style={{
                boxShadow: "6px 6px 12px #c1c5c9, -6px -6px 12px #ffffff",
              }}
            >
              <span className="text-sm font-medium text-gray-700">
                {totalResults} result{totalResults !== 1 ? "s" : ""}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
