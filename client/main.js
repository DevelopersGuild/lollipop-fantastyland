import playerModule from './modules/player';
import gunModule from './modules/gun';

window.PIXI = require('phaser/build/custom/pixi');
window.p2 = require('phaser/build/custom/p2');
window.Phaser = require('phaser/build/custom/phaser-split');

const game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload, create, update });

let healthText;
// let manaText;
let levelText;
let expText;
let rabbit;
let npc;
let hitText;
let levelUpText;
// let gameOverText;
// let rabbitHp;
let fruit;
let spaceKey;

function preload() {
  // Modules
  playerModule.initialize(game);
  playerModule.preload(game);
  gunModule.preload(game);

  game.load.spritesheet('rabbit', '/assets/rabbit.png', 32, 32);
  game.load.spritesheet('npc', '/assets/chick.png', 16, 18, 4);
  game.load.tilemap('map', 'assets/grassland.json', null, Phaser.Tilemap.TILED_JSON);
  game.load.image('grass', 'assets/Tile Sets/grass.png');
  game.load.image('fruit', '/assets/peach.png');
}

let map;
// let layer;
function create() {
  // Map
  map = game.add.tilemap('map');
  map.addTilesetImage('grass');
  // layer = map.createLayer('BackgroundLayer', 800, 600);
  map.createLayer('BackgroundLayer', 800, 600);
  // layer.resizeWorld();

  // Modules
  playerModule.create();

  gunModule.initialize(game, playerModule.getPlayer());
  gunModule.create();


  levelText = game.add.text(16, 16, 'Level: 1', { fontSize: '16px', fill: '#670'});
  healthText = game.add.text(16, 32, 'Health: 100', { fontSize: '16px', fill: '#670' });
  // manaText = game.add.text(16, 48, 'Mana: 100', { fontSize: '16px', fill: '#670' });
  expText = game.add.text(16, 64, 'Exp: 0', {fontSize: '16px', fill: '#670'});
  rabbit = game.add.sprite(200, 200, 'rabbit');
  game.physics.arcade.enable(rabbit);
  rabbit.body.collideWorldBounds = true;
  rabbit.health = 3;
  rabbit.nextMove = 0;
  rabbit.animations.add('down', [0, 1, 2], 10, true);
  rabbit.animations.add('left', [3, 4, 5], 10, true);
  rabbit.animations.add('right', [6, 7, 8], 10, true);
  rabbit.animations.add('up', [9, 10, 11], 10, true);

  fruit = game.add.sprite(300, 300, 'fruit');
  game.physics.arcade.enable(fruit);
  fruit.body.collideWorldBounds = true;
  fruit.healingStrength = 25;
  npc = game.add.sprite(100, 400, 'npc');
  game.physics.arcade.enable(npc);
  npc.animations.add('walk');
  npc.animations.play('walk', 5, true);
  npc.collideWorldBounds = true;
  spaceKey = this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
  spaceKey.onDown.add(togglePause, this);
}

function togglePause() {
  game.physics.arcade.isPaused = (game.physics.arcade.isPaused) ? false : true;
}

function update() {
  // Modules
  playerModule.update();

  const player = playerModule.getPlayer();
  if (game.time.now > rabbit.nextMove) {
    game.physics.arcade.moveToObject(rabbit, player, 250);
    if (rabbit.x > player.x + 30) rabbit.animations.play('left');
    else if (rabbit.x < player.x - 30) rabbit.animations.play('right');
    else if (rabbit.y > player.y) rabbit.animations.play('up');
    else rabbit.animations.play('down');
  }
  else if (player.x > rabbit.x) rabbit.frame = 7;
  else if (player.x < rabbit.x) rabbit.frame = 4;

  // TEMP
  levelText.text = `Level: ${playerModule.getLevel()}`;
  healthText.text = `Health: ${playerModule.getHealth()}`;
  expText.text = `Exp: ${playerModule.getExp()}`;

  game.physics.arcade.overlap(player, rabbit, killEnemy, null, this);
  game.physics.arcade.overlap(player, fruit, pickUpFruit, null, this);
  game.physics.arcade.overlap(player, npc, displayDialogue, null, this);
  game.physics.arcade.overlap(playerModule.getBullets(), rabbit, shootEnemy, null, this);
}


