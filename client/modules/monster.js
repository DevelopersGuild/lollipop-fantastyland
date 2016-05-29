import gunModule from './gun';
import playerModule from './player';

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

function shootEnemy(bullet, rabbit) {
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
    this.player.exp += 10;  // Increment exp value

    rabbit.destroy();
  // otherwise the rabbit is knocked back
  } else this.game.physics.arcade.moveToObject(rabbit, this.player, -100);
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

function shootSlime(bullet, slime) {
  bullet.kill();
  slime.health--;
  const hitText = this.game.add.text(slime.x, slime.y, '-1', { fontSize: '16px', fill: 'red' });
  destroyText(hitText);
  if (slime.health === 0) {
    this.player.exp += 15;
    slime.slimeball.destroy();
    slime.destroy();
  }
}

function shootMushroom(bullet, mushroom) {
  bullet.kill();
  mushroom.health--;
  const hitText = this.game.add.text(mushroom.x, mushroom.y, '-1', { fontSize: '16px', fill: 'red' });
  destroyText(hitText);
  if (mushroom.health === 0) {
    this.player.exp += 50;
    mushroom.shockwave.destroy();
    mushroom.destroy();
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
    this.game.load.image('shockwave', '/assets/shockwave.png');
  },
  create() {
    this.player = playerModule.getPlayer();
    this.gunBullets = gunModule.getBullets();

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
  update() {
    this.rabbits.children.forEach((rabbit) => {
      if (this.game.time.now > rabbit.nextMove) {
        if (this.game.physics.arcade.distanceBetween(this.player, rabbit) < 375) {
          this.game.physics.arcade.moveToObject(rabbit, this.player, 200);
        } else {
          this.game.physics.arcade.moveToObject(rabbit, this.player, 0);
        }
        if (rabbit.x > this.player.x + 30) rabbit.animations.play('left');
        else if (rabbit.x < this.player.x - 30) rabbit.animations.play('right');
        else if (rabbit.y > this.player.y) rabbit.animations.play('up');
        else rabbit.animations.play('down');
      } else if (this.player.x > rabbit.x) rabbit.frame = 7;
      else if (this.player.x < rabbit.x) rabbit.frame = 4;
    });

    this.slimes.children.forEach((slime) => {
      if (this.game.physics.arcade.distanceBetween(this.player, slime) > 300) {
        if (this.game.physics.arcade.distanceBetween(this.player, slime) < 375) {
          this.game.physics.arcade.moveToObject(slime, this.player, 100);
          slime.animations.play('move');
        } else {
          this.game.physics.arcade.moveToObject(slime, this.player, 0);
          // Idle Animation
        }
      } else {
        slime.body.velocity.x = 0;
        slime.body.velocity.y = 0;
        slime.animations.play('shoot');
        if (this.game.time.now > slime.nextShoot) {
          slime.slimeball.reset(slime.x, slime.y);
          this.game.physics.arcade.moveToObject(slime.slimeball, this.player, 400);
          slime.slimeball.animations.play('move');
          slime.nextShoot = this.game.time.now + 1000;
        }
      }
    });

    this.mushrooms.children.forEach((mushroom) => {
      if (this.game.time.now > mushroom.nextMove) {
        if (this.game.physics.arcade.distanceBetween(this.player, mushroom) < 375) {
          this.game.physics.arcade.moveToObject(mushroom, this.player, 150);
          mushroom.animations.play('move');
        } else {
          this.game.physics.arcade.moveToObject(mushroom, this.player, 0);
          // Idle Animation
        }
        if (this.player.x > mushroom.x) mushroom.scale.x = -1;
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
          if (this.game.physics.arcade.distanceBetween(this.player, mushroom) < 160) {
            this.player.health -= 3;
            const hitText = this.game.add.text(this.player.x, this.player.y, '-3', { fontSize: '16px', fill: 'red' });
            destroyText(hitText);
          }
        }, 1000);
        setTimeout(() => { mushroom.shockwave.alpha = 0; }, 1500);
        mushroom.nextMove = this.game.time.now + 1500;
        mushroom.nextJump = this.game.time.now + 5000;
      }
    });

    this.game.physics.arcade.overlap(this.player, this.rabbits, killEnemy, null, this);
    this.game.physics.arcade.overlap(this.player, this.slimeballs, getShot, null, this);
    this.game.physics.arcade.overlap(this.player, this.mushrooms, hitMushroom, null, this);

    this.game.physics.arcade.overlap(this.gunBullets, this.rabbits, shootEnemy, null, this);
    this.game.physics.arcade.overlap(this.gunBullets, this.slimes, shootSlime, null, this);
    this.game.physics.arcade.overlap(this.gunBullets, this.mushrooms, shootMushroom, null, this);
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

  getProjectiles() {
    return this.projectiles;
  },
};

export default module;
