// State0 will be the titlescreen
let player_slime, jumpSFX;
var apples, potions
var slime = {};
let bullets;
var manaBar;
var rockGroup, grassGroup, metalGroup;
var platformGroup, onPlat, hasJumped = true, secondElapsed;
var weapon1, weapon2, weapon3, fireRate = 200, nextFire = 0, idleTimer = 10000, nextIdle = 0, currentWeapon;
var weaponholding; // dictates weapon 1 or 2
var volumeBtn, settingBtn, healthBar;
var b1_tutorial;
var background, foreground, backgroundGroup, foregroundGroup;
let player = {}, falling, scoreTime = {};
let enemy = {};
var numEnemies = 2; // number of enemies until group problem is fixed
var enemyGroup, flyingGroup, stationaryGroup, nextSpawn = 0, enemySpeed = 1.0; //higher is faster
let base_game = {}; // will provide methods for quick creation of a new state
let platforms = {};
var dooropen = false;
//var shot = 0;
//var shot = 0;
var healthCoolDown = 500; var nextManaRegen = 0;
var states = ['first', 'second', 'third']
var enemyFireRate = 1000; var enemyNextFire = 0;
var enemyLongFireRate = 6000; var nextLongFire = 0;
var level = 0; var nextDoor;// first loop
var backdrop, Localtext;
var currentLocations; // array of current location of platforms
//var shot = false; is the enemy shot?
// attempting slime movement to be handled more nicely

player.accel = 400
player.jump_height = 750;
player.gravity = 1700;
player.drag = 100
player.fireRate = ["", 200, 400, 600];
player.difficulty = 1; // Lower is more difficult
player.max_health = 10;
player.health = 10;
player.max_mana = 100;
player.mana = 100;
player.manaRegenRate = 5000;
player.knockback = 20; // velocity
player.weapons = [1];


// enemy attributes
enemy.speed = 400

player.movement = function() {};
enemy.pacing = function() {};

player.prototype = {
  deathPlay: function() {
    var CenterX = game.camera.view.x + (game.camera.width / 2);
    var CenterY = game.camera.view.y + (game.camera.height / 2);
    deathScreen = game.add.sprite(CenterX, CenterY, "blankBtn");
    deathScreen.anchor.x = 0.5; deathScreen.anchor.y = 0.5;
    deathScreen.scale.x = 25; deathScreen.scale.y = 15;
    deathText = game.add.text(CenterX, CenterY, "You have died!", {font: "45px Monospace"});
    deathText.anchor.x = 0.5; deathText.anchor.y = 0.5;
    returnToMenu = game.add.button(CenterX, CenterY + 100, "blankBtn", function() {
      sound.stop() // stop music so it doesn't overlap
      game.paused = false;
      player.health = player.max_health;
      player.difficulty = 1;
      player.mana = player.max_mana;
      player.weapons = [1];
      game.state.start('title');
    });
    returnToMenu.anchor.x = 0.5; returnToMenu.anchor.y = 0.5;
    returnToMenu.scale.x = 10; returnToMenu.scale.y = 3;
    deathText = game.add.text(CenterX, CenterY + 100, "To Main Menu", {font: "30px Monospace"});
    deathText.anchor.x = 0.5; deathText.anchor.y = 0.5;
    game.paused = true;
  },
}

