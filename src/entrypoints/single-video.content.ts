import { getSessionStorageItem } from "@/utils";

export default defineContentScript({
  matches: ["https://www.youtube.com/watch?*"],
  cssInjectionMode: "ui",
  async main() {
    const settingsButton = document.querySelector(
      `[class="ytp-popup ytp-settings-menu"]`
    );
    const durationElement = document.querySelector(
      `[class="ytp-time-duration"]`
    );
    const actualDuration = await fetch(location.href)
      .then((r) => r.text())
      .then((d) => {
        const str = d.slice(
          d.indexOf("lengthSeconds"),
          d.indexOf("lengthSeconds") + 40
        );
        str.split(",");
        return str.match(/[\d.]+/)?.[0];
      });

    const observer = new MutationObserver(() => {
      const playbackSpeed = getSessionStorageItem("yt-player-playback-rate");
      durationElement!.textContent = timeToSeconds(
        actualDuration!,
        playbackSpeed?.data
      );
    });
    setTimeout(() => {
      observer.observe(settingsButton!, {
        childList: true,
        subtree: true,
        characterData: true,
      });
    }, 500);
  },
});
