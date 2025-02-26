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

addBlockiesToCalendar();

function addBlockiesToCalendar() {
    // Load calendar from local storage
    let userData = JSON.parse(getUserData());
    let calendarData = userData.calendar;
    if (calendarData == null || calendarData == undefined) { return; }

    let calendarDataKeys = Object.keys(calendarData);

    for (let i = 0, n = calendarDataKeys.length; i < n; i++) {
        let cellId = calendarDataKeys[i];
        let blockieId = calendarData[cellId];
        let blockieToAdd = document.getElementById(blockieId);
        let blockieData = {
            blockieText: blockieId,
            color: blockieToAdd.style.backgroundColor,
            duration: blockieToAdd.getAttribute('data-duration')
        };

        drawBlockieOnCalendar(cellId, blockieData);
    }
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

    drawBlockieOnCalendar(cell.id, data);

    // Update the calendar in memory
    addBlockieToCalendarInUserData(cell.id, data.blockieText);
}

function drawBlockieOnCalendar(cellId, blockieData) {
    let day = cellId.split(';')[0];
    let hour = parseInt(cellId.split(';')[1]);

    for (let i = 0; i < blockieData.duration; i++) {
        let currentCellId = day + ";" + (hour + i);
        let currentCell = document.getElementById(currentCellId);

        currentCell.style.background = blockieData.color;

        if (i === 0) {
            currentCell.style.color = getContrastingTextColor(blockieData.color);
            currentCell.innerText = blockieData.blockieText;
        }
    }
}

function removeBlockieOnCalendar(cellId, blockieId) {
    let day = cellId.split(';')[0];
    let hour = parseInt(cellId.split(';')[1]);

    let cellsToRemove = parseInt(blockieId.split('| ')[1]);

    for (let i = 0; i < cellsToRemove; i++) {
        let cellToDeleteId = day + ";" + (hour + i);
        let cellToDelete = document.getElementById(cellToDeleteId);

        cellToDelete.innerText = '';
        cellToDelete.style.background = '';
    }
}

function getContrastingTextColor(hexColor) {
    let r, g, b;

    if (hexColor.includes('rgb(')) {
        // Extract RGB values from the string
        let match = hexColor.match(/\d+/g);
        if (match && match.length === 3) {
            [r, g, b] = match.map(Number);
        }
    }
    else {
        // Remove the '#' if it's there
        if (hexColor.startsWith('#')) {
            hexColor = hexColor.slice(1);
        }
      
        // Expand shorthand hex (e.g., #fff → #ffffff)
        if (hexColor.length === 3) {
            hexColor = hexColor.split('').map(c => c + c).join('');
        }

        // Parse the r, g, b values
        r = parseInt(hexColor.substr(0, 2), 16);
        g = parseInt(hexColor.substr(2, 2), 16);
        b = parseInt(hexColor.substr(4, 2), 16);
    }

    // Calculate brightness using the YIQ formula
    let brightness = ((r * 299) + (g * 587) + (b * 114)) / 1000;

    // Return 'black' for bright backgrounds, 'white' for dark backgrounds.
    return brightness >= 128 ? 'black' : 'white';
}

// TODO removeBlockieFromCalendar...
function addBlockieToCalendarInUserData(cellId, blockieId) {
    let userData = JSON.parse(getUserData());
    let savedCalendar = userData.calendar;

    if (savedCalendar === undefined) {
        savedCalendar = {};
    }

    savedCalendar[cellId] = blockieId;
    userData.calendar = savedCalendar;

    let dataToSave = JSON.stringify(userData);
    setUserData(dataToSave);
}