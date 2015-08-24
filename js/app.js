var game;
var player1;
var player2;
var finishLine;
var ui;

var CANVAS_WIDTH = window.innerWidth - window.innerWidth/100;
var CANVAS_HEIGHT = window.innerHeight/2;
var canvasElement = $("<canvas width='" + CANVAS_WIDTH + 
                        "' height='" + CANVAS_HEIGHT + "'></canvas>");
var canvas = canvasElement.get(0).getContext("2d");

function Game(playerAmount)
{
  this.playerAmount = playerAmount;
  this.hasWon = false;
  this.FPS = 60;
  this.winner;

  Game.prototype.init = function()
  {    
    canvasElement.appendTo('#game-board');
    player1 = new Player($('#p1-name').val(), $('#p1-color').val(), 10, 10, 32, 32, "dash");
    player2 = new Player($('#p2-name').val(), $('#p2-color').val(), 10, 40, 32, 32, "dash");
    finishLine = new FinishLine("red", CANVAS_WIDTH - 30, 0, 15, CANVAS_HEIGHT);
    ui = new UI();
  }

  Game.prototype.update = function()
  { 
    setInterval(function() {
      if (this.winner === undefined)
      {
        //console.log('can move');  
        if (player1 !== undefined && player2 !== undefined && finishLine !== undefined)
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
      }

      //this.draw();
      if (this.canvas !== undefined)
      {
        canvas.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        if (player1 !== undefined && player2 !== undefined && finishLine !== undefined)
        {
          player1.draw();
          player2.draw();
          finishLine.draw();
          ui.draw();
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
  }
}

function Player(name, color, x, y, width, height, type)
{
  this.name = name;
  this.color = color;
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.type = type;
  this.cooldown = 0;
  Player.prototype.draw = function()
  {
    canvas.fillStyle = this.color;
    canvas.fillRect(this.x, this.y, this.width, this.height);
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
          this.cooldown = 10;
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

function UI()
{
  UI.prototype.draw = function()
  {
    // draw an outline of the race track
    canvas.strokeStyle = "#000"
    canvas.strokeRect(2, 0, CANVAS_WIDTH - 3, CANVAS_HEIGHT - 1);

    if(game.hasWon)
    {
      canvas.font = "48px serif"
      canvas.textAlign = "center";
      canvas.fillStyle = "#000";
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
        game = new Game(2);
        game.init();
        game.update();
        $('#pregame').empty();
      }
    );
  }
);
