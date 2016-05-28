import monsterModule from './monster';
import playerModule from './player';

function parseEntity(entity) {
  switch (entity.index) {
    // Slime
    case 1961:
      break;
    // Rabbit
    case 1962:
      break;
    // Mushroom
    case 1963:
      break;
    // Player
    case 1976:
      playerModule.respawn(entity.x * 32, entity.y * 32);
      break;
    // Duck
    case 1977:
      break;
    // Chair NPC
    case 1988:
      break;
    // Apricot
    case 1981:
      break;
    default:
  }
}

const module = {

  preload(game) {
    this.game = game;
    this.game.load.tilemap('map', 'assets/map.json', null, Phaser.Tilemap.TILED_JSON);
    this.game.load.image('browserquest', 'assets/tilesets/browserquest.png');
    this.game.load.image('entities', 'assets/tilesets/entities.png');
  },

  create() {
    this.map = this.game.add.tilemap('map');
    this.map.addTilesetImage('browserquest', 'browserquest');
    this.map.addTilesetImage('entities', 'entities');

    this.background2Layer = this.map.createLayer('Background-2');
    this.background1Layer = this.map.createLayer('Background-1');
    this.foregroundLayer = this.map.createLayer('Foreground');
    this.collisionLayer = this.map.createLayer('Collision');
    this.entitiesLayer = this.map.createLayer('Entities');

    this.background2Layer.resizeWorld();
    this.background1Layer.resizeWorld();
    this.foregroundLayer.resizeWorld();
    this.collisionLayer.resizeWorld();
    this.entitiesLayer.resizeWorld();

    this.collisionLayer.alpha = 0;
    this.entitiesLayer.alpha = 0;

    this.game.physics.arcade.enable(this.collisionLayer);
    this.map.setCollisionByExclusion([], true, this.collisionLayer);
  },

  createEntities() {
    this.monsterGroup = monsterModule.getMonsterGroup();
    this.player = playerModule.getPlayer();

    this.entitiesLayer.getTiles(0, 0, this.map.width * 32, this.map.height * 32).forEach((tile) => {
      // If tile.index !== 1, then it's an entity tile
      if (tile.index !== -1) {
        parseEntity(tile);
      }
    });
  },

  createTopLayer() {
    this.topLayer = this.map.createLayer('Top');
    this.topLayer.resizeWorld();
  },

  update() {
    this.game.physics.arcade.collide(this.player, this.collisionLayer);
    this.game.physics.arcade.collide(this.monsterGroup, this.collisionLayer);
  },
};

export default module;
