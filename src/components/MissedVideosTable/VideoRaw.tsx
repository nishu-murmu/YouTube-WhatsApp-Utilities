import { format, formatDate } from "date-fns";
import { NeoMorphicCheckbox } from "./NeoMorphicCheckbox";
import { Edit2 } from "lucide-react";

export const VideoRow = ({
  item,
  isSelected,
  onSelect,
  onEditDate,
  isEditingDate,
}) => {
  return (
    <div
      key={item.id}
      className={`grid grid-cols-12 gap-4 p-6 bg-gray-200 rounded-2xl transition-all duration-300 hover:scale-[1.01] ${
        isSelected ? "ring-2 ring-blue-300" : ""
      }`}
      style={{
        boxShadow: isSelected
          ? "8px 8px 16px #bfdbfe, -8px -8px 16px #ffffff"
          : "8px 8px 16px #c1c5c9, -8px -8px 16px #ffffff",
      }}
    >
      <div className="col-span-1 flex items-center justify-center">
        <NeoMorphicCheckbox checked={isSelected} onChange={onSelect} />
      </div>

      <div className="col-span-4">
        <div
          className="aspect-[16/9] rounded-2xl overflow-hidden bg-gray-300"
          style={{
            boxShadow:
              "inset 8px 8px 16px #c1c5c9, inset -8px -8px 16px #ffffff",
          }}
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
        <div
          className="bg-gray-200 rounded-xl p-4 w-full"
          style={{
            boxShadow: "inset 4px 4px 8px #c1c5c9, inset -4px -4px 8px #ffffff",
          }}
        >
          <span className="text-gray-800 font-medium">{item.name}</span>
        </div>
      </div>

      <div className="col-span-3 flex items-center">
        <div
          className="w-full flex items-center bg-gray-200 p-4 rounded-2xl transition-all duration-200"
          style={{
            boxShadow:
              "inset 8px 8px 16px #c1c5c9, inset -8px -8px 16px #ffffff",
          }}
        >
          <div className="text-gray-700 flex-1 text-sm">
            {format(JSON.parse(item.time), "PPP")}
            <br />
            {format(JSON.parse(item.time), "HH:mm:ss")}
          </div>
          <button
            onClick={onEditDate}
            className={`ml-3 p-3 rounded-xl transition-all duration-200 ${
              isEditingDate
                ? "bg-blue-200 text-blue-700"
                : "bg-gray-200 text-gray-600 hover:scale-105"
            }`}
            style={{
              boxShadow: isEditingDate
                ? "inset 6px 6px 12px #bfdbfe, inset -6px -6px 12px #ffffff"
                : "6px 6px 12px #c1c5c9, -6px -6px 12px #ffffff",
            }}
          >
            <Edit2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
