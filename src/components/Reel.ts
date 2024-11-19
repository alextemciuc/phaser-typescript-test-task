import { GameObjects, Scene, Tweens } from "phaser";
import constants from "../constants/constants";
import { ESymbols } from "../constants/symbols";
import { Utils } from "../utils/Utils";
import { Symbol } from "./Symbol";

export class Reel
{
  reel: GameObjects.Image[];
  stringReel: ESymbols[];
  minPositionY: number;
  maxPositionY: number;
  isSpinning: boolean = false;
  isReelTimeOut: boolean = false;
  tween: Tweens.Tween;
  winningIndex: number;
  spinTime: number;
  
  constructor(scene: Scene, x: number, y: number, offsetX: number, minSpinTime: number) {
    this.createReel(scene, x, y, offsetX);
    this.winningIndex = this.getWinningIndex();
    this.spinTime = Utils.getRandomFloatBetween(minSpinTime, constants.maxSpinningTime);
  }

  getStringArray() {
    const size: number = Utils.getRandomIntNumberBetween(constants.minReelElements, constants.maxReelElements);
    const symbols: ESymbols[] = [ESymbols.BANANA, ESymbols.BLACKBERRY, ESymbols.CHERRY];
    const stringReel: ESymbols[] = new Array(size);

    for (let i: number = 0; i < stringReel.length; i++) {
      const index: number = Utils.getRandomIntNumber(constants.maxSymbols);
      stringReel[i] = symbols[index];
    }

    return stringReel;
  }

  getWinningIndex() {
    return Utils.getRandomIntNumber(this.stringReel.length);
  }

  createReel(scene: Scene, x: number, y: number, offsetX: number) {
    let offsetY: number = constants.initPositionY;
    this.stringReel = this.getStringArray();
    this.reel = this.stringReel.map((symbol: ESymbols) => {
      const image: GameObjects.Image = new Symbol(scene, x + offsetX, y + offsetY, symbol);
      image.setScale(0.5);
      offsetY += Math.abs(constants.initPositionY);
      return image;
    });
    this.minPositionY = this.reel[0].y;
    this.maxPositionY = this.reel[this.reel.length - 1].y;
  }
}
