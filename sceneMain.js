

class SceneMain extends Phaser.Scene {


    constructor() {
        super('SceneMain');
    }

	preload ()
	{
		this.load.image('sky', 'assets/pxSky.png');
		this.load.image('logo', 'assets/phaser1.png');
		this.load.image('red', 'assets/red.png');
		this.load.image('finish_flag', 'assets/finish_flag.png');
		this.load.image('spikes', 'assets/spikes.png');
		//this.load.image('platform', 'assets/platform.png');
		this.load.image('platform_100', 'assets/platform_100.png');
		this.load.image('platform_200', 'assets/platform_200.png');
		this.load.image('platform_400', 'assets/platform_400.png');
		this.load.image('long_ground', 'assets/long_ground.png');
		this.load.image('ground_start', 'assets/ground_start.png');
		this.load.image('ground_stop', 'assets/ground_stop.png');
		this.load.image('ground_middle', 'assets/ground_middle.png');
		this.load.spritesheet('player', 'assets/player.png', { frameWidth: 69, frameHeight: 63 });
		this.load.spritesheet('coins', 'assets/coin.png', { frameWidth: 32, frameHeight: 26 });
		this.load.spritesheet('enemy', 'assets/enemy.png', { frameWidth: 48, frameHeight: 63 });
		this.load.audio('jump_sound', 'assets/jump.wav');
		this.load.audio('coin_beep', 'assets/coin_beep.mp3');
		this.load.audio('player_ouch', 'assets/player_ouch.mp3');
		this.load.audio('enemy_ouch', 'assets/enemy_ouch.mp3');
	}

	create(data = {createMode: string})
	{
		this.worldSizeX = 2000;
		this.worldSizeY = 600;
		this.physics.world.setBounds(0, 0, this.worldSizeX, this.worldSizeY);
		this.physics.world.checkCollision.up = false
		this.physics.world.checkCollision.down = false
		this.player;
		this.cursors;
		this.score = 0;
		this.lives = 3;
		this.playerTween;
		
		this.background = this.add.image(480, 300, 'sky');
		this.background.setScrollFactor(0);
		this.finish = this.physics.add.staticImage(this.worldSizeX - 60, 525, 'finish_flag').setScale(0.2).refreshBody();
		this.platforms = this.physics.add.staticGroup();
		this.grounds = this.physics.add.staticGroup();
		this.coins = this.physics.add.staticGroup();
		this.spikes = this.physics.add.staticGroup();
		this.enemies = this.physics.add.group();
		
		console.log(data.createMode);
		
		if (typeof data.createMode === 'undefined' || data.createMode == "first_level")
		{
			this.createFirstLevel();
		}
		else if (data.createMode == "random_level")
		{
			console.log("IMPLEMENT");
		}
		else if (data.createMode == "load_level"             )
		{
			console.log(document.getElementById("json_level"))
			this.loadLevelFromJson(JSON.parse(document.getElementById("json_level").contentWindow.document.body.childNodes[0].innerHTML));
		}
		
		for (var i=0; i<this.enemies.children.entries.length; i++)
		{
			if (Phaser.Math.Between(0, 1))
			{
				this.enemies.children.entries[i].body.setVelocityX(50);
			}
			else
			{
				this.enemies.children.entries[i].body.setVelocityX(-50);
				this.enemies.children.entries[i].flipX = true;
			}
		}
		
		this.player = this.physics.add.sprite(40, 520, 'player');
		
		this.player.vulnerable = true;
		this.player.ignoreImputs = false;
		
		this.cameras.main.setBounds(0, 0, this.worldSizeX, this.worldSizeY);
		this.cameras.main.startFollow(this.player);

		console.log("Tutaj jest break");

		this.player.setCollideWorldBounds(true);

		for (var i=0; i<this.enemies.children.entries.length; i++)
		{
			this.enemies.children.entries[i].setCollideWorldBounds(true);
			this.enemies.children.entries[i].setPushable(false);
		}
		
		this.setUpAnimations();
		
		for (var i=0; i<this.enemies.children.entries.length; i++)
		{
			this.enemies.children.entries[i].anims.play('enemy-walk', true);
		}
		
		this.physics.add.collider(this.player, this.platforms, this.jumpIfYouCan, null, this);
		this.physics.add.collider(this.player, this.finish, this.winGame, null, this);
		this.physics.add.collider(this.player, this.ground, this.jumpIfYouCan, null, this);
		this.physics.add.collider(this.player, this.grounds, this.jumpIfYouCan, null, this);
		this.physics.add.collider(this.enemies, this.grounds, this.reverseOnPlatform, null, this);
		this.physics.add.collider(this.enemies, this.ground, this.reverseOnPlatform, null, this);
		this.physics.add.collider(this.enemies, this.platforms, this.reverseOnPlatform, null, this);
		this.physics.add.collider(this.enemies, this.spikes, this.reverseOnPlatform, null, this);
		this.physics.add.collider(this.enemies, this.enemies, this.reverseOnPlatform, null, this);
		this.physics.add.collider(this.player, this.enemies, this.collideWithEnemy, null, this);
		
		this.cursors = this.input.keyboard.createCursorKeys();
		this.pauseButton = this.input.keyboard.addKey('P');
		
		this.physics.add.overlap(this.player, this.coins, this.collectCoin, null, this);
		this.physics.add.collider(this.player, this.spikes, this.spikesHurt, null, this);
	
		this.scoreText = this.add.text(16, 16, 'Coins: ' + this.score, { fontSize: '32px', fill: '#000', fontFamily: 'Georgia' });
		this.scoreText.setScrollFactor(0);
		
		this.livesText = this.add.text(800, 16, 'Lives: ' + this.lives, { fontSize: '32px', fill: '#000', fontFamily: 'Georgia' });
		this.livesText.setScrollFactor(0);
		
		//this.player.body.setVelocityX(600);
		//this.player.body.setVelocityY(-600);

	}

