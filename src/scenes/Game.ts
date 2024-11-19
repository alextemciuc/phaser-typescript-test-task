import { GameObjects, Scene } from 'phaser';
import { Background } from '../components/Background';
import { SpinButton } from '../components/SpinButton';
import { Slot } from '../components/Slot';
import { WinPopup } from '../components/WinPopup';

export class Game extends Scene
{
    constructor ()
    {
        super('Game');
    }

    preload()
    {
        this.load.image('background', 'assets/Background.png');
        this.load.image('banana', 'assets/Banana.png');
        this.load.image('blackberry', 'assets/Blackberry.png');
        this.load.image('cherry', 'assets/Cherry.png');
        this.load.image('spinButton', 'assets/Spin.png');
        this.load.image('win', 'assets/Win.png');
    }

    create ()
    {
        const container: GameObjects.Container = this.add.container();
        const background: Background = new Background(this, this.cameras.main.width / 2, this.cameras.main.height / 2, 'background');
        background.setScale(0.5);

        const spinButton: SpinButton = new SpinButton(this, background.x, background.y + 200, 'spinButton');
        spinButton.setScale(0.75);
        spinButton.setInteractive({ cursor: 'pointer' });

        const winPopup: WinPopup = new WinPopup(this, background.x, background.y - 170, 'win');
        winPopup.setScale(0.5);
        winPopup.setVisible(false);

        new Slot(this, container, background, spinButton, winPopup);
    }
}
