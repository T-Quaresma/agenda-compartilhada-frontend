import { API_URL } from "./api"

async function createActivity(name: string, description: string, user_id: number, image: string, group_id: number | null) {
    const response = await fetch(`${API_URL}/activity`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name: name,
            description: description,
            user_id: user_id,
            image: image,
            group_id: group_id
        })
    })
    const data = await response.json()
    return data
}

async function searchActivity(name: string) {
    const response = await fetch(`${API_URL}/activity?name=${name}`, {
        method: "GET",
        headers: {
            'Content-Type': 'application/json'
        },
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
    })
    const data = await response.json()
    return data
}

async function listActivities(user_id: number) {
    const response = await fetch(`${API_URL}/activity?user_id=${user_id}`, {
        method: "GET",
        headers: {
            'Content-type': 'application/json'
        },
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

