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
    <div className="flex gap-4 p-6 justify-center bg-gray-50 rounded-xl">
      {filtersData.map((btn) => {
        const isActive = activeFIlter === btn.id;

        return (
          <Button
            key={btn.id}
            
            intent={isActive ? 'primary' : 'lightButton'}
            size="medium"
            
            onClick={() => setActiveFilter(btn.id)}
          >
            {btn.label}
          </Button>
        );
      })}
    </div>
  );
}

export default FilterOptions;