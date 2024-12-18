import { Scene, GameObjects } from 'phaser';
let ENEMY_SPEED = 100;

export class Game extends Scene
{
    camera: Phaser.Cameras.Scene2D.Camera;
    background: Phaser.GameObjects.Image;
    msg_text : Phaser.GameObjects.Text;
    ship: any; 
    lazer: any;
    cursors: any;
    bullet: Phaser.Physics.Arcade.Group;
    bulletSpeed: number = 400;
    enemies: Enemy[];
    private maxEnemies: number = 8;
    private score: number = 0; // Current score
    private highScore: number = 0; // High score
    private scoreText: Phaser.GameObjects.Text; // Text object for displaying score
    private highScoreText: Phaser.GameObjects.Text;
    private music: any;
    lazer_enemy: Enemy2
    score_when_lazer_enemy_killed: number = 0;
    start_boss_scene: number = 0;
    
    constructor ()
    {
        super('Game');
        this.enemies = [];
    }

    init(data: any) {
        if(data.score){
            this.score = data.score;
        }else{
            this.score = 0;
        }
    }

    preload(){
        this.enemies = [];
        ENEMY_SPEED = 100;
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
        this.load.spritesheet('enemy', 'assets/enemy.png',
            { frameWidth: 32, frameHeight: 32} 
        );
        this.load.image('studioGif', 'assets/studio.gif'
        );
        this.load.spritesheet('explosion', 'assets/explosion.png',
            { frameWidth: 32, frameHeight: 32} 
        );
        this.load.spritesheet('boss1','assets/boss1.png',
            { frameWidth: 60, frameHeight: 90}
        );
        this.load.spritesheet('lazer_enemy', 'assets/lazer_enemy.png',
            { frameWidth: 20, frameHeight: 25 }
        );
        this.load.spritesheet('lazer', 'assets/lazer2.png',
            { frameWidth: 85, frameHeight: 5}
        );
        this.load.spritesheet('lazer_charge', 'assets/lazer_enemy_charge.png',
            { frameWidth: 21, frameHeight: 22}
        );
        this.load.audio('lazer_cannon', 'assets/lazercannon-37980.mp3'
        );
        this.load.audio('shockwave', 'assets/shockwave-105526.mp3'
        ); // Adjust the path and format as necessary
        this.load.audio('backgroundMusic', 'assets/8-bit-arcade-mode-158814.mp3'
        ); // Adjust the path and format as necessary
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

        this.ship.setCollideWorldBounds(true);

        this.lazer_enemy = new Enemy2(this, Phaser.Math.Between(900, 992), Phaser.Math.Between(0, 768), this.lazer, this.sound);
        this.lazer_enemy.setActive(false).setVisible(false);

        this.anims.create({
            key: 'enemy_charge',
            frames: this.anims.generateFrameNumbers('lazer_charge', { start: 0, end: 8 }),
            frameRate: 10,
            repeat: -1
        });


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

        for(let i = 0; i < this.maxEnemies; i++) {
            const enemy = new Enemy(this, Phaser.Math.Between(900, 992), Phaser.Math.Between(0, 768));
            this.enemies.push(enemy);

        }
        //this.physics.add.collider(this.bullet, this.enemies);
        this.physics.add.overlap(this.bullet, this.enemies, this.hitEnemy, undefined, this);
        this.physics.add.overlap(this.ship, this.enemies, this.playerHit, undefined, this);
        this.physics.add.overlap(this.ship, this.lazer, this.playerHitLazer, undefined, this);
        this.physics.add.overlap(this.bullet, this.lazer_enemy, this.hitLazerEnemy, undefined, this);

        this.anims.create({
            key: 'explode',
            frames: this.anims.generateFrameNumbers('explosion', { start: 0, end: 4 }), // Adjust frame range
            frameRate: 10,
            repeat: 0 // Play once
        });
        this.music = this.sound.add('backgroundMusic'); // Add the music to the sound manager
        this.music.setLoop(true); // Set the music to loop
        this.music.play({ volume: 0.5 });
        this.highScore = this.getHighScore(); // Retrieve high score from local storage

        // Create text objects for score and high score
        this.scoreText = this.add.text(16, 16, `Score: ${this.score}`, { fontSize: '32px' });
        this.highScoreText = this.add.text(16, 50, `High Score: ${this.highScore}`, { fontSize: '32px', color: '#fff' 
        });
    }

