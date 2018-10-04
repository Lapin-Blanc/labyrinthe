var framerate = 60;
var posX, posY;
var nPosX, nPosY;
var direction = nDirection = 'up';
var dirAngle = 0; // Up
var img, peg;

function preload() {
	img = loadImage('img/pegman.png');
}

function setup() {
	var myCanvas = createCanvas(500, 500);
	background(255, 250, 191);
	myCanvas.parent('myCanvas');
	frameRate(framerate);
	peg = img.get(dirAngle*49,0,50,50);
};


function draw() {
	background(255, 252, 191);
  
  // Turning
	if (direction != nDirection) {
    switch (direction) {
      case 'up' : // We're at 0
        switch (nDirection) {
          case 'right' :
            ++dirAngle;
            if (dirAngle === 4) direction = nDirection;
            break;
          case 'left' :
            if (dirAngle === 0) dirAngle = 16;
            --dirAngle;
            if (dirAngle === 12) {
              direction = nDirection;
            }
            break;
        };
        break;
      
      case 'right' : // We're at 4
        switch (nDirection) {
          case 'down' :
            ++dirAngle;
            if (dirAngle === 8) direction = nDirection;
            break;
          case 'up' :
            --dirAngle;
            if (dirAngle === 0) {
              direction = nDirection;
            };
            break;
        };
        break;

      case 'down' : // We're at 8
        switch (nDirection) {
          case 'left' :
            ++dirAngle;
            if (dirAngle === 12) direction = nDirection;
            break;
          case 'right' :
            --dirAngle;
            if (dirAngle === 4) direction = nDirection;
            break;
        };
        break;

      case 'left' : // We're at 12
        switch (nDirection) {
          case 'up' :
            ++dirAngle;
            if (dirAngle === 16) {
              dirAngle = 0;
              direction = nDirection;
            };
            break;
          case 'down' :
            --dirAngle;
            if (dirAngle === 8) direction = nDirection;
            break;
        };
        break;

    };
    peg = img.get(dirAngle*49, 0, 50, 50);
	};
  
  // Moving or turning 
	if (posX != undefined && posY != undefined) {
		if (posX < nPosX) posX++;
		if (posY < nPosY) posY++;
		if (posX > nPosX) posX--;
		if (posY > nPosY) posY--;
    image(peg, posX, posY, 50, 50);
	};		
};

function mazeSpawn(callback) {
	posX = nPosX = 200;
	posY = nPosY = 200;
	direction = nDirection = "up";
	dirAngle = 0;
	peg = img.get(dirAngle*49, 0, 50, 50);
	// image(peg, posX, posY);
  callback();
}

function mazeMove(callback) {
  framerate = 60;
  switch (direction) {
    case 'down' :
      nPosY += 50;
      break;
    case 'right' :
      nPosX += 50;
      break;
    case 'up' :
      nPosY -= 50;
      break;
    case 'left' :
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

function mazeTurn(dir, callback) {
  framerate = 5;
  switch (dir) {
    case 'turnLeft' :
      switch (direction) {
        case 'down' :
          nDirection = "right";
          break;
        case 'right' :
          nDirection = "up";
          break;
        case 'up' :
          nDirection = "left";
          break;
        case 'left' :
          nDirection = "down";
          break;
      };
      break;
    case 'turnRight' :
      switch (direction) {
        case 'up' :
          nDirection = "right";
          break;
        case 'down' :
          nDirection = "left";
          break;
        case 'right' :
          nDirection = "down";
          break;
        case 'left' :
          nDirection = "up";
          break;
      };
      break;
  };
  var timer = setInterval(myTimer, 5);
  function myTimer() {
    if (direction === nDirection) {
			clearTimeout(timer);
      callback();      
    }
  };
};

function mazeFacingWall(callback) {
  switch (direction) {
    case 'down' :
      callback(posY >= 450);
      break;
    case 'right' :
      // alert(posX);
      callback(posX >= 450);
      break;
    case 'up' :
      callback(posY <= 0);
      break;
    case 'left' :
      callback(posX <= 0);
      break;
  };  
}
