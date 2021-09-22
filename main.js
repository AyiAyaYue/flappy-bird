let player;
let obstacles = [];
let score;

function startGame() {
    game.start();
    player  = new component(30, 30, "img/giphy.gif", 10, 120, 'image');
    score = new component("30px", "Consolas", "black", 280, 40, "text");
}

let game = {
    canvas: document.createElement('canvas'),
    start: function() {
        this.canvas.width = 480; //window.innerWidth
        this.canvas.height  = 270; //window.innerHeight
        this.context = this.canvas.getContext('2d');
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.frameNo = 0; //counting frames
        // this.interval = setInterval(updateGameArea, 20);  //update the display every 20th millisecond (50 times persecond)
        requestAnimationFrame(updateGameArea);
    },
    clear: function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }, // clears the entire canvas
    stop: function() {
        // clearInterval(this.interval);
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
    this.accelerationY  = 0;
    this.clampY = 0.9;
    this.x = x;
    this.y = y;
    this.gravity = 180; // px/s
    this.gravitySpeed = 0;
    this.update = function() {
        ctx = game.context;
        
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
    this.newPos = function(dt) {
        // Update velocity
        this.speedY += -this.accelerationY;
        this.speedY *= this.clampY; // clamping

        // Update position
        this.x += this.speedX;
        this.y += (this.speedY + this.gravity) * dt;

        this.hitBottom();
    }
    this.hitBottom = function() {
        let rockBottom = game.canvas.height - this.height;
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

let currentTime = performance.now();

function updateGameArea() { 
    requestAnimationFrame(updateGameArea);

    const newTime = performance.now();
    const dt = (newTime - currentTime) / 1000; // deltaTime in seconds
    currentTime = newTime;

    let x, height, gap, minHeight, maxHeight, minGap, maxGap;
    for (i = 0; i < obstacles.length; i += 1) { //loop through every obstacle to see if there is a crash
        if (player.crashWith(obstacles[i])) {
            game.stop();
            return;
        } 
    }
    game.clear();
    game.frameNo += 1;
    if (game.frameNo == 1 || everyinterval(150)) {
        x = game.canvas.width;
        minHeight = 20;
        maxHeight = 200;
        height = Math.floor(Math.random()*(maxHeight-minHeight+1)+minHeight);
        minGap = 50;
        maxGap = 200;
        gap = Math.floor(Math.random()*(maxGap-minGap+1)+minGap);
        obstacles.push(new component(10, height, "green", x, 0));
        obstacles.push(new component(10, x - height - gap, "green", x, height + gap));
    }
    for (i = 0; i < obstacles.length; i += 1) {
        obstacles[i].x += -1;
        obstacles[i].update();
    }
    score.text="SCORE: " + game.frameNo;
    score.update();
    player.newPos(dt);    
    player.update();
}

//a method for execute something at a given frame rate.
function everyinterval(n){
    if ((game.frameNo / n) % 1 == 0) {return true;}
    return false;
}

//create keyboard controller
window.addEventListener('keydown', fly);
window.addEventListener('keyup', flyDown);

let isSpaceDown = false;
let impulse = -600;

function fly(e) {
    if (e.code === "Space" && !isSpaceDown) {
        isSpaceDown = true;
        player.speedY = impulse;
    } 
}

function flyDown(e) {
    if (e.code === "Space" && isSpaceDown) {
        isSpaceDown = false;
    } 
}
