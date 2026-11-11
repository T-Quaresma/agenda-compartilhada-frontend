import { API_URL } from "./api"
import { HttpError } from "./auth";

export interface Invitation {
    partId: number;
    schedule_id: number;
    activity_id: number;
    status: "pending";
}

export type InvitationResponseStatus = "accepted" | "declined";

export interface InvitationResponse {
    Message: string;
    partId: number;
    status: InvitationResponseStatus;
}

interface LeaveScheduleResponse {
    Message: string;
}

async function getReceivedInvitations(): Promise<Invitation[]> {
    const response = await fetch(
        `${API_URL}/participant/invitations`,
        {
            method: "GET",
            credentials: "include"
        }
    );

    if (!response.ok) {
        throw new HttpError(
            response.status,
            `Error fetching invitations: ${response.status}`
        );
    }

    return await response.json();
}

async function respondToInvitation(
    invitationId: number,
    status: InvitationResponseStatus
): Promise<InvitationResponse> {
    const response = await fetch(
        `${API_URL}/participant/invitation`,
        {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include",
            body: JSON.stringify({
                id: invitationId,
                status: status
            })
        }
    );

    if (!response.ok) {
        throw new HttpError(
            response.status,
            `Error responding to invitation: ${response.status}`
        );
    }

    return await response.json();
}

async function leaveSchedule(
    scheduleId: number
): Promise<LeaveScheduleResponse> {
    const response = await fetch(
        `${API_URL}/participant/leave`,
        {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include",
            body: JSON.stringify({
                schedule_id: scheduleId
            })
        }
    );

    if (!response.ok) {
        throw new HttpError(
            response.status,
            `Error leaving schedule: ${response.status}`
        );
    }

    return await response.json();
}

export {
    getReceivedInvitations,
    respondToInvitation,
    leaveSchedule
};
