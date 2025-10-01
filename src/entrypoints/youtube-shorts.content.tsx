import "~/assets/tailwind.css";
import ShortsLimitWarning from "@/components/ShortsLimitWarning";

export default defineContentScript({
  matches: ["https://www.youtube.com/*"],
  cssInjectionMode: "ui",
  async main(ctx) {
    let warningUi: Awaited<
      ReturnType<typeof createShadowRootUiWrapper>
    > | null = null;

    async function showWarningUi() {
      if (!warningUi) {
        warningUi = await createShadowRootUiWrapper({
          ctx,
          name: "shorts-limit-warning",
          position: "inline",
          anchor: "body",
          component: <ShortsLimitWarning />,
        });
      }
      warningUi.mount();
    }

    function hideWarningUi() {
      if (warningUi) {
        warningUi.remove();
        warningUi = null;
      }
    }

    browser.runtime.onMessage.addListener((message) => {
      console.log(message, "message");
      switch (message.action) {
        case "LIMIT_EXCEEDED":
          showWarningUi();
          break;
        case "NO_SHORTS_URL":
          hideWarningUi();
          break;
        default:
          break;
      }
    });

    self.addEventListener("pagehide", () => {
      hideWarningUi();
    });
  },
});
