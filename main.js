let players = function (name, sign, played) {
  return { name, sign, played };
};

// intialize player1 and player2
let player1;
let player2;
let isAlreadyWinner = false;
let gameRestart = false;

let initial = (() => {
  let hideAndDisplay = () => {
    document.querySelector(".container").style.display = "block";
    document.querySelector(".initial").style.display = "none";
    document.querySelector(".winnerDiv").style.display = "flex";
    document.querySelector(".winner").style.display = "none";
  };

  let logPlayers = (e) => {
    e.preventDefault();
    let playerX = document.querySelector("#player1").value;
    let playerO = document.querySelector("#player2").value;
    player1 = players(playerX, "X", false);
    player2 = players(playerO, "O", false);
    hideAndDisplay();
  };
  return { logPlayers };
})();

let form = document.querySelector(".initial");
form.addEventListener("submit", initial.logPlayers, false);

let whichPlayer = (function () {
  let whichOne = (player1, player2) => {
    if (
      (player1.played == false && player2.played == false) ||
      gameRestart == true
    ) {
      player1.played = true;
      player2.played = false;
      gameRestart = false;
      return player1;
    }
    if (player2.played == false && player1.played == true) {
      player1.played = false;
      player2.played = true;
      return player2;
    }
    if (player1.played == false && player2.played == true) {
      player1.played = true;
      player2.played = false;
      return player1;
    }
  };
  return { whichOne };
})();

let whoWon = (function () {
  let disableInputs = () => {
    player1.sign = "";
    player2.sign = "";
  };

  let winnerOfGame = (player) => {
    let winner = document.querySelector(".winner");
    disableInputs();
    winner.innerHTML = `Congratulation, winner is <span>${player.name}</span>!!!`;
    winner.style.display = "block";
    isAlreadyWinner = true;
  };

  let draw = () => {
    let winner = document.querySelector(".winner");
    winner.textContent = "It's a Draw!";
    winner.style.display = "block";
    disableInputs();
  };
  return { winnerOfGame, draw };
})();

let game = (function () {
  let displayWhosMove = (player) => {
    let whosMove = document.querySelector(".whosMove");
    player.sign == "X"
      ? (whosMove.textContent = "O")
      : (whosMove.textContent = "X");
  };

  let playRound = (index) => {
    let square = document.querySelector(`.fields[data-field='${index}']`);
    if (square.textContent == "") {
      let player = whichPlayer.whichOne(player1, player2);
      square.textContent = player.sign;
      let winner = checkForWinner.winner();
      if (isAlreadyWinner) {
        return;
      }
      if (typeof winner == "object") {
        whoWon.winnerOfGame(winner);
      } else if (winner == "draw") {
        whoWon.draw();
      } else {
        displayWhosMove(player);
      }
    }
  };
  return { playRound };
})();

let gameBoard = (() => {
  let fieldsContainer = document.querySelector(".fieldsContainer");
  document.querySelector(".whosMove").innerHTML = "X";

  let playAgain = () => {
    rows = document.querySelectorAll(".row");
    rows.forEach((row) => {
      fieldsContainer.removeChild(row);
    });
  };

  let arr = [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
  ];

  function addToDom(e) {
    game.playRound(e.target.dataset.field);
  }

  let initFunction = () => {
    let dataField = 0;
    for (i = 0; i < arr.length; i++) {
      let row = document.createElement("div");
      row.className = "row";
      fieldsContainer.appendChild(row);
      for (j = 0; j < arr.length; j++) {
        let fields = document.createElement("div");
        fields.className = "fields";
        fields.setAttribute("data-field", dataField++);
        row.appendChild(fields);
      }
    }
    let fields = document.querySelectorAll(".fields");
    fields.forEach((field) => {
      field.addEventListener("click", addToDom);
    });
  };

  return { initFunction, playAgain };
})();

gameBoard.initFunction();

let checkForWinner = (function () {
  let countX = 0;
  let countY = 0;
  let winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  let changeColorForWinner = (arr) => {
    for (el in arr) {
      document.querySelector(
        `.fields[data-field='${arr[el]}'`
      ).style.backgroundColor = "green";
    }
  };
  let numberOfChecks = 0;

  let resetNumOfChecks = () => {
    numberOfChecks = 0;
  };
  let isWinner = () => {
    numberOfChecks++;
    if (numberOfChecks >= 9) {
      numberOfChecks = 0;
      return "draw";
    }
    let squares = document.querySelectorAll(".fields");
    for (let arr of winningConditions) {
      countX = 0;
      countY = 0;
      for (let element of arr) {
        if (squares[element].textContent == "X") {
          countX++;
          if (countX == 3) {
            changeColorForWinner(arr);
            return player1;
          }
        }
        if (squares[element].textContent == "O") {
          countY++;
          if (countY == 3) {
            changeColorForWinner(arr);
            return player2;
          }
        }
      }
    }
  };

  let winner = () => {
    let player = isWinner();
    if (player) {
      return player;
    }
  };

  return { winner, resetNumOfChecks };
})();

let restartButton = document.querySelector(".restart");
restartButton.addEventListener("click", function () {
  player1.sign = "X";
  player2.sign = "O";
  gameRestart = true;
  checkForWinner.resetNumOfChecks();
  gameBoard.playAgain();
  gameBoard.initFunction();
  let winner = document.querySelector(".winner");
  winner.style.display = "none";
  document.querySelector(".whosMove").textContent = "X";
  isAlreadyWinner = false;
});
