const BLOCK_SIZE = 50;
const MAP_SIZE = 10;
const UP = 0;
const RIGHT = 4;
const DOWN = 8;
const LEFT = 12;
const MOVING_FR = 150; // Moving framerate, as high as possible...
const STEP_DELAY = 100 // Time between movements
const _ = 0 // empty square (stoneFloor)
const C = 1 // gold coin
const I = 2 // vertical wall
const H = 3 // horizontal wall


var DEBUG = false;
// TODO : detect infinite loops --> counting max moves
// TODO : detect logic bombs --> interpreter stack size

var img, img1;
var playerOne;
var playerTwo;
var activePlayer = 0;
var lastPlayer = 1;
var coinPos = 0;
var coinMap = [
  [I,H,H,H,H,H,H,H,H,I],
  [I,_,C,_,_,_,_,_,_,I],
  [I,C,_,_,_,_,_,_,_,I],
  [I,_,_,H,C,C,H,_,_,I],
  [I,_,_,C,C,C,C,_,_,I],
  [I,_,_,C,C,C,C,_,_,I],
  [I,_,_,H,C,C,H,_,_,I],
  [I,_,_,_,_,_,_,_,C,I],
  [I,_,_,_,_,_,_,C,_,I],
  [I,I,I,I,I,I,I,I,I,I]
]
function preload() {
  pegmanPng = loadImage('/static/img/pegman.png');
  astroPng = loadImage('/static/img/astro.png');
  pandaPng = loadImage('/static/img/panda.png');
  coinsPng = loadImage('/static/img/coins.png');
  stoneFloor = loadImage('/static/img/floor.jpg');
  hWall = loadImage('/static/img/h_wall.jpg');
  vWall = loadImage('/static/img/v_wall.jpg');
  soundFormats('mp3', 'ogg');
  coinSound = loadSound('/static/sounds/coin.mp3');
};

function setup() {
  var myCanvas = createCanvas(MAP_SIZE*BLOCK_SIZE, MAP_SIZE*BLOCK_SIZE);
  background(255, 250, 191);
  myCanvas.parent('myCanvas');
  frameRate(MOVING_FR);
  playerOne = new Player('pegman', pegmanPng);
  playerTwo = new Player('astro', astroPng);
  playerOne.spawn(1, 1, DOWN);
  playerTwo.spawn(8, 8, UP);
};

function drawLabi() {
  coinPos = (coinPos + 1)%30
  coin = coinsPng.get(~~(coinPos/5)*15, 0, 15, 15); // Coin size and offset
  for (y=0; y<MAP_SIZE; y++) {
    for (x=0; x<MAP_SIZE; x++) {
      switch (coinMap[y][x]) {
        case H :
          image(hWall, x*BLOCK_SIZE, y*BLOCK_SIZE);
          break;
        case I :
          image(vWall, x*BLOCK_SIZE, y*BLOCK_SIZE);
          break;
        case _ :
          image(stoneFloor, x*BLOCK_SIZE, y*BLOCK_SIZE);
          break;
        case C :
          image(stoneFloor, x*BLOCK_SIZE, y*BLOCK_SIZE);
          image(coin, x*BLOCK_SIZE+17, y*BLOCK_SIZE+25)
          break;
      };
    }
  }
}

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
  
  var facingWall_ = function() {
    xIndex = posX/BLOCK_SIZE;
    yIndex = posY/BLOCK_SIZE;
    switch (direction) {
      case DOWN :
        block = coinMap[yIndex+1][xIndex];
        if ((block != C) && (block != _)) return true;
        return false;          
        break;
      case RIGHT :
        block = coinMap[yIndex][xIndex+1];
        if ((block != C) && (block != _)) return true;
        return false;          
        break;
      case UP :
        block = coinMap[yIndex-1][xIndex];
        if ((block != C) && (block != _)) return true;
        return false;          
        break;
      case LEFT :
        block = coinMap[yIndex][xIndex-1];
        if ((block != C) && (block != _)) return true;
        return false;          
        break;
    }    
  }
  
  this.spawn = function(x, y, dir) {
    posX = nPosX = x!=undefined ? x*BLOCK_SIZE:0;
    posY = nPosY = y!=undefined ? y*BLOCK_SIZE:0;
    direction = nDirection = dirAngle = dir!=undefined ? dir:DOWN;
    pix = sprite.get(direction*49, 0, BLOCK_SIZE, BLOCK_SIZE);
    activePlayer++;
    activePlayer = activePlayer % 2;
  };
  
  this.move = function(callback) {
    if (DEBUG) console.log('--' + name + ' moving');
    if ( !facingWall_()) {
      switch (direction) {
        case DOWN :
          nPosY += BLOCK_SIZE;
          break;
        case RIGHT :
          nPosX += BLOCK_SIZE;
          break;
        case UP :
          nPosY -= BLOCK_SIZE;
          break;
        case LEFT :
          nPosX -= BLOCK_SIZE;
          break;
      }    
    }
    function myTimer() {
      if (posX == nPosX && posY == nPosY) {
        if (coinMap[posY/BLOCK_SIZE][posX/BLOCK_SIZE] == C) {
          coinSound.play();
          coinMap[posY/BLOCK_SIZE][posX/BLOCK_SIZE] = _;
        }
        activePlayer++;
        activePlayer = activePlayer % 2;
        if (DEBUG) console.log('--' + name + 
          ' moved, now active player is ' + activePlayer);
        clearTimeout(timer);
        callback('moved');
      };
    };
    var timer = setInterval(myTimer, 5);
  };
  
  this.turn = function(dir, callback) {
    if (DEBUG) console.log('--' + name + ' turning');
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
        if (DEBUG) console.log('--' + name + ' turned');
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
        pix = sprite.get(dirAngle*49, 0, BLOCK_SIZE, BLOCK_SIZE); // rotate
      };
      
      // Moving
      if (posX < nPosX) posX++;
      if (posY < nPosY) posY++;
      if (posX > nPosX) posX--;
      if (posY > nPosY) posY--;
      
      // Actually drawing the cropped image
      image(pix, posX, posY, BLOCK_SIZE, BLOCK_SIZE)
    };
  };

  this.facingWall = function(callback) {
    callback(facingWall_());
  };
};

// Drawing main canvas
function draw() {
  drawLabi();
  playerOne.draw();
  playerTwo.draw();
};
