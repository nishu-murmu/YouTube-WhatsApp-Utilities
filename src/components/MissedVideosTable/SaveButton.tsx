import { Save } from "lucide-react";

export const SaveButton = ({ selectedCount, onSave, disabled }) => {
  return (
    <div className="flex justify-center mt-6">
      <button
        onClick={onSave}
        disabled={disabled}
        className={`px-8 py-4 rounded-2xl font-semibold transition-all duration-200 flex items-center space-x-3 ${
          disabled
            ? "text-gray-400 cursor-not-allowed"
            : "text-gray-700 hover:scale-105"
        }`}
        style={{
          boxShadow: disabled
            ? "inset 8px 8px 16px #c1c5c9, inset -8px -8px 16px #ffffff"
            : "8px 8px 16px #c1c5c9, -8px -8px 16px #ffffff",
        }}
      >
        <Save size={20} />
        <span>
          Add Selected Videos {selectedCount > 0 && `(${selectedCount})`}
        </span>
      </button>
    </div>
  );
};
