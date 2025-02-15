document.addEventListener("DOMContentLoaded", function () {
  const calendarBody = document.getElementById("calendar-body");
  const blockieList = document.getElementById("blockie-list");
  const modal = document.getElementById("blockie-modal");
  const addBlockieBtn = document.getElementById("add-blockie-btn");
  const closeModal = document.querySelector(".close");
  const saveBlockieBtn = document.getElementById("save-blockie-btn");

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
      const label = document.getElementById("blockie-label").value.trim();
      const blockieColor = document.getElementById("blockie-color").value;
      const duration = parseInt(document.getElementById("blockie-duration").value, 10);

      if (label === "") {
          alert("Please enter a label!");
          return;
      }

      const blockie = document.createElement("div");
      blockie.classList.add("blockie-item");
      blockie.style.backgroundColor = blockieColor;
      blockie.innerText = label;
      blockie.style.color = getContrastingTextColor(blockieColor);
      blockie.draggable = true;
      blockie.dataset.duration = duration;

      // Drag event
      blockie.addEventListener("dragstart", (e) => {
          e.dataTransfer.setData("text/plain", JSON.stringify({ label, color: blockieColor, duration }));
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
    const r = parseInt(hexColor.substr(0, 2), 16);
    const g = parseInt(hexColor.substr(2, 2), 16);
    const b = parseInt(hexColor.substr(4, 2), 16);
    
    // Calculate brightness using the YIQ formula
    const brightness = ((r * 299) + (g * 587) + (b * 114)) / 1000;
    
    // Return 'black' for bright backgrounds, 'white' for dark backgrounds.
    return brightness >= 128 ? 'black' : 'white';
  }

  // Drag & Drop functions
  function allowDrop(e) {
      e.preventDefault();
  }

  function dropBlockie(e) {
      e.preventDefault();
      const data = JSON.parse(e.dataTransfer.getData("text/plain"));

      const cell = e.target;
      const duration = parseInt(data.duration, 10);
      const startHour = parseInt(cell.dataset.hour, 10);

      if (startHour + duration > 24) {
          alert("Blockie exceeds available hours!");
          return;
      }

      const blockieDiv = document.createElement("div");
      blockieDiv.classList.add("calendar-blockie");
      blockieDiv.style.backgroundColor = data.color;
      blockieDiv.style.color = getContrastingTextColor(data.color);
      blockieDiv.innerText = data.label;
      blockieDiv.style.height = `${duration * 50}px`;

      cell.appendChild(blockieDiv);
  }
});
