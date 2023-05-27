// Array to store code pairs
let mfaPairs = [];

// Function to generate a random 6-digit code
function generateCode() {
  return Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
}

// Function to add a new name-code pair
function addMFA(event) {
  event.preventDefault();
  const nameInput = document.getElementById('name');

  const name = nameInput.value;
  const code = generateCode();

  mfaPairs.push({ name, code });

  nameInput.value = '';

  updateMFAList();
  saveMFAData();
}

// Function to delete an existing name-code pair
function deleteMFA(index) {
  mfaPairs.splice(index, 1);
  updateMFAList();
  saveMFAData();
}

// Function to update the name-code pairs list
function updateMFAList() {
  const mfaList = document.getElementById('mfaList');
  mfaList.innerHTML = '';

  mfaPairs.forEach((pair, index) => {
    const listItem = document.createElement('li');
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'X';
    deleteButton.classList.add('delete');
    deleteButton.addEventListener('click', () => deleteMFA(index));

    const nameSpan = document.createElement('span');
    nameSpan.textContent = pair.name + ': ';

    const codeSpan = document.createElement('span');
    codeSpan.textContent = pair.code;

    listItem.appendChild(nameSpan);
    listItem.appendChild(codeSpan);
    listItem.appendChild(deleteButton);

    mfaList.appendChild(listItem);
  });
}

// Function to save data in localStorage
function saveMFAData() {
  localStorage.setItem('mfaPairs', JSON.stringify(mfaPairs));
}

// Function to load data from localStorage
function loadMFAData() {
  const savedData = localStorage.getItem('mfaPairs');
  if (savedData) {
    mfaPairs = JSON.parse(savedData);
    updateMFAList();
  }
}

// Function to regenerate odes every 15 seconds
function regenerateCodes() {
  setInterval(() => {
    mfaPairs.forEach(pair => {
      pair.code = generateCode();
    });

    updateMFAList();
    saveMFAData();
  }, 15000);
}

// Function to update the timer button with the remaining time
function updateTimerButton(remainingTime) {
  const timerButton = document.getElementById('timerButton');
  const minutes = Math.floor(remainingTime / 60);
  const seconds = remainingTime % 60;
  timerButton.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

// Function to start the timer and update the timer button
function startTimer() {
  let remainingTime = 15;
  updateTimerButton(remainingTime);

  const timer = setInterval(() => {
    remainingTime--;
    updateTimerButton(remainingTime);

    if (remainingTime <= 0) {
      clearInterval(timer);
      regenerateCodes();
      startTimer();
    }
  }, 1000);
}

// Add submit event listener to the add form
const addForm = document.getElementById('addForm');
addForm.addEventListener('submit', addMFA);

// Start the timer on page load
startTimer();

// Load data from localStorage on page load
loadMFAData();