Game.Prefabs.Hero = function(game, x, y, target){
	// Super call to Phaser.sprite
	Phaser.Sprite.call(this, game, x, y, 'hero');

	// Target : pointer
	this.target = target;

	// Follow pointer
	this.follow = false;

	// Speed
	this.speed = 200;

	// Min distance from pointer
	this.minDistance = 10;

	// Set sprite's anchor to the center
	this.anchor.setTo(0.5, 0.5);

	// Enable physics on this object
    this.game.physics.enable(this, Phaser.Physics.ARCADE);
}

Game.Prefabs.Hero.prototype = Object.create(Phaser.Sprite.prototype);
Game.Prefabs.Hero.constructor = Game.Prefabs.Hero;

Game.Prefabs.Hero.prototype.update = function(){
	var distance, rotation;

	if(this.follow){
		distance = this.game.math.distance(this.x, this.y, this.target.x, this.target.y);

		if(distance > this.minDistance){
			rotation = this.game.math.angleBetween(this.x, this.y, this.target.x, this.target.y);

			this.body.velocity.x = Math.cos(rotation) * this.speed * Math.min(distance / 120, 2);
			this.body.velocity.y = Math.sin(rotation) * this.speed * Math.min(distance / 120, 2);
		}else{
			this.body.velocity.setTo(0, 0);
		}
	}else{
		this.body.velocity.setTo(0, 0);
	}
};