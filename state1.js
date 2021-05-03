let tutorial = {};
var contBtn = false;
var message = 0;
var messages = ["Use the arrow keys to move left and right, and jump up and down","Use the 'f' key to fire weapon", "^ Here is your health bar. Get shot too much, \n and you lose the game.","^ Here is your mana bar. Shoot enemies too much, \n and you'll lose ammo.","^ Here is your score. \n When the score reaches the 'Time until next Door' \n you may continue to the next level.","Pick up more powerful weapons by walking towards them.", "^ New weapons will show up \n in your inventory. \n Toggle between weapons \n with the number keys." ,"This kind of enemy shoots large missles that do a lot of damage, \n but move slowly and can be destroyed. Be Careful of these ones","Pick up food to increase health.","Try double jumping by pressing up twice.", ];
var weapon1, weapon2, fireRate = 200, nextFire = 0, idleTimer = 10000, nextIdle = 0, currentWeapon;
var weaponholding = 1;
var dooropen = false;
var nextDoor = 25;
//let player = {}, falling, scoreTime = {};
var level = 0;
//var tutGroup;
//let player = {}, falling, scoreTime = {};

tutorial = function () {};


tutorial.prototype = {
  displaymessage: function (xval,message) {
    if (xval<=500 && game.time.now > timeInTitle+1000) {
      if (message == 0){    
          game.paused = true;
          tutorial.prototype.controls(message,CenterX,CenterY);
      }
      else if (message == 1){
        game.paused = true;
        tutorial.prototype.controls(message,CenterX,CenterY);
      }
    }
    if (xval > 500){
       if (message == 2){
           game.paused = true;
           tutorial.prototype.controls(message,CenterX-400,CenterY-360);
       }
       else if (message == 3){
           game.paused = true;
           tutorial.prototype.controls(message,CenterX-200,CenterY-360);
       }
       else if (message == 4){
           game.paused = true;
           tutorial.prototype.controls(message,CenterX-50,CenterY-340);
       }
    }
    if (xval > 700){
        if (message == 5){
           game.paused = true;
           tutorial.prototype.controls(message,CenterX+200,CenterY);
        }
        if (message == 6){
           game.paused = true;
           tutorial.prototype.controls(message,CenterX+800,CenterY-300);
        }
    }
    if (xval > 800) {
      if (message == 7) { // enemy message
        game.paused = true;
        tutorial.prototype.controls(message, CenterX+220, CenterY+100);
      }
    }
    if (xval > 1200){
        if (message == 8){
           game.paused = true;
           tutorial.prototype.controls(message,CenterX+400,CenterY);
        }
        else if (message == 9){
           game.paused = true;
           tutorial.prototype.controls(message,CenterX+400,CenterY);
        }
    }
    
  },
  continueBtn: function(xloc,yloc) {
    if (contBtn) {
      contBtn = false;
    } else {
      continueBtnn = game.add.button(xloc+35, yloc+20, "blankBtn", function() {
        conttext.kill();
        controlText.kill()
        continueBtnn.kill();
        game.paused = false;
      });
      conttext = game.add.text(xloc, yloc, "[" + "OK" + "]", {font: "40px Monospace"});
      continueBtnn.anchor.setTo(0.5, 0.5);
     
      continueBtnn.scale.x = 8;
      continueBtnn.scale.y = 2;
      contBtn = true;
    }
  },
  controls: function(mess_now,locx,locy) {
    //controls = "Use the arrow keys to move left and right, and jump up and down"
    controls = messages[mess_now];
    controlText = game.add.text(locx, locy, "[" + controls + "]", {font: "32px Monospace"});
    
    controlText.anchor.setTo(0.5, 0.5);
    tutorial.prototype.continueBtn(locx-40,locy + 80);
    message ++;
    contBtn = false;
  },
  enemyDefine: function () {
    tutGroup = game.add.group();
    //stationaryGroup.createMultiple(50, enemyType);
    tutGroup.createMultiple(50, 'stationaryenemy');
    tutGroup.setAll('name','stationary');
    tutGroup.setAll('anchor.y', 0.5);
    tutGroup.setAll('anchor.x', 0.5);
    tutGroup.setAll('scale.x', 0.75);
    tutGroup.setAll('scale.y', 0.75);
    tutGroup.callAll('animations.add', 'animations', 'enemywalk', [0, 1, 2, 3]);
    tutGroup.callAll('animations.add', 'animations', 'dead', [4]);
  },
  enemySpawn: function ( x, y, enemyGroup) {
    var enemyLocal;
    enemyLocal = enemyGroup.getFirstDead(true, x, y)
    game.physics.enable(enemyLocal);
    enemyLocal.body.collideWorldBounds = true;
    enemyLocal.body.gravity.y = player.gravity;
    enemyLocal.animations.play('enemywalk', 8, true);
  },
}



