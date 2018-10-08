const UP = 0;
const RIGHT = 4;
const DOWN = 8;
const LEFT = 12;
const MOVING_FR = 150; // Moving framerate
const TURNING_FR = ~~(MOVING_FR/8); // Integer division
const STEP_DELAY = 10 // Time between movements

var img, img1;
var playerOne;
var playerTwo;
var activePlayer = 0;

function preload() {
	img = loadImage('img/pegman.png');
    img1 = loadImage('img/astro.png');
};

function setup() {
    var myCanvas = createCanvas(500, 500);
    background(255, 250, 191);
    myCanvas.parent('myCanvas');
    frameRate(MOVING_FR);
    playerOne = new Player('pegman', img);
    playerTwo = new Player('astro', img1);
    playerOne.spawn(function dummy() {console.log('spawned from setup one');});
    playerTwo.spawn(function dummy() {console.log('spawned from setup two');}, 450, 450, UP);
};

function Player(name, img) {
    this.over = false;
    var name = name;
    var sprite = img;
    var posX, nPosX, posY, nPosY;
    var direction, nDirection, dirAngle;
    var pix;
    var spawned = function() {
        return posX != undefined  &&  posY != undefined;
    };
    this.spawn = function(callback, x, y, dir) {
        console.log('spawn called for ' + name);
        posX = nPosX = x!=undefined ? x:0;
        posY = nPosY = y!=undefined ? y:0;
        direction = nDirection = dirAngle = dir!=undefined ? dir:DOWN;
        pix = sprite.get(direction*49, 0, 50, 50);
        console.log(name + ' spawned');
        activePlayer++;
        activePlayer = activePlayer % 2;
        callback('spawned');
    };
    
    this.move = function(callback) {
      frameRate(MOVING_FR);
      console.log(name + ' moving');
      switch (direction) {
        case DOWN :
          if (posY < 450) nPosY += 50;
          break;
        case RIGHT :
          if (posX < 450) nPosX += 50;
          break;
        case UP :
          if (posY > 0) nPosY -= 50;
          break;
        case LEFT :
          if (posX > 0) nPosX -= 50;
          break;
      };
      function myTimer() {
        if (posX === nPosX && posY === nPosY) {
          console.log(name + ' moved');
          activePlayer++;
          activePlayer = activePlayer % 2;
          clearTimeout(timer);
          callback('moved');
        };
      };
      var timer = setInterval(myTimer, 5);
    };
    
    this.turn = function(dir, callback) {
      frameRate(TURNING_FR);
      console.log(name + ' turning');
      switch (dir) {
        case 'turnLeft' :
          switch (direction) {
            case UP :
              nDirection = LEFT;
              break;
            case LEFT :
              nDirection = DOWN;
              break;
            case DOWN :
              nDirection = RIGHT;
              break;
            case RIGHT :
              nDirection = UP;
              break;
          };
          break;
        case 'turnRight' :
          switch (direction) {
            case UP :
              nDirection = RIGHT;
              break;
            case RIGHT :
              nDirection = DOWN;
              break;
            case DOWN :
              nDirection = LEFT;
              break;
            case LEFT :
              nDirection = UP;
              break;
          };
          break;
      };
      function myTimer() {
        if (direction === nDirection) {
          console.log(name + ' turned');
          activePlayer++;
          activePlayer = activePlayer % 2;
          clearTimeout(timer);
          callback();      
        };
      };
      var timer = setInterval(myTimer, 5);
    };

    this.draw = function() {
        if (spawned()) {
            // Turning
            if (direction != nDirection) {
                switch (direction) {
                  case UP : // We're at 0
                    switch (nDirection) {
                      case RIGHT :
                        ++dirAngle;
                        if (dirAngle === RIGHT) direction = nDirection;
                        break;
                      case LEFT :
                        if (dirAngle === 0) dirAngle = 16; // First move to the left
                        --dirAngle;
                        if (dirAngle === LEFT) direction = nDirection;
                        break;
                    };
                    break;
                  
                  case RIGHT : // We're at 4
                    switch (nDirection) {
                      case DOWN :
                        ++dirAngle;
                        if (dirAngle === DOWN) direction = nDirection;
                        break;
                      case UP :
                        --dirAngle;
                        if (dirAngle === UP) direction = nDirection;
                        break;
                    };
                    break;

                  case DOWN : // We're at 8
                    switch (nDirection) {
                      case LEFT :
                        ++dirAngle;
                        if (dirAngle === LEFT) direction = nDirection;
                        break;
                      case RIGHT :
                        --dirAngle;
                        if (dirAngle === RIGHT) direction = nDirection;
                        break;
                    };
                    break;

                  case LEFT : // We're at 12
                    switch (nDirection) {
                      case UP :
                        ++dirAngle;
                        if (dirAngle === 16) { // Last move to the right
                          dirAngle = 0;
                          direction = nDirection; // We're at UP
                        };
                        break;
                      case DOWN :
                        --dirAngle;
                        if (dirAngle === DOWN) direction = nDirection;
                        break;
                    };
                    break;

                };
                pix = sprite.get(dirAngle*49, 0, 50, 50); // turning sprite
            };
            
            // Moving
            if (posX < nPosX) posX++;
            if (posY < nPosY) posY++;
            if (posX > nPosX) posX--;
            if (posY > nPosY) posY--;
            
            // Actually drawing the cropped image
            image(pix, posX, posY, 50, 50)
        };
    };
    
    this.facingWall = function(callback) {
      switch (direction) {
        case DOWN :
          callback(posY >= 450);
          break;
        case RIGHT :
          callback(posX >= 450);
          break;
        case UP :
          callback(posY <= 0);
          break;
        case LEFT :
          callback(posX <= 0);
          break;
      };  
    };
};

// Drawing main canvas
function draw() {
	background(255, 252, 191);
    playerOne.draw();
    playerTwo.draw();
};
