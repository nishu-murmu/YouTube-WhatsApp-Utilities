import { Card, CardContent } from "@/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState } from "react";

const Dashboard = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  const mockData = [
    {
      id: 1,
      videoId: "abc123",
      title: "Introduction to ShadCN UI",
      scheduleDate: "2023-09-25T10:00:00Z",
    },
    {
      id: 2,
      videoId: "def456",
      title: "Building Beautiful UIs with Tailwind",
      scheduleDate: "2023-09-26T11:00:00Z",
    },
    {
      id: 3,
      videoId: "ghi789",
      title: "Advanced React Patterns",
      scheduleDate: "2023-09-27T12:00:00Z",
    },
    {
      id: 4,
      videoId: "jkl012",
      title: "State Management in React",
      scheduleDate: "2023-09-28T13:00:00Z",
    },
    {
      id: 5,
      videoId: "mno345",
      title: "TypeScript in Practice",
      scheduleDate: "2023-09-29T14:00:00Z",
    },
    {
      id: 6,
      videoId: "pqr678",
      title: "Performance Optimization in React",
      scheduleDate: "2023-09-30T15:00:00Z",
    },
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
      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Video</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Schedule Date/Time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentData.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <div className="aspect-video">
                      <iframe
                        className="w-full h-full rounded-md"
                        src={`https://www.youtube.com/embed/${item.videoId}`}
                        title={item.title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  </TableCell>
                  <TableCell>{item.title}</TableCell>
                  <TableCell>
                    {new Date(item.scheduleDate).toLocaleString()}
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
