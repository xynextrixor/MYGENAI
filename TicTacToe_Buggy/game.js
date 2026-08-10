// Tic Tac Toe Game - INTENTIONALLY BUGGY CODE FOR CODE REVIEW

class TicTacToe {
    constructor() {
        this.board = ['', '', '', '', '', '', '', '', ''];
        this.currentPlayer = 'X';
        this.gameOver = false;
        this.cells = document.querySelectorAll('.cell');
        this.resetBtn = document.getElementById('resetBtn');
        this.statusDisplay = document.getElementById('status');
        this.playerDisplay = document.getElementById('currentPlayer');

        this.init();
    }

    init() {
        this.cells.forEach((cell, index) => {
            cell.addEventListener('click', () => this.makeMove(index));
        });
        this.resetBtn.addEventListener('click', () => this.reset());
        this.updatePlayerDisplay(); // Initialize player display
        this.statusDisplay.textContent = 'Game in Progress'; // Initialize status display
    }

    updatePlayerDisplay() {
        this.playerDisplay.textContent = this.currentPlayer;
    }

    makeMove(index) {
        // FIX #1: Check if cell is already occupied or game is over
        if (this.board[index] !== '' || this.gameOver) {
            return;
        }

        this.board[index] = this.currentPlayer;
        this.updateDisplay();

        if (this.checkWin()) {
            this.statusDisplay.textContent = `Player ${this.currentPlayer} Wins!`;
            this.gameOver = true;
            this.disableBoard();
            return;
        }

        // FIX #4: Check for a draw
        if (!this.board.includes('')) {
            this.statusDisplay.textContent = 'It's a Draw!';
            this.gameOver = true;
            this.disableBoard();
            return;
        }

        // FIX #4: Player switch logic
        this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
        this.updatePlayerDisplay();
    }

    checkWin() {
        const winningCombinations = [
            [0, 1, 2],  // First row
            [3, 4, 5],  // Second row
            [6, 7, 8],  // Third row
            [0, 3, 6],  // First column
            [1, 4, 7],  // Second column
            [2, 5, 8],  // Third column
            [0, 4, 8],  // Diagonal
            [2, 4, 6]   // Anti-diagonal
        ];

        // FIX #6: Iterate through all winning combinations
        for (let i = 0; i < winningCombinations.length; i++) {
            const [a, b, c] = winningCombinations[i];
            if (this.board[a] &&
                this.board[a] === this.board[b] &&
                this.board[a] === this.board[c]) {
                return true;
            }
        }
        return false;
    }

    updateDisplay() {
        this.cells.forEach((cell, index) => {
            cell.textContent = this.board[index];
            // FIX #7: Adding correct CSS classes
            cell.classList.remove('x', 'o'); // Remove existing classes before adding
            if (this.board[index] === 'X') {
                cell.classList.add('x');
            } else if (this.board[index] === 'O') {
                cell.classList.add('o');
            }
        });
    }

    disableBoard() {
        this.cells.forEach(cell => {
            cell.classList.add('disabled');
            cell.style.pointerEvents = 'none';
        });
    }

    reset() {
        this.board = ['', '', '', '', '', '', '', '', ''];
        this.currentPlayer = 'X';
        this.gameOver = false;
        this.statusDisplay.textContent = 'Game in Progress';
        this.updatePlayerDisplay();

        // FIX #8: Ensure all display elements are properly reset
        this.cells.forEach(cell => {
            cell.textContent = '';
            cell.classList.remove('x', 'o', 'disabled');
            cell.style.pointerEvents = 'auto';
        });
    }
}

// FIX #9: The existing DOMContentLoaded listener is correct.
document.addEventListener('DOMContentLoaded', () => {
    new TicTacToe();
});
