async function openScheduleModal(descAgen) {
    document.querySelector(".modal-expanded-activity").style.display = 'none'
    document.querySelector('.modal-expanded-schedule').style.display = 'flex'
    document.querySelector('#schedule-detail-description').innerText = descAgen
}

document.addEventListener('DOMContentLoaded', function() {
    document.querySelector('#btn-close-schedule').onclick = function() {
        document.querySelector('.modal-expanded-schedule').style.display = 'none'
    }
})