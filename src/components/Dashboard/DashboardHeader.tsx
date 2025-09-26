import { Trash2, X } from "lucide-react";

const DashboardHeader = ({
  selectedItems,
  setScheduledVideos,
  setSelectedItems,
  setSelectAll,
}) => {
  const toggleDashboard = () => {
    sendRuntimeMessage({
      action: "TOGGLE_DASHBOARD",
      data: {},
    });
  };

  const handleDeleteSelected = async () => {
    await removeScheduleVideo(Array.from(selectedItems));
    const { schedules } = await browser.storage.local.get("schedules");
    setScheduledVideos(schedules || []);
    setSelectedItems(new Set());
    setSelectAll(false);
  };
  return (
    <div className="bg-white border border-gray-300 rounded-2xl p-4 mb-6 flex items-center justify-between">
      <h1 className="text-2xl font-bold text-gray-800 text-center">
        Scheduled Videos
      </h1>
      <div className="flex items-center space-x-4">
        {selectedItems.size > 0 && (
          <button
            onClick={handleDeleteSelected}
            className="px-4 py-2 bg-red-500 text-white rounded-md transition-colors duration-150 hover:bg-red-600 font-medium flex items-center space-x-2"
          >
            <Trash2 size={16} />
            <span>Delete Selected ({selectedItems.size})</span>
          </button>
        )}
        <button
          className="p-2 rounded-md text-gray-600 hover:text-gray-800 transition-colors duration-150"
          onClick={() => toggleDashboard()}
        >
          <X className="w-10 h-10" />
        </button>
      </div>
    </div>
  );
};

export default DashboardHeader;
