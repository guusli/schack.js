var Board = function() {

	var positions = [BLACK_ROOK, BLACK_KNIGHT, BLACK_BISHOP, BLACK_QUEEN, BLACK_KING, BLACK_BISHOP, BLACK_KNIGHT, BLACK_ROOK,
             BLACK_PAWN, BLACK_PAWN, BLACK_PAWN, BLACK_PAWN, BLACK_PAWN, BLACK_PAWN, BLACK_PAWN, BLACK_PAWN,
             0,0,0,0,0,0,0,0,
             0,0,0,0,0,0,0,0,
             0,0,0,0,0,0,0,0,
             0,0,0,0,0,0,0,0,
             WHITE_PAWN, WHITE_PAWN, WHITE_PAWN, WHITE_PAWN, WHITE_PAWN, WHITE_PAWN, WHITE_PAWN, WHITE_PAWN,
             WHITE_ROOK, WHITE_KNIGHT, WHITE_BISHOP, WHITE_QUEEN, WHITE_KING, WHITE_BISHOP, WHITE_KNIGHT, WHITE_ROOK];

             var getPositions = function() {
                return positions;
             };

             var getPosition = function(i) {
                return positions[i];
             };

             var setPosition = function(i, value) {
                positions[i] = value;
             };

	var draw = function() {
	   var str = '';
        for( var i = 0 ; i < 8 ; i++ ){
            str += '<div class="row">';
            for( var j = 0 ; j < 8 ; j++ ){
                str += '<div class="column ' +
                ( (i + j) % 2 === 0 ? 'light': 'dark') + ' "' + 'data-square="' + ((8*i)+(j)) + '" >' +
                '<div class="' + getPieceName(positions[(8*i)+(j)]) + ' ui-widget-content">'+
                + ((8*i)+(j)) + 
                '</div>' +
                '</div>';
            }
            str += '</div>';
        }

        $('#board').html(str);

    /*$( ".column div" ).draggable({ revert: "invalid" });

    $( ".column" ).droppable({
        drop: onDrop
    });
	*/
	};

	return {
        getPosition: getPosition,
        getPositions: getPositions,
        setPosition: setPosition,
		draw: draw
	}

};