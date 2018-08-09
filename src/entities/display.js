
import tetrominoData from "../data/tetrominoes.js";

export default class TetrominoDisplay {

  constructor(type) {
    this.isEmpty = false;

    this.width = 4;
    this.height = 4;
    this.classNameBg = 'grid-cell';

    this.type = type;
    // TODO center
    this.positions = tetrominoData[type].shape;
    this.className = tetrominoData[type].className;
  }

  draw(domGrid, gridWidth, offsetX=0, offsetY=0) {
    // First draw empty background area to display tetromino within
    for(let i=0; i<this.height; i++) {
      for(let j=0; j<this.width; j++) {
        domGrid[(i+offsetY)*gridWidth + offsetX + j].className = this.classNameBg;
      }
    }

    this.positions.forEach(p => {
      domGrid[(p.y+offsetY)*gridWidth + offsetX + p.x].className = this.className;
    });

  }
}
