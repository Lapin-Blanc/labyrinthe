const UP = 0;
const RIGHT = 4;
const DOWN = 8;
const LEFT = 12;
const MOVING_FR = 80; // Moving framerate
const TURNING_FR = ~~(MOVING_FR/8); // Integer division

var posX, posY;
var nPosX, nPosY;
var direction = nDirection = UP;
var dirAngle = UP;
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
        var retour = function(callback) {
            posX = nPosX = x!=undefined ? x:0;
            posY = nPosY = y!=undefined ? y:0;
            direction = nDirection = dirAngle = dir!=undefined ? dir:DOWN;
            pix = sprite.get(direction*49, 0, 50, 50);
            activePlayer = ++activePlayer;
            activePlayer = activePlayer % 2;
            console.log(name + ' spawned');
            callback('spawned');
        };
        setTimeout(retour , 500, callback);        
    };
    
    this.move = function(callback) {
      frameRate(MOVING_FR);
      console.log(name + ' moving');
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
      function myTimer() {
        if (posX === nPosX && posY === nPosY) {
          clearTimeout(timer);
          activePlayer = ++activePlayer;
          activePlayer = activePlayer % 2;
          console.log(name + ' moved');
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
          clearTimeout(timer);
          activePlayer = ++activePlayer;
          activePlayer = activePlayer % 2;
          console.log(name + ' turned');
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
