Game.Prefabs.Hero = function(game, x, y, frame){
	// Super call to Phaser.sprite
	Phaser.Sprite.call(this, game, x, y, 'badge', frame);

	// Set sprite's anchor to the center
	this.anchor.setTo(0.5, 0.5);
}

Game.Prefabs.Hero.prototype = Object.create(Phaser.Sprite.prototype);
Game.Prefabs.Hero.constructor = Game.Prefabs.Hero;

Game.Prefabs.Hero.prototype.update = function(){
	
};