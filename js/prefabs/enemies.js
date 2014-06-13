Game.Prefabs.Enemies = function(game, parent){
	// Super call to Phaser.Group
	Phaser.Group.call(this, game, parent);

	// Count living enemies
	this.livingEnemies = 5;

	// Switch if kery killed all enemies of the group
	this.killedAll = true;

	var enemy;
	for(var i=0; i<5; i++){
		enemy = this.add(new Game.Prefabs.Enemy(this.game, 0, 0, 'enemy1', enemy || new Phaser.Point(0, 0)));
		enemy.x = this.game.width + enemy.width/2 + i*(enemy.width + 10);
		enemy.y = 300;
	}
};

Game.Prefabs.Enemies.prototype = Object.create(Phaser.Group.prototype);
Game.Prefabs.Enemies.constructor = Game.Prefabs.Enemies;

Game.Prefabs.Enemies.prototype.update = function(){
	this.callAll('update');
};

Game.Prefabs.Enemies.prototype.reset = function(from, to, speed){
	this.exists = true;
	this.livingEnemies = 5;
	this.killedAll = true;

	// Reset all enemies
	var i = 0;
	this.forEach(function(enemy){
		if(i === 0){
			enemy.resetTarget(to);
		}

		enemy.reload(i, from, speed);
		i++;
	}, this);
};

Game.Prefabs.Enemies.prototype.updateStatus = function(enemy, autoKill){
	this.livingEnemies--;

	if(autoKill){
		this.killedAll = false;
	}

	if(this.livingEnemies === 0){
		this.exists = false;

		// Randomly activate a bonus if killed all the enemies
		if(this.killedAll){
			var rdm = this.game.rnd.integerInRange(1, 4);
			
			if(rdm === 1){
				this.game.state.getCurrentState().addBonus(enemy);
			}
		}
	}
};