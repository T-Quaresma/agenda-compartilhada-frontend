
import { Bell } from "lucide-react";
import { useState } from "react";
import InvitationsPanel from "../Invitations/Invitations";

function Header() {
    const [showInvitations, setShowInvitations] = useState(false);

    return (
        <header className="flex items-center justify-between px-6 py-4">
            <h1 className="text-white font-bold text-[2rem]">
                SHARP
            </h1>

            <button
                type="button"
                onClick={() => setShowInvitations(!showInvitations)}
                aria-label="Toggle invitations"
                aria-expanded={showInvitations}
                className="cursor-pointer"
            >
                <Bell size={24} color="#386A81" />
            </button>

            {showInvitations && (
                <div className="absolute right-6 top-16 z-50 bg-[#E1EFF4] rounded-xl p-4 shadow-lg">
                    <InvitationsPanel />
                </div>
            )}
        </header>
    );
}

export default Header;
