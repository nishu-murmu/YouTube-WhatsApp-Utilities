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
      const allCurrentIds = new Set(
        currentData.map((item: Schedule) => item.id)
      );
      setSelectedItems(allCurrentIds);
    }
    setSelectAll(!selectAll);
  };
  return (
    <div
      className="grid grid-cols-14 gap-4 p-4 font-semibold text-gray-700 mb-2 bg-gray-200 rounded-xl"
      style={{
        boxShadow: "6px 6px 12px #c1c5c9, -6px -6px 12px #ffffff",
      }}
    >
      <div className="col-span-1 flex items-center justify-center">
        <label className="flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={selectAll}
            onChange={handleSelectAll}
            className="sr-only"
          />
          <div
            className={`w-12 h-12 rounded-lg transition-all duration-200 flex items-center justify-center ${
              selectAll ? "bg-blue-200" : "bg-gray-200"
            }`}
            style={{
              boxShadow: selectAll
                ? "inset 4px 4px 8px #bfdbfe, inset -4px -4px 8px #ffffff"
                : "4px 4px 8px #c1c5c9, -4px -4px 8px #ffffff",
            }}
          >
            {selectAll && (
              <svg
                className="w-3 h-3 text-blue-700"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
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
