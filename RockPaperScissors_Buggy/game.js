const choices = ["rock", "paper", "scissors"];

let playerScore = 0;
let computerScore = 0;

const playerScoreEl = document.getElementById("player-score");
const computerScoreEl = document.getElementById("computer-score");
const resultText = document.getElementById("result-message");
const buttons = document.querySelectorAll(".choice-btn"); // FIX: Changed selector from .choice-btns to .choice-btn

buttons.forEach((button) => {
    button.addEventListener("click", () => {
        playRound(button.dataset.choice);
    });
});

function playRound(playerChoice) {
    const computerChoice = choices[Math.floor(Math.random() * choices.length)];
    const result = getResult(playerChoice, computerChoice);

    if (result === "won") {
        playerScore += 1;
    } else if (result === "lose") {
        computerScore += 1;
    }

    playerScoreEl.textContent = playerScore;
    computerScoreEl.textContent = computerScore;

    let message = `You chose ${playerChoice}. Computer chose ${computerChoice}. `;
    if (result === "won") {
        message += "You win!";
    } else if (result === "lose") {
        message += "You lose!";
    } else {
        message += "It's a tie!";
    }
    resultText.textContent = message; // FIX: More descriptive result message
}

function getResult(playerChoice, computerChoice) {
    if (playerChoice === computerChoice) return "tie";

    if (
        (playerChoice === "rock" && computerChoice === "scissors") ||
        (playerChoice === "paper" && computerChoice === "rock") ||
        (playerChoice === "scissors" && computerChoice === "paper")
    ) {
        return "won";
    }

    return "lose";
}
