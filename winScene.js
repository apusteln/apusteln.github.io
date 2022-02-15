
class WinScene extends Phaser.Scene {


    constructor() {
        super('WinScene');
    }

	create ()
	{
		const { width, height } = this.scale;
		this.add.text(width*0.5, height*0.3, "You Win!",
			{ fontSize: '128px',
			  fill: '#fff',
			  backgroundColor: '#000',
			  fontFamily: 'Georgia',
			}
			).setOrigin(0.5)

		this.add.text(width*0.5, height*0.65, "Press 'R' to restart",
			{ fontSize: '40px',
			  fill: '#fff',
			  backgroundColor: '#000',
			  fontFamily: 'Courier',
			}
			).setOrigin(0.5)
			
		if (jsonFileForLevel !== null)
		{
			this.add.text(width*0.5, height*0.85, "Press 'L' to load a level from json",
			{ fontSize: '40px',
			  fill: '#fff',
			  backgroundColor: '#000',
			  fontFamily: 'Courier',
			}
			).setOrigin(0.5)
		}
		
		this.add.text(width*0.5, height*0.75, "Press 'O' to generate a random level",
			{ fontSize: '40px',
			  fill: '#fff',
			  backgroundColor: '#000',
			  fontFamily: 'Courier',
			}
			).setOrigin(0.5)
		
		this.pauseButton = this.input.keyboard.addKey('P');
		this.restartButton = this.input.keyboard.addKey('R');
		this.loadButton = this.input.keyboard.addKey('L');
		this.downloadButton = this.input.keyboard.addKey('D');
		this.randomLevelButton = this.input.keyboard.addKey('O');
	}
	
	update ()
	{
		if (this.restartButton.isDown)
		{
			this.scene.start("SceneMain", {createMode: "first_level"});
			this.scene.stop();
			return;
		}
		if (this.loadButton.isDown && jsonFileForLevel !== null)
		{
			this.scene.stop("SceneMain");
			this.scene.stop();
			this.scene.start("SceneMain", {createMode: "load_level"});
			return;
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