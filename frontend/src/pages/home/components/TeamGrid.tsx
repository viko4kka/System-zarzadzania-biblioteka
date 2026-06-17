import React from 'react';
import TeamMemberCard from './TeamMemberCard';

interface TeamMember {
    id: string | number;
    name: string;
    role: string;
}

interface TeamGridProps {
    frontendTeam: TeamMember[];
    backendTeam: TeamMember[];
    devopsTeam: TeamMember[];
}

export const TeamGrid: React.FC<TeamGridProps> = ({ frontendTeam, backendTeam, devopsTeam }) => {
    return (
        <section id="our-team-section" className="w-full bg-gray-50 py-16 md:py-24 px-4 md:px-8 border-t border-gray-100">
            <div className="max-w-7xl w-full mx-auto flex flex-col gap-10 md:gap-16">

                <div className="flex flex-col items-center text-center">
                    <h2 className="text-3xl md:text-4xl font-normal text-main-navy-blue tracking-wide">
                        Our team
                    </h2>
                </div>

                <div className="grid grid-cols-1 min-[400px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-x-4 gap-y-10 md:gap-y-14 w-full max-w-7xl mx-auto">
                    
                    {frontendTeam.map((member, index) => (
                        <div
                            key={member.id}
                            className={`${index === 0 ? "lg:col-start-1" : ""} transform scale-95 sm:scale-100 transition-transform`}
                        >
                            <TeamMemberCard name={member.name} role={member.role} />
                        </div>
                    ))}

                    {backendTeam.map((member, index) => (
                        <div
                            key={member.id}
                            className={`${index === 0 ? "lg:col-start-1" : ""} transform scale-95 sm:scale-100 transition-transform`}
                        >
                            <TeamMemberCard name={member.name} role={member.role} />
                        </div>
                    ))}

                    {devopsTeam.map((member, index) => (
                        <div
                            key={member.id}
                            className={`${index === 0 ? "lg:col-start-1" : ""} transform scale-95 sm:scale-100 transition-transform`}
                        >
                            <TeamMemberCard name={member.name} role={member.role} />
                        </div>
                    ))}

                </div>
            </div>
        </section>
    );
};