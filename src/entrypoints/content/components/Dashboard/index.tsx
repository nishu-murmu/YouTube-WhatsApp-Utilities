import { format } from "date-fns";
import { Edit2 } from "lucide-react";
import { useEffect, useState } from "react";
import { NeomorphicDateTimePicker } from "../AddVideo";

const NeomorphicDashboard = () => {
  const [currentPage, setCurrentPage] = useState<any>(1);
  const [editingDateId, setEditingDateId] = useState<any>(null);
  const [editingDate, setEditingDate] = useState<any>(null);
  const pageSize = 5;
  const [scheduledVideos, setScheduledVideos] = useState<any>([]);
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


  useEffect(() => {
    browser.storage.local.onChanged.addListener((changes) => {
      console.log(changes)
      // if (changes.schedules) {
      //   setScheduledVideos(changes.schedules)
      // }
    })
    return () => {

    }
  }, []);

  return (
    <div className="p-6 bg-transparent min-h-screen flex justify-center fixed top-16 left-[50%] transform -translate-x-1/2 z-[999999]">
      <div className="w-[1020px]">
        <div
          className="bg-gray-200 rounded-3xl p-8 border border-gray-300 mb-8"
          style={{
            boxShadow: '10px 10px 40px #b8bcc8, -10px -10px 40px #ffffff'
          }}
        >
          <div
            className="bg-gray-200 rounded-2xl p-6 mb-6"
            style={{
              boxShadow: 'inset 8px 8px 16px #d1d5db, inset -8px -8px 16px #ffffff'
            }}
          >
            <h1 className="text-2xl font-bold text-gray-800 text-center">
              Scheduled Videos
            </h1>
          </div>

          <div
            className="overflow-hidden rounded-2xl bg-gray-200 p-2 max-h-[450px] overflow-y-scroll"
            style={{
              boxShadow: 'inset 12px 12px 24px #c1c5c9, inset -12px -12px 24px #ffffff'
            }}
          >
            <div
              className="grid grid-cols-12 gap-4 p-4 font-semibold text-gray-700 mb-2 bg-gray-200 rounded-xl"
              style={{
                boxShadow: '6px 6px 12px #c1c5c9, -6px -6px 12px #ffffff'
              }}
            >
              <div className="col-span-5">Video</div>
              <div className="col-span-4">Title</div>
              <div className="col-span-3">Schedule Date/Time</div>
            </div>

            {currentData.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 px-4">
                <div
                  className="bg-gray-200 rounded-3xl p-12 border border-gray-300"
                  style={{
                    boxShadow: 'inset 16px 16px 32px #c1c5c9, inset -16px -16px 32px #ffffff'
                  }}
                >
                  <div className="text-center">
                    <div
                      className="w-20 h-20 mx-auto mb-6 bg-gray-200 rounded-full flex items-center justify-center"
                      style={{
                        boxShadow: '12px 12px 24px #c1c5c9, -12px -12px 24px #ffffff'
                      }}
                    >
                      <svg
                        className="w-10 h-10 text-gray-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m0 0V3a1 1 0 011 1v12a4 4 0 01-4 4H8a4 4 0 01-4-4V4a1 1 0 011-1m0 0h12m-6 8l-2-2m0 0l-2 2m2-2v6"
                        />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">
                      No Data Available
                    </h3>
                    <p className="text-gray-500 max-w-sm">
                      There are currently no items to display. Add some content
                      to get started.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {currentData.map((item: any) => (
                  <div
                    key={item.id}
                    className="grid grid-cols-12 gap-4 p-6 bg-gray-200 rounded-2xl transition-all duration-300 hover:scale-[1.02]"
                    style={{
                      boxShadow: '8px 8px 16px #c1c5c9, -8px -8px 16px #ffffff'
                    }}
                  >
                    <div className="col-span-5">
                      <div
                        className="aspect-[16/9] rounded-2xl overflow-hidden bg-gray-300"
                        style={{
                          boxShadow: 'inset 8px 8px 16px #c1c5c9, inset -8px -8px 16px #ffffff'
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
                          boxShadow: 'inset 4px 4px 8px #c1c5c9, inset -4px -4px 8px #ffffff'
                        }}
                      >
                        <span className="text-gray-800 font-medium">
                          {item.name}
                        </span>
                      </div>
                    </div>
                    <div className="col-span-3 relative">
                      <div
                        className="flex items-center bg-gray-200 p-4 rounded-2xl transition-all duration-200"
                        style={{
                          boxShadow: 'inset 8px 8px 16px #c1c5c9, inset -8px -8px 16px #ffffff'
                        }}
                      >
                        <div className="text-gray-700 flex-1 text-sm">
                          {format(JSON.parse(item.time), "PPP")}
                          <br />
                          {format(JSON.parse(item.time), "HH:mm:ss")}
                        </div>
                        <button
                          onClick={() => toggleDatePicker(item.id)}
                          className={`ml-3 p-3 rounded-xl transition-all duration-200 ${editingDateId === item.id
                            ? "bg-blue-200 text-blue-700"
                            : "bg-gray-200 text-gray-600 hover:scale-105"
                            }`}
                          style={{
                            boxShadow: editingDateId === item.id
                              ? 'inset 6px 6px 12px #bfdbfe, inset -6px -6px 12px #ffffff'
                              : '6px 6px 12px #c1c5c9, -6px -6px 12px #ffffff'
                          }}
                        >
                          <Edit2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Neomorphic Pagination */}
          <div className="flex justify-center mt-8">
            <div
              className="bg-gray-200 p-3 rounded-2xl flex items-center space-x-2"
              style={{
                boxShadow: '12px 12px 24px #c1c5c9, -12px -12px 24px #ffffff'
              }}
            >
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`p-3 rounded-xl transition-all duration-200 hover:scale-105 ${currentPage === 1
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-gray-700"
                  }`}
                style={{
                  boxShadow: currentPage === 1
                    ? 'inset 4px 4px 8px #c1c5c9, inset -4px -4px 8px #ffffff'
                    : '4px 4px 8px #c1c5c9, -4px -4px 8px #ffffff'
                }}
              >
                &lt;
              </button>

              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i + 1}
                  onClick={() => handlePageChange(i + 1)}
                  className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all duration-200 hover:scale-105 ${currentPage === i + 1
                    ? "bg-blue-200 text-blue-700 font-semibold"
                    : "text-gray-700"
                    }`}
                  style={{
                    boxShadow: currentPage === i + 1
                      ? 'inset 6px 6px 12px #bfdbfe, inset -6px -6px 12px #ffffff'
                      : '6px 6px 12px #c1c5c9, -6px -6px 12px #ffffff'
                  }}
                >
                  {i + 1}
                </button>
              ))}

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`p-3 rounded-xl transition-all duration-200 hover:scale-105 ${currentPage === totalPages
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-gray-700"
                  }`}
                style={{
                  boxShadow: currentPage === totalPages
                    ? 'inset 4px 4px 8px #c1c5c9, inset -4px -4px 8px #ffffff'
                    : '4px 4px 8px #c1c5c9, -4px -4px 8px #ffffff'
                }}
              >
                &gt;
              </button>
            </div>
          </div>
        </div>

        {/* Single DateTimePicker Instance - Positioned as Modal */}
        {editingDateId && (
          <div
            className="fixed inset-0 bg-transparent bg-opacity-30 flex items-center justify-center z-[9999999]"
            onClick={closeDatePicker}
          >
            <div
              className="bg-gray-200 rounded-3xl p-8 max-w-md w-full mx-4"
              style={{
                boxShadow: '20px 20px 40px #9ca3af, -20px -20px 40px #ffffff'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div
                className="bg-gray-200 rounded-2xl p-4 mb-6"
                style={{
                  boxShadow: 'inset 8px 8px 16px #c1c5c9, inset -8px -8px 16px #ffffff'
                }}
              >
                <h3 className="text-lg font-semibold text-gray-800 text-center">
                  Edit Schedule Date/Time
                </h3>
              </div>

              <div
                className="bg-gray-200 rounded-2xl p-4 mb-6"
                style={{
                  boxShadow: 'inset 6px 6px 12px #c1c5c9, inset -6px -6px 12px #ffffff'
                }}
              >
                <NeomorphicDateTimePicker
                  selectedDate={editingDate}
                  onChange={handleDateChange}
                />
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={closeDatePicker}
                  className="px-6 py-3 bg-gray-200 rounded-xl transition-all duration-200 hover:scale-105 text-gray-700 font-medium"
                  style={{
                    boxShadow: '6px 6px 12px #c1c5c9, -6px -6px 12px #ffffff'
                  }}
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
