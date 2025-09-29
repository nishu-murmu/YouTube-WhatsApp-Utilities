export default defineContentScript({
  matches: ["https://web.whatsapp.com/*"],
  cssInjectionMode: "ui",
  async main() {
    const observer = new MutationObserver(observerCallback);
    function observerCallback() {
      if (Array.from(document.querySelectorAll("#app header")).length) {
        const leftSidebarList = getList(document.querySelector("#app header")!);
        const elem = leftSidebarList.at(0);
        elem.addEventListener("click", async () => {
          const { whatsAppSidebarVisible } = await browser.storage.local.get([
            "whatsAppSidebarVisible",
          ]);
          const isHidden = Boolean(whatsAppSidebarVisible);

          if (!isHidden) {
            Array.from(document.querySelectorAll("#app header"))
              .at(1)
              ?.parentElement?.setAttribute("style", "display:none;");
            await browser.storage.local.set({ whatsAppSidebarVisible: true });
          } else {
            Array.from(document.querySelectorAll("#app header"))
              .at(1)
              ?.parentElement?.removeAttribute("style");
            await browser.storage.local.set({
              whatsAppSidebarVisible: false,
            });
          }
        });
        observer.disconnect();
      }
    }
    setTimeout(() => {
      observer.observe(document.querySelector("#app")!, {
        childList: true,
        subtree: true,
      });
    }, 2000);
  },
});
