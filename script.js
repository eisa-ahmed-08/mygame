var myGameArea = {
    canvas: document.createElement("canvas"),
    start: function() {
        this.canvas.width = 480;
        this.canvas.height = 270;
        this.context = this.canvas.getContext("2d");
        document.body.appendChild(this.canvas);
        this.interval = setInterval(updateGameArea, 20); 
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
  width: 100,
  height: 120,
  x: 10,
  y: 120,
  imageList: [], 
  contaFrame: 0, 
  actualFrame: 0, 

  update: function() {
    this.x += this.speedX;
    this.y += this.speedY;
    this.contaFrame++;
    if (this.contaFrame == 50) {
      this.contaFrame = 0;
      this.actualFrame = (1 + this.actualFrame) % this.imageList.length;
      this.image = this.imageList[this.actualFrame];
    }
  },

  loadImages: function() {
     for (imgPath of running) {
      var img = new Image(this.width, this.height);
      img.src = imgPath;
      this.imageList.push(img);
    }
    this.image = this.imageList[this.actualFrame];
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

function moveup() {
   animatedObject.y -= 20;
}

function movedown() {
    animatedObject.y += 20;
}

function moveleft() {
    animatedObject.x -= 20;
}

function moveright() {
    animatedObject.x += 20;
}