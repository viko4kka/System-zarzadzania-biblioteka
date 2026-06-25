import { useState } from 'react';
import { Button } from "../../../ui/Button";
import FilterOptions from "./components/FilterOptions";
import SearchInput from "./components/SearchInput";
import SortDropdown from "./components/SortDropdown";
import AddBookModal from "./components/AddBookModal";
import EditBookModal from "./components/EditBookModal";
import { Plus } from 'lucide-react';

function ADashboard() {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedEditBookId, setSelectedEditBookId] = useState<string | null>(null);

    return (
        <>
            <SearchInput placeholder="Search by title or author . . ." />

            <div className="flex flex-col md:flex-row items-center gap-4 mt-4 w-full">
                <FilterOptions />
                <SortDropdown />

                <Button
                    intent="primary"
                    size="medium"
                    className="flex items-center justify-center gap-2 w-full md:w-auto ml-auto"
                    onClick={() => setIsAddModalOpen(true)}
                >
                    <span>Add book</span>
                    <Plus className="h-5 w-5" />
                </Button>
            </div>

            <AddBookModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
            />

            {isEditModalOpen && selectedEditBookId && (
                <EditBookModal
                    key={selectedEditBookId}
                    bookId={selectedEditBookId}
                    isOpen={isEditModalOpen}
                    onClose={() => {
                        setIsEditModalOpen(false);
                        setSelectedEditBookId(null);
                    }}
                />
            )}
        </>
    );
}

export default ADashboard;