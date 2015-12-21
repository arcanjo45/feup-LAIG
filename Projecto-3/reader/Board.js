function Board(parser, board) {
    this.parser = parser;
    this.parser.board = this;

    this.pieces = [];
    this.towers = [];

    this.board = board;
    this.size = board.length;

    for (var i = 0; i < board.length; ++i) {
        for (var j = 0; j < board[i].length; ++j) {
            var torre = board[i][j];
            var peca = board[i][j];

            console.log(peca);

            this.towers.push(new Tower([j,i], torre));
            if (peca !== 0) 
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
        mat4.translate(node.matrix, node.matrix, [piece.x, 0,piece.y]);
        node.descendants.push(piece.type);
        board_node.descendants.push("Piece"+i);
        this.parser.nodes.push(node);
    }

     for (var i = 0; i < this.towers.length; ++i) {
        var tower = this.towers[i];
        var node = new Node("Tower"+i);
        node.material = "null";
        node.texture = "null";
        mat4.translate(node.matrix, node.matrix, [tower.x, 0,tower.y]);
        node.descendants.push(tower.type);
        board_node.descendants.push("Tower"+i);
        this.parser.nodes.push(node);
    }
};