player.movement.prototype = {
  displayWeaponInit: function() {
    scoreTime.weaponBack = game.add.sprite(game.camera.x + 825, game.camera.y + 20, 'blankBtn');
    scoreTime.weaponBack.scale.x = 10;
    scoreTime.weaponBack.scale.y = 4;
    scoreTime.weaponText = game.add.text(game.camera.x + 835, game.camera.y + 15, "Curr. Weapon", {font: "30px Monospace"});
    scoreTime.weaponText.anchor.x = 0.5;
    scoreTime.weaponText.anchor.y = 0.5;
    scoreTime.weaponBack.anchor.x = 0.5;
    scoreTime.weaponBack.anchor.y = 0.5;
    scoreTime.weaponText.fixedToCamera = true;
    scoreTime.weaponBack.fixedToCamera = true;

    // save weapon keys in an array
    scoreTime.weapons = ['weapon1', 'weapon2', 'weapon3']
    for (i = 0; i < scoreTime.weapons.length; i++) {
      scoreTime.weapons[i] = game.add.sprite(game.camera.x + 780, game.camera.y + 49, scoreTime.weapons[i])
      scoreTime.weapons[i].anchor.x = 0.5; scoreTime.weapons[i].anchor.y = 0.5;
      //scoreTime.weapons[i].fixedToCamera = true;
      scoreTime.weapons[i].visible = false;
      if (scoreTime.weapons[i].key == 'weapon1') {
        scoreTime.weapons[0].scale.x = 3;
        scoreTime.weapons[0].scale.y = 3;
        scoreTime.weapons[i].fixedToCamera = true;
      } else if (scoreTime.weapons[i].key == 'weapon2'){
        scoreTime.weapons[1].scale.x = 0.8;
        scoreTime.weapons[1].scale.y = 0.8;
        scoreTime.weapons[1].y += 7;
        scoreTime.weapons[i].fixedToCamera = true;
      }
      else{
        scoreTime.weapons[2].scale.x = 0.8;
        scoreTime.weapons[2].scale.y = 0.8;
        console.log(scoreTime.weapons[2].y);
        scoreTime.weapons[2].y += 20;
        scoreTime.weapons[i].fixedToCamera = true;
      }
    }

  },
  displayWeaponUpdate: function() {
    if (currentWeapon != null) {
      for (i = 0; i < scoreTime.weapons.length; i++) {
        if (currentWeapon.key == scoreTime.weapons[i].key) {
          scoreTime.weapons[i].visible = true;
        } else {
          scoreTime.weapons[i].visible = false;
        }
      }
    }
    setTimeout(() => player.movement.prototype.displayWeaponUpdate(), 100);
  },
  pickUpWeapon: function(weapon,num) {
    if (weaponholding != num && Math.abs(player_slime.x - weapon.x) <= 5 && Math.abs(player_slime.y - weapon.y) <= 50){
        weapon.x = -100;
        player.movement.prototype.addWeaponInv(num);
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
        //window.alert(player.weapons);
      }
    }
  },
  removeWeaponInv: function(){
     weaponholding = 1;
     currentWeapon = null;
     player.weapons = [1];    
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
      else if (weapon == 3) { 
        currentWeapon.visible = false;
        weaponholding = weapon;
        currentWeapon = weapon3;
        currentWeapon.visible = true;
      }
      return
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
    this.addKeyCallBack(Phaser.Keyboard.THREE, this.changeWeapon, 3);
  },
  healthInit: function(xX, yY, fixedBool) {
    healthBar = game.add.sprite(xX, yY, "healthBar");
    healthBar.scale.setTo(6, 1.5);
    healthBar.animations.add('move', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]);
    healthBar.fixedToCamera = fixedBool;
    var Localtext = game.add.text(xX + 20, yY + 10, "Health", {font: "30px Monospace"});
    Localtext.fixedToCamera = fixedBool;
  },
  manaInit: function(xX, yY, fixedBool) {
    manaBar = game.add.sprite(xX, yY, "manaBar");
    manaBar.scale.setTo(6, 1.5);
    manaBar.animations.add('move', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]);
    manaBar.fixedToCamera = fixedBool;
    var Localtext = game.add.text(xX + 20, yY + 10, "Mana", {font: "30px Monospace"});
    Localtext.fixedToCamera = fixedBool;
  },
  manaChange: function (mana) {
    player.mana += mana;
    var diff = Math.round(player.mana / player.max_mana * 13);
    //console.log("Player Mana: ", player.mana);
    manaBar.frame = (diff - 13) * -1;
  },
  manaRegen: function() {
    if (nextManaRegen < game.time.now && player.mana <= player.max_mana) {
      nextManaRegen = game.time.now + player.manaRegenRate;
      player.movement.prototype.manaChange(2)
    }
  },

  healthHit: function(playerS, enemy, damage = player.difficulty * 0.05) {
    //console.log("Player is hit");
    var direction = playerS.x - enemy.x // need to add knockback
    if (playerS !== "undefined") {
    player.health -= damage
    var diff = Math.round(player.health / player.max_health * 13);
    //console.log(diff)
    console.log("Player Health: ", player.health);
    healthBar.frame = (diff - 13) * -1;
    if (player.health < 1) {
      healthBar.frame = 13; // empty
      player.prototype.deathPlay();
    }
    }
  },
  move: function(input) {
    // listen for player falling
    if (player_slime.body.velocity.y > 0) {
      falling = true;
    }
    // weapon for the slime
    if (weaponholding == 1){
        if (game.time.now < (nextFire + 2000)) {
            weapon1.x = player_slime.x;
            weapon1.y = player_slime.y;
            weapon1.scale.setTo (player_slime.scale.x * 2.0, player_slime.scale.y * 2.0 )
        } else {
            weapon1.x = -100; weapon1.y = -100;
        }
    }
    else if (weaponholding == 2){
        if (game.time.now < (nextFire + 2000)) {
            weapon2.x = player_slime.x;
            weapon2.y = player_slime.y;
            weapon2.scale.setTo (player_slime.scale.x*0.6, player_slime.scale.y*0.6)
        } else {
            weapon2.x = -100; weapon2.y = -100;
        }
    }
    else if (weaponholding == 3){
        if (game.time.now < (nextFire + 2000)) {
            weapon3.x = player_slime.x;
            weapon3.y = player_slime.y;
            weapon3.scale.setTo (player_slime.scale.x*0.6, player_slime.scale.y*0.6)
        } else {
            weapon3.x = -100; weapon3.y = -100;
        }
    }

    // I think velocity feels better for x movement, than accel
    if (input.isDown(Phaser.Keyboard.LEFT)) {
      player_slime.body.velocity.x = -player.accel;
      player_slime.scale.setTo(-1.5, 1.5);
      player_slime.animations.play('walk', 6, true);
      nextIdle = game.time.now + idleTimer;
    } else if (input.isDown(Phaser.Keyboard.RIGHT)) {
      player_slime.body.velocity.x = player.accel;
      player_slime.scale.setTo(1.5,1.5);
      player_slime.animations.play('walk', 6, true);
      nextIdle = game.time.now + idleTimer;
    } else {
      player_slime.body.acceleration.x = 0;
      player_slime.body.velocity.x = 0;
      if (game.time.now > nextIdle) {
        player_slime.animations.play('idle', 3, true);
      } else {
      player_slime.frame = 2; // this is for animations to return to first frame
      }
    }
    if (input.isDown(Phaser.Keyboard.UP)) {
      //if (player_slime.body.velocity.y == 0) {
        nextIdle = game.time.now + idleTimer;
        player_slime.body.velocity.y = -player.jump_height;
        secondElapsed = game.time.now + 1000;
        hasJumped = true;
      //}
    }


  },
  attack: function(input) {
    if (player.mana > 0 && input.isDown(Phaser.Keyboard.F) && game.time.now > nextFire) {
      // Fire projectile in direction of slime
      if (vol_state == 1){
          laser.play();
      }
      if (weaponholding == 1){
      player.movement.prototype.manaChange(-2); // need to change based on weapon holding
          weapon1.x = player_slime.x;
          weapon1.y = player_slime.y;
      }
      else if (weaponholding == 2){
      player.movement.prototype.manaChange(-4); // need to change based on weapon holding
          weapon2.x = player_slime.x;
          weapon2.y = player_slime.y;
      }
      else if (weaponholding == 3){
      player.movement.prototype.manaChange(-5); // need to change based on weapon holding
          weapon3.x = player_slime.x;
          weapon3.y = player_slime.y;
      }
      nextIdle = game.time.now + idleTimer;
      var direction = player_slime.scale.x
      nextFire = game.time.now + player.fireRate[weaponholding];
      var bullet
        
      // change the bullet the character is holding
      if (weaponholding == 1){
        bullet = bullets.getFirstDead();
      }
      else if (weaponholding == 2){
        bullet = bullets2.getFirstDead();
      }
      else if (weaponholding == 3){
        bullet = bullets3.getFirstDead();
      }
      //bullet = bullets.getFirstDead();
      bullet.reset(player_slime.x, player_slime.y);
      bullet.rotation = game.physics.arcade.angleToXY(bullet, player_slime.x + (1000 * direction * 1) , player_slime.y)
      game.physics.arcade.moveToXY(bullet, player_slime.x + (direction * 1000 * 1), player_slime.y, 1000);
      bullet.animations.play('fire', 3, true);
    }
    // enemyGroup
    game.physics.arcade.overlap([bullets, bullets2, bullets3], enemyGroup, this.hitEnemy);
    game.physics.arcade.overlap([bullets, bullets2, bullets3], flyingGroup, this.hitEnemy);
    game.physics.arcade.overlap([bullets, bullets2, bullets3], stationaryGroup, this.hitEnemy);
    game.physics.arcade.overlap([bullets, bullets2, bullets3], enemyArtillery, this.hitBullet);
  },
  hitBullet: function(bullet, enemyBullet) {
    bullet.kill();
    // make healthbar above enemy
    if (enemyBullet.health == 1) {
       enemyBullet.bar = enemyFunc.prototype.healthInit(enemyBullet)
    }
    if (weaponholding == 1){
        var damage = 0.5;
    }
    else if (weaponholding == 2){
        var damage = 0.75;
    }
    else if (weaponholding == 3){
        var damage = 1;
    }
    enemyDead = enemyFunc.prototype.damaged(enemyBullet, damage); // if dead will disable body here and health bar
    enemyFunc.prototype.healthUpdate(enemyBullet) //update healthbar
    if (enemyDead) {
      enemyBullet.kill();
      enemyBullet.bar.kill();
    }
  },
  hitEnemy: function(bullet, enemy) {
    bullet.kill();
    // make healthbar above enemy
    if (enemy.health == 1) {
       enemy.bar = enemyFunc.prototype.healthInit(enemy)
    }
    if (weaponholding == 1){
        var damage = 0.25;
    }
    else if (weaponholding == 2){
        var damage = 0.5;
    }
    else if (weaponholding == 3){
        var damage = 0.6;
    }
    enemyDead = enemyFunc.prototype.damaged(enemy, damage); // if dead will disable body here and health bar
    enemyFunc.prototype.healthUpdate(enemy) //update healthbar
    if (enemyDead) {
        num = Math.trunc(Math.random() * 5) // 1 in 4 chance enemy drops an apple      

    if (num == 2) {
        enemyFunc.prototype.potionSpawn(enemy.x, enemy.y);
    }
    if (num == 1) {
        enemyFunc.prototype.appleSpawn(enemy.x, enemy.y);
    }
    enemy.body.enable = false //this was causing some weird bugs ???
    //shot += 1
    //console.log('enemy hit');
    //enemy.bar;
    enemy.animations.play('dead',4,true);
    setTimeout(() => enemy.bar.kill(), 2000);
    setTimeout(() => enemy.kill(), 2000);
    //setTimeout(() => enemy.body.enable = true, 2000); // have reenable body for when they respawn
    death.play();
      /*
    if (shot == numEnemies){
        portal_slime.animations.play('dooropen', 8, false);
        shot = 0;
        dooropen = true;
    }
    */
    }
  },
  hitPlatform: function() {
    // figure out how to play sound only on intial hit and nothing else
    if (falling) {
      //console.log("play hit plat sound");
      thud.play()
      falling = false;
    }
  },
  pickUpItem: function(slime, item) {
    player.health += 3;
    var diff = Math.round(player.health / player.max_health * 13);
    healthBar.frame = (diff - 13) * -1;
    item.kill();
      
  },
  pickUpPotion: function(slime, item) {
    player.movement.prototype.manaChange(3)
    item.kill()
  }
}
enemy.pacing.prototype = {
    pace: function(object) {
        if (object.body.velocity.x == 0) {
            enemy.speed *= -1;
            object.body.velocity.x = enemy.speed;
            object.animations.play('enemywalk', 8, true);
        }
    }
}

