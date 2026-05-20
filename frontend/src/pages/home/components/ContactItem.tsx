import React, { type ComponentType } from 'react';

type ContactItemProps = {
    Icon: ComponentType<{ className?: string }>;
    text: string;
    href?: string; // Opcjonalny prop można użyć jeśli chce sie dodać link
};

export const ContactItem: React.FC<ContactItemProps> = ({ Icon, text, href }) => {
    const contentClasses = "text-base md:text-xl font-medium text-main-navy-blue transition-colors duration-200 group-hover:text-main-blue";

    return (
        <div className="flex items-center gap-4 group">
            <div className="p-3 bg-main-light-blue/20 rounded-2xl flex items-center justify-center text-main-blue transition-colors duration-200 group-hover:bg-main-light-blue/30 shadow-sm">
                <Icon className="h-6 w-6" />
            </div>

            {href ? (
                <a href={href} className={contentClasses}>
                    {text}
                </a>
            ) : (
                <span className={contentClasses}>
                    {text}
                </span>
            )}
        </div>
    );
};