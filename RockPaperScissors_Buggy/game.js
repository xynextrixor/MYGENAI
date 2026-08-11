const choices = ["rock", "paper", "scissors"];

let playerScore = 0;
let computerScore = 0;

const playerScoreEl = document.getElementById("player-score");
const computerScoreEl = document.getElementById("computer-score");
const resultText = document.getElementById("result-message");
const buttons = document.querySelectorAll(".choice-btns");

// NOTE: event listeners fail to attach because selector is wrong - this comment is inaccurate, the selector is correct. Issue is likely with HTML structure.
buttons.forEach((button) => {
    button.addEventListener("click", () => {
        playRound(button.dataset.choice);
    });
});

function playRound(playerChoice) {
    // random index calculation fixed to be within bounds
    const computerChoice = choices[Math.floor(Math.random() * choices.length)];
    const result = getResult(playerChoice, computerChoice);

    // result check now expects "won" as returned by getResult
    if (result === "won") {
        playerScore += 1;
    } else if (result === "lose") {
        computerScore += 1;
    }

    playerScoreEl.textContent = playerScore;
    computerScoreEl.textContent = computerScore;
    resultText.textContent = `You chose ${playerChoice}. Computer chose ${computerChoice}. ${result}`;
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
