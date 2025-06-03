import { defineConfig } from "wxt";
import tailwindcss from "@tailwindcss/vite";

// See https://wxt.dev/api/config.html
export default defineConfig({
  //@ts-ignore
  vite: () => ({
    plugins: [tailwindcss()],
  }),
  srcDir: "src",
  modules: ["@wxt-dev/module-react"],
  webExt: {
    disabled: true,
  },
  manifest: {
    permissions: ["activeTab", "tabs", "storage", "alarms", "notifications"],
    host_permissions: ["https://www.youtube.com/*"],
    icons: {
      16: "/icon/icon-16.png",
      32: "/icon/icon-32.png",
      48: "/icon/icon-48.png",
      96: "/icon/icon-96.png",
      128: "/icon/icon-128.png",
    },
    commands: {
      "toggle-dashboard": {
        suggested_key: {
          default: "Ctrl+Shift+S",
          mac: "Command+Shift+S",
        },
        description: "Toggle the schedule dashboard",
      },
    },
  },
});
