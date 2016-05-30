import levelModule from './modules/level';
import monsterModule from './modules/monster';
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

    monsterModule.preload(game);

    game.load.image('fruit', '/assets/peach.png');
    game.load.image('dialogWindow', '/assets/dialog.png');
    game.load.image('menu', 'assets/number-buttons-90x90.png', 270, 180);
    game.load.audio('bgm', 'assets/bgm.mp3');
    game.load.audio('battle', 'assets/battle.mp3');
  },
  create() {
    game.physics.startSystem(Phaser.Physics.ARCADE);

    // Modules
    levelModule.create();
    playerModule.create();
    this.player = playerModule.getPlayer();
    game.camera.follow(this.player);
    gunModule.create(this.player, playerModule.getCursors());
    monsterModule.create();

    this.levelText = game.add.text(16, 16, 'Level: 1', { fontSize: '16px', fill: '#670' });
    this.healthText = game.add.text(16, 32, 'Health: 100', { fontSize: '16px', fill: '#670' });
    // manaText = game.add.text(16, 48, 'Mana: 100', { fontSize: '16px', fill: '#670' });
    this.expText = game.add.text(16, 64, 'Exp: 0', { fontSize: '16px', fill: '#670' });

    // Music
    this.backgroundMusic = game.add.audio('bgm');
    this.battleMusic = game.add.audio('battle');
    this.backgroundMusic.play('', 0, 0, false);

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

    // UI Code
    this.hitpointsUI = document.getElementById('hitpoints');
  },


  update() {
    // Modules
    playerModule.update();
    gunModule.update();
    levelModule.update();
    monsterModule.update();

    // TEMP
    this.levelText.text = `Level: ${playerModule.getLevel()}`;
    this.healthText.text = `Health: ${playerModule.getHealth()}`;
    this.expText.text = `Exp: ${playerModule.getExp()}`;

    game.physics.arcade.overlap(this.player, this.fruit, this.pickUpFruit, null, this);
    game.physics.arcade.overlap(this.player, this.npc, this.displayDialogue, null, this);

    if (!monsterModule.getAggroState()) {
      if (this.backgroundMusic.volume <= 0.1) {
        this.backgroundMusic.fadeTo(1000, 1);
        this.battleMusic.fadeOut(1000);
      }
    } else {
      if (!this.battleMusic.isPlaying) {
        this.battleMusic.fadeIn(1, true);
        this.backgroundMusic.fadeTo(1, 0.01);
      }
    }
    this.hitpointsUI.style.width = `${playerModule.getHealth() / 100 * 180}px`;
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
  pickUpFruit(player, fruit) {
    player.health += fruit.healingStrength;
    if (player.health > 100) {
      player.health = 100;
    }

    fruit.kill();
  },
};

game.state.add('main', mainState);
game.state.start('main');
