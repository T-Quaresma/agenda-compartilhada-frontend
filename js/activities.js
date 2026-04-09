let currentActivityId = null
let currentActivityName = null
let currentActivityDesc = null

async function loadActivities() {
    const user = JSON.parse(localStorage.getItem('loggedinUser'))
    const activities = await listActivities(user.usuId)
    const container = document.querySelector('.activity-cards')
    container.innerHTML = ''
    if(activities.Message) {
        const msg = document.createElement('p')
        msg.className = 'no-activities-msg'
        msg.innerText = 'No activities yet.'
        container.appendChild(msg)
        return
    }
    activities.forEach(async activity => {
        const card = document.createElement('div')
        card.className = 'activity-card'
        card.innerHTML = `
            <div class="activity-card-title">${activity.nomeAtiv}</div>
            <div class="activity-card-schedules"></div>    
        `
        card.onclick = () => openActivityModal(activity.ativId, activity.nomeAtiv, activity.descAtiv)
        container.appendChild(card)
        const schedules = await listSchedule(activity.ativId)
        if(!schedules || schedules.Message) 
            return
        const scheduleContainer = card.querySelector('.activity-card-schedules')
        schedules.forEach(schedule => {
            const item = document.createElement('p')
            item.className = 'card-schedule-item'
            item.innerText = schedule.data_hora
            scheduleContainer.appendChild(item)
        })
    })
}

async function openActivityModal(activId, nomeAtiv, descAtiv) {
    currentActivityId = activId
    currentActivityDesc = descAtiv
    currentActivityName = nomeAtiv
    document.querySelector(".modal-expanded-activity").style.display = 'flex'
    document.querySelector(".expanded-header h2").innerText = nomeAtiv
    document.querySelector(".modal-box-expanded p").innerText = descAtiv
    document.querySelector(".expanded-schedule-list").innerHTML = ''
    const schedules = await listSchedule(activId)

    if(!schedules || schedules.Message) {
    // não tem agendamentos, não faz nada
        return
    }

    schedules.forEach(schedule => {
        const sched = document.createElement('li')
        sched.className = 'schedule-item'
    
        const scheduleText = document.createElement('span')
        scheduleText.innerText = schedule.data_hora
        scheduleText.onclick = () => openScheduleModal(schedule.descAgen)
    
        const deleteBtn = document.createElement('button')
        deleteBtn.className = 'delete-schedule'
        deleteBtn.innerText = '✕'
        deleteBtn.onclick = async () => {
            await deleteSchedule(schedule.agenId)
            openActivityModal(currentActivityId, currentActivityName, currentActivityDesc)
        }
        sched.appendChild(scheduleText)
        sched.appendChild(deleteBtn)
        document.querySelector('.expanded-schedule-list').appendChild(sched)
        })
}

async function handleCreateActivity() {
    const name = document.querySelector('#activity-name').value
    const description = document.querySelector('#activity-description').value
    const user = JSON.parse(localStorage.getItem('loggedinUser'))
    const result = await createActivity(name, description, user.usuId)
    if(result.Message == 'Activity created successfully!') {
        document.querySelector(".modal-create-activity").style.display = 'none'
        loadActivities()
    }
}

async function handleDeleteActivity() {
    const result = await deleteActivity(currentActivityId)
    if(result.Message == 'Activity deleted successfully.')  {
        document.querySelector(".modal-expanded-activity").style.display = 'none'
        loadActivities()
    }
}

async function handleCreateSchedule() {
    const date = document.querySelector('#schedule-time').value
    const description = document.querySelector('#schedule-description').value
    const result = await createSchedule(description, date, currentActivityId)
    if(result.Message == 'Schedule created successfully!') {
        document.querySelector('.modal-create-schedule').style.display = 'none'
        openActivityModal(currentActivityId, currentActivityName, currentActivityDesc)
    }
}

document.addEventListener('DOMContentLoaded', function() {
    document.querySelector('#btn-confirm-activity').onclick = handleCreateActivity
    document.querySelector('.btn-delete-activity').onclick = handleDeleteActivity
    document.querySelector('.btn-confirm-schedule').onclick = handleCreateSchedule
    document.querySelector('#create-activity').onclick = function() {
        document.querySelector(".modal-create-activity").style.display = 'flex'
    }
    document.querySelector('.btn-create-schedule').onclick = function() {
        document.querySelector('.modal-expanded-activity').style.display = 'none'
        document.querySelector('.modal-create-schedule').style.display = 'flex'
    }
    document.querySelector('#btn-cancel-activity').onclick = function() {
        document.querySelector('.modal-create-activity').style.display = 'none'
    }
    document.querySelector('#btn-cancel-activity-expanded').onclick = function() {
        document.querySelector(".modal-expanded-activity").style.display = 'none'
        loadActivities()
    }
    document.querySelector('.btn-cancel-schedule').onclick = function() {
        document.querySelector('.modal-create-schedule').style.display = 'none'
        document.querySelector('.modal-expanded-activity').style.display = 'flex'
    }
    
})




