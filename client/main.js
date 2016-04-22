window.PIXI = require('phaser/build/custom/pixi');
window.p2 = require('phaser/build/custom/p2');
window.Phaser = require('phaser/build/custom/phaser-split');

var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update });

var player;
var cursors;
var health;
var healthText;
var mana;
var manaText;
var level;
var levelText;
var exp;
var expText;
var rabbit;

function preload() {
    game.load.spritesheet('player', '/assets/player.png', 32, 16);
    game.load.spritesheet('rabbit', '/assets/rabbit.png', 32, 32);
}

function create() {
    player = game.add.sprite(500, 200, 'player');
    game.physics.arcade.enable(player);
    player.body.collideWorldBounds = true;
    levelText = game.add.text(16, 16, 'level: 1', { fontSize: '16px', fill: '#670'});
    healthText = game.add.text(16, 32, 'Health: 100', { fontSize: '16px', fill: '#670' });
    manaText = game.add.text(16, 48, 'Mana: 100', { fontSize: '16px', fill: '#670' });
    expText = game.add.text(16, 64, 'Exp: 0', {fontSize: '16px', fill: '#670'});
    cursors = game.input.keyboard.createCursorKeys();
    rabbit = game.add.sprite(200, 200, 'rabbit');
}

function update() {
	rabbit.frame = 5;
    player.body.velocity.x = 0;
    player.body.velocity.y = 0;
    if (cursors.left.isDown)
    {
        player.body.velocity.x = -300;
    }
    else if (cursors.right.isDown)
    {
        player.body.velocity.x = 300;
    }
    if (cursors.up.isDown)
    {
    	player.body.velocity.y = -300;
    }
    else if (cursors.down.isDown)
    {
    	player.body.velocity.y = 300;
    }
}