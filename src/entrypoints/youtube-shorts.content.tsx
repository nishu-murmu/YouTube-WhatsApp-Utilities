import "~/assets/tailwind.css";
import ShortsLimitWarning from "@/components/ShortsLimitWarning";
import { initExtensionFonts } from "@/utils";

export default defineContentScript({
  matches: ["https://www.youtube.com/shorts/*"],
  cssInjectionMode: "ui",
  async main(ctx) {
    initExtensionFonts();
    let warningUi: Awaited<
      ReturnType<typeof createShadowRootUiWrapper>
    > | null = null;

    async function ensureWarningUi() {
      if (!warningUi) {
        warningUi = await createShadowRootUiWrapper({
          ctx,
          name: "shorts-limit-warning",
          position: "inline",
          anchor: "body",
          component: <ShortsLimitWarning />,
        });
      }
      return warningUi;
    }

    browser.runtime.onMessage.addListener((message) => {
      console.log(message, "check response");
      if (message.action === "LIMIT_EXCEEDED") {
        ensureWarningUi().then((ui) => ui.mount());
      }
    });

    self.addEventListener("pagehide", () => {
      warningUi?.remove();
      warningUi = null;
    });
  },
});
