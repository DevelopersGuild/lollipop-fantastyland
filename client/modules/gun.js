let gun;
let player;
let game;
let bullets;
let fireTimer;

function initialize(_game, _player) {
    game = _game;
    player = _player;
}

function preload(pgame) {
    pgame.load.image('gun', '/assets/shotgun.png');
}

function create()  {
    gun = game.add.sprite(player.x+player.width, player.y, 'gun');
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
    bullet.reset(player.x, player.y);
    game.physics.arcade.moveToPointer(bullet, 300);
  }
}

function update(){

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
    getBullets
};