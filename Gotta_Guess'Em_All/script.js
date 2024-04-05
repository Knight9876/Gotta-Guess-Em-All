import pokemonList from "./pokemon.js";

let img = document.querySelector(".img-dark");
var hint = document.querySelector("#hint");
var current = document.querySelector("#current");
var best = document.querySelector("#best");
var streak = document.querySelector("#streak");
var max = document.querySelector("#max");
var time = document.querySelector("#time");
var quick = document.querySelector("#quick");
let input = document.querySelector("#pokemon-name");
var idk_btn = document.querySelector(".idk-btn");
var hint_btn = document.querySelector(".hint-btn");
var pokemonName = "";
var pokemonIndex = 1;
var currentScore = 0;
var bestScore = localStorage.getItem("bestScore") || 0;
var currentStreak = 0;
var maxStreak = 0;
var previousSeconds = 100;
var previousMilliseconds = 999;
var previousSeconds = 100;
var milliseconds = 0;
var seconds = 0;
var hintNotShown,
  btnNotPressed,
  idkPressed,
  hintPressed,
  startTime,
  endTime,
  timeScore,
  timeTaken,
  streakScore,
  score,
  TIMER;

img.draggable = false;

function getColorForGeneration(generation) {
  switch (generation) {
    case "generation-i":
      return "linear-gradient(to bottom, cyan, lime)"; // You can change the color according to your preference
    case "generation-ii":
      return "linear-gradient(to bottom, gold, #e0e0e0)";
    case "generation-iii":
      return "linear-gradient(to bottom, lime, lightgreen)";
    case "generation-iv":
      return "linear-gradient(to bottom, grey, white)";
    case "generation-v":
      return "linear-gradient(to bottom, black, white)";
    case "generation-vi":
      return "linear-gradient(to bottom, blue, red)";
    case "generation-vii":
      return "linear-gradient(to bottom, yellow, #e6e6e6)";
    case "generation-viii":
      return "linear-gradient(to bottom, cyan, #ffff80, #66ff66)";
    case "generation-ix":
      return "linear-gradient(to bottom, red, orange, yellow)";
    default:
      return "white"; // Default color
  }
}

function getPokemonGeneration(pokemonName) {
  const generation = pokemonList[pokemonName];
  return getColorForGeneration(generation);
}

async function fetchPokemonName() {
  const response = await fetch(
    `https://pokeapi.co/api/v2/pokemon/${pokemonIndex}`
  );
  const data = await response.json();
  return data.name.split("-")[0].trim();
}

async function start() {
  startTimer();
  input.focus();
  pokemonIndex = Math.floor(Math.random() * 1025) + 1; // pokemon between 1 and 890
  img.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonIndex}.png`;
  pokemonName = await fetchPokemonName();
  const color = getPokemonGeneration(pokemonName);
  document.body.style.background = color; // Set background color
  hintNotShown = true;
  btnNotPressed = true;
  idkPressed = false;
  hintPressed = false;
  milliseconds = 0;
  seconds = 0;
  hint.style.visibility = "hidden";
  best.innerText = `${bestScore}`;
  hint.innerText = `Length = ${
    pokemonName.length
  }, Starting Letter = '${pokemonName[0].toUpperCase()}'`;
}

input.addEventListener("input", function () {
  const userInput = input.value.toLowerCase(); // Get the value of the input field and convert to lowercase for comparison
  if (userInput.endsWith(pokemonName.slice(-3))) {
    currentStreak += 1;
    streak.innerText = `${currentStreak}`; // Display max streak

    currentScore += calculateScore();
    current.innerText = `${currentScore}`; // Update current score

    if (bestScore < currentScore) {
      bestScore = currentScore;
      best.innerText = `${bestScore}`;
      localStorage.setItem("bestScore", bestScore); // Update best score in localStorage
    }
    
    if (maxStreak < currentStreak) {
      maxStreak = currentStreak;
      max.innerText = `${maxStreak}`;
    }

    reset();
  } else if (
    userInput.startsWith(pokemonName.slice(0, pokemonName.length - 2))
  ) {
    currentStreak += 1;
    streak.innerText = `${currentStreak}`; // Display max streak

    currentScore += calculateScore();
    current.innerText = `${currentScore}`; // Update current score

    if (bestScore < currentScore) {
      bestScore = currentScore;
      best.innerText = `${bestScore}`;
      localStorage.setItem("bestScore", bestScore); // Update best score in localStorage
    }

    if (maxStreak < currentStreak) {
      maxStreak = currentStreak;
      max.innerText = `${maxStreak}`;
    }

    reset();
  }
});

idk_btn.addEventListener("click", function () {
  if (btnNotPressed) {
    idkPressed = true;
    currentScore -= calculateScore();
  }
  current.innerText = `${currentScore}`; // Update current score

  currentStreak = 0;
  streak.innerText = `${currentStreak}`; // Display max streak

  btnNotPressed = false;

  reset();
});

hint_btn.addEventListener("click", function () {
  if (hintNotShown) {
    hintPressed = true;
    currentScore -= calculateScore();
    current.innerText = `${currentScore}`; // Update current score
    hint.style.visibility = "visible";
    hintNotShown = false;
    input.focus();
  }
});

function reset() {
  input.readOnly = true;
  clearInterval(TIMER);
  input.value = pokemonName.charAt(0).toUpperCase() + pokemonName.slice(1);
  img.style.filter = "brightness(1)";
  input.style.backgroundColor = "lime";
  if (previousMilliseconds > milliseconds) {
    if (previousSeconds >= seconds) {
      quickReset();
    }
  } else if (previousSeconds > seconds) {
    quickReset();
  }
  setTimeout(() => {
    img.style.filter = "brightness(0)";
    input.style.backgroundColor = "white";
    input.value = "";
    hint.style.visibility = "hidden";
    input.readOnly = false;
    start(); // Call start to show new Pokemon after 2 seconds
  }, 2000);
}

function quickReset() {
  previousMilliseconds = milliseconds;
  previousSeconds = seconds;
  quick.innerText = `${
    pokemonName.charAt(0).toUpperCase() + pokemonName.slice(1)
  }\n${seconds}.${milliseconds}`;
}

function startTimer() {
  startTime = new Date().getTime(); // Get the current time in milliseconds
  TIMER = setInterval(() => {
    milliseconds += 7;
    if (milliseconds > 999) {
      seconds += 1;
      milliseconds = 0;
    }
    time.innerText = `${seconds}.${milliseconds}`;
  }, 1);
}

function calculateScore() {
  endTime = new Date().getTime(); // Get the current time in milliseconds
  timeTaken = endTime - startTime; // Calculate the time taken in milliseconds

  // Calculate the score based on time taken and streak
  timeScore = 10000 / (timeTaken + 1);
  streakScore = currentStreak * 100;

  if (idkPressed) {
    score = 0.75 * timeScore + 0.25 * streakScore; // Adjust the weights as needed
  } else if (hintPressed) {
    score = 0.75 * timeScore + 0.25 * streakScore; // Adjust the weights as needed
  } else {
    score = 0.75 * timeScore + 0.25 * streakScore; // Adjust the weights as needed
  }

  return Math.round(score); // Return the rounded score
}
start();
