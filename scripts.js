function Gameboard() {
  const rows = 3;
  const columns = 3;
  const board = [];

  for(let i = 0; i < rows; i++){
    board[i] = [];
    for(let j = 0; j < columns; j++){
      board[i].push(Cell());
    }
  }

  const getBoard = () => board;

  const chooseTile = (row, column, player) => {
    if(board[row][column].getValue() != 0) throw new Error();

    board[row][column].markTile(player);
  };

  const printBoard = () => {
    const boardWithCellValues = board.map((row) => row.map((cell) => cell.getValue()));
    console.log(boardWithCellValues);
  };

  return {
    getBoard,
    chooseTile,
    printBoard
  }
}

function Cell() {
  let value = 0;
  const markTile = (player) => {
    value = player;
  };

  const getValue = () => value;

  return {
    markTile,
    getValue
  }
}

function GameController(playerOneName = "player one", playerTwoName = "player two") {
  const board = Gameboard();

  const players = [
    {
      name: playerOneName,
      value: 1,
    },
    {
      name: playerTwoName,
      value: 2,
    }
  ];

  const assignPlayerNames = (name1, name2) => {
    players[0].name = name1;
    players[1].name = name2;
  }

  let activePlayer = players[0];

  const switchPlayerTurn = () => {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
  };

  const getActivePlayer = () => activePlayer;

  const printNewRound = () => {
    board.printBoard();
    console.log(`${getActivePlayer().name}'s turn`);
  };

  const checkWin = () => {
    const boardArray = board.getBoard().map((row) => row.map((cell) => cell.getValue()));

    const rowCheck = () => {
      let consecutiveCount = 0;
      for(let i = 0; i < boardArray.length; i++){
        if (consecutiveCount === boardArray.length) return true;
        for(let j = 0; j < boardArray.length; j++){
          if(boardArray[i][j] === getActivePlayer().value) consecutiveCount++;
          else {
            consecutiveCount = 0;
            break;
          }
        }
      }
    }

    const columnCheck = () => {
      let consecutiveCount = 0;
      for(let i = 0; i < boardArray.length; i++){
        if (consecutiveCount === boardArray.length) return true;
        for(let j = 0; j < boardArray[i].length; j++){
          if(boardArray[j][i] === getActivePlayer().value) consecutiveCount++;
          else {
            consecutiveCount = 0;
            break;
          }
        }
      }
    }

    const diagonalCheck = () => {
      let consecutiveCount = 0;
      for(let i = 0; i < boardArray.length; i++){
        if(boardArray[i][i] === getActivePlayer().value) consecutiveCount++;
        else {
          consecutiveCount = 0;
          break;
        }
      }
      if (consecutiveCount === boardArray.length) return true;

      let j = boardArray.length - 1;
      for(let i = 0; i < boardArray.length; i++){
        if(boardArray[i][j--] === getActivePlayer().value) consecutiveCount++;
        else {
          consecutiveCount = 0;
          break;
        }
      }
      if (consecutiveCount === boardArray.length) return true;
    }

    const rowWin = rowCheck();
    const columnWin = columnCheck();
    const diagonalWin = diagonalCheck();

    if (rowWin || columnWin || diagonalWin) return true
  }
  

  const playRound = (row, column) => {
    console.log(`Marking row ${row}, column ${column}`);
    try {
      board.chooseTile(row, column, getActivePlayer().value);

      if (checkWin()) {
        console.log(`${getActivePlayer().name} has won!`);
        console.log(board.getBoard().map((row) => row.map((cell) => cell.getValue())));
        return true;
      }
      switchPlayerTurn();
      printNewRound();
    }
    catch {
      console.log(`Tile already marked. Please choose a different tile.`);
    }
  };

  printNewRound();

  return {
    playRound, 
    getActivePlayer,
    getBoard: board.getBoard,
    assignPlayerNames
  }
}

function ScreenController() {
  const game = GameController();
  const playerOneInput = document.getElementById('player-one');
  const playerTwoInput = document.getElementById('player-two');
  const nameEntryButton = document.querySelector('.name-entry');
  const resetButton = document.querySelector('.reset');
  const gameDiv = document.querySelector('.game');
  const playerTurn = document.querySelector('.player-turn');

  const assignNames = () => {
    const name1 = playerOneInput.value;
    const name2 = playerTwoInput.value;

    game.assignPlayerNames(name1, name2)

    playerOneInput.value = '';
    playerTwoInput.value = '';
  }

  nameEntryButton.addEventListener("click", assignNames);

  const resetGame = () => {
    gameDiv.textContent = '';
    gameDiv.removeEventListener("click", gameClickHandler);
    playerTurn.innerHTML = '';
    playerOneInput.value = '';
    playerTwoInput.value = '';
    ScreenController();
  }

  resetButton.addEventListener("click", resetGame);

  const updateScreen = () => {
    gameDiv.textContent = '';
    
    const board = game.getBoard();
    const activePlayer = game.getActivePlayer().name;

    board.forEach((row, rowNum) => {
      row.forEach((cell, colNum) => {
        const cellButton = document.createElement('button');
        cellButton.classList = 'tile';

        cellButton.dataset.row = rowNum;
        cellButton.dataset.col = colNum;
        switch(cell.getValue()){
          case 0:
            cellButton.textContent = '';
            break;
          case 1:
            cellButton.textContent = 'X'
            break;
          case 2:
            cellButton.textContent = 'O'
        }
        cellButton.textContent

        gameDiv.appendChild(cellButton);
      });
    });
  }

  function gameClickHandler(e) {
    const selectedRow = e.target.dataset.row;
    const selectedColumn = e.target.dataset.col;
    if (!selectedRow && !selectedColumn) return;

    if (game.playRound(selectedRow, selectedColumn)) {
      gameDiv.removeEventListener("click", gameClickHandler);
      playerTurn.innerHTML = `${game.getActivePlayer().name} has won!`;
    } else {
      playerTurn.innerHTML = `${game.getActivePlayer().name}'s turn`;
    }
    updateScreen();
  }

  gameDiv.addEventListener("click", gameClickHandler)

  updateScreen();
}

ScreenController();