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
