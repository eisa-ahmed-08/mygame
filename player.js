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

        if (this.y > canvas.height - ground - this.h) {
            this.y = canvas.height - ground - this.h;
            this.velY = 0;
            this.jumping = false;
        }

        for (let obs of gestioneOstacoli.lista) {
            if (
                this.x < obs.x + obs.width &&
                this.x + this.w > obs.x &&
                this.y < obs.y + obs.height &&
                this.y + this.h > obs.y
            ) {
                if (this.velY > 0 && this.y + this.h - this.velY <= obs.y) {
                    this.y = obs.y - this.h;
                    this.velY = 0;
                    this.jumping = false;
                } else {
                    resetGame();
                }
            }
        }

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

function keyDown(e) {
    if (e.key === "ArrowRight") { player.speedX = 4; player.dir = 1; }
    if (e.key === "ArrowLeft") { player.speedX = -4; player.dir = -1; }
    if (e.key === "ArrowUp") jump();
}

function keyUp(e) {
    if (e.key === "ArrowRight" || e.key === "ArrowLeft") player.speedX = 0;
}

function jump() {
    if (!player.jumping) {
        player.velY = -10;
        player.jumping = true;
    }
}