slime.state1 = function() {};
slime.state1.prototype = {
  preload: function() {
    game.load.spritesheet('manaBar', 'assets/spritesheet/manaBar.png', 32, 32);
    game.load.spritesheet('healthBar', 'assets/spritesheet/healthBar.png', 32, 32);
    game.load.spritesheet('door', 'assets/spritesheet/portal.png', 256, 256);
    game.load.spritesheet('slime-idle', 'assets/spritesheet/slime_idle.png', 64, 64);
    game.load.spritesheet('slime-new', 'assets/spritesheet/slime-new.png', 64, 64);
    game.load.spritesheet('slime-new2', 'assets/spritesheet/slime-new2.png', 64, 64);
    game.load.spritesheet('enemy', 'assets/spritesheet/enemy.png',128,128);
    game.load.spritesheet('stationaryenemy', 'assets/spritesheet/stationaryenemy.png',256,256);
    game.load.spritesheet('flyingenemy', 'assets/spritesheet/bug.png',128,128);
    game.load.spritesheet('projectile', 'assets/spritesheet/projectile.png', 64, 64);
    game.load.spritesheet('projectile2','assets/spritesheet/projectile2.png',128,128);
    game.load.spritesheet('projectile3','assets/spritesheet/projectile3.png',256,256);
    game.load.spritesheet('enemy_projectile','assets/spritesheet/enemy_bullet.png',128,128);
    game.load.spritesheet('stationary_projectile','assets/spritesheet/bigbullet.png',128,128);
    game.load.image('weapon1', 'assets/sprites/basic-weapon.png');
    game.load.image('weapon2', 'assets/sprites/laser_gun.png');
    game.load.image('weapon3', 'assets/sprites/gun3.png');
    game.load.image('apple','assets/sprites/apple.png');
    game.load.image('potion','assets/sprites/potion.png');
    game.load.image('slime_static', 'assets/sprites/slime_static.png');
    game.load.image('bullet', 'assets/sprites/bullet.png');
    game.load.image('platform', 'assets/sprites/platform.png');
    game.load.image('background', 'assets/sprites/background.png');
    game.load.image('foreground', 'assets/sprites/foreground.png');
    game.load.image('background2', 'assets/sprites/background2.png');
    game.load.image('foreground2', 'assets/sprites/foreground2.png');
    game.load.image('background3', 'assets/sprites/background3.png');
    game.load.image('foreground3', 'assets/sprites/foreground3.png');
    game.load.image('exit', 'assets/sprites/exit1.png');
    game.load.image('rock-ground', 'assets/sprites/rock_ground.png');
    game.load.image('background2_ground', 'assets/sprites/background2_ground.png');
    game.load.image('background3_ground', 'assets/sprites/background3_ground.png');
    game.load.audio('laser','assets/sounds/laser.wav');
    game.load.audio('jump', 'assets/sounds/jump-sfx.mp3');
    game.load.audio('enemy_death','assets/sounds/enemy_dies.m4a');
    game.load.audio('playerLand', 'assets/sounds/thud.wav');
  },

  create: function() {
    game.world.setBounds(0, 0, 5000, 1000); // important to be called early if not first
    var gameX = game.world.bounds.width; gameY = game.world.bounds.height;
    base_game.prototype.parallax();

    // add game sounds
    // Add them to array so mute works too
    // I'd like to make this into a separate function. like base_game.prototye.sounds()
    laser = game.add.audio("laser");
    jumpSFX = game.add.audio('jump');
    jumpSFX.volume = 0.3
    death = game.add.audio("enemy_death");
    thud = game.add.audio('playerLand');
    soundsArray = [laser, jumpSFX, death, thud];

    game.stage.backgroundColor = "#dddddd";
    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;

    player_slime = game.add.sprite(100, 100, "slime-new");
    player_slime.scale.setTo(0.7, 0.7);

    portal_slime = game.add.sprite(gameX - 500, 745, "door");
    portal_slime.scale.setTo(1.5, 1.5);
    game.physics.enable(portal_slime);

    portal_slime.animations.add('dooropen',[1,2,3,4,5,6,7,8]);

    // add the platforms
    base_game.prototype.genPlatforms(game.world.bounds.width, game.world.bounds.height, "tut")

    // add collide with the platforms
    game.physics.enable([player_slime, platformGroup, rockGroup]);
    player_slime.body.collideWorldBounds = true;
    platformGroup.setAll('body.immovable', true);
    rockGroup.setAll('body.immovable', true);
      
      
    player.movement.prototype.manaInit(400,40,true);
    player.movement.prototype.healthInit(200,40,true);

    // custom call, shortens work and declutters the code. 
    base_game.prototype.physics(player_slime);
    base_game.prototype.projectile();

    //camera
    game.camera.follow(player_slime);

    // enabling hud pass button objects in the array
    hud.funcs.prototype.push([volumeBtn]);
    hud.funcs.prototype.toggle() // toggle visibility off
    hud.funcs.prototype.move(settingBtn, game.camera.x + 650, 30);
    //hud.funcs.prototype.move(volumeBtn, game.camera.x + 900, 50);
    hud.funcs.prototype.move(b1_tutorial,game.camera.x+20,30);

    //score time set the intial text location
    //scoreFunc.prototype.start();

    // enemy group init
    //enemyFunc.prototype.initialize('enemy');
    //enemyFunc.prototype.manualSpawn(500, 500);
      
      
    //score time set the intial text location
    //player.movement.prototype.displayWeapon();
    backdrop = game.add.sprite(CenterX+750, CenterY/8 - 20, 'blankBtn');
    backdrop.scale.x = 10;
    backdrop.scale.y = 4;
    Localtext = game.add.text(CenterX+750, CenterY/8 -35, "Curr. Weapon", {font: "30px Monospace"});
    Localtext.anchor.x = 0.5; Localtext.anchor.y = 0.5;
    Localtext.fixedToCamera = true;
    backdrop.anchor.x = 0.5; backdrop.anchor.y = 0.5;
    backdrop.fixedToCamera = true;
    currentWeapon = 1

    if (weaponholding == null) { weaponholding = 1; var i;}
    player.movement.prototype.changeWeapon(i, weaponholding);

    player.movement.prototype.weaponChangeEventListener();
    
    scoreFunc.prototype.start();
    scoreFunc.prototype.nextDoorSet();

    tutorial.prototype.enemyDefine();
    tutorial.prototype.enemySpawn(1200, 500, tutGroup);


  },
  update: function() {
    game.physics.arcade.collide(player_slime, [platformGroup], player.movement.prototype.hitPlatform);
    game.physics.arcade.collide(player_slime, [rockGroup]);
    game.physics.arcade.collide(player_slime, [grassGroup]);
    game.physics.arcade.collide(player_slime, [metalGroup]);

    game.physics.arcade.collide(tutGroup, [platformGroup, rockGroup]);
      
    game.physics.arcade.overlap(player_slime, apples, player.movement.prototype.pickUpItem);
    game.physics.arcade.overlap(player_slime, potions, player.movement.prototype.pickUpPotion);
    game.physics.arcade.collide(apples, [rockGroup, grassGroup, metalGroup, platformGroup], enemyFunc.prototype.appleBob);
    game.physics.arcade.collide(potions, [rockGroup, grassGroup, metalGroup, platformGroup], enemyFunc.prototype.potionBob);

    player.movement.prototype.move(game.input.keyboard);
    game.physics.arcade.overlap(player_slime, portal_slime, this.hitPortal);
    base_game.prototype.gameSounds();

    player.movement.prototype.attack(game.input.keyboard);
    player.movement.prototype.manaRegen();

    // keeps score up to date
    scoreFunc.prototype.update();
    
    tutorial.prototype.displaymessage(player_slime.x, message);
    resetJumps();
  },

  hitPortal: function() {
    console.log("hit portal");
    if (dooropen){
        currentWeapon = null;
        weaponholding = null;
        //player.weapons = [1];
        player.movement.prototype.removeWeaponInv();
        game.state.start('title');
        location.reload();
    }
  },
}

function changeState (stateNum) {
  console.log("state" + stateNum);
  currentWeapon = null;
  weaponholding = null;
  player.movement.prototype.removeWeaponInv();
}
