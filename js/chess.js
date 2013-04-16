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

var kingPositions = {};

var board;


/**************************************************
** GAME INITIALISATION
**************************************************/
function init() {
    board = new Board();

    animate();

    currentPlayer = -1;
    kingPositions[-1] = 60;
    kingPositions[1] = 4;

    setDragAndDropHandlers();
}

/**************************************************
** GAME EVENT HANDLERS
**************************************************/



function makeMove(from, to){

    var replaced = board.getPosition(to);;


    board.setPosition(to, board.getPosition(from));
    board.setPosition(from, 0);

    currentPlayer = currentPlayer * -1;

    return replaced;
}

function unMakeMove(from, to, replaced){
    board.setPosition(from, board.getPosition(to));
    board.setPosition(to, replaced);


    currentPlayer = currentPlayer * -1;

    return true;
}

function isMoveLegal(from, to) {
    return isMovePseudoLegal(from, to, currentPlayer) && !(leavesCheckAfterMove(from, to));
}

function leavesCheckAfterMove(from, to) {
    var toContent = makeMove(from, to);

    var kingUnderAttack = isKingUnderAttack();
    unMakeMove(from, to, toContent);

    return kingUnderAttack


}

function isMovePseudoLegal(from, to, currentPlayer){


    var fromPiece = board.getPosition(from);
    var toPiece = board.getPosition(to);

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

        return true;

        // TODO - En passant

    } else if(pieceType === KING) {

        var diff = Math.abs(from - to);

        if( diff === 1  || diff === 9 || diff === 7 || diff === 8 ){
            kingPositions[currentPlayer] = to;
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
            if(board.getPosition(path)){
                return false;
            }
        }
    }

    return true;
}

function isKingUnderAttack(){
    var kingPosition = kingPositions[currentPlayer * -1]; // makeMove changes player => -1*current

    for( var i = 0 ; i < 64 ; i++ ){
        if(board.getPosition(i) ){
            if(isMovePseudoLegal(i, kingPosition, currentPlayer)){ 
                return true;
            }
        }
    }
    return false;
}


var onDrop = function(event, ui) {
    var from = ui.draggable.parent().data('square');
    var to = $(this).data('square');
    
    if(isMoveLegal(from, to)){
        makeMove(from, to);
    } else {
        // don't touch the board.
    }
    setTimeout(function(){animate()},50);
}

/**************************************************
** GAME ANIMATION LOOP
**************************************************/
function animate() {
    draw();
    setDragAndDropHandlers();
}

function draw() {
    board.draw();
}

var setDragAndDropHandlers = function() {
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