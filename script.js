var canvas, ctx;

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

    update: function() {

        this.x += this.speedX;

        this.velY += this.gravity;
        this.y += this.velY;

        if (this.y > canvas.height - this.h) {
            this.y = canvas.height - this.h;
            this.velY = 0;
            this.jumping = false;
        }

        if (
            this.x < block.x + block.w &&
            this.x + this.w > block.x &&
            this.y < block.y + block.h &&
            this.y + this.h > block.y
        ) {
            if (this.velY > 0) {
                this.y = block.y - this.h;
                this.velY = 0;
                this.jumping = false;
            }
        }

        this.frameCount++;
        if (this.frameCount >= this.frameDelay) {
            this.frameCount = 0;
            this.frame = (this.frame + 1) % this.images.length;
        }
    },

    draw: function() {
        ctx.save();

        if (this.dir === -1) {
            ctx.scale(-1, 1);
            ctx.drawImage(this.images[this.frame], -this.x - this.w, this.y, this.w, this.h);
        } else {
            ctx.drawImage(this.images[this.frame], this.x, this.y, this.w, this.h);
        }

        ctx.restore();
    }
};

var block = {
    x: 500,
    y: 180,
    w: 120,
    h: 20
};

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

function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    player.update();

    ctx.fillStyle = "brown";
    ctx.fillRect(block.x, block.y, block.w, block.h);

    player.draw();
}

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