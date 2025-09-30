import { useEffect, useState } from "react";
import DashboardHeader from "./DashboardHeader";
import DashboardWithData from "./DashboardWithData";
import EmptyDashboard from "./EmptyDashboard";
import { SearchBar } from "./SearchBar";
import TableHeader from "./TableHeader";
import { Pagination } from "../common/Pagination";
import { DateEditModal } from "../common/DateEditModal";

export const NeoMorphicDashboard = () => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [editingDateId, setEditingDateId] = useState<string | null>(null);
  const [editingDate, setEditingDate] = useState<string | null>(null);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [selectAll, setSelectAll] = useState<boolean>(false);
  const pageSize = 5;
  const [scheduledVideos, setScheduledVideos] = useState<Schedule[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const filteredVideos = scheduledVideos.filter((video) =>
    video.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const totalPages = Math.ceil(filteredVideos.length / pageSize);
  const currentData = filteredVideos.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
    setSelectedItems(new Set());
    setSelectAll(false);
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    setCurrentPage(1);
    setSelectedItems(new Set());
    setSelectAll(false);
  };

  useEffect(() => {
    if (currentData.length === 0) {
      setSelectAll(false);
    } else {
      const allCurrentSelected = currentData.every((item: Schedule) =>
        selectedItems.has(item.id)
      );
      setSelectAll(allCurrentSelected && selectedItems.size > 0);
    }
  }, [currentData, selectedItems]);

  useEffect(() => {
    setSelectedItems(new Set());
    setSelectAll(false);
  }, [currentPage]);

  useEffect(() => {
    (async () => {
      const { schedules } = await browser.storage.local.get("schedules");
      setScheduledVideos(schedules || []);
    })();

    const runtimeOnMessageListener = (
      request: { action: string; data: { name: string } },
      _: unknown,
      sendResponse: (value: unknown) => void
    ) => {
      switch (request.action) {
        case "REMOVE_SCHEDULE":
          const { name } = request.data;
          setScheduledVideos((prev) => prev.filter((r) => r.name !== name));
          sendResponse(true);
          break;
      }
      return true;
    };
    browser.runtime.onMessage.addListener(runtimeOnMessageListener);
    return () => {
      browser.runtime.onMessage.removeListener(runtimeOnMessageListener);
    };
  }, []);

  useEffect(() => {
    (async () => {
      await browser.storage.local.set({ schedules: scheduledVideos });
    })();
  }, [scheduledVideos]);

  return (
    <div className="p-6 bg-transparent min-h-screen flex justify-center fixed top-16 left-[50%] transform -translate-x-1/2 z-[999999] font-roboto">
      <div className="w-[1200px]">
        <div className="bg-gray-200 rounded-3xl p-8 border border-gray-300 mb-8">
          <DashboardHeader
            selectedItems={selectedItems}
            setSelectAll={setSelectAll}
            setSelectedItems={setSelectedItems}
            setScheduledVideos={setScheduledVideos}
          />

          <SearchBar
            searchTerm={searchTerm}
            onSearchChange={handleSearchChange}
            onClearSearch={handleClearSearch}
            totalResults={filteredVideos.length}
          />

          <div className="overflow-hidden rounded-2xl bg-white border border-gray-300 p-2 max-h-[450px] overflow-y-scroll">
            <TableHeader
              currentData={currentData}
              selectAll={selectAll}
              setSelectAll={setSelectAll}
              setSelectedItems={setSelectedItems}
            />

            {currentData.length === 0 ? (
              <EmptyDashboard />
            ) : (
              <DashboardWithData
                currentData={currentData}
                editingDateId={editingDateId}
                selectedItems={selectedItems}
                scheduledVideos={scheduledVideos}
                setSelectAll={setSelectAll}
                setEditingDate={setEditingDate}
                setEditingDateId={setEditingDateId}
                setSelectedItems={setSelectedItems}
                setScheduledVideos={setScheduledVideos}
              />
            )}
          </div>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            rounded="2xl"
            padding="p-2.5"
            spacing="space-x-4"
          />
        </div>
        <DateEditModal
          isOpen={!!editingDateId}
          onClose={() => {
            setEditingDateId(null);
            setEditingDate(null);
          }}
          selectedDate={editingDate ? (JSON.parse(editingDate) as Date) : null}
          onChange={(date: Date) => {
            if (editingDateId) {
              setScheduledVideos(
                scheduledVideos.map((video: Schedule) =>
                  video.id === editingDateId
                    ? { ...video, time: JSON.stringify(date) }
                    : video
                )
              );
            }
          }}
          title="Edit Schedule Date/Time"
        />
      </div>
    </div>
  );
};
