import { Search, X } from "lucide-react";

export const SearchBar = ({
  searchTerm,
  onSearchChange,
  onClearSearch,
  totalResults,
}) => {
  return (
    <div className="mb-6">
      <div className="bg-white border border-gray-300 rounded-2xl p-4">
        <div className="flex items-center space-x-4">
          <div className="flex-1 relative">
            <div className="bg-white border border-gray-300 rounded-2xl p-4 flex items-center space-x-3">
              <Search className="w-5 h-5 text-gray-500" />
              <input
                type="text"
                placeholder="Search videos by title..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="flex-1 bg-transparent text-gray-800 placeholder-gray-500 outline-none text-lg"
              />
              {searchTerm && (
                <button
                  onClick={onClearSearch}
                  className="p-1 rounded-md transition-colors duration-150 hover:bg-gray-50 border border-gray-300"
                >
                  <X className="w-4 h-4 text-gray-500" />
                </button>
              )}
            </div>
          </div>

          {searchTerm && (
            <div className="bg-white border border-gray-300 rounded-md px-3 py-1.5">
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
