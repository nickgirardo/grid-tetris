
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

    this.isGameOver = false;

    // Has a piece been held since a piece has fallen?
    // This lets us know if the player can swap with the hold
    this.justHeld = false;
    this.lines = 0;
    this.score = 0;

    // TODO not hardcoded
    this.field = new Field(this, 10, 24, -5, 2);
    this.tetromino = new Tetromino(this, this.field, this.randFromBag());

    this.next = new TetrominoDisplay(this.randFromBag(), 7, 7);
    this.hold = new EmptyDisplay(-12, 7); // Game starts with no pieces held

    this.linesDisplay = new Label(this.lines.toString(), 5, -12, 3);

    this.scoreDisplay = new Label(this.score.toString(), 5, 7, 3);

    this.scene = [
      this.field,
      this.tetromino,
      this.next,
      this.hold,
      this.scoreDisplay,
      this.linesDisplay,
    ];

    this.scene.push(new Label('LINES', 5, -12, 2));
    this.scene.push(new Label('SCORE', 5, 7, 2));
    this.scene.push(new Label('NEXT', 5, 7, 5));
    this.scene.push(new Label('HOLD', 5, -12, 5));

  }

  update() {
    if(this.isGameOver)
      return;

    this.scene.filter(e => typeof(e.update) === "function")
      .forEach(e => e.update());
  }

  // TODO needs game over check
  tetrominoLands(tetromino) {
    this.justHeld = false;

    this.field.addTetromino(tetromino);
    const linesCleared = this.field.score();

    if(linesCleared) {
      this.lines += linesCleared;
      this.destroy(this.linesDisplay);
      this.linesDisplay = new Label(this.lines.toString(), 5, this.linesDisplay.drawX, this.linesDisplay.drawY);
      this.scene.push(this.linesDisplay);

      const scoreIncrease = [0, 100, 200, 400, 600];
      this.score += scoreIncrease[linesCleared];
      this.destroy(this.scoreDisplay);
      this.scoreDisplay = new Label(this.score.toString(), 5, this.scoreDisplay.drawX, this.scoreDisplay.drawY);
      this.scene.push(this.scoreDisplay);
    }

    this.destroy(tetromino);
    this.tetromino = new Tetromino(this, this.field, this.next.type);
    this.scene.push(this.tetromino);

    if(!this.tetromino.positions.every(p => this.field.isOpen(p.x, p.y))) {
      this.gameOver();
    }

    this.destroy(this.next);
    this.next = new TetrominoDisplay(this.randFromBag(), this.next.drawX, this.next.drawY);
    this.scene.push(this.next);
  }

  destroy(entity) {
    const ix = this.scene.indexOf(entity);
    if(ix === -1) {
      console.error('Entity not found for deletion');
      return;
    }
    this.scene.splice(ix, 1);
  }


  gameOver() {
    this.isGameOver = true;
  }

  tetrominoHold() {
    if(this.justHeld)
      return;

    if(this.hold.isEmpty) {
      // No pieces in the hold, take the next piece

      this.destroy(this.hold);
      this.hold = new TetrominoDisplay(this.tetromino.type, this.hold.drawX, this.hold.drawY);
      this.scene.push(this.hold);

      this.destroy(this.tetromino);
      this.tetromino = new Tetromino(this, this.field, this.next.type);
      this.scene.push(this.tetromino);

      this.destroy(this.next);
      this.next = new TetrominoDisplay(this.randFromBag(), this.next.drawX, this.next.drawY);
      this.scene.push(this.next);
    } else {
      const heldType = this.hold.type;
      this.destroy(this.hold);
      this.hold = new TetrominoDisplay(this.tetromino.type, this.hold.drawX, this.hold.drawY);
      this.scene.push(this.hold);

      this.destroy(this.tetromino);
      this.tetromino = new Tetromino(this, this.field, heldType);
      this.scene.push(this.tetromino);
    }

    this.justHeld = true;
  }

  forceRedraw() {
    this.scene.filter(e => typeof(e.redraw) === "boolean")
      .forEach(e => e.redraw = true);
  }

  draw(domGrid, gridWidth) {
    this.scene.filter(e => typeof(e.draw) === "function")
      .forEach(e => e.draw(domGrid, gridWidth));
  }
}
