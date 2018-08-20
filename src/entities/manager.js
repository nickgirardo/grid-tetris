
import Tetromino from "./tetromino.js";
import Field from "./field.js";
import TetrominoDisplay from "./display.js";
import EmptyDisplay from "./emptyDisplay.js";
import Label from "./label.js";

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

    // Has a piece been held since a piece has fallen?
    // This lets us know if the player can swap with the hold
    this.justHeld = false;

    this.next = new TetrominoDisplay(this.randFromBag());
    this.hold = new EmptyDisplay(); // Game starts with no pieces held

    this.nextLabel = new Label('NEXT', 5);
    this.holdLabel = new Label('HOLD', 5);

    this.lines = 0;
    this.linesLabel = new Label('LINES', 5);
    this.linesDisplay = new Label(this.lines.toString(), 5);

    this.score = 0;
    this.scoreLabel = new Label('SCORE', 5);
    this.scoreDisplay = new Label(this.score.toString(), 5);

    // TODO not hardcoded
    this.field = new Field(10, 24);
    this.tetromino = new Tetromino(this, this.field, this.randFromBag());
  }

  update() {
    this.tetromino.update();
  }

  // TODO needs game over check
  tetrominoLands(tetromino) {
    this.justHeld = false;

    this.field.addTetromino(tetromino);
    const linesCleared = this.field.score();

    if(linesCleared) {
      this.lines += linesCleared;
      this.linesDisplay = new Label(this.lines.toString(), 5);

      const scoreIncrease = [0, 100, 200, 400, 600];
      this.score += scoreIncrease[linesCleared];
      this.scoreDisplay = new Label(this.score.toString(), 5);
    }

    this.tetromino = new Tetromino(this, this.field, this.next.type);

    this.next = new TetrominoDisplay(this.randFromBag());
  }

  tetrominoHold() {
    if(this.justHeld)
      return;

    if(this.hold.isEmpty) {
      // No pieces in the hold, take the next piece
      this.hold = new TetrominoDisplay(this.tetromino.type);
      this.tetromino = new Tetromino(this, this.field, this.next.type);
      this.next = new TetrominoDisplay(this.randFromBag());
    } else {
      const heldType = this.hold.type;
      this.hold = new TetrominoDisplay(this.tetromino.type);
      this.tetromino = new Tetromino(this, this.field, heldType);
    }

    this.justHeld = true;
  }

  forceRedraw() {
    this.next.redraw = true;
    this.hold.redraw = true;
    this.nextLabel.redraw = true;
    this.holdLabel.redraw = true;
  }

  draw(domGrid, gridWidth) {
    const center = Math.floor(gridWidth / 2);
    const halfFieldWidth = Math.floor(this.field.width / 2);
    const fieldX = center - halfFieldWidth;
    const singlePad = 1;
    const dblPad = 2;

    const startX = dblPad;
    //const fieldX = startX;
    const rightX = center + halfFieldWidth + dblPad;
    const leftX = center - halfFieldWidth - dblPad - 5;

    // TODO way too many magic numbers
    this.field.draw(domGrid, gridWidth, fieldX, dblPad);
    this.tetromino.draw(domGrid, gridWidth, fieldX, dblPad);

    this.scoreLabel.draw(domGrid, gridWidth, rightX, dblPad);
    this.scoreDisplay.draw(domGrid, gridWidth, rightX, dblPad + singlePad);
    this.nextLabel.draw(domGrid, gridWidth, rightX, dblPad*2 + singlePad);
    this.next.draw(domGrid, gridWidth, rightX, dblPad*3 + singlePad);

    this.linesLabel.draw(domGrid, gridWidth, leftX, dblPad);
    this.linesDisplay.draw(domGrid, gridWidth, leftX, dblPad + singlePad);
    this.holdLabel.draw(domGrid, gridWidth, leftX, dblPad*2 + singlePad)
    this.hold.draw(domGrid, gridWidth, leftX, dblPad*3 + singlePad)
  }
}
