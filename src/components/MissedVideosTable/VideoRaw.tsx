import { format } from "date-fns";
import { NeoMorphicCheckbox } from "./NeoMorphicCheckbox";
import { Edit2 } from "lucide-react";

export const VideoRow = ({
  item,
  isSelected,
  onSelect,
  onEditDate,
  isEditingDate,
}: VideoRowProps) => {
  return (
    <div
      key={item.id}
      className={`grid grid-cols-12 gap-4 p-4 bg-white border border-gray-300 rounded-md transition-colors duration-150 ${
        isSelected ? "ring-2 ring-blue-300" : "hover:bg-gray-50"
      }`}
    >
      <div className="col-span-1 flex items-center justify-center">
        <NeoMorphicCheckbox checked={isSelected} onChange={onSelect} />
      </div>

      <div className="col-span-4">
        <div
          className="aspect-[16/9] rounded-md overflow-hidden bg-gray-200 border border-gray-300"
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
        <div className="bg-white border border-gray-300 rounded-md p-3 w-full">
          <span className="text-gray-800 font-medium">{item.name}</span>
        </div>
      </div>

      <div className="col-span-3 flex items-center">
        <div className="w-full flex items-center bg-white border border-gray-300 p-3 rounded-md">
          <div className="text-gray-700 flex-1 text-sm">
            {format(JSON.parse(item.time as string), "PPP")}
            <br />
            {format(JSON.parse(item.time as string), "HH:mm:ss")}
          </div>
          <button
            onClick={onEditDate}
            className={`ml-3 p-2 rounded-md transition-colors duration-150 ${
              isEditingDate
                ? "bg-blue-500 text-white"
                : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
            }`}
          >
            <Edit2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
