var CenterX = 2000 / 2, CenterY = 1000 / 2;
var b1, sound;
var vol_state = 1;
let volume = {}, soundsArray = [];
var timeInTitle = 0;

// define all HUD elements below here
let hud = {};
var volBtn;

volume.toggle = function() {};
      volume.toggle.prototype = {
      mute: function (sound, xX, yY) {
      volBtn = game.add.button(xX, yY, 'volume', function() {
      if ( vol_state == 1) {
        for (i = 0; i < soundsArray.length; i++) {
          soundsArray[i].volume = 0;
        }
        sound.volume = 0;
        vol_state = 0;
        volBtn.frame = 1;
      } else {
        for (i = 0; i < soundsArray.length; i++) {
          soundsArray[i].volume = 1;
          if (soundsArray[i].name == "jump") {
            soundsArray[i].volume = 0.1;
          }
        }
        sound.volume = 1;
        vol_state = 1;
        volBtn.frame = 0;
      }
    });
    volBtn.scale.setTo(3);
    volBtn.anchor.x = 0.5;
    volBtn.anchor.y = 0.5;
    volBtn.animations.add('mute', [0, 1]);
    return volBtn
      },
    move: function(button) {
      button.x = game.camera.x + 1900
      button.y = 100
      button.fixedToCamera = true;
    },
      }
hud.funcs = function() {};
  hud.objects = [];
  hud.funcs.prototype = {
    push: function(strArray) {
      for (i = 0; i < strArray.length; i++) {
        hud.objects.push(strArray[i]);
        strArray[i].anchor.x = 0.5;
        strArray[i].anchor.y = 0.5;
      }
    },
    toggle: function () {
      for (i = 0; i < hud.objects.length; i++) {
      if (hud.objects[i].visible) {
        hud.objects[i].visible = false
      } else {
        hud.objects[i].visible = true
      }
      }
    },
    move: function (settingBtn, x, y) {
        settingBtn.x = x; settingBtn.y = y;
        settingBtn.fixedToCamera = true;
    },
  }
slime.title = function() {};
slime.title.prototype = {
  preload: function() {
    game.load.image('startBtn', 'assets/sprites/start_button.jpg');
    game.load.image('startBtn', 'assets/sprites/tutorial_button.jpg');
    game.load.image('blankBtn', 'assets/sprites/blankBtn.png');
    //game.load.audio('op-music', 'assets/audio/op.mp3');
    game.load.spritesheet('volume', 'assets/spritesheet/volume.png', 32, 32);
    game.load.audio('op-music','assets/sounds/song.wav');

  },
  create: function() {
    game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    game.stage.backgroundColor = "#ff00ff";
    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.world.setBounds(0, 0, 600, 800);
    sound = game.add.audio('op-music');
    sound.autoplay = true;
    sound.loop = true;
    sound.play();

    b1 = game.add.button(CenterX, CenterY, 'blankBtn', function() {
      timeInTitle = game.time.now;
      changeState(0);
    });
    b1.anchor.setTo(0.5, 0.5);
    b1Text = game.add.text(CenterX, CenterY, "[" + "Start Game" + "]", {font: "40px Monospace"});
    b1Text.anchor.setTo(0.5, 0.5);
    b1.scale.x = 12;
    b1.scale.y = 3;

    b2 = game.add.button(CenterX, CenterY + 150, 'blankBtn', function() {
      changeState(1) // tutorial state
    });
    b2Text = game.add.text(CenterX, CenterY + 150, "[" + "Tutorial" + "]", {font: "40px Monospace"});
    b2Text.anchor.setTo(0.5, 0.5);
    b2.anchor.setTo(0.5, 0.5);
    b2.scale.x = 12;
    b2.scale.y = 3;
    console.log(b2);

    volume.toggle.prototype.mute(sound, 1500, 880);

    hud.funcs.prototype.push([volBtn]);
    hud.funcs.prototype.toggle();
  },
  update: function() {
  },
}

function changeState (stateNum) {
  game.state.start('state' + stateNum);
};
