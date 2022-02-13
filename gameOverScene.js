
class GameOverScene extends Phaser.Scene {


    constructor() {
        super('GameOverScene');
    }

	create ()
	{
		
		const { width, height } = this.scale;
		this.add.text(width*0.5, height*0.45, "GAME OVER",
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
			this.add.text(width*0.5, height*0.75, "Press 'L' to load a file from json",
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
	}
	
	update ()
	{
		if (this.restartButton.isDown)
		{
			this.scene.start("SceneMain", {createMode: "first_level"});
			return;
		}
		if (this.loadButton.isDown && jsonFileForLevel !== null)
		{
			this.scene.stop("SceneMain");
			this.scene.stop();
			this.scene.start("SceneMain", {createMode: "load_level"});
			return;
		}
	}
}