var myInterpreter;

function parseButton() {
  var code = document.getElementById('javascript-code').value;
  myInterpreter = new Interpreter(code, initAlert);
  myInterpreter.player = playerOne; // from labyrinthe.js
  disable('');
}

function stepButton() {
  if (myInterpreter.stateStack.length) {
    var node =
        myInterpreter.stateStack[myInterpreter.stateStack.length - 1].node;
    var start = node.start;
    var end = node.end;
  } else {
    var start = 0;
    var end = 0;
  }
  createSelection(start, end);
  try {
    var ok = myInterpreter.step();
  } finally {
    if (!ok) {
      disable('disabled');
    }
  }
}

function runButton() {
  disable('disabled');
  if (myInterpreter.run()) {
    // Ran until an async call.  Give this call a chance to run.
    // Then start running again later.
    setTimeout(runButton, 10);
  }
}

function disable(disabled) {
  document.getElementById('stepButton').disabled = disabled;
  document.getElementById('runButton').disabled = disabled;
}

function createSelection(start, end) {
  var field = document.getElementById('javascript-code');
  if (field.createTextRange) {
    var selRange = field.createTextRange();
    selRange.collapse(true);
    selRange.moveStart('character', start);
    selRange.moveEnd('character', end);
    selRange.select();
  } else if (field.setSelectionRange) {
    field.setSelectionRange(start, end);
  } else if (field.selectionStart) {
    field.selectionStart = start;
    field.selectionEnd = end;
  }
  field.focus();
}
