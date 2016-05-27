
const module = {

  preload(game) {
    this.game = game;
    this.game.load.tilemap('map', 'assets/map.json', null, Phaser.Tilemap.TILED_JSON);
    this.game.load.image('browserquest', 'assets/tilesets/browserquest.png');
  },

  create() {
    this.map = this.game.add.tilemap('map');
    this.map.addTilesetImage('browserquest', 'browserquest');

    this.background2Layer = this.map.createLayer('Background-2');
    this.background1Layer = this.map.createLayer('Background-1');
    this.foregroundLayer = this.map.createLayer('Foreground');
    this.collisionLayer = this.map.createLayer('Collision');

    this.background2Layer.resizeWorld();
    this.background1Layer.resizeWorld();
    this.foregroundLayer.resizeWorld();
    this.collisionLayer.resizeWorld();

    this.collisionLayer.alpha = 0;
    this.game.physics.arcade.enable(this.collisionLayer);
    this.map.setCollisionByExclusion([], true, this.collisionLayer);
  },

  createTopLayer() {
    this.topLayer = this.map.createLayer('Top');
    this.topLayer.resizeWorld();
  },

  update(player, rabbit, slime, mushroom) {
    this.game.physics.arcade.collide(player, this.collisionLayer);
    this.game.physics.arcade.collide(rabbit, this.collisionLayer);
    this.game.physics.arcade.collide(slime, this.collisionLayer);
    this.game.physics.arcade.collide(mushroom, this.collisionLayer);
  },
};

export default module;
