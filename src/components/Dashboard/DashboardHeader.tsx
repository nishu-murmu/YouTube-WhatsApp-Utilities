import { Trash2 } from "lucide-react";

const DashboardHeader = ({
  selectedItems,
  setScheduledVideos,
  setSelectedItems,
  setSelectAll,
}: DashboardHeaderProps) => {
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
    <div
      className="bg-gray-200 rounded-2xl p-6 mb-6 flex items-center justify-between"
      style={{
        boxShadow: "inset 8px 8px 16px #d1d5db, inset -8px -8px 16px #ffffff",
      }}
    >
      <h1 className="text-2xl font-bold text-gray-800 text-center">
        Scheduled Videos
      </h1>
      <div className="flex items-center space-x-4">
        {selectedItems.size > 0 && (
          <button
            onClick={handleDeleteSelected}
            className="px-4 py-2 bg-red-200 text-red-700 rounded-xl transition-all duration-200 hover:scale-105 font-medium flex items-center space-x-2"
            style={{
              boxShadow: "6px 6px 12px #c1c5c9, -6px -6px 12px #ffffff",
            }}
          >
            <Trash2 size={16} />
            <span>Delete Selected ({selectedItems.size})</span>
          </button>
        )}
        <button
          className="p-3 rounded-xl text-gray-600 hover:text-gray-800 transition-all duration-200"
          onClick={() => toggleDashboard()}
        >
          ×
        </button>
      </div>
    </div>
  );
};

export default DashboardHeader;
