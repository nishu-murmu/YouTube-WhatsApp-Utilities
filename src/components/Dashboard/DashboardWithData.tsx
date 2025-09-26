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
      setEditingDate(video ? JSON.parse(video.time as string) : new Date());
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
          className={`grid grid-cols-14 gap-4 p-4 bg-white border border-gray-300 rounded-md transition-colors duration-150 ${
            selectedItems.has(item.id) ? "ring-2 ring-blue-300" : "hover:bg-gray-50"
          }`}
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
                className={`w-12 h-12 rounded-md transition-colors duration-150 flex items-center justify-center border ${
                  selectedItems.has(item.id)
                    ? "bg-blue-500 border-blue-600 text-white"
                    : "bg-white border-gray-300 text-gray-600"
                }`}
              >
                {selectedItems.has(item.id) && (
                  <svg
                    className="w-3 h-3"
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
            <div className="aspect-[16/9] rounded-md overflow-hidden bg-gray-200 border border-gray-300">
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
            <div className="bg-white border border-gray-300 rounded-md p-3 w-full">
              <span className="text-gray-800 font-medium">{item.name}</span>
            </div>
          </div>
          <div className="col-span-3 flex items-center">
            <div className="w-full flex items-center bg-white border border-gray-300 p-3 rounded-md">
              <div className="text-gray-700 flex-1 text-sm">
                {format(JSON.parse(item.time as string), "PPP")}
                <br />
                {format(JSON.parse(item.time as string), "HH:mm:ss")}
              </div>
              <button
                onClick={() => toggleDatePicker(item.id)}
                className={`ml-3 p-2 rounded-md transition-colors duration-150 ${
                  editingDateId === item.id
                    ? "bg-blue-500 text-white"
                    : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                }`}
              >
                <Edit2 size={16} />
              </button>
            </div>
          </div>
          <div className="col-span-1 flex items-center justify-center">
            <button
              onClick={() => handleDeleteSingle(item.id)}
              className="p-2 rounded-md bg-red-500 text-white transition-colors duration-150 hover:bg-red-600"
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
