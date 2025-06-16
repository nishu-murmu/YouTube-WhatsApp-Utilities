import { defineWxtModule } from "wxt/modules";

export default defineWxtModule({
  setup(wxt) {
    wxt.hook("build:manifestGenerated", (_, manifest) => {
      manifest.content_scripts ??= [];
      manifest.content_scripts.push({
        css: ["./content-scripts/scheduler.css"],
        matches: ["https://www.youtube.com/*"],
      });
    });
  },
});
