export const NeoMorphicCheckbox = ({
  checked,
  onChange,
  size = "w-12 h-12",
}) => {
  return (
    <label className="flex items-center cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="sr-only"
      />
      <div
        className={`${size} rounded-lg transition-all duration-200 flex items-center justify-center ${
          checked ? "bg-blue-200" : "bg-gray-200"
        }`}
        style={{
          boxShadow: checked
            ? "inset 4px 4px 8px #bfdbfe, inset -4px -4px 8px #ffffff"
            : "4px 4px 8px #c1c5c9, -4px -4px 8px #ffffff",
        }}
      >
        {checked && (
          <svg
            className="w-3 h-3 text-blue-700"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        )}
      </div>
    </label>
  );
};
