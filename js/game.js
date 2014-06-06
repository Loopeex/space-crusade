window.onload = function(){
	// Create phaser game
	var phaser = new Phaser.Game(480, 320, Phaser.AUTO, 'game');

	// Load states
	phaser.state.add('Boot', Game.States.Boot);
	phaser.state.add('Preloader', Game.States.Preloader);
	phaser.state.add('Menu', Game.States.Menu);
	phaser.state.add('Play', Game.States.Play);

	// Load game
	phaser.state.start('Boot');
};