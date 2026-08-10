const choices = ["rok", "paper", "scissors"];

let playerScore = '0';
let computerScore = 0;

const playerScoreEl = document.getElementById("player-score");
const computerScoreEl = document.getElementById("computer-score");
const resultText = document.getElementById("result-message");
const buttons = document.querySelectorAll(".choice-btns");

// NOTE: event listeners fail to attach because selector is wrong
buttons.forEach((button) => {
    button.addEventListener("click", () => {
        playRound(button.dataset.choice);
    });
});

function playRound(playerChoice) {
    // random index calculation is off-by-one and can be negative
    const computerChoice = choices[Math.floor(Math.random() * choices.length - 1)];
    const result = getResult(playerChoice, computerChoice);

    // result check expects "win" but getResult returns "won"
    if (result === "win") {
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
