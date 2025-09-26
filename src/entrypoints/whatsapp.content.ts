//@ts-ignore
export default defineContentScript({
  matches: ["https://web.whatsapp.com/*"],
  cssInjectionMode: "ui",
  async main() {
    const observer = new MutationObserver(observerCallback);
    function observerCallback() {
      if (Array.from(document.querySelectorAll("#app header")).length) {
        function getList(element: HTMLElement) {
          if (Array.from(element.childNodes).length >= 4) {
            return Array.from(element.childNodes);
          }
          return getList(element.querySelector("div")!);
        }
        const leftSidebarList = getList(document.querySelector("#app header")!);
        leftSidebarList.map((elem) => {
          elem.addEventListener("click", () => {
            if (!JSON.parse(localStorage.getItem("isHidden") || "false")) {
              Array.from(document.querySelectorAll("#app header"))
                .at(1)
                ?.parentElement?.setAttribute("style", "display:none;");
              localStorage.setItem("isHidden", "true");
            } else {
              Array.from(document.querySelectorAll("#app header"))
                .at(1)
                ?.parentElement?.removeAttribute("style");
              localStorage.setItem("isHidden", "false");
            }
          });
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
