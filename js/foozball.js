var metaChar = false;
var exampleKey = 16;
var horizontal_factor = 4;
var ball_factor = 1;
var ball_direction_y = 0; // 1, -1
var ball_direction_x = 0;

// Max and Min Dimentions
var viewport_min_y = 0;
var viewport_max_y = 0;

var viewport_w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0)
var viewport_h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0)

// Objects
var raquet_a = null;
var raquet_b = null;
var ball = null;

// Score
var game_interval = null;
var game_score = [0,0];

var debug = function(input) {
    console.log(input);
}

var get_position_pixels = function (el) {
        var _x = 0;
        var _y = 0;
        while( el && !isNaN( el.offsetLeft ) && !isNaN( el.offsetTop ) ) {
            _x += el.offsetLeft - el.scrollLeft;
            _y += el.offsetTop - el.scrollTop;
            el = el.offsetParent;
        }
        debug("top: "+_y+", left: " + _x);
        return { y: _y, x: _x };
}


function Raquet(x, y, w, h, delement) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;

    this.delement = delement;
    this.obj = document.getElementById(delement);

    console.log(this.delement + '\'s instantiated: x:' + this.x +', y:'+ this.y +', w:'+ this.w +', h:'+ this.h);

    this.obj.style.width = this.w + 'vw';
    this.obj.style.height = this.h + 'vh';
    this.obj.style.left = this.x + 'vw';
    this.obj.style.top = this.y + 'vh';

    this.set_color = function(new_color) {
        this.obj.style.background = "linear-gradient(gray, "+ new_color +")";
    }

    this.animate_hit = function() {
        console.log("Animating hit for " + this.obj.id);
        this.obj.classList.add('hit-animation');
        this.obj.addEventListener("animationend", this.clear_animation);
    }

    this.clear_animation = function() {
        document.getElementById(delement).classList.remove('hit-animation');
    }

    this.move_vertically = function(factor) {
        if(factor < 0 && factor + this.y < 0) return;
        if(factor > 0 && (this.y + this.h) >= viewport_max_y) return;

        this.y = this.y + factor;
        this.obj.style.top = this.y+"vh"; 
    }

    this.set_position_y = function (pos_y) {
        this.y = pos_y;
        this.obj.style.top = pos_y + "vh";
    }

    this.get_position_pixels = function () {
        var _x = 0;
        var _y = 0;
        var el = this.obj;
        while( el && !isNaN( el.offsetLeft ) && !isNaN( el.offsetTop ) ) {
            _x += el.offsetLeft - el.scrollLeft;
            _y += el.offsetTop - el.scrollTop;
            el = el.offsetParent;
        }
        return { y: _y, x: _x };
    }
}




function Ball(x, y, w, h, delement) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;

    this.delement = delement;
    this.obj = document.getElementById(delement);

    this.obj.style.width = this.w + 'vw';
    this.obj.style.height = this.h + 'vw';

    this.obj.style.left = this.x + 'vw';
    this.obj.style.top = this.y + 'vh';


    this.move_ball = function(factor) {
        this.x = this.x + ( factor * ball_direction_x );
        this.y = this.y + ( factor * 2 * ball_direction_y );
        
        this.obj.style.top = this.y + 'vh'; 
        this.obj.style.left = this.x + 'vw'; 
    }

    this.get_position_pixels = function () {
        var _x = 0;
        var _y = 0;
        var el = this.obj;
        while( el && !isNaN( el.offsetLeft ) && !isNaN( el.offsetTop ) ) {
            _x += el.offsetLeft - el.scrollLeft;
            _y += el.offsetTop - el.scrollTop;
            el = el.offsetParent;
        }
        debug("top: "+_y+", left: " + _x);
        return { top: _y, left: _x };
    }
}




function keyEvent(event) {
  var key = event.keyCode || event.which;
  var keychar = String.fromCharCode(key);
  if (key == exampleKey) {
    metaChar = true;
  }
  if (key != exampleKey) {
    if (metaChar) {
      // console.log("Combination of metaKey + " + keychar);
      metaChar = false;
    } else {

        // console.log("Key pressed " + key);

        switch(key) {
            case 71: move_ball(); break; // G
            case 87: raquet_a.move_vertically(horizontal_factor * (0-1)); break; // W
            case 83: raquet_a.move_vertically(horizontal_factor); break; // S
            case 38: raquet_b.move_vertically(horizontal_factor * (0-1)); break; // W
            case 40: raquet_b.move_vertically(horizontal_factor); break; // S
            case 32: start_game(); break;
        }
    }
  }
}

