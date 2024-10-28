import { Scene, GameObjects, Display, Tweens } from 'phaser';

enum ESymbols {
    BANANA = "banana",
    CHERRY = "cherry",
    BLACKBERRY = "blackberry"
}

const maxSymbols: number = 3;
const minReelElements: number = 3;
const maxReelElements: number = 6;
const reelsNumber: number = 3;
const initPositionX: number = -200;
const initPositionY: number = -200;

// const reels: ESymbols[][] = [
//     [ESymbols.BANANA, ESymbols.BANANA, ESymbols.BLACKBERRY, ESymbols.CHERRY, ESymbols.CHERRY],
//     [ESymbols.BLACKBERRY, ESymbols.BANANA, ESymbols.BLACKBERRY, ESymbols.CHERRY],
//     [ESymbols.BANANA, ESymbols.CHERRY, ESymbols.BLACKBERRY, ESymbols.BANANA, ESymbols.BLACKBERRY, ESymbols.BANANA]
// ]

export class Game extends Scene
{
    background: GameObjects.Image;
    title: GameObjects.Text;
    spinButton: GameObjects.Image;
    reels: ESymbols[][];
    reelsContainer: GameObjects.Container;
    reelsTweens: Tweens.Tween[] = new Array(reelsNumber);

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
    }

    create ()
    {
        this.reelsContainer = this.add.container();
        this.background = this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2, 'background');
        this.background.setScale(0.5);

        this.title = this.add.text(512, 50, 'Game', {
            fontFamily: 'Arial Black', fontSize: 38, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5);

        this.spinButton = this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2 + 200, 'spinButton');
        this.spinButton.setScale(0.75);
        this.spinButton.setInteractive({ cursor: "pointer" });

        this.reels = this.createReels();
        const newReels: GameObjects.Image[][] = this.addSymbols(this.reels);
        console.log(newReels);

        this.createReelsMask(this.reelsContainer, newReels);

        this.spinButton.on('pointerdown', () => {
            for (let i: number = 0; i < newReels.length; i++) {
                this.time.delayedCall(i * 500, () => {
                    this.reelsTweens[i] = this.createTween(newReels[i]);
                    this.time.delayedCall(2000, () => {
                        console.log(i);
                        this.reelsTweens[i].pause();
                    }, [], this);
                    // this.stopSpin(this.reelsTweens[i]);
                }, [], this);
            }
        });
    }

    createReels() {
        const reels: ESymbols[][] = new Array(reelsNumber)
        for (let i: number = 0; i < reels.length; i++) {
            const reelDimension: number = this.getRandomNumberBetween(minReelElements, maxReelElements);
            reels[i] = new Array(reelDimension);
        }

        for (let i: number = 0; i < reels.length; i++) {
            for (let j: number = 0; j < reels[i].length; j++) {
                const randomInt = this.getRandomNumber(maxSymbols);
                switch (randomInt) {
                    case 0:
                        reels[i][j] = ESymbols.BANANA;
                        break;
                    case 1:
                        reels[i][j] = ESymbols.BLACKBERRY;
                        break;
                    case 2:
                        reels[i][j] = ESymbols.CHERRY;
                        break;
                }
            }
        }
        return reels;
    }

    addSymbols(reelsString: ESymbols[][]) {
        let positionX: number = initPositionX;
        const newReels: GameObjects.Image[][] = reelsString.map((column: ESymbols[]) => {
            let positionY: number = initPositionY;
            const newColumn: GameObjects.Image[] = column.map((symbol: ESymbols) => {
                let image: GameObjects.Image;
                switch (symbol) {
                    case ESymbols.BANANA:
                        image = this.add.image(this.cameras.main.width / 2 + positionX, this.cameras.main.height / 2 + positionY, symbol).setScale(0.5);
                        break;
                    case ESymbols.BLACKBERRY:
                        image = this.add.image(this.cameras.main.width / 2 + positionX, this.cameras.main.height / 2 + positionY, symbol).setScale(0.5);
                        break;
                    case ESymbols.CHERRY:
                        image = this.add.image(this.cameras.main.width / 2 + positionX, this.cameras.main.height / 2 + positionY, symbol).setScale(0.5);
                        break;
                }
                positionY += Math.abs(initPositionY);
                return image;
            });
            positionX += Math.abs(initPositionX);
            return newColumn;
        });
        return newReels;
    }

    getRandomNumber(max: number) {
        return Math.floor(Math.random() * max);
    }

    getRandomNumberBetween(min: number, max: number) {
        const minCeiled: number = Math.ceil(min);
        const maxFloored: number = Math.floor(max);

        return Math.floor(Math.random() * (maxFloored - minCeiled + 1) + minCeiled);
    }

    createReelsMask(container: GameObjects.Container, reels: GameObjects.Image[][]) {
        for (let i: number = 0; i < reels.length; i++) {
            container.add(reels[i]);
        }

        const maskRect: GameObjects.Rectangle = this.add.rectangle(this.background.x, this.background.y - 10, 570, 240, 0x000000).setVisible(false);
        const mask: Display.Masks.BitmapMask = new Phaser.Display.Masks.BitmapMask(this, maskRect);
        container.setMask(mask);
    }

    createTween(target: GameObjects.Image[]) {
        const tween: Tweens.Tween = this.tweens.add({
            targets: target,
            y: '+=200',
            duration: 1000,
            ease: 'linear',
            // paused: false,
            // yoyo: true,
            // repeat: -1,
            // delay: this.tweens.stagger(100, {}),
            onComplete: () => {
                this.changeElements(target);
                this.createTween(target);
            }
        });

        return tween;
    }

    changeElements(array: GameObjects.Image[]) {
        array[array.length - 1].y = array[0].y - Math.abs(initPositionY);
        const lastElement: GameObjects.Image = array[array.length - 1];
        for (let i: number = array.length - 1; i >= 0; i--) {
            if (i === 0) {
                array[i] = lastElement;
            } else {
                array[i] = array[i - 1];
            }
        }
    }

    // stopSpin(tween: Tweens.Tween) {
    //     // console.log(tweenArray);
    //     if (tween.isPlaying() === true) {
    //         console.log('Is playing');
    //         this.time.delayedCall(2000, () => {
    //             tween.pause();
    //         }, [], this);
    //     }
    // }
}
