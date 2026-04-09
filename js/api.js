async function registerUser(name, email, senha) {
    const response = await fetch('http://127.0.0.1:5000/usuario', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name: name,
            email: email,
            senha: senha
        })
    })
    const data = await response.json()
    return data
}

async function loginUser(name) {
    const response = await fetch(`http://127.0.0.1:5000/usuarios?name=${name}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
    })
    const data = await response.json()
    return data
}

async function deleteUser(id) {
    const response = await fetch('http://127.0.0.1:5000/usuario', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            id: id
        })
    })
    const data = await response.json()
    return data
}

async function createActivity(name, description, user_id) {
    const response = await fetch('http://127.0.0.1:5000/activity', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name: name,
            description: description,
            user_id: user_id
        })
    })
    const data = await response.json()
    return data
}

async function searchActivity(name) {
    const response = await fetch(`http://127.0.0.1:5000/activity?name=${name}`, {
        method: "GET",
        headers: {
            'Content-Type': 'application/json'
        },
    })
    const data = await response.json()
    return data    
}

async function listActivities(user_id) {
    const response = await fetch(`http://127.0.0.1:5000/activity?user_id=${user_id}`, {
        method: "GET",
        headers: {
            'Content-type': 'application/json'
        },
    })
    const data = await response.json()
    return data
}

async function deleteActivity(activity_id) {
    const response = await fetch('http://127.0.0.1:5000/activity', {
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

async function createSchedule(description, date, activity_id) {
    const response = await fetch('http://127.0.0.1:5000/schedule', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            description: description,
            date: date,
            activity_id: activity_id
        })
    })
    const data = await response.json()
    return data
}

async function listSchedule(activity_id) {
    const response = await fetch(`http://127.0.0.1:5000/schedule?activity_id=${activity_id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    const data = await response.json()
    return data
}

async function deleteSchedule(schedule_id) {
    const response = await fetch('http://127.0.0.1:5000/schedule', {
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

document.getElementById('search-bar').addEventListener('keypress', async function(e) {
    if(e.key === 'Enter') {
        const searchTerm = this.value
        if(searchTerm.trim() === '') {
            loadActivities()
            return
        }
        const activities = await searchActivity(searchTerm)
        const container = document.querySelector('.activity-cards')
        container.innerHTML = ''
        if(activities.Message) {
            container.innerHTML = '<p>No activities found.</p>'
            return
        }
        activities.forEach(activity => {
            const card = document.createElement('div')
            card.className = 'activity-card'
            card.innerHTML = `
                <div class="activity-card-title">${activity.nomeAtiv}</div>
                <div class="activity-card-shedules"></div>
            `
            card.onclick = () => openActivityModal(activity.ativId, activity.nomeAtiv, activity.descAtiv)
            container.appendChild(card)
        })
    }
})