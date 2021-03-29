// State0 will be the titlescreen
let player_slime, jumpSFX;
var slime = {};
let bullets;
var manaBar;
var rockGroup;
var platformGroup, onPlat, hasJumped = true, secondElapsed;
var weapon1, weapon2, fireRate = 200, nextFire = 0, idleTimer = 10000, nextIdle = 0;
var weaponholding; // dictates weapon 1 or 2
var volumeBtn, settingBtn, healthBar;
var b1_tutorial;
var background, foreground, backgroundGroup, foregroundGroup;
let player = {}, falling, scoreTime = {};
let enemy = {};
var numEnemies = 2; // number of enemies until group problem is fixed
var enemyGroup, flyingGroup, nextSpawn = 0, enemySpeed = 1.0; //higher is faster
let base_game = {}; // will provide methods for quick creation of a new state
let platforms = {};
var dooropen = false;
//var shot = 0;
var healthCoolDown = 500; var nextManaRegen = 0;
var states = ['first', 'second', 'third']
var enemyFireRate = 1000; var enemyNextFire = 0;
var level = 0; var nextDoor;// first loop
//var shot = false; is the enemy shot?
// attempting slime movement to be handled more nicely
player.accel = 400
player.jump_height = 600;
player.gravity = 800;
player.drag = 100
player.fireRate = 200;
player.difficulty = 1; // Lower is more difficult
player.max_health = 10;
player.health = 10;
player.max_mana = 100;
player.mana = 100;
player.manaRegenRate = 5000;
player.knockback = 20; // velocity

// enemy attributes
enemy.speed = 400

player.movement = function() {};
enemy.pacing = function() {};

