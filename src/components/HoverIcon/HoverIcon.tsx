import "@/components/HoverIcon/hover.css";
import { useEffect } from "react";

export const HoverElement: React.FC = () => {
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
        if ((element as Element).getAttribute("element-injected") === "true")
          return;
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
        (element as Element).setAttribute("element-injected", "true");
        const videoId = (element.querySelector("a") as HTMLAnchorElement)?.href
          ? getYoutubeVideoId(
              (element.querySelector("a") as HTMLAnchorElement)?.href || ""
            )
          : "";

        const videoTitle =
          (element.querySelector("h3") as HTMLElement)?.innerText || "";
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

        (element.querySelector("#hover-icon") as HTMLElement)?.addEventListener(
          "click",
          hoverIconClickHandler
        );
      });
    };
    let goneOutside = false;
    const observer = new MutationObserver((list: MutationRecord[]) => {
      const youtubeVideos = document.querySelectorAll("ytd-rich-item-renderer");
      if (
        list[0]?.target &&
        (list[0].target as HTMLElement).hasAttribute("href")
      ) {
        youtubeVideos.forEach((element) => {
          const anchor = element.querySelector("a") as HTMLAnchorElement | null;
          if (
            anchor?.href ===
            (list[0].target as HTMLAnchorElement).getAttribute("href")
          ) {
            goneOutside = true;
            const hoverIcon = element.querySelector(
              ".hover-icon-container"
            ) as HTMLElement | null;
            if (hoverIcon) {
              hoverIcon.style.opacity = "1";
            }
            return;
          }
          goneOutside = false;
          const hoverIcon = element.querySelector(
            ".hover-icon-container"
          ) as HTMLElement | null;
          if (hoverIcon) {
            hoverIcon.style.opacity = "0";
          }
        });
      }
    });
    setTimeout(() => {
      addHoverIcons();
      const newObserver = new MutationObserver(() => {
        const mediaContainer = document.querySelector(`#media-container-link`);
        if (mediaContainer) {
          observer.observe(mediaContainer, {
            attributes: true,
          });
        }
      });
      const videoPreview = document.querySelector(`#video-preview`);
      if (videoPreview) {
        newObserver.observe(videoPreview, {
          attributes: true,
          childList: true,
          subtree: true,
        });
      }
    }, 3000);

    const listObserver = new MutationObserver(() => {
      addHoverIcons();
    });
    setTimeout(() => {
      const contents = document.querySelector(`#contents`);
      if (contents) {
        listObserver.observe(contents, {
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
          (thumbnail as Element).removeAttribute("element-injected");
        });
    };
  }, []);

  return null;
};
