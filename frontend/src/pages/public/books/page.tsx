import { Plus } from "lucide-react";
import { useState } from "react";
import { Button } from "../../../ui/Button";

import { useRemoveBook } from "../../../hooks/book/use-remove-book";
import { useBooksList } from "../../../hooks/book/useBooksList";

import { useLoggedInUserData } from "../../../hooks/user/useLoggedInUserData";
import SearchInput from "../../../ui/SearchInput";
import AddBookModal from "../../admin/dashboard/components/AddBookModal";
import EditBookModal from "../../admin/dashboard/components/EditBookModal";
import BookList from "./components/BookList";
import { useActiveLoans } from "../../../hooks/loan/use-active-loans-data";

function Catalog() {
  const { user } = useLoggedInUserData();
  const [search, setSearch] = useState("");

  const { data, isPending } = useBooksList({
    page: 1,
    limit: 50,
    search: search.length > 0 ? search : undefined,
  });

  const { data: activeLoansData } = useActiveLoans({ page: 1, limit: 100 });

  const borrowedBookIds = new Set<string>();
  activeLoansData?.data.forEach((loan) => {
    if (!loan.return_date) {
      borrowedBookIds.add(loan.copy.book.id_book.toString());
    }
  });

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const removeBook = useRemoveBook();
  const [selectedEditBookId, setSelectedEditBookId] = useState<string | null>(
    null,
  );

  const handleEdit = (id: string) => {
    setSelectedEditBookId(id);
    setIsEditModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (!window.confirm("Are you sure you want to delete this book?")) return;
    removeBook.mutate({ id });
  };

  const books = data?.books ?? [];
  const total = books.length;

  return (
    <div className="flex h-[calc(100vh-5rem)] flex-col px-4 lg:h-[calc(100vh-7.5rem)]">
      <div className="mt-8 flex w-full justify-center lg:mt-4">
        <SearchInput value={search} onChange={setSearch} />
      </div>

      <div className="mb-2 flex w-full justify-center">
        <div className="flex w-full flex-col justify-between md:flex-row md:items-center">
          <div className="mt-2 flex w-full flex-wrap items-center justify-between">
            {user?.isAdmin && (
              <Button
                intent="primary"
                size="small"
                className="flex items-center gap-2 text-xs"
                onClick={() => setIsAddModalOpen(true)}
              >
                Add book
                <Plus className="h-5 w-5" />
              </Button>
            )}
          </div>
        </div>
      </div>

      <AddBookModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />

      <EditBookModal
        bookId={selectedEditBookId}
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedEditBookId(null);
        }}
      />

      {isPending ? (
        <div className="mt-10 text-sm text-gray-500">Loading books...</div>
      ) : (
        <>
          <div className="text-main-navy-blue mb-2 w-full text-sm">
            Found {total} books
          </div>

          <div className="w-full flex-1 overflow-y-auto">
            {books.length === 0 ? (
              <div className="mt-10 text-sm text-gray-500">No books found</div>
            ) : (
              <BookList
                books={books}
                onEdit={handleEdit}
                onDelete={handleDelete}
                isAdmin={user?.isAdmin}
                borrowedBookIds={borrowedBookIds}
              />
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default Catalog;