
import tetrominoData from "../data/tetrominoes.js";

export default class TetrominoDisplay {

  constructor(type, x, y) {
    this.isEmpty = false;
    this.redraw = true;

    this.drawX = x;
    this.drawY = y;

    this.width = 5;
    this.height = 5;
    this.classNameBg = 'grid-cell';

    this.type = type;
    this.positions = tetrominoData[type].shape;
    this.className = tetrominoData[type].className;

    this.center(tetrominoData[type].origin);
  }

  center(origin) {
    this.shift(Math.floor(this.width/2 - origin.x), Math.floor(this.height/2 - origin.y));
  }

  shift(xShift, yShift) {
    this.positions = this.positions.map(p => ({x: p.x+xShift, y: p.y+yShift}));
  }

  draw(domGrid, gridWidth) {
    if(!this.redraw)
      return;

    this.redraw = false;

    const centerX = Math.floor(gridWidth/2);

    // First draw empty background area to display tetromino within
    for(let i=0; i<this.height; i++) {
      for(let j=0; j<this.width; j++) {
        const target = (i+this.drawY)*gridWidth + (this.drawX + centerX) + j;
        domGrid[target].className = this.classNameBg;
      }
    }

    this.positions.forEach(p => {
      domGrid[(p.y+this.drawY)*gridWidth + (this.drawX + centerX) + p.x].className = this.className;
    });

  }
}
