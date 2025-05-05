import { Card, CardContent } from "@@/components/ui/card";
import { DateTimePicker } from "@@/components/ui/Datepicker";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@@/components/ui/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@@/components/ui/table";
import { format } from "date-fns";
import { useState } from "react";

const Dashboard = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [date12, setDate12] = useState<Date | undefined>(undefined);
  const pageSize = 5;

  const mockData = [
    {
      id: 1,
      videoId: "abc123",
      title: "Introduction to ShadCN UI",
      scheduleDate: "2023-09-25T10:00:00Z",
    },
    // ...rest of mockData
  ];

  const totalPages = Math.ceil(mockData.length / pageSize);
  const currentData = mockData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="p-4 space-y-4">
      <Card className="shadow-lg rounded-xl">
        <CardContent className="pt-6">
          <Table className="shadow-md rounded-lg overflow-hidden">
            <TableHeader>
              <TableRow>
                <TableHead>Video</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Schedule Date/Time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentData.map((item) => (
                <TableRow
                  key={item.id}
                  className="hover:bg-accent transition-colors"
                >
                  <TableCell>
                    <div className="aspect-[16/9] max-w-xs rounded-md overflow-hidden shadow-sm">
                      <iframe
                        className="w-full h-full"
                        src={`https://www.youtube.com/embed/${item.videoId}`}
                        title={item.title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  </TableCell>
                  <TableCell>{item.title}</TableCell>
                  <TableCell>
                    {format(new Date(item.scheduleDate), "PPP HH:mm:ss")}
                    <DateTimePicker
                      hourCycle={12}
                      value={date12}
                      onChange={setDate12}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <Pagination className="mt-6">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  size={"icon"}
                  href="#"
                  onClick={() => handlePageChange(currentPage - 1)}
                  className={
                    currentPage === 1 ? "pointer-events-none opacity-50" : ""
                  }
                />
              </PaginationItem>

              {Array.from({ length: totalPages }, (_, i) => (
                <PaginationItem key={i + 1}>
                  <PaginationLink
                    size={"icon"}
                    href="#"
                    onClick={() => handlePageChange(i + 1)}
                    isActive={currentPage === i + 1}
                  >
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}

              <PaginationItem>
                <PaginationNext
                  size={"icon"}
                  href="#"
                  onClick={() => handlePageChange(currentPage + 1)}
                  className={
                    currentPage === totalPages
                      ? "pointer-events-none opacity-50"
                      : ""
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
