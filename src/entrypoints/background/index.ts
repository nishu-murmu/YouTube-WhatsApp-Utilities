var currentScheduleInfo: any = null;
browser.alarms.onAlarm.addListener((alarm) => {
  browser.storage.local.get("schedules").then(({ schedules }) => {
    const currentSchedule = schedules.find((s: any) => s.name === alarm.name);
    if (!currentSchedule) return;
    currentScheduleInfo = currentSchedule;
    openNewTab({ url: currentSchedule.url, name: currentSchedule.name });
    browser.notifications.create("notification-id-" + currentSchedule.id, {
      type: "basic",
      isClickable: true,
      title: "Reminder",
      message: `Scheduled Video: ${currentSchedule.name}`,
      iconUrl: browser.runtime.getURL("/images/youtube-image.png"),
    });
  });
});

browser.commands.onCommand.addListener((command) => {
  if (command === "toggle-dashboard") {
    browser.storage.local
      .get("dashboardVisible")
      .then(({ dashboardVisible }) => {
        browser.runtime
          .sendMessage({
            action: "TOGGLE_DASHBOARD",
            data: { dashboardVisible: dashboardVisible ? false : true },
          })
          .then((res) => {
            browser.storage.local.set({
              dashboardVisible: !dashboardVisible,
            });
          });
      });
  }
});

browser.runtime.onStartup.addListener(async () => {
  // checkMissedSchedules().then((missedSchedules) => {
  //   if (missedSchedules.length > 0) {
  //     console.log("Missed schedules:", missedSchedules);
  //   }
  // });
  const allAlarms = await browser.alarms.getAll();
  const now = Date.now();

  for (const alarm of allAlarms) {
    if (alarm.scheduledTime < now) {
      console.log(alarm, "chekc");
      // await browser.alarms.clear(alarm.name!);
    }
  }
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
