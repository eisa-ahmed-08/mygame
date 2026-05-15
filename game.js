var canvas, ctx;
var frameNo = 0;
var mondo = 1;
var ground = 20;
var score = 0;

function resetGame() {
    player.x = 50;
    player.y = 120;
    player.velY = 0;
    player.speedX = 0;
    mondo = 1;
    gestioneOstacoli.lista = [];
    frameNo = 0;
    score = 0;
}

function update() {
    frameNo++;

    if (score >= 150) {
        mondo = 2;
    } else {
        mondo = 1;
    }

    if (mondo === 1) {
        ctx.fillStyle = "#87CEEB"; 
    } else {
        ctx.fillStyle = "#2c3e50";
    }
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = (mondo === 1) ? "#654321" : "#3e2723";
    ctx.fillRect(0, canvas.height - ground, canvas.width, ground);

    gestioneOstacoli.genera();
    gestioneOstacoli.aggiorna();

    player.update();
    player.draw();

    ctx.fillStyle = (mondo === 1) ? "black" : "white";
    ctx.font = "bold 20px 'Courier New'";
    ctx.fillText("SCORE: " + score, 20, 40);
    ctx.fillText("WORLD: " + mondo, 20, 70);
}

function startGame() {
    canvas = document.createElement("canvas");
    canvas.width = 1220;
    canvas.height = 300;
    ctx = canvas.getContext("2d");
    document.body.appendChild(canvas);

    for (let imgPath of running) {
        let img = new Image();
        img.src = imgPath;
        player.images.push(img);
    }

    setInterval(update, 20);
    window.addEventListener("keydown", keyDown);
    window.addEventListener("keyup", keyUp);
}