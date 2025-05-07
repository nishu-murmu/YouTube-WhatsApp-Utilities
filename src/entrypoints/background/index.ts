var currentScheduleInfo: any = null;
browser.alarms.onAlarm.addListener((alarm) => {
  browser.storage.local.get("schedules").then(({ schedules }) => {
    const currentSchedule = schedules.find((s: any) => s.name === alarm.name);
    if (!currentSchedule) return;
    currentScheduleInfo = currentSchedule;
    const scheduledTime = new Date(currentSchedule.time).getTime();
    const currentTime = Date.now();
    const timeDifference = Math.abs(currentTime - scheduledTime) / (1000 * 60);
    const threshold = 2;
    if (timeDifference <= threshold) {
      openNewTab({ url: currentSchedule.url, name: currentSchedule.name });
    }
    browser.notifications.create("notification-id-" + currentSchedule.id, {
      type: "basic",
      isClickable: true,
      title: "Reminder",
      message: `Scheduled Video: ${currentSchedule.name}`,
      iconUrl: browser.runtime.getURL("/images/youtube-image.png"),
    });
  });
});

browser.runtime.onStartup.addListener(() => {
  checkMissedSchedules().then((missedSchedules) => {
    if (missedSchedules.length > 0) {
      console.log("Missed schedules:", missedSchedules);
    }
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
        console.log("🚀 ~ browser.runtime.onMessage.addListener ~ res:", res);
        sendResponse(res);
      });
      break;
  }
  return true;
});

browser.notifications.onClicked.addListener((notificationId) => {
  if (notificationId.startsWith("notification-id-")) {
    openNewTab({
      name: currentScheduleInfo.name,
      url: `https://www.youtube.com/watch?v=${notificationId.replace(
        "notification-id-",
        ""
      )}`,
    });
  }
});

export default defineBackground(() => {
  console.log("Hello background!", { id: browser.runtime.id });
});
