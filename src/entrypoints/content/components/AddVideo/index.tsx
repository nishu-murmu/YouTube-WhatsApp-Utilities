import React, { useState, useEffect, useRef } from "react";

export const NeomorphicDateTimePicker = ({ selectedDate, onChange }) => {
  // Get the real current date/time for minimum date restriction
  const currentDateTime = new Date();

  // Initialize with provided date or current date, ensuring it's not in the past
  const initialDate = selectedDate || new Date();
  // If the initialDate is in the past, use currentDateTime
  if (initialDate.getTime() < currentDateTime.getTime()) {
    initialDate.setTime(currentDateTime.getTime());
  }

  // State for date and time values
  const [date, setDate] = useState(initialDate.getDate());
  const [month, setMonth] = useState(initialDate.getMonth() + 1);
  const [year, setYear] = useState(initialDate.getFullYear());
  const [hour, setHour] = useState(initialDate.getHours());
  const [minute, setMinute] = useState(initialDate.getMinutes());

  // Animation states
  const [isScrolling, setIsScrolling] = useState<any>({
    date: false,
    month: false,
    year: false,
    hour: false,
    minute: false,
  });

  // References for each scroll container
  const dateRef = useRef(null);
  const monthRef = useRef(null);
  const yearRef = useRef(null);
  const hourRef = useRef(null);
  const minuteRef = useRef(null);

  // Get days in current month
  const getDaysInMonth = (month: any, year: any) => {
    return new Date(year, month, 0).getDate();
  };

  // Generate arrays for all possible values based on current restrictions
  const days = Array.from(
    { length: getDaysInMonth(month, year) },
    (_, i) => i + 1
  ).filter((d) => {
    // If year and month are current, only allow days from today onwards
    if (
      year === currentDateTime.getFullYear() &&
      month === currentDateTime.getMonth() + 1
    ) {
      return d >= currentDateTime.getDate();
    }
    return true;
  });

  const months = Array.from({ length: 12 }, (_, i) => i + 1).filter((m) => {
    // If year is current, only allow months from current onwards
    if (year === currentDateTime.getFullYear()) {
      return m >= currentDateTime.getMonth() + 1;
    }
    return true;
  });

  const years = Array.from(
    { length: 21 },
    (_, i) => currentDateTime.getFullYear() + i
  ); // Only future years from now

  const hours = Array.from({ length: 24 }, (_, i) => i).filter((h) => {
    // If year, month, and day are current, only allow hours from now onwards
    if (
      year === currentDateTime.getFullYear() &&
      month === currentDateTime.getMonth() + 1 &&
      date === currentDateTime.getDate()
    ) {
      return h >= currentDateTime.getHours();
    }
    return true;
  });

  const minutes = Array.from({ length: 60 }, (_, i) => i).filter((m) => {
    // If year, month, day, and hour are current, only allow minutes from now onwards
    if (
      year === currentDateTime.getFullYear() &&
      month === currentDateTime.getMonth() + 1 &&
      date === currentDateTime.getDate() &&
      hour === currentDateTime.getHours()
    ) {
      return m >= currentDateTime.getMinutes();
    }
    return true;
  });

  // Check if current selections are valid whenever dependencies change
  useEffect(() => {
    // Update available options when date/time selections change
    const newTime = new Date(year, month - 1, date, hour, minute);

    // If selected time is before current time, adjust to current time
    if (newTime.getTime() < currentDateTime.getTime()) {
      // Find the closest valid time
      if (year < currentDateTime.getFullYear()) {
        setYear(currentDateTime.getFullYear());
      }

      if (
        year === currentDateTime.getFullYear() &&
        month < currentDateTime.getMonth() + 1
      ) {
        setMonth(currentDateTime.getMonth() + 1);
      }

      if (
        year === currentDateTime.getFullYear() &&
        month === currentDateTime.getMonth() + 1 &&
        date < currentDateTime.getDate()
      ) {
        setDate(currentDateTime.getDate());
      }

      if (
        year === currentDateTime.getFullYear() &&
        month === currentDateTime.getMonth() + 1 &&
        date === currentDateTime.getDate() &&
        hour < currentDateTime.getHours()
      ) {
        setHour(currentDateTime.getHours());
      }

      if (
        year === currentDateTime.getFullYear() &&
        month === currentDateTime.getMonth() + 1 &&
        date === currentDateTime.getDate() &&
        hour === currentDateTime.getHours() &&
        minute < currentDateTime.getMinutes()
      ) {
        setMinute(currentDateTime.getMinutes());
      }
    }

    // Check if date is valid for the selected month
    const maxDays = getDaysInMonth(month, year);
    if (date > maxDays) {
      setDate(maxDays);
    }
  }, [year, month, date, hour, minute]);

  // Update parent component when values change - but only when our internal values actually change
  useEffect(() => {
    if (onChange) {
      // Create new date object from current values
      const newDateObj = new Date(year, month - 1, date, hour, minute);

      // Only call onChange if the date is actually different
      // This prevents infinite loops by not triggering when the parent updates selectedDate
      if (!selectedDate || newDateObj.getTime() !== selectedDate.getTime()) {
        onChange(newDateObj);
      }
    }
  }, [date, month, year, hour, minute]);

  // Render a slot wheel for each value type
  const renderWheel = (
    values: any,
    current: any,
    setter: any,
    type: any,
    ref: any
  ) => {
    // Set up wheel event handling with a non-passive listener
    useEffect(() => {
      const element = ref.current;
      if (!element) return;

      const handleWheelEvent = (e: any) => {
        e.stopPropagation();
        e.preventDefault();

        // If values array is empty (meaning no valid values available), do nothing
        if (values.length === 0) return;

        // Calculate position index
        const currentIndex = values.indexOf(current);

        // If current value isn't in values array (might happen when switching months),
        // set to first available value
        if (currentIndex === -1) {
          setter(values[0]);
          return;
        }

        // Start scrolling animation
        setIsScrolling((prev: any) => ({ ...prev, [type]: true }));

        // Direction of scroll (up or down)
        const direction = e.deltaY > 0 ? 1 : -1;

        // Calculate new index with bounds checking
        let newIndex = (currentIndex + direction) % values.length;
        if (newIndex < 0) newIndex = values.length - 1;

        // Update state
        setter(values[newIndex]);

        // Stop scrolling animation after delay
        setTimeout(() => {
          setIsScrolling((prev: any) => ({ ...prev, [type]: false }));
        }, 50);
      };

      // Add wheel event listener with passive: false option
      element.addEventListener("wheel", handleWheelEvent, { passive: false });

      // Clean up
      return () => {
        element.removeEventListener("wheel", handleWheelEvent);
      };
    }, [ref, values, current, type]);

    // If values array is empty, show a placeholder
    if (values.length === 0) {
      return (
        <div
          className="relative h-32 overflow-hidden rounded-lg bg-gray-100 shadow-inner flex items-center justify-center"
          ref={ref}
        >
          <p className="text-gray-400 font-medium">No options</p>
        </div>
      );
    }

    // Calculate position index
    const currentIndex = values.indexOf(current);

    // If current value isn't in the list, select the first available
    useEffect(() => {
      if (currentIndex === -1 && values.length > 0) {
        setter(values[0]);
      }
    }, [values, current]);

    return (
      <div
        className="relative h-32 overflow-hidden rounded-lg bg-gray-100 shadow-inner"
        ref={ref}
      >
        {/* Fixed selection indicator - positioned in center */}
        <div className="absolute top-1/2 left-0 right-0 h-10 -mt-5 pointer-events-none z-10">
          <div className="h-full mx-1 bg-blue-100 bg-opacity-40 rounded-md border border-blue-200"></div>
        </div>

        {/* Slot values container */}
        <div
          className={`flex flex-col items-center justify-center h-full transition-transform duration-300 px-2 ${
            isScrolling[type] ? "transform translate-y-1" : ""
          }`}
        >
          {values.map((value: any, index: number) => {
            // Calculate relative position (-3 to +3 from current)
            const relativePos =
              (index - currentIndex + values.length) % values.length;
            const wrappedPos =
              relativePos > values.length / 2
                ? relativePos - values.length
                : relativePos;

            // Only render 7 items (-3 to +3 from current)
            if (wrappedPos >= -3 && wrappedPos <= 3) {
              // Calculate styles based on position
              const isSelected = wrappedPos === 0;
              const opacity = 1 - Math.abs(wrappedPos) * 0.2;
              const scale = 1 - Math.abs(wrappedPos) * 0.08;

              // Adjust translateY to ensure selected value is centered
              const translateY = wrappedPos * 24; // pixels instead of rem for more precise control

              return (
                <div
                  key={value}
                  className={`absolute py-1 px-3 font-mono text-2xl font-bold cursor-pointer transition-all duration-200
                    ${isSelected ? "text-blue-600 z-10" : "text-gray-500"}`}
                  style={{
                    opacity: opacity,
                    transform: `scale(${scale}) translateY(${translateY}px)`,
                    top: "calc(50% - 16px)", // Center in container (half of item height)
                  }}
                  onClick={() => setter(value)}
                >
                  {value.toString().padStart(2, "0")}
                </div>
              );
            }
            return null;
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-gray-200 rounded-xl p-6 w-full">
      <h3 className="text-xl font-semibold text-gray-700 mb-4 text-center">
        Select Date & Time
      </h3>

      {/* Main content container */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        {/* Date picker - takes 3/5 of the space */}
        <div className="md:col-span-3 bg-gray-50 p-5 rounded-xl shadow-lg">
          <h3 className="text-lg font-semibold text-gray-700 mb-3 text-center">
            Date
          </h3>
          <div className="flex gap-3">
            <div className="w-[25%]">
              <p className="text-sm font-medium text-gray-500 mb-2 text-center">
                Day
              </p>
              {renderWheel(days, date, setDate, "date", dateRef)}
            </div>
            <div className="w-[25%]">
              <p className="text-sm font-medium text-gray-500 mb-2 text-center">
                Month
              </p>
              {renderWheel(months, month, setMonth, "month", monthRef)}
            </div>
            <div className="w-[50%]">
              <p className="text-sm font-medium text-gray-500 mb-2 text-center">
                Year
              </p>
              {renderWheel(years, year, setYear, "year", yearRef)}
            </div>
          </div>
        </div>

        {/* Time picker - takes 2/5 of the space */}
        <div className="md:col-span-2 bg-gray-50 p-5 rounded-xl shadow-lg">
          <h3 className="text-lg font-semibold text-gray-700 mb-3 text-center">
            Time
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-2 text-center">
                Hour
              </p>
              {renderWheel(hours, hour, setHour, "hour", hourRef)}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 mb-2 text-center">
                Minute
              </p>
              {renderWheel(minutes, minute, setMinute, "minute", minuteRef)}
            </div>
          </div>
        </div>
      </div>

      {/* Selected date display */}
      <div className="mt-5 p-4 bg-gray-100 rounded-lg shadow-inner text-center">
        <p className="text-lg font-mono">
          Selected:{" "}
          <span className="text-blue-600 font-bold">{`${year}-${month
            .toString()
            .padStart(2, "0")}-${date.toString().padStart(2, "0")} ${hour
            .toString()
            .padStart(2, "0")}:${minute.toString().padStart(2, "0")}`}</span>
        </p>
      </div>
    </div>
  );
};

// Updated AddVideo component with Neomorphic Date Picker
export function AddVideo() {
  const [currentVideoData, setCurrentVideoData] = useState({
    videoId: "",
    videoTitle: "",
  });
  const [date12, setDate12] = useState(new Date());
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
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
            className="w-full max-w-4xl max-h-[90vh] h-auto rounded-lg bg-white p-6 shadow-xl dark:bg-gray-900"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex justify-between items-center">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Schedule This Video
                </h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {currentVideoData?.videoTitle}
                </p>
              </div>
              <button
                className="text-gray-400 hover:text-gray-500"
                onClick={() => setIsOpen(false)}
              >
                ✕
              </button>
            </div>

            {/* Date picker takes full width */}
            <NeomorphicDateTimePicker
              selectedDate={date12}
              onChange={(newDate: any) => setDate12(newDate)}
            />

            {/* Buttons with Neomorphic style for Save button */}
            <div className="mt-6 flex justify-end gap-3">
              <button
                className="rounded-md border border-gray-300 bg-transparent px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
                onClick={() => setIsOpen(false)}
              >
                Cancel
              </button>

              {/* Neomorphic save button */}
              <button
                className="rounded-md px-6 py-3 text-base font-medium text-white 
                  bg-gradient-to-b from-blue-500 to-blue-600
                  shadow-lg shadow-blue-500/30 hover:shadow-blue-500/40
                  transform transition duration-200 hover:-translate-y-0.5
                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
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

export default AddVideo;
