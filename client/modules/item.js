const module = {

	preload(game) {
		this.game = game;
    	this.game.load.spritesheet('coin', '/assets/coin.png', 22, 20);
    	this.game.load.image('meat', '/assets/meat.png');
    	this.game.load.image('gel', '/assets/gel.png');
    	this.game.load.image('cap', '/assets/cap.png');
    },

    create() {
        this.coins = this.game.add.group();
    	this.coins.enableBody = true;
    	this.coins.createMultiple(100, 'coin');
    	this.coins.callAll('animations.add', 'animations', 'spin',
    		[0, 1, 2, 3, 4, 5, 6, 7, 8, 9], 10, true);
    	this.meats = this.game.add.group();
    	this.meats.enableBody = true;
    	this.meats.createMultiple(100, 'meat');
    	this.gels = this.game.add.group();
    	this.gels.enableBody = true;
    	this.gels.createMultiple(100, 'gel');
   		this.caps = this.game.add.group();
    	this.caps.enableBody = true;
    	this.caps.createMultiple(100, 'cap');

    	this.gold = 0;
    	this.numOfMeats = 0;
    	this.numOfGels = 0;
    	this.numOfCaps = 0;

    	this.goldText = this.game.add.text(16, 64, 'Gold: 0', { fontSize: '16px', fill: '#670' });
    	this.meatText = this.game.add.text(16, 80, 'Rabbit Meat: 0', { fontSize: '16px', fill: '#670' });
    	this.gelText = this.game.add.text(16, 96, 'Slime Gel: 0', { fontSize: '16px', fill: '#670' });
    	this.capText = this.game.add.text(16, 112, 'Mushroom Cap: 0', { fontSize: '16px', fill: '#670' });
	},

	update() {
		this.goldText.text = `Gold: ${this.gold}`;
    	this.meatText.text = `Rabbit Meat: ${this.numOfMeats}`;
    	this.gelText.text = `Slime Gel: ${this.numOfGels}`;
    	this.capText.text = `Mushroom Cap: ${this.numOfCaps}`;

    	this.goldText.x = this.game.camera.x + 16;
    	this.meatText.x = this.game.camera.x + 16;
    	this.gelText.x = this.game.camera.x + 16;
    	this.capText.x = this.game.camera.x + 16;
    	this.goldText.y = this.game.camera.y + 64;
    	this.meatText.y = this.game.camera.y + 80;
    	this.gelText.y = this.game.camera.y + 96;
    	this.capText.y = this.game.camera.y + 112;
	},

    pickUpCoin(player, coin) {
    	coin.kill();
  	},

  	pickUpMeat(player, meat) {
    	meat.kill();
  	},
  	
  	pickUpGel(player, gel) {
    	gel.kill();
  	},
  	
  	pickUpCap(player, cap) {
    	cap.kill();
  	},

    rabbitDrop(rabbit) {
    	if (this.coins.countDead() > 0) {
    		let coin = this.coins.getFirstDead();
    		coin.reset(rabbit.x, rabbit.y);
    		coin.animations.play('spin');
    	}
    	if (this.meats.countDead() > 0 && Math.random() > 0.5)
    		this.meats.getFirstDead().reset(rabbit.x, rabbit.y);
    },

    slimeDrop(slime) {
    	if (this.coins.countDead() > 0) {
    		let coin = this.coins.getFirstDead();
    		coin.reset(slime.x, slime.y);
    		coin.animations.play('spin');
    	}
    	if (this.gels.countDead() > 0 && Math.random() > 0.5)
      		this.gels.getFirstDead().reset(slime.x + 20, slime.y);
    },

    mushroomDrop(mushroom) {
    	if (this.coins.countDead() > 0) {
    		let coin = this.coins.getFirstDead();
    		coin.reset(mushroom.x, mushroom.y);
    		coin.animations.play('spin');
    	}
    	if (this.caps.countDead() > 0 && Math.random() > 0.5)
      		this.caps.getFirstDead().reset(mushroom.x + 20, mushroom.y);
    },

    gainGold() { this.gold += Math.floor(Math.random() * 3 + 1); },
    gainMeat() { this.numOfMeats++; },
    gainGel() { this.numOfGels++; },
    gainCap() { this.numOfCaps++; },

    getCoins() { return this.coins; },
    getMeats() { return this.meats; },
    getGels() { return this.gels; },
    getCaps() { return this.caps; },
}

export default module;