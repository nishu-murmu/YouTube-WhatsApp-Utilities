import React, { useState } from "react";
import { Edit2 } from "lucide-react";
import { format } from "date-fns";
import { NeomorphicDateTimePicker } from "../AddVideo";

const NeomorphicDashboard = () => {
  // State management
  const [currentPage, setCurrentPage] = useState(1);
  const [editingDateId, setEditingDateId] = useState(null);
  const pageSize = 5;

  // Mock data for the table
  const [scheduledVideos, setScheduledVideos] = useState([
    {
      id: 1,
      videoId: "abc123",
      title: "Introduction to JavaScript",
      scheduleDate: new Date("2023-09-25T10:00:00Z"),
    },
    {
      id: 2,
      videoId: "def456",
      title: "React Components Explained",
      scheduleDate: new Date("2023-09-26T14:30:00Z"),
    },
    {
      id: 3,
      videoId: "ghi789",
      title: "Advanced CSS Techniques",
      scheduleDate: new Date("2023-09-27T09:15:00Z"),
    },
    {
      id: 4,
      videoId: "jkl012",
      title: "Node.js Fundamentals",
      scheduleDate: new Date("2023-09-28T16:45:00Z"),
    },
    {
      id: 5,
      videoId: "mno345",
      title: "Building REST APIs",
      scheduleDate: new Date("2023-09-29T11:20:00Z"),
    },
    {
      id: 6,
      videoId: "pqr678",
      title: "TypeScript for Beginners",
      scheduleDate: new Date("2023-09-30T13:10:00Z"),
    },
  ]);

  // Pagination logic
  const totalPages = Math.ceil(scheduledVideos.length / pageSize);
  const currentData = scheduledVideos.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Handle date change
  const handleDateChange = (date, id) => {
    setScheduledVideos(
      scheduledVideos.map((video) =>
        video.id === id ? { ...video, scheduleDate: date } : video
      )
    );
    setEditingDateId(null); // Close the date picker
  };

  // Toggle date picker visibility
  const toggleDatePicker = (id) => {
    setEditingDateId(editingDateId === id ? null : id);
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen flex justify-center">
      <div className="w-[70%]">
        {/* Neomorphic Card */}
        <div className="bg-gray-100 rounded-2xl p-6 shadow-lg border border-gray-200 mb-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">
            Scheduled Videos
          </h1>

          {/* Neomorphic Table */}
          <div className="overflow-hidden rounded-xl bg-gray-50 p-1 shadow-inner">
            {/* Table Header */}
            <div className="grid grid-cols-12 gap-4 p-4 font-semibold text-gray-700 border-b border-gray-200">
              <div className="col-span-5">Video</div>
              <div className="col-span-4">Title</div>
              <div className="col-span-3">Schedule Date/Time</div>
            </div>

            {/* Table Body */}
            <div className="divide-y divide-gray-100">
              {currentData.map((item) => (
                <div
                  key={item.id}
                  className="grid grid-cols-12 gap-4 p-4 hover:bg-gray-100 transition-colors"
                >
                  <div className="col-span-5">
                    <div className="aspect-[16/9] rounded-md overflow-hidden shadow-sm">
                      <iframe
                        className="w-full h-full"
                        src={`https://www.youtube.com/embed/${item.videoId}`}
                        title={item.title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  </div>
                  <div className="col-span-4 flex items-center">
                    <span className="text-gray-800">{item.title}</span>
                  </div>
                  <div className="col-span-3">
                    {editingDateId === item.id ? (
                      <div className="absolute z-50 p-1 bg-white rounded-xl shadow-lg">
                        <NeomorphicDateTimePicker
                          selectedDate={item.scheduleDate}
                          onChange={(date) => handleDateChange(date, item.id)}
                        />
                      </div>
                    ) : (
                      <div className="flex items-center bg-gray-200 p-3 rounded-lg shadow-inner">
                        <div className="text-gray-700 flex-1">
                          {format(item.scheduleDate, "PPP")}
                          <br />
                          {format(item.scheduleDate, "HH:mm:ss")}
                        </div>
                        <button
                          onClick={() => toggleDatePicker(item.id)}
                          className="ml-2 p-2 bg-gray-300 hover:bg-gray-400 rounded-md transition-colors"
                        >
                          <Edit2 size={16} className="text-gray-700" />
                        </button>
                      </div>
                    )}
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
      </div>
    </div>
  );
};

export default NeomorphicDashboard;
