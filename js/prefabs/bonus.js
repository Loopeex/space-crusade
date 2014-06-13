Game.Prefabs.Bonus = function(game, x, y, frame, type){
	// Super call to Phaser.sprite
	Phaser.Sprite.call(this, game, x, y, 'bonus', frame);

	// Centered anchor
	this.anchor.setTo(0.5, 0.5);

	// Kill when out of world
	this.checkWorldBounds = true;
	this.outOfBoundsKill = true;

	// Enable physics
	this.game.physics.enable(this, Phaser.Physics.ARCADE);

	// Type
	this.type = type;
}

Game.Prefabs.Bonus.prototype = Object.create(Phaser.Sprite.prototype);
Game.Prefabs.Bonus.constructor = Game.Prefabs.Bonus;

Game.Prefabs.Bonus.prototype.update = function(){
	if(!Game.paused){
		this.body.velocity.x = -100;
	}else{
		this.body.velocity.x = 0;
	}
};

Game.Prefabs.Bonus.prototype.reload = function(x, y, frame){
	this.x = x;
	this.y = y;
	this.frame = frame;
	this.type = frame;
	this.revive();
};