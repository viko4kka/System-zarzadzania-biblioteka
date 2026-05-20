type TeamMemberCardProps = {
    name: string;
    role: string;
    imageUrl?: string;
};

function TeamMemberCard({ name, role, imageUrl }: TeamMemberCardProps) {
    const getInitials = (fullName: string) => {
        const names = fullName.trim().split(' ');
        if (names.length >= 2) {
            return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
        }
        return fullName.slice(0, 2).toUpperCase();
    };

    return (
        <div className="flex flex-col items-center text-center gap-2 md:gap-3 px-0 py-2 w-full">
            <div className="w-28 h-28 md:w-40 md:h-40 rounded-full border border-gray-200 bg-white flex items-center justify-center shadow-md overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-lg">
                {imageUrl ? (
                    <img src={imageUrl} alt={name} className="w-full h-full object-cover" />
                ) : (
                    <span className="text-xl md:text-3xl font-bold text-gray-400 tracking-wider">
                        {getInitials(name)}
                    </span>
                )}
            </div>

            <div className="flex flex-col gap-0.5 md:gap-1 mt-1">
                <h4 className="text-lg md:text-2xl font-semibold text-black tracking-tight leading-snug">
                    {name}
                </h4>

                <p
                    style={{ color: 'rgb(128, 147, 160)' }}
                    className="text-sm md:text-base font-normal"
                >
                    {role}
                </p>
            </div>
        </div>
    );
}

export default TeamMemberCard;