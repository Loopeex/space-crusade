var Game = {
	name: 'Space Crusade',
	orientated: true,
	backgroundX: 0,
	backgroundY: 0,
	paused: true,

	States: {},
	Prefabs: {},

	Analytics: {
		active: true,
		category: 'Game',

		trackEvent: function(label, value){
			if(Game.Analytics.active){
				ga('send', 'event', Game.Analytics.category, Game.name, label, value);
			}
		}
	}
};

Game.States.Boot = function(game){
};

Game.States.Boot.prototype = {
	preload: function(){
		this.load.image('background', 'assets/background.png');
		this.load.image('preloader', 'assets/preloader.png');
	},

	create: function(){
		// Ratio
		this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.scale.minWidth = 480;
        this.scale.minHeight = 320;
        this.scale.maxWidth = 960;
        this.scale.maxHeight = 640;

        // Center canvas
        this.scale.pageAlignHorizontally = true;
        this.scale.pageAlignVertically = true;

        // Block portrait on mobile devices
        if(!this.game.device.desktop){
        	this.scale.forceOrientation(true, false);
        	this.scale.enterIncorrectOrientation.add(this.enterIncorrectOrientation, this);
        	this.scale.leaveIncorrectOrientation.add(this.leaveIncorrectOrientation, this);
        }

        // Start Preloader
        this.scale.setScreenSize(true);
		this.game.state.start('Preloader');
	},

	enterIncorrectOrientation: function(){
		Game.orientated = false;
		document.getElementById('orientation').style.display = 'block';
		this.game.paused = true;
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
		// Background
		this.game.stage.backgroundColor = '#5e3f6b';
		this.background = this.game.add.tileSprite(0, 0, 480, 320, 'background');
		this.background.autoScroll(-100, -20);

		this.preloadBar = this.game.add.sprite(this.game.width/2, this.game.height/2, 'preloader');
		this.preloadBar.anchor.setTo(0.5, 0.5);
		this.load.setPreloadSprite(this.preloadBar);
		this.load.onLoadComplete.addOnce(this.onLoadComplete, this);

		// Images
		this.load.image('title', 'assets/title.png');
		this.load.image('hero', 'assets/hero.png');
		this.load.image('pausePanel', 'assets/pause-panel.png');
		this.load.image('enemy1', 'assets/enemy1.png');
		this.load.image('explosion', 'assets/explosion.png');
		this.load.image('lives', 'assets/lives.png');
		this.load.image('shield', 'assets/shield.png');
		this.load.image('bullet', 'assets/bullet.png');
		this.load.image('laser', 'assets/laser.png');
		this.load.image('new', 'assets/new.png');

		// Spritesheets
		this.load.spritesheet('btnMenu', 'assets/btn-menu.png', 190, 49, 2);
		this.load.spritesheet('btn', 'assets/btn.png', 49, 49, 6);
		this.load.spritesheet('num', 'assets/num.png', 12, 11, 5);
		this.load.spritesheet('bonus', 'assets/bonus.png', 16, 16, 2);

		// Fonts
		this.load.bitmapFont('kenpixelblocks', 'assets/fonts/kenpixelblocks.png', 'assets/fonts/kenpixelblocks.fnt');
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