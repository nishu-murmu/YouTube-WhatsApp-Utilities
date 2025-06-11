import ReactDOM from "react-dom/client";

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

export function sendRuntimeMessage<T = unknown>({
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

export async function createSchedule({ name, time, url, id }: Schedule) {
  const when = (time as Date).getTime();
  await browser.alarms.create(name, { when });
  let { schedules }: { schedules: Schedule[] } =
    await browser.storage.local.get("schedules");
  schedules ??= [];
  await browser.storage.local.set({
    schedules: [...schedules, { name, time: JSON.stringify(time), url, id }],
  });
  return true;
}

export async function clearSchedule({ name }: { name?: string }) {
  browser.alarms.clear(name);
  const { schedules }: { schedules: Schedule[] } =
    await browser.storage.local.get("schedules");
  browser.storage.local.set({
    schedules: schedules.filter((s: Schedule) => s.name !== name),
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

export function getDifferenceInMinutes(now: number, schedule: number) {
  return Math.floor((now - schedule) / 1000 / 60);
}

export const removeScheduleVideo = (ids: string[]) => {
  return new Promise((resolve) => {
    browser.storage.local.get("schedules").then(({ schedules }) => {
      browser.storage.local.set(
        {
          schedules: schedules.filter(
            (schedule: Schedule) => !ids.includes(schedule.id)
          ),
        },
        () => resolve(true)
      );
    });
  });
};

function isValidURL(str: string) {
  try {
    new URL(str);
    return true;
  } catch (e) {
    return false;
  }
}

function getYoutubeVideoId(url: string) {
  if (!isValidURL(url)) return "";
  return new URL(url).searchParams.get("v");
}

export const addHoverIcons = () => {
  const youtubeVideos = document.querySelectorAll("ytd-rich-item-renderer");
  youtubeVideos.forEach((element, index) => {
    if ((element as Element).getAttribute("element-injected") === "true")
      return;
    const hoverContainer = document.createElement("div");
    hoverContainer.className = "hover-icon-container neomorphic-icon";
    hoverContainer.id = `${index}`;
    hoverContainer.innerHTML = `
    <div class="neomorphic-icon-bg">
      <svg xmlns="http://www.w3.org/2000/svg" id="hover-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle-plus">
        <circle cx="12" cy="12" r="10"/>
        <path d="M8 12h8"/>
        <path d="M12 8v8"/>
      </svg>
    </div>
  `;

    element.prepend(hoverContainer);
    (element as Element).setAttribute("element-injected", "true");
    const videoId = (element.querySelector("a") as HTMLAnchorElement)?.href
      ? getYoutubeVideoId(
          (element.querySelector("a") as HTMLAnchorElement)?.href || ""
        )
      : "";

    const videoTitle =
      (element.querySelector("h3") as HTMLElement)?.innerText || "";
    const hoverIconClickHandler = () => {
      self.postMessage(
        {
          type: "ADD_VIDEO",
          data: {
            videoId,
            videoTitle,
          },
        },
        "*"
      );
    };

    (element.querySelector("#hover-icon") as HTMLElement)?.addEventListener(
      "click",
      hoverIconClickHandler
    );
  });
};
