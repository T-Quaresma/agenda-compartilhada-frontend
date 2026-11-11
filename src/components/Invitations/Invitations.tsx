
import { useEffect, useState } from "react";
import { getReceivedInvitations, respondToInvitation } from "../../services/participante";
import type { Invitation } from "../../services/participante";

function InvitationsPanel() {
    const [invitations, setInvitations] = useState<Invitation[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [processingId, setProcessingId] = useState<number | null>(null);

    useEffect(() => {
        async function loadInvitations() {
            try {
                const data = await getReceivedInvitations();
                setInvitations(data);
            } catch (error) {
                console.error("Error loading invitations:", error);
                setError("Could not load invitations.");
            } finally {
                setLoading(false);
            }
        }

        loadInvitations();
    }, []);

    async function handleResponse(
        invitationId: number,
        status: "accepted" | "declined"
    ) {
        setProcessingId(invitationId);
        setError(null);

        try {
            await respondToInvitation(invitationId, status);

            setInvitations(previous =>
                previous.filter(
                    invitation => invitation.partId !== invitationId
                )
            );
        } catch (error) {
            console.error("Error responding to invitation:", error);
            setError("Could not respond to invitation.");
        } finally {
            setProcessingId(null);
        }
    }

    return (
        <div className="w-80 max-w-[calc(100vw-3rem)]">
            <h2 className="text-[#5C7E8D] font-bold text-lg mb-3">
                Invitations
            </h2>

            {loading && (
                <p className="text-[#5C7E8D] text-sm">
                    Loading invitations...
                </p>
            )}

            {error && (
                <p role="alert" className="text-red-600 text-sm mb-3">
                    {error}
                </p>
            )}

            {!loading && invitations.length === 0 && !error && (
                <p className="text-[#5C7E8D] text-sm">
                    You have no pending invitations.
                </p>
            )}

            <div className="flex flex-col gap-3 max-h-80 overflow-y-auto">
                {invitations.map(invitation => (
                    <div
                        key={invitation.partId}
                        className="bg-white rounded-xl p-3 flex flex-col gap-2"
                    >
                        <p className="text-[#5C7E8D] font-semibold text-sm">
                            Activity #{invitation.activity_id}
                        </p>

                        <p className="text-[#5C7E8D] text-sm">
                            Schedule #{invitation.schedule_id}
                        </p>

                        <div className="flex gap-2 mt-1">
                            <button
                                type="button"
                                disabled={processingId !== null}
                                onClick={() =>
                                    handleResponse(invitation.partId, "accepted")
                                }
                                className="flex-1 bg-[#9FD7F1] text-white font-semibold rounded-lg py-2 disabled:opacity-50"
                            >
                                Accept
                            </button>

                            <button
                                type="button"
                                disabled={processingId !== null}
                                onClick={() =>
                                    handleResponse(invitation.partId, "declined")
                                }
                                className="flex-1 bg-[#87A7B8] text-white font-semibold rounded-lg py-2 disabled:opacity-50"
                            >
                                Decline
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default InvitationsPanel;
