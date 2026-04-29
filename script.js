var canvas, ctx;
var frameNo = 0;
var mondo = 1;

// PLAYER
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
        if (this.y > canvas.height - this.h) {
            this.y = canvas.height - this.h;
            this.velY = 0;
            this.jumping = false;
        }

        // collisioni con ostacoli
        for (let obs of gestioneOstacoli.lista) {
            if (
                this.x < obs.x + obs.width &&
                this.x + this.w > obs.x &&
                this.y < obs.y + obs.height &&
                this.y + this.h > obs.y
            ) {
                // sopra
                if (this.velY > 0) {
                    this.y = obs.y - this.h;
                    this.velY = 0;
                    this.jumping = false;
                } else {
                    // collisione laterale = stop
                    this.speedX = 0;
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
            // fallback
            ctx.fillStyle = "blue";
            ctx.fillRect(this.x, this.y, this.w, this.h);
        }

        ctx.restore();
    }
};

// 🎯 OSTACOLI (ADATTATI)
var gestioneOstacoli = {
    lista: [],

    genera: function () {
        if (everyinterval(50)) {
            let x = canvas.width;
            let pY = canvas.height - 20;
            let scelta = Math.floor(Math.random() * 4);

            let coloreTubi;

            if (mondo == 2) coloreTubi = "darkgreen";
            else if (mondo == 3) coloreTubi = "#b22222dc";
            else coloreTubi = "green";

            if (scelta == 0) {
                this.lista.push(new obstacleComponent(45, 70, x, pY - 70, coloreTubi, "tubo"));
            } else if (scelta == 1) {
                for (let i = 0; i < 3; i++) {
                    this.lista.push(new obstacleComponent(35, 35, x + (i * 35), pY - 130, "#CD853F", "cubo"));
                }
            } else if (scelta == 2) {
                this.lista.push(new obstacleComponent(30, 30, x, pY - 30, "darkred", "nemico"));
            } else {
                this.lista.push(new obstacleComponent(25, 100, x, pY - 100, "#555", "palo"));
            }
        }
    },

    aggiorna: function () {
        for (let i = 0; i < this.lista.length; i++) {
            let obs = this.lista[i];
            obs.x -= (4 + mondo);

            this.disegna(obs);
        }

        // rimuove quelli fuori schermo
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

// COSTRUTTORE
function obstacleComponent(width, height, x, y, colore, tipo) {
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
    this.colore = colore;
    this.tipo = tipo;
}

// TIMER LOGICO
function everyinterval(n) {
    return (frameNo % n === 0);
}

// CONTROLLI
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

// LOOP
function update() {
    frameNo++;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    gestioneOstacoli.genera();
    gestioneOstacoli.aggiorna();

    player.update();
    player.draw();
}

// START
function startGame() {
    canvas = document.createElement("canvas");
    canvas.width = 1220;
    canvas.height = 300;
    ctx = canvas.getContext("2d");

    document.body.insertBefore(canvas, document.body.childNodes[0]);

    for (let imgPath of running) {
        let img = new Image();
        img.src = imgPath;
        player.images.push(img);
    }

    setInterval(update, 20);

    window.addEventListener("keydown", keyDown);
    window.addEventListener("keyup", keyUp);
}