import React, { useEffect } from "react";
import "@/entrypoints/content/components/HoverIcon/hover.css";

// Hover Element Component
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
        hoverContainer.className = "hover-icon-container";
        hoverContainer.id = `${index}_nishu`;
        hoverContainer.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" id="hover-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle-plus-icon lucide-circle-plus">
          <circle cx="12" cy="12" r="10"/>
          <path d="M8 12h8"/>
          <path d="M12 8v8"/>
        </svg>
`;
        element.prepend(hoverContainer);
        element.setAttribute("element-injected", "true");
        const videoId = element.querySelector("a")?.href
          ? getYoutubeVideoId(element.querySelector("a")?.href || "")
          : "";

        const videoTitle = getYoutubeVideoId(
          element.querySelector("h3")?.textContent || ""
        );
        const sendMessageListener = () => {
          self.postMessage({
            type: "ADD_VIDEO",
            data: {
              videoId,
              videoTitle,
            },
          });
        };

        const thumbnail = element.querySelector("#content img") as any
        const contentElem = element.querySelector("#content") as any

        element
          .querySelector("#hover-icon")
          ?.addEventListener("click", sendMessageListener);

        element.addEventListener("mouseenter", () => {
          //@ts-ignore
          element.querySelector(".hover-icon-container").style.opacity = "1";
        })


        element.addEventListener("mouseout", (e: any) => {
          const videoElem = e?.relatedTarget
          videoElem.addEventListener("mouseenter", () => {
            if (element) {
              // Step 2: Set up a MutationObserver
              const observer = new MutationObserver((mutationsList: any) => {
                for (const mutation of mutationsList) {
                  console.log(mutation, 'check')
                  if (mutation.type === 'childList') {
                    // Check removed nodes
                    for (const node of mutation.removedNodes) {
                      if (node.nodeType === Node.ELEMENT_NODE && node?.classList?.contains(e?.relatedTarget)) {
                        console.log('video-preview-overlay was removed from DOM!');
                        // Do something here...
                      }
                    }
                  }
                }
              });

              // Step 3: Start observing the parent for child removals
              observer.observe(element, {
                childList: true, // watch for direct children being added/removed
                subtree: false   // don't go deeper than direct children
              });
            } else {
              console.log("Parent element not found");
            }

            // if (!element.contains(videoElem) || (element.contains(videoElem) && videoElem.className.contains("hover-icon-container"))) {
            //   //@ts-ignore
            //   element.querySelector(".hover-icon-container").style.opacity = "1";
            // }
          })

        });
      });
    };

    // Initial run
    addHoverIcons();

    // Observe DOM changes for new thumbnails
    const observer = new MutationObserver(() => {
      addHoverIcons();
    });
    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    // Cleanup on unmount
    return () => {
      observer.disconnect();
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
