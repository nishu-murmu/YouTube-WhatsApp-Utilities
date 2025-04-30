import { defineConfig } from "wxt";

// See https://wxt.dev/api/config.html
export default defineConfig({
  modules: ["@wxt-dev/module-react"],
  webExt: {
    disabled: true,
  },
  manifest: {
    permissions: ["activeTab"],
    host_permissions: ["https://www.youtube.com/*"],
  },
});
