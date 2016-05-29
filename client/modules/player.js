
function destroyText(text) {
  setTimeout(() => {
    text.destroy();
  }, 1000);
}

const module = {
  preload(game) {
    this.game = game;
    this.game.load.spritesheet('player', '/assets/player.png', 32, 48);
  },

  create() {
    this.player = this.game.add.sprite(0, 0, 'player');
    this.game.physics.arcade.enable(this.player);
    this.player.anchor.setTo(0.5, 0.5);
    this.player.body.collideWorldBounds = true;
    this.player.visibility = false;
    // this.player.body.allowRotation = false;

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

    // Player animations
    this.player.animations.add('stop', [0], 1, true);
    this.player.animations.add('down', [0, 1, 2, 3], 10, true);
    this.player.animations.add('left', [4, 5, 6, 7], 10, true);
    this.player.animations.add('right', [8, 9, 10, 11], 10, true);
    this.player.animations.add('up', [12, 13, 14, 15], 10, true);
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

    if (this.a.isDown || this.d.isDown || this.w.isDown || this.s.isDown) {
      if (this.w.isDown) {
        this.player.animations.play('up');
      } else if (this.s.isDown) {
        this.player.animations.play('down');
      } else if (this.a.isDown) {
        this.player.animations.play('left');
      } else if (this.d.isDown) {
        this.player.animations.play('right');
      }
    } else {
      this.player.animations.play('stop');
    }

    if (this.player.exp >= 100) {
      this.player.level++;
      this.player.exp -= 100;
      this.levelUpText = this.game.add.text(this.player.x, this.player.y - 50, 'Level Up!', { fontSize: '16px', fill: 'yellow' });
      destroyText(this.levelUpText);
    }
    if (this.player.health <= 0) {
      this.player.health = 0;
      this.player.kill();
      this.gameOverText = this.game.add.text(200, 250, "Game Over", { fontSize: '64px', fill: 'red'});
    }
  },

  respawn(x, y) {
    this.player.health = 100;
    this.player.x = x;
    this.player.y = y;
    this.player.visibility = true;
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

  getCursors() {
    return this.cursors;
  },
};

export default module;
