var config = {
	type: Phaser.AUTO,
	width: 800,
	height: 600,
	physics: {
		default: 'arcade',
		arcade: {
			gravity: { y: 500 },
			debug: false
		}
	},
	scene: {
		preload: preload,
		create: create
	}
};

var game = new Phaser.Game(config);

var map;
var player;
var cursors;
var groundLayer, coinLayer;
var text;

/* function preload() {
    // map made with Tiled in JSON format
	this.load.setBaseURL('http://labs.phaser.io');
    this.load.tilemapTiledJSON('map', 'assets/map.json');
    // tiles in spritesheet 
    this.load.spritesheet('tiles', 'assets/sprites/block.png', {frameWidth: 70, frameHeight: 70});
    // simple coin image
    this.load.image('coin', 'assets/sprites/apple.png');
    // player animations
    // this.load.atlas('player', 'assets/player.png', 'assets/player.json');
}

function create() {
	    // load the map 
    map = this.make.tilemap({key: 'map'});
    
    // tiles for the ground layer
    var groundTiles = map.addTilesetImage('tiles');
    // create the ground layer
    groundLayer = map.createDynamicLayer('World', groundTiles, 0, 0);
    // the player will collide with this layer
    groundLayer.setCollisionByExclusion([-1]);
    // set the boundaries of our game world
    this.physics.world.bounds.width = groundLayer.width;
    this.physics.world.bounds.height = groundLayer.height;
} */

function preload ()
{
	this.load.setBaseURL('http://labs.phaser.io');

	this.load.image('sky', 'assets/skies/space3.png');
	this.load.image('logo', 'assets/sprites/phaser1.png');
	this.load.image('red', 'assets/particles/red.png');
}

function create ()
{
	this.add.image(400, 300, 'sky');

	var particles = this.add.particles('red');

	var emitter = particles.createEmitter({
		speed: 100,
		scale: { start: 1, end: 0 },
		blendMode: 'ADD'
	});

	var logo = this.physics.add.image(400, 100, 'logo');

	logo.setVelocity(100, 200);
	logo.setBounce(1, 1);
	logo.setCollideWorldBounds(true);

	emitter.startFollow(logo);
}