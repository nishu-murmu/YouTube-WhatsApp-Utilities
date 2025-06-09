import ReactDOM from "react-dom/client";
import type { Schedule } from '../types';

export async function createShadowRootUiWrapper({
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
}) {
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
}

export function sendRuntimeMessage({
  action,
  data,
}: {
  action: string;
  data: unknown;
}) {
  return new Promise((resolve) => {
    browser.runtime.sendMessage(
      {
        action,
        data,
      },
      (callbackData) => resolve(callbackData)
    );
  });
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
  let { schedules }: { schedules: Schedule[] } = await browser.storage.local.get("schedules");
  schedules ??= [];
  await browser.storage.local.set({
    schedules: [...schedules, { name, time: JSON.stringify(time), url, id }],
  });
  return true;
}

export async function clearSchedule({ name }: { name?: string }) {
  browser.alarms.clear(name);
  const { schedules }: { schedules: Schedule[] } = await browser.storage.local.get("schedules");
  browser.storage.local.set({
    schedules: schedules.filter(
      (s: Schedule) => s.name !== name
    ),
  });
  browser.tabs.query({}, (tabs) => {
    tabs.forEach((tab) => {
      if (tab.url?.includes("youtube.com")) {
        browser.tabs.sendMessage(tab.id!, {
          action: "REMOVE_SCHEDULE",
          data: { name: name },
        });
      }
    });
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
    return value;
  }
}

export function toggleDashboard() {
  browser.storage.local.get("dashboardVisible").then(({ dashboardVisible }) => {
    browser.storage.local
      .set({
        dashboardVisible:
          !dashboardVisible || typeof dashboardVisible === "undefined"
            ? true
            : false,
      })
      .then(() => {
        browser.tabs
          .query({ active: true, currentWindow: true })
          .then((tabs) => {
            const activeTab = tabs[0];
            if (activeTab) {
              browser.tabs.sendMessage(activeTab.id!, {
                action: "TOGGLE_DASHBOARD",
              });
            }
          });
      });
  });
}

export function getDifferenceInMinutes(now, schedule) {
  return Math.floor((now - schedule) / 1000 / 60);
}

export const removeScheduleVideo = (ids: string[]) => {
  return new Promise((resolve) => {
    browser.storage.local.get("schedules").then(({ schedules }: { schedules: Schedule[] }) => {
      browser.storage.local.set(
        {
          schedules: schedules.filter((schedule: Schedule) => !ids.includes(schedule.id)),
        },
        () => resolve(true)
      );
    });
  });
};
