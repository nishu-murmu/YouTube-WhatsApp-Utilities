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
    permissions: ["activeTab"],
    host_permissions: ["https://www.youtube.com/*"],
  },
});
