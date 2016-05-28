
function destroyText(text) {
  setTimeout(() => {
    text.destroy();
  }, 1000);
}

function killEnemy(player, rabbit) {
  // stop the rabbit from approaching the player for the next 0.5 seconds
  rabbit.nextMove = this.game.time.now + 500;
  // player and rabbit are knocked back
  this.game.physics.arcade.moveToObject(rabbit, player, -100);
  this.game.physics.arcade.moveToObject(player, rabbit, -200);
  // deal damage to the player
  player.health--;
  // show text when hit
  const hitText = this.game.add.text(player.x, player.y, '-1', { fontSize: '16px', fill: 'red' });
  destroyText(hitText);
}

function shootEnemy(rabbit, bullet) {
  // kill the bullet
  bullet.kill();
  // deal damage to the rabbit
  rabbit.health--;
  // show text when hit
  const hitText = this.game.add.text(rabbit.x, rabbit.y, '-1', { fontSize: '16px', fill: 'red' });
  destroyText(hitText);
  // stop the rabbit from approaching the player for the next 0.1 seconds
  rabbit.nextMove = this.game.time.now + 100;
  // Kill enemy if enemyHp is 0.
  if (rabbit.health === 0) {
    // this.player.exp += 10;  // Increment exp value
    // rabbit respawns 1 second after killed
    rabbit.x = Math.random() * 800;
    rabbit.y = Math.random() * 1440;
    rabbit.body.velocity.x = 0;
    rabbit.body.velocity.y = 0;
    rabbit.health = 3;
    rabbit.nextMove = this.game.time.now + 1000;

  // otherwise the rabbit is knocked back
  }
  // else game.physics.arcade.moveToObject(this.rabbit, this.player, -100);
}

function getShot(player, projectile) {
  projectile.reset(-10, -10);
  projectile.body.velocity.x = 0;
  projectile.body.velocity.y = 0;
  player.health--;
  this.game.physics.arcade.moveToObject(player, this.slime, -100);
  const hitText = this.game.add.text(player.x, player.y, '-1', { fontSize: '16px', fill: 'red' });
  destroyText(hitText);
}

function shootSlime(slime, bullet) {
  bullet.kill();
  slime.health--;
  const hitText = this.game.add.text(slime.x, slime.y, '-1', { fontSize: '16px', fill: 'red' });
  destroyText(hitText);
  if (slime.health === 0) {
    // player.exp += 15;
    slime.x = Math.random() * 800;
    slime.y = Math.random() * 1440;
    slime.health = 3;
    slime.nextShoot = this.game.time.now + 1000;
  }
}

function shootMushroom(mushroom, bullet) {
  bullet.kill();
  mushroom.health--;
  const hitText = this.game.add.text(mushroom.x, mushroom.y, '-1', { fontSize: '16px', fill: 'red' });
  destroyText(hitText);
  if (mushroom.health === 0) {
    // this.player.exp += 50;
    mushroom.x = Math.random() * 800;
    mushroom.y = Math.random() * 1440;
    mushroom.health = 8;
    mushroom.nextMove = this.game.time.now + 1500;
    mushroom.nextJump = this.game.time.now + 5000;
  }
}

function hitMushroom(player, mushroom) {
  mushroom.nextMove = this.game.time.now + 1000;
  this.game.physics.arcade.moveToObject(player, mushroom, -200);
  player.health -= 2;
  const hitText = this.game.add.text(player.x, player.y, '-2', { fontSize: '16px', fill: 'red' });
  destroyText(hitText);
}

