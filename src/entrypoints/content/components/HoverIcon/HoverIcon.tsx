import "@/entrypoints/content/components/HoverIcon/hover.css";
const HoverElement: React.FC = () => {
  function isValidURL(str: string) {
    try {
      new URL(str);
      return true;
    } catch (e) {
      return false;
    }
  }
  function getYoutubeVideoId(url: string) {
    if (!isValidURL(url)) return "";
    return new URL(url).searchParams.get("v");
  }
  useEffect(() => {
    const addHoverIcons = () => {
      const youtubeVideos = document.querySelectorAll("ytd-rich-item-renderer");
      youtubeVideos.forEach((element, index) => {
        if (element.getAttribute("element-injected") === "true") return;
        const hoverContainer = document.createElement("div");
        hoverContainer.className = "hover-icon-container neomorphic-icon";
        hoverContainer.id = `${index}`;
        hoverContainer.innerHTML = `
    <div class="neomorphic-icon-bg">
      <svg xmlns="http://www.w3.org/2000/svg" id="hover-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle-plus">
        <circle cx="12" cy="12" r="10"/>
        <path d="M8 12h8"/>
        <path d="M12 8v8"/>
      </svg>
    </div>
  `;

        element.prepend(hoverContainer);
        element.setAttribute("element-injected", "true");
        const videoId = element.querySelector("a")?.href
          ? getYoutubeVideoId(element.querySelector("a")?.href || "")
          : "";

        const videoTitle = element.querySelector("h3")?.innerText || "";
        const hoverIconClickHandler = () => {
          self.postMessage(
            {
              type: "ADD_VIDEO",
              data: {
                videoId,
                videoTitle,
              },
            },
            "*"
          );
        };

        element
          .querySelector("#hover-icon")
          ?.addEventListener("click", hoverIconClickHandler);
      });
    };
    var goneOutside = false;
    const observer = new MutationObserver((list: any) => {
      const youtubeVideos = document.querySelectorAll("ytd-rich-item-renderer");
      if (list[0].target?.href) {
        youtubeVideos.forEach((element: any) => {
          if (element.querySelector("a")?.href === list[0].target?.href) {
            goneOutside = true;
            element.querySelector(".hover-icon-container").style.opacity = "1";
            return;
          }
          goneOutside = false;
          element.querySelector(".hover-icon-container").style.opacity = "0";
        });
      }
    });
    setTimeout(() => {
      addHoverIcons();
      const newObserver = new MutationObserver(() => {
        observer.observe(document.querySelector(`#media-container-link`)!, {
          attributes: true,
        });
      });
      newObserver.observe(document.querySelector(`#video-preview`)!, {
        attributes: true,
        childList: true,
        subtree: true,
      });
    }, 3000);

    const listObserver = new MutationObserver(() => {
      addHoverIcons();
    });
    setTimeout(() => {
      if (document.querySelector(`#contents`)) {
        listObserver.observe(document.querySelector(`#contents`)!, {
          childList: true,
        });
      }
    }, 5000);
    return () => {
      observer.disconnect();
      listObserver.disconnect();
      document
        .querySelectorAll(".hover-icon-container")
        .forEach((container) => container.remove());
      document
        .querySelectorAll("ytd-rich-item-renderer")
        .forEach((thumbnail) => {
          thumbnail.removeAttribute("element-injected");
        });
    };
  }, []);

  return null;
};

export default HoverElement;
