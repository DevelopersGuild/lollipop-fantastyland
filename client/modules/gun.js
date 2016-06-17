const module = {
  preload(game) {
    this.game = game;
    this.game.load.image('gun', '/assets/shotgun.png');
    this.game.load.image('bullet', '/assets/bullet.png');
    this.game.load.image('shotgun-shell', '/assets/shotgun-shell.png');
    //firing sound from http://soundfxcenter.com/download-sound/mauser-kar-98k-firing-sound-effect/
    game.load.audio('rifle-firing', 'assets/rifle-firing.mp3');
    game.load.audio('shotgun-firing', 'assets/shotgun-firing.mp3');
  },

  create(player, cursors) {
    this.player = player;
    this.cursors = cursors;
    this.gun = this.game.add.sprite(this.player.x + this.player.width, this.player.y, 'gun');
    this.gun.x = this.player.x+this.player.width;
    this.gun.y = this.player.y;
    this.gun.pivot.set(0.5,0.5);
    this.gun.anchor.set(0.5, 0.5);
    this.gun.name = "gun";

    this.rifle_fire = this.game.add.audio('rifle-firing');
    this.shotgun_fire = this.game.add.audio('shotgun-firing');
    this.fire_key = this.game.input.keyboard.addKey(Phaser.Keyboard.X);


    this.bullets = this.game.add.group();
    this.bullets.enableBody = true;
    this.bullets.createMultiple(50, 'bullet');
    this.bullets.setAll('checkWorldBounds', true);
    this.bullets.setAll('outOfBoundsKill', true);

    this.shotgun_shells = this.game.add.emitter(this.gun.x, this.gun.y, 50);
    this.shotgun_shells.makeParticles('shotgun-shell');

    this.fireTimer = 0;
    this.fireRate = 2000;
    this.speed = 1600;
    this.type = "shotgun";
  },

  fire(x, y) {
    if (this.game.time.now > this.fireTimer && this.bullets.countDead() > 5) {
      this.fireTimer = this.game.time.now + this.fireRate;
      let angle = this.gun.rotation-(3.14159/2); // Use player rotation offset -90 degrees to account for righthand starting polar coordinate system
      let theta_delta = .05;
      let bullet, bullet2;
      if (this.type == "shotgun") {
        for (let i = 0; i < 8; i++) {
          bullet = this.bullets.getFirstDead();
          bullet.reset(this.gun.x+x, this.gun.y+y);
          bullet.body.velocity.x = Math.cos(angle+theta_delta*i)*this.speed;
          bullet.body.velocity.y = Math.sin(angle+theta_delta*i)*this.speed;
          bullet2 = this.bullets.getFirstDead();
          bullet2.reset(this.gun.x, this.gun.y);
          bullet2.body.velocity.x = Math.cos(angle-theta_delta*i)*this.speed;
          bullet2.body.velocity.y = Math.sin(angle-theta_delta*i)*this.speed;
        }
        this.shotgun_fire.play();
        this.shotgun_shells.x = this.gun.x;
        this.shotgun_shells.y = this.gun.y;
        this.shotgun_shells.setYSpeed(-Math.cos(angle)*100,Math.cos(angle)*100);
        this.shotgun_shells.setXSpeed(-Math.sin(angle)*100,Math.sin(angle)*100);
        this.shotgun_shells.start(true, 500, null, 2);

      }
      if (this.type == "rifle") {
        bullet = this.bullets.getFirstDead();
        bullet.reset(this.gun.x, this.gun.y);
        this.rifle_fire.play();
      }
    }
  },
  setType(type) {
    this.type = type;
    if (this.type == "shotgun") {

    }
  },

  update() {
    this.gun.x = this.player.x;
    this.gun.y = this.player.y;
    let dx = 0;
    let dy = 0;
    let angle = this.gun.rotation-(Math.PI/2);
    if (angle == -Math.PI/2) {
      this.gun.x = this.player.x+this.player.width/2;
      this.gun.y = this.player.y;
      dy = -this.gun.height/2;
    }
    else if (angle == 0) {
      this.gun.x = this.player.x+this.player.width/4;
      this.gun.y = this.player.y+this.player.height/4;
      dx = this.gun.width/2;
    }
    else if (angle == Math.PI/2 ){
      this.gun.x = this.player.x-this.player.width/4;
      this.gun.y = this.player.y+this.player.height/4;
      dy = this.gun.height/2;

    }
    else if (angle == Math.PI) {
      this.gun.x = this.player.x;
      this.gun.y = this.player.y+this.player.height/4;
      dx = -this.gun.width/2;
    }
    if (this.fire_key.isDown) {
      this.fire(dx, dy);
    }
  },


  getBullets() {
    return this.bullets;
  },

  getCursors() {
    return this.cursors;
  },

  getItemType() {
    return this.itemType;
  },

  getGun() {
    return this.gun;
  }
}

export default module;
