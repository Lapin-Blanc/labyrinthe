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

function runBtn() {
    disable('disabled');
    activePlayer = 0;
    run0();
    run1();
}

function r0() {
	if ( (count0>0) && (count1>0)) {
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
			console.log('c0 = ' + count0 + ' calling r1 with active player ' + activePlayer);
			setTimeout(r1, 500)
        }
    } else {
		
		console.log('calling r1 with count0 = ' + count0);
        setTimeout(r1, 500)
    }		
}
function r1() {
	if ( (count0>0) && (count1>0)) {
		console.log('Game over, next player = ' + activePlayer);
		return;
    }
    if (activePlayer == 1) {
        if (interpreter1.run()) {
			count1 = 0;
            setTimeout(r1, 1)
        } else {
        	count1++;
			activePlayer = (activePlayer+1)%2
			console.log('c1 = ' + count1 + ' calling r0 with active player ' + activePlayer);
			setTimeout(r1, 500)
		}
    } else {
		
		console.log('calling r0 with count1 = ' + count1);
        setTimeout(r0, 500)
    }		
}


function run0() {
  if (!(interpreter0.player.over && interpreter1.player.over)) {
    if ((activePlayer == 1) && (!interpreter0.player.over)) {
        setTimeout(run0, 10);
    } else {
        if (interpreter0.run()) {
          // Ran until an async call.  Give this call a chance to run.
          // Then start running again later.
          setTimeout(run0, 5);
        } else {
          console.log("1 finished");
          interpreter0.player.over = true;
          activePlayer++;
          activePlayer %= 2;
          if ( !interpreter1.player.over ) setTimeout(run0, 1000);
        }
    }
  }
}

function run1() {
  if (!(interpreter0.player.over && interpreter1.player.over)) {
    if ((activePlayer == 0) && (!interpreter1.player.over)) {
        setTimeout(run1, 10);
    } else {
        if (interpreter1.run()) {
          // Ran until an async call.  Give this call a chance to run.
          // Then start running again later.
          setTimeout(run1, 5);
        } else {
          console.log("2 finished")
          interpreter1.player.over = true;
          activePlayer++;
          activePlayer %= 2;
          if ( !interpreter0.player.over ) setTimeout(run1, 1000);
        }
    }
  }
}

function disable(disabled) {
  document.getElementById('runBtn').disabled = disabled;
}
