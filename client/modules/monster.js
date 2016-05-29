
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
  this.game.physics.arcade.moveToObject(player, projectile, -100);
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
    this.game.load.spritesheet('slimeball', '/assets/projectile.png', 16, 16);
    this.game.load.spritesheet('mushroom', '/assets/mushroom.png', 68, 60);
  },
  create() {
    // Base groups
    this.monsters = this.game.add.group();
    this.projectiles = this.game.add.group();
    this.miscAttacks = this.game.add.group();

    // Monster sub-groups
    this.rabbits = this.game.add.group(this.monsters, 'rabbits', false, true);
    this.slimes = this.game.add.group(this.monsters, 'slimes', false, true);
    this.mushrooms = this.game.add.group(this.monsters, 'mushrooms', false, true);

    // Projectile sub-groups
    this.slimeballs = this.game.add.group(this.projectiles, 'slimeballs', false, true);

    // Misc Attack sub-group
    this.shockwaves = this.game.add.group(this.miscAttacks, 'shockwaves', false, true);
  },
  update(player, bullets) {
    this.rabbits.children.forEach((rabbit) => {
      if (this.game.time.now > rabbit.nextMove) {
        this.game.physics.arcade.moveToObject(rabbit, player, 200);
        if (rabbit.x > player.x + 30) rabbit.animations.play('left');
        else if (rabbit.x < player.x - 30) rabbit.animations.play('right');
        else if (rabbit.y > player.y) rabbit.animations.play('up');
        else rabbit.animations.play('down');
      } else if (player.x > rabbit.x) rabbit.frame = 7;
      else if (player.x < rabbit.x) rabbit.frame = 4;
    });

    this.slimes.children.forEach((slime) => {
      if (this.game.physics.arcade.distanceBetween(player, slime) > 300) {
        this.game.physics.arcade.moveToObject(slime, player, 100);
        slime.animations.play('move');
      } else {
        slime.body.velocity.x = 0;
        slime.body.velocity.y = 0;
        slime.animations.play('shoot');
        if (this.game.time.now > slime.nextShoot) {
          slime.slimeball.reset(slime.x, slime.y);
          this.game.physics.arcade.moveToObject(slime.slimeball, player, 400);
          slime.slimeball.animations.play('move');
          slime.nextShoot = this.game.time.now + 1000;
        }
      }
    });

    this.mushrooms.children.forEach((mushroom) => {
      if (this.game.time.now > mushroom.nextMove) {
        this.game.physics.arcade.moveToObject(mushroom, player, 150);
        mushroom.animations.play('move');
        if (player.x > mushroom.x) mushroom.scale.x = -1;
        else mushroom.scale.x = 1;
      } else {
        mushroom.body.velocity.x = 0;
        mushroom.body.velocity.y = 0;
        mushroom.animations.play('jump');
      }
      if (this.game.time.now > mushroom.nextJump) {
        setTimeout(() => {
          mushroom.shockwave.reset(mushroom.x - 140, mushroom.y - 140);
          mushroom.shockwave.alpha = 1;
          if (this.game.physics.arcade.distanceBetween(player, mushroom) < 160) {
            player.health -= 3;
            const hitText = this.game.add.text(player.x, player.y, '-3', { fontSize: '16px', fill: 'red' });
            destroyText(hitText);
          }
        }, 1000);
        setTimeout(() => { mushroom.shockwave.alpha = 0; }, 1500);
        mushroom.nextMove = this.game.time.now + 1500;
        mushroom.nextJump = this.game.time.now + 5000;
      }
    });

    this.game.physics.arcade.overlap(player, this.rabbits, killEnemy, null, this);
    this.game.physics.arcade.overlap(player, this.slimeballs, getShot, null, this);
    this.game.physics.arcade.overlap(player, this.mushrooms, hitMushroom, null, this);

    this.game.physics.arcade.overlap(bullets, this.rabbits, shootEnemy, null, this);
    this.game.physics.arcade.overlap(bullets, this.slimes, shootSlime, null, this);
    this.game.physics.arcade.overlap(bullets, this.mushrooms, shootMushroom, null, this);
  },

  createRabbit(x, y) {
    const rabbit = this.rabbits.create(x, y, 'rabbit');
    rabbit.health = 3;
    rabbit.nextMove = 0;
    rabbit.animations.add('down', [0, 1, 2], 10, true);
    rabbit.animations.add('left', [3, 4, 5], 10, true);
    rabbit.animations.add('right', [6, 7, 8], 10, true);
    rabbit.animations.add('up', [9, 10, 11], 10, true);
  },

  createSlime(x, y) {
    const slime = this.slimes.create(x, y, 'slime');
    slime.health = 3;
    slime.nextShoot = 0;
    slime.animations.add('move', [2, 3], 5, true);
    slime.animations.add('shoot', [4, 5], 5, true);

    slime.slimeball = this.slimeballs.create(-10, -10, 'slimeball');
    slime.slimeball.animations.add('move', [0, 1, 2], 3, true);
  },

  createMushroom(x, y) {
    const mushroom = this.mushrooms.create(x, y, 'mushroom');
    mushroom.anchor.set(0.5, 0.5);
    mushroom.health = 8;
    mushroom.nextMove = 0;
    mushroom.nextJump = 0;
    mushroom.animations.add('move', [0, 1, 2, 3], 10, true);
    mushroom.animations.add('jump', [4, 5, 6, 7, 8], 5, true);
    mushroom.shockwave = this.game.add.sprite(0, 0, 'shockwave');
    mushroom.shockwave.alpha = 0;
  },

  getMonsters() {
    return this.monsters;
  },
};

export default module;
