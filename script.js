const hiddenNames = ["Sun", "Moon", "Star", "Cloud"];
let userGuesses = [null, null, null, null];
const squares = document.querySelectorAll('.square');
const checkButton = document.getElementById('checkBtn');
const modal = document.getElementById('nameModal');
const overlay = document.getElementById('overlay');
const input = document.getElementById('guessInput');
const accuracyText = document.getElementById('accuracyText');
const themeToggle = document.getElementById('themeToggle');
let currentId = null;
let gameEnded = false;

// Theme toggle
themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('light-theme');
  document.body.classList.toggle('dark-theme');
});

// Square interaction
squares.forEach(square => {
  square.addEventListener('click', () => {
    if (gameEnded) return;
    currentId = square.getAttribute('data-id');
    input.value = userGuesses[currentId] || '';
    modal.style.display = 'flex';
    overlay.style.display = 'block';
    input.focus();
  });
});

// Enter key submits guess
input.addEventListener('keydown', function (event) {
  if (event.key === 'Enter') {
    event.preventDefault();
    submitGuess();
  }
});

function submitGuess() {
  const guess = input.value.trim();
  if (guess && currentId !== null) {
    userGuesses[currentId] = guess;
    squares[currentId].textContent = guess;
    modal.style.display = 'none';
    overlay.style.display = 'none';
    currentId = null;
    checkIfReady();
  }
}

function checkIfReady() {
  if (userGuesses.some(g => g && g !== '')) {
    checkButton.style.display = 'inline-block';
  }
}

function checkGuesses() {
  gameEnded = true;
  document.getElementById('devButtons').style.display = 'none';
  let correctCount = 0;
  squares.forEach((square, index) => {
    const guess = userGuesses[index];
    if (!guess) return;
    if (guess.toLowerCase() === hiddenNames[index].toLowerCase()) {
      square.classList.add('correct');
      correctCount++;
    } else {
      square.classList.add('incorrect');
      square.addEventListener('mousedown', () => handleReveal(index, guess));
      square.addEventListener('mouseup', resetSquares);
      square.addEventListener('mouseleave', resetSquares);
    }
  });
  const accuracy = (correctCount / hiddenNames.length) * 100;
  accuracyText.textContent = `Accuracy: ${accuracy.toFixed(0)}%`;
  checkButton.textContent = 'Restart';
  checkButton.onclick = () => location.reload();
}

function handleReveal(index, guess) {
  squares.forEach(sq => sq.classList.add('faded'));
  const clickedSquare = squares[index];
  clickedSquare.classList.remove('faded');
  clickedSquare.classList.add('incorrect');
  const guessedIndex = hiddenNames.findIndex(name => name.toLowerCase() === guess.toLowerCase());
  if (guessedIndex !== -1 && guessedIndex !== index) {
    const correctSquare = squares[guessedIndex];
    correctSquare.classList.remove('faded');
    correctSquare.classList.add('correct');
    correctSquare.textContent = hiddenNames[guessedIndex];
  }
  clickedSquare.textContent = hiddenNames[index];
}

function resetSquares() {
  squares.forEach((square, index) => {
    square.classList.remove('faded');
    square.textContent = userGuesses[index] || '';
    if (userGuesses[index] === hiddenNames[index]) {
      square.classList.add('correct');
    }
  });
}

function showDevAnswers() {
  squares.forEach((square, index) => {
    square.textContent = hiddenNames[index];
  });
}

function hideDevAnswers() {
  squares.forEach((square, index) => {
    square.textContent = userGuesses[index] || '';
  });
}

function autoFillSquares() {
  const options = ["Sun", "Moon", "Star", "Cloud", "Sky", "Rain", "Wind", "Storm"];
  let guesses = [];

  const correctIndex = Math.floor(Math.random() * 4);
  guesses[correctIndex] = hiddenNames[correctIndex];

  let wrongPosIndex;
  do {
    wrongPosIndex = Math.floor(Math.random() * 4);
  } while (wrongPosIndex === correctIndex);

  const otherNames = hiddenNames.filter((_, i) => i !== wrongPosIndex);
  let wrongPosName = otherNames[Math.floor(Math.random() * otherNames.length)];
  if (hiddenNames[wrongPosIndex] === wrongPosName) {
    wrongPosName = otherNames.find(n => n !== hiddenNames[wrongPosIndex]);
  }
  guesses[wrongPosIndex] = wrongPosName;

  for (let i = 0; i < 4; i++) {
    if (guesses[i]) continue;
    let randName;
    do {
      randName = options[Math.floor(Math.random() * options.length)];
    } while (hiddenNames.includes(randName) || guesses.includes(randName));
    guesses[i] = randName;
  }

  guesses.forEach((name, index) => {
    userGuesses[index] = name;
    squares[index].textContent = name;
  });

  checkIfReady();
}
