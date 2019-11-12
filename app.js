const board = {
  element: document.getElementById('board'),
  size: 3,
  squares: [],
  deadSquares: [],
};
const textNodeX = document.createTextNode('X');
const textNodeO = document.createTextNode('O');
const resultsEl = document.getElementById('results');

window.onload = () => {
  createBoard(3);
  return;
};

function createBoard(size) {
  // Clear and re-initialize the board/screen
  while (board.element.firstChild) {
    board.element.removeChild(board.element.firstChild);
  }
  resultsEl.textContent = "Winner:";
  resultsEl.style.visibility = 'hidden';
  board.size = size;
  board.squares = [];
  board.deadSquares = [];

  // Adjust CSS grid
  board.element.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
  board.element.style.gridTemplateRows = `repeat(${size}, 1fr)`;

  // Create the board/screen (left-to-right, top-to-right)
  for (let i=0; i<size; i++) {
    board.squares.push([]);
    for (let j=0; j<size; j++) {
      const square = document.createElement('div');
      square.setAttribute('id', `${i}-${j}`);
      board.element.appendChild(square);
      board.squares[i].push(square);
    }
  }

  return;
}

board.element.addEventListener('click', (evt) => {
  const [squareX, squareY] = evt.target.id.split('-');
  console.log(`Human played [${squareX},${squareY}]`);

  const square = board.squares[squareX][squareY];
  if (!board.deadSquares.includes(square)) {
    square.appendChild(textNodeX.cloneNode());
    board.deadSquares.push(square);

    const gameOver = checkForWinner();
    if (!gameOver) {
      computerTurn();
      checkForWinner();
    }
  }

  return;
}, false);

function computerTurn() {
  squareX = Math.floor(Math.random() * board.size);
  squareY = Math.floor(Math.random() * board.size);
  console.log(`Computer played [${squareX},${squareY}]`);

  const square = board.squares[squareX][squareY];
  if (!board.deadSquares.includes(square)) {
    square.appendChild(textNodeO.cloneNode());
    board.deadSquares.push(square);
  } else {
    computerTurn();
  }

  return;
}

function checkForWinner() {
  let result = null;

  // TODO: Scale to n-square grid ??
  for (let i=0; i<board.size; i++) {
    const row = board.squares[i][0].textContent + board.squares[i][1].textContent + board.squares[i][2].textContent;
    if (row == 'XXX') { result = ' HUMAN!'; }
    if (row == 'OOO') { result = ' COMPUTER!'; }
  }
  for (let j=0; j<board.size; j++) {
    const col = board.squares[0][j].textContent + board.squares[1][j].textContent + board.squares[2][j].textContent;
    if (col == 'XXX') { result = ' HUMAN!'; }
    if (col == 'OOO') { result = ' COMPUTER!'; }
  }
  const diag1 = board.squares[0][0].textContent + board.squares[1][1].textContent + board.squares[2][2].textContent;
  const diag2 = board.squares[0][2].textContent + board.squares[1][1].textContent + board.squares[2][0].textContent;
  if (diag1 == 'XXX' || diag2 == 'XXX') { result = ' HUMAN!'; }
  if (diag1 == 'OOO' || diag2 == 'OOO') { result = ' COMPUTER!'; }

  if (result) {
    resultsEl.textContent += result;
    resultsEl.style.visibility = 'visible';
    return true;
  } else if (board.deadSquares.length >= (board.size * board.size)) {
    resultsEl.textContent += " TIE!";
    resultsEl.style.visibility = 'visible';
    return true;
  }

  return false;
}

document.querySelector('#board-parameters > button').addEventListener('click', (evt)=>{
  const size = document.querySelector('#board-parameters > input').value;
  createBoard(size);

  return;
}, false);

