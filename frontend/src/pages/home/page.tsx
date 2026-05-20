import { Button } from "../../ui/Button";
import FeatureCard from "./components/FeatureCard";
import { BookOpen, Clock, Users } from 'lucide-react';
import TeamMemberCard from "./components/TeamMemberCard";
import { Mail, MapPin } from 'lucide-react';
import { useNavigate } from "react-router-dom";

function HomePage() {
    const handleScrollToSection = (sectionId: string) => {
        const element = document.getElementById(sectionId);

        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
            console.warn(`Sekcja o id #${sectionId} nie została znaleziona.`);
        }
    };

    const navigate = useNavigate();

    const frontendTeam = [
        { id: 1, name: "Viktoriia Kaspryk", role: "Frontend project lead, frontend developer, UI/UX designer" },
        { id: 2, name: "Karol Nowak", role: "Frontend developer, QA engineer" },
        { id: 3, name: "Kamila Karwat", role: "Frontend developer" },
        { id: 4, name: "Michał Niziołek", role: "Frontend developer" }
    ];

    const backendTeam = [
        { id: 5, name: "Natalia Filak", role: "Backend project lead, backend developer" },
        { id: 6, name: "Jan Kościółek", role: "Backend developer" },
        { id: 7, name: "Grzegorz Owsicki", role: "Backend developer" },
        { id: 8, name: "Konrad Zegar", role: "Backend developer" },
        { id: 9, name: "Sebastian Wojnar", role: "Backend developer" }
    ];

    const devopsTeam = [
        { id: 10, name: "Radek Wróbel", role: "DevOps engineer" },
        { id: 11, name: "Kuba Okoń", role: "DevOps engineer" }
    ];

    return (
        <div className="w-full min-h-screen bg-gray-50 flex flex-col">
            <header className="w-full bg-white px-8 py-4 flex justify-end items-center border-b border-gray-100">
                <nav className="flex items-center gap-2">
                    <Button
                        intent="third"
                        size="medium"
                        className="bg-transparent border-none shadow-none text-gray-600 hover:text-main-navy-blue font-medium"
                        onClick={() => handleScrollToSection('about-us-section')}
                    >
                        About us
                    </Button>
                    <Button
                        intent="third"
                        size="medium"
                        className="bg-transparent border-none shadow-none text-gray-600 hover:text-main-navy-blue font-medium"
                        onClick={() => handleScrollToSection('our-team-section')}>
                        Our team
                    </Button>
                    <Button
                        intent="third"
                        size="medium"
                        className="bg-transparent border-none shadow-none text-gray-600 hover:text-main-navy-blue font-medium mr-2"
                        onClick={() => handleScrollToSection('contact-section')}>
                        Contact
                    </Button>
                    <Button intent="login" size="medium" className="font-semibold px-5">
                        Log in
                    </Button>
                </nav>
            </header>

            <main className="max-w-7xl w-full mx-auto flex-1 grid grid-cols-2 gap-12 px-8 py-16 items-center">
                <div className="flex flex-col gap-6">
                    <div style={{ backgroundColor: 'rgb(240, 248, 197)' }} className="w-fit px-4 py-1.5 rounded-full text-sm font-semibold text-gray-800 tracking-wide">
                        New learning platform
                    </div>
                    <h1 className="text-5xl font-extrabold text-main-navy-blue leading-tight flex flex-col">
                        <span>Welcome to</span>
                        <span className="text-main-blue">Computer Science</span>
                        <span>library</span>
                    </h1>
                    <p className="text-lg text-gray-600 max-w-md">
                        All the technical books you need, in one place.
                    </p>
                    <div className="flex items-center gap-4 mt-2">
                        <Button intent="primary" size="medium" className="px-6 font-semibold"onClick={() => navigate("/books")}>
                            Start &rarr;
                        </Button>
                        <Button intent="third" size="medium" className="px-6 font-semibold" onClick={() => handleScrollToSection('about-us-section')}>
                            Learn more
                        </Button>
                    </div>
                </div>

                <div className="w-full aspect-[4/3] bg-white rounded-2xl shadow-md border border-gray-100 flex items-center justify-center p-8">
                    <img
                        src="./logo.png"
                        alt="Computer Science Library Illustration"
                        className="w-full h-full object-contain rounded-xl"
                    />
                </div>
            </main>

            <section id="about-us-section" className="w-full bg-white py-24 px-8 border-t border-gray-100 scroll-mt-6">
                <div className="max-w-7xl w-full mx-auto flex flex-col gap-16">

                    <div className="flex flex-col items-center text-center gap-5">
                        <h2 className="text-5xl font-normal text-main-navy-blue tracking-wide">
                            About us
                        </h2>

                        <p
                            style={{ color: 'rgb(69, 98, 117)' }}
                            className="text-lg font-normal leading-relaxed max-w-2xl mx-auto"
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
                            description="Borrow on your schedule. Extended loan periods mean no pressure to rush through the material."
                        />

                        <FeatureCard
                            Icon={Users}
                            title="Open to all"
                            description="Students, professionals, and hobbyists alike — if you're passionate about technology, you belong here."
                        />
                    </div>

                </div>
            </section>

            <section id="our-team-section" className="w-full bg-white py-24 px-8 border-t border-gray-100">
                <div className="max-w-7xl w-full mx-auto flex flex-col gap-16">

                    <div className="flex flex-col items-center text-center">
                        <h2 className="text-5xl font-normal text-main-navy-blue tracking-wide">
                            Our team
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-x-2 gap-y-14 w-full max-w-7xl mx-auto">

                        {frontendTeam.map((member, index) => (
                            <div
                                key={member.id}
                                className={index === 0 ? "lg:col-start-1" : ""}
                            >
                                <TeamMemberCard name={member.name} role={member.role} />
                            </div>
                        ))}

                        {backendTeam.map((member, index) => (
                            <div
                                key={member.id}
                                className={index === 0 ? "lg:col-start-1" : ""}
                            >
                                <TeamMemberCard name={member.name} role={member.role} />
                            </div>
                        ))}

                        {devopsTeam.map((member, index) => (
                            <div
                                key={member.id}
                                className={index === 0 ? "lg:col-start-1" : ""}
                            >
                                <TeamMemberCard name={member.name} role={member.role} />
                            </div>
                        ))}

                    </div>

                </div>
            </section>

            <section id="contact-section" className="w-full bg-white py-24 px-8 border-t border-gray-100">
                <div className="max-w-7xl w-full mx-auto flex flex-col gap-16">

                    <div className="flex flex-col items-center text-center gap-5">
                        <h2 className="text-5xl font-normal text-main-navy-blue tracking-wide">
                            Contact
                        </h2>

                        <p
                            style={{ color: 'rgb(69, 98, 117)' }}
                            className="text-lg font-normal leading-relaxed max-w-2xl mx-auto"
                        >
                            Have a question or idea? <br /> Get in touch
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-12 w-full mt-2">

                        <div className="flex items-center gap-4 group">
                            <div className="p-3 bg-main-light-blue/20 rounded-2xl flex items-center justify-center text-main-blue transition-colors duration-200 group-hover:bg-main-light-blue/30">
                                <Mail className="h-6 w-6" />
                            </div>
                            <a
                                className="text-xl font-medium text-main-navy-blue"
                            >
                                contact@computer-science-library.pl
                            </a>
                        </div>

                        <div className="flex items-center gap-4 group">
                            <div className="p-3 bg-main-light-blue/20 rounded-2xl flex items-center justify-center text-main-blue transition-colors duration-200 group-hover:bg-main-light-blue/30">
                                <MapPin className="h-6 w-6" />
                            </div>
                            <span className="text-xl font-medium text-main-navy-blue">
                                Politechnika Rzeszowska
                            </span>
                        </div>

                    </div>

                </div>
            </section>
            <footer className="w-full bg-white py-6 px-8 border-t border-gray-100 mt-auto">
                <div className="max-w-7xl w-full mx-auto flex items-center justify-center">
                    <p className="text-sm font-normal text-gray-400 tracking-wide">
                        &copy; 2026 Computer Science Library
                    </p>
                </div>
            </footer>
        </div>
    );
}

export default HomePage;