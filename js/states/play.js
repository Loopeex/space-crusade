Game.States.Play = function(game){
	this.paused = false;
};

Game.States.Play.prototype = {
	create: function(){
		// Enter play mode after init state
		this.playGame();
	},

	update: function(){
		
	},

	shutdown: function(){
		
	},

	pauseGame: function(){
		if(!this.paused){
			this.paused = true;
		}
	},

	playGame: function(){
		if(this.paused){
			this.paused = false;
		}
	}
};