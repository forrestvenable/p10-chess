// helper functions

var withinMaxDistance = function(x1,y1,x2,y2){
  var desiredDistance = findDistance(x1,y1,x2,y2)

  var direction = assignDirection(x1,y1,x2,y2)
  var xDirection = direction[0]
  var yDirection = direction[1]

  var maxDistance = distanceBlocked(x1,y1,xDirection,yDirection)
  if (maxDistance===null){
    return true
  } else if (desiredDistance<maxDistance){
    return true
  } else {
    return false
  }
}

var assignDirection = function(x1,y1,x2,y2){
  //serves to provide the right arguments to distanceBlocked
  var solution = []

  if (x1<x2) {
    solution[0] = 1
  } else if (x1 == x2){
    solution[0] = 0
  } else if (x1>x2){
    solution[0] = -1
  }

  if (y1<y2) {
    solution[1] = 1
  } else if (y1 == y2){
    solution[1] = 0
  } else if (y1>y2){
    solution[1] = -1
  }
  return solution
}

var findDistance = function(x1,y1,x2,y2){
  var xDistance = Math.abs(x1=x2)
  var yDistance = Math.abs(y1-y2)
  return Math.max(xDistance,yDistance)
}

var distanceBlocked = function(x,y,directionX,directionY){ // gives distance at which piece's path is blocked
  for (var i = 0; (((x+(i*directionX)<8)  && (y+(i*directionY)<8)) &&
                   ((x+(i*directionX)>=0) && (y+(i*directionY)>=0)); i++){
    if (Board.array[x+(i*directionX)][y+(i*directionY]!==undefined){
      if(Board.array[x+(i*directionX)][y+(i*directionY].color==turn){
        return i-1 // return one space earlier if color matches
      } else {
        return i // can take a differently colored piece
      }
    }
  }
  return null
}

var onBoard = function(x,y){
  if (x>=0 && x<8 && y>=0 && y<8){
    return true
  }
  return false
}

var inCardinal = function(x1,y1,x2,y2){
  if((x1==x2||y1==y2) &&
     (x1!=x2||y1!=y2)){
    return true
  } else {
    return false
  }
}

var inDiagonal = function(x1,y1,x2,y2){//DRY this up
  if(x1==x2 && y1==y2){
    return false
  }

  if(x1-y1 == x2-y2){
    return true
  }

  if(x1+y1 == x2+y2){
    return true
  }

  return false
}

var inEllShape = function(x1,y1,x2,y2){
  if((x1-2 == x2 || x1+2 == x2) && (y1-1 == y2 || y1+1 == y2)){
    return true
  }
  if((x1-1 == x2 || x1+1 == x2) && (y1-2 == y2 || y1+2 == y2)){
    return true
  }
  return false
}


// objects
var Game = function() {
  var board = new Board;
  board.setup();
  turn = "white"

}

Game.prototype.check = function(){
  for (var i=0; i<piecesArray.length; i++){ // need to make an array of all pieces
    if (piecesArray[i].)
  }
}

Game.prototype.move = function(piece, x, y){
  piece.move(x,y);
  this.endTurn();
}

Game.prototype.endTurn = function(){
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
    this.array[i][1] = new Pawn("white" , i, 1)
    this.array[i][6] = new Pawn("black", i, 6)
  }

  // place rooks onto board
  this.array[0][0] = new Rook("white", 0,0)
  this.array[7][0] = new Rook("white", 7,0)

  this.array[0][7] = new Rook("black",0,7)
  this.array[7][7] = new Rook("black",7,7)

  // place knights onto board
  this.array[1][0] = new Knight("white",1,0)
  this.array[6][0] = new Knight("white",6,0)

  this.array[1][7] = new Knight("black",1,7)
  this.array[6][7] = new Knight("black",6,7)

  // place bishops onto board
  this.array[2][0] = new Bishop("white",2,0)
  this.array[5][0] = new Bishop("white",5,0)

  this.array[2][7] = new Bishop("black",2,7)
  this.array[5][7] = new Bishop("black",5,7)

  // place queens onto board
  this.array[3][0] = new Queen("white",3,0)

  this.array[3][7] = new Queen("black",3,7)

  // place kings onto board
  this.array[4][0] = new King("white",4,0)

  this.array[4][7] = new King("black",4,7)
}

Board.prototype.castle = function(color, rook, king){
  if (color == "white"){
    var row = 0
  } else {
    var row = 7
  }
  if (king.color == color && rook.color == color && !king.moved && !rook.moved) { //establishing castling's conditions

// Castle queenside
    if (rook.x == 0 && this.array[row][1]==undefined && this.array[row][2]==undefined && this.array[row][3] == undefined) {
      this.array[row][2] = king
      king.x = 2
      king.moved = true

      this.array[row][3] = rook
      rook.x = 3
      rook.moved = true

      this.array[row][0] = undefined
      this.array[row][4] = undefined
      return true
    }

// Castle kingside
    if (rook.x == 7 && this.array[row][6]==undefined && this.array[row][5]==undefined){
      this.array[row][6] = king
      king.x = 6

      this.array[row][5] = rook
      rook.x = 5

      this.array[row][4] = undefined
      this.array[row][7] = undefined
      return true
    }
  }
// Something went wrong
  return false
}

var Pawn = function(color, x, y) {
  var moved = false
  var color = color
  var y = y
  var x = x
}

Pawn.prototype.move = function(x,y) {
  if (withinMaxDistance(this.x,this.y,x,y) && onBoard(x,y)){
    if (this.moved == false)
      if (x == this.x && x == this.y+1||this.y+2){
        Board.array[this.x][this.y] = undefined
        this.y = y
        Board.array[this.x][this.y] = this
      }
    else {
      Board.array[x][y] = undefined
      Board.array[x][y+1] = this
    }
    this.moved = true
  }
}

Pawn.prototype.take = function(piece) {
  // unless a piece is diagonal, does nothing
  // if two or pieces are diagonal, provide choice
  // remove other side's piece at that location from board
}

var Rook = function(color, x, y) {
  var color = color
  var col = y
  var row = x
  var moved = false
}

Rook.prototype.move = function(x,y){
  // can move any number of squares horizontally or vertically
  // is blocked by other pieces
  if (withinMaxDistance(this.x,this.y,x,y) && onBoard(x,y)){
    if(inCardinal(this.x,this.y,x,y)){ //same row/column, not same space
      Board.array[this.x][this.y] = undefined

      this.x = x
      this.y = y

      Board.array[this.x][this.y] = this
      this.moved = true
    }
  }
}

Rook.prototype.take = function(piece){
  // piece must be closest to the rook, vertically or horizontally
}

var Knight = function(color, x, y) {
  var color = color
  var col = y
  var row = x
}

Knight.prototype.take = function(piece){
  // can take any piece it lands on
}

Knight.prototype.move = function(x,y){
  // move in L shape
  // is not blocked
  if (withinMaxDistance(this.x,this.y,x,y) && onBoard(x,y)){
    if(inEllShape(this.x,this.y,x,y)){
      Board.array[this.x][this.y] = undefined

      this.x = x
      this.y = y

      Board.array[this.x][this.y] = this
    }
  }
}

var Bishop = function(color, x, y) {
  var color = color
  var col = y
  var row = x
}

Bishop.prototype.take = function(piece){
  // can take closest diagonal piece
}

Bishop.prototype.move = function(x,y){
  // any amount diagonally
  // is blocked by pieces
  if (withinMaxDistance(this.x,this.y,x,y) && onBoard(x,y)){
    if(inDiagonal(this.x,this.y,x,y)){ //same row/column, not same space
      Board.array[this.x][this.y] = undefined

      this.x = x
      this.y = y

      Board.array[this.x][this.y] = this
    }
  }
}

var Queen = function(color, x, y) {
  var color = color
  var col = y
  var row = x
}

Queen.prototype.take = function(piece){
  // takes first blocking piece
}

Queen.prototype.move = function(x,y){
  if (withinMaxDistance(this.x,this.y,x,y) && onBoard(x,y)){
    if(inDiagonal(this.x,this.y,x,y)||inCardinal(this.x,this.y,x,y)){
      Board.array[this.x][this.y] = undefined

      this.x = x
      this.y = y

      Board.array[this.x][this.y] = this
    }
  }
}

var King = function(color, x, y) {
  var color = color
  var col = y
  var row = x
  var moved = false
}

King.prototype.take = function(piece){ //this doesn't look necessary
  // any adjacent piece
}

King.prototype.move = function(x,y){
  if (x<=this.x+1 && x>=this.x-1 &&
      y<=this.y+1 && y>=this.y-1){
    if(Board.array[x][y].color != this.color){
      Board.array[this.x][this.y] = undefined

      this.x = x
      this.y = y

      Board.array[this.x][this.y] = this
      this.moved = false
    }
  }
}
