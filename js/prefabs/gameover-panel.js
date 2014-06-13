Game.Prefabs.GameoverPanel = function(game, parent){
	// Super call to Phaser.Group
	Phaser.Group.call(this, game, parent);

	// Add panel
	this.panel = this.game.add.sprite(0, 0, 'pausePanel');
	this.panel.width = 480;
	this.panel.height = 80;
	this.add(this.panel);

	// Pause text
	this.textPause = this.game.add.bitmapText(game.width/2, -42, 'kenpixelblocks', 'Game over', 28);
	this.textPause.position.x = this.game.width/2 - this.textPause.textWidth/2;
	this.add(this.textPause);

	// Score text
	this.textScore = this.game.add.bitmapText(game.width/2, 100, 'kenpixelblocks', 'Score : 0', 16);
	this.textScore.position.x = this.game.width/2 - this.textScore.textWidth/2;
	this.add(this.textScore);

	// Highscore text
	this.textHighScore = this.game.add.bitmapText(game.width/2, 125, 'kenpixelblocks', 'High Score : 0', 16);
	this.textHighScore.position.x = this.game.width/2 - this.textHighScore.textWidth/2;
	this.add(this.textHighScore);

	// Group pos
	this.y = -80;
	this.x = 0;
	this.alpha = 0;

	// Play button
	this.btnReplay = this.game.add.button(this.game.width/2-32, 15, 'btn', this.replay, this, 3, 2, 3, 2);
	this.btnReplay.anchor.setTo(0.5, 0);
	this.add(this.btnReplay);

	// Btn Menu
	this.btnMenu = this.game.add.button(this.game.width/2+28, 15, 'btn', function(){
		this.game.state.getCurrentState().goToMenu();
	}, this, 5, 4, 5, 4);
	this.btnMenu.anchor.setTo(0.5, 0);
	this.add(this.btnMenu);
};

Game.Prefabs.GameoverPanel.prototype = Object.create(Phaser.Group.prototype);
Game.Prefabs.GameoverPanel.constructor = Game.Prefabs.GameoverPanel;

Game.Prefabs.GameoverPanel.prototype.show = function(score){
	var highScore;
	var beated = false;
	localStorage.setItem('highScore', 0);

	this.textScore.setText('Score : ' + score.toString());

	if(!!localStorage){
		highScore = parseInt(localStorage.getItem('highScore'), 10);

		if(!highScore || highScore < score){
			highScore = score;
			localStorage.setItem('highScore', highScore);

			// Add new sprite if best score beated
			if(score > 0){
				beated = true;
				this.newScore = this.game.add.sprite(0, 132, 'new');
				this.newScore.anchor.setTo(0.5, 0.5);
				this.add(this.newScore);
			}
		}
	}else{
		highScore = 0;
	}

	this.textHighScore.setText('High Score : ' + highScore.toString());

	// Center text
	this.textScore.updateText();
	this.textScore.position.x = this.game.width/2 - this.textScore.textWidth/2;

	this.textHighScore.updateText();
	this.textHighScore.position.x = this.game.width/2 - this.textHighScore.textWidth/2;

	if(beated){
		this.newScore.x = this.textHighScore.position.x - 30;
	}

	// Show panel
	this.game.add.tween(this).to({alpha:1, y:this.game.height/2 - this.panel.height/2}, 1000, Phaser.Easing.Exponential.Out, true, 0);
};

Game.Prefabs.GameoverPanel.prototype.replay = function(){
	// Track analytics
	Game.Analytics.trackEvent('Start', 1);
	Game.Analytics.trackEvent('Restart', 1);

	// Start
	this.game.state.start('Play');
};