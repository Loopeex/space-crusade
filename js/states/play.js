Game.States.Play = function(game){
	this.background;
	this.hero;

	this.paused = true;
	this.btnPause;
	this.pausePanel;

	this.bullets;
	this.lastBulletShotAt;
	this.shotDelay = 300;
};

Game.States.Play.prototype = {
	create: function(){
		// Background
		this.background = this.game.add.tileSprite(0, 0, 480, 320, 'background');
		this.background.autoScroll(-150, -20);
		this.background.tilePosition.x = Game.backgroundX;
		this.background.tilePosition.y = Game.backgroundY;

		// Bullets group
		this.bullets = this.game.add.group();

		// Hero
		this.hero = new Game.Prefabs.Hero(this.game, -45, this.game.height/2, this.game.input);
		this.game.add.existing(this.hero);
		this.game.add.tween(this.hero).to({x:60}, 1500, Phaser.Easing.Exponential.Out, true);

		// Button pause
		this.btnPause = this.game.add.button(10, 10, 'btn', this.pauseGame, this, 1, 0, 1, 0);
		this.btnPause.alpha = 0;

		// Pause panel
		this.pausePanel = new Game.Prefabs.PausePanel(this.game);
		this.game.add.existing(this.pausePanel);

		// Enter play mode after init state
		this.game.time.events.add(Phaser.Timer.SECOND*1.5, this.playGame, this);

		this.game.time.advancedTiming = true;
	    this.fpsText = this.game.add.text(
	        20, 285, '', { font: '16px Arial', fill: '#ffffff' }
	    );
	},

	update: function(){
		var bullet;

		if(!this.paused){
			this.shootBullet();
		}

		this.fpsText.setText(this.game.time.fps + ' FPS');
	},

	shutdown: function(){
		
	},

	pauseGame: function(){
		if(!this.paused){
			this.paused = true;
			this.hero.follow = false;

			this.pausePanel.show();
			this.game.add.tween(this.btnPause).to({alpha:0}, 600, Phaser.Easing.Exponential.Out, true);
		}
	},

	playGame: function(){
		if(this.paused){
			this.paused = false;

			this.hero.follow = true;
			this.hero.body.collideWorldBounds = true;

			this.game.add.tween(this.btnPause).to({alpha:1}, 600, Phaser.Easing.Exponential.Out, true);
		}
	},

	goToMenu: function(){
		// Save background scroll
		Game.backgroundX = this.background.tilePosition.x;
		Game.backgroundY = this.background.tilePosition.y;

		this.game.state.start('Menu');
	},

	shootBullet: function(){
		// Check delay time
		if(this.lastBulletShotAt === undefined) this.lastBulletShotAt = 0;
		if(this.game.time.now - this.lastBulletShotAt < this.shotDelay){
			return;
		}
		this.lastBulletShotAt = this.game.time.now;

		// Create double bullets
		var bullet;
		for(var i=-1; i<2; i+=2){
			bullet = this.bullets.getFirstExists(false);
			if(!bullet){
				bullet = new Game.Prefabs.Bullet(this.game, 0, 0);
				this.bullets.add(bullet);
			}
			bullet.reset(this.hero.x+10, this.hero.y - ((this.hero.height-5)/2)*i);
		}
	}
};