
const module = {

  preload(game) {
    this.game = game;
    this.game.load.tilemap('map', 'assets/grassland1.json', null, Phaser.Tilemap.TILED_JSON);
    this.game.load.image('grass', 'assets/tilesets/grass-tiles-2-small.png');
    this.game.load.image('tree', 'assets/tilesets/tree2-final.png');
  },

  create() {
    this.map = this.game.add.tilemap('map');
    this.map.addTilesetImage('grass-tiles-2-small', 'grass');
    this.map.addTilesetImage('tree2-final', 'tree');

    this.backgroundLayer = this.map.createLayer('Background');
    this.foregroundLayer = this.map.createLayer('Foreground');

    this.backgroundLayer.resizeWorld();
    this.foregroundLayer.resizeWorld();
    this.game.physics.arcade.enable(this.foregroundLayer);
    this.map.setCollisionByExclusion([], true, this.foregroundLayer);
  },

  createTopLayer() {
    this.topLayer = this.map.createLayer('Top');
    this.topLayer.resizeWorld();
  },

  update(player, rabbit, slime) {
    this.game.physics.arcade.collide(player, this.foregroundLayer);
    this.game.physics.arcade.collide(rabbit, this.foregroundLayer);
    this.game.physics.arcade.collide(slime, this.foregroundLayer);
  },
};

export default module;
