var game;
var player1;
var player2;
var finishLine;
var ui;

var CANVAS_WIDTH = window.innerWidth - window.innerWidth/50;
var CANVAS_HEIGHT = window.innerHeight/2;
/*var CANVAS_WIDTH = ( (1024 < window.innerWidth - window.innerWidth/50) ? 1024 : window.innerWidth - window.innerWidth/50 );
var CANVAS_HEIGHT = ( (384 < window.innerHeight/2) ? 384 : window.innerHeight/2);*/
var canvasElement = $("<canvas width='" + CANVAS_WIDTH + 
                        "' height='" + CANVAS_HEIGHT + "'></canvas>");
var canvas = canvasElement.get(0).getContext("2d");
//var startTime;

function Game(playerAmount)
{
  this.playerAmount = playerAmount;
  this.hasWon;
  this.FPS = 30;
  this.winner;
  
  /*this.endTime;
  this.totalTime;
  this.timerStarted = false;
  this.timerID;*/

  Game.prototype.init = function()
  {    
    this.hasWon = false;
    canvasElement.appendTo('#game-board');
    player1 = new Player(($('#p1-name').val() ? $('#p1-name').val() : "Player 1"), ($('#p1-color').val() ? $('#p1-color').val() : "blue"), 10, CANVAS_HEIGHT / 10, CANVAS_WIDTH / 25, CANVAS_WIDTH / 25, "dash", this.FPS);
    player2 = new Player(($('#p2-name').val() ? $('#p2-name').val() : "Player 2"), ($('#p2-color').val() ? $('#p2-color').val() : "green"), 10, CANVAS_HEIGHT * 7 / 10, CANVAS_WIDTH / 25, CANVAS_WIDTH / 25, "dash", this.FPS);
    finishLine = new FinishLine("red", CANVAS_WIDTH - 30, 0, 15, CANVAS_HEIGHT);
    ui = new UI(false, this.FPS, 3);
  }

  Game.prototype.update = function()
  { 
    /*this.endTime = new Date();
    this.totalTime = Math.abs(this.endTime.getSeconds() - startTime.getSeconds());*/

    setInterval(function()
    {
        //console.log('can move');  
      if (player1 !== undefined && player2 !== undefined && finishLine !== undefined && ui.started)
      {
        if (keydown.a || keydown.s || keydown.d) {
            player1.move();
        }

        player1.x = player1.x.clamp(0, CANVAS_WIDTH - player1.width);

        if (keydown.j || keydown.k || keydown.l) {
            player2.move();
        }

        player2.x = player2.x.clamp(0, CANVAS_WIDTH - player2.width) 

        if (collides(player1, finishLine))
        {
          finishLine.handleCollision(player1);
        }
        else if (collides(player2, finishLine))
        {
          finishLine.handleCollision(player2);
        }
      }
      

      //this.draw();
      canvas.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      if (player1 !== undefined && player2 !== undefined && finishLine !== undefined)
      {
        ui.draw();
        player1.draw();
        player2.draw();
        finishLine.draw();
        if (!ui.started)      
        {
          ui.drawStart();
        }
      }
      
    },
    1000/this.FPS);
  }

  Game.prototype.win = function(player)
  {
    //console.log("has won");
    this.hasWon = true;
    this.winner = player.name;
    this.timerStarted = false;
  }
}

function Player(name, color, x, y, width, height, type, timerCooldown)
{
  this.name = name;
  this.color = color;
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.type = type;
  this.cooldown = 0;
  //this.sprite = sprite("player");
  Player.prototype.draw = function()
  {
    canvas.font = "18px sans-serif"
    canvas.textAlign = "start";
    canvas.fillStyle = this.color;
    canvas.fillRect(this.x, this.y, this.width, this.height);
    //this.sprite.draw(canvas, this.x, this.y);
    canvas.fillText(this.name, this.x, this.y - this.height/6);
  }
  Player.prototype.move = function()
  {
    if(!game.hasWon)
    {
      if(this.cooldown === 0)
      {
        if (this.type === "dash")
        {
          this.x += CANVAS_WIDTH/75;
          this.cooldown = timerCooldown / 10;
        }
        else if (this.type === "step")
        {
          this.x += CANVAS_WIDTH/25;
          this.cooldown = 20;
        }
      }
      else
      {
        this.cooldown -= 1;
      }
    }
  }
}

function FinishLine(color, x, y, width, height)
{
  this.color = color
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  FinishLine.prototype.handleCollision = function(collideWith)
  {
    if (!game.hasWon)
    {
      game.win(collideWith);  
    }
    //console.log("collided with", collideWith);
  }
  FinishLine.prototype.draw = function()
  {
    canvas.fillStyle = this.color;
    canvas.fillRect(this.x, this.y, this.width, this.height);
  }
}

function UI(started, countdown, number)
{
  this.started = started;
  this.countdown = countdown;
  this.number = number;
  this.initial = countdown;
  this.sprite = Sprite("bg00_port_night.jpg");
  UI.prototype.drawStart = function()
  {
    if(this.countdown > 0)
    {
      canvas.font = "48px serif"
      canvas.textAlign = "center";
      canvas.fillStyle = "#000";
      canvas.fillText(this.number, CANVAS_WIDTH/2, CANVAS_HEIGHT/2);
      this.countdown -= 1;
    }
    else
    {
      this.countdown = this.initial;
      if (this.number > 1)
      {
        this.number -= 1;
      }
      else if (this.number === 1)
      {
        this.number = "Start!";
      }
      else if (this.number === "Start!")
      {
        this.started = true;
      }
    }
  }
  UI.prototype.draw = function()
  {
    // draw an outline of the race track
    canvas.strokeStyle = "#000"
    canvas.strokeRect(2, 0, CANVAS_WIDTH - 3, CANVAS_HEIGHT - 1);
    //this.sprite.draw(canvas, 0, 0);
    if(game.hasWon)
    {
      canvas.font = "48px serif"
      canvas.textAlign = "center";
      canvas.fillStyle = "#000";
      //canvas.fillText(game.winner + " Wins!\nTime: " + game.totalTime + " seconds.", CANVAS_WIDTH/2, CANVAS_HEIGHT/2);
      canvas.fillText(game.winner + " Wins!", CANVAS_WIDTH/2, CANVAS_HEIGHT/2);
    }
  }
}

function collides(a, b) {
  return a.x < b.x + b.width &&
         a.x + a.width > b.x &&
         a.y < b.y + b.height &&
         a.y + a.height > b.y;
}

Number.prototype.clamp = function(min, max) {
  return Math.min(Math.max(this, min), max);
};

$(document).ready(function()
  {
    $('#start-button').on('click', function()
      {
        //startTime = new Date();
        game = new Game(2);
        game.init();
        game.update();
        $('#pregame').css("visibility", "hidden");
      }
    );

    $('#reset-button').on('click', function handleClick(event)
      {
        $('#pregame').css("visibility", "visible");
        $('#game-board').empty();
        $('#p1-name').val("");
        $('#p1-color').val("");
        $('#p2-name').val("");
        $('#p2-color').val("");
      }
    );
  }
);
