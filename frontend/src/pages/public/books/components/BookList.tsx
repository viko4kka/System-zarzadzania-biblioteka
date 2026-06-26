import Book from "./Book";
import type { Book as BookType } from "../../../../api/book/book.types";

type Props = {
  books: BookType[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  isAdmin?: boolean;
  borrowedBookIds: Set<string>;
};

export default function BookList({
  books,
  onEdit,
  onDelete,
  isAdmin,
  borrowedBookIds,
}: Props) {
  return (
    <div className="700:grid 700:grid-cols-2 700:gap-8 flex flex-col place-items-center gap-y-3 lg:grid-cols-3 lg:gap-4">
      {books.map((book) => (
        <Book
          key={book.id_book}
          book={book}
          onEdit={onEdit}
          onDelete={onDelete}
          isAdmin={isAdmin}
          isBorrowed={borrowedBookIds.has(book.id_book.toString())}
        />
      ))}
    </div>
  );
}
