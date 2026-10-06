const game = document.getElementById("game");
const player = document.getElementById("player");

const livesText = document.getElementById("lives");
const dataText = document.getElementById("data");
const scoreText = document.getElementById("score");
const timerText = document.getElementById("timer");

const message = document.getElementById("message");
const messageText = document.getElementById("messageText");

const cores = document.querySelectorAll(".core");
const enemies = document.querySelectorAll(".enemy");

let x = window.innerWidth / 2;
let y = window.innerHeight * 0.7;

let lives = 3;
let data = 0;
let score = 0;
let time = 60;

let gameRunning = false;

const keys = {};

document.addEventListener("keydown", e => {
    keys[e.key.toLowerCase()] = true;
});

document.addEventListener("keyup", e => {
    keys[e.key.toLowerCase()] = false;
});

function startGame() {

    lives = 3;
    data = 0;
    score = 0;
    time = 60;

    x = window.innerWidth / 2;
    y = window.innerHeight * 0.7;

    livesText.textContent = lives;
    dataText.textContent = data;
    scoreText.textContent = score;
    timerText.textContent = time;

    cores.forEach(core => {
        core.style.display = "flex";
    });

    message.style.display = "none";

    gameRunning = true;

    gameLoop();
    startTimer();
}

function gameLoop() {

    if (!gameRunning) return;

    movePlayer();
    checkCores();
    checkEnemies();
    checkExit();

    requestAnimationFrame(gameLoop);
}

function movePlayer() {

    const speed = 5;

    if (keys["arrowup"] || keys["w"]) {
        y -= speed;
    }

    if (keys["arrowdown"] || keys["s"]) {
        y += speed;
    }

    if (keys["arrowleft"] || keys["a"]) {
        x -= speed;
    }

    if (keys["arrowright"] || keys["d"]) {
        x += speed;
    }

    const width = player.offsetWidth;
    const height = player.offsetHeight;

    x = Math.max(width / 2, Math.min(window.innerWidth - width / 2, x));
    y = Math.max(80, Math.min(window.innerHeight - height / 2, y));

    player.style.left = x + "px";
    player.style.top = y + "px";
}

function getDistance(a, b) {

    const ax = a.getBoundingClientRect().left;
    const ay = a.getBoundingClientRect().top;

    const bx = b.getBoundingClientRect().left;
    const by = b.getBoundingClientRect().top;

    return Math.hypot(ax - bx, ay - by);
}

function checkCores() {

    cores.forEach(core => {

        if (core.style.display === "none") return;

        if (getDistance(player, core) < 45) {

            core.style.display = "none";

            data++;
            score += 100;

            dataText.textContent = data;
            scoreText.textContent = score;
        }
    });
}

function checkEnemies() {

    enemies.forEach(enemy => {

        if (getDistance(player, enemy) < 45) {

            lives--;

            livesText.textContent = lives;

            // Move player away
            x = window.innerWidth / 2;
            y = window.innerHeight * 0.7;

            if (lives <= 0) {
                endGame(false);
            }
        }
    });
}

function checkExit() {

    if (data < 3) return;

    const exit = document.getElementById("exit");

    if (getDistance(player, exit) < 70) {

        score += time * 10;

        scoreText.textContent = score;

        endGame(true);
    }
}

function startTimer() {

    const timer = setInterval(() => {

        if (!gameRunning) {
            clearInterval(timer);
            return;
        }

        time--;

        timerText.textContent = time;

        if (time <= 0) {
            clearInterval(timer);
            endGame(false);
        }

    }, 1000);
}

function endGame(won) {

    gameRunning = false;

    message.style.display = "flex";

    if (won) {

        messageText.innerHTML =
            `🎉 YOU ESCAPED!<br><br>
             Final Score: <strong>${score}</strong>`;

        message.querySelector("h1").textContent = "MISSION COMPLETE";

    } else {

        messageText.innerHTML =
            `💀 GAME OVER<br><br>
             Score: <strong>${score}</strong>`;

        message.querySelector("h1").textContent = "GAME OVER";
    }
}