    playerHit(ship: any, enemy: any) {
        // Handle player death
        if(enemy.visible){
            ship.setActive(false).setVisible(false);
             // Deactivate and hide the ship
            console.log("YOU PERISHED!"); // You can replace this with your death logic (e.g., restart the game)
            this.scene.start('GameOver');
            this.music.stop(); // Stop the background music
            this.scene.start('GameOver');
            
        }
    }
    playerHitLazer(ship: any, enemy: any) {
        // Handle player death
        if(enemy.visible){
            ship.setActive(false).setVisible(false);
             // Deactivate and hide the ship
            console.log("YOU PERISHED!"); // You can replace this with your death logic (e.g., restart the game)
            this.scene.start('GameOver');
            this.music.stop(); // Stop the background music
            this.scene.start('GameOver');
            
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
    
    hitEnemy(bullet: any, enemy: any) {
        if(enemy.visible){
            bullet.setActive(false).setVisible(false); // Deactivate and hide the bullet
            enemy.setActive(false).setVisible(false);
            const explosion = this.add.sprite(enemy.x, enemy.y, 'explosion');
            explosion.play('explode');
            this.sound.play('shockwave');
            explosion.on('animationcomplete', () => {
                explosion.destroy();
                this.updateScore(10);
                // Remove the explosion sprite after the animation is complete
            });

            this.respawnEnemy(bullet);
        }
    }

    hitLazerEnemy(enemy: any, bullet: any) {
        if(enemy.visible){
            bullet.setActive(false).setVisible(false); // Deactivate and hide the bullet
            enemy.setActive(false).setVisible(false);
            this.score_when_lazer_enemy_killed = this.score;
            const explosion = this.add.sprite(enemy.x, enemy.y, 'explosion');
            explosion.play('explode');
            this.sound.play('shockwave');
            explosion.on('animationcomplete', () => {
                explosion.destroy();
                this.updateScore(10);
                // Remove the explosion sprite after the animation is complete
            });

            //enemy.respawn(Phaser.Math.Between(800, 992), Phaser.Math.Between(0, 768))
        }
    }

    respawnEnemy(enemy: Enemy) {
        console.log("Enemy start at: ", enemy.x, enemy.y);
        enemy.respawn(Phaser.Math.Between(800, 992), Phaser.Math.Between(0, 768))
        // Optionally, you can add logic to reset any enemy-specific state here
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

        if (this.score > 0  && (this.score - this.score_when_lazer_enemy_killed) == 250) {
            this.spawnLazerEnemy();
        }
        if (this.score > 0  && this.score % 1000 === 0) {
            this.music.stop();
            this.scene.start('Boss1Scene', {score: this.score});
        }


        if (this.score % 100 === 0) {
            ENEMY_SPEED += 15;
            
            this.enemies.forEach(enemy => {
                enemy.setSpeed(ENEMY_SPEED); // Update each enemy's speed
            });
        }
    }

    spawnLazerEnemy() {
        this.lazer_enemy.setActive(true).setVisible(true);
        this.lazer_enemy.respawn(Phaser.Math.Between(800, 992), Phaser.Math.Between(0, 768))
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
        
        //if (this.enemies.filter(enemy => enemy.active).length < this.maxEnemies) {
        //    const enemy = new Enemy(this, Phaser.Math.Between(800, 1024), Phaser.Math.Between(0, 600));
        //    this.enemies.push(enemy);
        //}
        this.enemies.forEach(enemy => enemy.update());

        this.lazer_enemy.update();
    }

}

export class Enemy extends GameObjects.Sprite {
    speed: number;

    constructor(scene: Phaser.Scene, x: number, y: number, sprite_name: any = 'enemy') {
        super(scene, x, y, sprite_name); // Ensure you have an enemy sprite loaded
        this.speed = 100; // Set speed
        scene.add.existing(this);
        scene.physics.add.existing(this);
        (this.body as Phaser.Physics.Arcade.Body).setCollideWorldBounds(true); // Cast to correct type
        this.setSpeed(ENEMY_SPEED);
    }

    setSpeed(speed: number) {
        this.speed = speed; // Update the speed property
        (this.body as Phaser.Physics.Arcade.Body).setVelocityX(-ENEMY_SPEED);
    }

    update() {
        // Simple movement logic
        let body = this.body as Phaser.Physics.Arcade.Body;
        if (body.x <= 0) {
            this.setPosition(Phaser.Math.Between(800, 992), Phaser.Math.Between(0, 768))
            body.setVelocityX(ENEMY_SPEED); 
        }

        if (body.blocked.right ||
         body.blocked.left) {
            body.setVelocityX(-ENEMY_SPEED); // Reverse direction
        }
    }

    respawn(x: any, y: any){
        // Reset the enemy's position and make it active again
        let body = this.body as Phaser.Physics.Arcade.Body;
        body.setVelocityX(-(ENEMY_SPEED));
        this.setPosition(x, y);
        this.setActive(true).setVisible(true);
        if (typeof this.update === 'function') {
            //this.update(); // Call the enemy's update function if it exists
        }
    }
}

export class Enemy2 extends Enemy {
    lazer: Phaser.Physics.Arcade.Group;
    sound: any;

    constructor(scene: Phaser.Scene, x: number, y: number, lazer: Phaser.Physics.Arcade.Group, sound: any) {
        super(scene, x, y, 'lazer_enemy');
        this.lazer = lazer;
        this.sound = sound;
        this.setUpShooter(3000)
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
        try{
            this.anims.play('enemy_charge', true);
                
            const lazer = this.lazer.get(); // Get a bullet from the group
            let body = this.body as Phaser.Physics.Arcade.Body;
            if (lazer) {
                this.sound.play('lazer_cannon');
                lazer.setActive(true).setVisible(true); // Activate and make the bullet visible
                lazer.setPosition(body.x, body.y); // Position the bullet at the ship's location
                lazer.setVelocityX(-400); // Set the bullet's velocity
            }
        }catch{}
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
