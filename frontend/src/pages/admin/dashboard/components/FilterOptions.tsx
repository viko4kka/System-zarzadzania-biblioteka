import { useState } from 'react';
import { Button } from '../../../../ui/Button'; 

function FilterOptions() {
  const [activeFIlter, setActiveFilter] = useState<number | null>(1);

  const filtersData = [
    { id: 1, label: 'All' },
    { id: 2, label: 'Available' },
    { id: 3, label: 'Borrowed' },
  ];

  return (
    <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto p-0 md:p-6 justify-center bg-transparent md:bg-gray-50 rounded-xl">
      {filtersData.map((btn) => {
        const isActive = activeFIlter === btn.id;

        return (
          <Button
            key={btn.id}
            intent={isActive ? 'primary' : 'lightButton'}
            size="medium"
            onClick={() => setActiveFilter(btn.id)}
            className="w-full md:w-auto text-center justify-center"
          >
            {btn.label}
          </Button>
        );
      })}
    </div>
  );
}

export default FilterOptions;