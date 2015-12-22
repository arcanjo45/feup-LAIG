function Piece(position, type) {
    this.x = position[0];
    this.y = position[1];

    this.id = -1;

    this.type = "peca";
/*
    switch (type) {
        case 1:
            this.type = "round-light-piece";
            break;
        case 2:
            this.type = "square-light-piece";
            break;
        case 3:
            this.type = "round-dark-piece";
            break;
        case 4:
            this.type = "square-dark-piece";
            break;
    }
*/
}


Piece.prototype.setId = function(newId) {
    this.id=newId;
};

Piece.prototype.getId = function() {
    return this.id;
};

Piece.prototype.setSelectable = function() {
    this.scene.registerForPick(this.id, this);
};


