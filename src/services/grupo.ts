import { API_URL } from "./api"

async function createGroup(name: string, image: string | null) {
    const response = await fetch(`${API_URL}/group`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: "include",
        body: JSON.stringify({ name, image })
    })
    return await response.json()
}

async function listGroups() {
    const response = await fetch(`${API_URL}/group`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: "include"
    })
    return await response.json()
}

async function deleteGroup(group_id: number) {
    const response = await fetch(`${API_URL}/group`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        credentials: "include",
        body: JSON.stringify({ group_id })
    })
    return await response.json()
}

async function updateGroup(group_id: number, name: string | null, image: string | null) {
    const response = await fetch(`${API_URL}/group`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: "include",
        body: JSON.stringify({ group_id, name, image })
    })
    return await response.json()
}

export { createGroup, listGroups, deleteGroup, updateGroup }