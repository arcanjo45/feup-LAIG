function Node(id) {
    this.id = id;
    this.material = null;
    this.texture = null;
    this.matrix = mat4.create();

     this.anims = [];

    this.descendants = [];
   
}

Node.prototype.setMatrix=function(m){
 this.m=mat4.clone(m);
 console.log(this.m);
            };


    Node.prototype.print = function() {
        console.log("Node " + this.id);
        console.log("Material " + this.material);
        console.log("Texture " + this.texture);
        console.log("Anims: " + this.anims);
        console.log("Matrix " + this.matrix);
        console.log("Descendants: " + this.descendants);
    };
