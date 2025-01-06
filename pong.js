const canvas = document.getElementById("pong");
const ctx = canvas.getContext("2d");

// Tamanho do canvas
canvas.width = 800;
canvas.height = 400;

// Configurações de paddles
const paddleWidth = 10, paddleHeight = 100;

// Raquetes
const leftPaddle = {
    x: 0,
    y: canvas.height / 2 - paddleHeight / 2,
    width: paddleWidth,
    height: paddleHeight,
    color: "white",
    dy: 0,
};

const rightPaddle = {
    x: canvas.width - paddleWidth,
    y: canvas.height / 2 - paddleHeight / 2,
    width: paddleWidth,
    height: paddleHeight,
    color: "white",
    dy: 0,
};

// Bola
const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 10,
    speed: 5,
    dx: 5,
    dy: 5,
    color: "white",
};

// Pontuação
let leftScore = 0;
let rightScore = 0;

// Função para desenhar as raquetes
function drawPaddle(x, y, width, height, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, width, height);
}

// Função para desenhar a bola
function drawBall(x, y, radius, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
}

// Função para desenhar o placar
function drawScore() {
    const leftScoreDisplay = document.getElementById("left-score");
    const rightScoreDisplay = document.getElementById("right-score");
    leftScoreDisplay.textContent = leftScore;
    rightScoreDisplay.textContent = rightScore;
}

// Função para mover as raquetes
function movePaddle() {
    leftPaddle.y += leftPaddle.dy;
    rightPaddle.y += rightPaddle.dy;

    // Limitar as raquetes dentro do campo
    if (leftPaddle.y < 0) leftPaddle.y = 0;
    if (leftPaddle.y + paddleHeight > canvas.height) leftPaddle.y = canvas.height - paddleHeight;
}

// Função para a IA mover a raquete do Player 2
function moveRightPaddleAI() {
    const aiSpeed = 4; // Velocidade da IA para mover a raquete

    if (rightPaddle.y + paddleHeight / 2 < ball.y - 20) {
        rightPaddle.dy = aiSpeed;
    } else if (rightPaddle.y + paddleHeight / 2 > ball.y + 20) {
        rightPaddle.dy = -aiSpeed;
    } else {
        rightPaddle.dy = 0; // Quando a raquete estiver próxima da bola
    }
}

// Função para mover a bola
function moveBall() {
    ball.x += ball.dx;
    ball.y += ball.dy;

    // Colisão com o topo e fundo
    if (ball.y - ball.radius < 0 || ball.y + ball.radius > canvas.height) {
        ball.dy = -ball.dy;
    }

    // Colisão com as raquetes
    if (
        ball.x - ball.radius < leftPaddle.x + leftPaddle.width &&
        ball.y > leftPaddle.y &&
        ball.y < leftPaddle.y + paddleHeight ||
        ball.x + ball.radius > rightPaddle.x &&
        ball.y > rightPaddle.y &&
        ball.y < rightPaddle.y + paddleHeight
    ) {
        ball.dx = -ball.dx;
    }

    // Marcação de pontos
    if (ball.x - ball.radius < 0) {
        rightScore++;
        resetBall();
    } else if (ball.x + ball.radius > canvas.width) {
        leftScore++;
        resetBall();
    }
}

// Função para reiniciar a posição da bola
function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.dx = -ball.dx;
}

// Função para atualizar o jogo
function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Mover as raquetes
    movePaddle();
    moveRightPaddleAI();
    
    // Mover a bola
    moveBall();

    // Desenhar tudo
    drawPaddle(leftPaddle.x, leftPaddle.y, leftPaddle.width, leftPaddle.height, leftPaddle.color);
    drawPaddle(rightPaddle.x, rightPaddle.y, rightPaddle.width, rightPaddle.height, rightPaddle.color);
    drawBall(ball.x, ball.y, ball.radius, ball.color);
    drawScore();
}

// Função de controle das raquetes
document.addEventListener("keydown", function(event) {
    if (event.key === "ArrowUp") rightPaddle.dy = -10;
    if (event.key === "ArrowDown") rightPaddle.dy = 10;
    if (event.key === "w") leftPaddle.dy = -10;
    if (event.key === "s") leftPaddle.dy = 10;
});

document.addEventListener("keyup", function(event) {
    if (event.key === "ArrowUp" || event.key === "ArrowDown") rightPaddle.dy = 0;
    if (event.key === "w" || event.key === "s") leftPaddle.dy = 0;
});

// Função principal para animar o jogo
function gameLoop() {
    update();
    requestAnimationFrame(gameLoop);
}

gameLoop();
