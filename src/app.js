
import * as Keyboard from "./keyboard.js";
import Manager from "./entities/manager.js";

const GRID_COLS = 10;
const GRID_ROWS = 24;
const aspectRatio = GRID_COLS/GRID_ROWS;

const container = document.querySelector('#tetris-container');

const manager = new Manager();
const cells = [];

function draw() {
  // TODO
  manager.draw(cells, GRID_COLS);
}

function update() {
  manager.update();

  draw();
  window.requestAnimationFrame(update);
}

function resize() {
  // Among other things, this method makes sure the game is always 16/9
  const scaleFactor = 0.9;

  let wWidth = window.innerWidth;
  let wHeight = window.innerHeight;

  let windowAspectRatio = wWidth/ wHeight;

  if(windowAspectRatio > aspectRatio) {
    container.style.width = wHeight * aspectRatio * scaleFactor;
    container.style.height = wHeight * scaleFactor;
  } else {
    container.style.width = wWidth * scaleFactor;
    container.style.height = wWidth / aspectRatio * scaleFactor;
  };
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

  const containerEl = document.querySelector('#tetris-container');
  containerEl.style.setProperty('grid-template-columns', `repeat(${GRID_COLS}, 1fr)`);
  containerEl.style.setProperty('grid-template-rows', `repeat(${GRID_ROWS}, 1fr)`);

  for(let i = 0; i<GRID_COLS*GRID_ROWS; i++) {
    const gridCell = document.createElement('div');
    gridCell.className = 'grid-cell';
    container.appendChild(gridCell);
  }
  cells.push(...Array.from(document.querySelectorAll('.grid-cell')));

  resize();
  window.addEventListener('resize', resize);

  update();
}

init();
