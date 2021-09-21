let myGamePiece;
let myObstacles = [];
let myScore;

function startGame() {
    myGameArea.start(); //  make a gaming area
    myGamePiece  = new component(30, 30, "img/giphy.gif", 10, 120, 'image'); //make a component
    //myObstacle = new component(10, 200, "green", 300, 120); //make a obstacle
    myScore = new component("30px", "Consolas", "black", 280, 40, "text");
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

function component(width, height, color, x, y, type) {
    this.type = type;
    if (type == 'image'){
        this.image = new Image();
        this.image.src = color;
    }
    this.width = width;
    this.height = height;
    this.speedX = 0;
    this.speedY = 0;
    this.x = x;
    this.y = y;
    this.gravity = 0.05;
    this.gravitySpeed = 0;
    this.update = function() {
        ctx = myGameArea.context;
        
        if (type == 'text') {
            ctx.font = this.width + " " + this.height;
            ctx.fillStyle = color;
            ctx.fillText(this.text, this.x, this.y);
        } else {
            ctx.fillStyle = color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }

        if (type == 'image') {
            ctx.drawImage(
                this.image,
                this.x,
                this.y,
                this.width, 
                this.height);
        }
    }
    this.newPos = function() {
        this.gravitySpeed += this.gravity;
        this.x += this.speedX;
        this.y += this.speedY + this.gravitySpeed;
        this.hitBottom();
    }
    this.hitBottom = function() {
        let rockBottom = myGameArea.canvas.height - this.height;
        if (this.y >  rockBottom) {
            this.y = rockBottom;
        }
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
    let x, height, gap, minHeight, maxHeight, minGap, maxGap;
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
        minHeight = 20;
        maxHeight = 200;
        height = Math.floor(Math.random()*(maxHeight-minHeight+1)+minHeight);
        minGap = 50;
        maxGap = 200;
        gap = Math.floor(Math.random()*(maxGap-minGap+1)+minGap);
        myObstacles.push(new component(10, height, "green", x, 0));
        myObstacles.push(new component(10, x - height - gap, "green", x, height + gap));
    }
    for (i = 0; i < myObstacles.length; i += 1) {
        myObstacles[i].x += -1;
        myObstacles[i].update();
    }
    myScore.text="SCORE: " + myGameArea.frameNo;
    myScore.update();
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
window.addEventListener('keydown', fly);
window.addEventListener('keyup', flyDown);

function fly(e) {
    if (e.defaultPrevented) {
        return;
    }

    if (e.code === "Space"){
        myGamePiece.gravity = -0.2;
    } 
}

function flyDown(e) {
    if (e.defaultPrevented) {
        return;
    }

    if (e.code === "Space"){
        myGamePiece.gravity = 0.05;
    } 
}
