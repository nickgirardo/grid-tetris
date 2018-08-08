
import Tetromino from "./tetromino.js";
import Field from "./field.js";

export default class Manager {

  constructor() {
    this.randFromBag = (() => {
      // Fisher-Yates
      function shuffle(arr) {
        for (let i = arr.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
      }

      const defaultBag = [0,1,2,3,4,5,6];
      let currentBag = [];

      return () => {
        if(currentBag.length === 0)
          currentBag = shuffle([...defaultBag]);
        return currentBag.pop();
      }
    })();

    // TODO not hardcoded
    this.field = new Field(10, 24);
    this.tetromino = new Tetromino(this, this.field, this.randFromBag());
    this.tetromino.center();
  }

  update() {
    this.tetromino.update();
  }

  // TODO needs game over check
  tetrominoLands(tetromino) {
    this.field.addTetromino(tetromino);
    this.field.score();

    this.tetromino = new Tetromino(this, this.field, this.randFromBag()); 
    this.tetromino.center();
  }

  draw(domGrid, gridWidth) {
    this.field.draw(domGrid, gridWidth);
    this.tetromino.draw(domGrid, gridWidth);
  }
}
