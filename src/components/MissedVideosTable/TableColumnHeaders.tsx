import { NeoMorphicCheckbox } from "./NeoMorphicCheckbox";

export const TableColumnHeaders = ({ selectAll, onSelectAll }) => {
  return (
    <div
      className="grid grid-cols-12 gap-4 p-4 font-semibold text-gray-700 mb-2 bg-gray-200 rounded-xl"
      style={{
        boxShadow: "6px 6px 12px #c1c5c9, -6px -6px 12px #ffffff",
      }}
    >
      <div className="col-span-1 flex items-center justify-center">
        <NeoMorphicCheckbox checked={selectAll} onChange={onSelectAll} />
      </div>
      <div className="col-span-4">Video</div>
      <div className="col-span-4">Title</div>
      <div className="col-span-3">Time</div>
    </div>
  );
};
