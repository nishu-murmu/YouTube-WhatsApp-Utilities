import { format } from "date-fns";
import { Edit2 } from "lucide-react";
import { useEffect, useState } from "react";
import { NeomorphicDateTimePicker } from "../AddVideo";

const NeomorphicDashboard = () => {
  const [currentPage, setCurrentPage] = useState<any>(1);
  const [editingDateId, setEditingDateId] = useState<any>(null);
  const [editingDate, setEditingDate] = useState<any>(null);
  const pageSize = 5;

  // Mock data for the table
  const [scheduledVideos, setScheduledVideos] = useState<any>([]);

  // Pagination logic
  const totalPages = Math.ceil(scheduledVideos.length / pageSize);
  const currentData = scheduledVideos.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handlePageChange = (page: any) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Handle date change
  const handleDateChange = (date: Date) => {
    if (editingDateId) {
      setScheduledVideos(
        scheduledVideos.map((video: any) =>
          video.id === editingDateId
            ? { ...video, scheduleDate: date, time: JSON.stringify(date) }
            : video
        )
      );
      setTimeout(() => {
        console.log({ scheduledVideos });
      }, 80);
    }
  };

  // Toggle date picker visibility
  const toggleDatePicker = (id: string) => {
    if (editingDateId === id) {
      // Close if already editing this item
      setEditingDateId(null);
      setEditingDate(null);
    } else {
      // Open for this item
      const video = scheduledVideos.find((v: any) => v.id === id);
      setEditingDateId(id);
      setEditingDate(video ? JSON.parse(video.time) : new Date());
    }
  };

  // Close date picker when clicking outside
  const closeDatePicker = () => {
    setEditingDateId(null);
    setEditingDate(null);
  };

  useEffect(() => {
    (async () => {
      const { schedules } = await browser.storage.local.get("schedules");
      setScheduledVideos(schedules || []);
    })();
  }, []);

  useEffect(() => {
    (async () => {
      await browser.storage.local.set({ schedules: scheduledVideos });
    })();
  }, [scheduledVideos]);

  return (
    <div className="p-6 bg-transparent min-h-screen flex justify-center fixed top-5 left-[50%] transform -translate-x-1/2 z-[999999]">
      <div className="w-[1020px]">
        <div className="bg-gray-100 rounded-2xl p-6 shadow-lg border border-gray-200 mb-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">
            Scheduled Videos
          </h1>
          <div className="overflow-hidden rounded-xl bg-gray-50 p-1 shadow-inner max-h-[450px] overflow-y-scroll">
            <div className="grid grid-cols-12 gap-4 p-4 font-semibold text-gray-700 border-b border-gray-200">
              <div className="col-span-5">Video</div>
              <div className="col-span-4">Title</div>
              <div className="col-span-3">Schedule Date/Time</div>
            </div>
            <div className="divide-y divide-gray-100">
              {currentData.map((item: any) => (
                <div
                  key={item.id}
                  className="grid grid-cols-12 gap-4 p-4 hover:bg-gray-100 transition-colors"
                >
                  <div className="col-span-5">
                    <div className="aspect-[16/9] rounded-md overflow-hidden shadow-sm">
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
                    <span className="text-gray-800">{item.name}</span>
                  </div>
                  <div className="col-span-3 relative">
                    <div className="flex items-center bg-gray-200 p-3 rounded-lg shadow-inner">
                      <div className="text-gray-700 flex-1">
                        {format(JSON.parse(item.time), "PPP")}
                        <br />
                        {format(JSON.parse(item.time), "HH:mm:ss")}
                      </div>
                      <button
                        onClick={() => toggleDatePicker(item.id)}
                        className={`ml-2 p-2 rounded-md transition-colors ${
                          editingDateId === item.id
                            ? "bg-blue-400 hover:bg-blue-500"
                            : "bg-gray-300 hover:bg-gray-400"
                        }`}
                      >
                        <Edit2 size={16} className="text-gray-700" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Neomorphic Pagination */}
          <div className="flex justify-center mt-6">
            <div className="bg-gray-200 p-2 rounded-lg shadow-md flex items-center space-x-1">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`p-2 rounded-md transition-transform hover:scale-105 ${
                  currentPage === 1
                    ? "text-gray-400 bg-gray-100"
                    : "text-gray-700 bg-gray-300 shadow-sm hover:bg-gray-400"
                }`}
              >
                &lt;
              </button>

              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i + 1}
                  onClick={() => handlePageChange(i + 1)}
                  className={`w-8 h-8 flex items-center justify-center rounded-md transition-transform hover:scale-105 ${
                    currentPage === i + 1
                      ? "bg-blue-600 text-white shadow-md"
                      : "bg-gray-300 text-gray-700 shadow-sm hover:bg-gray-400"
                  }`}
                >
                  {i + 1}
                </button>
              ))}

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`p-2 rounded-md transition-transform hover:scale-105 ${
                  currentPage === totalPages
                    ? "text-gray-400 bg-gray-100"
                    : "text-gray-700 bg-gray-300 shadow-sm hover:bg-gray-400"
                }`}
              >
                &gt;
              </button>
            </div>
          </div>
        </div>

        {/* Single DateTimePicker Instance - Positioned as Modal */}
        {editingDateId && (
          <div
            className="fixed inset-0 bg-transparent bg-opacity-50 flex items-center justify-center z-[9999999]"
            onClick={closeDatePicker}
          >
            <div
              className="bg-white rounded-xl p-6 shadow-xl max-w-md w-full mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Edit Schedule Date/Time
              </h3>
              <NeomorphicDateTimePicker
                selectedDate={editingDate}
                onChange={handleDateChange}
              />
              <div className="flex justify-end mt-4 space-x-2">
                <button
                  onClick={closeDatePicker}
                  className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded-md transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NeomorphicDashboard;
