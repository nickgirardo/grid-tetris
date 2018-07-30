const GRID_COLS = 10;
const GRID_ROWS = 24;
const aspectRatio = GRID_COLS/GRID_ROWS;

const container = document.querySelector('#tetris-container');

const grid = [];
const cells = [];

let activePiece;

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

const classNames = [
  'grid-cell',
  'grid-cell red',
  'grid-cell blue',
  'grid-cell green',
  'grid-cell orange',
  'grid-cell yellow',
  'grid-cell pink',
  'grid-cell cyan',
];

const tetrominoes = [
  [[1,1,1,1],[0,0,0,0]],
  [[0,1,1,0],[0,1,1,0]],
  [[1,1,1,0],[0,0,1,0]],
  [[1,1,1,0],[0,1,0,0]],
  [[1,1,1,0],[0,0,1,0]],
  [[0,1,1,0],[0,0,1,1]],
  [[0,1,1,0],[1,1,0,0]],
]

function draw() {
  cells.forEach((cell,i) => {
    cell.className = classNames[grid[i]];
  });

  if(activePiece) {
    const type = activePiece.type;
    tetrominoPositions().forEach(t => cells[t].className = classNames[type+1]);
  }
}

function createPiece(type) {
  activePiece = {
    type,
    locX: (GRID_COLS-4)/2,
    locY: 0,
    lastFall: 0,
  }
}

function tetrominoPositions() {
  const piecePositions = [];
  const piece = tetrominoes[activePiece.type];
  const startX = activePiece.locX;
  const startY = activePiece.locY;

  for(let i=0; i<piece.length; i++) {
    for(let j=0; j<piece[i].length; j++) {
      if(piece[i][j]) {
        const currCell = (i+startY)*GRID_COLS+(j+startX);
        piecePositions.push(currCell);
      }
    }
  }

  return piecePositions;
}

function update() {
  draw();

  if(!activePiece) {
    createPiece(Math.floor(Math.random()*tetrominoes.length));
  }

  function canFall() {
    return (tetrominoPositions()
      .map(p => p+GRID_COLS)
      .map(p => p>GRID_ROWS*GRID_COLS || grid[p])
      .every(a=>!a));
  }

  // Advance piece
  activePiece.lastFall++;
  if(activePiece.lastFall > 30) {
    activePiece.lastFall = 0;
    if(canFall()) {
      activePiece.locY++;
    } else {
      const type = activePiece.type;
      tetrominoPositions().forEach(t => grid[t] = type+1);
      activePiece = null;
    }
  }

  window.requestAnimationFrame(update);
}

function init() {

  for(let i = 0; i<GRID_COLS*GRID_ROWS; i++) {
    const gridCell = document.createElement('div');
    gridCell.className = 'grid-cell';
    container.appendChild(gridCell);

    grid[i] = 0;
  }
  cells.push(...Array.from(document.querySelectorAll('.grid-cell')));

  const containerStyle = getStyle('#tetris-container')
  containerStyle.style.setProperty('grid-template-columns', `repeat(${GRID_COLS}, 1fr)`);
  containerStyle.style.setProperty('grid-template-rows', `repeat(${GRID_ROWS}, 1fr)`);

  resize();
  window.addEventListener('resize', resize);

  update();
}

init();
