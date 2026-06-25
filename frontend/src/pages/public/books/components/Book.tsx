import { BsThreeDotsVertical } from "react-icons/bs";
import { GoPencil } from "react-icons/go";
import { Button } from "../../../../ui/Button";
import { Menu, MenuItem } from "@szhsin/react-menu";
import "@szhsin/react-menu/dist/index.css";
import "@szhsin/react-menu/dist/transitions/zoom.css";
import { PiTrashThin } from "react-icons/pi";
import type { Book as BookType } from "../../../../api/book/book.types";
import { useBookData } from "../../../../hooks/book/use-book-data";
import { useLoanBook } from "../../../../hooks/loan/use-loan-book";

type Props = {
  book: BookType;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  isAdmin?: boolean;
  isBorrowed: boolean;
};

export default function Book({
  book,
  onEdit,
  onDelete,
  isAdmin,
  isBorrowed,
}: Props) {
  const { data: bookData, isLoading: isCopiesLoading } = useBookData(
    book.id_book.toString(),
  );

  const loanBook = useLoanBook();

  const handleBorrow = () => {
    loanBook.mutate(book.id_book.toString());
  };

  const noCopiesAvailable = (bookData?.availableCopies ?? 0) === 0;

  return (
    <div className="relative flex h-full w-full max-w-70 flex-col rounded-2xl bg-white p-4 shadow-sm">
      {isAdmin && (
        <div className="absolute top-4 right-4">
          <Menu
            menuButton={
              <button className="text-main-navy-blue cursor-pointer">
                <BsThreeDotsVertical size={14} />
              </button>
            }
            transition
            menuClassName="rounded-lg bg-white py-0.5 shadow-lg"
          >
            <MenuItem onClick={() => onEdit(book.id_book.toString())}>
              <span className="flex items-center gap-x-2 px-2 py-1 text-xs">
                <GoPencil size={12} />
                Edit
              </span>
            </MenuItem>

            <MenuItem onClick={() => onDelete(book.id_book.toString())}>
              <span className="flex items-center gap-x-2 px-2 py-1 text-xs">
                <PiTrashThin size={12} />
                Delete
              </span>
            </MenuItem>
          </Menu>
        </div>
      )}

      <img
        src={book.cover}
        alt={book.title}
        className="mx-auto h-50 w-40 rounded-lg object-cover"
      />

      <div className="mt-4 flex flex-1 flex-col gap-y-1">
        <p className="text-main-navy-blue text-xs font-semibold">
          {book.title}
        </p>

        <p className="text-main-navy-blue/60 text-xs">
          {book.authors?.length
            ? book.authors
                .map((a) => `${a.author_name} ${a.author_lastname}`)
                .join(", ")
            : "Unknown author"}
        </p>

        <p className="text-main-navy-blue/60 text-xs">Year: {book.year}</p>

        <p className="text-main-navy-blue/60 text-xs">ISBN: {book.ISBN}</p>

        <p className="text-main-navy-blue/60 text-xs">
          Publisher: {book.publisher?.publisher_name}
        </p>

        <div className="text-main-navy-blue text-xs font-medium">
          {isCopiesLoading
            ? "Available: ..."
            : `Available: ${bookData?.availableCopies ?? 0} / ${bookData?.totalCopies ?? 0}`}
        </div>
      </div>

      <div className="mt-auto flex gap-x-2">
        <Button intent="greenButton" size="small" className="flex-1 text-xs">
          Available
        </Button>

        <Button
          intent="loanButton"
          size="small"
          className="flex-1 text-xs"
          onClick={handleBorrow}
          disabled={
            loanBook.isPending ||
            isCopiesLoading ||
            noCopiesAvailable ||
            isBorrowed
          }
        >
          {loanBook.isPending
            ? "Borrowing..."
            : isBorrowed
              ? "Borrowed"
              : "Borrow"}
        </Button>
      </div>
    </div>
  );
}
