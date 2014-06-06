Game = {
	orientated: true,

	States: {},
	Prefabs: {}
};

Game.States.Boot = function(game){
};

Game.States.Boot.prototype = {
	preload: function(){
		this.load.image('preloader', 'assets/preloader.gif');
	},

	create: function(){
        // Center canvas
        this.scale.pageAlignHorizontally = true;
        this.scale.pageAlignVertically = true;

        // Block landscape on mobile devices - Ratio Exception for square resolution (BB Q10) : See callbakcs
        if(!this.game.device.desktop){
        	this.scale.forceOrientation(false, true);
        	this.scale.enterIncorrectOrientation.add(this.enterIncorrectOrientation, this);
        	this.scale.leaveIncorrectOrientation.add(this.leaveIncorrectOrientation, this);
        }

        // Start Preloader
        this.scale.setScreenSize(true);
		this.game.state.start('Preloader');
	},

	enterIncorrectOrientation: function(){
		Game.orientated = false;
		this.game.paused = true;
		document.getElementById('orientation').style.display = 'block';
	},

	leaveIncorrectOrientation: function(){
		Game.orientated = true;
		this.game.paused = false;
		this.scale.setScreenSize(true);
		document.getElementById('orientation').style.display = 'none';
	}
};

Game.States.Preloader = function(game){
	this.preloadBar = null;
	this.ready = false;
};

Game.States.Preloader.prototype = {
	preload: function(){
		this.game.stage.backgroundColor = '#000000';

		this.preloadBar = this.game.add.sprite(this.game.width/2, this.game.height/2, 'preloader');
		this.preloadBar.anchor.setTo(0.5, 0.5);
		this.load.setPreloadSprite(this.preloadBar);
		this.load.onLoadComplete.addOnce(this.onLoadComplete, this);

		this.load.image('badge', 'assets/badge.png');

		// Images - this.load.image(key, url);

		// Spritesheets - this.load.spritesheet(key, url, frameWidth, frameHeight, numberOfFrames);

		// Fonts - this.load.bitmapFont(key, textureURL, xmlURL, xmlData, xSpacing, ySpacing);

		// Audio - this.load.audio(key, urls, autoDecode);
	},

	create: function(){
		this.preloadBar.cropEnabled = false;
	},

	update: function(){
		if(this.ready){
			this.game.state.start('Menu');
		}
	},

	onLoadComplete: function(){
		this.ready = true;
	}
};