	update()
	{
			
		if (this.cursors.left.isDown && !this.player.ignoreImputs)
		{
			this.player.setVelocityX(-170);
			this.player.flipX = true;
			this.player.anims.play('right', true);
		}
		else if (this.cursors.right.isDown && !this.player.ignoreImputs)
		{
			this.player.setVelocityX(170);
			this.player.flipX = false;
			this.player.anims.play('right', true);
		}
		else if (!this.player.ignoreImputs)
		{
			this.player.setVelocityX(0);

			this.player.anims.play('turn');
		}
		
		if (!this.player.body.touching.down)
		{
			if (this.player.body.velocity.y > 0)
			{
				
				this.player.anims.play('flying-up-right', true);
			}
			else
			{
				this.player.anims.play('flying-up-down', true);
			}
		}
		
		if (this.lives < 0)
		{
			this.scene.start("GameOverScene");
			return;
		}
		
		if (this.pauseButton.isDown)
		{
			this.scene.launch("PauseScene");
			this.scene.pause();
			this.sound.play("coin_beep");
		}
		
		if (this.player.y > 700)
		{
			this.scene.stop();
			this.scene.start("GameOverScene");
			return;
		}

	}
	
	jumpIfYouCan ()
	{
		if (this.cursors.up.isDown && this.player.body.touching.down && !this.player.ignoreImputs)
		{
			this.player.setVelocityY(-370);
			this.sound.play("jump_sound");
		}
	}
	
	jumpIfYouCanOnEnemy (player_ob, enemy_ob)
	{
		if (this.cursors.up.isDown && this.player.body.touching.down && !this.player.ignoreImputs)
		{
			this.player.setVelocityY(-370);
			this.sound.play("jump_sound");
		}
	}
	
	decreaseLives ()
	{
		this.lives = this.lives - 1;
		if (this.lives >= 0) //zeby nie wyskakiwalo -1 przed smiercia
		{	
			this.livesText.setText('Lives: ' + this.lives);
		}
	}
	
	winGame ()
	{
		this.scene.stop();
		this.scene.start("WinScene");
		return;
	}

	collectCoin(player_ob, coin_ob)
	{
		coin_ob.disableBody(true, true);
		this.sound.play("coin_beep");
		
		this.score += 1;
		this.scoreText.setText('Coins: ' + this.score);
	}

	makeInvulnerable ()
	{
		this.playerTween = this.tweens.add({
		  targets: this.player,
		  alpha: { from: 1, to: 0.5 },
		  ease: 'Sine.InOut',
		  duration: 300,
		  repeat: -1
		});
			
		this.player.vulnerable = false;
		
		this.playerReset = this.time.addEvent({
			delay: 1500,
			callback: ()=>{
				this.player.vulnerable = true;
				this.playerTween.stop();
				this.player.alpha = 1;
			},
			loop: false
		});
	}

	makeIgnoreImputs ()
	{			
		this.player.ignoreImputs = true;
		
		this.playerReset = this.time.addEvent({
			delay: 300,
			callback: ()=>{
				this.player.ignoreImputs = false;
			},
			loop: false
		});
	}
	
