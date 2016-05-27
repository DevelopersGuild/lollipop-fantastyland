import levelModule from './modules/level';
import playerModule from './modules/player';
import gunModule from './modules/gun';

window.PIXI = require('phaser/build/custom/pixi');
window.p2 = require('phaser/build/custom/p2');
window.Phaser = require('phaser/build/custom/phaser-split');

const game = new Phaser.Game(800, 640, Phaser.AUTO, '');
let w = 800;
let h = 640;
const pauseMenu = {
  unpause(event) {   //unpause is a method on pauseMenu... (pauseMenu.unpause)
    // Only act if paused
    if (game.paused) {
      // Calculate corners of the menu
      let x1 = w/2 - 270/2, x2 = w/2 + 270/2,
          y1 = h/2 - 180/2, y2 = h/2 + 180/2;

       // Check if the click was inside the menu
      if (event.x > x1 && event.x < x2 && event.y > y1 && event.y < y2 ) {
      }
      // Remove the menu and the label
      else {
          mainState.menu.destroy();

          // Unpause the game
          game.paused = false;
          //mainState.togglePause();
      }
    }
  }

}


const mainState = {
  preload() {
    // Modules
    playerModule.preload(game);
    gunModule.preload(game);

    levelModule.preload(game);

    game.load.spritesheet('rabbit', '/assets/rabbit.png', 32, 32);
    game.load.spritesheet('npc', '/assets/chick.png', 16, 18, 4);
    game.load.spritesheet('slime', '/assets/slime.png', 32, 32);
    game.load.spritesheet('projectile', '/assets/projectile.png', 16, 16);
    game.load.spritesheet('mushroom', '/assets/mushroom.png', 68, 60);
    game.load.image('fruit', '/assets/peach.png');
    game.load.image('dialogWindow', '/assets/dialog.png');
    game.load.image('menu', 'assets/number-buttons-90x90.png', 270, 180);
    game.load.image('shockwave', '/assets/shockwave.png');
  },
  create() {
    game.physics.startSystem(Phaser.Physics.ARCADE);

    // Modules
    levelModule.create();
    playerModule.create();
    this.player = playerModule.getPlayer();
    game.camera.follow(this.player);
    gunModule.create(this.player, playerModule.getCursors());


    this.levelText = game.add.text(16, 16, 'Level: 1', { fontSize: '16px', fill: '#670' });
    this.healthText = game.add.text(16, 32, 'Health: 100', { fontSize: '16px', fill: '#670' });
    // manaText = game.add.text(16, 48, 'Mana: 100', { fontSize: '16px', fill: '#670' });
    this.expText = game.add.text(16, 64, 'Exp: 0', { fontSize: '16px', fill: '#670' });
    this.rabbit = game.add.sprite(200, 200, 'rabbit');
    game.physics.arcade.enable(this.rabbit);
    this.rabbit.body.collideWorldBounds = true;
    this.rabbit.health = 3;
    this.rabbit.nextMove = 0;
    this.rabbit.animations.add('down', [0, 1, 2], 10, true);
    this.rabbit.animations.add('left', [3, 4, 5], 10, true);
    this.rabbit.animations.add('right', [6, 7, 8], 10, true);
    this.rabbit.animations.add('up', [9, 10, 11], 10, true);

    this.slime = game.add.sprite(500, 400, 'slime');
    game.physics.arcade.enable(this.slime);
    this.slime.body.collideWorldBounds = true;
    this.slime.health = 3;
    this.slime.nextShoot = 0;
    this.slime.animations.add('move', [2, 3], 5, true);
    this.slime.animations.add('shoot', [4, 5], 5, true);
    this.projectile = game.add.sprite(-10, -10, 'projectile');
    game.physics.arcade.enable(this.projectile);
    this.projectile.animations.add('move', [0, 1, 2], 3, true);

    this.mushroom = game.add.sprite(300, 400, 'mushroom');
    game.physics.arcade.enable(this.mushroom);
    this.mushroom.anchor.set(0.5, 0.5);
    this.mushroom.body.collideWorldBounds = true;
    this.mushroom.health = 8;
    this.mushroom.nextMove = 0;
    this.mushroom.nextJump = 0;
    this.mushroom.animations.add('move', [0, 1, 2, 3], 10, true);
    this.mushroom.animations.add('jump', [4, 5, 6, 7, 8], 5, true);
    this.shockwave = game.add.sprite(0, 0, 'shockwave');
    this.shockwave.alpha = 0;

    this.fruit = game.add.sprite(300, 300, 'fruit');
    game.physics.arcade.enable(this.fruit);
    this.fruit.body.collideWorldBounds = true;
    this.fruit.healingStrength = 25;
    this.npc = game.add.sprite(100, 400, 'npc');
    game.physics.arcade.enable(this.npc);
    this.npc.animations.add('walk');
    this.npc.animations.play('walk', 5, true);
    this.npc.collideWorldBounds = true;
    this.spaceKey = this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    this.spaceKey.onDown.add(function () {
      // When the pause  button is pressed, game is paused
      // menu
      mainState.togglePause();
      if (game.paused == true) {
         console.log("game paused true");
         mainState.menu = game.add.sprite(270, 235, 'menu');

      } else {
          console.log("game paused false");
          mainState.menu.destroy();
      }
    });
    // Add a input listener that can help us return from being paused
    game.input.onDown.add(pauseMenu.unpause, {});
    // README: Keep this at the bottom of this function!
    levelModule.createEntities();
    levelModule.createTopLayer();
  },


  update() {
    // Modules
    playerModule.update();
    gunModule.update();
    levelModule.update(this.player, this.rabbit, this.slime, this.mushroom);

    if (game.time.now > this.rabbit.nextMove) {
      game.physics.arcade.moveToObject(this.rabbit, this.player, 200);
      if (this.rabbit.x > this.player.x + 30) this.rabbit.animations.play('left');
      else if (this.rabbit.x < this.player.x - 30) this.rabbit.animations.play('right');
      else if (this.rabbit.y > this.player.y) this.rabbit.animations.play('up');
      else this.rabbit.animations.play('down');
    } else if (this.player.x > this.rabbit.x) this.rabbit.frame = 7;
    else if (this.player.x < this.rabbit.x) this.rabbit.frame = 4;

    if (this.player.exp >= 100) {
      this.player.level++;
      this.player.exp -= 100;
      this.levelUpText = game.add.text(this.player.x, this.player.y - 50, 'Level Up!', { fontSize: '16px', fill: 'yellow' });
      this.destroyText(this.levelUpText);
    }
    if (this.player.health === 0) {
      this.player.kill();
      this.gameOverText = game.add.text(200, 250, "Game Over", { fontSize: '64px', fill: 'red'});
    }

    if (game.physics.arcade.distanceBetween(this.player, this.slime) > 300) {
      game.physics.arcade.moveToObject(this.slime, this.player, 100);
      this.slime.animations.play('move');
    }
    else {
      this.slime.body.velocity.x = 0;
      this.slime.body.velocity.y = 0;
      this.slime.animations.play('shoot');
      if (game.time.now > this.slime.nextShoot) {
        this.projectile.reset(this.slime.x, this.slime.y);
        game.physics.arcade.moveToObject(this.projectile, this.player, 400);
        this.projectile.animations.play('move');
        this.slime.nextShoot = game.time.now + 1000;
      }
    }

    if (game.time.now > this.mushroom.nextMove) {
      game.physics.arcade.moveToObject(this.mushroom, this.player, 150);
      this.mushroom.animations.play('move');
      if (this.player.x > this.mushroom.x) this.mushroom.scale.x = -1;
      else this.mushroom.scale.x = 1;
    }
    else {
      this.mushroom.body.velocity.x = 0;
      this.mushroom.body.velocity.y = 0;
      this.mushroom.animations.play('jump');
    }
    if (game.time.now > this.mushroom.nextJump) {
      setTimeout(() => {
        this.shockwave.reset(this.mushroom.x - 140, this.mushroom.y - 140);
        this.shockwave.alpha = 1;
        if (game.physics.arcade.distanceBetween(this.player, this.mushroom) < 160) {
          this.player.health -= 3;
          this.hitText = game.add.text(this.player.x, this.player.y, '-3', { fontSize: '16px', fill: 'red' });
          this.destroyText(this.hitText);
        }
      }, 1000);
      setTimeout(() => { this.shockwave.alpha = 0; }, 1500);
      this.mushroom.nextMove = game.time.now + 1500;
      this.mushroom.nextJump = game.time.now + 5000;
    }

    // TEMP
    this.levelText.text = `Level: ${playerModule.getLevel()}`;
    this.healthText.text = `Health: ${playerModule.getHealth()}`;
    this.expText.text = `Exp: ${playerModule.getExp()}`;

    game.physics.arcade.overlap(this.player, this.rabbit, this.killEnemy, null, this);
    game.physics.arcade.overlap(this.player, this.fruit, this.pickUpFruit, null, this);
    game.physics.arcade.overlap(this.player, this.npc, this.displayDialogue, null, this);
    game.physics.arcade.overlap(this.player, this.projectile, this.getShot, null, this);
    game.physics.arcade.overlap(this.player, this.mushroom, this.hitMushroom, null, this);
    game.physics.arcade.overlap(gunModule.getBullets(), this.rabbit, this.shootEnemy, null, this);
    game.physics.arcade.overlap(gunModule.getBullets(), this.slime, this.shootSlime, null, this);
    game.physics.arcade.overlap(gunModule.getBullets(), this.mushroom, this.shootMushroom, null, this);
  },
  togglePause() {
    game.paused = !game.paused;
  },
  destroyText(text) {
    setTimeout(() => {
      text.destroy();
    }, 1000);
  },
  displayDialogue(player, npc) {
    // player is knocked back
    game.physics.arcade.moveToObject(player, npc, -200);
    // display dialogue
    this.dialogue = game.add.text(npc.x, npc.y - 18, 'Hi there!', { fontSize: '12px', fill: 'red' });
    this.destroyText(this.dialogue);
    setTimeout(() => {
      this.dialogue = game.add.text(npc.x, npc.y - 18, 'Watch out for the rabbits!', { fontSize: '12px', fill: 'red' });
      this.destroyText(this.dialogue);
    }, 2000);

    // Pause game and add dialogue window
    this.togglePause();
    this.dialogWindow = game.add.sprite(95, 150, 'dialogWindow');
    this.dialogueText = game.add.text(180, 190, 'Duck: Welcome to the Weapons Store!');
    this.dialogWindow.visible = true;
    this.destroyText(this.dialogueText);
    setTimeout(() => {
      this.dialogueText = game.add.text(200, 190, 'Duck: How can I help you today?');
      this.destroyText(this.dialogueText);
    }, 1500);
    setTimeout(() => {
      this.dialogWindow.destroy();
      this.togglePause();
    }, 2500);


    setTimeout(() => {
      this.dialogue = game.add.text(npc.x, npc.y - 18, 'See you next time!', { fontSize: '12px', fill: 'red' });
      this.destroyText(this.dialogue);
    }, 4000);
  },
  killEnemy(player, rabbit) {
    // stop the rabbit from approaching the player for the next 0.5 seconds
    rabbit.nextMove = game.time.now + 500;
    // player and rabbit are knocked back
    game.physics.arcade.moveToObject(rabbit, player, -100);
    game.physics.arcade.moveToObject(player, rabbit, -200);
    // deal damage to the player
    player.health--;
    // show text when hit
    this.hitText = game.add.text(player.x, player.y, '-1', { fontSize: '16px', fill: 'red' });
    this.destroyText(this.hitText);
  },
  pickUpFruit(player, fruit) {
    player.health += fruit.healingStrength;
    if (player.health > 100) {
      player.health = 100;
    }

    fruit.kill();
  },
  shootEnemy(rabbit, bullet) {
    // kill the bullet
    bullet.kill();
    // deal damage to the rabbit
    rabbit.health--;
    // show text when hit
    this.hitText = game.add.text(rabbit.x, rabbit.y, '-1', { fontSize: '16px', fill: 'red' });
    this.destroyText(this.hitText);
    // stop the rabbit from approaching the player for the next 0.1 seconds
    rabbit.nextMove = game.time.now + 100;
    // Kill enemy if enemyHp is 0.
    if (rabbit.health === 0) {
      this.player.exp += 10;  // Increment exp value
      // rabbit respawns 1 second after killed
      rabbit.x = Math.random() * 800;
      rabbit.y = Math.random() * 1440;
      rabbit.body.velocity.x = 0;
      rabbit.body.velocity.y = 0;
      rabbit.health = 3;
      rabbit.nextMove = game.time.now + 1000;

    // otherwise the rabbit is knocked back
    } else game.physics.arcade.moveToObject(this.rabbit, this.player, -100);
  },
  shootSlime(slime, bullet) {
    bullet.kill();
    slime.health--;
    this.hitText = game.add.text(slime.x, slime.y, '-1', { fontSize: '16px', fill: 'red' });
    this.destroyText(this.hitText);
    if (slime.health == 0) {
      this.player.exp += 15;
      slime.x = Math.random() * 800;
      slime.y = Math.random() * 1440;
      slime.health = 3;
      slime.nextShoot = game.time.now + 1000;
    }
  },
  getShot(player, projectile) {
    projectile.reset(-10, -10);
    projectile.body.velocity.x = 0;
    projectile.body.velocity.y = 0;
    player.health--;
    game.physics.arcade.moveToObject(player, this.slime, -100);
    this.hitText = game.add.text(player.x, player.y, '-1', { fontSize: '16px', fill: 'red' });
    this.destroyText(this.hitText);
  },
  shootMushroom(mushroom, bullet) {
    bullet.kill();
    mushroom.health--;
    this.hitText = game.add.text(mushroom.x, mushroom.y, '-1', { fontSize: '16px', fill: 'red' });
    this.destroyText(this.hitText);
    if (mushroom.health == 0) {
      this.player.exp += 50;
      mushroom.x = Math.random() * 800;
      mushroom.y = Math.random() * 1440;
      mushroom.health = 8;
      mushroom.nextMove = game.time.now + 1500;
      mushroom.nextJump = game.time.now + 5000;
    }
  },
  hitMushroom(player, mushroom) {
    mushroom.nextMove = game.time.now + 1000;
    game.physics.arcade.moveToObject(player, mushroom, -200);
    player.health -= 2;
    this.hitText = game.add.text(player.x, player.y, '-2', { fontSize: '16px', fill: 'red' });
    this.destroyText(this.hitText);
  },
};

game.state.add('main', mainState);
game.state.start('main');
