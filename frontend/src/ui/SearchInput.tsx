import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import useDebounce from "../hooks/useDebounce";

type Props = {
  value: string;
  onChange: (value: string) => void;
};

const SearchInput = ({ value, onChange }: Props) => {
  const [localValue, setLocalValue] = useState(value);
  const debouncedValue = useDebounce(localValue, 600);

  useEffect(() => {
    onChange(debouncedValue);
  }, [debouncedValue]);

  return (
    <div className="relative w-full">
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
        <Search className="h-4 w-4 text-gray-300" />
      </div>

      <input
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        type="text"
        placeholder="Search by title or author..."
        className="w-full rounded-xl border border-gray-300 bg-white py-2.5 pr-4 pl-9 text-xs text-gray-800 transition-all outline-none placeholder:text-gray-300 focus:border-gray-400 focus:ring-gray-400"
      />
    </div>
  );
};

export default SearchInput;
