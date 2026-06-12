import React, { useState } from 'react';
import { Button } from "../../../ui/Button";

interface NavbarProps {
    handleScrollToSection: (sectionId: string) => void;
    navigate: (path: string) => void; 
}

export const Navbar: React.FC<NavbarProps> = ({ handleScrollToSection, navigate }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const navItems = [
        { label: 'About us', sectionId: 'about-us-section' },
        { label: 'Our team', sectionId: 'our-team-section' },
        { label: 'Contact', sectionId: 'contact-section' },
    ];

    const handleMobileClick = (sectionId: string) => {
        handleScrollToSection(sectionId);
        setIsMenuOpen(false);
    };

    return (
        <header className="w-full bg-gray-50 px-8 py-4 flex justify-between md:justify-end items-center relative">
            
            <div className="md:hidden flex items-center">
                <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="text-gray-600 hover:text-main-navy-blue focus:outline-none p-2"
                    aria-label="Toggle menu"
                >
                    {isMenuOpen ? (
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    ) : (
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    )}
                </button>
            </div>

            <nav className="hidden md:flex items-center gap-2">
                {navItems.map((item) => (
                    <Button
                        key={item.sectionId}
                        intent="third"
                        size="medium"
                        className="bg-transparent border-none shadow-none text-gray-600 hover:text-main-navy-blue font-medium text-sm py-2"
                        onClick={() => handleScrollToSection(item.sectionId)}
                    >
                        {item.label}
                    </Button>
                ))}
                <Button 
                    intent="lightButton" 
                    size="medium" 
                    className="font-semibold px-5 ml-2 text-sm"
                    onClick={() => navigate("/login")}
                >
                    Log in
                </Button>
            </nav>

            <div className="md:hidden">
                <Button 
                    intent="lightButton" 
                    size="medium" 
                    className="font-semibold px-4 py-2 text-sm"
                    onClick={() => navigate("/login")}
                >
                    Log in
                </Button>
            </div>

            {isMenuOpen && (
                <div className="absolute top-full left-0 w-full bg-gray-50 border-b border-gray-200/50 shadow-lg md:hidden z-50 animate-fade-in">
                    <div className="flex flex-col px-6 py-4 gap-2">
                        {navItems.map((item) => (
                            <Button
                                key={item.sectionId}
                                intent="third"
                                size="medium"
                                className="w-full text-left justify-start bg-transparent border-none shadow-none text-gray-600 hover:text-main-navy-blue font-medium text-sm py-2 px-3"
                                onClick={() => handleMobileClick(item.sectionId)}
                            >
                                {item.label}
                            </Button>
                        ))}
                    </div>
                </div>
            )}
        </header>
    );
};