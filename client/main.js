import playerModule from './modules/player';
import gunModule from './modules/gun';

window.PIXI = require('phaser/build/custom/pixi');
window.p2 = require('phaser/build/custom/p2');
window.Phaser = require('phaser/build/custom/phaser-split');

const game = new Phaser.Game(800, 640, Phaser.AUTO, '');

const mainState = {
  preload() {
    // Modules
    playerModule.initialize(game);
    playerModule.preload(game);
    gunModule.preload(game);

    game.load.spritesheet('rabbit', '/assets/rabbit.png', 32, 32);
    game.load.spritesheet('npc', '/assets/chick.png', 16, 18, 4);
    game.load.tilemap('map', 'assets/grassland1.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.image('grass', 'assets/tilesets/grass-tiles-2-small.png');
    game.load.image('tree', 'assets/tilesets/tree2-final.png');
    game.load.image('fruit', '/assets/peach.png');
    game.load.image('dialogWindow', '/assets/dialog.png');
  },
  create() {
    game.physics.startSystem(Phaser.Physics.ARCADE);
    // Map
    this.map = game.add.tilemap('map');
    this.map.addTilesetImage('grass-tiles-2-small', 'grass');
    this.map.addTilesetImage('tree2-final', 'tree');

    this.backgroundLayer = this.map.createLayer('Background');
    this.foregroundLayer = this.map.createLayer('Foreground');
    // map.setCollisionBetween(54, 83);

    this.backgroundLayer.resizeWorld();
    this.foregroundLayer.resizeWorld();
    game.physics.arcade.enable(this.foregroundLayer);

    this.map.setCollisionByExclusion([], true, this.foregroundLayer);

    // Modules
    playerModule.create();
    this.player = playerModule.getPlayer();

    gunModule.initialize(game, playerModule.getPlayer());
    gunModule.create();


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
    this.spaceKey.onDown.add(this.togglePause, this);
    this.topLayer = this.map.createLayer('Top');
    this.topLayer.resizeWorld();
  },
  update() {
    // Modules
    playerModule.update();

    game.physics.arcade.collide(this.player, this.foregroundLayer);
    game.physics.arcade.collide(this.rabbit, this.foregroundLayer);

    if (game.time.now > this.rabbit.nextMove) {
      game.physics.arcade.moveToObject(this.rabbit, this.player, 250);
      if (this.rabbit.x > this.player.x + 30) this.rabbit.animations.play('left');
      else if (this.rabbit.x < this.player.x - 30) this.rabbit.animations.play('right');
      else if (this.rabbit.y > this.player.y) this.rabbit.animations.play('up');
      else this.rabbit.animations.play('down');
    } else if (this.player.x > this.rabbit.x) this.rabbit.frame = 7;
    else if (this.player.x < this.rabbit.x) this.rabbit.frame = 4;

    // TEMP
    this.levelText.text = `Level: ${playerModule.getLevel()}`;
    this.healthText.text = `Health: ${playerModule.getHealth()}`;
    this.expText.text = `Exp: ${playerModule.getExp()}`;

    game.physics.arcade.overlap(this.player, this.rabbit, this.killEnemy, null, this);
    game.physics.arcade.overlap(this.player, this.fruit, this.pickUpFruit, null, this);
    game.physics.arcade.overlap(this.player, this.npc, this.displayDialogue, null, this);
    game.physics.arcade.overlap(playerModule.getBullets(), this.rabbit, this.shootEnemy, null, this);
  },
  togglePause() {
    game.physics.arcade.isPaused = !game.physics.arcade.isPaused;
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
    // Kill enemy if enemyHp is 0.
    if (rabbit.health === 0) {
      player.exp += 10;  // Increment exp value
      // Level up if exp reaches over 100.
      if (player.exp >= 100) {
        player.level++;
        player.exp = 0;
        this.levelUpText = game.add.text(player.x, player.y - 50, 'Level Up!', { fontSize: '16px', fill: 'yellow' });
        this.destroyText(this.levelUpText);
      }
      // rabbit respawns when killed
      rabbit.x = Math.random() * 800;
      rabbit.y = Math.random() * 600;
      rabbit.health = 3;
    }
    // if player's health is 0, the game is over
    if (player.health === 0) {
      player.kill();
      // gameOverText = game.add.text(200, 250, "Game Over", { fontSize: '64px', fill: 'red'});
    }
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
      // Level up if exp reaches over 100.
      if (this.player.exp >= 100) {
        this.player.level++;
        this.player.exp = 0;
        this.levelUpText = game.add.text(this.player.x, this.player.y - 50, 'Level Up!', { fontSize: '16px', fill: 'yellow' });
        this.destroyText(this.levelUpText);
      }
      // rabbit respawns 1 second after killed
      rabbit.x = Math.random() * 800;
      rabbit.y = Math.random() * 600;
      rabbit.body.velocity.x = 0;
      rabbit.body.velocity.y = 0;
      rabbit.health = 3;
      rabbit.nextMove = game.time.now + 1000;

    // otherwise the rabbit is knocked back
    } else game.physics.arcade.moveToObject(this.rabbit, this.player, -100);
  },
};

game.state.add('main', mainState);
game.state.start('main');
