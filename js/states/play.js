Game.States.Play = function(game){
	this.background;
	this.hero;

	this.btnPause;
	this.pausePanel;

	this.bullets;
	this.lastBulletShotAt;

	this.enemies;
	this.enemiesGenerator;

	this.timerInit;

	this.livesGroup;
	this.livesNum;
	this.livesTween;

	this.score;
	this.scoreText;
};

Game.States.Play.prototype = {
	create: function(){
		// Background
		this.background = this.game.add.tileSprite(0, 0, 480, 320, 'background');
		this.background.autoScroll(-150, -20);
		this.background.tilePosition.x = Game.backgroundX;
		this.background.tilePosition.y = Game.backgroundY;
		this.game.add.tween(this.background).to({alpha: 0.2}, 5000, Phaser.Easing.Linear.NONE, true, 0, Number.POSITIVE_INFINITY, true);

		// Bullets group
		this.bullets = this.game.add.group();

		// Enemies
		this.enemies = this.game.add.group();

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

		// Display lives
		this.livesGroup = this.game.add.group();
		this.livesGroup.add(this.game.add.sprite(0, 0, 'lives'));
		this.livesGroup.add(this.game.add.sprite(20, 3, 'num', 0));
		this.livesNum = this.game.add.sprite(35, 3, 'num', this.hero.lives+1);
		this.livesGroup.add(this.livesNum);
		this.livesGroup.x = this.game.width - 55;
		this.livesGroup.y = 5;

		// Score
		this.score = 0;
		this.scoreText = this.game.add.bitmapText(10, this.game.height - 27, 'kenpixelblocks', 'Score : 0', 16);

		// Enter play mode after init state
		this.timerInit = this.game.time.create(true);
		this.timerInit.add(Phaser.Timer.SECOND*1.5, this.initGame, this);
		this.timerInit.start();

		// FPS
		this.game.time.advancedTiming = true;
	    this.fpsText = this.game.add.text(
	        410, 290, '', { font: '16px Arial', fill: '#ffffff' }
	    );
	},

	update: function(){
		var bullet;

		if(!Game.paused){
			this.shootBullet();
			this.checkCollisions();
		}

		this.fpsText.setText(this.game.time.fps + ' FPS');
	},

	shutdown: function(){
		this.bullets.destroy();
		this.enemies.destroy();
		this.hero.destroy();
		Game.paused = true;
	},

	initGame: function(){
		// Generate enemies
		this.generateEnemies();
		this.enemiesGenerator = this.game.time.events.loop(Phaser.Timer.SECOND * 3, this.generateEnemies, this);
		this.enemiesGenerator.timer.start();

		// Play
		this.playGame();
	},

	pauseGame: function(){
		if(!Game.paused){
			Game.paused = true;
			this.hero.follow = false;

			// Pause enemies generator
			this.enemiesGenerator.timer.pause();

			// Freeze enemies
			this.enemies.forEach(function(group){
				group.callAll('pause');
			}, this);

			// Show pause panel
			this.pausePanel.show();
			this.game.add.tween(this.btnPause).to({alpha:0}, 600, Phaser.Easing.Exponential.Out, true);
		}
	},

	playGame: function(){
		if(Game.paused){
			Game.paused = false;

			// Active ship following pointer
			this.hero.follow = true;
			this.hero.body.collideWorldBounds = true;

			// Resume enemies generator
			this.enemiesGenerator.timer.resume();

			// Restart follow position
			this.game.input.x = this.hero.x;
			this.game.input.y = this.hero.y;

			// Show pause button
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
		if(this.game.time.now - this.lastBulletShotAt < this.hero.shotDelay){
			return;
		}
		this.lastBulletShotAt = this.game.time.now;

		// Create bullets
		var bullet, bulletPosY;
		for(var i=-1; i<this.hero.numBullets; i+=2){
			bullet = this.bullets.getFirstExists(false);
			if(!bullet){
				bullet = new Game.Prefabs.Bullet(this.game, 0, 0);
				this.bullets.add(bullet);
			}

			bulletPosY = this.hero.y;
			if(this.hero.numBullets > 1){
				bulletPosY = this.hero.y - ((this.hero.height-5)/2)*i;
			}

			bullet.reset(this.hero.x+10, bulletPosY);
		}
	},

	generateEnemies: function(){
		var Enemies = this.enemies.getFirstExists(false);

		if(!Enemies){
			Enemies = new Game.Prefabs.Enemies(this.game, this.enemies);
		}
		Enemies.reset(this.game.rnd.integerInRange(50, 270), this.game.rnd.integerInRange(50, 270));
	},

	checkCollisions: function(){
		// Enemies vs Bullets
		this.enemies.forEach(function(enemy){
			this.game.physics.arcade.overlap(this.bullets, enemy, this.killEnemy, null, this);
		}, this);

		// Hero vs Enemies
		this.enemies.forEach(function(enemy){
			this.game.physics.arcade.overlap(this.hero, enemy, this.killHero, null, this);
		}, this);
	},

	killEnemy: function(bullet, enemy){
		if(!enemy.dead && enemy.checkWorldBounds){
			enemy.die();
			bullet.kill();
			this.updateScore();
		}
	},

	killHero: function(hero, enemy){
		if(!enemy.dead && enemy.checkWorldBounds){
			if(!this.hero.shielded){
				// Update lives
				this.hero.lives--;

				if(this.hero.lives < 1){
					this.hero.die();
					this.gameOver();
				}else{
					this.hero.enableShield();

					// Anim remaining lives
					this.game.add.tween(this.livesNum).to({alpha:0, y: 8}, 200, Phaser.Easing.Exponential.Out, true).onComplete.add(function(){
						this.livesNum.frame = this.hero.lives+1;
						this.livesNum.y = -2;
						this.game.add.tween(this.livesNum).to({alpha:1, y:3}, 200, Phaser.Easing.Exponential.Out, true);
					}, this);
				}
			}else{
				enemy.die();
			}
		}
	},

	updateScore: function(){
		this.score += 10;
		this.scoreText.setText('Score : ' + this.score.toString());
	},

	gameOver: function(){
		this.game.state.start('Menu');
	}
};