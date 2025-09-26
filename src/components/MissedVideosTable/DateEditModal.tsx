import { NeoMorphicDateTimePicker } from "../DatePicker";

export const DateEditModal = ({
  isOpen,
  onClose,
  selectedDate,
  onChange,
}: DateEditModalProps) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-[9999999]"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-md p-6 max-w-4xl w-full mx-4 border border-gray-300"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-white rounded-md p-3 mb-6 border border-gray-300">
          <h3 className="text-lg font-semibold text-gray-800 text-center">
            Edit Video Time
          </h3>
        </div>

        <div className="bg-white rounded-md p-3 mb-6 border border-gray-300">
          <NeoMorphicDateTimePicker
            selectedDate={selectedDate}
            onChange={onChange}
          />
        </div>

        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-white border border-gray-300 rounded-md transition-colors duration-150 hover:bg-gray-50 text-gray-700 font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
