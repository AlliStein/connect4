/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

const WIDTH = 7;
const HEIGHT = 6;

let currPlayer = 1; // active player: 1 or 2    after player clicks, currPlayer should switch to 2. And the after click, back to 1 etc
let board = []; // array of rows, each row is array of cells  (board[y][x])

// /** makeBoard: create in-JS board structure:
//  *    board = array of rows, each row is array of cells  (board[y][x])
//  * 
function makeBoard() {
  for (let y = 0; y < HEIGHT; y++) {
    board[y] = [];
    for (let x = 0; x < WIDTH; x++) {
      board[y][x] = null;
    }
  }
}

/** makeHtmlBoard: make HTML table and row of column tops. */
function makeHtmlBoard() {

  const htmlBoard = document.getElementById("board");

  // creating a table row at the top of our table where the user will click to assign they column choice
  const top = document.createElement("tr");
  top.setAttribute("id", "column-top");
  top.addEventListener("click", handleClick);

  // building for the width of the table, since it is one row we do not need a loop for y
  for (let x = 0; x < WIDTH; x++) {
    const headCell = document.createElement("td");
    headCell.setAttribute("id", x);
    top.append(headCell);
  }
  htmlBoard.append(top);

    // building the board structure
    // 6 rows high (as long as y is less then the declared length of HEIGHT, keep looping/building)
  for (let y = 0; y < HEIGHT; y++) {
    const row = document.createElement("tr");

    // 7 columns wide (as long as x is less then the declared length of WIDTH, keep looping/building)
    for (let x = 0; x < WIDTH; x++) {
      const cell = document.createElement("td");
      cell.setAttribute("id", `${y}-${x}`);
      row.append(cell);
    }
    htmlBoard.append(row);
  }
}

/** findSpotForCol: given column x, return top empty y (null if filled) */
function findSpotForCol(x) {
  // return the y coordinate of the lowest available cell in column x
  for (let y = HEIGHT - 1; y >= 0; y --) {
    if (board[y][x] === null) {
      return y;
    }
  }
  // if no cells are available return null
  return null;
}

/** placeInTable: update DOM to place piece into HTML table of board */
function placeInTable(y, x) {
  const pieceDiv = document.createElement("div");
  pieceDiv.classList.add("piece");
  pieceDiv.classList.add(`p${currPlayer}`);
  
  const placement = document.getElementById(`${y}-${x}`);
  placement.append(pieceDiv);
}

/** endGame: announce game end */
function endGame(msg) {
  alert(msg);
}

/** handleClick: handle click of column top to play piece */
function handleClick(evt) {
  // get x from ID of clicked cell
  const x = +evt.target.id;

  // get next spot in column (if none, ignore click)
  const y = findSpotForCol(x);
  if (y === null) {
    return;
  }

  // place piece in board and add to HTML table
  board[y][x] = currPlayer;
  placeInTable(y, x);

  // check for win
  if (checkForWin(x,y)) {
    return endGame(`Player ${currPlayer} wins!\nRefresh to play again`);
  }

  // check for tie
  if (board.every(row => row.every(cell => cell))) {
    return endGame(`It's a tie!\nRefresh to play again`);
  }

  // switch players
  if (currPlayer === 1) {
    currPlayer = 2;
  } else if (currPlayer === 2) {
    currPlayer = 1;
  }
}


/** checkForWin: check board cell-by-cell for "does a win start here?" */
function checkForWin() {
  function _win(cells) {
    // Check four cells to see if they're all color of current player
    //  - cells: list of four (y, x) cells
    //  - returns true if all are legal coordinates & all match currPlayer

    return cells.every(
      ([y, x]) =>
        y >= 0 &&
        y < HEIGHT &&
        x >= 0 &&
        x < WIDTH &&
        board[y][x] === currPlayer
    );
  }


  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
      const horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
      const vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
      const diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
      const diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];

      if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
        return true;
      }
    }
  }
}

makeBoard();
makeHtmlBoard();
