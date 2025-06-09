import { Edit2, Trash2 } from "lucide-react";
import { format } from "date-fns";

const DashboardWithData = ({
  selectedItems,
  currentData,
  editingDateId,
  setEditingDateId,
  setEditingDate,
  scheduledVideos,
  setSelectedItems,
  setSelectAll,
  setScheduledVideos,
}: DashboardWithDataProps) => {
  const toggleDatePicker = (id: string) => {
    if (editingDateId === id) {
      setEditingDateId(null);
      setEditingDate(null);
    } else {
      const video = scheduledVideos.find((v: Schedule) => v.id === id);
      setEditingDateId(id);
      setEditingDate(video ? JSON.parse(video.time) : new Date());
    }
  };
  const handleSelectItem = (id: string) => {
    const newSelectedItems = new Set(selectedItems);
    if (newSelectedItems.has(id)) {
      newSelectedItems.delete(id);
    } else {
      newSelectedItems.add(id);
    }
    setSelectedItems(newSelectedItems);
    setSelectAll(
      newSelectedItems.size === currentData.length && currentData.length > 0
    );
  };

  const handleDeleteSingle = async (id: string) => {
    await removeScheduleVideo([id]);
    const { schedules } = await browser.storage.local.get("schedules");
    setScheduledVideos(schedules || []);
  };
  return (
    <div className="space-y-3">
      {currentData.map((item: Schedule) => (
        <div
          key={item.id}
          className={`grid grid-cols-14 gap-4 p-6 bg-gray-200 rounded-2xl transition-all duration-300 hover:scale-[1.02] ${
            selectedItems.has(item.id) ? "ring-2 ring-blue-300" : ""
          }`}
          style={{
            boxShadow: selectedItems.has(item.id)
              ? "8px 8px 16px #bfdbfe, -8px -8px 16px #ffffff"
              : "8px 8px 16px #c1c5c9, -8px -8px 16px #ffffff",
          }}
        >
          <div className="col-span-1 flex items-center justify-center">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={selectedItems.has(item.id)}
                onChange={() => handleSelectItem(item.id)}
                className="sr-only"
              />
              <div
                className={`w-12 h-12 rounded-lg transition-all duration-200 flex items-center justify-center ${
                  selectedItems.has(item.id) ? "bg-blue-200" : "bg-gray-200"
                }`}
                style={{
                  boxShadow: selectedItems.has(item.id)
                    ? "inset 4px 4px 8px #bfdbfe, inset -4px -4px 8px #ffffff"
                    : "4px 4px 8px #c1c5c9, -4px -4px 8px #ffffff",
                }}
              >
                {selectedItems.has(item.id) && (
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
          <div className="col-span-5">
            <div
              className="aspect-[16/9] rounded-2xl overflow-hidden bg-gray-300"
              style={{
                boxShadow:
                  "inset 8px 8px 16px #c1c5c9, inset -8px -8px 16px #ffffff",
              }}
            >
              <iframe
                className="w-full h-full"
                src={`https://www.youtube.com/embed/${item.id}`}
                title={item.name}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
          <div className="col-span-4 flex items-center">
            <div
              className="bg-gray-200 rounded-xl p-4 w-full"
              style={{
                boxShadow:
                  "inset 4px 4px 8px #c1c5c9, inset -4px -4px 8px #ffffff",
              }}
            >
              <span className="text-gray-800 font-medium">{item.name}</span>
            </div>
          </div>
          <div className="col-span-3 flex items-center">
            <div
              className="w-full flex items-center bg-gray-200 p-4 rounded-2xl transition-all duration-200"
              style={{
                boxShadow:
                  "inset 8px 8px 16px #c1c5c9, inset -8px -8px 16px #ffffff",
              }}
            >
              <div className="text-gray-700 flex-1 text-sm">
                {format(JSON.parse(item.time), "PPP")}
                <br />
                {format(JSON.parse(item.time), "HH:mm:ss")}
              </div>
              <button
                onClick={() => toggleDatePicker(item.id)}
                className={`ml-3 p-3 rounded-xl transition-all duration-200 ${
                  editingDateId === item.id
                    ? "bg-blue-200 text-blue-700"
                    : "bg-gray-200 text-gray-600 hover:scale-105"
                }`}
                style={{
                  boxShadow:
                    editingDateId === item.id
                      ? "inset 6px 6px 12px #bfdbfe, inset -6px -6px 12px #ffffff"
                      : "6px 6px 12px #c1c5c9, -6px -6px 12px #ffffff",
                }}
              >
                <Edit2 size={16} />
              </button>
            </div>
          </div>
          <div className="col-span-1 flex items-center justify-center">
            <button
              onClick={() => handleDeleteSingle(item.id)}
              className="p-3 rounded-xl bg-red-200 text-red-700 transition-all duration-200 hover:scale-105"
              style={{
                boxShadow: "6px 6px 12px #c1c5c9, -6px -6px 12px #ffffff",
              }}
              title="Delete this item"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DashboardWithData;
