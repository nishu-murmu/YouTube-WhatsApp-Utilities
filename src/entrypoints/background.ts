var currentScheduleInfo: Schedule | null = null;
const tabsShortsMap = new Map();
let shortsLimit = 10;

// Initialize dynamic shorts limit from storage
browser.storage.local.get("shortsLimit").then(({ shortsLimit: stored }) => {
  if (typeof stored === "number" && stored > 0) {
    shortsLimit = stored;
  }
});

// React to runtime updates to the shorts limit
browser.storage.onChanged.addListener((changes, areaName) => {
  if (areaName === "local" && changes.shortsLimit) {
    const next = changes.shortsLimit.newValue;
    if (typeof next === "number" && next > 0) {
      shortsLimit = next;
    }
  }
});

browser.alarms.onAlarm.addListener((alarm) => {
  browser.storage.local.get("schedules").then(({ schedules }) => {
    const currentSchedule = schedules.find(
      (s: Schedule) => s.name === alarm.name
    );
    if (!currentSchedule) return;
    currentScheduleInfo = currentSchedule;
    const diff = getDifferenceInMinutes(
      new Date().getTime(),
      new Date(JSON.parse(currentSchedule.time)).getTime()
    );
    if (diff >= 1) {
      browser.storage.local
        .get("missedSchedules")
        .then(({ missedSchedules }) => {
          browser.storage.local.set({
            missedSchedules: [...(missedSchedules || []), currentSchedule],
          });
        });
      return;
    }
    openNewTab({ url: currentSchedule.url, name: currentSchedule.name });
    browser.notifications.create("notification-id-" + currentSchedule.id, {
      type: "basic",
      isClickable: true,
      title: "Reminder",
      message: `Scheduled Video: ${currentSchedule.name}`,
      iconUrl: browser.runtime.getURL("/icon/icon-128.png"),
    });
  });
});

browser.runtime.onStartup.addListener(() => {
  browser.storage.local.get("schedules").then(({ schedules }) => {
    browser.storage.local.set({
      schedules: schedules.filter(
        (schedule) =>
          new Date(JSON.parse(schedule.time)).getTime() > new Date().getTime()
      ),
    });
  });
});

browser.runtime.onMessage.addListener((request, _, sendResponse) => {
  switch (request.action) {
    case "SCHEDULE_VIDEO":
      const { name, time, url, id } = request.data;
      createSchedule({
        name,
        time: new Date(time),
        id,
        url,
      }).then((res) => {
        sendResponse(res);
      });
      break;
    case "TOGGLE_DASHBOARD":
      toggleDashboard();
      break;

    case "BULK_SCHEDULE_VIDEO":
      const { schedules }: { schedules: Schedule[] } = request.data;
      const promises = schedules.map(({ name, time, url, id }) => {
        return createSchedule({
          name,
          time: new Date(JSON.parse(time as string)),
          id,
          url,
        });
      });
      Promise.all(promises).then(() => {
        sendResponse(true);
      });
      break;
  }
  return true;
});

browser.notifications.onClicked.addListener((notificationId) => {
  if (notificationId.startsWith("notification-id-")) {
    openNewTab({
      name: (currentScheduleInfo as Schedule).name,
      url: `https://www.youtube.com/watch?v=${notificationId.replace(
        "notification-id-",
        ""
      )}`,
    });
  }
});

export default defineBackground(() => {
  browser.commands.onCommand.addListener((command) => {
    switch (command) {
      case "toggle-dashboard":
        toggleDashboard();
        break;
      default:
        break;
    }
  });
});

function addShortToTabId(shortId: string, tabId: number) {
  if (!shortId) {
    console.log("There is no shorts url");
    return;
  }
  if (tabsShortsMap.has(tabId)) {
    const existingArr = tabsShortsMap.get(tabId) as Array<string>;
    if (existingArr.includes(shortId)) return;
    const updatedArr = [...existingArr, shortId];
    if (updatedArr.length === shortsLimit) {
      browser.tabs.update({ muted: true });
      browser.tabs.sendMessage(tabId, {
        action: "LIMIT_EXCEEDED",
      });
      return;
    }
    tabsShortsMap.set(tabId, updatedArr);
  }
}

function deleteTabId(tabId: number) {
  if (tabsShortsMap.has(tabId)) {
    tabsShortsMap.delete(tabId);
  }
}

function addTabId(tabId: number) {
  if (!tabsShortsMap.has(tabId)) {
    tabsShortsMap.set(tabId, []);
  }
}

function retrieveShortId(youtubeUrl: string) {
  const pathname = new URL(youtubeUrl).pathname;
  if (!pathname.includes("shorts")) {
    return "";
  }
  return pathname.split("/").at(-1);
}

browser.tabs.onUpdated.addListener((tabId, tabInfo, tab) => {
  if (tabInfo.url) {
    if (!tabsShortsMap.has(tabId)) {
      addTabId(tabId);
    } else {
      addShortToTabId(retrieveShortId(tabInfo.url)!, tabId);
    }
  }
});

browser.tabs.onRemoved.addListener((tabId) => {
  if (tabsShortsMap.has(tabId)) {
    deleteTabId(tabId);
  }
});