base_game = function() {};
base_game.prototype = {
  // Call base_game.prototype.physics(player_slime); to enable physics and collisions
  physics: function(player_ent) {
    game.physics.enable(player_ent);
    player_ent.body.collideWorldBounds = true;
    player_ent.body.gravity.y = player.gravity;
    player_ent.body.drag.x = player.drag;
    player_ent.anchor.x = 0.5;
    player_ent.anchor.y = 0.5
    player_ent.scale.setTo(1.5, 1.5);
    player_ent.animations.add('idle', [0, 1]);
    player_ent.animations.add('walk', [3, 4]);

    // Enable Volume Button
    volumeBtn = volume.toggle.prototype.mute(sound, 200, 90);
    settingBtn = game.add.button(-900, 20, 'slime-idle', function() {
      hud.funcs.prototype.toggle();
    });
    b1_tutorial = game.add.button(-1000, 20, 'exit', function() {
      //changeState('title');
      player.movement.prototype.removeWeaponInv();
      game.state.start("title");
      //hud.funcs.prototype.toggle();
    });
  },
  projectile: function() {
      bullets = game.add.group();
      bullets.enableBody = true;
      bullets.physicsBodyType = Phaser.Physics.ARCADE;
      
      bullets.createMultiple(50, 'projectile');
      bullets.setAll('scale.x', 1);
      bullets.setAll('scale.y', 1);
      bullets.setAll('checkWorldBounds', true);
      bullets.setAll('outOfBoundsKill', true);
      bullets.setAll('anchor.x', 0.5);
      bullets.setAll('anchor.y', 0.5);
      bullets.callAll('animations.add', 'animations', 'fire', [0, 1, 2, 3], 3, true);
      bullets.callAll('animations.play', 'animations', 'fire');

      // projectile 2
      bullets2 = game.add.group();
      bullets2.enableBody = true;
      bullets2.physicsBodyType = Phaser.Physics.ARCADE;
      bullets2.createMultiple(50,'projectile2');
      bullets2.setAll('scale.x', 0.5);
      bullets2.setAll('scale.y', 0.5);
      bullets2.setAll('checkWorldBounds', true);
      bullets2.setAll('outOfBoundsKill', true);
      bullets2.setAll('anchor.x', 0.5);
      bullets2.setAll('anchor.y', 0.5);
      bullets2.callAll('animations.add', 'animations', 'fire', [0, 1, 2, 3], 3, true);
      bullets2.callAll('animations.play', 'animations', 'fire');

      // projectile 3
      bullets3 = game.add.group();
      bullets3.enableBody = true;
      bullets3.physicsBodyType = Phaser.Physics.ARCADE;
      bullets3.createMultiple(50,'projectile3');
      bullets3.setAll('scale.x', 0.25);
      bullets3.setAll('scale.y', 0.25);
      bullets3.setAll('checkWorldBounds', true);
      bullets3.setAll('outOfBoundsKill', true);
      bullets3.setAll('anchor.x', 0.5);
      bullets3.setAll('anchor.y', 0.5);
      bullets3.callAll('animations.add', 'animations', 'fire', [0, 1, 2, 3], 3, true);
      bullets3.callAll('animations.play', 'animations', 'fire');

      enemyBullets = game.add.group();
      enemyBullets.enableBody = true;
      enemyBullets.physicsBodyType = Phaser.Physics.ARCADE;
      enemyBullets.createMultiple(50, 'enemy_projectile');
      enemyBullets.setAll('checkWorldBounds', true);
      enemyBullets.setAll('outOfBoundsKill', true);
      enemyBullets.setAll('anchor.x', 0.5);
      enemyBullets.setAll('anchor.y', 0.5);
      enemyBullets.setAll('scale.x', 0.5);
      enemyBullets.setAll('scale.y', 0.5);
      enemyBullets.callAll('animations.add', 'animations', 'enemy_fire', [0, 1, 2,3,4,5], 5, true);
      enemyBullets.callAll('animations.play', 'animations', 'enemy_fire');

      enemyArtillery = game.add.group();
      enemyArtillery.enableBody = true;
      enemyArtillery.physicsBodyType = Phaser.Physics.ARCADE;
      enemyArtillery.createMultiple(50, 'stationary_projectile'); // need a new projectile
      enemyArtillery.setAll('checkWorldBounds', true);
      enemyArtillery.setAll('outOfBoundsKill', true);
      enemyArtillery.setAll('anchor.x', 0.5);
      enemyArtillery.setAll('anchor.y', 0.5);
      enemyArtillery.setAll('scale.x', 1.5);
      enemyArtillery.setAll('scale.y', 1.5);
      enemyArtillery.callAll('animations.add', 'animations', 'enemy_fire', [0, 1, 2,3,4], 4, true);
      enemyArtillery.callAll('animations.play', 'animations', 'enemy_fire');

      // create a weapon sprite to move as needed
      weapon1 = game.add.sprite(-500, -100, 'weapon1');
      weapon1.scale.setTo(3);
      weapon1.anchor.x = 0.5;
      weapon1.anchor.y = 0.5;
      
      weapon2 = game.add.sprite(-1300, 920, 'weapon2');
      weapon2.anchor.x = 0.5;
      weapon2.anchor.y = 0.5;
      game.physics.enable(weapon2);
      
      if (game.state.current == 'state0'){
          weapon3 = game.add.sprite(-800, 920, 'weapon3');
          weapon3.anchor.x = 0.5;
          weapon3.anchor.y = 0.5;
          game.physics.enable(weapon3);
      }
      
      
      
      // add food
 //     apple = game.add.sprite(2400,880,'apple');
//      apple.scale.setTo(0.25);
  },
  platform_physics: function(platform){
      platformGroup = game.add.group();     
      platform.body.immovable = true;
      platformGroup.setAll('body.immovable', true)  
  },    
  enemy_physics: function(object) {
      game.physics.enable(object);
      player_ent.body.collideWorldBounds = true;
  },
  parallax : function(backgroundVar, foregroundVar) {
    // trying out background parallax stuff
    background = game.add.sprite(0, 0, backgroundVar);
    foreground = game.add.sprite(0, 0, foregroundVar);
    backgroundGroup = game.add.group()
    foregroundGroup = game.add.group()
    var width = game.world.width; var height = game.world.height;
    var currentX = background.width, currentY = background.height; // assuming back and foreground are same
    backgroundGroup.setAll('scale.setTo', width / background.width, height / background.height);
    foregroundGroup.setAll('scale.setTo', width / foreground.width, height / foreground.height);
    while (currentX < width) {
      backgroundGroup.create(currentX, 0, backgroundVar);
      foregroundGroup.create(currentX, 0, foregroundVar);
      currentX += background.width
    }
  },
  parallaxMove : function () {
    console.log(backgroundGroup.children.length);
  },
  gameSounds: function (sound) { //jump sound for now
    if (secondElapsed > game.time.now && hasJumped) {
      jumpSFX.play()
      onPlat = false; hasJumped = false;
    }
  },
  genPlatforms : function (worldX, worldY, worldType) {
    var numPlats = 20;
    platformGroup = game.add.group();
    platformGroup.setAll('body.immovable', true);
    // insert plaform creates here
    rockGroup = game.add.group();
    grassGroup = game.add.group();
    metalGroup = game.add.group();
    if (worldType == "0") {
      for (i = 0; i < worldX / 32; i++) {
        rockGroup.create(i * 32, worldY - 32, 'rock-ground');

      } rockGroup.setAll('anchor.y', 0.5);
      rockGroup.setAll('anchor.x', 0.5);
      rockGroup.setAll('scale.x', 2.5);
      rockGroup.setAll('scale.y', 2.5);
      var locations = [
        [0, 900], [500, 800], [960, 720], [1500, 800], [2000, 720], [2500, 640], [2750, 800], [3000, 640],
          [3500, 720], [4000, 800]
      ];
    }else if (worldType == "1"){
      for (i = 0; i < worldX / 32; i++) {
        grassGroup.create(i * 32, worldY - 32, 'background2_ground');

      } grassGroup.setAll('anchor.y', 0.5);
      grassGroup.setAll('anchor.x', 0.5);
      grassGroup.setAll('scale.x', 2.5);
      grassGroup.setAll('scale.y', 2.5);
      var locations = [
        [0, 900], [500, 800], [960, 720], [1000, 720], [1250, 800], [1500, 640], [2000, 640], [2250, 800], [2500, 720], [3000, 640],
          [3500, 560], [3750, 720], [4000, 800]
      ];
    }else if (worldType == "2"){
      for (i = 0; i < worldX / 32; i++) {
        metalGroup.create(i * 32, worldY - 32, 'background3_ground');

      } metalGroup.setAll('anchor.y', 0.5);
      metalGroup.setAll('anchor.x', 0.5);
      metalGroup.setAll('scale.x', 2.5);
      metalGroup.setAll('scale.y', 2.5);
      var locations = [
        [0, 900], [500, 800], [960, 720], [1400, 640], [2000, 850], [2500, 720], [3000, 640], [3500, 520], [4000, 520]
      ];
    } 
    else if (worldType == "tut"){
      for (i = 0; i < worldX / 32; i++) {
        rockGroup.create(i * 32, worldY - 32, 'rock-ground');
      }
      rockGroup.setAll('anchor.y', 0.5);
      rockGroup.setAll('anchor.x', 0.5);
      rockGroup.setAll('scale.x', 2.5);
      rockGroup.setAll('scale.y', 2.5);
      var locations = [
        [1700, 770], [1400, 840], [1950, 840],
      ];
    }

    for (i = 0; i < locations.length; i++) {
      platformGroup.create(locations[i][0], locations[i][1], 'platform');
    }
    base_game.prototype.randomPortal(locations)
    currentLocations = locations
  },
  randomPortal: function(locations) {
    randomIdx = Math.trunc(Math.random() * locations.length)
    //console.log(locations);
    var gameX = locations[randomIdx][0]+130; var gameY = locations[randomIdx][1]-80;

    portal_slime = game.add.sprite(gameX, gameY, "door");
    portal_slime.anchor.x = 0.5; portal_slime.anchor.y = 0.5;
    portal_slime.scale.setTo(1.5, 1.5);
    game.physics.enable(portal_slime);
    portal_slime.animations.add('dooropen',[1,2,3,4,5,6,7,8]);
  },
  randomWeapon: function(locations) {
    randomIdx = Math.trunc(Math.random() * locations.length)
    var gameX = locations[randomIdx][0]+70; var gameY = locations[randomIdx][1];

    randomInt = Math.trunc(Math.random() * 2 ) +2 ;
    console.log(randomInt);
    if (randomInt == 2) {
      weapon2.x = gameX; weapon2.y = gameY;
    }
    else if (randomInt == 3) {
      weapon3.x = gameX; weapon3.y = gameY;
    }
  }
}