player.prototype = {
  deathPlay: function() {
    var CenterX = game.camera.view.x + (game.camera.width / 2);
    deathScreen = game.add.sprite(CenterX, CenterY, "blankBtn");
    deathScreen.anchor.x = 0.5; deathScreen.anchor.y = 0.5;
    deathScreen.scale.x = 25; deathScreen.scale.y = 15;
    deathText = game.add.text(CenterX, CenterY, "You have died!", {font: "45px Monospace"});
    deathText.anchor.x = 0.5; deathText.anchor.y = 0.5;
    returnToMenu = game.add.button(CenterX, CenterY + 100, "blankBtn", function() {
      game.paused = false;
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
  healthInit: function(xX, yY, fixedBool) {
    healthBar = game.add.sprite(xX, yY, "healthBar");
    healthBar.scale.setTo(6, 1.5);
    healthBar.animations.add('move', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]);
    healthBar.fixedToCamera = fixedBool;
  },
  manaInit: function(xX, yY, fixedBool) {
    manaBar = game.add.sprite(xX, yY, "manaBar");
    manaBar.scale.setTo(6, 1.5);
    manaBar.animations.add('move', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]);
    manaBar.fixedToCamera = fixedBool;
  },
  manaChange: function (mana) {
    player.mana += mana;
    var diff = Math.round(player.mana / player.max_mana * 13);
    //console.log("Player Mana: ", player.mana);
    manaBar.frame = (diff - 13) * -1;
  },
  manaRegen: function() {
    if (nextManaRegen < game.time.now) {
      nextManaRegen = game.time.now + player.manaRegenRate;
      player.movement.prototype.manaChange(5)
    }
  },

  healthHit: function(playerS, enemy, damage = player.difficulty * 0.05) {
    //console.log(enemy);
    var direction = playerS.x - enemy.x // need to add knockback
    if (playerS !== "undefined") {
    player.health -= damage
    var diff = Math.round(player.health / player.max_health * 13);
    //console.log(diff)
    //console.log("Player Health: ", player.health);
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
      if (player_slime.body.velocity.y == 0) {
        nextIdle = game.time.now + idleTimer;
        player_slime.body.velocity.y = -player.jump_height;
        secondElapsed = game.time.now + 1000;
        hasJumped = true;
      }
    }

    if (Math.abs(player_slime.x - weapon2.x) <= 5 && Math.abs(player_slime.y - weapon2.y) <= 50){
        weaponholding = 2;
    }

    if (Math.abs(player_slime.x - apple.x) <= 5 && Math.abs(player_slime.y - apple.y) <= 50){
        player.health += 3;
        var diff = Math.round(player.health / player.max_health * 13);
        //console.log(diff)
        //console.log(player.health);
        healthBar.frame = (diff - 13) * -1;
        apple.kill();
    }
  },
  attack: function(input) {
    if (input.isDown(Phaser.Keyboard.F) && game.time.now > nextFire) {
      // Fire projectile in direction of slime
      player.movement.prototype.manaChange(-2); // need to change based on weapon holding
      if (vol_state == 1){
          laser.play();
      }
      if (weaponholding == 1){
          weapon1.x = player_slime.x;
          weapon1.y = player_slime.y;
      }
      else if (weaponholding == 2){
          weapon2.x = player_slime.x;
          weapon2.y = player_slime.y;
      }
      nextIdle = game.time.now + idleTimer;
      var direction = player_slime.scale.x
      nextFire = game.time.now + player.fireRate;
      var bullet;
      bullet = bullets.getFirstDead();
      bullet.reset(player_slime.x, player_slime.y);
      bullet.rotation = game.physics.arcade.angleToXY(bullet, player_slime.x + (1000 * direction * 1) , player_slime.y)
      game.physics.arcade.moveToXY(bullet, player_slime.x + (direction * 1000 * 1), player_slime.y, 1000);
      bullet.animations.play('fire', 3, true);
    }
    // enemyGroup
    game.physics.arcade.overlap(bullets, enemyGroup, this.hitEnemy);
    game.physics.arcade.overlap(bullets, flyingGroup, this.hitEnemy);
  },
  hitEnemy: function(bullet, enemy) {
    console.log(enemy)
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
    enemyDead = enemyFunc.prototype.damaged(enemy, damage); // if dead will disable body here and health bar
    enemyFunc.prototype.healthUpdate(enemy) //update healthbar
    if (enemyDead) {
    enemy.body.enable = false //this was causing some weird bugs ???
    //shot += 1
    console.log('enemy hit');
    enemy.animations.play('dead',4,true);
    setTimeout(() => enemy.bar.kill(), 2000);
    setTimeout(() => enemy.kill(), 2000);
    setTimeout(() => enemy.body.enable = true, 2000); // have reenable body for when they respawn
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
      console.log("play hit plat sound");
      thud.play()
      falling = false;
    }
  },
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
      game.state.start("title");
      //hud.funcs.prototype.toggle();
    });
  },
  projectile: function() {
      bullets = game.add.group();
      bullets.enableBody = true;
      bullets.physicsBodyType = Phaser.Physics.ARCADE;
      bullets.createMultiple(50, 'projectile');
      bullets.setAll('checkWorldBounds', true);
      bullets.setAll('outOfBoundsKill', true);
      bullets.setAll('anchor.y', 0.5);
      bullets.setAll('scale.x', 1);
      bullets.setAll('scale.y', 1);
      bullets.callAll('animations.add', 'animations', 'fire', [0, 1, 2, 3], 3, true);
      bullets.callAll('animations.play', 'animations', 'fire');

      enemyBullets = game.add.group();
      enemyBullets.enableBody = true;
      enemyBullets.physicsBodyType = Phaser.Physics.ARCADE;
      enemyBullets.createMultiple(50, 'projectile');
      enemyBullets.setAll('checkWorldBounds', true);
      enemyBullets.setAll('outOfBoundsKill', true);
      enemyBullets.setAll('anchor.y', 0.5);
      enemyBullets.setAll('scale.x', 1);
      enemyBullets.setAll('scale.y', 1);
      enemyBullets.callAll('animations.add', 'animations', 'fire', [0, 1, 2, 3], 3, true);
      enemyBullets.callAll('animations.play', 'animations', 'fire');
      // create a weapon sprite to move as needed
      weapon1 = game.add.sprite(500, -100, 'weapon1');
      weapon1.scale.setTo(3);
      weapon1.anchor.x = 0.5;
      weapon1.anchor.y = 0.5;
      
      weapon2 = game.add.sprite(1300, 920, 'weapon2');
      weapon2.anchor.x = 0.5;
      weapon2.anchor.y = 0.5;
      
      // add food
      apple = game.add.sprite(2400,880,'apple');
      apple.scale.setTo(0.25);
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
    if (worldType == "0") {
      for (i = 0; i < worldX / 32; i++) {
        rockGroup.create(i * 32, worldY - 32, 'rock-ground');

      } rockGroup.setAll('anchor.y', 0.5);
      rockGroup.setAll('anchor.x', 0.5);
      rockGroup.setAll('scale.x', 2.5);
      rockGroup.setAll('scale.y', 2.5);
      var locations = [
        [0, 900], [500, 800], [960, 720],
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
  }

  },

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
    enemy.bar.x = enemy.x;
    enemy.bar.y = enemy.y - 100;
    setTimeout(() => enemyFunc.prototype.healthUpdate(enemy), 50);
    var diff = Math.round(enemy.health / 1 * 13);
    enemy.bar.frame = (diff - 13) * -1;
    if (enemy.health < 0) {
      healthBar.frame = 13; // empty
    }
  },
  damaged: function(enemy, damage) {
    enemy.health -= damage;
    if (enemy.health <= 0){
      return true
    } else {
      return false
    }

  },
  initialize: function(enemyType) { // make an enemy group to spawn from
    flyingGroup = game.add.group();
    flyingGroup.createMultiple(50, enemyType);
    flyingGroup.setAll('anchor.y', 0.5);
    flyingGroup.setAll('anchor.x', 0.5);
    flyingGroup.setAll('scale.x', 1.25);
    flyingGroup.setAll('scale.y', 1.25);
    flyingGroup.callAll('animations.add', 'animations', 'enemywalk', [0, 1, 2, 3]);
    flyingGroup.callAll('animations.add', 'animations', 'dead', [4]);
    
    enemyGroup = game.add.group();
    enemyGroup.createMultiple(50, enemyType);
    enemyGroup.setAll('anchor.y', 0.5);
    enemyGroup.setAll('anchor.x', 0.5);
    enemyGroup.setAll('scale.x', 1.25);
    enemyGroup.setAll('scale.y', 1.25);
    enemyGroup.callAll('animations.add', 'animations', 'enemywalk', [0, 1, 2, 3]);
    enemyGroup.callAll('animations.add', 'animations', 'dead', [4]);

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
      nextSpawn = game.time.now + (20000 * (player.difficulty * Math.random()));
      //console.log("nextSpawn", nextSpawn);
    // Difficulty manipulates spawn frequency //
    var xX = Math.random() * game.world.bounds.width;
    var yY = Math.random() * game.world.bounds.height;
    var fixedY = 500  // so flying enemies spawn in the air
    var numTypeEnemies = 2 // keeps track of how many types of enemies for dynamic spawn
    //console.log(xX, yY);
    if ((xX - player_slime.x) < 300) {
      xX += 300;
    }
    var enemyType = Math.trunc(Math.random() * numTypeEnemies);
    if (enemyType == 0) {
    var enemyLocal = enemyGroup.getFirstDead(true, xX, yY);
        game.physics.enable(enemyLocal);
        enemyLocal.body.collideWorldBounds = true;
        enemyLocal.body.gravity.y = player.gravity;
        enemyLocal.animations.play('enemywalk', 8, true);       
    }else if (enemyType == 1){
    var flyingLocal = flyingGroup.getFirstDead(true, xX, fixedY);
        game.physics.enable(flyingLocal);
        flyingLocal.body.collideWorldBounds = true;
        console.log(flyingLocal.body.gravity);
        flyingLocal.body.gravity.y = 0;
        flyingLocal.animations.play('enemywalk', 8, true);
    }

    }

  },
  chase: function (enemyLocalGroup, speed, ychase) {  //ychase will be true or false
    for (i = 0; i < enemyLocalGroup.length; i++) {
      if (enemyLocalGroup.children[i].alive) {
        var enemyLocal = enemyLocalGroup.children[i];
        var deltaX = enemyLocal.x - player_slime.x;
        var deltaY = enemyLocal.y - player_slime.y;
        var xdir = 0;
        var ydir = 0;
        //console.log("Enemy %d, %d, %d", i, deltaX, deltaY);
        if (deltaX > 0) { xdir = -100} else { xdir = 100};
        enemyLocal.body.velocity.x = xdir * speed;
        
        if (ychase == true) {
            if (deltaY < 0) {ydir = 100} else {ydir = -100}
            enemyLocal.body.velocity.y = ydir * speed
        }
      } else {
        break;
      }
    }
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
    }else{
      direction = -1;
    }
      if (game.time.now > enemyNextFire) {
    enemyNextFire = game.time.now + enemyFireRate;
    enemyBullet = enemyBullets.getFirstDead();
    enemyBullet.reset(closestEnemy.x, closestEnemy.y);
    enemyBullet.rotation = game.physics.arcade.angleToXY(enemyBullet, closestEnemy.x + (1000 * direction * 1) , closestEnemy.y)
    game.physics.arcade.moveToXY(enemyBullet, closestEnemy.x + (direction * 1000 * 1), closestEnemy.y, 250);
    enemyBullet.animations.play('fire', 3, true);
      }
    if (enemyBullet != null && enemyBullet.alive) {
    setTimeout(() => enemyBullet.kill(), 2000);
    }
    game.physics.arcade.overlap(enemyBullets, player_slime, this.hitPlayer);
    }
  },
  hitPlayer: function (playerSlime, bullet) {
    player.movement.prototype.healthHit(player_slime, bullet, 1);
    bullet.kill()
  }
}

