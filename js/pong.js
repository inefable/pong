var window_width = $(window).width();
var window_height = $(window).height();
var win = 5; 

var ball = {
  width:        30,
  height:       30,
  speed:        2,
  x:            0, 
  y:            0,
  xDirection:   1, 
  yDirection:   0
   
}

var p1 = {
  up_key:       "81", // Q
  down_key:     "65", // A
  width:        30,
  height:       180,
  score:        0,
  x:            0,
  y:            0,
  move:         [0,0], // [up,down]
  speed:        2,
  topLimit:     0,
  wallDistance: 100, 
  bottomLimit:  0
};

var p2 = {
  up_key:       "80", // P
  down_key:     "76", // L
  width:        30,
  height:       180,
  score:        0,
  x:            0,
  y:            0,
  move:         [0,0], // [up,down]
  speed:        2,
  topLimit:     0,
  wallDistance: 100, 
  bottomLimit:  0
};

function init_game() {

  $("#ball").width(ball.width).height(ball.height);         // Set ball size

  ball.x = Math.floor(window_width/2  - ball.width/2);      // Set ball position (variable)
  ball.y = Math.floor(window_height/2 - ball.height/2);
  
  $("#ball").css({                                          // Set ball position (css)
    top:  ball.y,
    left: ball.x 
  });

  $("#p1").width(p1.width).height(p1.height);               // Set players size
  $("#p2").width(p2.width).height(p2.height);

  p1.x = 0+p1.wallDistance;                                 // Set players position (variable)
  p1.y = Math.floor(window_height/2 - p1.height/2);
  p2.x = window_width-p2.width-p2.wallDistance;
  p2.y = Math.floor(window_height/2 - p2.height/2);
  
  $("#p1").css({ top: p1.y, left: p1.x });  // Set players position (css)
  $("#p2").css({ top: p2.y, left: p2.x });

  p1.bottomLimit = window_height - p1.height;               // Set players bottom limit
  p2.bottomLimit = window_height - p2.height;
}

function move_player() {
  
  if(p1.y>p1.bottomLimit) p1.y=p1.bottomLimit;                                  // P1 hits the bottom border
  if(p1.y<p1.topLimit)    p1.y=p1.topLimit;                                     // P1 hits the top border
  if(p2.y>p2.bottomLimit) p2.y=p2.bottomLimit;                                  // P2 hits the bottom border
  if(p2.y<p2.topLimit)    p2.y=p2.topLimit;                                     // P2 hits the top border

  if(p1.y<=p1.bottomLimit && p1.move[0]) $("#p1").css({top: p1.y-=1*p1.speed}); // P1 moves up 
  if(p1.y>=p1.topLimit    && p1.move[1]) $("#p1").css({top: p1.y+=1*p1.speed}); // P1 moves down 
  if(p2.y<=p2.bottomLimit && p2.move[0]) $("#p2").css({top: p2.y-=1*p2.speed}); // P1 moves up 
  if(p2.y>=p2.topLimit    && p2.move[1]) $("#p2").css({top: p2.y+=1*p2.speed}); // P1 moves down 

}

function move_ball() {
  
  $("#ball").css({left: ball.x+=1*ball.speed*ball.xDirection});
  $("#ball").css({top:  ball.y+=1*ball.speed*ball.yDirection});
  
  hitWall();
  hitPlayer();
  
}

function hitPlayer() {
  
  var p1_position = {
    top:    p1.y,
    bottom: p1.y+p1.height,
    left:   p1.x,
    right:  p1.x+p1.width
  }
  
  var p2_position = {
    top:    p2.y,
    bottom: p2.y+p2.height,
    left:   p2.x,
    right:  p2.x+p2.width
  }

  var hit = {
    flag:   false,
    player: 0,
    x:      0,
    y:      0
  }

  if(
    ball.x >= p1_position.left && 
    ball.x <= p1_position.right && 
    ball.y+ball.height-1 >= p1_position.top && 
    ball.y+1 <= p1_position.bottom && 
    ball.xDirection < 0) {
      ball.xDirection = -ball.xDirection;
      hit.flag=true;
      hit.player=1;

      if(p1_position.top-ball.y > ball.height/2)
        hit.y=0;
      else if(ball.y+ball.height-p1_position.bottom > ball.height/2)
        hit.y=p1.height;
      else
        hit.y=ball.y-p1_position.top+ball.height/2;
  }


  if(
    ball.x+ball.width >= p2_position.left && 
    ball.x+ball.width <= p2_position.right && 
    ball.y+ball.height-1 >= p2_position.top && 
    ball.y-1 <= p2_position.bottom && 
    ball.xDirection > 0) {
      ball.xDirection = -ball.xDirection;
      hit.flag=true;
      hit.player=2;

      if(p2_position.top-ball.y > ball.height/2)
        hit.y=0;
      else if(ball.y+ball.height-p2_position.bottom > ball.height/2)
        hit.y=p2.height;
      else
        hit.y=ball.y-p2_position.top+ball.height/2;
  }

  if(hit.flag) {
    var hit_position_percent;
    if(hit.player==1) {
      hit_position_percent = (hit.y/p1.height);
      ball.yDirection=0.8*(hit_position_percent-0.5)*2;
    }
    else if(hit.player==2) {
      hit_position_percent = (hit.y/p1.height);
      ball.yDirection=0.8*(hit_position_percent-0.5)*2;
    }
    if(ball.speed < 6)
      ball.speed+=0.2;
  }
}

function hitWall() {
  
  if(ball.x < 0) {
    ball.x = 0;
    ball.xDirection = -ball.xDirection;
    score(2);
  }
  
  if(ball.x > window_width-ball.width) {
    ball.x = window_width-ball.width;
    ball.xDirection = -ball.xDirection;
    score(1);
  }
  
  if(ball.y < 0) {
    ball.y = 0;
    ball.yDirection = -ball.yDirection;
  }
  
  if(ball.y > window_height-ball.height) {
    ball.y = window_height-ball.height;
    ball.yDirection = -ball.yDirection;
  }
}

function score(player) {
  if(player == 1) {
    p1.score++
    $("#p1Score").text(p1.score);
  }
  else if(player == 2) {
    p2.score++
    $("#p2Score").text(p2.score);
  }
  if(p1.score == win || p2.score == win) {
    ball.speed=0;
    alert("Victory!");
    return;
  }
  ball.speed=2;
}

function handlerDown(e) {
  if(e.keyCode == "81") { p1.move[0]=1 } // Press P1 up
  if(e.keyCode == "65") { p1.move[1]=1 } // Press P1 down
  if(e.keyCode == "80") { p2.move[0]=1 } // Press P2 up
  if(e.keyCode == "76") { p2.move[1]=1 } // Press P2 down
}

function handlerUp(e) {
  if(e.keyCode == "81") { p1.move[0]=0 } // Release P1 up
  if(e.keyCode == "65") { p1.move[1]=0 } // Release P1 down
  if(e.keyCode == "80") { p2.move[0]=0 } // Release P2 up
  if(e.keyCode == "76") { p2.move[1]=0 } // Release P2 down      
}

function main(){
	  
  $(document).on("keydown",function(e){
    handlerDown(e);
  });
  $(document).on("keyup",function(e){
    handlerUp(e);
  });

  setInterval(function(){
    move_player();
    move_ball();
  }, 1);
}

init_game();
main();