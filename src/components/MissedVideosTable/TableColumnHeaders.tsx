import { NeoMorphicCheckbox } from "./NeoMorphicCheckbox";

export const TableColumnHeaders = ({ selectAll, onSelectAll }) => {
  return (
    <div
      className="grid grid-cols-12 gap-4 p-3 font-semibold text-gray-700 mb-2 bg-white border border-gray-300 rounded-md"
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
