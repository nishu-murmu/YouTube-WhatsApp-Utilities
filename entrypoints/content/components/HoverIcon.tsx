import React, { useEffect } from "react";
import "./hover.css";

// Hover Element Component
const HoverElement: React.FC = () => {
  useEffect(() => {
    const addHoverIcons = () => {
      const thumbnails = document.querySelectorAll("ytd-rich-item-renderer");
      thumbnails.forEach((thumbnail, index) => {
        if (thumbnail.getAttribute("element-injected") === "true") return;
        const hoverContainer = document.createElement("div");
        hoverContainer.className = "hover-icon-container";
        hoverContainer.innerHTML = `
        <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="white"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    position: absolute;
  top="50%";
  left="50%";
  transform="translate(-50%, -50%)";
  background-color="rgba(0, 0, 0, 0.7)";
  border-radius="50%";
  padding="8px";
  z-index="10";
  >
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
        `;
        hoverContainer.id = `${index}_nishu`;
        thumbnail.appendChild(hoverContainer);
        thumbnail.setAttribute("element-injected", "true");
      });
    };

    const observer = new MutationObserver((mutations, observer) => {
      addHoverIcons();
    });
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
    });
  }, []);

  return null;
};

export default HoverElement;
