import { getSessionStorageItem } from "@/utils";

export default defineContentScript({
  matches: ["https://www.youtube.com/watch?*"],
  cssInjectionMode: "ui",
  async main() {
    const settingsButton = document.querySelector(
      `[class="ytp-popup ytp-settings-menu"]`
    );
    const metaDataElem = document.querySelector("ytd-watch-metadata");
    const updateYouVideoDuration = async () => {
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

      const playbackSpeed = getSessionStorageItem("yt-player-playback-rate");
      if (!playbackSpeed?.data || !actualDuration) return;
      durationElement!.textContent = `${timeToSeconds(
        actualDuration!,
        1
      )} (${timeToSeconds(actualDuration!, playbackSpeed?.data)})`;
    };

    const observer = new MutationObserver(() => updateYouVideoDuration());
    const videoMetaDataObserver = new MutationObserver(() =>
      updateYouVideoDuration()
    );
    await sleep(1000);
    if (metaDataElem) {
      videoMetaDataObserver.observe(metaDataElem!, {
        childList: true,
        subtree: true,
        characterData: true,
      });
    }
    if (settingsButton) {
      observer.observe(settingsButton!, {
        childList: true,
        subtree: true,
        characterData: true,
      });
    }
  },
});
