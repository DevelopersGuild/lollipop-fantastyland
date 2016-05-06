window.PIXI = require('phaser/build/custom/pixi');
window.p2 = require('phaser/build/custom/p2');
window.Phaser = require('phaser/build/custom/phaser-split');

var playerModule = require('./modules/player');

var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update });

var healthText;
var manaText;
var levelText;
var expText;
var rabbit;
var hitText;
var levelUpText;
var gameOverText;
var rabbitHp;
var fruit;

function preload() {
  // Modules
  playerModule.initialize(game);
  playerModule.preload();

  game.load.spritesheet('rabbit', '/assets/rabbit.png', 32, 32);
  game.load.image('fruit', '/assets/peach.png');
}

function create() {
  // Modules
  playerModule.create();

  levelText = game.add.text(16, 16, 'Level: 1', { fontSize: '16px', fill: '#670'});
  healthText = game.add.text(16, 32, 'Health: 100', { fontSize: '16px', fill: '#670' });
  manaText = game.add.text(16, 48, 'Mana: 100', { fontSize: '16px', fill: '#670' });
  expText = game.add.text(16, 64, 'Exp: 0', {fontSize: '16px', fill: '#670'});
  rabbit = game.add.sprite(200, 200, 'rabbit');
  game.physics.arcade.enable(rabbit);
  rabbit.body.collideWorldBounds = true;
  rabbit.health = 3;
  rabbitHp = 3;
  fruit = game.add.sprite(300, 300, 'fruit');
  game.physics.arcade.enable(fruit);
  fruit.body.collideWorldBounds = true;
  fruit.healingStrength = 25;
  spaceKey = this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
  spaceKey.onDown.add(togglePause, this);
}

function togglePause() {

    game.physics.arcade.isPaused = (game.physics.arcade.isPaused) ? false : true;
}

function update() {
  // Modules
  playerModule.update();

  rabbit.frame = 4;

  // TEMP
  levelText.text = 'Level: ' + playerModule.getLevel();
  healthText.text = 'Health: ' + playerModule.getHealth();
  expText.text = 'Exp: ' + playerModule.getExp();

  game.physics.arcade.overlap(playerModule.getPlayer(), rabbit, killEnemy, null, this);
  game.physics.arcade.overlap(playerModule.getPlayer(), fruit, pickUpFruit, null, this);

}


function destroyText(text) {
  setTimeout(function() {
    text.destroy()
  }, 1000);
}

function killEnemy(player, rabbit) {
  // player is knocked back
  if (player.body.velocity.x > 50)
    player.body.velocity.x = -200;
  else if (player.body.velocity.x < -50)
    player.body.velocity.x = 200;
  else player.body.velocity.x = 0;
  if (player.body.velocity.y > 50)
    player.body.velocity.y = -200;
  else if (player.body.velocity.y < -50)
    player.body.velocity.y = 200;
  else player.body.velocity.y = 0;
  // deal damage to both of them
  rabbit.health--;
  player.health--;
  // show text when hit
  hitText = game.add.text(rabbit.x, rabbit.y, "-1", { fontSize: '16px', fill: 'red'});
  destroyText(hitText);
  hitText = game.add.text(player.x, player.y, "-1", { fontSize: '16px', fill: 'red'});
  destroyText(hitText);
  // Kill enemy if enemyHp is 0.
  if (rabbit.health == 0) {
    player.exp += 10;  // Increment exp value
    // Level up if exp reaches over 100.
    if (player.exp >= 100) {
      player.level++;
      player.exp = 0;
      levelUpText = game.add.text(player.x, player.y - 50, "Level Up!", { fontSize: '16px', fill: 'yellow'});
      destroyText(levelUpText);
    }
    // rabbit respawns when killed
    rabbit.x = Math.random() * 800;
    rabbit.y = Math.random() * 600;
    rabbit.health = 3;
  }
  // if player's health is 0, the game is over
  if (player.health == 0) {
    player.kill();
    gameOverText = game.add.text(200, 250, "Game Over", { fontSize: '64px', fill: 'red'});
  }



}


//var fruit = {};
var healingStrength;

function pickUpFruit (player, fruit) {

  player.health += fruit.healingStrength;
  if (player.health > 100) {
      player.health = 100;
  }

  function killFruitText () {
  }

  setTimeout(killFruitText,1000);
  fruit.kill();
}

function Fruit(name, strength) {
    var fruitName = name;
    var healingStrength = strength;
/*    Fruit (String_name, int_healingStrength) {
      name = _name;
      healingStrength = _healingStrength;*/

  //}
}

//  fruit.banana = new Fruit("banana", 4);
