let myGamePiece;
let myObstacles = [];

function startGame() {
    myGameArea.start(); //  make a gaming area
    myGamePiece  = new component(30, 30, "red", 10, 120); //make a component
    //myObstacle = new component(10, 200, "green", 300, 120); //make a obstacle
}

let myGameArea = {
    canvas: document.createElement('canvas'),
    start: function() {
        this.canvas.width = 480;
        this.canvas.height  = 270;
        this.context = this.canvas.getContext('2d');
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.frameNo = 0; //counting frames
        this.interval = setInterval(updateGameArea, 20);  //update the display every 20th millisecond (50 times persecond)
    },
    clear: function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }, // clears the entire canvas
    stop: function() {
        clearInterval(this.interval);
    }
}

function component(width, height, color, x, y) {
    this.width = width;
    this.height = height;
    this.speedX = 0;
    this.speedY = 0;
    this.x = x;
    this.y = y;
    this.update = function() {
        ctx = myGameArea.context;
        ctx.fillStyle = color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
    this.newPos = function() {
        this.x += this.speedX;
        this.y += this.speedY;
    }
    this.crashWith = function(otherobj) {
        let myLeft = this.x;
        let myRight = this.x + (this.width);
        let myTop = this.y;
        let myBottom = this.y + (this.height);
        let otherLeft = otherobj.x;
        let otherright = otherobj.x + (otherobj.width);
        let othertop = otherobj.y;
        let otherbottom = otherobj.y + (otherobj.height);
        let crash =  true;
        if ((myBottom < othertop) || (myTop > otherbottom) || (myRight < otherLeft) || (myLeft > otherright)) {
            crash = false;
        }
        return crash;
    }
}

function updateGameArea() { //the component is now drawn and clear 50 times per sec
    let x, y;
    for (i = 0; i < myObstacles.length; i += 1) {   //loop through every obstacle to see if there is a crash
        if (myGamePiece.crashWith(myObstacles[i])) {
            myGameArea.stop();
            return;
        } 
    }
    myGameArea.clear();
    myGameArea.frameNo += 1;
    if (myGameArea.frameNo == 1 || everyinterval(150)) {
        x = myGameArea.canvas.width;
        y = myGameArea.canvas.height - 200;
        myObstacles.push(new component(10, 200, "green", x, y));
    }
    for (i = 0; i < myObstacles.length; i += 1) {
        myObstacles[i].x += -1;
        myObstacles[i].update();
    }
    myGamePiece.newPos();    
    myGamePiece.update();

    /* if (myGamePiece.crashWith(myObstacle)) {
        myGameArea.stop();                      //if it hits the obstacle, game stop
    }  else {
        myGameArea.clear();
        myObstacle.x += -1;
        myObstacle.update();
        myGamePiece.newPos();
        myGamePiece.update();                   // else do something
    } */
}

//a method for execute something at a given frame rate.
function everyinterval(n){
    if ((myGameArea.frameNo / n) % 1 == 0) {return true;}
    return false;
}

//create keyboard controller
window.addEventListener('keydown', function(event) {
    if (event.defaultPrevented) {
        return;
    }

    if (event.code === "ArrowDown"){
        myGamePiece.speedY += 1;
    } else if (event.code === "ArrowUp"){
        myGamePiece.speedY -= 1;
    } else if (event.code === "ArrowLeft"){
        myGamePiece.speedX -= 1;
    } else if (event.code === "ArrowRight"){
        myGamePiece.speedX += 1;
    }
})
