var currentScheduleInfo: any = null;
browser.alarms.onAlarm.addListener((alarm) => {
  browser.storage.local.get("schedules").then(({ schedules }) => {
    const currentSchedule = schedules.find((s: any) => s.name === alarm.name);
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
      iconUrl: browser.runtime.getURL("/images/youtube-image.png"),
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
      const { schedules } = request.data;
      const promises = schedules.map(({ name, time, url, id }) => {
        return createSchedule({
          name,
          time: new Date(JSON.parse(time)),
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
      name: currentScheduleInfo.name,
      url: `https://www.youtube.com/watch?v=${notificationId.replace(
        "notification-id-",
        ""
      )}`,
    });
  }
});

export default defineBackground(() => {
  browser.commands.onCommand.addListener((command) => {
    if (command === "toggle-dashboard") {
      toggleDashboard();
    }
  });
});
