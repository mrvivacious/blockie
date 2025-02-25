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

function getUserData() {
  let userData = localStorage.getItem('blockies_data');
  if (userData === null || userData == undefined) {
    console.log('no user data');
  
    let blockies_data = {
      blockies: []
    };
  
    let dataToSave = JSON.stringify(blockies_data);
    localStorage.setItem('blockies_data', dataToSave); //todo try-catch?

    return blockies_data;
  }

  return userData;
}

function setUserData(dataToSave) {
  localStorage.setItem('blockies_data', dataToSave);
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
    blockie.style.color = getContrastingTextColor(blockieColor);
    blockie.draggable = true;
    blockie.dataset.duration = blockieDuration;

    // Drag event
    blockie.addEventListener("dragstart", (e) => {
        e.dataTransfer.setData("text/plain", JSON.stringify({ blockieText: blockieText, color: blockieColor, duration: blockieDuration }));
    });

    return blockie;
}

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

// Show modal
addBlockieBtn.addEventListener("click", () => {
  modal.style.display = "block";
});

// Close modal
closeModal.addEventListener("click", () => {
  modal.style.display = "none";
});