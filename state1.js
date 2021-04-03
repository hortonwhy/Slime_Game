let tutorial = {};
var firstPause = true, secondPause = true, thirdPause = true, fourthPause = true, arrowKeys = false, contBtn = false;
var message = 0;
var messages = ["Use the arrow keys to move left and right, and jump up and down","Use the 'f' key to fire weapon", "^ Here is your health bar. Get shot too much, and you lose the game.","^ Here is your mana bar. Shoot enemies too much, and you'll lose ammo.","Pick up more powerful weapons by walking towards them.", "Pick up food to increase health."];
var weapon1, weapon2, fireRate = 200, nextFire = 0, idleTimer = 10000, nextIdle = 0, currentWeapon;
var weaponholding;
var dooropen = false;
var nextDoor = 25;
//let player = {}, falling, scoreTime = {};
var level = 0;
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
           tutorial.prototype.controls(message,CenterX-250,CenterY-370);
       }
       else if (message == 3){
           game.paused = true;
           tutorial.prototype.controls(message,CenterX-100,CenterY-370);
       }
    }
    if (xval > 1220){
        if (message == 4){
           game.paused = true;
           tutorial.prototype.controls(message,CenterX+300,CenterY);
        }
    }
    if (xval > 2320){
        if (message == 5){
           game.paused = true;
           tutorial.prototype.controls(message,CenterX+1000,CenterY);
        }
    }

    else if (arrowKeys) {
      console.log("next tut");
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
        conttext.kill();
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
  displayWeapon: function() {
    //currentWeapon
    var backdrop = game.add.sprite(CenterX + 40, CenterY/8 - 20, 'blankBtn');
    backdrop.scale.x = 10;
    backdrop.scale.y = 4;
    var Localtext = game.add.text(CenterX -20, CenterY/8 -35, "Equipped: ", {font: "30px Monospace"});
    Localtext.anchor.x = 0.5; Localtext.anchor.y = 0.5;
    Localtext.fixedToCamera = true;
    backdrop.anchor.x = 0.5; backdrop.anchor.y = 0.5;
    backdrop.fixedToCamera = true;

    if (currentWeapon != null) {
      var displayWep = game.add.sprite(CenterX, CenterY/8, currentWeapon.key)
      displayWep.anchor.x = 0.5; displayWep.anchor.y = 0.5;
      displayWep.fixedToCamera = true;
      if (currentWeapon.key == 'weapon1') {
        displayWep.scale.x = 3; displayWep.scale.y = 3;
      } else {
        displayWep.scale.x = 0.8; displayWep.scale.y = 0.8;
      }
    }
      
    setTimeout(() => player.movement.prototype.displayWeapon(), 100);
  },
  pickUpWeapon: function() {
    if (weaponholding != 2 && Math.abs(player_slime.x - weapon2.x) <= 5 && Math.abs(player_slime.y - weapon2.y) <= 50){
        weapon2.x = -100;
        player.movement.prototype.addWeaponInv(2);
        //changeWeapon(0,2);
    }
  },
  alertWeapon: function(weapon) {
    var backdrop = game.add.sprite(CenterX, CenterY, 'blankBtn');
    backdrop.scale.x = 22;
    backdrop.scale.y = 2
    var Localtext = game.add.text(CenterX, CenterY, "Weapon: " + weapon + " is not in your inventory", {font: "30px Monospace"});
    Localtext.anchor.x = 0.5; Localtext.anchor.y = 0.5;
    Localtext.fixedToCamera = true;
    backdrop.anchor.x = 0.5; backdrop.anchor.y = 0.5;
    backdrop.fixedToCamera = true;
    setTimeout(() => backdrop.kill(), 2000); setTimeout(() => Localtext.kill(), 2000);
  },
  addWeaponInv: function(weaponNum, weapon) { // if player doesn't have the unique weapon, add it to inventory
    for (i = 0; i < player.weapons.length; i++) {
      if (weaponNum != player.weapons[i]) {
        player.weapons.push(weaponNum);
      }
    }
  },
  checkInv: function(weapon) { // return t/f if weapon is in inv
    for (i = 0; i < player.weapons.length; i++) {
      if (player.weapons[i] == weapon) {
        return true;
      }
    }
    return false;
  },
  changeWeapon: function (i, weapon) {
    hasWeapon = player.movement.prototype.checkInv(weapon)
    if (hasWeapon) {
      if (currentWeapon == null) {
        currentWeapon = weapon1
      }
      if (weapon == 1){
        currentWeapon.visible = false;
        weaponholding = weapon;
        currentWeapon = weapon1; //hardcoded bad for 3rd weapon :D
        currentWeapon.visible = true;
      } else if (weapon == 2) { 
        currentWeapon.visible = false;
        weaponholding = weapon;
        currentWeapon = weapon2;
        currentWeapon.visible = true;
      }
    }
    player.movement.prototype.alertWeapon(weapon);
    //console.log("Weapon: ", weapon, "is not in your inventory");

  },
  addKeyCallBack: function (key, fn, args) {
    //console.log(key, fn, args);
    game.input.keyboard.addKey(key).onDown.add(fn, null, null, args);
  },
  // add new weapons to this
  weaponChangeEventListener: function () {
    this.addKeyCallBack(Phaser.Keyboard.ONE, this.changeWeapon, 1);
    this.addKeyCallBack(Phaser.Keyboard.TWO, this.changeWeapon, 2);
  },
}



