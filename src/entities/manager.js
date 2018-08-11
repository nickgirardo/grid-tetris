
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
    this.field.score();

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
    const singlePad = 1;
    const dblPad = 2;

    const startX = dblPad;
    const fieldX = startX;
    const uiX = fieldX + this.field.width + dblPad;

    // TODO way too many magic numbers
    this.field.draw(domGrid, gridWidth, fieldX, dblPad);
    this.tetromino.draw(domGrid, gridWidth, fieldX, dblPad);

    this.nextLabel.draw(domGrid, gridWidth, uiX, dblPad);
    this.next.draw(domGrid, gridWidth, uiX, dblPad+this.nextLabel.height+singlePad);
    this.holdLabel.draw(domGrid, gridWidth, uiX, dblPad+this.nextLabel.height+singlePad+this.next.height+dblPad)
    this.hold.draw(domGrid, gridWidth, uiX, dblPad+dblPad+this.next.height+dblPad+this.holdLabel.height+singlePad)
  }
}
