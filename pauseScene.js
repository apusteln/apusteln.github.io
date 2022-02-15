
class PauseScene extends Phaser.Scene {


    constructor() {
        super('PauseScene');
    }

	create ()
	{
		this.downloadButtonDelay = false;
		
		const { width, height } = this.scale;
		this.add.text(width*0.5, height*0.3, "Game Paused",
			{ fontSize: '128px',
			  fill: '#fff',
			  backgroundColor: '#000',
			  fontFamily: 'Georgia',
			}
			).setOrigin(0.5)

		this.add.text(width*0.5, height*0.55, "Press 'P' to unpause",
			{ fontSize: '40px',
			  fill: '#fff',
			  backgroundColor: '#000',
			  fontFamily: 'Courier',
			}
			).setOrigin(0.5)

		this.add.text(width*0.5, height*0.65, "Press 'R' to restart",
			{ fontSize: '40px',
			  fill: '#fff',
			  backgroundColor: '#000',
			  fontFamily: 'Courier',
			}
			).setOrigin(0.5)

		this.add.text(width*0.5, height*0.75, "Press 'D' to download this level",
			{ fontSize: '40px',
			  fill: '#fff',
			  backgroundColor: '#000',
			  fontFamily: 'Courier',
			}
			).setOrigin(0.5)

		this.add.text(width*0.5, height*0.85, "Press 'O' to generate a random level",
			{ fontSize: '40px',
			  fill: '#fff',
			  backgroundColor: '#000',
			  fontFamily: 'Courier',
			}
			).setOrigin(0.5)
			
		if (        true  );
		{
			console.log("creator pauzy")
			console.log(localStorage.getItem('jsonFileForLevel'))
			
			this.add.text(width*0.5, height*0.95, "Press 'L' to load a level from json",
			{ fontSize: '40px',
			  fill: '#fff',
			  backgroundColor: '#000',
			  fontFamily: 'Courier',
			}
			).setOrigin(0.5)
		}
		
		this.pauseButton = this.input.keyboard.addKey('P');
		this.restartButton = this.input.keyboard.addKey('R');
		this.loadButton = this.input.keyboard.addKey('L');
		this.downloadButton = this.input.keyboard.addKey('D');
		this.randomLevelButton = this.input.keyboard.addKey('O');
	}
	
	update ()
	{
		if (this.pauseButton.isDown)
		{
			this.scene.resume("SceneMain");
			this.scene.stop();
			return;
		}
		if (this.restartButton.isDown)
		{
			this.scene.stop("SceneMain");
			this.scene.stop();
			this.scene.start("SceneMain", {createMode: "first_level"});
			return;
		}
		if (this.loadButton.isDown     )
		{
			this.scene.stop("SceneMain");
			this.scene.stop();
			this.scene.start("SceneMain", {createMode: "load_level"});
			return;
		}
		if (this.downloadButton.isDown && !this.downloadButtonDelay)
		{
			this.game.scene.getScene("SceneMain").saveLevelInJson();
			this.downloadButtonDelay = true;
			this.downloadButtonReset = this.time.addEvent({
				delay: 2000,
				callback: ()=>{
					this.downloadButtonDelay = false;
				},
				loop: false
			});
		}
		if (this.randomLevelButton.isDown)
		{
			this.scene.stop("SceneMain");
			this.scene.stop();
			this.scene.start("SceneMain", {createMode: "random_level"});
			return;
		}
	}
}