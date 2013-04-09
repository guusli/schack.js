var KING = 100;
var QUEEN = 90;
var ROOK = 50;
var BISHOP = 31;
var KNIGHT = 30;
var PAWN = 10;

var WHITE_KING = 100;
var WHITE_QUEEN = 90;
var WHITE_ROOK = 50;
var WHITE_BISHOP = 31;
var WHITE_KNIGHT = 30;
var WHITE_PAWN = 10;
 
var BLACK_KING = -WHITE_KING;
var BLACK_QUEEN = -WHITE_QUEEN;
var BLACK_ROOK = -WHITE_ROOK;
var BLACK_BISHOP = -WHITE_BISHOP;
var BLACK_KNIGHT = -WHITE_KNIGHT;
var BLACK_PAWN = -WHITE_PAWN;

var board = [BLACK_ROOK, BLACK_KNIGHT, BLACK_BISHOP, BLACK_QUEEN, BLACK_KING, BLACK_BISHOP, BLACK_KNIGHT, BLACK_ROOK,
             BLACK_PAWN, BLACK_PAWN, BLACK_PAWN, BLACK_PAWN, BLACK_PAWN, BLACK_PAWN, BLACK_PAWN, BLACK_PAWN,
             0,0,0,0,0,0,0,0,
             0,0,0,0,0,0,0,0,
             0,0,0,0,0,0,0,0,
             0,0,0,0,0,0,0,0,
             WHITE_PAWN, WHITE_PAWN, WHITE_PAWN, WHITE_PAWN, WHITE_PAWN, WHITE_PAWN, WHITE_PAWN, WHITE_PAWN,
             WHITE_ROOK, WHITE_KNIGHT, WHITE_BISHOP, WHITE_QUEEN, WHITE_KING, WHITE_BISHOP, WHITE_KNIGHT, WHITE_ROOK];


function makeMove(from, to){
    if(!isMovePseudoLegal(from, to)) {return false;}
    board[to] = board[from];
    board[from] = 0;

    currentPlayer = currentPlayer * -1;
}

function isMovePseudoLegal(from, to/*, currentPlayer*/){


    var fromPiece = board[from];
    var toPiece = board[to];

    if(!fromPiece){ // Moving an empty square?
        return false;
    }

    // Moving outside board

    // Can't attack own piece
    if(toPiece * currentPlayer < 0 ) {
        return false;
    }

    // Not your turn
    if(fromPiece * currentPlayer > 0) {
        return false;
    }

    var pieceType = Math.abs(fromPiece);

    if(pieceType === QUEEN){
        if(!(Math.abs(from - to) % 9 == 0   || 
            Math.abs(from - to) % 7  == 0 ||
            Math.abs(from - to) % 8  == 0 ||
            Math.floor(Math.abs(from)/8) == Math.floor(Math.abs(to)/8))) {


            return false;
        }
    } else if(pieceType === ROOK) {
        if(!(Math.abs(from - to) % 8  == 0 ||
            Math.floor(Math.abs(from)/8) == Math.floor(Math.abs(to)/8))) {

            return false;
        }

    } else if(pieceType === BISHOP) {
        if(!(Math.abs(from - to) % 9 == 0   || 
            Math.abs(from - to) % 7  == 0)) {

            return false;
        }

    } else if(pieceType === KNIGHT) {

        var diff = Math.abs(from - to);

        if(!(diff == 17  ||
            diff == 15 ||
            diff == 10 ||
            diff == 6)) {

                return false;
        }


    } else if(pieceType === PAWN) {

        var direction = from - to > 0 ? -1 : 1;
        var diff = Math.abs(from - to);

        var row = Math.ceil(Math.abs(from)/8);
        console.log("Diff: " + diff);
        console.log("Row: " + row);

         if( direction !== currentPlayer ){ // a pawn can only move forward
            return false;
        }

        if(diff === 8 && !toPiece){  // single move forward?
            // valid
        }
        else if (diff === 16 && 
                    row === 7 || row === 2 &&
                    !toPiece) {
            // valid

        }

        else if ((diff === 7 || diff === 9) && toPiece) {
            // valid
        }
        else {

            return false;
        }

        // TODO - En passant

    } else if(pieceType === KING) {

        var diff = Math.abs(from - to);

        if( diff === 1  || diff === 9 || diff === 7 || diff === 8 ){
            // valid
        }
        else {
            return false;
        }

        // TODO

    } else {
        return false;
    }

    if(pieceType == QUEEN || pieceType == ROOK ||
        pieceType == BISHOP) { // sliding piece

        console.log("Sliding");
        var diff = to - from;
        var step;

        if(diff % 9 === 0){
            step = 9;
        }else if(diff % 7 === 0){
            step = 7;
        }else if(diff % 8 === 0){
            step = 8;
        }else{
            step = 1;
        }

        var iterations = diff/step;
        if(iterations < 0){
            step = -step;
            iterations = -iterations;
        }

        var path = from + step;
        for(var i = 1; i < iterations; i++, path+=step){
            if(board[path]){
                return false;
            }
        }
    }

    return true;
}


var onDrop = function(event, ui) {
    var from = ui.draggable.parent().data('square');
    var to = $(this).data('square');
    
    //if(validateMove(from, to, currentPlayer)){
        makeMove(from, to);
    //}else{
        // don't touch the board.
    //}
    setTimeout(function(){drawBoard(board);},50);
}

$(function(){
    drawBoard(board);

    currentPlayer = -1;
});

function handleDragStart(e) {
    console.log(e);
  this.style.background = 'blue';  // this / e.target is the source node.
}

function drawBoard(board){
    var str = '';
    for( var i = 0 ; i < 8 ; i++ ){
        str += '<div class="row">';
        for( var j = 0 ; j < 8 ; j++ ){
            str += '<div class="column ' +
            ( (i + j) % 2 === 0 ? 'light': 'dark') + ' "' + 'data-square="' + ((8*i)+(j)) + '" >' +
            '<div class="' + getPieceName(board[(8*i)+(j)]) + ' ui-widget-content">'+
            + ((8*i)+(j)) + 
            '</div>' +
            '</div>';
        }
        str += '</div>';
    }
    $('#board').html(str);

    $( ".column div" ).draggable({ revert: "invalid" });
    $( ".column" ).droppable({
        drop: onDrop
    });
}

function getPieceName(pieceValue){
    switch (pieceValue) {
        case WHITE_KING:
            return 'WHITE_KING';
            break;
        case WHITE_QUEEN:
            return 'WHITE_QUEEN';
            break;
        case WHITE_ROOK:
            return 'WHITE_ROOK';
            break;
        case WHITE_BISHOP:
            return 'WHITE_BISHOP';
            break;
        case WHITE_KNIGHT:
            return 'WHITE_KNIGHT';
            break;
        case WHITE_PAWN:
            return 'WHITE_PAWN';
            break;
        
        case BLACK_KING:
            return 'BLACK_KING';
            break;
        case BLACK_QUEEN:
            return 'BLACK_QUEEN';
            break;
        case BLACK_ROOK:
            return 'BLACK_ROOK';
            break;
        case BLACK_BISHOP:
            return 'BLACK_BISHOP';
            break;
        case BLACK_KNIGHT:
            return 'BLACK_KNIGHT';
            break;
        case BLACK_PAWN:
            return 'BLACK_PAWN';
            break;
        
        default:
            return 'EMPTY';
            break;
    }
}