	spikesHurt(player_ob, spike_ob)
	{
		if (player_ob.body.touching.down && spike_ob.body.touching.up && this.player.vulnerable)
		{
			player_ob.setVelocityY(-450);
			this.sound.play("player_ouch");
			this.decreaseLives();
			spike_ob.body.touching = {none: true, up: false, down: false, left: false, right:false}
			this.makeInvulnerable();
		}
	}

	collideWithEnemy(player_ob, enemy_ob)
	{
		if (player_ob.body.touching.down && enemy_ob.body.touching.up)
		{

			this.sound.play("enemy_ouch");
			player_ob.setVelocityY(-150);
			if (this.cursors.up.isDown && player_ob.body.touching.down && !this.player.ignoreImputs)
			{
				player_ob.setVelocityY(-370);
			}
			enemy_ob.body.allowGravity = false;
			enemy_ob.body.checkCollision.none = true;
			enemy_ob.setVelocityY(-200);
			enemy_ob.setVelocityX(0);
			enemy_ob.anims.play("enemy-fade-out", true);
			
			this.tweens.add({
			  targets: enemy_ob,
			  alpha: { from: 1, to: 0 },
			  ease: 'Sine.InOut',
			  duration: 370,
			  repeat: 0
			});
		}
		else
		{
			if (this.player.vulnerable)
			{
				this.sound.play("player_ouch");
				this.decreaseLives();
				this.makeInvulnerable();
				this.makeIgnoreImputs();
				if (player_ob.body.touching.right)
				{
					player_ob.body.setVelocityX(-450);
				}
				if (player_ob.body.touching.left)
				{
					player_ob.body.setVelocityX(450);
				}
				player_ob.body.setVelocityY(-100);
			}
		}
	}
	
	reverseOnPlatform(enemy_ob, platform_ob)
	{
		if (enemy_ob.body.velocity.x > 0 && enemy_ob.body.touching.right && platform_ob.body.touching.left)	
		{
			enemy_ob.body.velocity.x = -50;
			enemy_ob.flipX = true;
		}
		else if (enemy_ob.body.velocity.x < 0 && enemy_ob.body.touching.left && platform_ob.body.touching.right)
		{
			enemy_ob.body.velocity.x = 50;
			enemy_ob.flipX = false;
		}
		
		if (enemy_ob.body.velocity.x > 0 && enemy_ob.body.right > platform_ob.body.right || enemy_ob.body.velocity.x < 0 && enemy_ob.body.left < platform_ob.body.left) {
			enemy_ob.body.velocity.x *= -1;
			enemy_ob.flipX = !enemy_ob.flipX;
		}
	}
	
	createFirstLevel ()
	{
		
		this.platforms.create(350, 450, 'platform_100');
		this.platforms.create(600, 400, 'platform_200');
		this.platforms.create(750, 220, 'platform_200');
		this.platforms.create(1000, 350, 'platform_400');
		
		this.spikes.create(1000, this.platforms.children.entries[3].body.top, 'spikes').setScale(0.3).setOrigin(0.5, 1).refreshBody();
		
		this.platforms.create(1500, 280, 'platform_400');
		
		this.coins.create(1400, 220, 'coins')
		this.coins.create(1600, 220, 'coins')
		
		this.enemies.create(1500, 200, "enemy");
		
		this.platforms.create(1300, 500, 'platform_200');
		
		this.enemies.create(1300, 400, "enemy");
		
		this.coins.create(600, 300, 'coins')
		this.coins.create(700, 180, 'coins')
		this.coins.create(800, 180, 'coins')
		
		//this.spikes.create(200, 200, 'spikes').setScale(0.3).setOrigin(0.5, 1).refreshBody();
		this.spikes.create(200, 520, 'spikes').setScale(0.3).setOrigin(0.5, 0).refreshBody();
		
		this.enemies.create(600, 300, "enemy");
		this.enemies.create(800, 150, "enemy");
		
		for (var i=0; i<5; i++)
		{
			this.grounds.create(i*128, 600, 'ground_middle').setScale(0.5).setOrigin(0, 0.5).refreshBody();
		}
		
		var new_ground_start = this.grounds.children.entries[this.grounds.children.entries.length-1].body.right;
		
		this.grounds.create(new_ground_start, 600, 'ground_stop').setScale(0.5).setOrigin(0, 0.5).refreshBody();
		
		new_ground_start = this.grounds.children.entries[this.grounds.children.entries.length-1].body.right;
		
		var hole_in_the_floor = 500;
		
		this.grounds.create(new_ground_start + hole_in_the_floor, 600, 'ground_start').setScale(0.5).setOrigin(0, 0.5).refreshBody();
		
		new_ground_start = this.grounds.children.entries[this.grounds.children.entries.length-1].body.right;
		
		for (var i=0; i<6; i++)
		{
			this.grounds.create(new_ground_start + i*128, 600, 'ground_middle').setScale(0.5).setOrigin(0, 0.5).refreshBody();
		}
	}
	
