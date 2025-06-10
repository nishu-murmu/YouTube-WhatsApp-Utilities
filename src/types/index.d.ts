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
  setEditingDateId: React.Dispatch<React.SetStateAction<string | null>>;
  setEditingDate: React.Dispatch<React.SetStateAction<string | null>>;
  scheduledVideos: Schedule[];
  setSelectedItems: React.Dispatch<React.SetStateAction<Set<string>>>;
  setSelectAll: React.Dispatch<React.SetStateAction<boolean>>;
  setScheduledVideos: React.Dispatch<React.SetStateAction<Schedule[]>>;
}

interface EditDateModalProps {
  setEditingDateId: React.Dispatch<React.SetStateAction<string | null>>;
  setEditingDate: React.Dispatch<React.SetStateAction<string | null>>;
  editingDateId: string | null;
  setScheduledVideos: React.Dispatch<React.SetStateAction<Schedule[]>>;
  scheduledVideos: Schedule[];
  editingDate: string | Date | null;
}

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
}

interface TableHeaderProps {
  selectAll: boolean;
  currentData: Schedule[];
  setSelectAll: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedItems: React.Dispatch<React.SetStateAction<Set<string>>>;
}

interface NeoMorphicDateTimePickerProps {
  selectedDate: Date | string | null | undefined;
  onChange: (date: Date) => void;
}

interface DateEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: Date | null;
  onChange: (date: Date) => void;
}

interface VideoRowProps {
  item: Schedule;
  isSelected: boolean;
  onSelect: () => void;
  onEditDate: () => void;
  isEditingDate: boolean;
}
