let gun;
let player;
let game;
let bullets;
let fireTimer;
let fireRate = 200;
let cursors;

function initialize(_game, _player, _cursors) {
  game = _game;
  player = _player;
  cursors = _cursors;
}

function preload(pgame) {
  pgame.load.image('gun', '/assets/shotgun.png');
}

function create() {
  gun = game.add.sprite(player.x + player.width, player.y, 'gun');
  gun.anchor.set(0.5, 1);
  bullets = game.add.group();
  bullets.enableBody = true;
  bullets.setAll('checkWorldBounds', true);
  bullets.setAll('outOfBoundsKill', true);
}

function fire() {
  if (game.time.now > fireTimer && bullets.countDead() > 0) {
    fireTimer = game.time.now + fireRate;
    const bullet = bullets.getFirstDead();
    bullet.reset(gun.x, gun.y);
    bullet.body.velocity.x = Math.cos(player.rotation)*200;
    bullet.body.velocity.y = Math.sin(player.rotation)*200;

  }
}

function update() {
  gun.x = player.x + player.width;
  gun.y = player.y;
  if (cursors.up.isDown || cursors.down.isDown || cursors.left.isDown || cursors.right.isDown)  {
    fire();
  }
}

function getGun() {
  return gun;
}

function getBullets() {
  return bullets;
}

export default {
  initialize,
  preload,
  create,
  fire,
  update,
  getGun,
  getBullets,
};