	createSecondLevel ()
	{
		this.platforms.create(950, 550, 'platform_400');
		this.spikes.create(800, this.platforms.children.entries[this.platforms.children.entries.length-1].body.top, 'spikes').setScale(0.3).setOrigin(0.5, 1).refreshBody()
		this.spikes.create(950, this.platforms.children.entries[this.platforms.children.entries.length-1].body.top, 'spikes').setScale(0.3).setOrigin(0.5, 1).refreshBody()
		this.spikes.create(1100, this.platforms.children.entries[this.platforms.children.entries.length-1].body.top, 'spikes').setScale(0.3).setOrigin(0.5, 1).refreshBody()
		this.platforms.create(630, 590, 'platform_100');
		
		
		this.platforms.create(300, 510, 'platform_100');
		this.spikes.create(300, this.platforms.children.entries[this.platforms.children.entries.length-1].body.top, 'spikes').setScale(0.3).setOrigin(0.5, 1).refreshBody()
		this.platforms.create(80, 390, 'platform_100');
		this.platforms.create(300, 290, 'platform_100');
		this.platforms.create(490, 250, 'platform_100');
		
		//this.enemies.create(300, 430, "enemy");
		this.enemies.create(80, 320, "enemy");
		this.enemies.create(300, 220, "enemy");
		this.enemies.create(490, 200, "enemy");
		
		
		this.platforms.create(900, 200, 'platform_400');
		this.coins.create(750, 150, 'coins')
		this.coins.create(850, 150, 'coins')
		this.coins.create(950, 150, 'coins')
		this.coins.create(1050, 150, 'coins')
		
		this.platforms.create(1500, 280, 'platform_400');
		
		this.enemies.create(1500, 200, "enemy");
		
		this.platforms.create(1300, 500, 'platform_200');
		
		this.enemies.create(1300, 400, "enemy");
		
		this.enemies.create(800, 150, "enemy");
		
		for (var i=0; i<3; i++)
		{
			this.grounds.create(i*128, 600, 'ground_middle').setScale(0.5).setOrigin(0, 0.5).refreshBody();
		}
		
		var new_ground_start = this.grounds.children.entries[this.grounds.children.entries.length-1].body.right;
		
		this.grounds.create(new_ground_start, 600, 'ground_stop').setScale(0.5).setOrigin(0, 0.5).refreshBody();
		
		new_ground_start = this.grounds.children.entries[this.grounds.children.entries.length-1].body.right;
		
		var hole_in_the_floor = 950;
		
		this.grounds.create(new_ground_start + hole_in_the_floor, 600, 'ground_start').setScale(0.5).setOrigin(0, 0.5).refreshBody();
		
		new_ground_start = this.grounds.children.entries[this.grounds.children.entries.length-1].body.right;
		
		for (var i=0; i<6; i++)
		{
			this.grounds.create(new_ground_start + i*128, 600, 'ground_middle').setScale(0.5).setOrigin(0, 0.5).refreshBody();
		}
	}
	
	setUpAnimations ()
	{
		this.anims.create({
			key: 'coin-animation',
			frames: this.anims.generateFrameNumbers('coins', { start: 0, end: 7 }),
			frameRate: 10,
			repeat: -1
		});
		this.coins.playAnimation('coin-animation')

		this.anims.create({
			key: 'left',
			frames: this.anims.generateFrameNumbers('player', { frames: [ 9, 10 ] }),
			frameRate: 10,
			repeat: -1
		});

		this.anims.create({
			key: 'turn',
			frames: [ { key: 'player', frame: 0 } ],
			frameRate: 20
		});

		this.anims.create({
			key: 'right',
			frames: this.anims.generateFrameNumbers('player', { frames: [ 9, 10 ] }),
			frameRate: 10,
			repeat: -1
		});

		this.anims.create({
			key: 'flying-up-right',
			frames: [ { key: 'player', frame: 7 } ],
			frameRate: 20
		});

		this.anims.create({
			key: 'flying-up-down',
			frames: [ { key: 'player', frame: 8 } ],
			frameRate: 20
		});

		this.anims.create({
			key: 'enemy-fade-out',
			frames: [ { key: 'enemy', frame: 2 } ],
			frameRate: 20
		});

		this.anims.create({
			key: 'enemy-walk',
			frames: this.anims.generateFrameNumbers('enemy', { frames: [ 0, 1 ] }),
			frameRate: 5,
			repeat: -1
		});
	}
	
