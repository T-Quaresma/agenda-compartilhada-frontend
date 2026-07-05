import { Bell } from "lucide-react";

function Header() {
    return (
        <header className="flex items-center justify-between px-6 py-4">
            <h1 className="text-white font-bold text-[2rem]">App Name</h1>
            <Bell size={24} color="#386A81"></Bell>
        </header>
    );
};

export default Header;