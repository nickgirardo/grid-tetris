
export default class EmptyDisplay {

  constructor(x, y) {
    this.isEmpty = true;
    this.redraw = true;

    this.drawX = x;
    this.drawY = y;

    this.width = 5;
    this.height = 5;
    this.classNameBg = 'grid-cell';
  }

  draw(domGrid, gridWidth) {
    if(!this.redraw)
      return;

    this.redraw = false;

    const centerX = Math.floor(gridWidth/2);

    // Only need to draw empty bg
    for(let i=0; i<this.height; i++) {
      for(let j=0; j<this.width; j++) {
        domGrid[(i+this.drawY)*gridWidth + (this.drawX + centerX) + j].className = this.classNameBg;
      }
    }
  }

}
