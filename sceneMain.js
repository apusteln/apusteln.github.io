
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

	create ()
	{
		this.worldSizeX = 2000;
		this.worldSizeY = 600;
		this.physics.world.setBounds(0, 0, this.worldSizeX, this.worldSizeY);
		this.physics.world.checkCollision.up = false
		this.physics.world.checkCollision.down = false
		this.player;
		this.cursors;
		this.score = 0;
		this.lives = 10;
		this.playerTween;
		
		this.background = this.add.image(480, 300, 'sky');
		this.background.setScrollFactor(0);
		this.finish = this.physics.add.staticImage(this.worldSizeX - 60, 525, 'finish_flag').setScale(0.2).refreshBody();
		this.platforms = this.physics.add.staticGroup();
		this.grounds = this.physics.add.staticGroup();
		this.coins = this.physics.add.staticGroup();
		this.spikes = this.physics.add.staticGroup();
		this.enemies = this.physics.add.group();
		
		this.createFirstLevel();
		
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
		
		if (this.lives < 1)
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
			this.player.setVelocityY(-350);
			this.sound.play("jump_sound");
		}
	}
	
	jumpIfYouCanOnEnemy (player_ob, enemy_ob)
	{
		if (this.cursors.up.isDown && this.player.body.touching.down && !this.player.ignoreImputs)
		{
			this.player.setVelocityY(-350);
			this.sound.play("jump_sound");
		}
	}
	
	decreaseLives ()
	{
		this.lives = this.lives - 1;
		this.livesText.setText('Lives: ' + this.lives);
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
				player_ob.setVelocityY(-350);
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
		
		this.coins.create(600, 300, 'coins')
		this.coins.create(700, 180, 'coins')
		this.coins.create(800, 180, 'coins')
		
		//this.spikes.create(200, 200, 'spikes').setScale(0.3).setOrigin(0.5, 1).refreshBody();
		this.spikes.create(250, 520, 'spikes').setScale(0.3).setOrigin(0.5, 0).refreshBody();
		
		this.enemies.create(600, 300, "enemy");
		this.enemies.create(800, 150, "enemy");
		
		for (var i=0; i<6; i++)
		{
			this.grounds.create(i*128, 600, 'ground_middle').setScale(0.5).setOrigin(0, 0.5).refreshBody();
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

}