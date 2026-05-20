import React from 'react';
import { BookOpen, Clock, Users } from 'lucide-react';
import FeatureCard from './FeatureCard';

export const AboutUs: React.FC = () => {
    return (
        <section id="about-us-section" className="w-full bg-white py-16 md:py-24 px-4 md:px-8 border-t border-gray-100 scroll-mt-6">            <div className="max-w-7xl w-full mx-auto flex flex-col gap-12 md:gap-16">

            <div className="flex flex-col items-center text-center gap-3 md:gap-5">
                <h2 className="text-3xl md:text-4xl font-normal text-main-navy-blue tracking-wide">
                    About us
                </h2>

                <p
                    style={{ color: 'rgb(69, 98, 117)' }}
                    className="text-sm md:text-lg font-normal leading-relaxed max-w-2xl mx-auto px-4"
                >
                    We have created a space that supports your development at every stage of your learning journey
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
                <FeatureCard
                    Icon={BookOpen}
                    title="Large collection"
                    description="Hundreds of titles across CS, electronics, and automation — with multiple copies of the most popular ones."
                />

                <FeatureCard
                    Icon={Clock}
                    title="Flexible borrowing"
                    description="Borrow on your schedule. Extended loan periods, feel no pressure to rush through the material."
                />

                <FeatureCard
                    Icon={Users}
                    title="Open to all"
                    description="Students, professionals and hobbyists alike — if you're passionate about technology, you belong here."
                />
            </div>

        </div>
        </section>
    );
};