slime.state1 = function() {};
slime.state1.prototype = {
  preload: function() {
    game.load.spritesheet('manaBar', 'assets/spritesheet/manaBar.png', 32, 32);
    game.load.spritesheet('healthBar', 'assets/spritesheet/healthBar.png', 32, 32);
    game.load.spritesheet('door', 'assets/spritesheet/door.png', 128, 128);
    game.load.spritesheet('slime-idle', 'assets/spritesheet/slime_idle.png', 64, 64);
    game.load.spritesheet('slime-new', 'assets/spritesheet/slime-new.png', 64, 64);
    game.load.spritesheet('slime-new2', 'assets/spritesheet/slime-new2.png', 64, 64);
    game.load.spritesheet('enemy', 'assets/spritesheet/enemy.png',128,128);
    game.load.spritesheet('projectile', 'assets/spritesheet/projectile.png', 64, 64);
    game.load.image('weapon1', 'assets/sprites/basic-weapon.png');
    game.load.image('weapon2', 'assets/sprites/laser_gun.png');
    game.load.image('apple','assets/sprites/apple.png');
    game.load.image('slime_static', 'assets/sprites/slime_static.png');
    game.load.image('bullet', 'assets/sprites/bullet.png');
    game.load.image('platform', 'assets/sprites/platform.png');
    game.load.image('background', 'assets/sprites/background.png');
    game.load.image('foreground', 'assets/sprites/foreground.png');
    game.load.image('background2', 'assets/sprites/background-high-res.png');
    game.load.image('foreground2', 'assets/sprites/foreground-high-res.png');
    game.load.image('exit', 'assets/sprites/exit1.png');
    game.load.image('rock-ground', 'assets/sprites/rock_ground.png');
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
    jumpSFX = game.add.audio('jump')
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
    enemyFunc.prototype.initialize('enemy');
    //enemyFunc.prototype.manualSpawn(500, 500);
      
      
    //score time set the intial text location
    player.movement.prototype.displayWeapon()
    
    scoreFunc.prototype.start();
    scoreFunc.prototype.nextDoorSet();

  },
  update: function() {
    game.physics.arcade.collide(player_slime, [platformGroup], player.movement.prototype.hitPlatform);
    game.physics.arcade.collide(player_slime, [rockGroup]);
    game.physics.arcade.collide(enemyGroup, [rockGroup, player_slime, platformGroup]);
    player.movement.prototype.move(game.input.keyboard);
    player.movement.prototype.manaInit(400,40,true);
    player.movement.prototype.healthInit(200,40,true);
    player.movement.prototype.attack(game.input.keyboard);
    game.physics.arcade.overlap(player_slime, portal_slime, this.hitPortal);
    base_game.prototype.gameSounds();
    player.movement.prototype.attack(game.input.keyboard);   
    game.physics.arcade.overlap(player_slime, [weapon2], player.movement.prototype.pickUpWeapon);
      
    
    scoreFunc.prototype.update();
      
    game.physics.arcade.overlap(player_slime, portal_slime, this.hitPortal);
    

    //enemyFunc.prototype.chase(enemyGroup, enemySpeed); // Can change speed
    //enemyFunc.prototype.dynamicSpawn();
    //enemyFunc.prototype.attack();
    
    tutorial.prototype.displaymessage(player_slime.x, message)
  },
  pickUpWeapon: function() {
    if (weaponholding != 2 && Math.abs(player_slime.x - weapon2.x) <= 5 && Math.abs(player_slime.y - weapon2.y) <= 50){
        weapon2.x = -100;
        player.movement.prototype.addWeaponInv(2);
    }
  },

  hitPortal: function() {
    console.log("hit portal");
    if (dooropen){
        game.state.start('title');
    }
  },
}

function changeState (stateNum) {
  console.log("state" + stateNum);
  game.state.start("title");
}
