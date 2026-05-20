import React from 'react';

export const HeroImage: React.FC = () => {
    return (
        <div className="w-[75%] md:w-full mx-auto aspect-[4/3] bg-white rounded-2xl shadow-md border border-gray-100 flex items-center justify-center p-8 order-1 md:order-2">
            <img
                src="./logo.png"
                alt="Computer Science Library Illustration"
                className="w-[75%] h-[75%] object-contain rounded-xl"
            />
        </div>
    );
};