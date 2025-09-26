const TableHeader = ({
  selectAll,
  currentData,
  setSelectAll,
  setSelectedItems,
}: TableHeaderProps) => {
  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedItems(new Set());
    } else {
      const allCurrentIds = new Set(currentData.map((item) => item.id));
      setSelectedItems(allCurrentIds);
    }
    setSelectAll(!selectAll);
  };
  return (
    <div className="grid grid-cols-14 gap-4 p-3 font-semibold text-gray-700 mb-2 bg-white border border-gray-300 rounded-2xl items-center">
      <div className="col-span-1 flex items-center justify-center">
        <label className="flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={selectAll}
            onChange={handleSelectAll}
            className="sr-only h-5 w-5"
          />
          <div
            className={`w-10 h-10 rounded-md transition-colors duration-150 flex items-center justify-center border ${
              selectAll
                ? "bg-blue-500 border-blue-600 text-white"
                : "bg-white border-gray-300 text-gray-600"
            }`}
          >
            {selectAll && (
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </div>
        </label>
      </div>
      <div className="col-span-5">Video</div>
      <div className="col-span-4">Title</div>
      <div className="col-span-3">Schedule Date/Time</div>
      <div className="col-span-1">Actions</div>
    </div>
  );
};

export default TableHeader;
