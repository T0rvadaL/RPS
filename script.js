const computerQM = document.querySelector(".computer-choice");
const image = document.querySelector("#computer-img");
const buttons = document.querySelectorAll(".player-section .btn");
const playerScoreUI = document.querySelector(".player-score");
const computerScoreUI = document.querySelector(".computer-score");
const modal = document.querySelector("dialog");
const modalHeading = document.querySelector("h2");
const closeModalButton = document.querySelector("button");

for (let button of buttons) {
  button.addEventListener("mouseup", playRPS);
}

closeModalButton.addEventListener("mouseup", reset);

function reset() {
    playerScore = 0;
    computerScore = 0;
    updateScores();
    modal.close();
}


let playerScore = 0;
let computerScore = 0
let roundStarted = false;
const firstToN = 5;

function updateScores() {
    playerScoreUI.textContent = playerScore;
    computerScoreUI.textContent = computerScore;
}

function playRPS(e) {
  if (roundStarted) {
    return;
  }
  roundStarted = true;
  document.body.classList.toggle(".disable-clicks");
  playerWeapon = e.target.id;
  computerWeapon = getRandomWeapon();
  winner = getWinner(playerWeapon, computerWeapon);
  playScene(winner, playerWeapon, computerWeapon);
}

function getRandomWeapon() {
  choices = ["rock", "paper", "scissors"];
  return choices[Math.floor(Math.random() * choices.length)];
}

function getWinner(playerWeapon, computerWeapon) {
  let winner = "";
  switch (true) {
    case playerWeapon === "rock" && computerWeapon === "scissors":
    case playerWeapon === "paper" && computerWeapon === "rock":
    case playerWeapon === "scissors" && computerWeapon === "paper":
      winner = "player";
      break;
    case playerWeapon === computerWeapon:
      winner = "tie";
      break;
    default:
      winner = "computer";
  }

  return winner;
}

function playScene(winner, playerWeapon, computerWeapon) {
  const bounceKF = [
    { transform: "translateY(0px)" },
    { transform: "translateY(-30px)" },
    { transform: "translateY(0px)" },
    { transform: "translateY(-20px)" },
    { transform: "translateY(0px)" },
    { transform: "translateY(-8px)" },
    { transform: "translateY(0px)" },
    { transform: "translateY(-7px)" },
    { transform: "translateY(0px)" },
    { transform: "translateY(-3px)" },
    { transform: "translateY(0px)" },
  ];

  const bounceOptions = {
    duration: 2500,
    easing: "cubic-bezier(.37,.32,.76,1.07)",
  };

  const spinAnimKF = [
    { transform: "scale(1)" },
    { transform: "scale(1.15) rotateY(180deg)" },
    { transform: "scale(1)" },
  ];

  const revealAnim1stHalf = computerQM.animate(spinAnimKF, {
    iterations: 0.65,
    duration: 1500,
    easing: "cubic-bezier(0.68, -0.6, 0.32, 1)",
  });

  revealAnim1stHalf.onfinish = () => {
    computerQM.classList.toggle("hidden");
    image.src = `images/RPS-${computerWeapon}.png`;
    const revealAnim2ndHalf = image.animate(spinAnimKF, {
      iterationStart: 0.65,
      iterations: 0.35,
      duration: 1500,
      easing: "cubic-bezier(0.68, -0.6, 0.32, 1)",
    });

    revealAnim2ndHalf.onfinish = () => {
      switch (winner) {
        case "tie":
          document.querySelector(`#${playerWeapon}`).animate(spinAnimKF, {
            duration: 1500,
            easing: "cubic-bezier(0.68, -0.6, 0.32, 1)",
          });

          const computerHideAnim = image.animate(spinAnimKF, {
            iterations: 0.65,
            duration: 1500,
            easing: "cubic-bezier(0.68, -0.6, 0.32, 1)",
          });

          computerHideAnim.onfinish = () => {
            image.src = "";
            computerQM.classList.toggle("hidden");
            computerQM.animate(spinAnimKF, {
              iterationStart: 0.65,
              iterations: 0.35,
              duration: 1500,
              easing: "cubic-bezier(0.68, -0.6, 0.32, 1)",
            });
            roundStarted = false;
          };
          break;
        case "player":
          const playerWinsAnim = document
            .querySelector(`#${playerWeapon}`)
            .animate(bounceKF, bounceOptions);
          playerWinsAnim.onfinish = () => {
            playerScoreUI.textContent = ++playerScore;
            endRound();
        };
        break;
        case "computer":
          const computerWinsAnim = image.animate(bounceKF, bounceOptions);
          computerWinsAnim.onfinish = () => {
            computerScoreUI.textContent = ++computerScore;
            endRound();
          };
      }
    };
  };
}

function endRound() {
  image.src = "";
  computerQM.classList.toggle("hidden");
  roundStarted = false;
  if (playerScore === firstToN || computerScore === firstToN ) {
    modalHeading.textContent = (playerScore > computerScore) ? "YOU WIN!" : "YOU LOSE";
    modal.showModal();
  }
}
