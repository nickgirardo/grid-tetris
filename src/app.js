
import * as Keyboard from "./keyboard.js";

const GRID_COLS = 10;
const GRID_ROWS = 24;
const aspectRatio = GRID_COLS/GRID_ROWS;

const container = document.querySelector('#tetris-container');

const grid = [];
const cells = [];

let activePiece;
let lastLeft = 0;
let lastRight = 0;
let lastUp = 0;
let lastDown = 0;
let lastCW = 0;
let lastCCW = 0;

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
  {
    shape: [
      [0,0,0,0],
      [1,1,1,1],
      [0,0,0,0],
      [0,0,0,0],
    ],
    originX: 1.5,
    originY: 1.5,
  },
  {
    shape: [
      [1,0,0],
      [1,1,1],
      [0,0,0],
    ],
    originX: 1,
    originY: 1,
  },
  {
    shape: [
      [0,0,1],
      [1,1,1],
      [0,0,0],
    ],
    originX: 1,
    originY: 1,
  },
  {
    shape: [
      [1,1],
      [1,1],
    ],
    originX: 0.5,
    originY: 0.5,
  },
  {
    shape: [
      [0,1,1],
      [1,1,0],
      [0,0,0],
    ],
    originX: 1,
    originY: 1,
  },
  {
    shape: [
      [0,1,0],
      [1,1,1],
      [0,0,0],
    ],
    originX: 1,
    originY: 1,
  },
  {
    shape: [
      [1,1,0],
      [0,1,1],
      [0,0,0],
    ],
    originX: 1,
    originY: 1,
  },
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

function getRotated(piece, rotation) {

  const rot = rotation || piece.rotation;
  const unrotated = tetrominoes[piece.type].shape;
  if(rot === 0)
    return unrotated;

  const rotations = [1, 0, -1, 0];
  const cos = rotations[rot];
  const sin = rotations[rot-1];

  const orX = tetrominoes[piece.type].originX;
  const orY = tetrominoes[piece.type].originY;

  const arr = [];
  for (let i=0; i< unrotated.length; i++) {
    arr.push(new Array(unrotated[i].length).fill(0));
  }

  for (let i=0; i< unrotated.length; i++) {
    for (let j=0; j< unrotated[i].length; j++) {
      if(unrotated[i][j]) {
        const xcomp = (i - orX);
        const ycomp = (j - orY);
        arr[(xcomp*cos) - (ycomp*sin) + orX][(xcomp*sin) + (ycomp*cos) + orY] = 1;
      }
    }
  }
  return arr;

}

function tetrominoPositions() {
  const piecePositions = [];
  const piece = getRotated(activePiece);
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
  function createPiece(type) {
    activePiece = {
      type,
      locX: (GRID_COLS-4)/2,
      locY: 0,
      lastFall: 0,
      rotation: 0,
    }
  }

  function checkGameOver() {
    return (tetrominoPositions()
      .map(p => grid[p])
      .every(a=>a));
  }

  function scoreGrid() {
    const toBeCleared = [];
    for(let i=0; i<GRID_ROWS; i++) {
      const row = grid.slice(i*GRID_COLS,i*GRID_COLS+GRID_COLS);
      if(row.every(a=>a!=0)) {
        toBeCleared.push(i);
      }
    }
    // TODO score based on number of rows to be cleared
    // e.g. 4 to be cleared means tetris

    // TODO test this thoroughly
    grid.splice(toBeCleared[0]*GRID_COLS,toBeCleared.length*GRID_COLS);
    grid.unshift(...new Array(toBeCleared.length*GRID_COLS).fill(0));
  }

  function canMoveLeft() {
    return (tetrominoPositions()
      .map(p => p%GRID_COLS==0 || grid[p-1])
      .every(a=>!a));
  }

  function canMoveRight() {
    return (tetrominoPositions()
      .map(p => p%GRID_COLS==GRID_COLS-1 || grid[p+1])
      .every(a=>!a));
  }

  function canFall() {
    return (tetrominoPositions()
      .map(p => p+GRID_COLS)
      .map(p => p>GRID_ROWS*GRID_COLS || grid[p])
      .every(a=>!a));
  }


  if(!activePiece) {
    createPiece(Math.floor(Math.random()*tetrominoes.length));
    // TODO real game over handling
    if(checkGameOver())
      console.log("GAME OVER!!");
  }

  // Handle input
  // Rotation -> Movement -> Gravity

  if(Keyboard.keys[74] && Keyboard.timestamps[74] > lastCCW) {
    lastCCW = Keyboard.timestamps[74];
    activePiece.rotation += 3;
    activePiece.rotation %= 4;
  }

  if(Keyboard.keys[75] && Keyboard.timestamps[75] > lastCW) {
    lastCW = Keyboard.timestamps[75];
    activePiece.rotation++;
    activePiece.rotation %= 4;
  }

  if(Keyboard.keys[65] && Keyboard.timestamps[65] > lastLeft && canMoveLeft()) {
    lastLeft = Keyboard.timestamps[65];
    activePiece.locX--;
  }

  if(Keyboard.keys[68] && Keyboard.timestamps[68] > lastRight && canMoveRight()) {
    lastRight = Keyboard.timestamps[68];
    activePiece.locX++;
  }

  if(Keyboard.keys[87] && Keyboard.timestamps[87] > lastUp) {
    lastUp = Keyboard.timestamps[87];
    while(canFall()) {
      activePiece.locY++;
    }
    activePiece.lastFall = Infinity;
  }

  if(Keyboard.keys[83]) {
    // TODO Tune this amount to get it feeling right
    activePiece.lastFall += 20;
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
      // This function checks for completed lines and removes them
      scoreGrid();
      activePiece = null;
    }
  }

  draw();
  window.requestAnimationFrame(update);
}

function init() {

  Keyboard.init();

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
