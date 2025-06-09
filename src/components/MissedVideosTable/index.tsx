import { useEffect, useState } from "react";
import { TableHeader } from "./TableHeader";
import { DateEditModal } from "./DateEditModal";
import { SaveButton } from "./SaveButton";
import { Pagination } from "./Pagination";
import { VideoRow } from "./VideoRaw";
import { EmptyTable } from "./EmptyTable";
import { TableColumnHeaders } from "./TableColumnHeaders";

export default function NeoMorphicVideoTable() {
  const [currentPage, setCurrentPage] = useState(1);
  const [editingDateId, setEditingDateId] = useState<string | null>(null);
  const [editingDate, setEditingDate] = useState<Date | null>(null);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [selectAll, setSelectAll] = useState(false);
  const pageSize = 5;
  const [videoData, setVideoData] = useState<Schedule[]>([]);

  const totalPages = Math.ceil((videoData?.length || 0) / pageSize);
  const currentData =
    videoData?.slice((currentPage - 1) * pageSize, currentPage * pageSize) ||
    [];

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleDateChange = (date) => {
    if (editingDateId) {
      setVideoData(
        videoData.map((video) =>
          video.id === editingDateId
            ? { ...video, time: JSON.stringify(date) }
            : video
        )
      );
    }
  };

  const toggleDatePicker = (id) => {
    if (editingDateId === id) {
      setEditingDateId(null);
      setEditingDate(null);
    } else {
      const video = videoData.find((v) => v.id === id);
      setEditingDateId(id);
      setEditingDate(video ? JSON.parse(video.time as string) : new Date());
    }
  };

  const closeDatePicker = () => {
    setEditingDateId(null);
    setEditingDate(null);
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedItems(new Set());
    } else {
      const allCurrentIds = new Set(currentData.map((item) => item.id));
      setSelectedItems(allCurrentIds);
    }
    setSelectAll(!selectAll);
  };

  const handleSelectItem = (id) => {
    const newSelectedItems = new Set(selectedItems);
    if (newSelectedItems.has(id)) {
      newSelectedItems.delete(id);
    } else {
      newSelectedItems.add(id);
    }
    setSelectedItems(newSelectedItems);

    setSelectAll(
      newSelectedItems.size === currentData.length && currentData.length > 0
    );
  };

  const handleSave = async () => {
    const selectedData = videoData.filter((item) => selectedItems.has(item.id));
    sendRuntimeMessage({
      action: "BULK_SCHEDULE_VIDEO",
      data: {
        schedules: selectedData,
      },
    });
    removeMissedVideosTable();
  };

  const removeMissedVideosTable = async () => {
    await browser.storage.local.set({ missedSchedules: [] });
    self.postMessage({
      action: "REMOVE_MISSED_VIDEOS_TABLE",
      data: {},
    });
  };

  useEffect(() => {
    if (currentData.length === 0) {
      setSelectAll(false);
    } else {
      const allCurrentSelected = currentData.every((item) =>
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
      const { missedSchedules } = await browser.storage.local.get(
        "missedSchedules"
      );
      setVideoData(missedSchedules || []);
    })();
  }, []);

  return (
    <div className="p-6 bg-gray-100 min-h-screen flex justify-center font-sans">
      <div className="w-[1200px] z-[999999]">
        <div className="bg-gray-200 rounded-3xl p-8 border border-gray-300 mb-8">
          <TableHeader
            selectedCount={selectedItems.size}
            removeMissedVideosTable={removeMissedVideosTable}
          />

          <div
            className="overflow-hidden rounded-2xl bg-gray-200 p-2 max-h-[500px] overflow-y-auto"
            style={{
              boxShadow:
                "inset 12px 12px 24px #c1c5c9, inset -12px -12px 24px #ffffff",
            }}
          >
            <TableColumnHeaders
              selectAll={selectAll}
              onSelectAll={handleSelectAll}
            />

            {currentData.length === 0 ? (
              <EmptyTable />
            ) : (
              <div className="space-y-3">
                {currentData.map((item) => (
                  <VideoRow
                    key={item.id}
                    item={item}
                    isSelected={selectedItems.has(item.id)}
                    onSelect={() => handleSelectItem(item.id)}
                    onEditDate={() => toggleDatePicker(item.id)}
                    isEditingDate={editingDateId === item.id}
                  />
                ))}
              </div>
            )}
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />

          <SaveButton
            selectedCount={selectedItems.size}
            onSave={handleSave}
            disabled={selectedItems.size === 0}
          />
        </div>

        <DateEditModal
          isOpen={!!editingDateId}
          onClose={closeDatePicker}
          selectedDate={editingDate}
          onChange={handleDateChange}
        />
      </div>
    </div>
  );
}