enemyFunc = function () {};
enemyFunc.prototype = {
  healthInit : function(enemy) {
    Bar = game.add.sprite(enemy.x, enemy.y - 100, "healthBar");
    Bar.scale.setTo(4, .7);
    Bar.animations.add('move', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]);
    Bar.anchor.x = 0.5;
    Bar.anchor.y = 0.5;
    return Bar
  },
  healthUpdate: function(enemy) {
    //console.log(enemy.bar, enemy);
    if (enemy.alive) {
    enemy.bar.x = enemy.x;
    enemy.bar.y = enemy.y - 100;
    setTimeout(() => enemyFunc.prototype.healthUpdate(enemy), 50);
    var diff = Math.round(enemy.health / 1 * 13);
    enemy.bar.frame = (diff - 13) * -1;
    if (enemy.health <= 0) {
      enemy.bar.frame = 13; // empty
    }
    }
  },
  damaged: function(enemy, damage) {
    enemy.health -= damage;
    if (enemy.health <= 0){
      enemy.bar.frame = 13;
      return true
    } else {
      return false
    }

  },
  initialize: function(enemyType) { // make an enemy group to spawn from
    if (enemyType == 'flyingenemy'){
    flyingGroup = game.add.group();
    flyingGroup.createMultiple(50, enemyType);
    flyingGroup.setAll('name','flyingenemy');
    flyingGroup.setAll('anchor.y', 0.5);
    flyingGroup.setAll('anchor.x', 0.5);
    flyingGroup.setAll('scale.x', 1.25);
    flyingGroup.setAll('scale.y', 1.25);
    flyingGroup.callAll('animations.add', 'animations', 'enemywalk', [0, 1, 2, 3]);
    flyingGroup.callAll('animations.add', 'animations', 'dead', [4]);
    }
    
    else if (enemyType == 'enemy') {
    enemyGroup = game.add.group();
    enemyGroup.createMultiple(50, enemyType);
    enemyGroup.setAll('name','enemy');
    enemyGroup.setAll('anchor.y', 0.5);
    enemyGroup.setAll('anchor.x', 0.5);
    enemyGroup.setAll('scale.x', 1.25);
    enemyGroup.setAll('scale.y', 1.25);
    enemyGroup.callAll('animations.add', 'animations', 'enemywalk', [0, 1, 2, 3]);
    enemyGroup.callAll('animations.add', 'animations', 'dead', [4]);
    }
    else if (enemyType == 'stationary') {
    stationaryGroup = game.add.group();
    //stationaryGroup.createMultiple(50, enemyType);
    stationaryGroup.createMultiple(50, 'stationaryenemy');
    stationaryGroup.setAll('name','stationary');
    stationaryGroup.setAll('anchor.y', 0.5);
    stationaryGroup.setAll('anchor.x', 0.5);
    stationaryGroup.setAll('scale.x', 0.75);
    stationaryGroup.setAll('scale.y', 0.75);
    stationaryGroup.callAll('animations.add', 'animations', 'enemywalk', [0, 1, 2, 3]);
    stationaryGroup.callAll('animations.add', 'animations', 'dead', [4]);
    }

  },
  manualSpawn: function (xX, yY) {
    console.log("spawn enemy at X: %d, Y: %d", xX, yY);
    var enemyLocal;
    enemyLocal = enemyGroup.getFirstDead(true, xX, yY)
    game.physics.enable(enemyLocal);
    enemyLocal.body.collideWorldBounds = true;
    enemyLocal.body.gravity.y = player.gravity;
    enemyLocal.animations.play('enemywalk', 8, true);
    //return enemyLocal;

  },
  dynamicSpawn: function () {
    if (nextSpawn < game.time.now) {

      nextSpawn = game.time.now + (15000 * (player.difficulty * Math.random()));
      var numTypeEnemies = 3 // keeps track of how many types of enemies for dynamic spawn
      var enemyType = Math.trunc(Math.random() * numTypeEnemies);
      if (enemyType == 2) { // spawn stationary enemy
        var locations = currentLocations;
        randomIdx = Math.trunc(Math.random() * locations.length)
        var gameX = locations[randomIdx][0]+130; var gameY = locations[randomIdx][1]-75;
        enemyLocal = stationaryGroup.getFirstDead(true, gameX, gameY);
        game.physics.enable(enemyLocal);
        enemyLocal.body.immovable = true;
        console.log(enemyLocal);
        enemyLocal.body.collideWorldBounds = true;
        //enemyLocal.body.gravity.y = player.gravity;
        enemyLocal.animations.play('enemywalk', 8, true);
      }


      //console.log("nextSpawn", nextSpawn);
    // Difficulty manipulates spawn frequency //
    var xX = Math.random() * game.world.bounds.width;
    var yY = Math.random() * game.world.bounds.height;
    var fixedY = 500  // so flying enemies spawn in the air
    //console.log(xX, yY);
    var validXxLow = (player_slime.x - 1100); validXxHigh = (player_slime.x + 1100);
    var validyYLow = game.world.bounds.height - 90;
    //console.log(xX, validXxLow, validXxHigh);
      while (validXxLow < xX && validXxHigh > xX) {
        console.log("invalid spawn, rerolling...");
        xX = Math.random() * game.world.bounds.width;
      }
      while (validyYLow < yY) {
        console.log("invalid y coord, rerolling...");
        yY = Math.random() * game.world.bounds.height;
      }

    var enemyType = Math.trunc(Math.random() * numTypeEnemies);
    if (enemyType == 0) {
    var enemyLocal = enemyGroup.getFirstDead(true, xX, yY);
        game.physics.enable(enemyLocal);
        enemyLocal.body.collideWorldBounds = true;
        enemyLocal.body.gravity.y = player.gravity;
        enemyLocal.animations.play('enemywalk', 8, true);
    }else if (enemyType == 1){
      yRange = Math.random() * 800;
    var flyingLocal = flyingGroup.getFirstDead(true, xX, fixedY - yRange);
        game.physics.enable(flyingLocal);
        flyingLocal.body.collideWorldBounds = true;
        //console.log(flyingLocal.body.gravity);
        flyingLocal.body.gravity.y = 0;
        flyingLocal.animations.play('enemywalk', 8, true);
    }

    }

  },
  chase: function (enemyLocalGroup, speed, ychase) {  //ychase will be true or false
    if (enemyLocalGroup.children[0].name != "stationary") { // if not the stationary dude
    for (i = 0; i < enemyLocalGroup.length; i++) {
      if (enemyLocalGroup.children[i].alive) {
        var enemyLocal = enemyLocalGroup.children[i];
        var deltaX = enemyLocal.x - player_slime.x;
        var deltaY = enemyLocal.y - player_slime.y;
        var xdir = 0;
        var ydir = 0;
        //console.log("Enemy %d, %d, %d", i, deltaX, deltaY);
        if (deltaX > 0){ xdir = -130} else { xdir = 130};
        enemyLocal.body.velocity.x = xdir * speed;
        if (ychase == true) {
            if (deltaY < 0) {ydir = 35} else {ydir = -35}
            enemyLocal.body.velocity.y = ydir * speed
        }
      } else {
        break;
      }
    }
    setTimeout(() => enemyFunc.prototype.chase(enemyLocalGroup, speed, ychase), 500);
    }
  },
  longRangeFire: function() {
    //var closestEnemy = stationaryGroup.getClosestTo(player_slime);
    var closestEnemy = stationaryGroup.getFurthestFrom(player_slime);
    if (game.time.now > nextLongFire) {
       if (closestEnemy != null && closestEnemy.body.enable) {
      if (closestEnemy.x < player_slime.x) {
        direction = 1;
        //closestEnemy.setAll('scale.x', 1);
      }else{
        direction = -1;
        //closestEnemy.setAll('scale.x', -1);
      }
      nextLongFire = game.time.now + enemyLongFireRate;
      enemyBullet = enemyArtillery.getFirstDead();
      //game.debug.bodyInfo(enemyBullet);
      //game.debug.body(enemyBullet);
      enemyBullet.reset(closestEnemy.x, closestEnemy.y);
      enemyBullet.rotation = game.physics.arcade.angleToXY(enemyBullet, closestEnemy.x + (1000 * direction * 1) , closestEnemy.y)
    game.physics.arcade.moveToXY(enemyBullet, closestEnemy.x + (direction * 1000 * 1), closestEnemy.y, 250);
    enemyBullet.animations.play('enemy_fire', 3, true);
       }

    }
    game.physics.arcade.overlap(enemyArtillery, player_slime, this.hitPlayer);
  },
  attack: function () {
    //find closest enemy to player and give that one the weapon
    var closestEnemy = enemyGroup.getClosestTo(player_slime);

    var direction;
    var enemyBullet;

    //have enemy shoot towards player
    if (closestEnemy != null && closestEnemy.body.enable) {
    if (closestEnemy.x < player_slime.x) {
      direction = 1;
      //closestEnemy.setAll('scale.x', 1);
    }else{
      direction = -1;
      //closestEnemy.setAll('scale.x', -1);
    }
      if (game.time.now > enemyNextFire) {
    enemyNextFire = game.time.now + enemyFireRate;
    enemyBullet = enemyBullets.getFirstDead();
    enemyBullet.reset(closestEnemy.x, closestEnemy.y);
    enemyBullet.rotation = game.physics.arcade.angleToXY(enemyBullet, closestEnemy.x + (1000 * direction * 1) , closestEnemy.y)
    game.physics.arcade.moveToXY(enemyBullet, closestEnemy.x + (direction * 1000 * 1), closestEnemy.y, 250);
    enemyBullet.animations.play('enemy_fire', 3, true);
      }
    if (enemyBullet != null && enemyBullet.alive) {
    setTimeout(() => enemyBullet.kill(), 2000);
    }
    game.physics.arcade.overlap(enemyBullets, player_slime, this.hitPlayer);
    }
  },
  hitPlayer: function (playerSlime, bullet) {
    damage = bullet.scale.x
    player.movement.prototype.healthHit(player_slime, bullet, damage);
    bullet.kill()
    if (bullet.bar != null) {
      bullet.bar.kill()
    }
  },
  potionInit: function() {
      potions = game.add.group();
      potions.enableBody = true;
      potions.physicsBodyType = Phaser.Physics.ARCADE;
      potions.createMultiple(50, 'apple');
      potions.setAll('checkWorldBounds', true);
      potions.setAll('outOfBoundsKill', true);    
  },
  appleInit: function () {
    bullets.callAll('animations.add', 'animations', 'fire', [0, 1, 2, 3], 3, true);

    apples = game.add.group();
    apples.enableBody = true;
    apples.physicsBodyType = Phaser.Physics.ARCADE;
    apples.createMultiple(50, 'apple');
    apples.setAll('checkWorldBounds', true);
    apples.setAll('outOfBoundsKill', true);
  },
  appleSpawn: function(xX, yY) {
    var apple = apples.create(xX, yY-20, 'apple');
    apple.scale.x = 0.25;
    apple.scale.y = 0.25;
    apple.body.gravity.y = 50;
  },
  potionSpawn: function(xX, yY) {
    var potion = potions.create(xX, yY-20, 'apple');
    potion.scale.x = 0.25;
    potion.scale.y = 0.25;
    potion.body.gravity.y = 50;
  },

  appleBob: function(a) {
    //console.log(a.body);
    a.body.velocity.y = -20;

  },
  potionBob: function(b) {
    b.body.velocity.y = -20;
  },

}

