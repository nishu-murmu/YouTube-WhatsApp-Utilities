import { Save } from "lucide-react";

export const SaveButton = ({ selectedCount, onSave, disabled }) => {
  return (
    <div className="flex justify-center mt-6">
      <button
        onClick={onSave}
        disabled={disabled}
        className={`px-8 py-3 rounded-md font-semibold transition-colors duration-150 flex items-center space-x-3 border ${
          disabled
            ? "text-gray-400 bg-gray-100 cursor-not-allowed border-gray-200"
            : "text-gray-700 bg-white hover:bg-gray-50 border-gray-300"
        }`}
      >
        <Save size={20} />
        <span>
          Add Selected Videos {selectedCount > 0 && `(${selectedCount})`}
        </span>
      </button>
    </div>
  );
};