scoreFunc = function() {};
scoreFunc.prototype = {
  start: function() {
    scoreTime.time = 0;

    scoreTime.background1 = game.add.sprite(CenterX + (CenterX / 2) - 15, CenterY / 4 - 20, 'blankBtn');
    scoreTime.background1.scale.x = 6.6;
    scoreTime.background1.scale.y = 2;

    scoreTime.background2 = game.add.sprite(CenterX - 15, CenterY / 4 - 20, 'blankBtn');
    scoreTime.background2.scale.x = 6.6;
    scoreTime.background2.scale.y = 2;

    scoreTime.background3 = game.add.sprite(CenterX + (CenterX / 4) - 15, CenterY / 4 - 20, 'blankBtn');
    scoreTime.background3.scale.x = 6.6;
    scoreTime.background3.scale.y = 2;


    scoreTime.level = game.add.text(CenterX + (CenterX / 2), CenterY / 4, "Level: [" + level + "]", {font: "30px Monospace"});

    scoreTime.text = game.add.text(CenterX, CenterY / 4, "Score: [" + scoreTime.time + "]", {font: "30px Monospace"});

    scoreTime.nextDoor = game.add.text(CenterX + (CenterX / 4), CenterY / 4, "Door: [" + nextDoor + "]", 
      {font: "30px Monospace"});

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
    scoreTime.nextDoor.text = "Door: [" + nextDoor + "]";
    scoreFunc.prototype.nextDoorCheck()
  },
  nextDoorSet: function() {
    scoreFunc.prototype.update()
    if (dooropen) {
      dooropen = false;
    }
    nextDoor = scoreTime.time + 25
    console.log("Next Door set as: ", nextDoor);
  }, 
  nextDoorCheck: function() {
    if (scoreTime.time >= nextDoor && dooropen != true) {
      console.log("score is greater than requirement");
      dooropen = true;
      portal_slime.animations.play('dooropen', 8, false);
      scoreTime.alertText = game.add.text(CenterX, CenterY, "The Door has opened...", {font: "80px"});
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
    game.load.spritesheet('projectile', 'assets/spritesheet/projectile.png', 64, 64);
    game.load.image('weapon1', 'assets/sprites/basic-weapon.png');
    game.load.image('weapon2', 'assets/sprites/laser_gun.png');
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
    game.load.audio('laser','assets/sounds/laser.wav');
    game.load.audio('jump', 'assets/sounds/jump-sfx.mp3');
    game.load.audio('enemy_death','assets/sounds/enemy_dies.m4a');
    game.load.audio('playerLand', 'assets/sounds/thud.wav');

  },

  create: function() {

    game.world.setBounds(0, 0, 5000, 1000); // important to be called early if not first
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

    /* END WORLD BUILDING */
    weaponholding = 1;

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

    player_slime = game.add.sprite(game.world.bounds.width / 2, game.height - (game.height / 4), "slime-new");
    player_slime.scale.setTo(0.7, 0.7);

    portal_slime = game.add.sprite(gameX - 500, 745, "door");
    portal_slime.scale.setTo(1.5, 1.5);
    game.physics.enable(portal_slime);

    portal_slime.animations.add('dooropen',[1,2,3,4,5,6,7,8]);

    // add the platforms
    base_game.prototype.genPlatforms(game.world.bounds.width, game.world.bounds.height, 0)

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
    hud.funcs.prototype.move(settingBtn, game.camera.x + 100, 30);
    hud.funcs.prototype.move(volumeBtn, game.camera.x + 900, 50);

    player.movement.prototype.healthInit(250, 30, true) // enable healh bar
    player.movement.prototype.manaInit(450, 30, true) // enable healh bar

    //score time set the intial text location
    scoreFunc.prototype.start();
    scoreFunc.prototype.nextDoorSet();

    // enemy group init
    enemyFunc.prototype.initialize('enemy');
    //enemyFunc.prototype.manualSpawn(500, 500);

  },
  update: function() {
    game.physics.arcade.collide(player_slime, [platformGroup], player.movement.prototype.hitPlatform);
    game.physics.arcade.collide(player_slime, [rockGroup]);
    game.physics.arcade.collide(enemyGroup, [rockGroup,platformGroup]);
    game.physics.arcade.collide(player_slime, [enemyGroup], player.movement.prototype.healthHit);
    game.physics.arcade.collide(player_slime, [flyingGroup], player.movement.prototype.healthHit);
    //game.physics.arcade.collide(player_slime, enemyWeapon.bullets, player.movement.prototype.healthHit);


    player.movement.prototype.move(game.input.keyboard);
    game.physics.arcade.overlap(player_slime, portal_slime, this.hitPortal);
    base_game.prototype.gameSounds();

    player.movement.prototype.attack(game.input.keyboard);
    player.movement.prototype.manaRegen();

    enemyFunc.prototype.chase(enemyGroup, enemySpeed, false); // Can change speed
    enemyFunc.prototype.chase(flyingGroup, enemySpeed, true)
    enemyFunc.prototype.dynamicSpawn();
    enemyFunc.prototype.attack();

    // keeps score up to date
    scoreFunc.prototype.update();
  },

  hitPortal: function() {
    console.log("hit portal");
    if (dooropen){
      switch (statesIdx) {
        case 0:
          changeStateReal(0, 1); break;
        case 1:
          changeStateReal(0, 2); break;
        case 2:
          changeStateReal(0, 0); break;
      }
    }
  },
}

function changeStateReal (stateNum, statesIndex) {
  statesIdx = statesIndex;
  level++;
  game.state.start("state" + stateNum);
}

function playerHit(bullet) {
  bullet.kill()
}
