var game;
var player;
var bullets;
var fireRate = 200;
var nextFire = 0;
var w;
var s;
var a;
var d;
var cursors;

function initialize(_game) {
  game = _game;
}

function preload() {
  game.load.spritesheet('player', '/assets/player.png', 32, 16);
  game.load.image('bullet', '/assets/bullet.png');
}

function create() {
  player = game.add.sprite(500, 200, 'player');
  game.physics.arcade.enable(player);
  player.anchor.setTo(0.5, 0.5);
  player.body.collideWorldBounds = true;
  player.body.allowRotation = false;

  bullets = game.add.group();
  bullets.enableBody = true;
  bullets.createMultiple(50, 'bullet');
  bullets.setAll('checkWorldBounds', true);
  bullets.setAll('outOfBoundsKill', true);

  w = game.input.keyboard.addKey(Phaser.Keyboard.W);
  a = game.input.keyboard.addKey(Phaser.Keyboard.A);
  s = game.input.keyboard.addKey(Phaser.Keyboard.S);
  d = game.input.keyboard.addKey(Phaser.Keyboard.D);
  cursors = game.input.keyboard.createCursorKeys();

  // Initialize Level
  player.level = 1;

  // Initialize Health
  player.health = 100;

  // Initialize EXP
  player.exp = 0;
}

function update() {
  if (player.body.velocity.x > 0)
      player.body.acceleration.x = -300;
  if (player.body.velocity.x < 0)
      player.body.acceleration.x = 300;
  if (player.body.velocity.y > 0)
      player.body.acceleration.y = -300;
  if (player.body.velocity.y < 0)
      player.body.acceleration.y = 300;

  player.body.maxVelocity.x = 200;
  player.body.maxVelocity.y = 200;

  if (cursors.up.isDown || cursors.right.isDown || cursors.left.isDown || cursors.down.isDown)
    fire();

  if (a.isDown) {
      player.body.acceleration.x = -500;
  }
  else if (d.isDown) {
      player.body.acceleration.x = 500;
  }
  if (w.isDown) {
      player.body.acceleration.y = -500;
  }
  else if (s.isDown) {
      player.body.acceleration.y = 500;
  }
}

function getLevel() {
  return player.level;
}

function getHealth() {
  return player.health;
}

function getExp() {
  return player.exp;
}

function getPlayer() {
  return player;
}

function fire() {
  if (game.time.now > nextFire && bullets.countDead() > 0) {
    nextFire = game.time.now + fireRate;
    var bullet = bullets.getFirstDead();
    bullet.reset(player.x, player.y);
    bullet.body.velocity.x = player.body.velocity.x;
    bullet.body.velocity.y = player.body.velocity.y;
    if (cursors.left.isDown) bullet.body.velocity.x -= 500;
    else if (cursors.right.isDown) bullet.body.velocity.x += 500;
    if (cursors.up.isDown) bullet.body.velocity.y -= 500;
    else if (cursors.down.isDown) bullet.body.velocity.y += 500;
  }
}

module.exports = {
  initialize: initialize,
  preload: preload,
  create: create,
  update: update,
  getLevel: getLevel,
  getHealth: getHealth,
  getExp: getExp,
  getPlayer: getPlayer,
};

var Inventory = {
  numApples: 0,
  numBananas: 0,
}

Inventory.numApples += 1;    







