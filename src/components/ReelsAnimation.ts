import { Scene, Tweens } from "phaser";
import { Symbol } from "./Symbol";
import { Reel } from "./Reel";
import constants from "../constants/constants";
import { WinPopup } from "./WinPopup";
import { SpinButton } from "./SpinButton";

export class ReelsAnimation
{
  scene: Scene;
  reels: Reel[];
  
  constructor(scene: Scene, reels: Reel[], isGameWon: boolean, winPopup: WinPopup, spinButton: SpinButton) {
    this.scene = scene;
    this.reels = reels;
    
    const tweens: Tweens.Tween[] = new Array(constants.reelsNumber);
    for (let i: number = 0; i < reels.length; i++) {
      scene.time.delayedCall(i * 500, () => {
        reels[i].isReelTimeOut = false;
        tweens[i] = this.createAnimation(reels[i].reel, i, isGameWon, winPopup, spinButton, tweens[i - 1]);
        scene.time.delayedCall(reels[i].spinTime * 1000, () => {
          reels[i].isReelTimeOut = true;
        }, [], scene);
      }, [], scene);
    }
  }

  startAnimation(reels: Reel[]) {
    for (let i: number = 0; i < constants.reelsNumber; i++) {
      reels[i].isReelTimeOut = false;
    }
  }

  createAnimation(targets: Symbol[], targetsIndex: number, isGameWon: boolean, winPopup: WinPopup, spinButton: SpinButton, prevTween: Tweens.Tween | undefined = undefined) {
    const isTargetsActive: boolean[] = targets.map(() => {
      return false;
    });
    
    const tween: Tweens.Tween = this.scene.tweens.add({
      targets: targets,
      props: {
        y: {
          duration: 100,
          ease: 'linear',
          repeat: -1,
          value: {
            getEnd: (_, __, value: number) => {
              return value + 200;
            },
            getStart: (_, __, value: number, index: number) => {
              if (isTargetsActive[index] === false) {
                isTargetsActive[index] = true;
                return value;
              }
              if (value >= this.reels[targetsIndex].maxPositionY) {
                return this.reels[targetsIndex].minPositionY;
              }
              return value + 200;
            }
          }
        }
      },
      onRepeat: (tween: Tweens.Tween) => {
        this.checkAnimationToStop(this.reels[targetsIndex], tween, prevTween);
      },
      onComplete: () => {
        this.changeSymbolPosition(this.reels[targetsIndex]);
        if (targetsIndex === constants.reelsNumber - 1) {
          if (isGameWon) {
            winPopup.setVisible(true);
            this.scene.time.delayedCall(2000, () => {
              winPopup.setVisible(false);
              spinButton.clearTint();
              spinButton.setInteractive();
            }, [], this.scene);
          } else {
            spinButton.clearTint();
            spinButton.setInteractive();
          }
        }
      }
    });

    return tween;
  }

  checkAnimationToStop(reel: Reel, tween: Tweens.Tween, prevTween: Tweens.Tween | undefined = undefined) {
    if (prevTween === undefined) {
      if (reel.isReelTimeOut === true && reel.reel[reel.winningIndex].y === this.scene.cameras.main.height / 2) {
        tween.complete();
      }
    } else if (reel.isReelTimeOut === true && reel.reel[reel.winningIndex].y === this.scene.cameras.main.height / 2 && prevTween.isPlaying() === false) {
      tween.complete();
    }
  }

  changeSymbolPosition(reel: Reel) {
    reel.reel.forEach((symbol: Symbol) => {
      if (symbol.y > reel.maxPositionY) {
        symbol.y = reel.minPositionY;
      }
    })
  }
}