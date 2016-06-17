
function destroyText(text) {
  setTimeout(() => {
    text.destroy();
  }, 1000);
}

const playerModule = {
  preload(game, state) {
    this.game = game;
    this.game.load.spritesheet('player', '/assets/player.png', 32, 48);
    this.game.load.image('rifle-thumbnail', '/assets/rifle-thumbnail.png');
    this.game.load.image('shotgun-thumbnail', '/assets/shotgun-thumbnail.png');
    this.state = state;


  },

  create() {
    this.player = this.game.add.sprite(0, 0, 'player');

    this.rifle_thumbnail = this.game.add.sprite(0,0,'rifle-thumbnail');
    this.rifle_thumbnail.name = "rifle";

    this.shotgun_thumbnail = this.game.add.sprite(0,0,'shotgun-thumbnail');
    this.shotgun_thumbnail.name = "shotgun";

    this.game.physics.arcade.enable(this.player);
    this.player.anchor.setTo(0.5, 0.5);
    this.player.body.collideWorldBounds = true;

    this.gun;
  //  this.player.body.allowRotation = false;

    this.bullets = this.game.add.group();
    this.bullets.enableBody = true;
    this.bullets.createMultiple(100, 'bullet');
    this.bullets.setAll('checkWorldBounds', true);
    this.bullets.setAll('outOfBoundsKill', true);

    this.w = this.state.input.keyboard.addKey(Phaser.Keyboard.W);
    this.a = this.state.input.keyboard.addKey(Phaser.Keyboard.A);
    this.s = this.state.input.keyboard.addKey(Phaser.Keyboard.S);
    this.d = this.state.input.keyboard.addKey(Phaser.Keyboard.D);
    this.cursors = this.state.input.keyboard.createCursorKeys();
    this.t = this.state.input.keyboard.addKey(Phaser.Keyboard.T);
    this.e = this.state.input.keyboard.addKey(Phaser.Keyboard.E);
    this.v = this.state.input.keyboard.addKey(Phaser.Keyboard.V);

    // Initialize Level
    this.player.level = 1;

    // Initialize Health
    this.player.maxHealth = 20;
    this.player.health = 20;

    // Initialize EXP
    this.player.exp = 0;
    this.player.expRequired = 20;

    this.player.strength = 1;
    this.player.dexterity = 1;
    this.player.vitality = 1;
    this.player.abilityPoints = 0;

    this.fireRate = 200;
    this.nextFire = 0;

    this.abilityPointsText = this.game.add.text(16, 48, 'Ability Points: 0', { fontSize: '16px', fill: '#670' });
    this.strengthText = this.game.add.text(16, 64, 'Strength(T): 1', { fontSize: '16px', fill: '#670' });
    this.dexterityText = this.game.add.text(16, 80, 'Dexterity(E): 1', { fontSize: '16px', fill: '#670' });
    this.vitalityText = this.game.add.text(16, 96, 'Vitality(V): 1', { fontSize: '16px', fill: '#670' });
    this.abilityPointsText.fixedToCamera = true;
    this.strengthText.fixedToCamera = true;
    this.dexterityText.fixedToCamera = true;
    this.vitalityText.fixedToCamera = true;

    this.inventory = this.game.add.group();
    this.selected = 0;
    this.inventory.add(this.shotgun_thumbnail);
    //Adding key to toggle inventory
    this.invkey = this.state.input.keyboard.addKey(Phaser.Keyboard.I);
    //Adding keys to select items from topbar display of inventory
    this.onekey = this.state.input.keyboard.addKey(Phaser.Keyboard.ONE);
    this.twokey = this.state.input.keyboard.addKey(Phaser.Keyboard.TWO);
    this.threekey = this.state.input.keyboard.addKey(Phaser.Keyboard.THREE);
    this.fourkey = this.state.input.keyboard.addKey(Phaser.Keyboard.FOUR);
    this.fivekey = this.state.input.keyboard.addKey(Phaser.Keyboard.FIVE);

    this.onekey.onDown.add(function(e) { //console.log(e);
      playerModule.equip(0);
    });
    this.twokey.onDown.add(function(e) { //console.log(e);
      playerModule.equip(1);
    });
    this.threekey.onDown.add(function(e) { //console.log(e);
      playerModule.equip(2);
    });
    this.fourkey.onDown.add(function(e) { //console.log(e);
      playerModule.equip(3);
    });
    this.fivekey.onDown.add(function(e) { //console.log(e);
      playerModule.equip(4);
    }); /*
    this.threekey.onDown.add(this.equip(2));
    this.fourkey.onDown.add(this.equip(3));
    this.fivekey.onDown.add(this.equip(4));*/

    this.t.onDown.add(function(e) {
      if (this.player.abilityPoints > 0) {
        this.player.strength++;
        this.player.abilityPoints--;
      }
    }, this);

    this.e.onDown.add(function(e) {
      if (this.player.abilityPoints > 0) {
        this.player.dexterity++;
        this.player.abilityPoints--;
      }
    }, this);

    this.v.onDown.add(function(e) {
      if (this.player.abilityPoints > 0) {
        this.player.vitality++;
        this.player.abilityPoints--;
        this.player.heal(3);
      }
    }, this);

    //Topbar for inventory items
    this.TOPBAR_OFFSET = (this.game.width-(5*50))/2;
    this.topbarBmd = this.game.make.bitmapData(800, 100);
/*    for (let i = 0; i < this.inventory.children.length; i++) {
      this.topbarBmd.rect(this.TOPBAR_OFFSET+i*50,20,32,32, '#666666');
      this.inventoryBmd.draw(this.inventory.children[i], this.TOPBAR_OFFSET+i*50, 20);
    }*/


    this.topbarUi = this.game.add.sprite(0, 0, this.topbarBmd);
    this.topbarUi.fixedToCamera = true;

    this.drawTopBar();
  //Inventory grid
/*
    this.inventoryBmd = this.game.make.bitmapData(800,600);
    for (let j = 0;  j< 10; j++) {
      for (let k = 0; k < 10; k++) {
        this.inventoryBmd.rect(200+j*34, 200+k*34, 32, 32,  '#666666');
      }
    }
    this.inventoryUi = this.game.add.sprite(0,0, this.inventoryBmd);
    this.inventoryUi.fixedToCamera = true;
    this.inventoryUi.visible = false;
    this.invkey.onDown.add(function() {
      mainState.inventoryUi.visible = !mainState.inventoryUi.visible;
      console.log(mainState.inventoryUi.visible);
    });*/


    // Player animations
    this.player.animations.add('down', [0, 1, 2, 3], 10, true);
    this.player.animations.add('left', [4, 5, 6, 7], 10, true);
    this.player.animations.add('right', [8, 9, 10, 11], 10, true);
    this.player.animations.add('up', [12, 13, 14, 15], 10, true);
  },


  update() {
    this.player.maxHealth = 15 + this.player.vitality * 5;

    if (this.player.body.velocity.x > 0) {
      this.player.body.acceleration.x =  -200 - this.player.dexterity * 20;
    }

    if (this.player.body.velocity.x < 0) {
      this.player.body.acceleration.x = 200 + this.player.dexterity * 20;
    }

    if (this.player.body.velocity.y > 0) {
      this.player.body.acceleration.y = -200 - this.player.dexterity * 20;
    }

    if (this.player.body.velocity.y < 0) {
      this.player.body.acceleration.y = 200 + this.player.dexterity * 20;
    }

    this.player.body.maxVelocity.x = 150 + this.player.dexterity * 10;
    this.player.body.maxVelocity.y = 150 + this.player.dexterity * 10;

    if (this.a.isDown) {
      this.player.body.acceleration.x = -500;
    } else if (this.d.isDown) {
      this.player.body.acceleration.x = 500;
    }

    if (this.w.isDown) {
      this.player.body.acceleration.y = -500;
    } else if (this.s.isDown) {
      this.player.body.acceleration.y = 500;
    }

    if (this.a.isDown || this.d.isDown || this.w.isDown || this.s.isDown) {
      if (this.w.isDown) {
        this.player.animations.play('up');
        this.gun.rotation = 0;
      } else if (this.s.isDown) {
        this.player.animations.play('down');
        this.gun.rotation = Math.PI;

      } else if (this.a.isDown) {
        this.player.animations.play('left');
        this.gun.rotation = 3*Math.PI/2;

      } else if (this.d.isDown) {
        this.player.animations.play('right');
        this.gun.rotation = Math.PI/2;
      }

    } else {
      this.player.animations.stop(null, true);
    }

    if (this.player.exp >= this.player.expRequired) {
      this.player.level++;
      this.player.abilityPoints++;
      this.player.exp -= this.player.expRequired;
      this.player.expRequired += 20;
      this.player.heal(this.player.maxHealth / 5);
      this.levelUpText = this.game.add.text(this.player.x, this.player.y - 50, 'Level Up!', { fontSize: '16px', fill: 'yellow' });
      destroyText(this.levelUpText);
    }
    if (this.player.health <= 0) {
      this.player.health = 0;
      this.player.kill();
      this.gameOverText = this.game.add.text(this.game.camera.x + 200, this.game.camera.y + 250, "Game Over", { fontSize: '64px', fill: 'red'});
    }

    this.abilityPointsText.text = `Ability Points: ${this.player.abilityPoints}`;
    this.strengthText.text = `Strength(T): ${this.player.strength}`;
    this.dexterityText.text = `Dexterity(E): ${this.player.dexterity}`;
    this.vitalityText.text = `Vitality(V): ${this.player.vitality}`;
  },

  respawn(x, y) {
    this.player.health = this.player.maxHealth;
    this.player.x = x;
    this.player.y = y;
    this.player.visibility = true;
  },
  applyHealthBuff(health, index) {
    this.player.heal(health);
    const healText = this.game.add.text(this.player.x, this.player.y, `+${health}`, { fontSize: '16px', fill: 'green' });
    destroyText(healText);
    this.inventory.removeChildAt(index);
    this.selected = 0;
    this.drawTopBar();
  },
  pickUpItem(item) {
    if (this.inventory.children.length+1 > 5)
      return;
    this.inventory.add(item);
    switch (item.name) {
      case "fruit": item.kill();
      break;
      default: break;
    }
    this.drawTopBar();

  },
  setGun(gun) {
    this.gun = gun;
  },

  equip(item_index) {
    if (item_index >= this.inventory.length)
      return;
    this.selected = item_index;
    this.drawTopBar();
    switch (this.inventory.children[item_index].name) {
      case 'fruit': this.applyHealthBuff(20, item_index); break;
      default: break;
    }

  },
  drawTopBar() {
    this.topbarBmd.clear();
    this.topbarBmd.rect((this.TOPBAR_OFFSET-2)+this.selected*50, 18, 36, 36,'#FF0000');
    for (let i = 0; i < this.inventory.children.length; i++) {
      this.topbarBmd.rect(this.TOPBAR_OFFSET+i*50,20,32,32, '#666666');
      if (this.inventory.children[i].name == "gun")
        this.topbarBmd.draw(this.rifle_thumbnail, this.TOPBAR_OFFSET+i*50,20);
      else
        this.topbarBmd.draw(this.inventory.children[i], this.TOPBAR_OFFSET+i*50,20);
    }
    this.topbarUi.loadTexture(this.topbarBmd);

  },
  getLevel() {
    return this.player.level;
  },

  getHealth() {
    return this.player.health;
  },

  getExp() {
    return this.player.exp;
  },

  getPlayer() {
    return this.player;
  },

  getCursors() {
    return this.cursors;
  },
  getInventory() {
    return this.inventory;
  },

/*
  fire() {
    if (this.game.time.now > this.nextFire && this.bullets.countDead() > 0) {
      this.nextFire = this.game.time.now + this.fireRate;
      const bullet = this.bullets.getFirstDead();
      bullet.reset(this.player.x, this.player.y);
      bullet.body.velocity.x = this.player.body.velocity.x;
      bullet.body.velocity.y = this.player.body.velocity.y;
      if (this.cursors.left.isDown) bullet.body.velocity.x -= 500;
      else if (this.cursors.right.isDown) bullet.body.velocity.x += 500;
      if (this.cursors.up.isDown) bullet.body.velocity.y -= 500;
      else if (this.cursors.down.isDown) bullet.body.velocity.y += 500;

    }
  },*/

};

export default playerModule;
