import { Game as MainGame } from './scenes/Game';
import { GameOver } from './scenes/GameOver';
import { MainMenu } from './scenes/MainMenu';
import { Boot } from './scenes/Boot';
import { Preloader } from './scenes/Preloader';
import { Game, Types } from "phaser";
import { Boss1Scene } from "./scenes/Boss1Scene";

//  Find out more information about the Game Config at:
//  https://newdocs.phaser.io/docs/3.70.0/Phaser.Types.Core.GameConfig
const config: Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width: 1024,
    height: 768,
    parent: 'game-container',
    backgroundColor: '#028af8',
    physics: {
        default: 'arcade', // Specify the physics engine
        arcade: {
            gravity: { x: 0, y: 0 }, // Set gravity for the arcade physics
            debug: false // Set to true for debugging purposes
        }
    },
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    scene: [
        Boot,
        Preloader,
        MainMenu,
        MainGame,
        GameOver,
        Boss1Scene
    ]
};

export default new Game(config);
