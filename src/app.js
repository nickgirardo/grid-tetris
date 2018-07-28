const GRID_COLS = 10;
const GRID_ROWS = 24;
const aspectRatio = GRID_COLS/GRID_ROWS;

const container = document.querySelector('#tetris-container');

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

// Get a reference to a style defined in a loaded stylesheet
function getStyle(selector) {
  for(let i = 0; i<document.styleSheets.length; i++) {
    const rules = document.styleSheets[i].cssRules;
    for(let j = 0; rules.length; j++) {
      if(rules[j].selectorText === selector)
        return rules[j];
    }
  }

  // Not found
  return undefined;
}

function init() {

  for(let i = 0; i<GRID_COLS*GRID_ROWS; i++) {
    const gridCell = document.createElement('div');
    gridCell.className = 'grid-cell';
    container.appendChild(gridCell);
  }

  const containerStyle = getStyle('#tetris-container')
  containerStyle.style.setProperty('grid-template-columns', `repeat(${GRID_COLS}, 1fr)`);
  containerStyle.style.setProperty('grid-template-rows', `repeat(${GRID_ROWS}, 1fr)`);

  resize();
  window.addEventListener('resize', resize);
}

init();
