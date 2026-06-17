import { useState } from 'react'; 
import { Button } from "../../../ui/Button";
import FilterOptions from "./components/FilterOptions";
import SearchInput from "./components/SearchInput";
import SortDropdown from "./components/SortDropdown";
import AddBookModal from "./components/AddBookModal"; 
import EditBookModal from "./components/EditBookModal"; 
import { Plus, Edit2 } from 'lucide-react';

// Pierwsze trzy ksiazki - tylko test (do usuniecia)
const MOCK_BOOKS = [
    { id: "1", title: "Python. Wprowadzenie" },
    { id: "2", title: "Ekonometria." },
    { id: "3", title: "Java: podstawy" }
];

function ADashboard() {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedEditBookId, setSelectedEditBookId] = useState<string | null>(null);

    const handleOpenEdit = (id: string) => {
        setSelectedEditBookId(id);
        setIsEditModalOpen(true);
    };

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
            {/* Tylko test - do usuniecia */}
            <div className="mt-8 p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
                <h3 className="text-lg font-bold text-main-navy-blue mb-4">
                    Test Dashboard (Click Edit to Test Modal)
                </h3>
                <div className="flex flex-col gap-3">
                    {MOCK_BOOKS.map((book) => (
                        <div key={book.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100 hover:bg-gray-100 transition-all">
                            <div>
                                <span className="text-xs font-mono text-gray-400 mr-2">[ID: {book.id}]</span>
                                <span className="font-semibold text-gray-800">{book.title}</span>
                            </div>
                            
                            <div>
                                <button 
                                    onClick={() => handleOpenEdit(book.id)}
                                    className="flex items-center gap-1 text-sm bg-blue-50 text-blue-600 hover:bg-blue-100 px-3 py-1.5 rounded-lg font-medium transition-colors"
                                >
                                    <Edit2 className="w-4 h-4" /> Edit
                                </button>
                            </div>
                        </div>
                    ))}
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
        </>
    );
}

export default ADashboard;