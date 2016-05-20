const module = {
  preload(game) {
    this.game = game;
    this.game.load.image('gun', '/assets/shotgun.png');
    this.game.load.image('bullet', '/assets/bullet.png');

  },

  create(player, cursors) {
    this.player = player;
    this.cursors = cursors;
    this.gun = this.game.add.sprite(this.player.x + this.player.width, this.player.y, 'gun');
    this.gun.anchor.set(0.5, 1);

    this.bullets = this.game.add.group();
    this.bullets.enableBody = true;
    this.bullets.createMultiple(50, 'bullet');
    this.bullets.setAll('checkWorldBounds', true);
    this.bullets.setAll('outOfBoundsKill', true);

    this.fireTimer = 0;
    this.fireRate = 200;
  },

  fire() {
    if (this.game.time.now > this.fireTimer && this.bullets.countDead() > 0) {
      this.fireTimer = this.game.time.now + this.fireRate;
      let angle = this.player.rotation-(3.14159/2); // Use player rotation offset -90 degrees to account for righthand starting polar coordinate system
      for (let i = 0; i < 3; i++) {
        let bullet = this.bullets.getFirstDead();
        bullet.reset(this.gun.x, this.gun.y);
        bullet.body.velocity.x = Math.cos(angle+(3.14/4)*i)*200;
        bullet.body.velocity.y = Math.sin(angle+(3.14/4)*i)*200;
        let bullet2 = this.bullets.getFirstDead();
        bullet2.reset(this.gun.x, this.gun.y);
        bullet2.body.velocity.x = Math.cos(angle-(3.14/4)*i)*200;
        bullet2.body.velocity.y = Math.sin(angle-(3.14/4)*i)*200;
      }
    }
  },

  update() {
    this.gun.x = this.player.x + this.player.width;
    this.gun.y = this.player.y;
    if (this.cursors.up.isDown || this.cursors.right.isDown || this.cursors.left.isDown || this.cursors.down.isDown) {
      this.fire();
    }
  },

  getBullets() {
    return this.bullets;
  },

  getCursors() {
    return this.cursors;
  }
}

export default module;
