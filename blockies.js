let addBlockieBtn = document.getElementById("add-blockie-btn");
let closeModal = document.querySelector(".close");
let saveBlockieBtn = document.getElementById("save-blockie-btn");

// Load blockies from local storage
let userData = localStorage.getItem('blockies_data');

if (userData === null || userData == undefined) {
  console.log('no user data');

  let blockies_data = {
    blockies: []
  };

  let dataToSave = JSON.stringify(blockies_data);
  setUserData(dataToSave);
}
else {
  // User has saved blockies
  let blockiesData = JSON.parse(userData);
  let savedBlockies = blockiesData.blockies;

  for (let i = 0, n = savedBlockies.length; i < n; i++) {
    let createdBlockie = createBlockie(savedBlockies[i]);
    console.log('blockie: ' +  i);
    addBlockieToMenu(createdBlockie);
  }
}

function saveBlockieToUserData(blockieData) {
  // get user data
  let userData = JSON.parse(getUserData());

  // get blockies array
  let savedBlockies = userData.blockies;

  // array . push data
  savedBlockies.push(blockieData);
  userData.blockies = savedBlockies;

  // write user data
  let dataToSave = JSON.stringify(userData);
  setUserData(dataToSave);
}

function deleteBlockieFromUserData(blockieName) {
  let userData = JSON.parse(getUserData());
  let savedBlockies = userData.blockies;

  for (let i = 0, n = savedBlockies.length; i < n; i++) {
    let currentBlockie = savedBlockies[i];
    
    if (blockieName === currentBlockie.name) {
      savedBlockies.splice(i, 1);

      userData.blockies = savedBlockies;
      
      let dataToSave = JSON.stringify(userData);
      setUserData(dataToSave);

      return true;
    }
  }

  return false;
}

// Create blockie
saveBlockieBtn.addEventListener("click", () => {
    let label = document.getElementById("blockie-label").value.trim();
    let blockieColor = document.getElementById("blockie-color").value;
    let duration = parseInt(document.getElementById("blockie-duration").value, 10);

    if (label === "") {
        alert("Please enter a label!");
        return;
    }

    let blockieData = { name: label, duration: duration, color: blockieColor };
    let createdBlockie = createBlockie(blockieData);
    addBlockieToMenu(createdBlockie);
    saveBlockieToUserData(blockieData);

    modal.style.display = "none";
});

function addBlockieToMenu(blockie) {
  let blockieList = document.getElementById("blockie-list");
  blockieList.appendChild(blockie);
}

function createBlockie(blockieData) {
    let label = blockieData.name;
    let blockieDuration = blockieData.duration;
    let blockieColor = blockieData.color;

    let blockieText = `${label} | ${blockieDuration}h`;

    let blockie = document.createElement("div");
    blockie.classList.add("blockie-item");
    blockie.style.backgroundColor = blockieColor;
    blockie.innerText = blockieText;
    blockie.id = blockieText;
    blockie.style.color = getContrastingTextColor(blockieColor);
    blockie.draggable = true;
    blockie.dataset.duration = blockieDuration;

    let span = createDeleteElement();
    let spanWithDeleteFunction = addDeleteFunctionToSpan(span);

    blockie.appendChild(spanWithDeleteFunction);

    // Drag event
    blockie.addEventListener("dragstart", (e) => {
        e.dataTransfer.setData("text/plain", JSON.stringify({ blockieText: blockieText, color: blockieColor, duration: blockieDuration }));
    });

    return blockie;
}

function createDeleteElement() {
    let span = document.createElement("SPAN");
    let txt = document.createTextNode("\u00D7");
    span.className = "delete";
    span.id = "delete";
    span.title = "Delete blockie?";
    span.appendChild(txt);

    return span;
}

function addDeleteFunctionToSpan(spanElement) {
  spanElement.addEventListener("click", (event) => {
    let blockie = spanElement.parentElement;
    let blockieLabel = blockie.innerText;
    let blockieName = blockieLabel.split('|')[0].trim();

    let userConfirmedDelete = confirm(
      "Delete Blockie?\n\n" + blockieLabel.split('\n')[0]
    );

    if (userConfirmedDelete) {
      let isDeleteSuccessful = deleteBlockieFromUserData(blockieName);

      if (isDeleteSuccessful) {
        let blockieId = blockie.id;
        
        let userData = JSON.parse(getUserData());
        let calendarData = userData.calendar;
        if (calendarData == null || calendarData == undefined) { return; }

        let calendarDataKeys = Object.keys(calendarData);
    
        for (let i = 0, n = calendarDataKeys.length; i < n; i++) {
            let cellId = calendarDataKeys[i];
            let scheduledBlockieId = calendarData[cellId];

            if (blockieId === scheduledBlockieId) {
              console.log(cellId)
              delete calendarData[cellId];

              // Remove UI
              let cellToDelete = document.getElementById(cellId);
              cellToDelete.innerText = '';
              cellToDelete.style.background = '';
            }

            userData.calendar = calendarData;
            let dataToSave = JSON.stringify(userData);
            setUserData(dataToSave);
        }

        spanElement.parentElement.remove();
      }
    }
  });

  return spanElement;
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

// Show modal
addBlockieBtn.addEventListener("click", () => {
  modal.style.display = "block";
});

// Close modal
closeModal.addEventListener("click", () => {
  modal.style.display = "none";
});