scoreFunc = function() {};
scoreFunc.prototype = {
  start: function() {
    scoreTime.time = 0;

    //scoreTime.background1 = game.add.sprite(CenterX + (CenterX / 2) - 15, CenterY / 4 - 120, 'blankBtn');
    scoreTime.background1 = game.add.sprite(game.camera.x + (CenterX / 2) - 15, game.camera.y + 20, 'blankBtn');
    scoreTime.background1.scale.x = 16.5;
    scoreTime.background1.scale.y = 2;

    scoreTime.background2 = game.add.sprite(game.camera.x + (CenterX / 3)+175, game.camera.y + 20, 'blankBtn');
    scoreTime.background2.scale.x = 6.6;
    scoreTime.background2.scale.y = 2;

    scoreTime.background3 = game.add.sprite(game.camera.x + (CenterX - 730), game.camera.y + 20, 'blankBtn');
    scoreTime.background3.scale.x = 7.0;
    scoreTime.background3.scale.y = 2;


    scoreTime.level = game.add.text(game.camera.x + (CenterX/3) + 190, game.camera.y + 35, "Level: [" + level + "]", {font: "30px Monospace"});
    scoreTime.nextDoor = game.add.text(game.camera.x + (CenterX / 2) + 20, game.camera.y + 35, 'blankBtn', {font: "30px Monospace"});

    scoreTime.text = game.add.text(game.camera.x + (CenterX - 720), game.camera.y+35, "Score: [" + scoreTime.time + "]", {font: "30px Monospace"});

    //scoreTime.nextDoor = game.add.text(CenterX + (CenterX / 2), CenterY / 4 - 100, "Door: [" + nextDoor + "]", 
     // {font: "30px Monospace"});

    scoreTime.text.fixedToCamera = true;
    scoreTime.level.fixedToCamera = true;
    scoreTime.nextDoor.fixedToCamera = true;
    scoreTime.background1.fixedToCamera = true;
    scoreTime.background2.fixedToCamera = true;
    scoreTime.background3.fixedToCamera = true;
  },
  update: function() {
    scoreTime.time = Math.round((game.time.now - timeInTitle) / 1000);
    scoreTime.text.text = "Score: [" + scoreTime.time + "]";
    scoreTime.level.text = "Level: [" + level + "]";
    scoreTime.nextDoor.text = "Time until next Door: [" + nextDoor + "]";
    scoreFunc.prototype.nextDoorCheck()
  },
  nextDoorSet: function() {
    scoreFunc.prototype.update()
    if (dooropen) {
      dooropen = false;
    }
    nextDoor = Math.trunc(scoreTime.time + 25 + (scoreTime.time * 0.1))
    //console.log("Next Door set as: ", nextDoor);
  }, 
  nextDoorCheck: function() {
    if (scoreTime.time >= nextDoor && dooropen != true) {
      console.log("score is greater than requirement");
      dooropen = true;
      portal_slime.animations.play('dooropen', 8, false);
      if (game.state.current == 'state0'){
        scoreTime.alertText = game.add.text(CenterX, CenterY, "The Door has opened...", {font: "80px"});
      }
      else if (game.state.current == 'state1'){
        scoreTime.alertText = game.add.text(CenterX, CenterY, "The Door has opened... \n walk to the right to exit tutorial", {font: "80px"});
      }
      scoreTime.alertText.scale.x = 0.5; scoreTime.alertText.scale.y = 0.5;
      scoreTime.alertText.fixedToCamera = true;
      setTimeout(() => scoreTime.alertText.visible = false, 4000);

    }
  },
}

