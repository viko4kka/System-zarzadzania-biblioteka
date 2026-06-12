import { Mail, MapPin } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import { Navbar } from './components/Navbar';
import { HeroText } from './components/HeroText';
import { HeroImage } from './components/HeroImage';
import { TeamGrid } from './components/TeamGrid';
import { AboutUs } from "./components/AboutUs";
import { ContactItem } from './components/ContactItem';

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
        { id: 10, name: "Radosław Wróbel", role: "DevOps engineer" },
        { id: 11, name: "Jakub Okoń", role: "DevOps engineer" }
    ];

    return (
        <div className="w-full min-h-screen bg-gray-50 flex flex-col">
            <Navbar handleScrollToSection={handleScrollToSection} navigate={navigate} />

            <main className="max-w-7xl w-full mx-auto flex-1 grid grid-cols-1 md:grid-cols-2 gap-12 px-4 md:px-8 py-12 md:py-16 items-center">
                <HeroText navigate={navigate} handleScrollToSection={handleScrollToSection} />
                <HeroImage />
            </main>

            <AboutUs />

            <TeamGrid
                frontendTeam={frontendTeam}
                backendTeam={backendTeam}
                devopsTeam={devopsTeam}
            />

            <section id="contact-section" className="w-full bg-white py-16 md:py-24 px-4 md:px-8 border-t border-gray-100">                
                <div className="max-w-7xl w-full mx-auto flex flex-col gap-12 md:gap-16">

                <div className="flex flex-col items-center text-center gap-3 md:gap-5">
                    <h2 className="text-3xl md:text-4xl font-normal text-main-navy-blue tracking-wide">
                        Contact
                    </h2>

                    <p
                        style={{ color: 'rgb(69, 98, 117)' }}
                        className="text-base md:text-lg font-normal leading-relaxed max-w-2xl mx-auto px-4"
                    >
                        Have a question or idea? <br /> Get in touch
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-8 md:gap-12 w-full mt-2">

                    <ContactItem
                        Icon={Mail}
                        text="contact@computer-science-library.pl"
                        href="mailto:contact@computer-science-library.pl"
                    />

                    <ContactItem
                        Icon={MapPin}
                        text="Politechnika Rzeszowska"
                    />

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