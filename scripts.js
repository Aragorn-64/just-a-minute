let globalClockRunning = false;
let globalSeconds = 0;
let globalInterval;
let activePlayerTimer = null;
let playerTimers = {};

function createGrid() {
  document.getElementById("clock").classList.remove("d-none");
  const numPlayers = document.getElementById("numPlayers").value;
  const setupForm = document.getElementById("setupForm");
  const playerGrid = document.getElementById("playerGrid");

  if (numPlayers > 0) {
    setupForm.classList.add("d-none");
    playerGrid.classList.remove("d-none");
    createPlayerButtons(numPlayers);
  } else {
    alert("Please enter a valid number of players");
  }
}

function startGlobalClock() {
  const minutesSpan = document.getElementById("minutes");
  const secondsSpan = document.getElementById("seconds");
  const maxSeconds = 60; // 1 minute

  globalInterval = setInterval(() => {
    globalSeconds++;
    const minutes = Math.floor(globalSeconds / 60);
    const seconds = globalSeconds % 60;

    minutesSpan.textContent = String(minutes).padStart(2, "0");
    secondsSpan.textContent = String(seconds).padStart(2, "0");

    if (globalSeconds >= maxSeconds) {
      clearInterval(globalInterval);
      stopActivePlayerTimer();
    }
  }, 1000);
}

function createPlayerButtons(numPlayers) {
  const playerGrid = document.getElementById("playerGrid");
  playerGrid.innerHTML = ""; // Clear any existing buttons

  const cols = 3; // Number of columns in the grid

  for (let i = 1; i <= numPlayers; i++) {
    const colDiv = document.createElement("div");
    colDiv.className = `col-${12 / cols} player-button`;

    const button = document.createElement("button");
    button.className = "btn btn-secondary";
    button.textContent = `Player ${i}`;
    button.setAttribute("data-player", i);
    button.addEventListener("click", () => handlePlayerClick(i));

    const timeSpan = document.createElement("span");
    timeSpan.className = "player-time";
    timeSpan.id = `player-time-${i}`;
    timeSpan.textContent = "0s";

    colDiv.appendChild(button);
    colDiv.appendChild(timeSpan);
    playerGrid.appendChild(colDiv);
  }
}

function handlePlayerClick(playerId) {
  if (!globalClockRunning) {
    startGlobalClock();
    globalClockRunning = true;
  }

  if (activePlayerTimer !== null && activePlayerTimer !== playerId) {
    pausePlayerTimer(activePlayerTimer);
  }

  if (!playerTimers[playerId]) {
    playerTimers[playerId] = { time: 0, interval: null };
  }

  startPlayerTimer(playerId);
}

function startPlayerTimer(playerId) {
  const player = playerTimers[playerId];
  activePlayerTimer = playerId;

  player.interval = setInterval(() => {
    player.time++;
    document.getElementById(
      `player-time-${playerId}`
    ).textContent = `${player.time}s`;
  }, 1000);
}

function pausePlayerTimer(playerId) {
  clearInterval(playerTimers[playerId].interval);
}

function stopActivePlayerTimer() {
  if (activePlayerTimer !== null) {
    clearInterval(playerTimers[activePlayerTimer].interval);
    activePlayerTimer = null;
  }
}
