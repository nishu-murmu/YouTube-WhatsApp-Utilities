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
        className={`${size} rounded-md transition-colors duration-150 flex items-center justify-center border ${
          checked
            ? "bg-blue-500 border-blue-600 text-white"
            : "bg-white border-gray-300 text-gray-600"
        }`}
      >
        {checked && (
          <svg
            className="w-3 h-3"
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
