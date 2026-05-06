// ===== VARIABILI GLOBALI =====
var canvas, ctx;
var frameNo = 0;
var mondo = 1;
var ground = 20;
var score = 0;

// ===== PLAYER =====
var player = {
    x: 50,
    y: 120,
    w: 70,
    h: 100,

    speedX: 0,
    dir: 1,

    velY: 0,
    gravity: 0.5,
    jumping: false,

    images: [],
    frame: 0,
    frameCount: 0,
    frameDelay: 8,

    update: function () {

        this.x += this.speedX;

        this.velY += this.gravity;
        this.y += this.velY;

        // terreno
        if (this.y > canvas.height - ground - this.h) {
            this.y = canvas.height - ground - this.h;
            this.velY = 0;
            this.jumping = false;
        }

        // collisioni
        for (let obs of gestioneOstacoli.lista) {

            if (
                this.x < obs.x + obs.width &&
                this.x + this.w > obs.x &&
                this.y < obs.y + obs.height &&
                this.y + this.h > obs.y
            ) {
                // puoi stare sopra
                if (this.velY > 0 && this.y + this.h - this.velY <= obs.y) {
                    this.y = obs.y - this.h;
                    this.velY = 0;
                    this.jumping = false;
                } else {
                    resetGame();
                }
            }
        }

        // animazione
        this.frameCount++;
        if (this.frameCount >= this.frameDelay && this.images.length > 0) {
            this.frameCount = 0;
            this.frame = (this.frame + 1) % this.images.length;
        }
    },

    draw: function () {
        ctx.save();

        if (this.images.length > 0) {
            if (this.dir === -1) {
                ctx.scale(-1, 1);
                ctx.drawImage(this.images[this.frame], -this.x - this.w, this.y, this.w, this.h);
            } else {
                ctx.drawImage(this.images[this.frame], this.x, this.y, this.w, this.h);
            }
        } else {
            ctx.fillStyle = "blue";
            ctx.fillRect(this.x, this.y, this.w, this.h);
        }

        ctx.restore();
    }
};

// ===== OSTACOLI =====
var gestioneOstacoli = {
    lista: [],

    genera: function () {

        if (frameNo % 50 === 0) {

            let x = canvas.width;
            let base = canvas.height - ground;

            let scelta = Math.floor(Math.random() * 3); // 🔥 ora solo 3 tipi

            let coloreTubi = (mondo == 2) ? "darkgreen" :
                             (mondo == 3) ? "#b22222dc" : "green";

            // 🟢 TUBO (terra)
            if (scelta == 0) {
                this.lista.push(new obstacleComponent(45, 70, x, base - 70, coloreTubi, "tubo"));
            }

            // 🟤 CUBI (ABBASSATI)
            else if (scelta == 1) {
                for (let i = 0; i < 3; i++) {
                    this.lista.push(
                        new obstacleComponent(
                            35,
                            35,
                            x + (i * 35),
                            base - 80,   // 🔽 prima era 130 → ora più basso
                            "#CD853F",
                            "cubo"
                        )
                    );
                }
            }

            // 🔴 NEMICO (ABBASSATO)
            else if (scelta == 2) {
                this.lista.push(
                    new obstacleComponent(
                        30,
                        30,
                        x,
                        base - 40,   // 🔽 prima era 30 → leggermente più alto ma vicino al terreno
                        "darkred",
                        "nemico"
                    )
                );
            }
        }
    },

    aggiorna: function () {

        for (let obs of this.lista) {

            obs.x -= (4 + mondo);

            // punteggio
            if (!obs.passed && obs.x + obs.width < player.x) {
                obs.passed = true;
                score += 10;
            }

            this.disegna(obs);
        }

        this.lista = this.lista.filter(o => o.x + o.width > 0);
    },

    disegna: function (obs) {

        ctx.fillStyle = "black";
        ctx.fillRect(obs.x - 2, obs.y - 2, obs.width + 4, obs.height + 4);

        ctx.fillStyle = obs.colore;
        ctx.fillRect(obs.x, obs.y, obs.width, obs.height);

        if (obs.tipo == "cubo") {
            ctx.fillStyle = "rgba(0,0,0,0.2)";
            ctx.fillRect(obs.x + 5, obs.y + 5, obs.width - 10, obs.height - 10);
        }

        if (obs.tipo == "tubo") {
            ctx.fillStyle = "black";
            ctx.fillRect(obs.x - 6, obs.y, obs.width + 12, 15);

            ctx.fillStyle = obs.colore;
            ctx.fillRect(obs.x - 4, obs.y + 2, obs.width + 8, 11);
        }
    }
};

// ===== COSTRUTTORE =====
function obstacleComponent(width, height, x, y, colore, tipo) {
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
    this.colore = colore;
    this.tipo = tipo;
    this.passed = false;
}

// ===== RESET =====
function resetGame() {
    player.x = 50;
    player.y = 120;
    player.velY = 0;
    player.speedX = 0;

    gestioneOstacoli.lista = [];
    frameNo = 0;
    score = 0;
}

// ===== CONTROLLI =====
function keyDown(e) {
    if (e.key === "ArrowRight") {
        player.speedX = 4;
        player.dir = 1;
    }
    if (e.key === "ArrowLeft") {
        player.speedX = -4;
        player.dir = -1;
    }
    if (e.key === "ArrowUp") jump();
}

function keyUp(e) {
    if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
        player.speedX = 0;
    }
}

function jump() {
    if (!player.jumping) {
        player.velY = -10;
        player.jumping = true;
    }
}

// ===== LOOP =====
function update() {
    frameNo++;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // terreno
    ctx.fillStyle = "#654321";
    ctx.fillRect(0, canvas.height - ground, canvas.width, ground);

    gestioneOstacoli.genera();
    gestioneOstacoli.aggiorna();

    player.update();
    player.draw();

    // punteggio
    ctx.fillStyle = "black";
    ctx.font = "20px Arial";
    ctx.fillText("Score: " + score, 20, 30);
}

// ===== START =====
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