import { Display, GameObjects, Scene, Tweens } from "phaser";
import { Background } from "./Background";
import { SpinButton } from "./SpinButton";
import constants from "../constants/constants";
import { Reel } from "./Reel";
import { ESymbols } from "../constants/symbols";
import { WinPopup } from "./WinPopup";
import { ReelsAnimation } from "./ReelsAnimation";

export class Slot
{
  winningRow: ESymbols[] = new Array(constants.reelsNumber);
  reelsTweens: Tweens.Tween[] = new Array(constants.reelsNumber);
  
  constructor(scene: Scene, container: GameObjects.Container, background: Background, spinButton: SpinButton, winPopup: WinPopup) {
    this.runSlot(scene, container, background, spinButton, winPopup);
  }

  runSlot(scene: Scene, container: GameObjects.Container, background: Background, spinButton: SpinButton, winPopup: WinPopup) {
    let offsetX: number = constants.initPositionX;
    let minSpinTime: number = constants.minSpinningTime;
    const reels: Reel[] = new Array(constants.reelsNumber);

    for (let i: number = 0; i < reels.length; i++) {
      reels[i] = new Reel(scene, background.x, background.y, offsetX, minSpinTime);
      this.winningRow[i] = reels[i].stringReel[reels[i].winningIndex];
      container.add(reels[i].reel);
      offsetX += Math.abs(constants.initPositionX);
      if (i < reels.length - 1) {
        minSpinTime = reels[i].spinTime;
      }
    }
    this.createMask(scene, container, background.x, background.y);

    const isWinner: boolean = this.isGameWon();

    spinButton.on('pointerdown', () => {
      spinButton.disableInteractive(true);
      spinButton.setTint(0xbdbcbc);
      new ReelsAnimation(scene, reels, isWinner, winPopup, spinButton);
    });
  }

  createMask(scene: Scene, container: GameObjects.Container, x: number, y: number) {
    const maskRect: GameObjects.Rectangle = new GameObjects.Rectangle(scene, x, y - 10, 570, 240, 0x000000);
    maskRect.setVisible(false);
    const mask: Display.Masks.BitmapMask = new Display.Masks.BitmapMask(scene, maskRect);
    container.setMask(mask);
  }

  isGameWon() {
    let isWinner: boolean = true;
    this.winningRow.forEach((value: ESymbols, index: number, row: ESymbols[]) => {
      if (index < row.length - 1) {
        isWinner = isWinner && value === row[index + 1];
      }
    });
    return isWinner;
  }
}