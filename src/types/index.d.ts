interface Schedule {
  id: string;
  name: string;
  time: string | Date;
  url: string;
  [key: string]: unknown;
}

interface VideoData {
  videoId: string;
  videoTitle: string;
}

interface DashboardWithDataProps {
  selectedItems: Set<string>;
  currentData: Schedule[];
  editingDateId: string | null;
  setEditingDateId: (id: string | null) => void;
  setEditingDate: (date: Date | null) => void;
  scheduledVideos: Schedule[];
  setSelectedItems: (items: Set<string>) => void;
  setSelectAll: (selectAll: boolean) => void;
  setScheduledVideos: (videos: Schedule[]) => void;
}

interface EditDateModalProps {
  setEditingDateId: (id: string | null) => void;
  setEditingDate: (date: Date | null) => void;
  editingDateId: string | null;
  setScheduledVideos: (videos: Schedule[]) => void;
  scheduledVideos: Schedule[];
  editingDate: Date | null;
}

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  setCurrentPage: (page: number) => void;
}

interface TableHeaderProps {
  selectAll: boolean;
  currentData: { id: string }[];
  setSelectAll: (selectAll: boolean) => void;
  setSelectedItems: (items: Set<string>) => void;
}

interface NeoMorphicDateTimePickerProps {
  selectedDate: Date;
  onChange: (date: Date) => void;
}
