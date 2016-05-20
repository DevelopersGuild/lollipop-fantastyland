

const module = {
  initialize(game) {
    this.game = game;
  },

  preload() {
    this.game.load.spritesheet('player', '/assets/player.png', 32, 16);
    this.game.load.image('bullet', '/assets/bullet.png');
  },

  create() {
    this.player = this.game.add.sprite(500, 200, 'player');
    this.game.physics.arcade.enable(this.player);
    this.player.anchor.setTo(0.5, 0.5);
    this.player.body.collideWorldBounds = true;
    this.player.body.allowRotation = false;

    this.bullets = this.game.add.group();
    this.bullets.enableBody = true;
    this.bullets.createMultiple(50, 'bullet');
    this.bullets.setAll('checkWorldBounds', true);
    this.bullets.setAll('outOfBoundsKill', true);

    this.w = this.game.input.keyboard.addKey(Phaser.Keyboard.W);
    this.a = this.game.input.keyboard.addKey(Phaser.Keyboard.A);
    this.s = this.game.input.keyboard.addKey(Phaser.Keyboard.S);
    this.d = this.game.input.keyboard.addKey(Phaser.Keyboard.D);
    this.cursors = this.game.input.keyboard.createCursorKeys();

    // Initialize Level
    this.player.level = 1;

    // Initialize Health
    this.player.health = 100;

    // Initialize EXP
    this.player.exp = 0;

    this.fireRate = 200;
    this.nextFire = 0;
  },

  update() {
    if (this.player.body.velocity.x > 0) {
      this.player.body.acceleration.x = -300;
    }

    if (this.player.body.velocity.x < 0) {
      this.player.body.acceleration.x = 300;
    }

    if (this.player.body.velocity.y > 0) {
      this.player.body.acceleration.y = -300;
    }

    if (this.player.body.velocity.y < 0) {
      this.player.body.acceleration.y = 300;
    }

    this.player.body.maxVelocity.x = 200;
    this.player.body.maxVelocity.y = 200;

  /*  if (this.cursors.up.isDown || this.cursors.right.isDown || this.cursors.left.isDown || this.cursors.down.isDown) {
      this.fire();
    }*/

    if (this.a.isDown) {
      this.player.body.acceleration.x = -500;
    } else if (this.d.isDown) {
      this.player.body.acceleration.x = 500;
    }
    if (this.w.isDown) {
      this.player.body.acceleration.y = -500;
    } else if (this.s.isDown) {
      this.player.body.acceleration.y = 500;
    }
  },

  getLevel() {
    return this.player.level;
  },

  getHealth() {
    return this.player.health;
  },

  getExp() {
    return this.player.exp;
  },

  getPlayer() {
    return this.player;
  },

  getBullets() {
    return this.bullets;
  },

  getCursors(){
    return this.cursors;
  },

/*
  fire() {
    if (this.game.time.now > this.nextFire && this.bullets.countDead() > 0) {
      this.nextFire = this.game.time.now + this.fireRate;
      const bullet = this.bullets.getFirstDead();
      bullet.reset(this.player.x, this.player.y);
      bullet.body.velocity.x = this.player.body.velocity.x;
      bullet.body.velocity.y = this.player.body.velocity.y;
      if (this.cursors.left.isDown) bullet.body.velocity.x -= 500;
      else if (this.cursors.right.isDown) bullet.body.velocity.x += 500;
      if (this.cursors.up.isDown) bullet.body.velocity.y -= 500;
      else if (this.cursors.down.isDown) bullet.body.velocity.y += 500;

    }
  },*/
};

export default module;
