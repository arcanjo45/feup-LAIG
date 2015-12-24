function MyPiece(scene){
	CGFobject.call(this,scene);

	this.pieceTex = new CGFtexture(this.scene, "scenes/res/green.jpg");

	this.piece = new Cylinder(scene, [1, 1, 1, 16, 16]);
}

MyPiece.prototype.display = function() {
	this.scene.pushMatrix();
		this.pieceTex.bind();
		this.scene.rotate(-Math.PI/2, 1, 0, 0);
		this.scene.scale(0.2, 0.2, 0.25);
		this.piece.display();
		this.pieceTex.unbind();
	this.scene.popMatrix();
}