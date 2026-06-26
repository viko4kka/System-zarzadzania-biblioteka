import React from 'react';
import { Button } from "../../../ui/Button";

interface HeroTextProps {
    navigate: (path: string) => void;
    handleScrollToSection: (sectionId: string) => void;
}

export const HeroText: React.FC<HeroTextProps> = ({ navigate, handleScrollToSection }) => {
    return (
        <div className="flex flex-col gap-6 order-2 md:order-1 text-center md:text-left items-center md:items-start">
            <style>{`
                @keyframes fadeInLeft {
                    from {
                        opacity: 0;
                        transform: translateX(-30px); /* Startuje 30px od lewej */
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0); /* Wraca na swoją pozycję */
                    }
                }
                .animate-fade-in-left {
                    animation: fadeInLeft 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                    opacity: 0; /* Stan początkowy */
                }
            `}</style>

            <div
                className="w-fit px-4 py-1.5 rounded-full text-sm font-semibold text-gray-800 tracking-wide animate-fade-in-left"
                style={{ backgroundColor: 'rgb(240, 248, 197)', animationDelay: '100ms' }}
            >
                New learning platform
            </div>

            <h1 className="text-3xl md:text-4xl font-extrabold text-main-navy-blue leading-tight flex flex-col">
                <span className="animate-fade-in-left" style={{ animationDelay: '250ms' }}>
                    Welcome to
                </span>
                <span className="text-main-blue animate-fade-in-left" style={{ animationDelay: '400ms' }}>
                    Computer Science
                </span>
                <span className="animate-fade-in-left" style={{ animationDelay: '550ms' }}>
                    library
                </span>
            </h1>

            <p 
                className="text-sm md:text-lg text-gray-600 max-w-md px-2 animate-fade-in-left" 
                style={{ animationDelay: '750ms' }}
            >
                All the technical books you need, in one place.
            </p>

            <div className="flex items-center gap-4 mt-2 animate-fade-in-left" style={{ animationDelay: '950ms' }}>
                <Button
                    intent="primary"
                    size="medium"
                    className="px-6 font-semibold"
                    onClick={() => navigate("/catalog")}
                >
                    Start &rarr;
                </Button>
                <Button
                    intent="third"
                    size="medium"
                    className="px-6 font-semibold"
                    onClick={() => handleScrollToSection('about-us-section')}
                >
                    Learn more
                </Button>
            </div>
        </div>
    );
};