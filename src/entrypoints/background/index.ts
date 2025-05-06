var currentScheduleInfo: any = null;
browser.alarms.onAlarm.addListener((alarm) => {
  browser.storage.local.get("schedules").then(({ schedules }) => {
    const currentSchedule = schedules.find(
      (s: { name: string; time: Date }) => s.name === alarm.name
    );
    currentScheduleInfo = currentSchedule;
    if (Date.now() > new Date(JSON.parse(currentSchedule.time)).getTime()) {
      browser.notifications.create("notification-id-" + currentSchedule.id, {
        type: "basic",
        isClickable: true,
        title: "Reminder",
        message: `Scheduled Video: ${currentSchedule.name}`,
        iconUrl: browser.runtime.getURL("/images/youtube-image.png"),
      });
      return;
    }
    openNewTab({ url: currentSchedule.url, name: currentSchedule.name });
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
