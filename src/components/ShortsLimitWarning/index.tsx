import { useEffect, useState } from "react";

const DEFAULT_WARNING = `Take a break and invest your time in something meaningful! Try reading, learning a new skill, or connecting with friends. Remember, your time is valuable—make the most of it!`;

export function ShortsLimitWarning() {
  const [warningText, setWarningText] = useState<string>(DEFAULT_WARNING);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    browser.storage.local
      .get("shortsWarningText")
      .then(({ shortsWarningText }) => {
        if (!isMounted) return;
        if (typeof shortsWarningText === "string" && shortsWarningText.trim()) {
          setWarningText(shortsWarningText.trim());
        }
        setLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[2147483647] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60" />
      <div className="relative mx-4 w-full max-w-md rounded-xl bg-white p-6 text-center shadow-2xl">
        <h2 className="mb-2 text-2xl font-semibold text-gray-900">
          Shorts limit reached
        </h2>
        <p className="text-gray-700 mb-2">
          You have reached the maximum number of Shorts allowed for this
          session.
        </p>
        <p className="text-gray-600">
          {loading ? DEFAULT_WARNING : warningText}
        </p>
      </div>
    </div>
  );
}

export default ShortsLimitWarning;
