
import * as Keyboard from "../keyboard.js";

import Tetromino from "./tetromino.js";
import Field from "./field.js";
import TetrominoDisplay from "./display.js";
import EmptyDisplay from "./emptyDisplay.js";
import Label from "./label.js";

export default class Manager {

  constructor(newGame) {
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

    this.newGame = newGame;
    this.isGameOver = false;

    // Has a piece been held since a piece has fallen?
    // This lets us know if the player can swap with the hold
    this.justHeld = false;
    this.level = 1;
    this.best = localStorage.getItem('best') || 0;
    this.lines = 0;
    this.score = 0;

    // TODO not hardcoded?
    this.field = new Field(this, 10, 26, 2, -5, 2);
    this.tetromino = new Tetromino(this, this.field, this.randFromBag());

    this.next = new TetrominoDisplay(this.randFromBag(), 7, 10);
    this.hold = new EmptyDisplay(-12, 10); // Game starts with no pieces held

    // Dynamic labels
    this.levelLabel = new Label(this.level.toString(), -12, 3, 5);
    this.linesLabel = new Label(this.lines.toString(), -12, 6, 5);
    this.bestLabel = new Label(this.best.toString(), 7, 3, 5);
    this.scoreLabel = new Label(this.score.toString(), 7, 6, 5);

    this.scene = [
      this.field,
      this.tetromino,
      this.next,
      this.hold,
      this.levelLabel,
      this.linesLabel,
      this.bestLabel,
      this.scoreLabel,
    ];

    // Static labels
    this.scene.push(new Label('LEVEL', -12, 2, 5));
    this.scene.push(new Label('LINES', -12, 5, 5));
    this.scene.push(new Label('BEST', 7, 2, 5));
    this.scene.push(new Label('SCORE', 7, 5, 5));
    this.scene.push(new Label('NEXT', 7, 8, 5));
    this.scene.push(new Label('HOLD', -12, 8, 5));
  }

  update() {
    if(this.isGameOver) {
      this.checkNewGame();
      return;
    }

    this.scene.filter(e => typeof(e.update) === "function")
      .forEach(e => e.update());
  }

  tetrominoLands(tetromino) {
    // If any of the pieces of the landed tetromino are in the hidden
    // area of the field, the game is over!!
    if(!tetromino.positions.every(p => p.y > this.field.hidden)) {
      this.gameOver();
      return;
    }

    this.justHeld = false;

    this.field.addTetromino(tetromino);
    const linesCleared = this.field.score();

    if(linesCleared) {
      this.lines += linesCleared;

      const scoreIncrease = [0, 100, 200, 400, 600];
      this.score += scoreIncrease[linesCleared];

      this.level = Math.floor(this.lines / 10) + 1;

      this.updateLabels();
    }

    this.destroy(tetromino);
    this.tetromino = new Tetromino(this, this.field, this.next.type);
    this.scene.push(this.tetromino);

    this.destroy(this.next);
    this.next = new TetrominoDisplay(this.randFromBag(), this.next.drawX, this.next.drawY);
    this.scene.push(this.next);
  }

  updateLabels() {
    this.destroy(this.linesLabel);
    this.linesLabel = new Label(this.lines.toString(), this.linesLabel.drawX, this.linesLabel.drawY, 5);
    this.scene.push(this.linesLabel);

    this.destroy(this.levelLabel);
    this.levelLabel = new Label(this.level.toString(), this.levelLabel.drawX, this.levelLabel.drawY, 5);
    this.scene.push(this.levelLabel);

    this.destroy(this.scoreLabel);
    this.scoreLabel = new Label(this.score.toString(), this.scoreLabel.drawX, this.scoreLabel.drawY, 5);
    this.scene.push(this.scoreLabel);

    if(this.score > this.best) {
      this.destroy(this.bestLabel);
      this.bestLabel = new Label(this.score.toString(), this.bestLabel.drawX, this.bestLabel.drawY, 5);
      this.scene.push(this.bestLabel);
    }
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

    if(this.score > this.best)
      localStorage.setItem('best', this.score);

    this.scene.push(new Label("GAME OVER", -5, 5))
    this.scene.push(new Label("ENTER TO", -5, 7))
    this.scene.push(new Label("RESTART", -5, 8))
  }

  checkNewGame() {
    // Restart with 'enter' pressed down
    if(Keyboard.keys[13])
      this.newGame();
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
