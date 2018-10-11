var interpreter0;
var interpreter1;
var count0;
var count1;

function resetBtn() {
  setup(); // Reset labyrinthe  
}

function parseBtn() {
  var code = document.getElementById('javascript-code0').value;
  interpreter0 = new Interpreter(code, initAlert);
  interpreter0.player = playerOne; // from labyrinthe.js
  var code = document.getElementById('javascript-code1').value;
  interpreter1 = new Interpreter(code, initAlert);
  interpreter1.player = playerTwo; // from labyrinthe.js
  disable('');
  count0 = count1 = 0;
}

function r0() {
	if ( (count0>0) && (count1>0) ) {
		console.log('Game over, next player = ' + activePlayer);
		return;
    }
    if (activePlayer == 0) {
      if (interpreter0.run()) {
        count0 = 0;
        setTimeout(r0, 1)
      } else {
        count0++;
        activePlayer = (activePlayer+1)%2
        if (DEBUG) console.log('c0 = ' + count0 + 
          ' calling r1 with active player ' + activePlayer);
        setTimeout(r1, STEP_DELAY)
      }
    } else {		
      if (DEBUG) console.log('calling r1 with count0 = ' + count0);
      setTimeout(r1, STEP_DELAY)
    }		
}
function r1() {
	if ( (count0>0) && (count1>0) ) {
		console.log(' Game over, next player = ' + activePlayer);
		return;
    }
    if (activePlayer == 1) {
      if (interpreter1.run()) {
        count1 = 0;
        setTimeout(r1, 1)
      } else {
        count1++;
        activePlayer = (activePlayer+1)%2
        if (DEBUG) console.log(' c1 = ' + count1 +
          ' calling r0 with active player ' + activePlayer);
        setTimeout(r1, STEP_DELAY)
      }
    } else {		
      if (DEBUG) console.log(' calling r0 with count1 = ' + count1);
      setTimeout(r0, STEP_DELAY)
    }		
}

function disable(disabled) {
  document.getElementById('runBtn').disabled = disabled;
}
