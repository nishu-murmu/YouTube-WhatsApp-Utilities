import { useEffect, useState } from "react";
import type { Schedule } from '../../types';
import DashboardHeader from "./DashboardHeader";
import DashboardWithData from "./DashboardWithData";
import EditDateModal from "./EditDateModal";
import EmptyDashboard from "./EmptyDashboard";
import Pagination from "./Pagination";
import { SearchBar } from "./SearchBar";
import TableHeader from "./TableHeader";

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

    const runtimeOnMessageListener = (request, _, sendResponse) => {
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

          <div
            className="overflow-hidden rounded-2xl bg-gray-200 p-2 max-h-[450px] overflow-y-scroll"
            style={{
              boxShadow:
                "inset 12px 12px 24px #c1c5c9, inset -12px -12px 24px #ffffff",
            }}
          >
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
            setCurrentPage={setCurrentPage}
          />
        </div>
        {editingDateId && (
          <EditDateModal
            editingDate={editingDate}
            editingDateId={editingDateId}
            scheduledVideos={scheduledVideos}
            setEditingDate={setEditingDate}
            setEditingDateId={setEditingDateId}
            setScheduledVideos={setScheduledVideos}
          />
        )}
      </div>
    </div>
  );
};
