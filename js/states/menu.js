Game.States.Menu = function(game){
	this.badge;
};

Game.States.Menu.prototype = {
	create: function(){
		this.hero = new Game.Prefabs.Hero(this.game, this.game.width/2, this.game.height/2);
		this.game.add.existing(this.hero);
	},

	startGame: function(){
		this.game.state.start('Play');
	},
};