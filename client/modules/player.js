var game;
var player;
var bullets;
var fireRate = 300;
var nextFire = 0;
var w;
var s;
var a;
var d;

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
  player.rotation = game.physics.arcade.angleToPointer(player);
  if (game.input.activePointer.isDown) fire();

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
    game.physics.arcade.moveToPointer(bullet, 300);
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
