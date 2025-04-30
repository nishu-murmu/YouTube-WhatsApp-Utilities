import React, { useEffect } from "react";
import "./hover.css";

// Hover Element Component
const HoverElement: React.FC = () => {
  useEffect(() => {
    const addHoverIcons = () => {
      const thumbnails = document.querySelectorAll(
        "ytd-rich-item-renderer #thumbnail"
      );
      thumbnails.forEach((thumbnail, index) => {
        if (thumbnail.getAttribute("element-injected") === "true") return;
        const hoverContainer = document.createElement("div");
        hoverContainer.className = "hover-icon-container";
        hoverContainer.id = `${index}_nishu`;
        hoverContainer.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" id="hover-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle-plus-icon lucide-circle-plus"><circle cx="12" cy="12" r="10"/><path d="M8 12h8"/><path d="M12 8v8"/></svg>
        `;
        thumbnail.prepend(hoverContainer);
        thumbnail.setAttribute("element-injected", "true");
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
