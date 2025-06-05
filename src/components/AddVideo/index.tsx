import { useEffect, useState } from "react";
import { NeoMorphicDateTimePicker } from "../DatePicker";

export function AddVideo() {
  const [currentVideoData, setCurrentVideoData] = useState({
    videoId: "",
    videoTitle: "",
  });
  const [date12, setDate12] = useState(new Date());
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleMessage = (e) => {
      if (e?.data?.type === "ADD_VIDEO") {
        setCurrentVideoData(e?.data?.data);
        setIsOpen(true);
      }
    };
    window.addEventListener("message", handleMessage);
    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []);

  const handleSubmit = async () => {
    if (!date12 || !currentVideoData?.videoId) return;
    sendRuntimeMessage({
      action: "SCHEDULE_VIDEO",
      data: {
        id: currentVideoData.videoId,
        name: currentVideoData.videoTitle,
        time: date12.toISOString(),
        url: `https://www.youtube.com/watch?v=${currentVideoData.videoId}`,
      },
    });
    setDate12(new Date());
    setIsOpen(false);
  };

  return (
    <>
      <button
        id="schedule-video"
        className="hidden"
        onClick={() => setIsOpen(true)}
      >
        Schedule Video
      </button>
      {isOpen && (
        <div className="fixed inset-0 z-[999999] flex items-center justify-center bg-black/50 font-roboto">
          <div
            className="w-full max-w-4xl rounded-3xl bg-gray-200 p-8 border border-gray-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="mb-8 bg-gray-200 rounded-2xl p-6 border border-gray-300"
              style={{
                boxShadow:
                  "inset 8px 8px 16px #d1d5db, inset -8px -8px 16px #ffffff",
              }}
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-2xl font-bold text-gray-800">
                    Schedule This Video
                  </h3>
                  <p className="mt-2 text-gray-700 bg-gray-200 rounded-xl p-3">
                    {currentVideoData?.videoTitle}
                  </p>
                </div>
                <button
                  className="p-3 rounded-xl text-gray-600 hover:text-gray-800 transition-all duration-200 cursor-pointer"
                  onClick={() => setIsOpen(false)}
                >
                  ×
                </button>
              </div>
            </div>

            <div
              className="mb-8 bg-gray-200 rounded-2xl p-6 border border-gray-300"
              style={{
                boxShadow:
                  "inset 8px 8px 16px #d1d5db, inset -8px -8px 16px #ffffff",
              }}
            >
              <NeoMorphicDateTimePicker
                selectedDate={date12}
                onChange={(newDate: any) => setDate12(newDate)}
              />
            </div>

            <div className="flex justify-end gap-4">
              <button
                className="px-6 py-3 rounded-xl font-medium text-gray-700 transition-all duration-200 hover:scale-105"
                style={{
                  boxShadow: "6px 6px 12px #c1c5c9, -6px -6px 12px #ffffff",
                }}
                onClick={() => setIsOpen(false)}
              >
                Cancel
              </button>
              <button
                className="px-6 py-3 rounded-xl font-medium text-white bg-blue-500 transition-all duration-200 hover:scale-105"
                style={{
                  boxShadow: "6px 6px 12px #93c5fd, -6px -6px 12px #bfdbfe",
                }}
                onClick={handleSubmit}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
