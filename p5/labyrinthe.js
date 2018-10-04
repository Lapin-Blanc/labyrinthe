const UP = 0;
const RIGHT = 4;
const DOWN = 8;
const LEFT = 12;

var framerate = 60;
var posX, posY;
var nPosX, nPosY;
var direction = nDirection = UP;
var dirAngle = UP;
var img, peg;
var playerOne;

function preload() {
	img = loadImage('img/astro.png');
};

function setup() {
    var myCanvas = createCanvas(500, 500);
    background(255, 250, 191);
    myCanvas.parent('myCanvas');
    frameRate(framerate);
    playerOne = new Player(img);
};

function Player(img) {
    var sprite = img;
    var posX, nPosX, posY, nPosY;
    var direction, nDirection, dirAngle;
    var pix;
    var spawned = function() {
        return posX != undefined  &&  posY != undefined;
    };
    
    this.spawn = function(callback, x, y, dir) {
        posX = nPosX = x!=undefined ? x:0;
        posY = nPosY = y!=undefined ? y:0;
        direction = nDirection = dirAngle = dir!=undefined ? dir:DOWN;
        pix = sprite.get(direction*49, 0, 50, 50);
        callback();
    };
    
    this.move = function(callback) {
      framerate = 60;
      switch (direction) {
        case DOWN :
          nPosY += 50;
          break;
        case RIGHT :
          nPosX += 50;
          break;
        case UP :
          nPosY -= 50;
          break;
        case LEFT :
          nPosX -= 50;
          break;
      };
      var timer = setInterval(myTimer, 5);
        function myTimer() {
            if (posX === nPosX && posY === nPosY) {
                clearTimeout(timer);
                callback();
            };
        };
    };
    
    this.turn = function(dir, callback) {
      framerate = 5;
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
      var timer = setInterval(myTimer, 5);
      function myTimer() {
        if (direction === nDirection) {
          clearTimeout(timer);
          callback();      
        };
      };
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
};
