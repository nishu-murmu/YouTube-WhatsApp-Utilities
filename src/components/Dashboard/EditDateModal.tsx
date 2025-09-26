import { NeoMorphicDateTimePicker } from "../DatePicker";

const EditDateModal = ({
  setEditingDateId,
  setEditingDate,
  editingDateId,
  setScheduledVideos,
  scheduledVideos,
  editingDate,
}: EditDateModalProps) => {
  const closeDatePicker = () => {
    setEditingDateId(null);
    setEditingDate(null);
  };

  const handleDateChange = (date: Date) => {
    if (editingDateId) {
      setScheduledVideos(
        scheduledVideos.map((video: Schedule) =>
          video.id === editingDateId
            ? { ...video, time: JSON.stringify(date) }
            : video
        )
      );
    }
  };
  return (
    <div
      className="fixed inset-0 bg-transparent bg-opacity-30 flex items-center justify-center z-[9999999]"
      onClick={closeDatePicker}
    >
      <div
        className="bg-white rounded-md p-6 max-w-4xl w-full mx-4 border border-gray-300"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-white rounded-md p-3 mb-6 border border-gray-300">
          <h3 className="text-lg font-semibold text-gray-800 text-center">
            Edit Schedule Date/Time
          </h3>
        </div>

        <div className="bg-white rounded-md p-3 mb-6 border border-gray-300">
          <NeoMorphicDateTimePicker
            selectedDate={editingDate as Date}
            onChange={handleDateChange}
          />
        </div>

        <div className="flex justify-end space-x-3">
          <button
            onClick={closeDatePicker}
            className="px-5 py-2 bg-white cursor-pointer border border-gray-300 rounded-md transition-colors duration-150 hover:bg-gray-50 text-gray-700 font-medium"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditDateModal;
