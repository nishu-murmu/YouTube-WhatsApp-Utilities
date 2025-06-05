import { NeoMorphicDateTimePicker } from "../DatePicker";

const EditDateModal = ({
  setEditingDateId,
  setEditingDate,
  editingDateId,
  setScheduledVideos,
  scheduledVideos,
  editingDate,
}) => {
  const closeDatePicker = () => {
    setEditingDateId(null);
    setEditingDate(null);
  };

  const handleDateChange = (date: Date) => {
    if (editingDateId) {
      setScheduledVideos(
        scheduledVideos.map((video: any) =>
          video.id === editingDateId
            ? { ...video, scheduleDate: date, time: JSON.stringify(date) }
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
        className="bg-gray-200 rounded-3xl p-8 max-w-4xl w-full mx-4"
        style={{
          boxShadow: "20px 20px 40px #9ca3af, -20px -20px 40px #ffffff",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="bg-gray-200 rounded-2xl p-4 mb-6"
          style={{
            boxShadow:
              "inset 8px 8px 16px #c1c5c9, inset -8px -8px 16px #ffffff",
          }}
        >
          <h3 className="text-lg font-semibold text-gray-800 text-center">
            Edit Schedule Date/Time
          </h3>
        </div>

        <div
          className="bg-gray-200 rounded-2xl p-4 mb-6"
          style={{
            boxShadow:
              "inset 6px 6px 12px #c1c5c9, inset -6px -6px 12px #ffffff",
          }}
        >
          <NeoMorphicDateTimePicker
            selectedDate={editingDate}
            onChange={handleDateChange}
          />
        </div>

        <div className="flex justify-end space-x-3">
          <button
            onClick={closeDatePicker}
            className="px-6 py-3 bg-gray-200 rounded-xl transition-all duration-200 hover:scale-105 text-gray-700 font-medium"
            style={{
              boxShadow: "6px 6px 12px #c1c5c9, -6px -6px 12px #ffffff",
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditDateModal;