function randomize(a, b) {
     return Math.floor((Math.random() * b) + a);
}

function metaKeyUp (event) {
  var key = event.keyCode || event.which;

  if (key == exampleKey) {
    metaChar = false;
  }
}

function show_score() {
    alert("Score!");
    document.getElementById("score_display").innerHTML = "Current Score: " + game_score[0] + " - " + game_score[1];
}

function handle_score(ball_obj) {
    stop_game();
    if(ball_obj.x <= 0)  {
        game_score[1] = game_score[1] += 1;
    }
    if(ball_obj.x >= 100) {
        game_score[0] = game_score[0] += 1;
    }

    show_score();
    initialize();
}

function move_ball() {

    if(ball.x <= 0 || ball.x >= 100) handle_score(ball);

    if(ball.y <= 0) ball_direction_y = 1;
    if(ball.y+ball.h >= 90) ball_direction_y = -1;

    if( ball.x <= raquet_a.x + raquet_a.w) {
        if (ball.y >= raquet_a.y && ball.y <= (raquet_a.y + raquet_a.h)) {
            ball_direction_x = ball_direction_x * -1;  
            raquet_a.animate_hit();
        }
    }

    if( ball.x+ball.w >= raquet_b.x) {
        if (ball.y >= raquet_b.y && ball.y <= (raquet_b.y + raquet_b.h)) {
            ball_direction_x = ball_direction_x * -1;  
            raquet_b.animate_hit();
        }
    }

    ball.move_ball(ball_factor);
}

function start_game() {

    // Move ball randomly left or right
    ball_direction_x = (randomize(0,2)) == 1 ? 1 : -1;
    ball_direction_y = (randomize(0,2)) == 1 ? 1 : -1;
    console.log("Initial Ball Direction X: " + ball_direction_x);
    console.log("Initial Ball Direction Y: " + ball_direction_y);

    game_interval = window.setInterval(move_ball, 25);

}

function stop_game() {
    window.clearInterval(game_interval);
}


function initialize() {
    raquet_a = new Raquet(5, 36, 3, 30, "raquet_a");
    raquet_b = new Raquet(90, 36, 3, 30, "raquet_b");
    ball = new Ball(47,40, 7, 7, "ball");

    // Colors
    raquet_a.set_color("darkred");
    raquet_b.set_color("blue");
}


function close_dialog() {
    document.getElementById("dialog").style.visibility = "hidden";
    document.getElementById("dialog_title").innerHTML = "";
    document.getElementById("dialog_content").innerHTML = "";
}



function startup() {

  //document.onmousemove = handleMouseMove;
  // window.addEventListener("touchmove", handleMove, false);
  document.getElementById("raquet_b").addEventListener("touchmove", handleMoveBlue, false);
  document.getElementById("raquet_a").addEventListener("touchmove", handleMoveRed, false)
   
  debug("initialized.");
}


function handleMouseMove(event) {
    debug("Moving...");
    raquet_b.set_position_y( ( event.clientY / viewport_h) * 100 );
}

/*

function showposition(x) {
    var field = document.getElementById("field");
    var field_hight = field.offsetHeight;
    var pos_percentage = (x / viewport_h) * 100;

    document.getElementById("score_display").innerHTML = x + " vs " + field_hight + ", vp: " + viewport_h + ", %: " + pos_percentage;
}

*/


function handleMoveBlue(evt) {
    debug("Handle touch blue...");
    evt.preventDefault();
    var touches = evt.changedTouches;
    for (var i = 0; i < touches.length; i++) {
        raquet_b.set_position_y( ( touches[i].pageY / viewport_h) * 100 );
    }
}

function handleMoveRed(evt) {
    debug("Handle touch red...");
    evt.preventDefault();
    var touches = evt.changedTouches;
    for (var i = 0; i < touches.length; i++) {
        raquet_a.set_position_y( ( touches[i].pageY / viewport_h) * 100 );
    }
}


    function toggleFullScreen() {
        console.log("Toggling Full Screen...");
      if (!document.fullscreenElement &&    // alternative standard method
          !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement ) {  // current working methods
        if (document.documentElement.requestFullscreen) {
          document.documentElement.requestFullscreen();
        } else if (document.documentElement.msRequestFullscreen) {
          document.documentElement.msRequestFullscreen();
        } else if (document.documentElement.mozRequestFullScreen) {
          document.documentElement.mozRequestFullScreen();
        } else if (document.documentElement.webkitRequestFullscreen) {
          document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
        }
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen();
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) {
          document.webkitExitFullscreen();
        }
      }
    }

