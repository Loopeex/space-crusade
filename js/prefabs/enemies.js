Game.Prefabs.Enemies = function(game, parent){
	// Super call to Phaser.Group
	Phaser.Group.call(this, game, parent);

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
	this.checkWorldBounds();
};

Game.Prefabs.Enemies.prototype.reset = function(from, to){
	this.exists = true;

	// Reset all enemies
	var i = 0;
	this.forEach(function(enemy){
		if(i === 0){
			enemy.resetTarget(to);
		}

		enemy.reload(i, from);
		i++;
	}, this);
};

Game.Prefabs.Enemies.prototype.checkWorldBounds = function(){
	// Check if an enemy is still alive
	var groupAlive = false;
	this.forEach(function(enemy){
		if(!enemy.dead){
			groupAlive = true;
		}
	}, this);

	if(!groupAlive){
		this.exists = false;
	}
};