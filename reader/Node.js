function Node(id) {
    this.id = id;
    this.material = null;
    this.texture = null;
    this.matrix = mat4.create();

    this.descendants = [];
   
}



    Node.prototype.print = function() {
        console.log("Node " + this.id);
        console.log("Material " + this.material);
        console.log("Texture " + this.texture);
        console.log("Matrix " + this.matrix);
        console.log("Descendants: " + this.descendants);
    };
