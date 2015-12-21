function Board(parser, board) {
    this.parser = parser;
    this.parser.board = this;

    this.pieces = [];

    this.board = board;
    this.size = board.length;

    for (var i = 0; i < board.length; ++i) {
        for (var j = 0; j < board[i].length; ++j) {
            var peca = board[i][j];
           
            if (peca != 0) 
                {
                    console.log("peça");
                    this.pieces.push(new Piece([j,i], peca));
                }
        }
    }

    console.log(this.pieces.length + ": " + this.pieces);
    // console.log(this.towers.length + ": " + this.towers);
}

Board.prototype.display = function() {
    var board_node = this.parser.findNode("board");

    for (var i = 0; i < this.pieces.length; ++i) {
        var piece = this.pieces[i];
        var node = new Node("Piece"+i);
        node.material = "null";
        node.texture = "null";
        mat4.translate(node.matrix, node.matrix, [0.2+piece.x*1.2, 0,0.2+piece.y*1.2]);
        node.descendants.push(piece.type);
        board_node.descendants.push("Piece"+i);
        this.parser.nodes.push(node);
    }
};