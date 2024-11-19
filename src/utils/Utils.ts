
export class Utils
{
  static getRandomIntNumber(max: number) {
    return Math.floor(Math.random() * max);
  }

  static getRandomIntNumberBetween(min: number, max: number) {
    const minCeiled: number = Math.ceil(min);
    const maxFloored: number = Math.floor(max);

    return Math.floor(Math.random() * (maxFloored - minCeiled + 1) + minCeiled);
  }

  static getRandomFloatBetween(min: number, max: number) {
    return Math.random() * (max - min) + min;
  }
}