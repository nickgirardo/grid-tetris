

export default class Label {

  constructor(text, x, y, width=text.length) {
    this.redraw = true;

    this.drawX = x;
    this.drawY = y;

    this.width = width;
    this.height = 1;

    if(width > text.length) {
      this.text = text.concat(Array(width-text.length).fill(' ').join(''))
    } else {
      this.text = text.split('').slice(0,width).join('');
    }

  }

  draw(domGrid, gridWidth) {
    if(!this.redraw)
      return

    this.redraw = false;

    const centerX = Math.floor(gridWidth/2);

    const start = (this.drawY)*gridWidth + this.drawX + centerX;
    this.text.split('').forEach((ch, ix) => {
      domGrid[start+ix].className = 'grid-cell';
      domGrid[start+ix].innerText = ch;
    });
  }

}
