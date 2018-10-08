var interpreter0;
var interpreter1;

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
}

function runBtn() {
    disable('disabled');
    activePlayer = 0;
    run0();
    run1();
}

function run0() {
  if ((activePlayer != 0) && (!interpreter0.player.over)) {
      setTimeout(run0, 10);
  } else {
      if (interpreter0.run()) {
        // Ran until an async call.  Give this call a chance to run.
        // Then start running again later.
        setTimeout(run0, 5);
      } else {
        console.log("1 finished");
        activePlayer++;
        activePlayer %= 2;
        if ( !interpreter1.player.over ) setTimeout(run0, 1000);
      }
  }
}

function run1() {
  if ((activePlayer != 1) && (!interpreter1.player.over)) {
      setTimeout(run1, 10);
  } else {
      if (interpreter1.run()) {
        // Ran until an async call.  Give this call a chance to run.
        // Then start running again later.
        setTimeout(run1, 5);
      } else {
        console.log("2 finished")
        activePlayer++;
        activePlayer %= 2;
        if ( !interpreter1.player.over ) setTimeout(run0, 1000);
      }
  }
}

function disable(disabled) {
  document.getElementById('runBtn').disabled = disabled;
}
