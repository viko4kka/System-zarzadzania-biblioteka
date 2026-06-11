import { useState } from 'react'; 
import { Button } from "../../../ui/Button";
import FilterOptions from "./components/FilterOptions";
import SearchInput from "./components/SearchInput";
import SortDropdown from "./components/SortDropdown";
import AddBookModal from "./components/AddBookModal"; 
import { Plus } from 'lucide-react';

function ADashboard() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
            <SearchInput placeholder="Search by title or author . . ." />
            <div className="flex items-center gap-4">
                <FilterOptions />
                <SortDropdown />
                
                <Button 
                    intent="primary" 
                    size="medium" 
                    className="flex items-center gap-2"
                    onClick={() => setIsModalOpen(true)}
                >
                    <span>Add book</span>
                    <Plus className="h-5 w-5" />
                </Button>
            </div>

            <AddBookModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
            />
        </>
    );
}

export default ADashboard;