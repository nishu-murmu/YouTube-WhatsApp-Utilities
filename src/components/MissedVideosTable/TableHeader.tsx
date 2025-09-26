export const TableHeader = ({ selectedCount, removeMissedVideosTable }) => {
  return (
    <div
      className="bg-white border border-gray-300 rounded-md p-4 mb-6 flex items-center justify-between"
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
          className="p-2 rounded-md text-gray-600 hover:text-gray-800 transition-colors duration-150"
          onClick={() => removeMissedVideosTable()}
        >
          ×
        </button>
      </div>
    </div>
  );
};
