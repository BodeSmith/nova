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
    asteroid: any;
    fire_wall: any;
    plasma: any;


    
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
        this.load.spritesheet('asteroid', 'assets/asteroid.png',
            { frameWidth: 60, frameHeight: 30 }
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
        this.load.spritesheet('boss_explosion','assets/boss_explosion.png',
            { frameWidth: 60, frameHeight: 90}
        );
        this.load.audio('explosion_audio','assets/distant-explosion-47562.mp3'
        );
        this.load.audio('asteroid_blast','assets/tribute-cannon-104430.mp3'
        );
        this.load.spritesheet('fire_wall', 'assets/fire_wall.png',
            { frameWidth: 350, frameHeight: 768}
        );
        this.load.spritesheet('plasma', 'assets/plasma.png',
            { frameWidth: 1024, frameHeight: 90}
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
            defaultKey: 'lazer', 
        });
        this.asteroid= this.physics.add.group({
            defaultKey: 'asteroid', 
        });
        this.fire_wall= this.physics.add.group({
            defaultKey: 'fire_wall', 
        });
        this.plasma= this.physics.add.group({
            defaultKey: 'plasma', 
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

        this.boss1 = new Boss1(this, Phaser.Math.Between(900, 992), Phaser.Math.Between(0, 768), this.asteroid, this.fire_wall, this.sound);
        this.boss1.setActive(true).setVisible(true);

       


        //this.physics.add.collider(this.bullet, this.enemies);
        this.physics.add.overlap(this.bullet, this.boss1, this.hitBoss, undefined, this);
        this.physics.add.overlap(this.ship, this.boss1, this.playerHit, undefined, this);
        this.physics.add.overlap(this.asteroid, this.ship, this.playerHit, undefined, this);
        this.physics.add.overlap(this.fire_wall, this.ship, this.playerHit, undefined, this);
        this.physics.add.overlap(this.bullet, this.fire_wall, this.hitFireWall, undefined, this);
        this.physics.add.overlap(this.ship, this.plasma, this.playerHit, undefined, this);
        

        this.anims.create({
            key: 'explode',
            frames: this.anims.generateFrameNumbers('explosion', { start: 0, end: 4 }), // Adjust frame range
            frameRate: 10,
            repeat: 0 // Play once
        });
        this.anims.create({
            key: 'boss_explosion',
            frames: this.anims.generateFrameNumbers('boss_explosion', { start: 0, end: 15 }), 
            frameRate: 10,
            repeat: 0 // Play once
        });
        this.anims.create({
            key: 'asteroid',
            frames: this.anims.generateFrameNumbers('asteroid', { start: 7, end: 7 }), 
            frameRate: 10,
            repeat: 0 // Play once
        });
        this.anims.create({
            key: 'plasma',
            frames: this.anims.generateFrameNumbers('asteroid', { start: 0, end: 9 }), 
            frameRate: 10,
            repeat: 0 
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
    hitFireWall(bullet: any, fire_wall: any){
        if(fire_wall.visible){
            bullet.destroy();
            bullet.setActive(false).setVisible(false);
            if (fire_wall.hitPoints === undefined) {
                fire_wall.hitPoints = 0; // Initialize hitPoints
            }
            fire_wall.hitPoints += 1;

            if (fire_wall.hitPoints >= 4) { // Check if it has reached 4 hits
                fire_wall.setActive(false).setVisible(false);
                bullet.setActive(false).setVisible(false); // Destroy the fire wall
                fire_wall.hitPoints = 0
            }
            const explosion = this.add.sprite(fire_wall.x, fire_wall.y, 'explosion');
            explosion.play('explode');
            this.sound.play('shockwave');
            explosion.on('animationcomplete', () => {
                explosion.destroy();
            });
        }
    }
    
    hitBoss(boss1: any, bullet: any) {
        bullet.destroy();
        bullet.setActive(false).setVisible(false);
        boss1.hitPoints += 5;
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
            const boss_explosion = this.add.sprite(boss1.x, boss1.y, 'boss_explosion');
            boss_explosion.play('boss_explosion');
            this.sound.play('explosion_audio');
            boss_explosion.on('animationcomplete', () => {
                boss_explosion.destroy();
                this.music.stop()
                this.scene.start('Game', {score: this.score});
            });
            

            console.log(`Boss hit! Remaining hit points: ${boss1.hitPoints}`);
            


        if (boss1.hitPoints <= 0) {
            bullet.setActive(false).setVisible(false); // Deactivate and hide the bullet
            boss1.setActive(false).setVisible(false);
            const boss_explosion = this.add.sprite(boss1.x, boss1.y, 'boss_explosion');
            boss_explosion.play('explode');
            this.sound.play('explosion_audio');
            boss_explosion.on('animationcomplete', () => {
                boss_explosion.destroy();
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
    asteroid: Phaser.Physics.Arcade.Group;
    fire_wall: Phaser.Physics.Arcade.Group;
    plasma: Phaser.Physics.Arcade.Group;
    

    constructor(scene: Phaser.Scene, x: number, y: number, 
        asteroid: Phaser.Physics.Arcade.Group,
        fire_wall: Phaser.Physics.Arcade.Group,
        //plasma: Phaser.Physics.Arcade.Group,
        sound: any
    ) {
        super(scene, x, y, 'boss1');
        this.setUpAttackTimer(); 
        //this.lazer = lazer;
        //this.sound = sound;
        this.speed = 100; // Set speed
        scene.add.existing(this);
        scene.physics.add.existing(this);
        (this.body as Phaser.Physics.Arcade.Body).setCollideWorldBounds(true); // Cast to correct type
        this.setSpeed(ENEMY_SPEED);
        this.asteroid = asteroid
        this.fire_wall = fire_wall
        this.sound = sound;
    }

    setSpeed(speed: number) {
        this.speed = speed; // Update the speed property
        (this.body as Phaser.Physics.Arcade.Body).setVelocityY(-ENEMY_SPEED);
    }
    setUpAttackTimer() {
        setInterval(() => {
            this.performAttack(); // Call the attack method every 5 seconds
        }, 2000);
    }

    setUpShooter(timeout: number){
        setTimeout(() => {
         if(this.visible){
            this.shootLazer();
         }
         this.setUpShooter(3000)
        }, timeout);
    }
    performAttack() {
        if(this.visible){
            //this.attackIndex = (this.attackIndex + 1) % 3; // Cycle through 3 different attacks
            const randomNumber = Math.floor(Math.random() * 3)
            this.setTexture('boss1')
            switch (randomNumber) {
                case 0:
                    this.attackTypeOne(); // Call the first attack
                    break;
                case 1:
                    this.attackTypeTwo(); // Call the second attack
                    break;
                case 2:
                    this.attackTypeThree(); // Call the third attack
                    break;
            }
        }
    }

    attackTypeOne() {
        // Implement the first attack logic here
        console.log("Boss performs Attack Type One!");
        try{
                
            const asteroid = this.asteroid.get(); // Get a bullet from the group
            let body = this.body as Phaser.Physics.Arcade.Body;
            if (asteroid) {
                this.sound.play('asteroid_blast');
                //this.anims.play('asteriod', true);
                asteroid.setActive(true).setVisible(true); 
                asteroid.setPosition(body.x, body.y); 
                asteroid.setVelocityX(-400); 
            }
        }
        catch(error){}
    }

    attackTypeTwo() {
        // Implement the second attack logic here
        console.log("Boss performs Attack Type Two!");
        try{
                
            const fire_wall = this.fire_wall.get(); // Get a bullet from the group
            let body = this.body as Phaser.Physics.Arcade.Body;
            if (fire_wall) {
                fire_wall.setActive(true).setVisible(true); 
                fire_wall.setPosition( body.x, 384); 
                fire_wall.setVelocityX(-200); 
            }
        }
        catch(error){}
    }

    attackTypeThree() {
        // Implement the third attack logic here
        console.log("Boss performs Attack Type Three!");
        try{
            //remove this, so that we are not replacing the ship
            //this.setTexture('plasma')
            //this.x = 0;
            /*const plasma = this.plasma.get(); // Get a plasma from the group
            let body = this.body as Phaser.Physics.Arcade.Body;
            if (plasma) {
                plasma.setActive(true).setVisible(true); 
                plasma.setPosition(body.x, body.y);
                // Play the plasma animation
                plasma.anims.play('plasma', true); // Ensure 'plasma' animation is defined
                    }
                }*/
        }
        catch(error){}
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