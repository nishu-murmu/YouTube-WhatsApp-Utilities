import { Button } from "@@/components/ui/button";
import { DateTimePicker } from "@@/components/ui/Datepicker";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@@/components/ui/dialog";
import { Label } from "@@/components/ui/label";
import { useEffect, useState } from "react";

export function AddVideo() {
  const [currentVideoData, setCurrentVideoData] = useState<{
    videoId: string;
  } | null>(null);
  const [date12, setDate12] = useState<Date | undefined>(undefined);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const { data } = event;
      if (data?.videoId) {
        setCurrentVideoData(data);
      }
    };

    window.addEventListener("message", handleMessage);
    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []);

  // useEffect(() => {
  //   setTimeout(() => {
  //     document.querySelector("#schedule-video")?.click();
  //   }, 4000);
  // }, []);

  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Button id="schedule-video" className="hidden" variant="outline">
            Schedule Video
          </Button>
        </DialogTrigger>
        <DialogContent
          className="sm:max-w-[425px] w-full p-0"
          // Disable default animations
          style={{
            animation: "none",
            transform: "none",
            opacity: 1,
          }}
        >
          <DialogHeader className="p-6 pb-0">
            <DialogTitle>Schedule This Video</DialogTitle>
            <DialogDescription>
              Add this video to your schedule.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 px-6 py-4">
            <div className="space-y-2">
              <div className="rounded overflow-hidden shadow-sm border">
                <iframe
                  width={"100%"}
                  height="180"
                  src={`https://www.youtube.com/embed/9zmEDzsMkqE`}
                ></iframe>
              </div>
              {/* {currentVideoData?.videoId ? (
            ) : (
              <div className="text-sm text-muted-foreground">
                No video loaded.
              </div>
            )} */}
            </div>
            <DateTimePicker
              hourCycle={12}
              value={date12}
              onChange={setDate12}
            />
          </div>

          <DialogFooter className="px-6 pb-6">
            <Button type="submit">Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
