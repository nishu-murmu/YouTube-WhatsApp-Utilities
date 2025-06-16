import "@/components/HoverIcon/hover.css";
import { useEffect } from "react";

export const HoverElement: React.FC = () => {
  useEffect(() => {
    let goneOutside = false;
    const observer = new MutationObserver((list: MutationRecord[]) => {
      const youtubeVideos = document.querySelectorAll("ytd-rich-item-renderer");
      if (list[0]?.target && (list[0].target as HTMLAnchorElement)?.href) {
        youtubeVideos.forEach((element) => {
          const anchor = element.querySelector("a") as HTMLAnchorElement | null;
          if (anchor?.href === (list[0].target as HTMLAnchorElement).href) {
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

    const singleVideoPageObserver = new MutationObserver(() => {
      const youtubeVideos = Array.from(
        document.querySelectorAll("ytd-compact-video-renderer")
      );
      youtubeVideos.map((element) => {
        if ((element as Element).getAttribute("element-injected") === "true")
          return;
        const hoverContainer = createSingleVideoHoverIcon();
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
      singleVideoPageObserver.observe(contents!, {
        childList: true,
        subtree: true,
        attributes: true,
      });
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
