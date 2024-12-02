import { Scene, GameObjects } from 'phaser';
let ENEMY_SPEED = 1000;

export class Boss1Scene extends Scene
{
    camera: Phaser.Cameras.Scene2D.Camera;
    background: Phaser.GameObjects.Image;
    msg_text : Phaser.GameObjects.Text;
    ship: any; 
    lazer: any;
    cursors: any;
    bullet: Phaser.Physics.Arcade.Group;
    bulletSpeed: number = 400;
    private score: number = 0; // Current score
    private highScore: number = 0; // High score
    private scoreText: Phaser.GameObjects.Text; // Text object for displaying score
    private highScoreText: Phaser.GameObjects.Text;
    private music: any;
    private boss1: any;
    bossSpeed: number = 500;
    bossHitPoints: number = 100;


    
    constructor ()
    {
        super('Boss1Scene');
    }

    init(data: any) {
        this.score = data.score;
    }

    preload(){
        ENEMY_SPEED = 200  ;
        this.load.spritesheet('ship',
            'assets/ship.png',
            { frameWidth: 32, frameHeight: 32 }
        );
        this.load.spritesheet('ship_left',
            'assets/ship_left.png',
            { frameWidth: 32, frameHeight: 32 }
        );
        this.load.spritesheet('ship_up',
            'assets/ship_up.png',
            { frameWidth: 32, frameHeight: 32 }
        );
        this.load.spritesheet('ship_down',
            'assets/ship_down.png',
            { frameWidth: 32, frameHeight: 32 }
        );
        this.load.spritesheet('bullet', 'assets/fire.png',
            { frameWidth: 5, frameHeight: 5 }
        );
        this.load.image('background', 'assets/space.png',  
        );
        this.load.image('studioGif', 'assets/studio.gif'
        );
        this.load.spritesheet('explosion', 'assets/explosion.png',
            { frameWidth: 32, frameHeight: 32} 
        );
        this.load.spritesheet('boss1','assets/boss1.png',
            { frameWidth: 60, frameHeight: 90}
        );
        this.load.audio('shockwave', 'assets/shockwave-105526.mp3'
        ); 
        this.load.audio('bossMusic', 'assets/8-bit-space-123218.mp3'
        ); 
    }

