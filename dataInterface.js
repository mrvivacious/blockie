function getUserData() {
  let userData = localStorage.getItem('blockies_data');
  if (userData === null || userData == undefined) {
    console.log('no user data');
  
    let blockies_data = {
      blockies: [],
      calendar: {}
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