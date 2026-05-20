import ResponsivePagination from "react-responsive-pagination";
import { HiOutlineChevronLeft, HiOutlineChevronRight } from "react-icons/hi";
import { useState } from "react";

type CustonPaginationProps = {
  initalTotalNumberOfItems: number;
  itemsPerPage: number;
  onPageChange: (newPage: number) => Promise<number>;
};

export default function CustomPagination({
  initalTotalNumberOfItems, //początkowa ilość wszystkich elementów, żeby wiedzieć ile stron ma być
  itemsPerPage,
  onPageChange, // w tej funkcji asynhronicznej pobranie danych z API przy pomocy parametru newPage jako nr strony i zrobienie z nimi co potrzeba, np zapisanie w useState, funkcja powinna zwracać aktualną maksymalną liczbę elementów
}: CustonPaginationProps) {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(
    Math.ceil(initalTotalNumberOfItems / itemsPerPage),
  );

  const pageChange = async (newPage: number) => {
    setCurrentPage(newPage);
    const newTotalNumberOfItems = await onPageChange(newPage);
    setTotalPages(Math.ceil(newTotalNumberOfItems / itemsPerPage));
  };

  return (
    <div className="flex w-full max-w-[100vw] justify-center">
      <ResponsivePagination
        current={currentPage}
        total={totalPages}
        onPageChange={pageChange}
        containerClassName="flex gap-2"
        pageItemClassName=" min-w-8 transition-all duration-300 justify-center rounded-lg p-1  items-center align-center text-center"
        activeItemClassName="bg-main-blue transition-all duration-300 text-center rounded-lg border-blue-800 bg-blue-800 text-white shadow-sm"
        pageLinkClassName="w-full h-full  hover:text-blue-300 transition-all duration-300 "
        previousLabel={
          <div className="flex h-full w-full items-center justify-center text-center">
            <HiOutlineChevronLeft />
          </div>
        }
        nextLabel={
          <div className="flex h-full w-full items-center justify-center text-center">
            <HiOutlineChevronRight />
          </div>
        }
      />
    </div>
  );
}
