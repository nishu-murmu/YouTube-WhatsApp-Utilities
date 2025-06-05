export const TableHeader = ({ selectedCount, removeMissedVideosTable }) => {
  return (
    <div
      className="bg-gray-200 rounded-2xl p-6 mb-6 flex items-center justify-between"
      style={{
        boxShadow: "inset 8px 8px 16px #d1d5db, inset -8px -8px 16px #ffffff",
      }}
    >
      <h1 className="text-2xl font-bold text-gray-800 text-center">
        Missed Videos - You missed this videos, Want to add this to schedule?
      </h1>
      <div className="flex items-center space-x-4">
        {selectedCount > 0 && (
          <span className="text-sm text-gray-600 font-medium">
            {selectedCount} selected
          </span>
        )}
        <button
          className="p-3 rounded-xl text-gray-600 hover:text-gray-800 transition-all duration-200"
          onClick={() => removeMissedVideosTable()}
        >
          ×
        </button>
      </div>
    </div>
  );
};
