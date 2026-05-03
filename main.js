const player = document.querySelector(".player");
const gameArea = document.querySelector(".game-area");
const lifeHearts = document.querySelectorAll(".life-heart");

let position = 50;
let direction = null;
let moveInterval = null;

let gameTime = 50;
let lives = 3;

let gameTimer = null;
let heartSpawner = null;

let gameOver = false;

function startGame() {
    gameOver = false;

    document.querySelector(".home").classList.add("hidden");
    document.querySelector(".game").classList.remove("hidden");

    startCountdown();
}

function startCountdown() {
    const countdown = document.querySelector(".countdown");

    let number = 3;

    countdown.classList.remove("hidden");
    countdown.textContent = number;

    const timer = setInterval(() => {
        number--;

        if (number > 0) {
            countdown.textContent = number;
            return;
        }

        clearInterval(timer);

        countdown.textContent = "Vai!";

        setTimeout(() => {
            startGameLoop();

        }, 700);
    }, 1000);
}

function startGameLoop() {
    document.querySelector(".countdown").textContent = gameTime;

    heartSpawner = setInterval(spawnHeart, 1000);

    gameTimer = setInterval(() => {
        gameTime--;

        document.querySelector(".countdown").textContent = gameTime;

        if (gameTime <= 0) {
            endGame("Eu sabia que você ia conseguir, meu amorzinho!! \nAgora, aproveite a chuva de corações <3");
        }
    }, 1000);
}

function spawnHeart() {
    if (gameOver) return;

    const heart = document.createElement("img");

    heart.src = "img/red-heart-pixel.png";
    heart.classList.add("heart");

    const minX = gameArea.clientWidth * 0.15;
    const maxX = gameArea.clientWidth * 0.85;

    const randomX = Math.random() * (maxX - minX) + minX;

    heart.style.left = randomX + "px";
    
    gameArea.appendChild(heart);

    let topPosition = -40;

    const fall = setInterval(() => {
        if (gameOver) {
            clearInterval(fall);
            heart.remove();
            return;
        }

        topPosition += 3;
        heart.style.top = topPosition + "px";

        const playerRect = player.getBoundingClientRect();
        const heartRect = heart.getBoundingClientRect();

        const collided =
            heartRect.left < playerRect.right &&
            heartRect.right > playerRect.left &&
            heartRect.top < playerRect.bottom &&
            heartRect.bottom > playerRect.top;
        
        if (collided) {
            clearInterval(fall);
            heart.remove();
            return
        }
        
        if (topPosition > gameArea.clientHeight) {
            clearInterval(fall);
            heart.remove();

            loseLife();
        }
    }, 16);
}

function loseLife() {
    lives--;

    const lifeHearts = document.querySelectorAll(".life-heart");

    if (lives >= 0 && lifeHearts[lives]) {
        lifeHearts[lives].style.visibility = "hidden";
    }

    if (lives <= 0) {
        endGame("NÃOOOO!! Não foi dessa vez, meu amorzinho rsrs. \nTente novamente atualizando a página :D")
    }
}

function endGame(message) {
    if (gameOver) return;

    gameOver = true;

    clearInterval(gameTimer);
    clearInterval(heartSpawner);

    if (gameTime <= 0) {
        document.querySelector(".lives").classList.add("hidden");
        document.querySelector(".countdown").classList.add("hidden");
        
        alert(message);

        setTimeout(() => {
            startHeartRain();

        }, 1000);

        return;
    }

    alert(message);
}

function spawnCelebrationHeart() {
    const heart = document.createElement("img");

    heart.src = "img/red-heart-pixel.png";
    heart.classList.add("heart");

    const randomX = Math.random() * (gameArea.clientWidth - 24);

    heart.style.left = randomX + "px";
    
    gameArea.appendChild(heart);

    let topPosition = -40;
    const speed = 4 + Math.random() * 4;

    const fall = setInterval(() => {
        topPosition += speed;
        heart.style.top = topPosition + "px";

        if (topPosition > gameArea.clientHeight) {
            clearInterval(fall);
            heart.remove();
        }
    }, 16);
}

function showMessage(text) {
    const message = document.querySelector(".message");

    message.textContent = text;

    message.classList.remove("hidden");

    message.style.animation = "none";
    message.offsetHeight;

    message.style.animation =
        "slide-message 4s linear infinite, blink-message 0.35s step-end infinite";
}

function startHeartRain() {
    showMessage("EU TE AMO MUITO, JOÃO!!!");

    const rain = setInterval(() => {
        spawnCelebrationHeart();
    }, 60);
}

function startMove(direction) {
    stopMove();

    if (direction === "left") {
        player.src = "img/pixel_art_jh_walk-l.png";
    } else {
        player.src = "img/pixel_art_jh_walk-r.png";
    }

    moveInterval = setInterval(() => {
        if (direction === "left") {
            position -= 2;
            if (position < 0) position = 0;
        } else {
            position += 2;
            if (position > 100) position = 100;
        }

        player.style.left = position + "%";
    }, 30);
}

function stopMove() {
    clearInterval(moveInterval);
    moveInterval = null;
    
    player.src = "img/pixel_art_jh.png";
}

const leftBtn = document.getElementById("left-btn");
const rightBtn = document.getElementById("right-btn");

function bindMoveButton(button, dir) {
    button.addEventListener("pointerdown", (e) => {
        e.preventDefault();
        button.setPointerCapture(e.pointerId);
        startMove(dir);
    });

    button.addEventListener("pointerup", stopMove);
    button.addEventListener("pointerleave", stopMove);
    button.addEventListener("pointercancel", stopMove);

}

if (leftBtn) bindMoveButton(leftBtn, "left");
if (rightBtn) bindMoveButton(rightBtn, "right");