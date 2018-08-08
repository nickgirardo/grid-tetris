
import * as Keyboard from "../keyboard.js";
import tetrominoData from "../data/tetrominoes.js";

export default class Tetromino {

  constructor(manager, field, type) {

    this.manager = manager;
    this.field = field;
    this.type = type;

    this.positions = tetrominoData[type].shape;
    this.origin = tetrominoData[type].origin;
    this.className = tetrominoData[type].className;

    this.rotateCW = {
      rotOffset: 1, // 1 represents 90 deg
      wallKick: tetrominoData[type].wallKickCW,
      rotateFn: positionArr => (positionArr
          .map(p => ({x: p.x-this.origin.x, y: p.y-this.origin.y}))
          .map(p => ({x: -p.y, y: p.x}))
          .map(p => ({x: p.x+this.origin.x, y: p.y+this.origin.y}))),
    }

    this.rotateCCW = {
      rotOffset: 3, // 3 represents 3 90 deg rotations (i.e. one -90 deg rotation)
      wallKick: tetrominoData[type].wallKickCCW,
      rotateFn: positionArr => (positionArr
          .map(p => ({x: p.x-this.origin.x, y: p.y-this.origin.y}))
          .map(p => ({x: p.y, y: -p.x}))
          .map(p => ({x: p.x+this.origin.x, y: p.y+this.origin.y}))),
    }

    this.rotation = 0;
    this.lastFall = 0;

    this.lastLeft = Keyboard.timestamps[65] || Date.now();
    this.lastRight = Keyboard.timestamps[68] || Date.now();
    this.lastUp = Keyboard.timestamps[87] || Date.now();
    this.lastDown = Keyboard.timestamps[83] || Date.now();
    this.lastCW = Keyboard.timestamps[74] || Date.now();
    this.lastCCW = Keyboard.timestamps[75] || Date.now();
  }

  center() {
    this.shift(Math.floor((this.field.width/2)-this.origin.x-0.5), 0);
  }

  rotate({rotOffset, rotateFn, wallKick}) {
    const pureShift = (positionArr, x, y) => positionArr.map(p => ({x: p.x+x, y: p.y+y}));

    const check = ([x, y]) => (pureShift(rotatedPos, x, y)
      .map(p => this.field.isOpen(p.x, p.y))
      .every(a=>a));

    const targetRot = (this.rotation + rotOffset) % 4;
    const wallKickRow = wallKick[targetRot];
    const rotatedPos = rotateFn(this.positions);

    const kick = wallKickRow.find(check);

    // No valid rotation found
    if(!kick)
      return false;

    this.positions = rotatedPos;
    this.shift(kick[0], kick[1]);
    this.rotation = targetRot;

    // Successfully rotated
    return true;
  }

  canMoveLeft(amount = 1) {
    return (this.positions
      .map(p => this.field.isOpen(p.x-amount, p.y))
      .every(a=>a));
  }

  shift(xShift, yShift) {
    this.positions = this.positions.map(p => ({x: p.x+xShift, y: p.y+yShift}));
    this.origin = {x: this.origin.x + xShift, y: this.origin.y + yShift};
  }

  moveLeft() {
    this.shift(-1, 0);
  }

  canMoveRight(amount = 1) {
    return (this.positions
      .map(p => this.field.isOpen(p.x+amount, p.y))
      .every(a=>a));
  }

  moveRight() {
    this.shift(1, 0);
  }

  canFall() {
    return (this.positions
      .map(p => this.field.isOpen(p.x, p.y+1))
      .every(a=>a));
  }

  fall() {
    this.shift(0, 1);
  }

  update() {

    if(Keyboard.keys[75] && Keyboard.timestamps[75] > this.lastCW) {
      this.lastCW = Keyboard.timestamps[75];
      this.rotate(this.rotateCCW);
    }

    if(Keyboard.keys[74] && Keyboard.timestamps[74] > this.lastCCW) {
      this.lastCCW = Keyboard.timestamps[74];
      this.rotate(this.rotateCW);
    }

    if(Keyboard.keys[65] && Keyboard.timestamps[65] > this.lastLeft && this.canMoveLeft()) {
      this.lastLeft = Keyboard.timestamps[65];
      this.moveLeft();
    }

    if(Keyboard.keys[68] && Keyboard.timestamps[68] > this.lastRight && this.canMoveRight()) {
      this.lastRight = Keyboard.timestamps[68];
      this.moveRight();
    }

    // Hard drop
    if(Keyboard.keys[87] && Keyboard.timestamps[87] > this.lastUp) {
      this.lastUp = Keyboard.timestamps[87];
      while(this.canFall()) {
        this.fall();
      }
      this.lastFall = Infinity;
    }

    // Soft drop
    if(Keyboard.keys[83]) {
      // TODO Tune this amount to get it feeling right
      this.lastFall += 20;
    }


    // Advance piece
    this.lastFall++;
    if(this.lastFall > 30) {
      this.lastFall = 0;
      if(this.canFall()) {
        this.fall();
      } else {
        this.manager.tetrominoLands(this);
      }
    }
  }

  draw(domGrid, gridWidth, offsetX=0, offsetY=0) {
    this.positions.forEach(p => {
      const drawTarget = p.y*(gridWidth+offsetY) + offsetX + p.x;
      if(0 <= drawTarget && drawTarget < domGrid.length)
        domGrid[drawTarget].className = this.className;
    });
  }

}
