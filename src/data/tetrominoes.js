
// CW
// All pieces except I
const wallKickCW = [
  [[0,0], [-1,0], [-1,-1], [0,2], [-1,2]],
  [[0,0], [-1,0], [-1,1], [0,-2], [-1,-2]],
  [[0,0], [1,0], [1,-1], [0,2], [1,2]],
  [[0,0], [1,0], [1,1], [0,-2], [1,-2]],
];

// For I only
const wallKickCWI = [
  [[0,0], [1,0], [-2,0], [1,-2], [-2,1]],
  [[0,0], [-2,0], [1,0], [-2,-1], [1,2]],
  [[0,0], [-1,0], [2,0], [-1,2], [2,-1]],
  [[0,0], [2,0], [-1,0], [2,1], [-1,-2]],
];

// CCW
// All pieces except I
const wallKickCCW = [
  [[0,0], [1,0], [1,-1], [0,2], [1,2]],
  [[0,0], [-1,0], [-1,1], [0,-2], [-1,-2]],
  [[0,0], [-1,0], [-1,-1], [0,2], [-1,2]],
  [[0,0], [1,0], [1,1], [0,-2], [1,-2]],
];

// For I only
const wallKickCCWI = [
  [[0,0], [2,0], [-1,0], [2,1], [-1,-2]],
  [[0,0], [1,0], [-2,0], [1,-2], [-2,1]],
  [[0,0], [-2,0], [1,0], [-2,-1], [1,2]],
  [[0,0], [-1,0], [2,0], [-1,2], [2,-1]],
];

// TODO keep both shape formats?  Probably not
export default [
  {
    shape: [
      {x: 0, y: 1},
      {x: 1, y: 1},
      {x: 2, y: 1},
      {x: 3, y: 1},
    ],
    origin: {x: 1.5, y: 1.5},
    className: 'grid-cell cyan',
    wallKickCW: wallKickCWI,
    wallKickCCW: wallKickCCWI,
  },
  {
    shape: [
      {x: 0, y: 0},
      {x: 0, y: 1},
      {x: 1, y: 1},
      {x: 2, y: 1},
    ],
    origin: {x: 1, y: 1},
    className: 'grid-cell blue',
    wallKickCW: wallKickCW,
    wallKickCCW: wallKickCCW,
  },
  {
    shape: [
      {x: 2, y: 0},
      {x: 0, y: 1},
      {x: 1, y: 1},
      {x: 2, y: 1},
    ],
    origin: {x: 1, y: 1},
    className: 'grid-cell orange',
    wallKickCW: wallKickCW,
    wallKickCCW: wallKickCCW,
  },
  {
    shape: [
      {x: 0, y: 0},
      {x: 1, y: 0},
      {x: 0, y: 1},
      {x: 1, y: 1},
    ],
    origin: {x: 0.5, y: 0.5},
    className: 'grid-cell yellow',
    wallKickCW: wallKickCW,
    wallKickCCW: wallKickCCW,
  },
  {
    shape: [
      {x: 1, y: 0},
      {x: 2, y: 0},
      {x: 0, y: 1},
      {x: 1, y: 1},
    ],
    origin: {x: 1, y: 1},
    className: 'grid-cell green',
    wallKickCW: wallKickCW,
    wallKickCCW: wallKickCCW,
  },
  {
    shape: [
      {x: 1, y: 0},
      {x: 0, y: 1},
      {x: 1, y: 1},
      {x: 2, y: 1},
    ],
    origin: {x: 1, y: 1},
    className: 'grid-cell pink',
    wallKickCW: wallKickCW,
    wallKickCCW: wallKickCCW,
  },
  {
    shape: [
      {x: 0, y: 0},
      {x: 1, y: 0},
      {x: 1, y: 1},
      {x: 2, y: 1},
    ],
    origin: {x: 1, y: 1},
    className: 'grid-cell red',
    wallKickCW: wallKickCW,
    wallKickCCW: wallKickCCW,
  },
]
