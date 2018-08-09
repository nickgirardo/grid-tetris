
export default class EmptyDisplay {

  constructor() {
    this.isEmpty = true;

    this.width = 4;
    this.height = 4;
    this.classNameBg = 'grid-cell';
  }

  draw(domGrid, gridWidth, offsetX=0, offsetY=0) {
    // Only need to draw empty bg
    for(let i=0; i<this.height; i++) {
      for(let j=0; j<this.width; j++) {
        domGrid[(i+offsetY)*gridWidth + offsetX + j].className = this.classNameBg;
      }
    }
  }

}
