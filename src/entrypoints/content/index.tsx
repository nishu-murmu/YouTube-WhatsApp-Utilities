import "~/assets/tailwind.css";
import { AddVideo } from "./components/AddVideo";
import HoverElement from "./components/HoverIcon/HoverIcon";
import "./components/HoverIcon/hover.css";

export default defineContentScript({
  matches: ["<all_urls>"],
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

    // const dashboardUi = await createShadowRootUiWrapper({
    //   ctx,
    //   name: "dashboard-component",
    //   position: "inline",
    //   anchor: "body",
    //   component: <Dashboard />,
    // });
    // dashboardUi.mount();

    const addVideoUi = await createShadowRootUiWrapper({
      ctx,
      name: "add-video-component",
      position: "inline",
      anchor: "body",
      component: <AddVideo />,
    });
    addVideoUi.mount();
  },
});
