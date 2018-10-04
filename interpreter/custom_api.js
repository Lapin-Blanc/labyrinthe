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
  // Attends
  var wrapper = function(qui, temps, callback) {
    setTimeout(function(s) {callback(s);}, temps*1000, qui);
  }
  interpreter.setProperty(scope, 'attends',
      interpreter.createAsyncFunction(wrapper));
  /*------------------------------------------*/        

  ///////////////////////////////////////////////
  // Spawn
  var wrapper = function(callback) {
    mazeSpawn(callback);
  }
  interpreter.setProperty(scope, 'spawn',
      interpreter.createAsyncFunction(wrapper));
  /*------------------------------------------*/        

  ///////////////////////////////////////////////
  // Move
  var wrapper = function(callback) {
    mazeMove(callback);
  }
  interpreter.setProperty(scope, 'move',
      interpreter.createAsyncFunction(wrapper));
  /*------------------------------------------*/        

  ///////////////////////////////////////////////
  // Turn
  var wrapper = function(direction, callback) {
    mazeTurn(direction, callback);
  }
  interpreter.setProperty(scope, 'turn',
      interpreter.createAsyncFunction(wrapper));
  /*------------------------------------------*/        

  ///////////////////////////////////////////////
  // Facing a wall ?
  var wrapper = function(callback) {
    mazeFacingWall(callback);
  }
  interpreter.setProperty(scope, 'facingWall',
      interpreter.createAsyncFunction(wrapper));
  /*------------------------------------------*/        
}

