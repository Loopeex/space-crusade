Game.States.Play = function(game){
	this.BONUS_DURATION = 6; // In seconds

	this.background;
	this.hero;

	this.btnPause;
	this.pausePanel;

	this.bullets;
	this.lastBulletShotAt;

	this.enemies;
	this.enemiesGenerator;
	this.lasers;
	this.lasersGenerator;

	this.timerInit;

	this.livesGroup;
	this.livesNum;
	this.livesTween;

	this.score;
	this.scoreText;

	this.level;

	this.bonus;
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

		// Enemies lasers
		this.lasers = this.game.add.group();

		// Bonus
		this.bonus = this.game.add.group();

		// Level
		this.level = 1;

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
			//console.log(this.game.time.totalElapsedSeconds());
		}

		this.fpsText.setText(this.game.time.fps + ' FPS');
	},

	shutdown: function(){
		this.bullets.destroy();
		this.enemies.destroy();
		this.lasers.destroy();
		this.hero.destroy();
		Game.paused = true;
	},

	initGame: function(){
		// Generate enemies
		this.enemiesGenerator = this.game.time.events.add(3000, this.generateEnemies, this);

		// Generate enemies laser
		this.lasersGenerator = this.game.time.events.add(1000, this.shootLaser, this);

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

			// Freeze lasers rotation
			this.lasers.forEach(function(laser){
				laser.pause();
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

			// Active lasers rotation
			this.lasers.forEach(function(laser){
				laser.resume();
			}, this);

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
		var enemies = this.enemies.getFirstExists(false);

		if(!enemies){
			enemies = new Game.Prefabs.Enemies(this.game, this.enemies);
		}
		enemies.reset(this.game.rnd.integerInRange(50, 270), this.game.rnd.integerInRange(50, 270));

		// Relaunch timer depending on level
		this.enemiesGenerator = this.game.time.events.add(this.game.rnd.integerInRange(12, 20)*250/this.level, this.generateEnemies, this);
	},

	shootLaser: function(){
		var laser = this.lasers.getFirstExists(false);

		if(!laser){
			laser = new Game.Prefabs.Laser(this.game, 0, 0);
			this.lasers.add(laser);
		}
		laser.reset(this.game.width + laser.width/2, this.game.rnd.integerInRange(20, this.game.height-20));
		laser.reload(150);

		// Relaunch bullet timer depending on level
		this.lasersGenerator = this.game.time.events.add(this.game.rnd.integerInRange(12, 20)*500/this.level, this.shootLaser, this);
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

		// Hero vs Lasers
		this.game.physics.arcade.overlap(this.hero, this.lasers, this.killHero, null, this);

		// Hero vs Bonus
		this.game.physics.arcade.overlap(this.hero, this.bonus, this.activeBonus, null, this);
	},

	killEnemy: function(bullet, enemy){
		if(!enemy.dead && enemy.checkWorldBounds){
			enemy.die();
			bullet.kill();
			this.updateScore();
		}
	},

	killHero: function(hero, enemy){
		if(enemy instanceof Game.Prefabs.Laser || (enemy instanceof Game.Prefabs.Enemy && !enemy.dead && enemy.checkWorldBounds)){
			if(!this.hero.shielded){
				// Update lives
				this.hero.lives--;

				if(this.hero.lives < 1){
					this.hero.die();
					this.gameOver();
				}else{
					this.hero.enableShield(2);

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

	addBonus: function(enemy){
		var bonus = this.bonus.getFirstDead();
		var type = this.game.rnd.integerInRange(0, 1);
		
		if(!bonus){
			bonus = new Game.Prefabs.Bonus(this.game, 0, 0, type);
			this.bonus.add(bonus);
		}

		bonus.reload(enemy.x, enemy.y, type);
	},

	activeBonus: function(hero, bonus){
		bonus.kill();
		console.log(bonus.type);
		switch(bonus.type){
			case 1: 
				// Double shoot
				hero.enableDoubleShoot(this.BONUS_DURATION);
				break;
			default:
				// Shield
				hero.enableShield(this.BONUS_DURATION);
				break;
		}
	},

	updateScore: function(){
		this.score += 10;
		this.scoreText.setText('Score : ' + this.score.toString());

		// Level depending on player score
		if(this.score < 100){
			this.changeLevel(1);
		}else if(this.score < 250){
			this.changeLevel(2);
		}else if(this.score < 500){
			this.changeLevel(3);
		}
	},

	changeLevel: function(level){
		if(this.level !== level){
			this.level = level;
		}
	},

	gameOver: function(){
		this.game.state.start('Menu');
	}
};