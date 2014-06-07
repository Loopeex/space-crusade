Game.Prefabs.Enemy = function(game, x, y, type, target){
	// Super call to Phaser.sprite
	Phaser.Sprite.call(this, game, x, y, type);

	// Speed
	this.speed = 300;

	// Target
	this.target = target;

	// Dead - Can't use alive because enemies follow each other
	this.dead = false;

	// Min Distance
	this.minDistance = 10;

	// Enable physics on this object
	this.anchor.setTo(0.5, 0.5);
    this.game.physics.enable(this, Phaser.Physics.ARCADE);

    // Out of bounds callback
    this.events.onOutOfBounds.add(this.die, this);
}

Game.Prefabs.Enemy.prototype = Object.create(Phaser.Sprite.prototype);
Game.Prefabs.Enemy.constructor = Game.Prefabs.Enemy;

Game.Prefabs.Enemy.prototype.update = function(){
	// Change velocity to follow the target
	var distance, rotation;
	distance = this.game.math.distance(this.x, this.y, this.target.x, this.target.y);

	if(distance > this.minDistance){
		rotation = this.game.math.angleBetween(this.x, this.y, this.target.x, this.target.y);

		this.body.velocity.x = Math.cos(rotation) * this.speed;
		this.body.velocity.y = Math.sin(rotation) * this.speed;
	}else{
		this.body.velocity.setTo(0, 0);
	}

	// Active enemy
	if(this.x < this.game.width && !this.checkWorldBounds){
		this.checkWorldBounds = true;
	}
};

Game.Prefabs.Enemy.prototype.die = function(){
	this.dead = true;
};