    create ()
    {
        //this.camera = this.cameras.main;
        //this.camera.setBackgroundColor(0x00ff00);
        //const gif = this.add.image(512, 384, 'studioGif'); // Center the GIF on the screen

        // Set a timer to transition to the main menu after a delay
        //this.time.delayedCall(3000, () => { // Adjust the duration as needed (3000 ms = 3 seconds)
           // gif.destroy(); // Remove the GIF from the scene
            //this.scene.start('MainMenu'); // Transition to the main menu scene
        //});
       // this.createEnemies();

        this.background = this.add.image(512, 384, 'background');

        this.ship = this.physics.add.sprite(100, 300, 'ship');
        this.lazer= this.physics.add.group({
            defaultKey: 'lazer', // Ensure you have a bullet sprite loaded 
        });
        this.music = this.sound.add('bossMusic'); // Add the music to the sound manager
        this.music.setLoop(true); // Set the music to loop
        this.music.play({ volume: 0.5 });

        this.ship.setCollideWorldBounds(true);

        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('ship_left', { start: 0, end: 5 }),
            frameRate: 10,
            repeat: -1
        });
        /*this.anims.create({
            key: 'up',
            frames: this.anims.generateFrameNumbers('ship_up', { start: 0, end: 7 }),
            frameRate: 10,
            repeat: -1
        });*/
        this.anims.create({
            key: 'down',
            frames: this.anims.generateFrameNumbers('ship_down', { start: 0, end: 7 }),
            frameRate: 10,
            repeat: -1
        });
        
        this.anims.create({
            key: 'turn',
            frames: [ { key: 'ship', frame: 0 } ],
            frameRate: 20
        });

        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('ship', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });
        
        this.anims.create({
            key: 'space',
            frames: this.anims.generateFrameNumbers('bullet', {start: 0, end:3 }),
            frameRate: 10,
            repeat: -1
        })
        
        this.bullet= this.physics.add.group({
            defaultKey: 'bullet', // Ensure you have a bullet sprite loaded 
        });
        this.cursors = this.input?.keyboard?.createCursorKeys();

        this.input?.keyboard?.on('keydown-SPACE', this.fireBullet, this);

        this.boss1 = new Boss1(this, Phaser.Math.Between(900, 992), Phaser.Math.Between(0, 768));
        this.boss1.setActive(true).setVisible(true);


        //this.physics.add.collider(this.bullet, this.enemies);
        this.physics.add.overlap(this.bullet, this.boss1, this.hitBoss, undefined, this);
        this.physics.add.overlap(this.ship, this.boss1, this.playerHit, undefined, this);
        

        this.anims.create({
            key: 'explode',
            frames: this.anims.generateFrameNumbers('explosion', { start: 0, end: 4 }), // Adjust frame range
            frameRate: 10,
            repeat: 0 // Play once
        });

        this.highScore = this.getHighScore(); // Retrieve high score from local storage

        // Create text objects for score and high score
        this.scoreText = this.add.text(16, 16, `Score: ${this.score}`, { fontSize: '32px' });
        this.highScoreText = this.add.text(16, 50, `High Score: ${this.highScore}`, { fontSize: '32px', color: '#fff' 
        });
    }
    
    playerHit(ship: any, boss1: any) {
        if(boss1.visible){
            ship.setActive(false).setVisible(false);
            console.log('YOU WERE EXTERMINATED');
            this.scene.start('GameOver');
            this.music.stop();
        }
    }
   
    fireBullet() { { // Check if there's space for a new bullet
            const bullet = this.bullet.get(); // Get a bullet from the group
            if (bullet) {
                bullet.setActive(true).setVisible(true); // Activate and make the bullet visible
                bullet.setPosition(this.ship.x, this.ship.y); // Position the bullet at the ship's location
                bullet.setVelocityX(this.bulletSpeed); // Set the bullet's velocity
            }
        }
    }
    
    hitBoss(boss1: any, bullet: any) {
        bullet.destroy();
        bullet.setActive(false).setVisible(false);
        boss1.hitPoints += 25;
        const explosion = this.add.sprite(boss1.x, boss1.y, 'explosion');
        explosion.play('explode');
        this.sound.play('shockwave');
        explosion.on('animationcomplete', () => {
            explosion.destroy();
            // Remove the explosion sprite after the animation is complete
        });
        
        if (boss1.visible && boss1.hitPoints >= 100){
            boss1.setActive(false).setVisible(false);
            
            boss1.hitPoints = 0;
            this.score = this.score + 100; 
            const explosion = this.add.sprite(boss1.x, boss1.y, 'explosion');
            explosion.play('explode');
            this.sound.play('shockwave');
            explosion.on('animationcomplete', () => {
                explosion.destroy();
                this.scene.start('Game', {score: this.score});
            });
            

            console.log(`Boss hit! Remaining hit points: ${boss1.hitPoints}`);
            


        if (boss1.hitPoints <= 0) {
            bullet.setActive(false).setVisible(false); // Deactivate and hide the bullet
            boss1.setActive(false).setVisible(false);
            const explosion = this.add.sprite(boss1.x, boss1.y, 'explosion');
            explosion.play('explode');
            this.sound.play('shockwave');
            explosion.on('animationcomplete', () => {
                explosion.destroy();
                this.updateScore(100);
                // Remove the explosion sprite after the animation is complete
                });
            }
        }
    }


    
    updateScore(points: number) {
        this.score += points; // Update the current score
        this.scoreText.setText(`Score: ${this.score}`); // Update the score display

        // Check for high score
        if (this.score > this.highScore) {
            this.highScore = this.score; // Update high score
            this.highScoreText.setText(`High Score: ${this.highScore}`); // Update high score display
            this.saveHighScore(this.highScore); 
        }

        if (this.score % 100 === 0) {
            ENEMY_SPEED += 15;
            
        }
    }


    getHighScore(): number {
        const storedHighScore = localStorage.getItem('highScore');
        return storedHighScore ? parseInt(storedHighScore, 10) : 0; // Return stored high score or 0 if not found
    }

    saveHighScore(score: number) {
        localStorage.setItem('highScore', score.toString()); // Save high score to local storage
    }

    update ()
    {
        if (this.cursors.left.isDown)
        {
            this.ship.setVelocityX(-160);
        
            this.ship.anims.play('left', true);
        }
        else if (this.cursors.right.isDown)
        {
            this.ship.setVelocityX(160);
        
            this.ship.anims.play('right', true);
        }
        else if (this.cursors.up.isDown)
        {
            this.ship.setVelocityY(-160);
        
            this.ship.anims.play('up', true);
        }
        else if (this.cursors.down.isDown)
        {
            this.ship.setVelocityY(160);
        
            this.ship.anims.play('down', true);
        }
        else
        {
            this.ship.setVelocityX(0);
            this.ship.setVelocityY(0);
        
            this.ship.anims.play('turn');
        }

        this.boss1.update();
        
        //if (this.enemies.filter(enemy => enemy.active).length < this.maxEnemies) {
        //    const enemy = new Enemy(this, Phaser.Math.Between(800, 1024), Phaser.Math.Between(0, 600));
        //    this.enemies.push(enemy);
        //}
    }

}

export class Boss1 extends GameObjects.Sprite {
    lazer: Phaser.Physics.Arcade.Group;
    speed: number;
    sound: any;
    hitPoints: number = 0;
    bossSpeed: number;
    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, 'boss1');
        //this.lazer = lazer;
        //this.sound = sound;
        this.speed = 100; // Set speed
        scene.add.existing(this);
        scene.physics.add.existing(this);
        (this.body as Phaser.Physics.Arcade.Body).setCollideWorldBounds(true); // Cast to correct type
        this.setSpeed(ENEMY_SPEED);
    }

    setSpeed(speed: number) {
        this.speed = speed; // Update the speed property
        (this.body as Phaser.Physics.Arcade.Body).setVelocityY(-ENEMY_SPEED);
    }

    setUpShooter(timeout: number){
        setTimeout(() => {
         if(this.visible){
            this.shootLazer();
         }
         this.setUpShooter(3000)
        }, timeout);
    }

    shootLazer(){
        
    }

    update() {
        // Simple movement logic
        let body = this.body as Phaser.Physics.Arcade.Body;
        if (body.y <= 0) {
            body.setVelocityY(ENEMY_SPEED); 
        }

        if (body.blocked.up) {
            body.setVelocityY(ENEMY_SPEED); // Reverse direction
        }else if(body.blocked.down) {
            body.setVelocityY(-ENEMY_SPEED);
        }
    }

    respawn(x: any, y: any){
        // Reset the enemy's position and make it active again
        this.setPosition(x, y);
        this.setActive(true).setVisible(true);
    }
}