import { defineWxtModule } from "wxt/modules";

export default defineWxtModule({
  setup(wxt) {
    wxt.hook("build:manifestGenerated", (_, manifest) => {
      manifest.content_scripts ??= [];
      manifest.content_scripts.push({
        css: ["./content-scripts/scheduler.css"],
        matches: ["https://www.youtube.com/*"],
        run_at: "document_idle",
      });
      const commands = {
        "toggle-dashboard": {
          suggested_key: {
            default: "Ctrl+I",
            mac: "Command+I",
          },
          description: "Toggle the schedule dashboard",
          global: true,
        },
      };
      manifest.commands = commands;
    });
  },
});
