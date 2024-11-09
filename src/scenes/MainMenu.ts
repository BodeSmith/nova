import { Scene, GameObjects } from 'phaser';

export class MainMenu extends Scene
{
    background: GameObjects.Image;
    logo: GameObjects.Image;
    title: GameObjects.Text;

    constructor ()
    {
        super('MainMenu');
    }
    preload()
    {
        this.load.spritesheet('studioSheet', 'assets/studio-sheet.png',
            { frameWidth: 250, frameHeight: 250} 
        );
    }
    create ()
    {
        this.background = this.add.image(512, 384, 'background');

        const sprite = this.add.sprite(485.3094939483, 398.6746387085, 'studioSheet');
        sprite.setScale(3);

        this.anims.create({
            key: 'animate',
            frames: this.anims.generateFrameNumbers('studioSheet', { start: 0, end: 53 }), // Adjust frame range
            frameRate: 10,
            repeat: -1 // Loop the animation
        });
        sprite.play('animate');

        this.title = this.add.text(500, 600, 'NOVA', {
            fontFamily: 'Arial Black', fontSize: 38, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5);
        

        this.input.once('pointerdown', () => {

            this.scene.start('Game');

        });
    }
}
