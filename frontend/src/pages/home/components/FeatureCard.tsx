import { type ComponentType } from 'react';

type FeatureCardProps = {
    Icon: ComponentType<{ className?: string }>;
    title: string;
    description: string;
};

function FeatureCard({ Icon, title, description }: FeatureCardProps) {
    return (
        <div 
            style={{ backgroundColor: 'rgb(249, 249, 249)' }}
            className="flex-1 p-6 rounded-2xl border border-gray-100 flex flex-col gap-3 shadow-sm"
        >
            <div className="flex items-center gap-3">
                <div className="p-2 bg-main-light-blue/20 rounded-xl flex items-center justify-center text-main-blue">
                    <Icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-main-navy-blue">
                    {title}
                </h3>
            </div>

            <p className="text-sm text-gray-600 leading-relaxed pl-1">
                {description}
            </p>
        </div>
    );
}

export default FeatureCard;