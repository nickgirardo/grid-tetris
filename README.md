# Grid Tetris
Tetris with display handled through [CSS grid](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Grid_Layout).

[Play here!](https://nickgirardo.github.io/grid-tetris/)

Key|Function
---|--------
A| Move left
D| Move right
W| Hard drop
S| Soft drop
Space| Hold piece

### About and Motivation

The CSS Grid is a relatively new layout system, supported by all major browsers except Internet Explorer.
When reading about the grid, it occured to me that it would be pretty simple to use it as a sort of display layer for a game in the style of retro consoles.
It is possible to easily change the apperance of tiles by simply changing the class of the associated grid element.
For example, giving an element the classes grid-cell and red causes it to render as a red block.

Of course, this is far from the most performant way to render realtime applications such as action games.
As (in a simple case) the DOM has one element per cell, this leads to 2072 cells on the Grid Tetris expirement on my monitor (although if only the play area was a grid this number decreases significantly).
Updating 2072 DOM nodes 60 times a second is not feasible.

I figured that this makes little sense for realtime games, it would actually be a pretty reasonable way to render a non-realtime game such as Picross.
I wanted to test if something 'light-realtime' would be possible.  This led to making Grid Tetris.

While tetris is fairly fast-paced, very few of the tiles change on any given render.
A naïve approach to rendering, updating ever DOM node each change produces significant lag, however, the game can reach desired performance by only updating changed tiles.

### Draw Functions
As this is an experiment in rendering, it is important to discuss how draws are handled.
It is important to note that this is all very hacky.
I would not recommend making anything serious in this fashion.

All draw functions take two arguments and return nothing.
The two arguments are a reference to the grid (which is simply an array) and the length of a row in elements.
The grid reference is mutable, the draw function operates by modifying the cells directly.

With this, a draw function can change a cell at `(x,y)` to red simply:

`domGrid[y*gridWidth + x].className = 'grid-cell red'`

While having everything directly edit the grid is probably a maintenance nightmare for larger projects, the ease of setting changing tiles with this method is the reason I was originally interested in using the CSS Grid in this context.

### Running
Running `npm run start:dev` starts an instance of `webpack-dev-server`, you can then play on localhost.

Alternatively, `npm run publish` builds the javascript bundle.  The game can be run with `index.html`, `style.css`, and `bundle.js` in the same directory.