slime.state0 = function() {};
slime.state0.prototype = {
  preload: function() {
    game.load.spritesheet('manaBar', 'assets/spritesheet/manaBar.png', 32, 32);
    game.load.spritesheet('healthBar', 'assets/spritesheet/healthBar.png', 32, 32);
    game.load.spritesheet('door', 'assets/spritesheet/door.png', 128, 128);
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

    game.world.setBounds(0, 0, 5000, 3000); // important to be called early if not first
    CenterX = game.world.bounds.width / 2, CenterY = game.world.bounds.height / 2;
    var gameX = game.world.bounds.width; gameY = game.world.bounds.height;
    /* WORLD BUILDING HERE, BASED ON statesIdx */
    // 0 === first level
    // 1 === second level
    // 2 === third level
    // *****  NEED ART FOR LEVELS 2 AND THREE ****
    switch (statesIdx) {
      case 0:
        base_game.prototype.parallax('background', 'foreground'); break;
      case 1:
        base_game.prototype.parallax('background2', 'foreground2'); break;
      case 2:
        base_game.prototype.parallax('background3', 'foreground3'); break;
    }
      
    player.weapons = [1];
    weaponholding = 1;

    /* END WORLD BUILDING */
    if (weaponholding == null) { weaponholding = 1; var i;
      player.movement.prototype.changeWeapon(i, weaponholding);
    }
    player.movement.prototype.weaponChangeEventListener();
    
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
   // game.physics.arcade.gravity.y = 1700; 
    game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;

    player_slime = game.add.sprite(game.world.bounds.width / 2, game.height - (game.height / 4), "slime-new");
    player_slime.scale.setTo(0.7, 0.7);

    /*
    portal_slime = game.add.sprite(gameX - 500, 745, "door");
    portal_slime.scale.setTo(1.5, 1.5);
    game.physics.enable(portal_slime);
    portal_slime.animations.add('dooropen',[1,2,3,4,5,6,7,8]);
    //base_game.prototype.randomPortal(statesIdx)
//*/


    // add the platforms
    var platArray = base_game.prototype.genPlatforms(game.world.bounds.width, game.world.bounds.height, statesIdx)
  

    // add collide with the platforms
    game.physics.enable([player_slime, platformGroup, rockGroup]);
    game.physics.enable([player_slime, platformGroup, grassGroup]);
    game.physics.enable([player_slime, platformGroup, metalGroup]);
    player_slime.body.collideWorldBounds = true;
    platformGroup.setAll('body.immovable', true);
    rockGroup.setAll('body.immovable', true);
    grassGroup.setAll('body.immovable', true);
    metalGroup.setAll('body.immovable', true);

    // custom call, shortens work and declutters the code. 
    base_game.prototype.physics(player_slime);
    base_game.prototype.projectile();

    //camera
    game.camera.follow(player_slime);

    // enabling hud pass button objects in the array
    //hud.funcs.prototype.push([volumeBtn]);
    //hud.funcs.prototype.toggle() // toggle visibility off
    //hud.funcs.prototype.move(settingBtn, game.camera.x + 100, 30);
    //hud.funcs.prototype.move(volumeBtn, game.camera.x + 900, 50);

    player.movement.prototype.healthInit(250, 30, true) // enable healh bar
    player.movement.prototype.manaInit(450, 30, true) // enable healh bar

    //score time set the intial text location
    scoreFunc.prototype.start();
    scoreFunc.prototype.nextDoorSet();

    //set displayweapon on hud
    player.movement.prototype.displayWeaponInit()
    player.movement.prototype.displayWeaponUpdate()

    // enemy group init
    enemyFunc.prototype.initialize('enemy');
    enemyFunc.prototype.initialize('flyingenemy');
    enemyFunc.prototype.initialize('stationary');
    //enemyFunc.prototype.manualSpawn(500, 500);
    enemyFunc.prototype.chase(enemyGroup, enemySpeed, false); // Can change speed
    enemyFunc.prototype.chase(flyingGroup, enemySpeed, true)
    currentWeapon = 1

    if (weaponholding == null) { weaponholding = 1; var i;}
    player.movement.prototype.changeWeapon(i, weaponholding);

    player.movement.prototype.weaponChangeEventListener();

    enemyFunc.prototype.appleInit();
    enemyFunc.prototype.potionInit();
    enemyFunc.prototype.appleSpawn(CenterX, CenterY);
    enemyFunc.prototype.potionSpawn(CenterX + 100, CenterY);

    base_game.prototype.randomWeapon(currentLocations)

  },
  update: function() {
    game.physics.arcade.collide(player_slime, [platformGroup], player.movement.prototype.hitPlatform);
    game.physics.arcade.collide(player_slime, [rockGroup]);
    game.physics.arcade.collide(player_slime, [grassGroup]);
    game.physics.arcade.collide(player_slime, [metalGroup]);

    game.physics.arcade.collide(enemyGroup, [rockGroup,platformGroup]);
    game.physics.arcade.collide(enemyGroup, [grassGroup,platformGroup]);
    game.physics.arcade.collide(enemyGroup, [metalGroup,platformGroup]);

    game.physics.arcade.collide(stationaryGroup, [rockGroup,platformGroup]);
    game.physics.arcade.collide(stationaryGroup, [grassGroup,platformGroup]);
    game.physics.arcade.collide(stationaryGroup, [metalGroup,platformGroup]);

    game.physics.arcade.collide(player_slime, [enemyGroup, flyingGroup, stationaryGroup], player.movement.prototype.healthHit);

    //game.physics.arcade.collide(player_slime, [flyingGroup], player.movement.prototype.healthHit);
    //game.physics.arcade.collide(player_slime, enemyWeapon.bullets, player.movement.prototype.healthHit);
    game.physics.arcade.overlap(player_slime, [weapon2], player.movement.prototype.pickUpWeapon(weapon2,2));
    game.physics.arcade.overlap(player_slime, [weapon3], player.movement.prototype.pickUpWeapon(weapon3,3));
    game.physics.arcade.overlap(player_slime, apples, player.movement.prototype.pickUpItem);
    game.physics.arcade.overlap(player_slime, potions, player.movement.prototype.pickUpPotion);
    game.physics.arcade.collide(apples, [rockGroup, grassGroup, metalGroup, platformGroup], enemyFunc.prototype.appleBob);
    game.physics.arcade.collide(potions, [rockGroup, grassGroup, metalGroup, platformGroup], enemyFunc.prototype.potionBob);

    player.movement.prototype.move(game.input.keyboard);
    game.physics.arcade.overlap(player_slime, portal_slime, this.hitPortal);
    base_game.prototype.gameSounds();

    player.movement.prototype.attack(game.input.keyboard);
    player.movement.prototype.manaRegen();

    enemyFunc.prototype.chase(enemyGroup, enemySpeed, false); // Can change speed
    enemyFunc.prototype.chase(flyingGroup, enemySpeed, true)
    enemyFunc.prototype.dynamicSpawn();
    enemyFunc.prototype.attack();
    enemyFunc.prototype.longRangeFire();

    // keeps score up to date
    scoreFunc.prototype.update();
  },

  hitPortal: function() {
    console.log("hit portal");
    if (dooropen){
      switch (statesIdx) {
        case 0:
          changeStateReal(0, 1);
          break;
        case 1:
          changeStateReal(0, 2);
          break;
        case 2:
          changeStateReal(0, 0); break;
      }
    }
  },
}

function changeStateReal (stateNum, statesIndex) {
  statesIdx = statesIndex;
  level++;
  player.difficulty *= 0.70 // lowers when you change levels
  game.state.start("state" + stateNum);
  console.log(player.difficulty);
}

function playerHit(bullet) {
  bullet.kill()
}
