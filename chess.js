// helper functions

var squaresBlocked = function(x, y, direction) { //call this one to find which squares are blocked by pieces
  var solution = []
  if (direction == "diagonals") {
    solution[0] = squareBlocked(x,y,45)
    solution[1] = squareBlocked(x,y,135)
    solution[2] = squareBlocked(x,y,225)
    solution[3] = squareBlocked(x,y,315)
  }
  if (direction == "cardinals") {
    solution[0] = squareBlocked(x,y,0)
    solution[1] = squareBlocked(x,y,90)
    solution[2] = squareBlocked(x,y,180)
    solution[3] = squareBlocked(x,y,270)
  }
  return solution
}

var squareBlocked = function(x, y, angle){ // angle is measured in degrees from north
  // this doesn't look great, can I do something about it?
  if (angle == 0) {
    return directionBlocked(x,y,0,1)
  }
  if (angle == 45) {
    return directionBlocked(x,y,1,1)
  }
  if (angle == 90) {
    return directionBlocked(x,y,1,0)
  }
  if (angle == 135) {
    return directionBlocked(x,y,1,-1)
  }
  if (angle == 180) {
    return directionBlocked(x,y,0,-1)
  }
  if (angle == 225) {
    return directionBlocked(x,y,-1,-1)
  }
  if (angle == 270) {
    return directionBlocked(x,y,-1,0)
  }
  if (angle == 315) {
    return directionBlocked(x,y,-1,1)
  }
}

var directionBlocked = function(x,y,directionX,directionY){
  // For future reference this makes sure that neither x nor y go off the board
  // This looks horrible, can I clean up the loop's condition?
  for (var i = 0; (((x+(i*directionX)<8) && (y+(i*directionY)<8)) && ((x+(i*directionX)>=0) && (y+(i*directionY)>=0)); i++){
    if (!Board.array[x+(i*directionX)][y+(i*directionY].nil){
      return [x+(i*directionX),y+(i*directionY)]
    }
  }
  return nil
}

// objects
var Game = function() {
  var board = new Board;
  board.setup();
  var turn = "white"

}

Game.prototype.check = function(){
  // check if "turn"'s king can be taken
  // if so, ignore any moves that do not change that.
}

Game.prototype.move = function(piece, x, y){
  piece.move(x,y);
  if (this.turn == "white") {
    this.turn = "black"
  } else {
    this.turn = "white"
  }
}

var Board = function(){
  var array = []
  for (var x = 0; x<8; x++){
    var row = []
    for (var y = 0; y<8; y++){
      row[y] = []
    }
    array[x] = row
  }
}

Board.prototype.setup = function(){ // Can this be DRYed up?
  // place pieces onto board

  // place pawns onto board
  for (var i = 0; i<8; i++){
    this.array[i][1] = new Pawn("white")
    this.array[i][6] = new Pawn("black")
  }

  // place rooks onto board
  this.array[0][0] = new Rook("white")
  this.array[7][0] = new Rook("white")

  this.array[0][7] = new Rook("black")
  this.array[7][7] = new Rook("black")

  // place knights onto board
  this.array[1][0] = new Knight("white")
  this.array[6][0] = new Knight("white")

  this.array[1][7] = new Knight("black")
  this.array[6][7] = new Knight("black")

  // place bishops onto board
  this.array[2][0] = new Bishop("white")
  this.array[5][0] = new Bishop("white")

  this.array[2][7] = new Bishop("black")
  this.array[5][7] = new Bishop("black")

  // place queens onto board
  this.array[3][0] = new Queen("white")

  this.array[3][7] = new Queen("black")

  // place kings onto board
  this.array[4][0] = new King("white")

  this.array[4][7] = new King("black")
}

var Pawn = function(color) {
  var moved = false
  var color = color
}

Pawn.prototype.move = function(x,y) {
  if (this.moved == false)
    // can move one or two squares directly forward
  else {
    Board.array[x,y+1] = this
    Board.array[x,y] = []
  }
  this.moved = true
}

Pawn.prototype.take = function(piece) {
  // unless a piece is diagonal, does nothing
  // if two pieces are diagonal, provide choice
  // remove other side's piece at that location from board
}

var Rook = function(color) {
  var color = color
}

Rook.prototype.move = function(x,y){
  // can move any number of squares horizontally or vertically
  // is blocked by other pieces
}

Rook.prototype.take = function(piece){
  // piece must be closest to the rook, vertically or horizontally
}

var Knight = function(color) {
  var color = color
}

Knight.prototype.take = function(piece){
  // can take any piece it lands on
}

Knight.prototype.move = function(x,y){
  // move in L shape
  // is not blocked
}

var Bishop = function(color) {
  var color = color
}

Bishop.prototype.take = function(piece){
  // can take closest diagonal piece
}

Bishop.prototype.move = function(x,y){
  // any amount diagonally
  // is blocked by pieces
}

var Queen = function(color) {
  var color = color
}

Queen.prototype.take = function(piece){
  // takes first blocking piece
}

Queen.prototype.move = function(x,y){
  // can move in any straight line
  // is blocked by pieces
}

var King = function(color) {
  var color = color
}

King.prototype.take = function(piece){
  // any adjacent piece
}

King.prototype.move = function(x,y){
  // one square, any direction
}