const module = {
  preload(game) {
    this.game = game;

    this.game.load.spritesheet('rabbit', '/assets/rabbit.png', 32, 32);
    this.game.load.spritesheet('npc', '/assets/chick.png', 16, 18, 4);
    this.game.load.spritesheet('slime', '/assets/slime.png', 32, 32);
    this.game.load.spritesheet('projectile', '/assets/projectile.png', 16, 16);
    this.game.load.spritesheet('mushroom', '/assets/mushroom.png', 68, 60);
  },
  create() {
    this.monsterGroup = this.game.add.group();

    this.rabbit = this.game.add.sprite(200, 200, 'rabbit');
    this.game.physics.arcade.enable(this.rabbit);
    this.rabbit.body.collideWorldBounds = true;
    this.rabbit.health = 3;
    this.rabbit.nextMove = 0;
    this.rabbit.animations.add('down', [0, 1, 2], 10, true);
    this.rabbit.animations.add('left', [3, 4, 5], 10, true);
    this.rabbit.animations.add('right', [6, 7, 8], 10, true);
    this.rabbit.animations.add('up', [9, 10, 11], 10, true);

    // Add rabbit to monster group
    this.monsterGroup.add(this.rabbit);

    this.slime = this.game.add.sprite(500, 400, 'slime');
    this.game.physics.arcade.enable(this.slime);
    this.slime.body.collideWorldBounds = true;
    this.slime.health = 3;
    this.slime.nextShoot = 0;
    this.slime.animations.add('move', [2, 3], 5, true);
    this.slime.animations.add('shoot', [4, 5], 5, true);
    this.projectile = this.game.add.sprite(-10, -10, 'projectile');
    this.game.physics.arcade.enable(this.projectile);
    this.projectile.animations.add('move', [0, 1, 2], 3, true);

    // Add slime and projective to monster group
    this.monsterGroup.add(this.slime);
    this.monsterGroup.add(this.projectile);

    this.mushroom = this.game.add.sprite(300, 400, 'mushroom');
    this.game.physics.arcade.enable(this.mushroom);
    this.mushroom.anchor.set(0.5, 0.5);
    this.mushroom.body.collideWorldBounds = true;
    this.mushroom.health = 8;
    this.mushroom.nextMove = 0;
    this.mushroom.nextJump = 0;
    this.mushroom.animations.add('move', [0, 1, 2, 3], 10, true);
    this.mushroom.animations.add('jump', [4, 5, 6, 7, 8], 5, true);
    this.shockwave = this.game.add.sprite(0, 0, 'shockwave');
    this.shockwave.alpha = 0;

    // Add mushroom to monster group
    this.monsterGroup.add(this.mushroom);
  },
  update(player, bullets) {
    if (this.game.time.now > this.rabbit.nextMove) {
      this.game.physics.arcade.moveToObject(this.rabbit, player, 200);
      if (this.rabbit.x > player.x + 30) this.rabbit.animations.play('left');
      else if (this.rabbit.x < player.x - 30) this.rabbit.animations.play('right');
      else if (this.rabbit.y > player.y) this.rabbit.animations.play('up');
      else this.rabbit.animations.play('down');
    } else if (player.x > this.rabbit.x) this.rabbit.frame = 7;
    else if (player.x < this.rabbit.x) this.rabbit.frame = 4;

    if (this.game.physics.arcade.distanceBetween(player, this.slime) > 300) {
      this.game.physics.arcade.moveToObject(this.slime, player, 100);
      this.slime.animations.play('move');
    } else {
      this.slime.body.velocity.x = 0;
      this.slime.body.velocity.y = 0;
      this.slime.animations.play('shoot');
      if (this.game.time.now > this.slime.nextShoot) {
        this.projectile.reset(this.slime.x, this.slime.y);
        this.game.physics.arcade.moveToObject(this.projectile, player, 400);
        this.projectile.animations.play('move');
        this.slime.nextShoot = this.game.time.now + 1000;
      }
    }

    if (this.game.time.now > this.mushroom.nextMove) {
      this.game.physics.arcade.moveToObject(this.mushroom, player, 150);
      this.mushroom.animations.play('move');
      if (player.x > this.mushroom.x) this.mushroom.scale.x = -1;
      else this.mushroom.scale.x = 1;
    } else {
      this.mushroom.body.velocity.x = 0;
      this.mushroom.body.velocity.y = 0;
      this.mushroom.animations.play('jump');
    }
    if (this.game.time.now > this.mushroom.nextJump) {
      setTimeout(() => {
        this.shockwave.reset(this.mushroom.x - 140, this.mushroom.y - 140);
        this.shockwave.alpha = 1;
        if (this.game.physics.arcade.distanceBetween(player, this.mushroom) < 160) {
          player.health -= 3;
          this.hitText = this.game.add.text(player.x, player.y, '-3', { fontSize: '16px', fill: 'red' });
          destroyText(this.hitText);
        }
      }, 1000);
      setTimeout(() => { this.shockwave.alpha = 0; }, 1500);
      this.mushroom.nextMove = this.game.time.now + 1500;
      this.mushroom.nextJump = this.game.time.now + 5000;
    }

    this.game.physics.arcade.overlap(player, this.rabbit, killEnemy, null, this);
    this.game.physics.arcade.overlap(player, this.projectile, getShot, null, this);
    this.game.physics.arcade.overlap(player, this.mushroom, hitMushroom, null, this);

    this.game.physics.arcade.overlap(bullets, this.rabbit, shootEnemy, null, this);
    this.game.physics.arcade.overlap(bullets, this.slime, shootSlime, null, this);
    this.game.physics.arcade.overlap(bullets, this.mushroom, shootMushroom, null, this);
  },

  getMonsterGroup() {
    return this.monsterGroup;
  },
};

export default module;