function destroyText(text) {
  setTimeout(() => {
    text.destroy();
  }, 1000);
}

let dialogue;
function displayDialogue(player, npc){
  // player is knocked back
  game.physics.arcade.moveToObject(player, npc, -200);
  // display dialogue
  dialogue = game.add.text(npc.x, npc.y - 18, 'Hi there!', { fontSize: '12px', fill: 'red' });
  destroyText(dialogue);
  setTimeout(() => {
    dialogue = game.add.text(npc.x, npc.y - 18, 'What do you want to buy today?', { fontSize: '12px', fill: 'red' });
    destroyText(dialogue);
  }, 2000);
  setTimeout(() => {
    dialogue = game.add.text(npc.x, npc.y - 18, 'Have a nice day!', { fontSize: '12px', fill: 'red' });
    destroyText(dialogue);
  }, 4000);
}

function killEnemy(player, _rabbit) {
  // stop the rabbit from approaching the player for the next 0.5 seconds
  _rabbit.nextMove = game.time.now + 500;
  // player and rabbit are knocked back
  game.physics.arcade.moveToObject(_rabbit, player, -100);
  game.physics.arcade.moveToObject(player, _rabbit, -200);
  // deal damage to the player

  player.health--;
  // show text when hit
  hitText = game.add.text(player.x, player.y, '-1', { fontSize: '16px', fill: 'red' });
  destroyText(hitText);
  // Kill enemy if enemyHp is 0.
  if (_rabbit.health === 0) {
    player.exp += 10;  // Increment exp value
    // Level up if exp reaches over 100.
    if (player.exp >= 100) {
      player.level++;
      player.exp = 0;
      levelUpText = game.add.text(player.x, player.y - 50, 'Level Up!', { fontSize: '16px', fill: 'yellow' });
      destroyText(levelUpText);
    }
    // rabbit respawns when killed
    _rabbit.x = Math.random() * 800;
    _rabbit.y = Math.random() * 600;
    _rabbit.health = 3;
  }
  // if player's health is 0, the game is over
  if (player.health === 0) {
    player.kill();
    // gameOverText = game.add.text(200, 250, "Game Over", { fontSize: '64px', fill: 'red'});
  }
}

function pickUpFruit(player, _fruit) {

  player.health += fruit.healingStrength;
  if (player.health > 100) {
      player.health = 100;
  }

  _fruit.kill();
}

function shootEnemy(_rabbit, bullet) {
  // kill the bullet
  bullet.kill();
  // deal damage to the rabbit
  _rabbit.health--;
  // show text when hit
  hitText = game.add.text(_rabbit.x, _rabbit.y, '-1', { fontSize: '16px', fill: 'red' });
  destroyText(hitText);
  const player = playerModule.getPlayer();
  // stop the rabbit from approaching the player for the next 0.1 seconds
  _rabbit.nextMove = game.time.now + 100;
  // Kill enemy if enemyHp is 0.
  if (_rabbit.health === 0) {
    player.exp += 10;  // Increment exp value
    // Level up if exp reaches over 100.
    if (player.exp >= 100) {
      player.level++;
      player.exp = 0;
      levelUpText = game.add.text(player.x, player.y - 50, 'Level Up!', { fontSize: '16px', fill: 'yellow' });
      destroyText(levelUpText);
    }
    // rabbit respawns 1 second after killed
    _rabbit.x = Math.random() * 800;
    _rabbit.y = Math.random() * 600;
    _rabbit.body.velocity.x = 0;
    _rabbit.body.velocity.y = 0;
    _rabbit.health = 3;
    _rabbit.nextMove = game.time.now + 1000;
  }
  // otherwise the rabbit is knocked back
  else game.physics.arcade.moveToObject(rabbit, player, -100);
}
