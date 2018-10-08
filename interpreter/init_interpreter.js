var interpreter0;
var interpreter1;

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
    console.log('Player one starting');
    run0();
    console.log('Player two starting');
    run1();
}

function run0() {
  if ((activePlayer != 0) && (!interpreter0.player.over)) {
      setTimeout(run0, 10);
  } else {
      if (interpreter0.run()) {
        // Ran until an async call.  Give this call a chance to run.
        // Then start running again later.
        setTimeout(run0, 10);
      } else {
          interpreter0.player.over = true;
      }
  }
}

function run1() {
  if ((activePlayer != 1) && (!interpreter0.player.over)) {
      setTimeout(run1, 10);
  } else {
      if (interpreter1.run()) {
        // Ran until an async call.  Give this call a chance to run.
        // Then start running again later.
        setTimeout(run1, 10);
      } else {
          interpreter1.player.over = true;
      }
  }
}

function disable(disabled) {
  document.getElementById('runBtn').disabled = disabled;
}
