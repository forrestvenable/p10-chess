$(document).ready(function() {
  // This is called after the document has loaded in its entirety
  // This guarantees that any elements we bind to will exist on the page
  // when we try to bind to them

  // See: http://docs.jquery.com/Tutorials:Introducing_$(document).ready()
  // helper functions
  game = new Game();
  bindEvents();
});

function bindEvents(){
  $(".square").click(function(){
    boundClicked = squareClicked.bind(this);
    boundClicked();
  })
}

function squareClicked(){
  var squareId = $(this).attr('id')
  var xCoord = Number(squareId[1])
  var yCoord = Number(squareId[3])
  if(game.clicked === true){
    secondClick(xCoord,yCoord)
  } else if(game.clicked === false){
    firstClick(xCoord,yCoord)
  }
}

function firstClick(x,y){
  game.currentPiece = game.board.array[x][y]
  if(game.currentPiece !== undefined){
    game.clicked = true
  } else {
    game.currentPiece = null
  }
}

function secondClick(x,y){
  game.move(game.currentPiece, x, y)
  game.currentPiece = null
  game.clicked = false
}

var withinMaxDistance = function(x1,y1,x2,y2){
  var desiredDistance = findDistance(x1,y1,x2,y2)
  // console.log("desiredDistance",desiredDistance)
  var direction = assignDirection(x1,y1,x2,y2)
  // console.log("direction", direction)
  var xDirection = Number(direction[0]);
  var yDirection = Number(direction[1]);
  var maxDistance = distanceBlocked(x1,y1,xDirection,yDirection)
  if (maxDistance===null){
    return true
  } else if (desiredDistance<=maxDistance){
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
  var xDistance = Math.abs(x1-x2)
  var yDistance = Math.abs(y1-y2)
  return Math.max(xDistance,yDistance)
}

var distanceBlocked = function(x,y,directionX,directionY){ // gives distance at which piece's path is blocked
  // console.log("args", x,y,directionX,directionY)
  // console.log(x.constructor.name, directionX.constructor.name)
  for (var i = 1; (((x+(i*directionX)<8)  && (y+(i*directionY)<8)) &&
                   ((x+(i*directionX)>=0) && (y+(i*directionY)>=0))); i++){
    if (game.board.array[x+(i*directionX)][y+(i*directionY)]!==undefined){
      if(game.board.array[x+(i*directionX)][y+(i*directionY)].color==game.turn){
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
function Game() {
  this.board = new Board;
  this.board.setup();
  this.updateChessBoard();
  this.turn = "white"
  this.clicked = false
  this.currentPiece = null
}

// Game.prototype.check = function(){
//   for (var i=0; i<piecesArray.length; i++){ // need to make an array of all pieces
//     if (piecesArray[i].)
//   }
// }

Game.prototype.move = function(piece, x, y){
  if(piece.move(x,y) === false){
    console.log(piece)
    console.log("piece didn't move")
  } else {
    console.log(piece)
    console.log("piece moved")
    this.endTurn();
  }
}

Game.prototype.endTurn = function(){
  if (this.turn == "white") {
    this.turn = "black"
  } else {
    this.turn = "white"
  }
  this.updateChessBoard();
  console.log(this.turn)
}

Game.prototype.updateChessBoard = function(){
  for (var y = 0; y<8; y++){
    for (var x = 0; x<8; x++){
      $("#x"+x+"y"+y).removeClass();
      $("#x"+x+"y"+y).addClass("square");
      currentSquare = this.board.array[x][y]
      if (currentSquare !== undefined){
        this.updateSquare(x,y);
      }
    }
  }
}

Game.prototype.updateSquare = function(x,y){
  var piece = this.board.array[x][y]
  $("#x"+x+"y"+y).addClass(piece.color+piece.constructor.name)
}

function Board() {
  this.array = []
  for (var x = 0; x<8; x++){
    var row = []
    for (var y = 0; y<8; y++){
      row[y] = undefined
    }
  this.array[x] = row
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

function Pawn(color, x, y) {
  this.moved = false,
  this.color = color,
  this.y = y,
  this.x = x
}

Pawn.prototype.move = function(x,y) {

  if(this.color == "white"){
    var direction = 1
  } else {
    var direction = -1
  }
  if(onBoard(x,y) && withinMaxDistance(this.x,this.y,x,y)){
    if (this.validMove(direction,x,y)){
      game.board.array[this.x][this.y] = undefined
      this.x = x
      this.y = y
      game.board.array[this.x][this.y] = this
      this.moved = true
      return true
    }
  }
  return false
}

Pawn.prototype.validMove = function(direction,x,y){
  if ((this.y+direction == y || (!this.moved && this.y+direction*2 == y)) && this.x == x){
    return game.board.array[x][y] == undefined
  }
  if(((this.x+1 == x) || (this.x - 1 == x)) && this.y+direction == y){
    return game.board.array[x][y] != undefined
  }
  return false
}

function Rook(color, x, y) {
  this.color = color,
  this.y = y,
  this.x = x,
  this.moved = false
}

Rook.prototype.move = function(x,y){
  // can move any number of squares horizontally or vertically
  // is blocked by other pieces
  if (withinMaxDistance(this.x,this.y,x,y) && onBoard(x,y)){
    if(inCardinal(this.x,this.y,x,y)){ //same row/column, not same space
      game.board.array[this.x][this.y] = undefined

      this.x = x
      this.y = y

      game.board.array[this.x][this.y] = this
      this.moved = true
      return true
    }
  }
  return false
}

function Knight(color, x, y) {
  this.color = color,
  this.y = y,
  this.x = x
}

Knight.prototype.move = function(x,y){
  // move in L shape
  // is not blocked
  if (onBoard(x,y)){
    if(inEllShape(this.x,this.y,x,y)){
      game.board.array[this.x][this.y] = undefined

      this.x = x
      this.y = y

      game.board.array[this.x][this.y] = this

      return true
    }
  }
  return false
}

function Bishop(color, x, y) {
  this.color = color,
  this.y = y,
  this.x = x
}

Bishop.prototype.move = function(x,y){
  // any amount diagonally
  // is blocked by pieces
  if (withinMaxDistance(this.x,this.y,x,y) && onBoard(x,y)){
    if(inDiagonal(this.x,this.y,x,y)){ //same row/column, not same space
      game.board.array[this.x][this.y] = undefined

      this.x = x
      this.y = y

      game.board.array[this.x][this.y] = this
      return true
    }
  }
  return false
}

function Queen(color, x, y) {
  this.color = color,
  this.y = y,
  this.x = x
}

Queen.prototype.move = function(x,y){
  if (withinMaxDistance(this.x,this.y,x,y) && onBoard(x,y)){
    if(inDiagonal(this.x,this.y,x,y)||inCardinal(this.x,this.y,x,y)){
      game.board.array[this.x][this.y] = undefined

      this.x = x
      this.y = y

      game.board.array[this.x][this.y] = this
      return true
    }
  }
  return false
}

function King(color, x, y) {
  this.color = color,
  this.y = y,
  this.x = x,
  this.moved = false
}

King.prototype.move = function(x,y){
  if (x<=this.x+1 && x>=this.x-1 &&
      y<=this.y+1 && y>=this.y-1 &&
    !(x==this.x && y==this.y)){
    if(game.board.array[x][y].color != this.color){
      game.board.array[this.x][this.y] = undefined

      this.x = x
      this.y = y

      game.board.array[this.x][this.y] = this
      this.moved = false
      return true
    }
  }
  return false
}
