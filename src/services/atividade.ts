import { API_URL } from "./api"

async function createActivity(name: string, description: string, image: string, group_id: number | null) {
    const response = await fetch(`${API_URL}/activity`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: "include",
        body: JSON.stringify({
            name: name,
            description: description,
            image: image,
            group_id: group_id
        })
    })
    const data = await response.json()
    return data
}

async function searchActivity() {
    const response = await fetch(`${API_URL}/activity`, {
        method: "GET",
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: "include"
    })
    const data = await response.json()
    return data    
}

async function getActivity(activity_id: number) {
    const response = await fetch(`${API_URL}/activity?activity_id=${activity_id}`, {
        method: "GET",
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: "include",
    })
    const data = await response.json()
    return data
}

async function listActivities() {
    const response = await fetch(`${API_URL}/activity`, {
        method: "GET",
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: "include"
    })
    const data = await response.json()
    return data
}

async function deleteActivity(activity_id: number) {
    const response = await fetch(`${API_URL}/activity`, {
        method: "DELETE",
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: "include",
        body: JSON.stringify({
            activity_id: activity_id
        })
    })
    const data = await response.json()
    return data
}

async function updateActivity(name: string, description: string, activity_id: number, image: string, group_id: number | null) {
    const response = await fetch(`${API_URL}/activity`, {
        method: "PUT",
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: "include",
        body: JSON.stringify({
            name: name,
            description: description,
            activity_id: activity_id,
            image: image,
            group_id: group_id
        })
    })
    const data = await response.json()
    return data
}

 export {createActivity, deleteActivity, listActivities, searchActivity, getActivity, updateActivity}
