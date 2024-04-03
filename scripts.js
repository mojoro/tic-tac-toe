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
    const boardWithCellValues = board.map((row) => row.map((cell) => cell.getValue()))
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

  let activePlayer = players[0];

  const switchPlayerTurn = () => {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
  };

  const getActivePlayer = () => activePlayer;

  const printNewRound = () => {
    board.printBoard();
    console.log(`${getActivePlayer().name}'s turn`);
  };

  const playRound = (row, column) => {
    console.log(`Marking row ${row}, column ${column}`);
    try {
      board.chooseTile(row, column, getActivePlayer().value);

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
    getActivePlayer
  }
}

const game = GameController();