var cursors;
var game;
var player;

function initialize(_game) {
  game = _game;
}

function preload() {
  game.load.spritesheet('player', '/assets/player.png', 32, 16);
}

function create() {
  player = game.add.sprite(500, 200, 'player');
  game.physics.arcade.enable(player);
  player.anchor.setTo(0.5, 0.5);
  player.body.collideWorldBounds = true;

  cursors = game.input.keyboard.createCursorKeys();

  // Initialize Health
  player.health = 100;

  // Initialize EXP
  player.exp = 0;
}

function update() {
  player.body.velocity.x = 0;
  player.body.velocity.y = 0;
  if (cursors.left.isDown)
  {
      player.body.velocity.x = -300;
  }
  else if (cursors.right.isDown)
  {
      player.body.velocity.x = 300;
  }
  if (cursors.up.isDown)
  {
    player.body.velocity.y = -300;
  }
  else if (cursors.down.isDown)
  {
    player.body.velocity.y = 300;
  }
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

module.exports = {
  initialize: initialize,
  preload: preload,
  create: create,
  update: update,
  getHealth: getHealth,
  getExp: getExp,
  getPlayer: getPlayer,
};
