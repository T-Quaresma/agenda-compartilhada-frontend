import { API_URL } from "./api"

async function createSchedule(name: string, description: string, data_inicio: string | null, data_fim: string | null, hora_inicio: string | null, hora_fim: string | null, activity_id: number, local: string, frequency: string | null) {
    const response = await fetch(`${API_URL}/schedule`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name: name,
            description: description,
            starting_date: data_inicio,
            ending_date: data_fim,
            starting_time: hora_inicio,
            ending_time: hora_fim,
            activity_id: activity_id,
            local: local,
            frequency: frequency
        })
    })
    const data = await response.json()
    return data
}

async function listSchedule(activity_id: number) {
    const response = await fetch(`${API_URL}/schedule?activity_id=${activity_id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    const data = await response.json()
    return data
}

async function displaySchedule(agenId: number) {
    const response = await fetch(`${API_URL}/schedule?agenId=${agenId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    const data = await response.json()
    return data
}

async function deleteSchedule(schedule_id: number) {
    const response = await fetch(`${API_URL}/schedule`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            schedule_id: schedule_id
        })
    })
    const data = await response.json()
    return data
}

async function searchSchedule(schedule_name: string, activity_id: number) {
    const response = await fetch(`${API_URL}/schedule?activity_id=${activity_id}&name=${schedule_name}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    const data = await response.json()
    return data
}

async function editSchedule(name: string, description: string, data_inicio: string | null, data_fim: string | null, hora_inicio: string | null, hora_fim: string | null     , schedule_id: number, local: string, frequency: string | null) {
    const response = await fetch(`${API_URL}/schedule`, { 
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name: name,
            description: description,
            starting_date: data_inicio,
            ending_date: data_fim,
            starting_time: hora_inicio,
            ending_time: hora_fim,
            schedule_id: schedule_id,
            local: local,
            frequency: frequency
        })
    })
    const data = await response.json()
    return data
}

export {createSchedule, listSchedule, deleteSchedule, searchSchedule, displaySchedule, editSchedule}