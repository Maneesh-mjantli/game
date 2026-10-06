const player = document.getElementById("player");

const cores = document.querySelectorAll(".core");
const enemies = document.querySelectorAll(".enemy");

const livesText = document.getElementById("lives");
const dataText = document.getElementById("data");
const scoreText = document.getElementById("score");

const message = document.getElementById("message");


// =============================
// GAME VARIABLES
// =============================

let x = 100;
let y = 150;

let lives = 3;
let data = 0;
let score = 0;

let level = 1;
const maxLevel = 5;

let gameRunning = false;

let speed = 5;


// =============================
// LEVEL DATA
// =============================

const levelData = {

    1: {
        cores: [
            [25, 30],
            [55, 65],
            [75, 25]
        ],

        enemies: [
            [40, 45],
            [70, 70]
        ]
    },

    2: {
        cores: [
            [15, 70],
            [50, 25],
            [80, 55]
        ],

        enemies: [
            [30, 40],
            [65, 30]
        ]
    },

    3: {
        cores: [
            [20, 25],
            [60, 70],
            [85, 30]
        ],

        enemies: [
            [45, 35],
            [75, 65]
        ]
    },

    4: {
        cores: [
            [15, 40],
            [50, 75],
            [80, 20]
        ],

        enemies: [
            [35, 65],
            [70, 40]
        ]
    },

    5: {
        cores: [
            [20, 20],
            [50, 50],
            [80, 75]
        ],

        enemies: [
            [40, 30],
            [70, 55]
        ]
    }
};


// =============================
// START GAME
// =============================

function startGame() {

    level = 1;
    lives = 3;
    data = 0;
    score = 0;

    startLevel();

    message.style.display = "none";

    gameRunning = true;
}


// =============================
// START LEVEL
// =============================

function startLevel() {

    x = 100;
    y = 150;

    data = 0;

    // Increase speed every level
    speed = 5 + (level - 1) * 0.8;

    const currentLevel = levelData[level];

    // Position cores
    cores.forEach((core, index) => {

        core.style.display = "block";

        core.style.left =
            currentLevel.cores[index][0] + "%";

        core.style.top =
            currentLevel.cores[index][1] + "%";
    });


    // Position enemies
    enemies.forEach((enemy, index) => {

        enemy.style.display = "block";

        enemy.style.left =
            currentLevel.enemies[index][0] + "%";

        enemy.style.top =
            currentLevel.enemies[index][1] + "%";
    });


    updatePlayer();
    updateHUD();
}


// =============================
// PLAYER MOVEMENT
// =============================

document.addEventListener("keydown", function(event) {

    if (!gameRunning) return;


    if (
        event.key === "ArrowUp" ||
        event.key.toLowerCase() === "w"
    ) {
        y -= speed;
    }


    if (
        event.key === "ArrowDown" ||
        event.key.toLowerCase() === "s"
    ) {
        y += speed;
    }


    if (
        event.key === "ArrowLeft" ||
        event.key.toLowerCase() === "a"
    ) {
        x -= speed;
    }


    if (
        event.key === "ArrowRight" ||
        event.key.toLowerCase() === "d"
    ) {
        x += speed;
    }


    // Keep player inside screen

    const gameWidth = window.innerWidth;
    const gameHeight = window.innerHeight;


    x = Math.max(
        0,
        Math.min(x, gameWidth - 40)
    );


    y = Math.max(
        50,
        Math.min(y, gameHeight - 50)
    );


    updatePlayer();

    checkCores();

    checkEnemies();

    checkExit();
});


// =============================
// UPDATE PLAYER
// =============================

function updatePlayer() {

    player.style.left = x + "px";
    player.style.top = y + "px";
}


// =============================
// UPDATE HUD
// =============================

function updateHUD() {

    livesText.textContent = lives;

    dataText.textContent = data + "/3";

    scoreText.textContent = score;

    // Add level display
    let levelText =
        document.getElementById("level");

    if (levelText) {
        levelText.textContent = level;
    }
}


// =============================
// COLLISION DETECTION
// =============================

function isColliding(a, b) {

    const r1 = a.getBoundingClientRect();

    const r2 = b.getBoundingClientRect();


    return !(
        r1.right < r2.left ||
        r1.left > r2.right ||
        r1.bottom < r2.top ||
        r1.top > r2.bottom
    );
}


// =============================
// CHECK DATA CORES
// =============================

function checkCores() {

    cores.forEach(function(core) {

        if (
            core.style.display !== "none" &&
            isColliding(player, core)
        ) {

            core.style.display = "none";

            data++;

            score += 100;

            updateHUD();
        }

    });
}


// =============================
// CHECK ENEMIES
// =============================

function checkEnemies() {

    enemies.forEach(function(enemy) {

        if (
            enemy.style.display !== "none" &&
            isColliding(player, enemy)
        ) {

            lives--;

            x = 100;
            y = 150;

            updatePlayer();

            updateHUD();


            if (lives <= 0) {

                gameOver();
            }
        }

    });
}


// =============================
// CHECK EXIT
// =============================

function checkExit() {

    const exit = document.getElementById("exit");


    // Player can exit only after
    // collecting all 3 data cores

    if (
        data >= 3 &&
        isColliding(player, exit)
    ) {

        nextLevel();
    }
}


// =============================
// NEXT LEVEL
// =============================

function nextLevel() {

    gameRunning = false;


    if (level >= maxLevel) {

        gameComplete();

        return;
    }


    level++;


    message.style.display = "flex";


    message.innerHTML = `

        <h1>LEVEL ${level}</h1>

        <p>
            New sector detected.
        </p>

        <p>
            Security level increased.
        </p>

        <button onclick="continueLevel()">
            CONTINUE
        </button>

    `;
}


// =============================
// CONTINUE LEVEL
// =============================

function continueLevel() {

    message.style.display = "none";

    startLevel();

    gameRunning = true;
}


// =============================
// GAME OVER
// =============================

function gameOver() {

    gameRunning = false;

    message.style.display = "flex";


    message.innerHTML = `

        <h1>SYSTEM FAILURE</h1>

        <p>
            Your hacker was caught.
        </p>

        <p>
            Level: ${level}
        </p>

        <p>
            Score: ${score}
        </p>

        <button onclick="restartGame()">
            TRY AGAIN
        </button>

    `;
}


// =============================
// GAME COMPLETE
// =============================

function gameComplete() {

    gameRunning = false;

    message.style.display = "flex";


    message.innerHTML = `

        <h1>NEON ESCAPE</h1>

        <p>
            🎉 ALL LEVELS COMPLETED!
        </p>

        <p>
            CITY NETWORK HACKED
        </p>

        <p>
            FINAL SCORE: ${score}
        </p>

        <button onclick="restartGame()">
            PLAY AGAIN
        </button>

    `;
}


// =============================
// RESTART
// =============================

function restartGame() {

    location.reload();
}


// =============================
// CONTINUOUS EXIT CHECK
// =============================

// This makes the EXIT collision
// much more reliable.

function gameLoop() {

    if (gameRunning) {

        checkCores();

        checkEnemies();

        checkExit();
    }


    requestAnimationFrame(gameLoop);
}


gameLoop();