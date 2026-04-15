var myGameArea = {
    canvas: document.createElement("canvas"),
    start: function() {
        this.canvas.width = 480;
        this.canvas.height = 270;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.interval = setInterval(updateGameArea, 20);
        
    
        window.addEventListener('keydown', function (e) {
            if (e.key === "ArrowUp") moveup();
            if (e.key === "ArrowDown") movedown();
            if (e.key === "ArrowLeft") moveleft();
            if (e.key === "ArrowRight") moveright();
        });
        window.addEventListener('keyup', function (e) {
            stopMove();
        });
    },
    clear: function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    drawGameObject: function(gameObject) {
        this.context.drawImage(
            gameObject.image,
            gameObject.x,
            gameObject.y,
            gameObject.width,
            gameObject.height
        );
    }
};

var animatedObject = {
    speedX: 0,
    speedY: 0,
    width: 70, 
    height: 100,
    x: 10,
    y: 120,
    imageList: [], 
    contaFrame: 0, 
    actualFrame: 0, 

    update: function() {
   
        this.x += this.speedX;
        this.y += this.speedY;

   
        if (this.x < 0) this.x = 0;
        if (this.x > myGameArea.canvas.width - this.width) this.x = myGameArea.canvas.width - this.width;
        if (this.y < 0) this.y = 0;
        if (this.y > myGameArea.canvas.height - this.height) this.y = myGameArea.canvas.height - this.height;

       
        this.contaFrame++;
        if (this.contaFrame >= 4) {
            this.contaFrame = 0;
            this.actualFrame = (1 + this.actualFrame) % this.imageList.length;
            this.image = this.imageList[this.actualFrame];
        }
    },

    loadImages: function() {
        for (let imgPath of running) {
            var img = new Image();
            img.src = imgPath;
            this.imageList.push(img);
        }
        this.image = this.imageList[0];
    }
};

function startGame() {
    animatedObject.loadImages();
    myGameArea.start();
}

function updateGameArea() {
    myGameArea.clear();
    animatedObject.update();
    myGameArea.drawGameObject(animatedObject);
}

function moveup() { animatedObject.speedY = -3; }
function movedown() { animatedObject.speedY = 3; }
function moveleft() { animatedObject.speedX = -3; }
function moveright() { animatedObject.speedX = 3; }
function stopMove() { 
    animatedObject.speedX = 0; 
    animatedObject.speedY = 0; 
}