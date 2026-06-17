import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

function SortDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedSort, setSelectedSort] = useState('Sort');

  const handleSortAZ = () => { console.log("Sortowanie: A-Z"); };
  const handleSortZA = () => { console.log("Sortowanie: Z-A"); };
  const handleResetSort = () => { console.log("Resetowanie sortowania"); };

  const handleOptionClick = (label: string, sortFunction: () => void, isDefault = false) => {
    if (isDefault) { setSelectedSort('Sort'); } else { setSelectedSort(`Sort: ${label}`); }
    sortFunction();
    setIsOpen(false);
  };

  return (
    <div className="relative block md:inline-block text-left w-full md:w-auto">
      
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative flex items-center justify-center md:justify-start gap-2 bg-white text-main-navy-blue font-medium text-base py-2 px-6 rounded-xl shadow-xl hover:bg-zinc-50 cursor-pointer transition-all duration-300 outline-none border-none w-full md:w-auto min-h-[40px]"
      >
        <span>{selectedSort}</span>
        
        <ChevronDown 
          className={`absolute right-6 top-1/2 -translate-y-1/2 md:static md:translate-y-0 h-4 w-4 text-main-navy-blue transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`} 
        />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />

          <div className="absolute left-0 md:left-auto md:right-0 mt-2 w-full md:w-44 rounded-xl bg-white shadow-xl border border-gray-100 z-20 overflow-hidden">
            <div className="py-1">
              <button
                onClick={() => handleOptionClick('Default', handleResetSort, true)}
                className="w-full text-left px-4 py-2.5 text-sm text-gray-500 italic hover:bg-main-light-blue hover:text-main-navy-blue transition-colors duration-150 border-b border-gray-100"
              >
                Default
              </button>
              
              <button
                onClick={() => handleOptionClick('A-Z', handleSortAZ)}
                className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-main-light-blue hover:text-main-navy-blue transition-colors duration-150"
              >
                A-Z
              </button>
              
              <button
                onClick={() => handleOptionClick('Z-A', handleSortZA)}
                className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-main-light-blue hover:text-main-navy-blue transition-colors duration-150"
              >
                Z-A
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default SortDropdown;