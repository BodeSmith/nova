import { Scene } from 'phaser';

export class GameOver extends Scene
{
    camera: Phaser.Cameras.Scene2D.Camera;
    background: Phaser.GameObjects.Image;
    gameover_text : Phaser.GameObjects.Text;
    private music: Phaser.Sound.BaseSound;

    constructor ()
    {
        super('GameOver');
    }
    preload() {
        this.load.audio('gameOverMusic', 'assets/game-over-38511.mp3'); // Load your game over music
    }
    create ()
    {   this.music = this.sound.add('gameOverMusic'); // Add the game over music to the sound manager
        this.music.play({ volume: 0.5 }
        );
        this.camera = this.cameras.main
        this.camera.setBackgroundColor(0xff0000);

        this.background = this.add.image(512, 384, 'background');
        this.background.setAlpha(0.5);

        this.gameover_text = this.add.text(512, 384, 'YOU PERISHED', {
            fontFamily: 'Arial Black', fontSize: 64, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        });
        this.gameover_text.setOrigin(0.5);

        this.input.once('pointerdown', () => {
            this.scene.stop("Game");
            this.scene.start('MainMenu');

        });
    }
}
