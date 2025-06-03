import ReactDOM from "react-dom/client";

export const createShadowRootUiWrapper = async ({
  ctx,
  name,
  position,
  anchor,
  component,
}: {
  ctx: any;
  name: string;
  position: "inline" | "overlay" | "modal";
  anchor: string;
  component: React.ReactNode;
}) => {
  return createShadowRootUi(ctx, {
    name,
    position,
    anchor,
    onMount: (container) => {
      const app = document.createElement("div");
      container.append(app);
      const root = ReactDOM.createRoot(app);
      root.render(component);
      return root;
    },
    onRemove: (root) => {
      root?.unmount();
    },
  });
};

export const sendRuntimeMessage = ({
  action,
  data,
}: {
  action: string;
  data: any;
}) => {
  return new Promise((resolve) => {
    browser.runtime.sendMessage(
      {
        action,
        data,
      },
      (callbackData) => resolve(callbackData)
    );
  });
};

export async function checkMissedSchedules() {
  const { schedules } = (await browser.storage.local.get("schedules")) || {
    schedules: [],
  };
  const now = Date.now();
  const missedSchedules = schedules.filter(
    (schedule: { name: string; time: string }) => {
      return new Date(JSON.parse(schedule.time)).getTime() < now;
    }
  );
  if (missedSchedules.length > 0) {
    console.log("Missed schedules:", missedSchedules);
    const remaining = schedules.filter(
      (s: any) => !missedSchedules.includes(s)
    );
    await browser.storage.local.set({ schedules: remaining });
  }
  return missedSchedules;
}

export async function createSchedule({
  name,
  time,
  url,
  id,
}: {
  name: string;
  time: Date;
  url: string;
  id: string;
}) {
  const when = time.getTime();
  await browser.alarms.create(name, { when });
  let { schedules } = await browser.storage.local.get("schedules");
  schedules ??= [];
  await browser.storage.local.set({
    schedules: [...schedules, { name, time: JSON.stringify(time), url, id }],
  });
  return true;
}

export async function clearSchedule({ name }: { name: string }) {
  browser.alarms.clear(name);
  const { schedules } = await browser.storage.local.get("schedules");
  browser.storage.local.set({
    schedules: schedules.filter(
      (s: { name: string; time: Date; id: string }) => s.name !== name
    ),
  });
}

export function openNewTab({ url, name }: { url: string; name: string }) {
  browser.tabs.create({ url, active: true });
  clearSchedule({
    name,
  });
}

export function timeToSeconds(timeStr: string, playback: number): string {
  const parts = timeStr.split(":").map(Number);
  let totalSeconds = 0;
  if (parts.length === 1) {
    totalSeconds = parts[0];
  } else if (parts.length === 2) {
    totalSeconds = parts[0] * 60 + parts[1];
  } else if (parts.length === 3) {
    totalSeconds = parts[0] * 3600 + parts[1] * 60 + parts[2];
  }
  const adjustedSeconds = totalSeconds / playback;
  return secondsToTime(adjustedSeconds);
}

function secondsToTime(totalSeconds: number): string {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = Math.floor(totalSeconds % 60);
  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, "0")}:${String(
      seconds
    ).padStart(2, "0")}`;
  } else {
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
      2,
      "0"
    )}`;
  }
}

export function getSessionStorageItem(key: string) {
  const value = sessionStorage.getItem(key);
  try {
    return value !== null ? JSON.parse(value) : undefined;
  } catch {
    return value; // Return raw string if not JSON
  }
}
