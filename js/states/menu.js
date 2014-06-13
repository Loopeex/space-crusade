Game.States.Menu = function(game){
	this.background;

	this.btnPlayGroup;
	this.btnPlay;
	this.btnPlayText;

	this.btnMoreGroup;
	this.btnMore;
	this.btnMoreText;

	this.title;

	this.timerInit;
};

Game.States.Menu.prototype = {
	create: function(){
		// Background
		this.background = this.game.add.tileSprite(0, 0, 480, 320, 'background');
		this.background.autoScroll(-150, -20);
		this.background.tilePosition.x = Game.backgroundX;
		this.background.tilePosition.y = Game.backgroundY;

		// Btn Play
		this.btnPlayGroup = this.game.add.group();

		this.btnPlay = this.game.add.button(0, 0, 'btnMenu', this.menuAnimOut, this, 1, 0, 1, 0);
		this.btnPlayGroup.add(this.btnPlay);

		this.btnPlayText = this.game.add.bitmapText(this.game.width/2, 12, 'kenpixelblocks', 'Play', 20);
		this.btnPlayText.x = this.btnPlay.width/2 - this.btnPlayText.textWidth/2;
		this.btnPlayGroup.add(this.btnPlayText);

		this.btnPlayGroup.x = this.game.width/2 - this.btnPlay.width/2;
		this.btnPlayGroup.y = 190;
		this.btnPlayGroup.alpha = 0;

		// Btn More
		this.btnMoreGroup = this.game.add.group();

		this.btnMore = this.game.add.button(0, 0, 'btnMenu', this.moreGames, this, 1, 0, 1, 0);
		this.btnMoreGroup.add(this.btnMore);

		this.btnMoreText = this.game.add.bitmapText(this.game.width/2, 12, 'kenpixelblocks', 'More games', 20);
		this.btnMoreText.x = this.btnMore.width/2 - this.btnMoreText.textWidth/2;
		this.btnMoreGroup.add(this.btnMoreText);

		this.btnMoreGroup.x = this.game.width/2 - this.btnPlay.width/2;
		this.btnMoreGroup.y = 250;
		this.btnMoreGroup.alpha = 0;

		// Title
		this.title = this.game.add.sprite(this.game.width/2, 0, 'title');
		this.title.anchor.setTo(0.5, 0);
		this.title.alpha = 0;

		// Tween
		this.game.add.tween(this.btnPlayGroup).to({alpha:1, y: 150}, 600, Phaser.Easing.Exponential.Out, true);
		this.game.add.tween(this.btnMoreGroup).to({alpha:1, y: 210}, 600, Phaser.Easing.Exponential.Out, true, 200);
		this.game.add.tween(this.title).to({alpha: 1, y:40}, 600, Phaser.Easing.Exponential.Out, true);
	},

	menuAnimOut: function(){
		// Tween
		this.game.add.tween(this.btnPlayGroup).to({alpha:0}, 600, Phaser.Easing.Exponential.Out, true);
		this.game.add.tween(this.btnMoreGroup).to({alpha:0}, 600, Phaser.Easing.Exponential.Out, true);
		this.game.add.tween(this.title).to({alpha: 0, y:10}, 600, Phaser.Easing.Exponential.Out, true);

		this.timerInit = this.game.time.create(true);
		this.timerInit.add(Phaser.Timer.SECOND*0.8, this.startGame, this);
		this.timerInit.start();

	},

	startGame: function(){
		// Store background scroll position
		Game.backgroundX = this.background.tilePosition.x;
		Game.backgroundY = this.background.tilePosition.y;

		this.game.state.start('Play');
	},

	moreGames: function(){
		window.open('http://www.loopeex.com/html5-games/', '_blank');
	}
};