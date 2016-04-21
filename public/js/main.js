var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update });

var player;

function preload() {
    game.load.spritesheet('player', '../assets/player.png', 32, 16);
}

function create() {
    player = game.add.sprite(500, 200, 'player');
}

function update() {
}