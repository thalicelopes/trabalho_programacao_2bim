let currentPlayer = 1;
let player1Name = '';
let player2Name = '';
let mainBoard = ['', '', '', '', '', '', '', '', ''];

document.getElementById('start-button').addEventListener('click', startGame);

function startGame() {
    player1Name = document.getElementById('player1').value;
    player2Name = document.getElementById('player2').value;

    createBoard();
}

function playTurn(mainIndex, miniIndex) {
    const miniBoardIndex = mainIndex * 3 + miniIndex;
    const miniBoard = document.getElementsByClassName('mini-board')[miniBoardIndex];
    const miniFields = miniBoard.getElementsByClassName('mini-field');
    const currentPlayerSymbol = currentPlayer === 1 ? 'X' : 'O';

    if (miniFields[miniIndex].textContent === '') {
        miniFields[miniIndex].textContent = currentPlayerSymbol;
        mainBoard[miniBoardIndex] = currentPlayerSymbol;

        if (checkMiniBoardWin(mainBoard[miniBoardIndex])) {
            miniBoard.classList.add('winner');
        }

        if (checkMainBoardWin()) {
            announceWinner();
        }

        currentPlayer = currentPlayer === 1 ? 2 : 1;
    }
}

function checkMiniBoardWin(board) {
    const winningCombinations = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    for (let combination of winningCombinations) {
        const [a, b, c] = combination;

        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return true;
        }
    }

    return false;
}

function checkMainBoardWin() {
    return checkMiniBoardWin(mainBoard);
}

function announceWinner() {
    const resultContainer = document.getElementById('result');
    const winner = currentPlayer === 1 ? player1Name : player2Name;

    resultContainer.textContent = `Parabéns, ${winner}! Você venceu o jogo!`;
}

function createBoard() {
    const boardContainer = document.getElementById('board');

    for (let i = 0; i < 9; i++) {
        const miniBoard = document.createElement('div');
        miniBoard.classList.add('mini-board');

        for (let j = 0; j < 9; j++) {
            const miniField = document.createElement('div');
            miniField.classList.add('mini-field');
            miniField.addEventListener('click', () => playTurn(i, j));
            miniBoard.appendChild(miniField);
        }

        boardContainer.appendChild(miniBoard);
    }
}
