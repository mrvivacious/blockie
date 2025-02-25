let calendarBody = document.getElementById("calendar-body");
let modal = document.getElementById("blockie-modal");

modal.style.display = "none";

// Generate calendar rows
for (let hour = 0; hour < 24; hour++) {
    let row = document.createElement("tr");

    let timeCell = document.createElement("td");
    timeCell.textContent = hour < 12 ? `${hour}:00 AM` : `${hour - 12}:00 PM`;
    row.appendChild(timeCell);

    for (let day = 0; day < 7; day++) {
        let cell = document.createElement("td");
        cell.dataset.hour = hour;
        cell.dataset.day = day;
        cell.addEventListener("dragover", allowDrop);
        cell.addEventListener("drop", dropBlockie);
        cell.id = day + ';' + hour;
        row.appendChild(cell);
    }

    calendarBody.appendChild(row);
}

// Drag & Drop functions
function allowDrop(e) {
    e.preventDefault();
}

function dropBlockie(e) {
    e.preventDefault();
    let data = JSON.parse(e.dataTransfer.getData("text/plain"));

    let cell = e.target;
    console.log(cell);
    let duration = parseInt(data.duration, 10);
    let startHour = parseInt(cell.dataset.hour, 10);

    if (startHour + duration > 24) {
        alert("Blockie exceeds available hours!");
        return;
    }

    let blockieDiv = document.createElement("div");
    blockieDiv.classList.add("calendar-blockie");
    blockieDiv.style.backgroundColor = data.color;
    blockieDiv.style.color = getContrastingTextColor(data.color);
    blockieDiv.innerText = data.blockieText;
    blockieDiv.style.height = `${1 * 50}px`;

    let day = cell.id.split(';')[0];
    let hour = parseInt(cell.id.split(';')[1]);

    for (let i = 0; i < duration; i++) {
        let currentCellId = day + ";" + (hour + i);
        let currentCell = document.getElementById(currentCellId);

        currentCell.style.background = blockieDiv.style.backgroundColor;

        if (i === 0) {
            currentCell.innerText = blockieDiv.innerText;
            currentCell.style.color = blockieDiv.style.color;
        }
    }
}