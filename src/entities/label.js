

export default class Label {

  constructor(text, width=text.length) {
    this.redraw = true;

    this.width = width;
    this.height = 1;

    if(width > text.length) {
      this.text = text.concat(Array(width-text.length).fill(' ').join(''))
    } else {
      this.text = text.split('').slice(0,width).join('');
    }
    
  }

  draw(domGrid, gridWidth, offsetX=0, offsetY=0) {
    if(!this.redraw)
      return

    this.redraw = false;

    const start = (offsetY)*gridWidth + offsetX;
    this.text.split('').forEach((ch, ix) => {
      domGrid[start+ix].className = 'grid-cell';
      domGrid[start+ix].innerText = ch;
    });
  }

}
