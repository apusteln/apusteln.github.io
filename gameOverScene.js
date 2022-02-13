
class GameOverScene extends Phaser.Scene {


    constructor() {
        super('GameOverScene');
    }

	create ()
	{
		const { width, height } = this.scale;
		//console.log(this.scale)
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
		
		this.restartButton = this.input.keyboard.addKey('R');
	}
	
	update ()
	{
		if (this.restartButton.isDown)
		{
			this.scene.start("SceneMain");
			
			return;
		}
	}
}