// Neomorphic Date Time Picker Component
const NeomorphicDateTimePicker = ({ selectedDate, onChange }: any) => {
  // Initialize with current date or provided date
  const now = selectedDate || new Date();

  // State for date and time values
  const [date, setDate] = useState(now.getDate());
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());
  const [hour, setHour] = useState(now.getHours());
  const [minute, setMinute] = useState(now.getMinutes());

  // Animation states
  const [isScrolling, setIsScrolling] = useState<any>({
    date: false,
    month: false,
    year: false,
    hour: false,
    minute: false,
    second: false,
  });

  // References for each scroll container
  const dateRef = useRef(null);
  const monthRef = useRef(null);
  const yearRef = useRef(null);
  const hourRef = useRef(null);
  const minuteRef = useRef(null);
  const secondRef = useRef(null);

  // Get days in current month
  const getDaysInMonth = (month: any, year: any) => {
    return new Date(year, month, 0).getDate();
  };

  // Generate arrays for all possible values
  const days = Array.from(
    { length: getDaysInMonth(month, year) },
    (_, i) => i + 1
  );
  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const years = Array.from(
    { length: 21 },
    (_, i) => now.getFullYear() - 10 + i
  );
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const minutes = Array.from({ length: 60 }, (_, i) => i);

  // Handle wheel events for scrolling
  const handleWheel = (
    e: any,
    setter: any,
    values: any,
    current: any,
    type: any
  ) => {
    console.log(e, "check");
    e.stopPropagation();
    e.preventDefault();

    // Start scrolling animation
    setIsScrolling((prev: any) => ({ ...prev, [type]: true }));

    // Direction of scroll (up or down)
    const direction = e.deltaY > 0 ? 1 : -1;
    const index = values.indexOf(current);
    let newIndex = (index + direction) % values.length;

    // Handle negative index
    if (newIndex < 0) newIndex = values.length - 1;

    // Update state
    setter(values[newIndex]);

    // Stop scrolling animation after delay
    setTimeout(() => {
      setIsScrolling((prev: any) => ({ ...prev, [type]: false }));
    }, 50);
  };

  // Check if date is valid when month or year changes
  useEffect(() => {
    const maxDays = getDaysInMonth(month, year);
    if (date > maxDays) {
      setDate(maxDays);
    }
  }, [month, year, date]);

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
    // Calculate position index
    const currentIndex = values.indexOf(current);

    // Set up wheel event handling with a non-passive listener
    useEffect(() => {
      const element = ref.current;
      if (!element) return;

      const handleWheelEvent = (e: any) => {
        e.stopPropagation();
        e.preventDefault();

        // Start scrolling animation
        setIsScrolling((prev: any) => ({ ...prev, [type]: true }));

        // Direction of scroll (up or down)
        const direction = e.deltaY > 0 ? 1 : -1;
        const index = values.indexOf(current);
        let newIndex = (index + direction) % values.length;

        // Handle negative index
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

    return (
      <div
        className="relative h-24 overflow-hidden rounded-lg bg-gray-100 shadow-inner"
        ref={ref}
        // Note: we don't use onWheel prop here since we're using addEventListener instead
      >
        {/* Fixed selection indicator - positioned in center */}
        <div className="absolute top-1/2 left-0 right-0 h-8 -mt-4 pointer-events-none z-10">
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
              // Reduced translation amount and account for item height
              const translateY = wrappedPos * 16; // pixels instead of rem for more precise control

              return (
                <div
                  key={value}
                  className={`absolute py-1 px-3 font-mono text-xl font-bold cursor-pointer transition-all duration-200
                    ${isSelected ? "text-blue-600 z-10" : "text-gray-500"}`}
                  style={{
                    opacity: opacity,
                    transform: `scale(${scale}) translateY(${translateY}px)`,
                    // top: "calc(50% - 16px)", // Center in container (half of item height)
                    top: "calc(50% - 10px)", // Center in container (half of item height)
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
    <div className="bg-gray-200 rounded-xl p-6">
      {/* Date picker */}
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-gray-50 p-4 rounded-xl shadow-lg">
          <h3 className="text-lg font-semibold text-gray-700 mb-3 text-center">
            Date
          </h3>
          <div className="flex gap-2">
            <div className="w-[27.5%]">
              <p className="text-xs font-medium text-gray-500 mb-1 text-center">
                Day
              </p>
              {renderWheel(days, date, setDate, "date", dateRef)}
            </div>
            <div className="w-[27.5%]">
              <p className="text-xs font-medium text-gray-500 mb-1 text-center">
                Month
              </p>
              {renderWheel(months, month, setMonth, "month", monthRef)}
            </div>
            <div className="w-[45%]">
              <p className="text-xs font-medium text-gray-500 mb-1 text-center">
                Year
              </p>
              {renderWheel(years, year, setYear, "year", yearRef)}
            </div>
          </div>
        </div>

        {/* Time picker */}
        <div className="bg-gray-50 p-4 rounded-xl shadow-lg">
          <h3 className="text-lg font-semibold text-gray-700 mb-3 text-center">
            Time
          </h3>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <p className="text-xs font-medium text-gray-500 mb-1 text-center">
                Hour
              </p>
              {renderWheel(hours, hour, setHour, "hour", hourRef)}
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 mb-1 text-center">
                Minute
              </p>
              {renderWheel(minutes, minute, setMinute, "minute", minuteRef)}
            </div>
          </div>
        </div>
      </div>

      {/* Selected date display */}
      <div className="mt-4 p-3 bg-gray-100 rounded-lg shadow-inner text-center">
        <p className="text-md font-mono">
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
            className="w-full max-w-5xl max-h-[370px] h-full rounded-lg bg-white p-6 shadow-xl dark:bg-gray-900"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Schedule This Video
              </h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Add this video to your schedule.
              </p>
            </div>

            <div className="space-x-4 flex items-center justify-between">
              {/* <div>
                <div className="overflow-hidden rounded-md shadow-sm">
                  <iframe
                    width="100%"
                    height="180"
                    src={`https://www.youtube.com/embed/${currentVideoData?.videoId}`}
                    allowFullScreen
                    className="aspect-video w-full"
                  ></iframe>
                </div>
                <div className="mt-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {currentVideoData?.videoTitle}
                  </h3>
                </div>
              </div> */}
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Select Date & Time
                </label>

                {/* Replace standard date picker with our Neomorphic component */}
                <NeomorphicDateTimePicker
                  selectedDate={date12}
                  onChange={(newDate: any) => setDate12(newDate)}
                />
              </div>
            </div>

            {/* Buttons with Neomorphic style for Save button */}
            <div className="mt-6 flex justify-end gap-2">
              <button
                className="rounded-md border border-gray-300 bg-transparent px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
                onClick={() => setIsOpen(false)}
              >
                Cancel
              </button>

              {/* Neomorphic save button */}
              <button
                className="rounded-md px-5 py-2.5 text-sm font-medium text-white 
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
