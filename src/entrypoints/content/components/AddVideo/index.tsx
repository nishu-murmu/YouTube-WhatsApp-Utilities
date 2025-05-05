import { Button } from "@@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@@/components/ui/dialog";
import { Input } from "@@/components/ui/input";
import { Label } from "@@/components/ui/label";

export function AddVideo() {
  const [currentVideoData, setCurrentVideoData] = useState<{
    videoId: string;
  }>({} as any);

  useEffect(() => {
    self.addEventListener("message", (event) => {
      const { data } = event;
      console.log({ data });
      setCurrentVideoData(data);
    });
  }, []);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Edit Profile</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Schedule this video</DialogTitle>
          <DialogDescription>Add this video to your schedule</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <iframe
              width="420"
              height="315"
              src={`https://www.youtube.com/embed/${currentVideoData?.videoId}?controls=0`}
            ></iframe>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Username
            </Label>
            <Input id="username" value="@peduarte" className="col-span-3" />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit">Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
