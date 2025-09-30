export default defineContentScript({
  matches: ["https://web.whatsapp.com/*"],
  cssInjectionMode: "ui",
  async main() {
    try {
      const fontUrl = (self as any).chrome?.runtime?.getURL
        ? (self as any).chrome.runtime.getURL("fonts/HackNerdFont.ttf")
        : (self as any).browser?.runtime?.getURL
        ? (self as any).browser.runtime.getURL("fonts/HackNerdFont.ttf")
        : "/fonts/HackNerdFont.ttf";
      const styleId = "__ext_font_injector__";
      if (!document.getElementById(styleId)) {
        const style = document.createElement("style");
        style.id = styleId;
        style.textContent = `@font-face { font-family: "HackNerdFont"; src: url("${fontUrl}") format("truetype"); font-weight: 400; font-style: normal; font-display: swap; }`;
        document.head.appendChild(style);
      }
    } catch {}
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
