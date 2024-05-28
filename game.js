// Enhanced game.js

const canvas = document.getElementById('gameCanvas');
const context = canvas.getContext('2d');

const keys = {
    left: false,
    right: false,
    up: false
};

const player = {
    x: 50,
    y: 50,
    width: 50,
    height: 50,
    speed: 5,
    dx: 0,
    dy: 0,
    gravity: 0.8,
    jumpPower: -15,
    friction: 0.8,
    grounded: false,
    color: 'red'
};

const platforms = [
    { x: 0, y: 580, width: 800, height: 20 },
    { x: 100, y: 450, width: 200, height: 20 },
    { x: 400, y: 300, width: 200, height: 20 },
    { x: 650, y: 200, width: 100, height: 20 }
];

const enemies = [
    { x: 300, y: 550, width: 50, height: 30, color: 'blue', dx: 2 }
];

let gameState = 'running';

function clearCanvas() {
    context.clearRect(0, 0, canvas.width, canvas.height);
}

function drawPlayer() {
    context.fillStyle = player.color;
    context.fillRect(player.x, player.y, player.width, player.height);
}

function drawPlatforms() {
    context.fillStyle = 'green';
    platforms.forEach(platform => {
        context.fillRect(platform.x, platform.y, platform.width, platform.height);
    });
}

function drawEnemies() {
    enemies.forEach(enemy => {
        context.fillStyle = enemy.color;
        context.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
    });
}

function updatePlayer() {
    // Apply gravity
    player.dy += player.gravity;

    // Apply friction
    player.dx *= player.friction;

    // Move player
    player.x += player.dx;
    player.y += player.dy;

    // Check for collisions with platforms
    player.grounded = false;
    platforms.forEach(platform => {
        if (player.x < platform.x + platform.width &&
            player.x + player.width > platform.x &&
            player.y < platform.y + platform.height &&
            player.y + player.height > platform.y) {

            if (player.dy > 0) {
                player.y = platform.y - player.height;
                player.dy = 0;
                player.grounded = true;
            }
        }
    });

    // Stop player from falling out of the canvas
    if (player.y + player.height > canvas.height) {
        player.y = canvas.height - player.height;
        player.dy = 0;
        player.grounded = true;
    }

    if (player.x < 0) player.x = 0;
    if (player.x + player.width > canvas.width) player.x = canvas.width - player.width;
}

function movePlayer() {
    if (keys.left) player.dx = -player.speed;
    if (keys.right) player.dx = player.speed;
    if (!keys.left && !keys.right) player.dx = 0;
}

function updateEnemies() {
    enemies.forEach(enemy => {
        enemy.x += enemy.dx;

        if (enemy.x + enemy.width > canvas.width || enemy.x < 0) {
            enemy.dx *= -1;
        }

        // Check collision with player
        if (player.x < enemy.x + enemy.width &&
            player.x + player.width > enemy.x &&
            player.y < enemy.y + enemy.height &&
            player.y + player.height > enemy.y) {
                gameState = 'gameOver';
        }
    });
}

function handleKeyDown(event) {
    if (event.key === 'ArrowLeft') keys.left = true;
    if (event.key === 'ArrowRight') keys.right = true;
    if (event.key === 'ArrowUp' && player.grounded) {
        player.dy = player.jumpPower;
        player.grounded = false;
    }
}

function handleKeyUp(event) {
    if (event.key === 'ArrowLeft') keys.left = false

