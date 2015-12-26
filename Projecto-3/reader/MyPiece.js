function MyPiece(scene,type){
	CGFobject.call(this,scene);
	this.type = type;

	this.def = new CGFtexture(this.scene, "scenes/res/green.jpg");
	this.at = new CGFtexture(this.scene, "scenes/res/red.png");
	this.king = new CGFtexture(this.scene, "scenes/res/gold.png");

	this.piece = new Cylinder(scene, [1, 1, 1, 16, 16]);
}

MyPiece.prototype.display = function() {
	this.scene.pushMatrix();
	if(this.type == 1)
		this.def.bind();
	if(this.type == 2)
		this.at.bind();
	if(this.type == 5)
		this.king.bind();

		this.scene.rotate(-Math.PI/2, 1, 0, 0);
		this.scene.scale(0.2, 0.2, 0.25);
		this.piece.display();
	this.scene.popMatrix();
}