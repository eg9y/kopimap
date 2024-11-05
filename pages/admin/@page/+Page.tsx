import React from "react";
import { useAdminCafes } from "@/hooks/use-admin-cafes";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/catalyst/table";
import {
  Pagination,
  PaginationList,
  PaginationPage,
  PaginationPrevious,
  PaginationNext,
  PaginationGap,
} from "@/components/catalyst/pagination";
import { usePageContext } from "vike-react/usePageContext";

function AdminPage() {
  const pageContext = usePageContext();
  const currentPage = parseInt(pageContext.routeParams.page || "1", 10);
  const pageSize = 20;

  const { data, isLoading, error } = useAdminCafes(currentPage, pageSize);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const totalPages = data?.totalPages || 1;

  const getPageUrl = (page: number) => `/admin/${page}`;

  const renderPaginationPages = () => {
    const pages = [];
    const maxVisiblePages = 5;
    const halfVisible = Math.floor(maxVisiblePages / 2);

    let startPage = Math.max(currentPage - halfVisible, 1);
    let endPage = Math.min(startPage + maxVisiblePages - 1, totalPages);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(endPage - maxVisiblePages + 1, 1);
    }

    if (startPage > 1) {
      pages.push(
        <PaginationPage key={1} href={getPageUrl(1)}>
          1
        </PaginationPage>
      );
      if (startPage > 2) pages.push(<PaginationGap key="start-gap" />);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <PaginationPage
          key={i}
          href={getPageUrl(i)}
          current={currentPage === i}
        >
          {i}
        </PaginationPage>
      );
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) pages.push(<PaginationGap key="end-gap" />);
      pages.push(
        <PaginationPage key={totalPages} href={getPageUrl(totalPages)}>
          {totalPages}
        </PaginationPage>
      );
    }

    return pages;
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Admin Cafes</h1>
      <Table>
        <TableHead>
          <TableRow>
            <TableHeader>ID</TableHeader>
            <TableHeader>Name</TableHeader>
            <TableHeader>GMaps Images</TableHeader>
            <TableHeader>Images</TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          {data?.cafes.map((cafe) => (
            <TableRow key={cafe.id}>
              <TableCell className="font-medium">{cafe.id}</TableCell>
              <TableCell>{cafe.name}</TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-2 max-w-[300px]">
                  {(cafe.hosted_gmaps_images as string[])?.map((url, index) => (
                    <img
                      key={index}
                      src={url}
                      alt={`${cafe.name} image ${index + 1}`}
                      className="h-20 object-contain rounded"
                    />
                  ))}
                </div>
              </TableCell>
              <TableCell>
                <div className="grid grid-cols-3 gap-2 max-w-[300px]">
                  {cafe.all_image_urls?.map((image, index) => (
                    <img
                      key={index}
                      src={image.url}
                      alt={`${cafe.name} image ${index + 1}`}
                      className="w-full h-20 object-cover rounded"
                    />
                  ))}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="mt-4">
        <Pagination aria-label="Cafe pagination">
          <PaginationPrevious
            href={currentPage > 1 ? getPageUrl(currentPage - 1) : undefined}
          />
          <PaginationList>{renderPaginationPages()}</PaginationList>
          <PaginationNext
            href={
              currentPage < totalPages ? getPageUrl(currentPage + 1) : undefined
            }
          />
        </Pagination>
      </div>
    </div>
  );
}

export default AdminPage;
