var game;
window.onload = function() {
    var config = {
        type: Phaser.AUTO,
        width: 960,
        height: 600,
		physics: {
			default: 'arcade',
			arcade: {
				gravity: { y: 500 }
			}
		},
		scene: [SceneMain, GameOverScene, PauseScene, WinScene],
		scale: {
			parent: 'Game',
			autoCenter: Phaser.Scale.CENTER_BOTH
		}
    };
    game = new Phaser.Game(config);
}
