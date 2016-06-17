import gunModule from './gun';
import playerModule from './player';
import itemModule from './item';

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
  rabbit.health -= this.player.strength + 2;
  // show text when hit
  const hitText = this.game.add.text(rabbit.x, rabbit.y, `-${this.player.strength + 2}`, { fontSize: '16px', fill: 'red' });
  destroyText(hitText);
  // stop the rabbit from approaching the player for the next 0.1 seconds
  rabbit.nextMove = this.game.time.now + 100;
  // Kill enemy if enemyHp is 0.
  if (rabbit.health <= 0) {
    this.player.exp += 10;  // Increment exp value
    itemModule.rabbitDrop(rabbit);
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
  slime.health -= this.player.strength + 2;
  const hitText = this.game.add.text(slime.x, slime.y, `-${this.player.strength + 2}`, { fontSize: '16px', fill: 'red' });
  destroyText(hitText);
  if (slime.health <= 0) {
    this.player.exp += 15;
    itemModule.slimeDrop(slime);
    slime.slimeball.destroy();
    slime.destroy();
  }
}

function shootMushroom(bullet, mushroom) {
  bullet.kill();
  mushroom.health -= this.player.strength + 2;
  const hitText = this.game.add.text(mushroom.x, mushroom.y, `-${this.player.strength + 2}`, { fontSize: '16px', fill: 'red' });
  destroyText(hitText);
  if (mushroom.health <= 0) {
    this.player.exp += 30;
    itemModule.mushroomDrop(mushroom);
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

function shootUnicorn(bullet, unicorn) {
  bullet.kill();
  unicorn.health -= this.player.strength + 2;
  const hitText = this.game.add.text(unicorn.x, unicorn.y, `-${this.player.strength + 2}`, { fontSize: '16px', fill: 'red' });
  destroyText(hitText);
  if (unicorn.health <= 0) {
    this.player.exp += 300;
    unicorn.animations.play('die');
    unicorn.destroy();
    this.starfall = false;
    this.rainbowUnicorn.alpha = 0;
  }
}

function hitUnicorn(player, unicorn) {
  this.game.physics.arcade.moveToObject(player, unicorn, -200);
}

const module = {
  preload(game) {
    this.game = game;

    this.game.load.spritesheet('rabbit', '/assets/rabbit.png', 32, 32);
    this.game.load.spritesheet('npc', '/assets/chick.png', 16, 18, 4);
    this.game.load.spritesheet('slime', '/assets/slime.png', 32, 32);
    this.game.load.spritesheet('slimeball', '/assets/projectile.png', 16, 16);
    this.game.load.spritesheet('mushroom', '/assets/mushroom.png', 68, 60);
    this.game.load.spritesheet('unicorn', '/assets/unicorn.png', 144, 160);
    this.game.load.spritesheet('rainbowUnicorn', '/assets/rainbowUnicorn.png', 318, 133);
    this.game.load.image('shockwave', '/assets/shockwave.png');
    this.game.load.image('star', '/assets/star.png');
    this.game.load.image('stardust', '/assets/stardust.png');
    this.game.load.image('rainbow', '/assets/rainbow.png');
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
    this.unicorns = this.game.add.group(this.monsters, 'unicorn', false, true);
    this.createUnicorn(800, 100);
    this.rainbowUnicorn = this.game.add.sprite(1000, 2000, 'rainbowUnicorn');
    this.rainbowUnicorn.anchor.set(0.6, 0.5);
    this.rainbowUnicorn.animations.add('charge', [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13], 10, true);
    this.rainbowUnicorn.animations.play('charge');
    this.rainbowUnicorn.alpha = 0;
    this.stars = this.game.add.group();
    this.stars.createMultiple(20, 'star');
    this.nextStar = 0;
    this.starfall = false;

    // Projectile sub-groups
    this.slimeballs = this.game.add.group(this.projectiles, 'slimeballs', false, true);

    // Misc Attack sub-group
    this.shockwaves = this.game.add.group(this.miscAttacks, 'shockwaves', false, true);
    this.shockwaves.createMultiple(20, 'shockwave');
    this.shockwaves.forEach((shockwave) => {
      shockwave.scale.setTo(0.3, 0.3);
    })

    this.aggro = false;
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
      if (this.game.physics.arcade.distanceBetween(slime, slime.slimeball) > 400)
        slime.slimeball.kill();
    });

    this.mushrooms.children.forEach((mushroom) => {
      if (this.game.time.now > mushroom.nextMove) {
        if (this.game.physics.arcade.distanceBetween(this.player, mushroom) < 375) {
          this.game.physics.arcade.moveToObject(mushroom, this.player, 180);
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
      if (this.game.time.now > mushroom.nextJump && this.game.physics.arcade.distanceBetween(this.player, mushroom) < 160) {
        setTimeout(() => {
          if (!this.game.paused) {
            mushroom.shockwave.reset(mushroom.x - 140, mushroom.y - 140);
            mushroom.shockwave.alpha = 1;
            if (this.game.physics.arcade.distanceBetween(this.player, mushroom) < 160) {
              this.player.health -= 3;
              this.game.physics.arcade.moveToObject(this.player, mushroom, -200);
              const hitText = this.game.add.text(this.player.x, this.player.y, '-3', { fontSize: '16px', fill: 'red' });
              destroyText(hitText);
            }
          }
        }, 1000);
        setTimeout(() => { mushroom.shockwave.alpha = 0; }, 1500);
        mushroom.nextMove = this.game.time.now + 1500;
        mushroom.nextJump = this.game.time.now + 5000;
      }
    });

    this.unicorns.children.forEach((unicorn) => {
      if (this.game.physics.arcade.distanceBetween(this.player, unicorn) < 375) unicorn.aggro = true;
      if (unicorn.health < 250) this.starfall = true;
      if (unicorn.charging) {
        this.rainbowUnicorn.x = unicorn.x;
        this.rainbowUnicorn.y = unicorn.y;
        unicorn.x += 7 * (unicorn.target.x - unicorn.x) / this.game.physics.arcade.distanceBetween(unicorn.target, unicorn);
        unicorn.y += 7 * (unicorn.target.y - unicorn.y) / this.game.physics.arcade.distanceBetween(unicorn.target, unicorn);
        if (this.game.physics.arcade.distanceBetween(this.player, unicorn) < 50) this.hitUnicorn(this.player, unicorn);
        if (this.game.physics.arcade.distanceBetween(unicorn.target, unicorn) < 10) {
          this.rainbowUnicorn.alpha = 0;
          unicorn.charging = false;
          unicorn.alpha = 1;
          unicorn.nextCharge = this.game.time.now + 5000;
        }
      }
      else if (unicorn.aggro && this.game.time.now > unicorn.nextCharge && this.game.time.now > unicorn.nextAttack) {
        unicorn.target.x = this.player.x + this.player.body.velocity.x / 2;
        unicorn.target.y = this.player.y + this.player.body.velocity.y / 2;
        unicorn.charging = true;
        unicorn.alpha = 0;
        this.rainbowUnicorn.alpha = 1;
        if (unicorn.target.x > unicorn.x) this.rainbowUnicorn.scale.x = 1;
        else this.rainbowUnicorn.scale.x = -1;
      }
      else if (unicorn.aggro && this.game.time.now > unicorn.nextAttack) {
        if (this.player.x > unicorn.x) unicorn.scale.x = 1;
        else unicorn.scale.x = -1;
        if (this.game.physics.arcade.distanceBetween(this.player, unicorn) > 150) {
          this.game.physics.arcade.moveToObject(unicorn, this.player, 200);
          unicorn.animations.play('walk');
        }
        else {
          unicorn.nextAttack = this.game.time.now + 1000;
          unicorn.body.velocity.x = 0;
          unicorn.body.velocity.y = 0;
          setTimeout(() => { unicorn.rainbow.alpha = 1; }, 500);
          setTimeout(() => { unicorn.rainbow.alpha = 0; }, 800);
          unicorn.rainbow.reset(unicorn.x, unicorn.y);
          if (unicorn.y - this.player.y > this.game.physics.arcade.distanceBetween(this.player, unicorn) / 2) {
            unicorn.animations.play('up');
            if (unicorn.scale.x === 1) unicorn.rainbow.rotation = -0.26;
            else unicorn.rainbow.rotation = -1.31;
            setTimeout(() => {
              if (this.game.physics.arcade.distanceBetween(this.player, unicorn) < 150 &&
              unicorn.y - this.player.y > this.game.physics.arcade.distanceBetween(this.player, unicorn) / 2) {
                this.player.health -= 2;
                this.game.physics.arcade.moveToObject(this.player, unicorn, -200);
                const hitText = this.game.add.text(this.player.x, this.player.y, '-2', { fontSize: '16px', fill: 'red' });
                destroyText(hitText);
              }
            }, 500);
          }
          else if (this.player.y - unicorn.y > this.game.physics.arcade.distanceBetween(this.player, unicorn) / 2) {
            unicorn.animations.play('down');
            if (unicorn.scale.x === 1) unicorn.rainbow.rotation = 1.83;
            else unicorn.rainbow.rotation = 2.88;
            setTimeout(() => {
              if (this.game.physics.arcade.distanceBetween(this.player, unicorn) < 150 &&
              this.player.y - unicorn.y > this.game.physics.arcade.distanceBetween(this.player, unicorn) / 2) {
                this.player.health -= 2;
                this.game.physics.arcade.moveToObject(this.player, unicorn, -200);
                const hitText = this.game.add.text(this.player.x, this.player.y, '-2', { fontSize: '16px', fill: 'red' });
                destroyText(hitText);
              }
            }, 500);
          }
          else {
            unicorn.animations.play('front');
            if (unicorn.scale.x === 1) unicorn.rainbow.rotation = 0.79;
            else unicorn.rainbow.rotation = -2.36;
            setTimeout(() => {
              if (this.game.physics.arcade.distanceBetween(this.player, unicorn) < 150 &&
              this.player.y - unicorn.y < this.game.physics.arcade.distanceBetween(this.player, unicorn) / 2 &&
              unicorn.y - this.player.y < this.game.physics.arcade.distanceBetween(this.player, unicorn) / 2) {
                this.player.health -= 2;
                this.game.physics.arcade.moveToObject(this.player, unicorn, -200);
                const hitText = this.game.add.text(this.player.x, this.player.y, '-2', { fontSize: '16px', fill: 'red' });
                destroyText(hitText);
              }
            }, 500);
          }
        }
      }
      else if (!unicorn.aggro) unicorn.animations.play('idle');
    });

    this.stars.forEachAlive((star) => {
      star.x += 4;
      star.y += 5;
    })
    if (this.starfall && this.game.time.now > this.nextStar) {
      this.nextStar = this.game.time.now + 200;
      if (this.stars.countDead() > 0) {
        let star = this.stars.getFirstDead();
        star.reset(Math.random() * 300 + this.player.x + this.player.body.velocity.x / 2 - 450,
          Math.random() * 300 + this.player.y + this.player.body.velocity.y / 2 - 400);
        setTimeout(() => {
          star.kill();
          if (this.shockwaves.countDead() > 0) {
            let shockwave = this.shockwaves.getFirstDead();
            shockwave.reset(star.x - 30, star.y - 30);
            setTimeout(() => { shockwave.kill(); }, 500);
          }
          if (this.game.physics.arcade.distanceBetween(this.player, star) < 50) {
            this.player.body.velocity.x = 0;
            this.player.body.velocity.y = 0;
            this.player.health--;
            const hitText = this.game.add.text(this.player.x, this.player.y, '-1', { fontSize: '16px', fill: 'red' });
            destroyText(hitText);
          }
        }, 1000);
      }
    }

    this.game.physics.arcade.overlap(this.player, this.rabbits, killEnemy, null, this);
    this.game.physics.arcade.overlap(this.player, this.slimeballs, getShot, null, this);
    this.game.physics.arcade.overlap(this.player, this.mushrooms, hitMushroom, null, this);
    this.game.physics.arcade.overlap(this.player, this.unicorns, hitUnicorn, null, this);

    this.game.physics.arcade.overlap(this.gunBullets, this.rabbits, shootEnemy, null, this);
    this.game.physics.arcade.overlap(this.gunBullets, this.slimes, shootSlime, null, this);
    this.game.physics.arcade.overlap(this.gunBullets, this.mushrooms, shootMushroom, null, this);
    this.game.physics.arcade.overlap(this.gunBullets, this.unicorns, shootUnicorn, null, this);

    this.aggro = false;

    for (let i = 0; i < this.monsters.children.length; i++) {
      for (let j = 0; j < this.monsters.children[i].children.length; j++) {
        if (this.game.physics.arcade.distanceBetween(this.player, this.monsters.children[i].children[j]) < 375) {
          this.aggro = true;
          break;
        }
      }

      if (this.aggro) break;
    }
  },

  createRabbit(x, y) {
    const rabbit = this.rabbits.create(x, y, 'rabbit');
    rabbit.health = 20;
    rabbit.nextMove = 0;
    rabbit.animations.add('down', [0, 1, 2], 10, true);
    rabbit.animations.add('left', [3, 4, 5], 10, true);
    rabbit.animations.add('right', [6, 7, 8], 10, true);
    rabbit.animations.add('up', [9, 10, 11], 10, true);
  },

  createSlime(x, y) {
    const slime = this.slimes.create(x, y, 'slime');
    slime.health = 20;
    slime.nextShoot = 0;
    slime.animations.add('move', [2, 3], 5, true);
    slime.animations.add('shoot', [4, 5], 5, true);

    slime.slimeball = this.slimeballs.create(-10, -10, 'slimeball');
    slime.slimeball.animations.add('move', [0, 1, 2], 3, true);
  },

  createMushroom(x, y) {
    const mushroom = this.mushrooms.create(x, y, 'mushroom');
    mushroom.anchor.set(0.5, 0.5);
    mushroom.health = 50;
    mushroom.nextMove = 0;
    mushroom.nextJump = 0;
    mushroom.animations.add('move', [0, 1, 2, 3], 10, true);
    mushroom.animations.add('jump', [4, 5, 6, 7, 8], 5, true);
    mushroom.shockwave = this.game.add.sprite(0, 0, 'shockwave');
    mushroom.shockwave.alpha = 0;
  },

  createUnicorn(x, y) {
    const unicorn = this.unicorns.create(x, y, 'unicorn');
    unicorn.anchor.set(0.25, 0.5);
    unicorn.health = 500;
    unicorn.nextAttack = 0;
    unicorn.nextCharge = 0;
    unicorn.charging = false;
    unicorn.aggro = false;
    unicorn.target = {x: 0, y: 0};
    unicorn.rainbow = this.game.add.sprite(0, 0, 'rainbow');
    unicorn.rainbow.anchor.set(0, 1);
    unicorn.rainbow.scale.setTo(0.2, 0.2);
    unicorn.rainbow.alpha = 0;
    unicorn.animations.add('idle', [0, 1, 2, 3, 4, 5, 6, 7, 8, 8], 10, true);
    unicorn.animations.add('walk', [9, 10, 11, 12, 13, 14, 15, 16], 10, true);
    unicorn.animations.add('up', [17, 18, 19, 20, 21, 22, 23, 24, 25, 25], 10, true);
    unicorn.animations.add('front', [26, 27, 28, 29, 30, 31, 32, 32, 32, 32], 10, true);
    unicorn.animations.add('down', [33, 34, 35, 36, 37, 38, 39, 39, 39, 39], 10, true);
    unicorn.animations.add('die', [40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 50], 5, true);
  },

  hitUnicorn(player, unicorn) {
    player.health -= 5;
    this.game.physics.arcade.moveToObject(player, unicorn, -200);
    const hitText = this.game.add.text(player.x, player.y, '-5', { fontSize: '16px', fill: 'red' });
    destroyText(hitText);
    this.rainbowUnicorn.alpha = 0;
    unicorn.charging = false;
    unicorn.alpha = 1;
    unicorn.nextCharge = this.game.time.now + 5000;
  },

  getMonsters() {
    return this.monsters;
  },

  getProjectiles() {
    return this.projectiles;
  },

  getAggroState() {
    return this.aggro;
  },
};

export default module;
