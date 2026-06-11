import { type ComponentPropsWithoutRef } from 'react';
import { Search } from 'lucide-react';

type SearchInputProps = ComponentPropsWithoutRef<'input'>;

const SearchInput = ({ placeholder = "Szukaj...", ...props }: SearchInputProps) => {
  return (
    <div className="relative w[90%] mx-auto">
      <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
        <Search className="h-5 w-5 text-gray-300" />
      </div>
      
      <input
        type="text"
        placeholder={placeholder}
        className="w-full bg-white text-gray-800 text-sm rounded-full border border-gray-300 pl-11 pr-4 py-2.5 outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-400 transition-all placeholder:text-gray-300"
        {...props}
      />
    </div>
  );
};

export default SearchInput;