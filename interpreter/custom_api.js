function initAlert(interpreter, scope) {
  //////////////////////////////////////////////
  // Alert
  var wrapper = function(text) {
    return alert(arguments.length ? text : '');
  };
  interpreter.setProperty(scope, 'alert',
      interpreter.createNativeFunction(wrapper));
  /*------------------------------------------*/

  ///////////////////////////////////////////////
  // Prompt
  var wrapper = function(text)  {
    return prompt(arguments.length ? text : '');
  };
  interpreter.setProperty(scope, 'window.prompt',
      interpreter.createNativeFunction(wrapper));
  /*------------------------------------------*/

  ///////////////////////////////////////////////
  // Spawn
  var wrapper = function(callback) {
    // interpreter.player.spawn(callback);
    setTimeout(interpreter.player.spawn, STEP_DELAY, callback);
  }
  interpreter.setProperty(scope, 'spawn',
      interpreter.createAsyncFunction(wrapper));
  /*------------------------------------------*/

  ///////////////////////////////////////////////
  // Move
  var wrapper = function(callback) {
    // interpreter.player.move(callback);
    setTimeout(interpreter.player.move, STEP_DELAY, callback);
  }
  interpreter.setProperty(scope, 'move',
      interpreter.createAsyncFunction(wrapper));
  /*------------------------------------------*/

  ///////////////////////////////////////////////
  // Turn
  var wrapper = function(direction, callback) {
    // interpreter.player.turn(direction, callback);
    setTimeout(interpreter.player.turn, STEP_DELAY, direction, callback);
  }
  interpreter.setProperty(scope, 'turn',
      interpreter.createAsyncFunction(wrapper));
  /*------------------------------------------*/

  ///////////////////////////////////////////////
  // Facing a wall ?
  var wrapper = function(callback) {
    interpreter.player.facingWall(callback);
  }
  interpreter.setProperty(scope, 'facingWall',
      interpreter.createAsyncFunction(wrapper));
  /*------------------------------------------*/
}

