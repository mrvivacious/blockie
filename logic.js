document.addEventListener("DOMContentLoaded", function () {
  let calendarBody = document.getElementById("calendar-body");
  let blockieList = document.getElementById("blockie-list");
  let modal = document.getElementById("blockie-modal");
  let addBlockieBtn = document.getElementById("add-blockie-btn");
  let closeModal = document.querySelector(".close");
  let saveBlockieBtn = document.getElementById("save-blockie-btn");

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

  // Show modal
  addBlockieBtn.addEventListener("click", () => {
      modal.style.display = "block";
  });

  // Close modal
  closeModal.addEventListener("click", () => {
      modal.style.display = "none";
  });

  // Create blockie
  saveBlockieBtn.addEventListener("click", () => {
      let label = document.getElementById("blockie-label").value.trim();
      let blockieColor = document.getElementById("blockie-color").value;
      let duration = parseInt(document.getElementById("blockie-duration").value, 10);

      if (label === "") {
          alert("Please enter a label!");
          return;
      }

      let blockieText = `${label} | ${duration}h`;

      let blockie = document.createElement("div");
      blockie.classList.add("blockie-item");
      blockie.style.backgroundColor = blockieColor;
      blockie.innerText = blockieText;
      blockie.style.color = getContrastingTextColor(blockieColor);
      blockie.draggable = true;
      blockie.dataset.duration = duration;

      // Drag event
      blockie.addEventListener("dragstart", (e) => {
          e.dataTransfer.setData("text/plain", JSON.stringify({ blockieText, color: blockieColor, duration }));
      });

      blockieList.appendChild(blockie);
      modal.style.display = "none";
  });

  function getContrastingTextColor(hexColor) {
    // Remove the '#' if it's there
    if (hexColor.startsWith('#')) {
      hexColor = hexColor.slice(1);
    }
    
    // Parse the r, g, b values
    let r = parseInt(hexColor.substr(0, 2), 16);
    let g = parseInt(hexColor.substr(2, 2), 16);
    let b = parseInt(hexColor.substr(4, 2), 16);
    
    // Calculate brightness using the YIQ formula
    let brightness = ((r * 299) + (g * 587) + (b * 114)) / 1000;
    
    // Return 'black' for bright backgrounds, 'white' for dark backgrounds.
    return brightness >= 128 ? 'black' : 'white';
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

    // User data in storage:
    // 
  }
});
