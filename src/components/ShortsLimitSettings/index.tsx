import { useEffect, useState } from "react";

export function ShortsLimitSettings({ onClose }: { onClose?: () => void }) {
  const DEFAULT_LIMIT = 10;
  const DEFAULT_WARNING = `Take a break and invest your time in something meaningful! Try reading, learning a new skill, or connecting with friends. Remember, your time is valuable—make the most of it!`;

  const [limit, setLimit] = useState<number>(DEFAULT_LIMIT);
  const [warningText, setWarningText] = useState<string>(DEFAULT_WARNING);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    browser.storage.local
      .get(["shortsLimit", "shortsWarningText"])
      .then(({ shortsLimit, shortsWarningText }) => {
        if (!isMounted) return;
        if (typeof shortsLimit === "number" && shortsLimit > 0) {
          setLimit(shortsLimit);
        }
        if (typeof shortsWarningText === "string" && shortsWarningText.trim()) {
          setWarningText(shortsWarningText);
        }
        setLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  function handleSave() {
    const sanitizedLimit =
      Number.isFinite(limit) && limit > 0 ? Math.floor(limit) : DEFAULT_LIMIT;
    const sanitizedWarning =
      typeof warningText === "string" && warningText.trim()
        ? warningText.trim()
        : DEFAULT_WARNING;
    browser.storage.local
      .set({ shortsLimit: sanitizedLimit, shortsWarningText: sanitizedWarning })
      .then(() => {
        if (onClose) onClose();
      });
  }

  return (
    <div className="fixed inset-0 z-[2147483647] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative mx-4 w-full max-w-md rounded-xl bg-white p-6 shadow-2xl">
        <h2 className="mb-4 text-xl font-semibold text-gray-900">
          Shorts Limit Settings
        </h2>
        <div className="mb-4">
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Maximum Shorts per session
          </label>
          <input
            type="number"
            min={1}
            step={1}
            value={loading ? "" : limit}
            onChange={(e) => setLimit(Number(e.target.value) || 0)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500"
            placeholder="Enter a positive number"
            disabled={loading}
          />
          <p className="mt-2 text-xs text-gray-500">
            Default is 10. Increase or decrease as you prefer.
          </p>
        </div>
        <div className="mb-4">
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Warning Text (shown when limit is reached)
          </label>
          <textarea
            value={loading ? "" : warningText}
            onChange={(e) => setWarningText(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500"
            placeholder="Enter warning message"
            rows={4}
            disabled={loading}
          />
          <p className="mt-2 text-xs text-gray-500">
            This message will be shown when the Shorts limit is reached.
          </p>
        </div>
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            className="rounded-lg px-4 py-2 text-gray-700 hover:bg-gray-100"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
            disabled={loading}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

export default ShortsLimitSettings;
