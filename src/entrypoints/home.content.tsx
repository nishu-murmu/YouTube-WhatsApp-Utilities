import "~/assets/tailwind.css";
import "@/components/HoverIcon/hover.css";
import type { Schedule } from '../types';
import { HoverElement } from "@/components/HoverIcon/HoverIcon";
import { NeoMorphicDashboard } from "@/components/Dashboard";
import { AddVideo } from "@/components/AddVideo";
import NeoMorphicVideoTable from "@/components/MissedVideosTable";

export default defineContentScript({
  matches: ["https://www.youtube.com/*"],
  cssInjectionMode: "ui",

  async main(ctx) {
    const ui = await createShadowRootUiWrapper({
      ctx,
      name: "hover-element",
      position: "inline",
      anchor: "body",
      component: <HoverElement />,
    });
    ui.mount();

    const dashboardUi = await createShadowRootUiWrapper({
      ctx,
      name: "dashboard-component",
      position: "inline",
      anchor: "body",
      component: <NeoMorphicDashboard />,
    });

    const missedVideosTableUi = await createShadowRootUiWrapper({
      ctx,
      name: "missed-videos-table-component",
      position: "inline",
      anchor: "body",
      component: <NeoMorphicVideoTable />,
    });

    const addVideoUi = await createShadowRootUiWrapper({
      ctx,
      name: "add-video-component",
      position: "inline",
      anchor: "body",
      component: <AddVideo />,
    });
    addVideoUi.mount();

    browser.runtime.onMessage.addListener((request) => {
      switch (request.action) {
        case "TOGGLE_DASHBOARD":
          browser.storage.local
            .get("dashboardVisible")
            .then(({ dashboardVisible }) => {
              if (dashboardVisible) {
                dashboardUi.mount();
              } else {
                dashboardUi.remove();
              }
            });
          break;
        default:
          break;
      }
    });

    self.addEventListener("message", (event) => {
      const { data } = event;
      switch (data.action) {
        case "REMOVE_MISSED_VIDEOS_TABLE":
          missedVideosTableUi.remove();
          break;
      }
    });

    browser.storage.local.get("missedSchedules").then(({ missedSchedules }: { missedSchedules: Schedule[] }) => {
      if (Array.isArray(missedSchedules) && missedSchedules?.length) {
        missedVideosTableUi.mount();
      }
    });
  },
});
