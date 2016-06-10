import levelModule from './modules/level';
import monsterModule from './modules/monster';
import playerModule from './modules/player';
import gunModule from './modules/gun';
import itemModule from './modules/item';

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
    itemModule.preload(game);

    game.load.image('fruit', '/assets/peach.png');
    game.load.image('dialogWindow', '/assets/dialog.png');
    game.load.image('shopMenu', '/assets/shopMenu.png');
    game.load.image('market', '/assets/marketbcg.jpg');
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
    itemModule.create();

    this.levelText = game.add.text(16, 16, 'Level: 1', { fontSize: '16px', fill: '#670' });
    this.healthText = game.add.text(16, 32, 'Health: 100', { fontSize: '16px', fill: '#670' });
    this.expText = game.add.text(16, 48, 'Exp: 0', { fontSize: '16px', fill: '#670' });

    // Music
    this.backgroundMusic = game.add.audio('bgm');
    this.battleMusic = game.add.audio('battle');
    this.backgroundMusic.play('', 0, 0, false);

    this.fruit = game.add.sprite(300, 300, 'fruit');
    game.physics.arcade.enable(this.fruit);
    this.fruit.body.collideWorldBounds = true;
    this.fruit.healingStrength = 25;
    this.npc = game.add.sprite(130, 200, 'npc');
    game.physics.arcade.enable(this.npc);
    this.npc.animations.add('walk');
    this.npc.animations.play('walk', 5, true);
    this.npc.collideWorldBounds = true;
    this.isTalkingToNPC = false;
    this.dialogWindow = game.add.sprite(95, 150, 'dialogWindow');
    this.dialogWindow.visible = false;
    this.dialogueText = game.add.text(180, 190, '');
    this.dialogueText.visible = false;
    this.choiceText = game.add.text(200, 600, '');
    this.choiceText.visible = false;
    this.market = game.add.sprite(0, 0, 'market');
    this.market.visible = false;
    this.shopMenu = game.add.sprite(150, 60, 'shopMenu');
    this.shopMenu.scale.setTo(.8, .8);
    this.shopMenu.visible = false;
    this.descriptionText = game.add.text(180, 570, 'Click outside of menu to exit.');
    this.descriptionText.visible = false;
    this.spaceKey = this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    this.spaceKey.onDown.add(function () {
      // When the pause  button is pressed, game is paused
      // menu
      mainState.togglePause();
      if (game.paused == true && !this.isTalkingToNPC) {
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
    itemModule.update();

    // TEMP
    this.levelText.text = `Level: ${playerModule.getLevel()}`;
    this.healthText.text = `Health: ${playerModule.getHealth()}`;
    this.expText.text = `Exp: ${playerModule.getExp()}`;

    this.levelText.y = game.camera.y + 16;
    this.healthText.y = game.camera.y + 32;
    this.expText.y = game.camera.y + 48;

    game.physics.arcade.overlap(this.player, this.fruit, this.pickUpFruit, null, this);
    game.physics.arcade.overlap(this.player, this.npc, (player, npc) => {this.displayDialogue(player, npc), setTimeout(() => {this.isTalkingToNPC = true;}, 2400)}, null, this);
    if(this.isTalkingToNPC){
    	console.log('is talking');
    	this.displayShopMenu();
    	this.isTalkingToNPC = false;
    }
    if (game.physics.arcade.overlap(this.player, itemModule.getCoins(), itemModule.pickUpCoin, null, this))
      itemModule.gainGold();
    if (game.physics.arcade.overlap(this.player, itemModule.getMeats(), itemModule.pickUpMeat, null, this))
      itemModule.gainMeat();
    if (game.physics.arcade.overlap(this.player, itemModule.getGels(), itemModule.pickUpGel, null, this))
      itemModule.gainGel();
    if (game.physics.arcade.overlap(this.player, itemModule.getCaps(), itemModule.pickUpCap, null, this))
      itemModule.gainCap();

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

    // Pause game and add dialogue window
    var delay = 1200;
    this.togglePause();
    this.dialogueText.text = 'Duck: Welcome to the Weapons Store!';
    this.dialogWindow.visible = true;
    this.dialogueText.visible = true;
    
    setTimeout(() => {
      this.dialogueText.text = 'Duck: How can I help you today?';
    }, delay);
    setTimeout(() => {
      this.dialogWindow.visible = false;
      this.dialogueText.visible = false;
      this.togglePause();
    }, 2*delay);
  },
  displayShopMenu() {
  	game.paused = true;
   	// Display menu
  	this.market.visible = true;
  	this.shopMenu.visible = true;
  	this.descriptionText.visible = true;

    // Calculate 4 corners of the menu
    var x1 = 150, x2 = 150+512,
    	y1 = 60, y2 = 60+512;

    	console.log(this.isTalkingToNPC);	// not reading input.
    this.choiceText.visible = true;
    this.choiceText.text = 'Choose your weapon.';
    if(game.input.activePointer.leftButton.isDown && this.isTalkingToNPC){   
    	var event = game.input.mousePointer;
    	console.log("input");	// not reading input
	    if(event.x > x1 && event.x < x2 && event.y > y1 && event.y < y2){
	    	var choicemap = ['Group1', 'Group2', 'Group3', 'Group4'];
	    	var x = game.input.x - x1;
	    	var y = game.input.y - y1;
	    	var choice = Math.floor(x/256) + 2*Math.floor(y/256);
	    	console.log(choice);
	    	this.choiceText.text = 'Your choice is: ' + choicemap[choice];
    	}
    	else{
    		console.log('Exit');
    		this.market.visible = false;
    		this.descriptionText.visible = false;
    		this.choiceText.visible = false;
    		this.shopMenu.visible = false;
    		game.paused = false;
    	}
    }
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
