//selector
const addBtn = document.querySelector('.add-btn')
const removeBtn = document.querySelector('.remove-btn')
const modalCont = document.querySelector('.modal-cont')
const textArea = document.querySelector('.text-area')
const mainCont = document.querySelector('.main-cont')
const allPriorityColors = document.querySelectorAll('.priority-color')
const toolBoxColors = document.querySelectorAll('.color-box')
let ticketsArr = JSON.parse(localStorage.getItem('tickets')) || []

// Init function which runs on every refresh to get the tickets from LocalStorage
function init() {
    if (localStorage.getItem('tickets')) {
        ticketsArr.forEach(function (ticket) {
            createTicket(ticket.ticketColor, ticket.task, ticket.id)
        })
    }
}
init()

//local variable
let modalPriorityColors = 'lightcoral'
const lockClose = "fa-lock";
const lockOpen = "fa-lock-open";
const Colors = ['lightcoral', 'lightgreen', 'lightpink', 'lightseagreen']

let addBtnflg = false;
let removeBtnflg = false
addBtn.addEventListener('click', function () {
    addBtnflg = !addBtnflg

    if (addBtnflg) {
        //show modal
        modalCont.style.display = 'flex'
    }

    else {
        //not show the modal
        modalCont.style.display = 'none'
    }

});

//Remove Btn Toggle
removeBtn.addEventListener('click', function () {
    removeBtnflg = !removeBtnflg
    if (removeBtnflg) {
        alert("Delete Button Activated")
        removeBtn.style.color = 'red'
    }
    else {
        removeBtn.style.color = 'white'
    }
})

// Handle Removal Button

function handleRemoval(ticket) {
    ticket.addEventListener('click', function () {

        if (removeBtnflg == true) {
            const id = ticket.querySelector('.ticket-id').innerText
            const ticketIdx = getIdx(id)
            const deletedItem = ticketsArr.splice(ticketIdx, 1)
            console.log(deletedItem)


            updateLocalStorage()
            ticket.remove()
        }
    })
}

// Filtering of tickets according to color
toolBoxColors.forEach(function (colorElem) {
    colorElem.addEventListener('click', function () {
        const allTickets = document.querySelectorAll('.ticket-cont')
        // console.log(allTickets)
        const selectedColor = colorElem.classList[0]
        // console.log(selectedColor)
        allTickets.forEach(function (ticket) {
            const ticketColorBand = ticket.querySelector('.ticket-color')
            console.log(ticketColorBand)
            if (ticketColorBand.style.backgroundColor == selectedColor) {
                ticket.style.display = 'block'
            }
            else {
                ticket.style.display = 'none'
            }

        })

    })
    colorElem.addEventListener('dblclick', function () {
        const allTickets = document.querySelectorAll('.ticket-cont')
        allTickets.forEach(function (ticket) {
            ticket.style.display = 'block'

        })
    })
})

// Changing Task Priority on colorBand
function handleColor(ticket) {
    const ticketColorBand = ticket.querySelector('.ticket-color')
    const id = ticket.querySelector('.ticket-id').innerText

    console.log(ticketColorBand)
    ticketColorBand.addEventListener('click', function () {
        const currentColor = ticketColorBand.style.backgroundColor
        console.log(currentColor)
        const ticketIdx = getIdx(id)
        console.log(ticketIdx)

        let currentColorIdx = Colors.findIndex(function (color) {
            return currentColor == color
        })
        currentColorIdx++
        const newColorIdx = currentColorIdx % Colors.length //4%4=0
        const newColorBand = Colors[newColorIdx]
        ticketColorBand.style.backgroundColor = newColorBand
        ticketsArr[ticketIdx].ticketColor = newColorBand
        updateLocalStorage()
    })

}

//Handle Lock
function handleLock(ticket) {
    const ticketLockElem = ticket.querySelector('.ticket-lock')
    const id = ticket.querySelector('.ticket-id').innerText
    //console.log(ticketLockElem)
    const ticketLockIcon = ticketLockElem.children[0]
    const taskArea = ticket.querySelector('.task-area')
    console.log(ticketLockIcon)
    ticketLockIcon.addEventListener('click', function () {
        const ticketIdx = getIdx(id)
        if (ticketLockIcon.classList.contains(lockClose)) {
            ticketLockIcon.classList.remove(lockClose)
            ticketLockIcon.classList.add(lockOpen)
            taskArea.setAttribute('contenteditable', 'true')
        }
        else {
            ticketLockIcon.classList.remove(lockOpen)
            ticketLockIcon.classList.add(lockClose)
            taskArea.setAttribute('contenteditable', 'false')
        }
        ticketsArr[ticketIdx].task = taskArea.innerText
        updateLocalStorage()
    })

}

// Removal of tickets




//generating a Ticket

function createTicket(taskColor, task, id) {
    const ticketCont = document.createElement('div')
    ticketCont.setAttribute('class', 'ticket-cont')
    ticketCont.innerHTML = `<div class="ticket-color" style="background-color:${taskColor}"></div>
            <div class="ticket-id">${id}</div>
            <div class="task-area">${task}</div>
            <div class="ticket-lock"><i class="fa-solid fa-lock"></i>
            </div>`;
    mainCont.appendChild(ticketCont)
    handleColor(ticketCont)
    handleLock(ticketCont)
    handleRemoval(ticketCont)
}

//Attaching key event on the modal

modalCont.addEventListener('keydown', function (e) {

    if (e.key === 'Control') {
        const task = textArea.value;
        const id = (Math.random() * 10000).toFixed(0)
        createTicket(modalPriorityColors, task, id);
        modalCont.style.display = 'none';
        addBtnflg = false
        ticketsArr.push({ id, task, ticketColor: modalPriorityColors })
        //console.log(ticketsArr)
        updateLocalStorage()
    }
});


allPriorityColors.forEach(function (colorElem) {
    colorElem.addEventListener('click', function () {
        allPriorityColors.forEach(function (priortyColors) {
            priortyColors.classList.remove('active')
        })

        colorElem.classList.add('active')

        modalPriorityColors = colorElem.classList[0]

        console.log(modalPriorityColors)


    })
})

function updateLocalStorage() {
    localStorage.setItem('tickets', JSON.stringify(ticketsArr))
}

function getIdx(id) {
    const ticketIdx = ticketsArr.findIndex(function (ticket) {
        return ticket.id === id
    })
    return ticketIdx
}