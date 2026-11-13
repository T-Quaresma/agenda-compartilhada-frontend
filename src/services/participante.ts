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

export type ParticipantStatus = InvitationResponseStatus | "pending";

export interface ScheduleParticipant {
    partId: number;
    usuId: number;
    nomeUsu: string;
    status: ParticipantStatus;
}

export interface UserSearchResult {
    usuId: number;
    nomeUsu: string;
    email: string;
}

export interface AddParticipantResponse {
    Message: string;
    partId: number;
    status: "pending";
}

interface LeaveScheduleResponse {
    Message: string;
}

function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null;
}

function isScheduleParticipant(value: unknown): value is ScheduleParticipant {
    return isRecord(value)
        && typeof value.partId === "number"
        && typeof value.usuId === "number"
        && typeof value.nomeUsu === "string"
        && (value.status === "pending"
            || value.status === "accepted"
            || value.status === "declined");
}

function isUserSearchResult(value: unknown): value is UserSearchResult {
    return isRecord(value)
        && typeof value.usuId === "number"
        && typeof value.nomeUsu === "string"
        && typeof value.email === "string";
}

async function getScheduleParticipants(scheduleId: number): Promise<ScheduleParticipant[]> {
    const response = await fetch(
        `${API_URL}/participant?schedule_id=${scheduleId}`,
        {
            method: "GET",
            credentials: "include"
        }
    );

    if (!response.ok) {
        throw new HttpError(
            response.status,
            `Error fetching schedule participants: ${response.status}`
        );
    }

    const data: unknown = await response.json();
    if (!Array.isArray(data) || !data.every(isScheduleParticipant)) {
        throw new Error("Invalid schedule participants response.");
    }

    return data;
}

async function searchUsersByName(name: string): Promise<UserSearchResult[]> {
    const response = await fetch(
        `${API_URL}/usuarios?name=${encodeURIComponent(name)}`,
        {
            method: "GET",
            credentials: "include"
        }
    );

    if (!response.ok) {
        throw new HttpError(
            response.status,
            `Error searching users: ${response.status}`
        );
    }

    const data: unknown = await response.json();
    if (isRecord(data) && data.Message === "User not found.") {
        return [];
    }
    if (!Array.isArray(data) || !data.every(isUserSearchResult)) {
        throw new Error("Invalid user search response.");
    }

    return data;
}

async function addScheduleParticipant(
    userId: number,
    scheduleId: number
): Promise<AddParticipantResponse> {
    const response = await fetch(
        `${API_URL}/participant`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include",
            body: JSON.stringify({
                user_id: userId,
                schedule_id: scheduleId
            })
        }
    );

    if (!response.ok) {
        throw new HttpError(
            response.status,
            `Error adding schedule participant: ${response.status}`
        );
    }

    const data: unknown = await response.json();
    if (!isRecord(data)
        || typeof data.Message !== "string"
        || typeof data.partId !== "number"
        || data.status !== "pending") {
        throw new Error("Invalid add participant response.");
    }

    return {
        Message: data.Message,
        partId: data.partId,
        status: data.status
    };
}

async function removeScheduleParticipant(participantId: number): Promise<void> {
    const response = await fetch(
        `${API_URL}/participant`,
        {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include",
            body: JSON.stringify({
                id: participantId
            })
        }
    );

    if (!response.ok) {
        throw new HttpError(
            response.status,
            `Error removing schedule participant: ${response.status}`
        );
    }
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
    getScheduleParticipants,
    searchUsersByName,
    addScheduleParticipant,
    removeScheduleParticipant,
    getReceivedInvitations,
    respondToInvitation,
    leaveSchedule
};
