window.PIXI = require('phaser/build/custom/pixi');
window.p2 = require('phaser/build/custom/p2');
window.Phaser = require('phaser/build/custom/phaser-split');

var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update });

var player;
var cursors;
var healthText;
var mana;
var manaText;
var level;
var levelText;
var exp;
var expText;
var rabbit;
var rabbitHp;

function preload() {
    game.load.spritesheet('player', '/assets/player.png', 32, 16);
    game.load.spritesheet('rabbit', '/assets/rabbit.png', 32, 32);
}

function create() {
    player = game.add.sprite(500, 200, 'player');
    player.health = 100;
    exp = 0;
    game.physics.arcade.enable(player);
    player.body.collideWorldBounds = true;
    levelText = game.add.text(16, 16, 'level: 1', { fontSize: '16px', fill: '#670'});
    healthText = game.add.text(16, 32, 'Health: 100', { fontSize: '16px', fill: '#670' });
    manaText = game.add.text(16, 48, 'Mana: 100', { fontSize: '16px', fill: '#670' });
    expText = game.add.text(16, 64, 'Exp: 0', {fontSize: '16px', fill: '#670'});
    cursors = game.input.keyboard.createCursorKeys();
    rabbit = game.add.sprite(200, 200, 'rabbit');
    game.physics.arcade.enable(rabbit);
    rabbit.body.collideWorldBounds = true;
    rabbitHp = 3;
}

function update() {
	rabbit.frame = 5;
	healthText.text = 'Health: ' + player.health;
	expText.text = 'Exp: ' + exp;
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


    //game.physics.arcade.collide(player, rabbit);
    // run collision

    game.physics.arcade.overlap(player, rabbit, killEnemy, null, this);
}

var hitText;

// Collide with rabbit twice to kill rabbit.s
function killEnemy(player, rabbit){
	rabbitHp--;
	// Show text when hit
	hitText = game.add.text(rabbit.body.x, rabbit.body.y, "Ouch!", { fontSize: '16px', fill: '#670'});
	// Kill enemy if enemyHp is 0.
	if(rabbitHp == 0){
		rabbit.kill();
		exp += 10;	// Increment exp value
		// Level up if exp reaches over 100.
		if(exp >= 100){
			level++;
			exp = 0;
		}
	}
	
}