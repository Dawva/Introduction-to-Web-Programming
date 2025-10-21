let cursors;
let platforms;
let score = 0;
let scoreText;

var config = {
    type: Phaser.AUTO,
    width: 1600,
    height: 600,
    physics: {
        default: "arcade",
        arcade: {
            gravity: { y: 300 }
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var game = new Phaser.Game(config);

function preload () {
    this.load.image("sky", "assets/sky.png")
    this.load.image("bomb", "assets/bomb.png")
    this.load.image("platform", "assets/platform.png")
    this.load.image("star", "assets/star.png")
    this.load.image("ground", "assets/ground.png")
    this.load.spritesheet('bird', 'assets/bird.png', { frameWidth: 803, frameHeight: 768 });
}



function create ()
{


   this.add.image(800, 600, 'sky').setScale(2)
    this.platforms = this.physics.add.staticGroup();
    for (let i = 0; i < 20; i++) {
        this.platforms.create(Phaser.Math.Between(0, game.config.width), Phaser.Math.Between(0, game.config.height), "platform").setScale(0.4).refreshBody()
    }
    this.platforms.create(0, 600, "ground").setScale(3).refreshBody()
    this.platforms.create(350, 600, "ground").setScale(3).refreshBody()
    this.platforms.create(700, 600, "ground").setScale(3).refreshBody()
    this.platforms.create(1050, 600, "ground").setScale(3).refreshBody()
    this.platforms.create(1430, 600, "ground").setScale(3).refreshBody()
    player = this.physics.add.sprite(400, 300, "bird")
    player.setScale(0.08)
    // player.setCollideWorldBounds(true);
    player.body.setGravityY(1)
    this.player = player;

    this.anims.create({ 
        key: "fly",
        frames: this.anims.generateFrameNumbers('bird', {start: 0, end: 7}),
        frameRate: 15,
        repeat: -1,
        yoyo: true
    })
  


    this.anims.create({ 
        key: "still",
        frames: [{ key: "bird", frame: 7}],
        frameRate: 8,
        repeat: -1
    })
    player.play("fly")
    this.physics.add.collider(player, this.platforms)
    cursors = this.input.keyboard.createCursorKeys()

    

    this.stars = this.physics.add.group({
        key: 'star',
        repeat: 4,
        setXY: { x: 12, y: 0, stepX: 360},
        gravity: 0
    })
    this.physics.add.collider(this.stars, this.platforms)



    this.physics.add.overlap(player, this.stars, collectStar, null, this)
    scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '16px', fill: '#000' })
    bombs = this.physics.add.group()
    powerup = this.physics.add.group()
    powerupbirds = this.physics.add.group()


    

    function collectStar(player, star) {
        star.disableBody(true, true);
        score += 10;
        scoreText.setText(`Score: ` + score)
        if (this.stars.countActive(true) === 0){
            this.stars.children.iterate(function (child) {
                child.enableBody(true, child.x, 0, true, true)
            });

            if (Phaser.Math.Between(1,3) === 1){
                const powerStar = powerup.create(Phaser.Math.Between(0, game.config.width), 0, "star");
                powerStar.setTintFill(0xff0000);   
                powerStar.setBounce(1);
                powerStar.setVelocityY(50);
                powerStar.setCollideWorldBounds(true);
                this.physics.add.collider(powerup, this.platforms);
            }
        

            var x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400)
            var bomb = bombs.create(x, 16, `bomb`)
            bomb.setBounce(1)
            bomb.setCollideWorldBounds(true);
            this.physics.add.collider(bombs, this.platforms);
            bomb.setVelocity(Phaser.Math.Between(-200, 200), 20)

            this.platforms.clear(true, true);

   

            for (let i = 0; i < 20; i++) {
                this.platforms.create(Phaser.Math.Between(0, game.config.width), Phaser.Math.Between(0, game.config.height), "platform").setScale(0.4).refreshBody()
            }
            this.platforms.create(0, 600, "ground").setScale(3).refreshBody()
            this.platforms.create(350, 600, "ground").setScale(3).refreshBody()
            this.platforms.create(700, 600, "ground").setScale(3).refreshBody()
            this.platforms.create(1050, 600, "ground").setScale(3).refreshBody()
            this.platforms.create(1430, 600, "ground").setScale(3).refreshBody()
        }
        this.physics.add.overlap(player, powerup, collectPowerup, null, this);
   
    }
    function collectPowerup(player, powerStar) {
        powerStar.disableBody(true, true)
        const powerupbird = powerupbirds.create(this.player.x, this.player.y, 'bird');
        powerupbird.setTint(0x8a2be2)
        powerupbird.setScale(0.08).refreshBody()
        powerupbird.setBounce(1)
        powerupbird.setCollideWorldBounds(true)
        powerupbird.setVelocity(50, -200)
        powerupbird.anims.play("fly", true);
        this.physics.add.collider(powerupbird, this.platforms)
        this.physics.add.overlap(powerupbird, bombs, destroyBomb, null, this)

        }
    function destroyBomb(powerupbird, bomb) {
            bomb.disableBody(true, true);
            powerupbird.disableBody(true, true)
            score += 30;
            scoreText.setText(`Score: ` + score)
    }


    bombs = this.physics.add.group()
    this.physics.add.collider(bombs, platforms);

    this.physics.add.collider(player, bombs, hitBomb, null, this)

    function hitBomb(player, bomb){
        this.physics.pause();
        player.setTint(0xff0000)
        player.anims.play('still')
        gameOver = true;

        this.triggerTimer = this.time.addEvent({
            callback: () => {
                score = 0;
                this.scene.restart()
            },
            callbackScope: this,
            delay: 3000,

        })

    }

    }
    

function update ()
{    

    
    if (cursors.left.isDown){
        player.setVelocityX(-250)
        player.setFlipX(true)
        player.anims.play("fly", true)

    }
    else if (cursors.right.isDown){
        player.setVelocityX(250)
        player.setFlipX(false)
        player.anims.play("fly", true)


    }
    else {
        player.setVelocityX(0)
    }



    if (cursors.up.isDown) {
        player.setVelocityY(-200)
        player.anims.play("fly", true)
    }
    if (cursors.down.isDown) {
        player.setVelocityY(400)
    }

}

