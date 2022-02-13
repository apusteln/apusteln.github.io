
class PauseScene extends Phaser.Scene {


    constructor() {
        super('PauseScene');
    }

	create ()
	{
		const { width, height } = this.scale;
		//console.log(this.scale)
		this.add.text(width*0.5, height*0.3, "Game Paused",
			{ fontSize: '128px',
			  fill: '#fff',
			  backgroundColor: '#000',
			  fontFamily: 'Georgia',
			}
			).setOrigin(0.5)

		this.add.text(width*0.5, height*0.65, "Press 'P' to unpause",
			{ fontSize: '40px',
			  fill: '#fff',
			  backgroundColor: '#000',
			  fontFamily: 'Courier',
			}
			).setOrigin(0.5)
		
		this.pauseButton = this.input.keyboard.addKey('P');
	}
	
	update ()
	{
		if (this.pauseButton.isDown)
		{
			this.scene.resume("SceneMain");
			this.scene.stop();
			return;
		}
		

	}
}