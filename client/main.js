window.PIXI = require('phaser/build/custom/pixi');
window.p2 = require('phaser/build/custom/p2');
window.Phaser = require('phaser/build/custom/phaser-split');

var playerModule = require('./modules/player');

var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update });

var healthText;
var mana;
var manaText;
var level;
var levelText;
var expText;
var rabbit;
var rabbitHp;

function preload() {
<<<<<<< HEAD
    game.load.spritesheet('player', 'assets/player.png', 32, 16);
}

function create() {
    player = game.add.sprite(500, 200, 'player');
    player.anchor.setTo(0.5, 0.5);    
    game.physics.arcade.enable(player);
    player.body.collideWorldBounds = true;
    levelText = game.add.text(16, 16, 'level: 1', { fontSize: '16px', fill: '#670'});
    healthText = game.add.text(16, 32, 'Health: 100', { fontSize: '16px', fill: '#670' });
    manaText = game.add.text(16, 48, 'Mana: 100', { fontSize: '16px', fill: '#670' });
    expText = game.add.text(16, 64, 'Exp: 0', {fontSize: '16px', fill: '#670'});
    cursors = game.input.keyboard.createCursorKeys();
=======
  // Modules
  playerModule.initialize(game);
  playerModule.preload();

  game.load.spritesheet('rabbit', '/assets/rabbit.png', 32, 32);
}

function create() {
  // Modules
  playerModule.create();

  levelText = game.add.text(16, 16, 'level: 1', { fontSize: '16px', fill: '#670'});
  healthText = game.add.text(16, 32, 'Health: 100', { fontSize: '16px', fill: '#670' });
  manaText = game.add.text(16, 48, 'Mana: 100', { fontSize: '16px', fill: '#670' });
  expText = game.add.text(16, 64, 'Exp: 0', {fontSize: '16px', fill: '#670'});
  cursors = game.input.keyboard.createCursorKeys();
  rabbit = game.add.sprite(200, 200, 'rabbit');
  game.physics.arcade.enable(rabbit);
  rabbit.body.collideWorldBounds = true;
  rabbitHp = 3;
>>>>>>> origin/master
}

function update() {
  // Modules
  playerModule.update();

  rabbit.frame = 5;

  // TEMP
  healthText.text = 'Health: ' + playerModule.getHealth();
  expText.text = 'Exp: ' + playerModule.getExp();

  //game.physics.arcade.collide(player, rabbit);
  // run collision

  game.physics.arcade.overlap(playerModule.getPlayer(), rabbit, killEnemy, null, this);
}

var hitText;

// Collide with rabbit twice to kill rabbit.s
function killEnemy(player, rabbit){
  rabbitHp--;
  // Show text when hit
  hitText = game.add.text(rabbit.body.x, rabbit.body.y, "Ouch!", { fontSize: '16px', fill: '#670'});
  // Kill enemy if enemyHp is 0.
  if(rabbitHp == 0){
    rabbit.kill();
    player.exp += 10;  // Increment exp value
    // Level up if exp reaches over 100.
    if(player.exp >= 100){
      level++;
      player.exp = 0;
    }
<<<<<<< HEAD
//    player.rotation = game.physics.arcade.angleToPointer(player);
=======
}
>>>>>>> origin/master

}