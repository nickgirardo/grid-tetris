
import * as Keyboard from "./keyboard.js";
import Manager from "./entities/manager.js";

const FIELD_WIDTH = 10;
const FIELD_HEIGHT = 24;

let GRID_WIDTH = FIELD_WIDTH + 4;
let GRID_HEIGHT = FIELD_HEIGHT + 4;

const container = document.querySelector('#tetris-container');

let manager = new Manager(newGame);
let cells = [];

function newGame() {
  manager = new Manager(newGame);
  resize(true);
}

function forceRedraw() {
  manager.forceRedraw();
  draw();
}

function draw() {
  manager.draw(cells, GRID_WIDTH);
}

function update() {
  manager.update();

  draw();
  window.requestAnimationFrame(update);
}

function resize(force = false) {
  let windowAspectRatio = window.innerWidth/ window.innerHeight;

  container.style.width = window.innerWidth;
  container.style.height = window.innerHeight;

  const newGridWidth = Math.ceil(GRID_HEIGHT * windowAspectRatio);

  // On resize, avoid rebuilding the dom if we don't need to
  if(force || newGridWidth !== GRID_WIDTH) {
    GRID_WIDTH = newGridWidth;

    const containerEl = document.querySelector('#tetris-container');
    // TODO probably don't need to remove all nodes, just do the difference
    while(containerEl.firstChild) {
      containerEl.removeChild(containerEl.firstChild);
    }

    for(let i = 0; i<GRID_WIDTH*GRID_HEIGHT; i++) {
      const gridCell = document.createElement('div');
      gridCell.className = 'grid-cell grey';
      container.appendChild(gridCell);
    }

    cells = Array.from(document.querySelectorAll('.grid-cell'));

    containerEl.style.setProperty('grid-template-columns', `repeat(${GRID_WIDTH}, 1fr)`);
    containerEl.style.setProperty('grid-template-rows', `repeat(${GRID_HEIGHT}, 1fr)`);
    // TODO explain this line
    containerEl.style.setProperty('font-size', `${cells[0].offsetWidth-1}px`);
  }

  forceRedraw();
}

function handleError(msg, url, row, col, obj) {
  const handlerDiv = document.querySelector('#error-handler');
  const errorMsg = document.querySelector('#error-message');

  Keyboard.stop();
  handlerDiv.style.display = "block"

  if(!!obj && !!obj.stack) {
    const stack = obj.stack.split('\n').map(str=>'\t'+str).join('\n');
    const fullMsg = `${obj.name}: ${obj.message}\n${stack}`;
    console.error(fullMsg);
    errorMsg.innerText = fullMsg;
  } else {
    // Not all browsers have access to obj and obj.stack
    // Although since we rely on css grid this probably won't help much
    const fallbackMsg = `${msg}\n\t${url}:${row}:${col}\n\t(fallback error handler)`;
    console.error(fallbackMsg);
    errorMsg.innerText = fallbackMsg;
  }
}

function init() {

  window.onerror = handleError;
  Keyboard.init();

  resize();
  window.addEventListener('resize', resize);

  update();
}

init();
