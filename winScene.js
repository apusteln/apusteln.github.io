
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
		
		this.restartButton = this.input.keyboard.addKey('R');
	}
	
	update ()
	{
		if (this.restartButton.isDown)
		{
			this.scene.start("SceneMain");
			this.scene.stop();
			return;
		}
	}
}