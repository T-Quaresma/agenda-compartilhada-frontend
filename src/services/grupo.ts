import { API_URL } from "./api"

async function createGroup(name: string, user_id: number, image: string | null) {
    const response = await fetch(`${API_URL}/group`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, user_id, image })
    })
    return await response.json()
}

async function listGroups(user_id: number) {
    const response = await fetch(`${API_URL}/group?user_id=${user_id}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    })
    return await response.json()
}

async function deleteGroup(group_id: number) {
    const response = await fetch(`${API_URL}/group`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ group_id })
    })
    return await response.json()
}

async function updateGroup(group_id: number, name: string | null, image: string | null) {
    const response = await fetch(`${API_URL}/group`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ group_id, name, image })
    })
    return await response.json()
}

export { createGroup, listGroups, deleteGroup, updateGroup }