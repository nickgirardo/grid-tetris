
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

const classNames = [
  'grid-cell',
  'grid-cell cyan',
  'grid-cell blue',
  'grid-cell orange',
  'grid-cell yellow',
  'grid-cell green',
  'grid-cell pink',
  'grid-cell red',
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
    (tetrominoPositions(activePiece)
      .filter(p => p >= 0 && p < GRID_ROWS*GRID_COLS)
      .forEach(t => cells[t].className = classNames[type+1]));
  }
}

function getRotated(piece, rotation) {

  const unrotated = tetrominoes[piece.type].shape;
  if(rotation === 0)
    return unrotated;

  const rotations = [1, 0, -1, 0];
  const cos = rotations[rotation];
  const sin = rotations[rotation-1];

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

function tetrominoPositions(tetromino) {
  const piecePositions = [];
  const piece = getRotated(tetromino, tetromino.rotation);
  const startX = tetromino.locX;
  const startY = tetromino.locY;

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
  function createPiece(type, locX=(GRID_COLS-4)/2, locY=0, rotation=0) {
    return {
      type,
      locX,
      locY,
      rotation,
      lastFall: 0,
    }
  }

  function checkGameOver() {
    return (tetrominoPositions(activePiece)
      .map(p => grid[p])
      .every(a=>a));
  }

  function scoreGrid() {
    let rowsCleared = 0;
    for(let i=0; i<GRID_ROWS; i++) {
      const row = grid.slice(i*GRID_COLS,i*GRID_COLS+GRID_COLS);
      if(row.every(a=>a!=0)) {
        grid.splice(i*GRID_COLS, GRID_COLS);
        grid.unshift(...new Array(GRID_COLS).fill(0));
        rowsCleared++;
      }
    }

    return rowsCleared;
  }

  function canRotCW() {
    // All pieces except I
    const wallKick = [
      [[0,0], [-1,0], [-1,-1], [0,2], [-1,2]],
      [[0,0], [-1,0], [-1,1], [0,-2], [-1,-2]],
      [[0,0], [1,0], [1,-1], [0,2], [1,2]],
      [[0,0], [1,0], [1,1], [0,-2], [1,-2]],
    ];

    // For I only
    const wallKickI = [
      [[0,0], [1,0], [-2,0], [1,-2], [-2,1]],
      [[0,0], [-2,0], [1,0], [-2,-1], [1,2]],
      [[0,0], [-1,0], [2,0], [-1,2], [2,-1]],
      [[0,0], [2,0], [-1,0], [2,1], [-1,-2]],
    ];

    const targetRot = (activePiece.rotation+3)%4;
    const kickArr = activePiece.type === 0 ? wallKickI : wallKick;

    return canRotate(targetRot, kickArr);
  }

  function canRotCCW() {
    const wallKick = [
      [[0,0], [1,0], [1,-1], [0,2], [1,2]],
      [[0,0], [-1,0], [-1,1], [0,-2], [-1,-2]],
      [[0,0], [-1,0], [-1,-1], [0,2], [-1,2]],
      [[0,0], [1,0], [1,1], [0,-2], [1,-2]],
    ];

    const wallKickI = [
      [[0,0], [2,0], [-1,0], [2,1], [-1,-2]],
      [[0,0], [1,0], [-2,0], [1,-2], [-2,1]],
      [[0,0], [-2,0], [1,0], [-2,-1], [1,2]],
      [[0,0], [-1,0], [2,0], [-1,2], [2,-1]],
    ];

    const targetRot = (activePiece.rotation+1)%4;
    const kickArr = activePiece.type === 0 ? wallKickI : wallKick;

    return canRotate(targetRot, kickArr);
  }

  function canRotate(targetRot, kickArr) {
    function test(testPiece) {
      const pos = tetrominoPositions(testPiece);
      const xPos = pos.map(p=>p%GRID_COLS);
      return (pos.map(p => p>GRID_ROWS*GRID_COLS || grid[p]).every(a => !a)
        && !(xPos.includes(0) && xPos.includes(GRID_COLS-1)));
    }

    const kickRow = kickArr[targetRot];
    for(let i=0; i<kickRow.length; i++) {
      const [xKick, yKick] = kickRow[i];
      const piece = createPiece(activePiece.type,
        activePiece.locX+xKick,
        activePiece.locY+yKick,
        targetRot);
      if(test(piece))
        return [true, kickRow[i]];
    }

    // The inner array here could be anything
    return [false, [0,0]];

  }

  function canMoveLeft() {
    return (tetrominoPositions(activePiece)
      .map(p => p%GRID_COLS==0 || grid[p-1])
      .every(a=>!a));
  }

  function canMoveRight() {
    return (tetrominoPositions(activePiece)
      .map(p => p%GRID_COLS==GRID_COLS-1 || grid[p+1])
      .every(a=>!a));
  }

  function canFall() {
    return (tetrominoPositions(activePiece)
      .map(p => p+GRID_COLS)
      .map(p => p>=GRID_ROWS*GRID_COLS || grid[p])
      .every(a=>!a));
  }


  if(!activePiece) {
    activePiece = createPiece(Math.floor(Math.random()*tetrominoes.length));
    // TODO real game over handling
    if(checkGameOver())
      console.log("GAME OVER!!");
  }

  // Handle input
  // Rotation -> Movement -> Gravity

  if(Keyboard.keys[74] && Keyboard.timestamps[74] > lastCW) {
    lastCW = Keyboard.timestamps[74];
    const [canRot, [xKick, yKick]] = canRotCW();
    if(canRot) {
      activePiece.locX += xKick;
      activePiece.locY += yKick;
      activePiece.rotation += 3;
      activePiece.rotation %= 4;
    }
  }

  if(Keyboard.keys[75] && Keyboard.timestamps[75] > lastCCW) {
    lastCCW = Keyboard.timestamps[75];
    const [canRot, [xKick, yKick]] = canRotCCW();
    if(canRot) {
      activePiece.locX += xKick;
      activePiece.locY += yKick;
      activePiece.rotation++;
      activePiece.rotation %= 4;
    }
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
      tetrominoPositions(activePiece).forEach(t => grid[t] = type+1);
      // This function checks for completed lines and removes them
      const rowsCleared = scoreGrid();
      if(rowsCleared)
        console.log(`Nice! You just cleared ${rowsCleared} row${rowsCleared === 1 ? '' : 's'}!`);
      activePiece = null;
    }
  }

  draw();
  window.requestAnimationFrame(update);
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

  for(let i = 0; i<GRID_COLS*GRID_ROWS; i++) {
    const gridCell = document.createElement('div');
    gridCell.className = 'grid-cell';
    container.appendChild(gridCell);

    grid[i] = 0;
  }
  cells.push(...Array.from(document.querySelectorAll('.grid-cell')));

  const containerEl = document.querySelector('#tetris-container');
  containerEl.style.setProperty('grid-template-columns', `repeat(${GRID_COLS}, 1fr)`);
  containerEl.style.setProperty('grid-template-rows', `repeat(${GRID_ROWS}, 1fr)`);

  resize();
  window.addEventListener('resize', resize);

  update();
}

init();