	saveLevelInJson ()
	{
		var obj = {};
		
		obj.coins = {};
		obj.coins.arr = [];
		for (var i=0; i<this.coins.children.entries.length; i++)
		{
			obj.coins.arr.push({x: this.coins.children.entries[i].x,
			                    y: this.coins.children.entries[i].y,
			                    originX: this.coins.children.entries[i].originX,
			                    originY: this.coins.children.entries[i].originY})
		}
		
		obj.spikes = {};
		obj.spikes.arr = [];
		for (var i=0; i<this.spikes.children.entries.length; i++)
		{
			obj.spikes.arr.push({x: this.spikes.children.entries[i].x,
			                     y: this.spikes.children.entries[i].y,
			                     originX: this.spikes.children.entries[i].originX,
			                     originY: this.spikes.children.entries[i].originY})
		}
		
		obj.platforms = {};
		obj.platforms.arr = [];
		for (var i=0; i<this.platforms.children.entries.length; i++)
		{
			obj.platforms.arr.push({x: this.platforms.children.entries[i].x,
			                        y: this.platforms.children.entries[i].y,
			                        originX: this.platforms.children.entries[i].originX,
			                        originY: this.platforms.children.entries[i].originY,
									pic: this.platforms.children.entries[i].texture.key})
		}
		
		obj.enemies = {};
		obj.enemies.arr = [];
		for (var i=0; i<this.enemies.children.entries.length; i++)
		{
			obj.enemies.arr.push({x: this.enemies.children.entries[i].x,
			                      y: this.enemies.children.entries[i].y,
								  originX: this.enemies.children.entries[i].originX,
		                          originY: this.enemies.children.entries[i].originY})
		}
		
		obj.grounds = {};
		obj.grounds.arr = [];
		for (var i=0; i<this.grounds.children.entries.length; i++)
		{
			obj.grounds.arr.push({x: this.grounds.children.entries[i].x,
			                      y: this.grounds.children.entries[i].y,
								  originX: this.grounds.children.entries[i].originX,
								  originY: this.grounds.children.entries[i].originY,
								  pic: this.grounds.children.entries[i].texture.key})
		}
		
		var levelJSON = JSON.stringify(obj);
		
		var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(levelJSON);
		var dlAnchorElem = document.getElementById('downloadAnchorElem');
		dlAnchorElem.setAttribute("href", dataStr);
		dlAnchorElem.setAttribute("download", "level.json");
		dlAnchorElem.click();
	}
	
	loadLevelFromJson (saidJson)
	{
		for (var i=0; i<saidJson.coins.arr.length; i++)
		{
			this.coins.create(saidJson.coins.arr[i].x, saidJson.coins.arr[i].y, 'coins').setOrigin(saidJson.coins.arr[i].originX, saidJson.coins.arr[i].originY).refreshBody();
		}
		for (var i=0; i<saidJson.spikes.arr.length; i++)
		{
			this.spikes.create(saidJson.spikes.arr[i].x, saidJson.spikes.arr[i].y, 'spikes').setOrigin(saidJson.spikes.arr[i].originX, saidJson.spikes.arr[i].originY).setScale(0.3).refreshBody();
		}
		for (var i=0; i<saidJson.platforms.arr.length; i++)
		{
			this.platforms.create(saidJson.platforms.arr[i].x, saidJson.platforms.arr[i].y, saidJson.platforms.arr[i].pic).setOrigin(saidJson.platforms.arr[i].originX, saidJson.platforms.arr[i].originY).refreshBody();
		}
		for (var i=0; i<saidJson.enemies.arr.length; i++)
		{
			this.enemies.create(saidJson.enemies.arr[i].x, saidJson.enemies.arr[i].y, 'enemy').setOrigin(saidJson.enemies.arr[i].originX, saidJson.enemies.arr[i].originY).refreshBody();
		}
		for (var i=0; i<saidJson.grounds.arr.length; i++)
		{
			this.grounds.create(saidJson.grounds.arr[i].x, saidJson.grounds.arr[i].y, saidJson.grounds.arr[i].pic).setScale(0.5).setOrigin(saidJson.grounds.arr[i].originX, saidJson.grounds.arr[i].originY).refreshBody();
		}
		
	}

}