
import gridClassNames from "../data/gridClassNames.js";

export default class field {

  constructor(manager, width, height, x, y) {
    this.manager = manager;

    this.drawX = x;
    this.drawY = y;

    this.width = width;
    this.height = height;

    this.grid = [];

    for(let i = 0; i<height; i++) {
      this.grid.push(new Array(width).fill(0));
    }
  }

  isOpen(x, y) {
    return (x >= 0) && (x < this.width) && (y < this.height) && !this.grid[y][x];
  }

  addTetromino(tetromino) {
    tetromino.positions.forEach(p => {
      if(p.y >= 0 && p.y < this.grid.length && p.x >= 0 && p.x < this.grid[p.y].length)
        this.grid[p.y][p.x] = tetromino.type + 1;
    });
  }

  score() {
    let rowsCleared = 0;
    for(let i=0; i<this.height; i++) {
      if(this.grid[i].every(a=>a!=0)) {
        this.grid.splice(i, 1);
        this.grid.unshift(new Array(this.width).fill(0));
        rowsCleared++;
      }
    }

    return rowsCleared;
  }

  draw(domGrid, gridWidth) {
    const tetromino = this.manager.tetromino;
    const centerX = Math.floor(gridWidth/2);
    for(let i = 0; i<this.height; i++) {
      for(let j = 0; j<this.width; j++) {
        // Make sure not to overdraw active tetromino
        if(tetromino && tetromino.positions.includes({x: j, y: i}))
          continue;
        domGrid[(i+this.drawY)*gridWidth + (this.drawX + centerX) + j].className = gridClassNames[this.grid[i][j]];
      }
    }
  }

}
