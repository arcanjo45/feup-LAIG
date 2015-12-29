function MyBackground(scene){
	CGFobject.call(this,scene);

	this.bg1 = new CGFtexture(this.scene, "scenes/res/landscape1.jpg");
	this.bg2 = new CGFtexture(this.scene, "scenes/res/landscape2.jpg");
	this.bg3 = new CGFtexture(this.scene, "scenes/res/landscape3.jpg");

	this.backgroundWall1 = new MyQuad(scene, 0, 5, 5, 0);
	this.backgroundWall1.applyAmplifFactors(5,5);

    this.backgroundWall2 = new MyQuad(scene, 0, 5, 5, 0);
    this.backgroundWall2.applyAmplifFactors(5,5);

}

MyBackground.prototype.display = function() {
	this.scene.pushMatrix();
	if(this.scene.currentBackground == "Background 1")
		this.bg1.bind();
	if(this.scene.currentBackground == "Background 2")
		this.bg2.bind();
	if(this.scene.currentBackground == "Background 3")
		this.bg3.bind();

		this.scene.translate(-7.5, 0, -6);
		this.scene.scale(3, 1.5, 1);
		this.backgroundWall1.display();

	if(this.scene.currentBackground == "Background 1")
		this.bg1.unbind();
	if(this.scene.currentBackground == "Background 2")
		this.bg2.bind();
	if(this.scene.currentBackground == "Background 3")
		this.bg3.bind();
	this.scene.popMatrix();

	this.scene.pushMatrix();
	if(this.scene.currentBackground == "Background 1")
		this.bg1.bind();
	if(this.scene.currentBackground == "Background 2")
		this.bg2.bind();
	if(this.scene.currentBackground == "Background 3")
		this.bg3.bind();

		this.scene.translate(7.5, 0, 7);
		this.scene.rotate(Math.PI, 0, 1, 0);
		this.scene.scale(3, 1.5, 1);
		this.backgroundWall2.display();

	if(this.scene.currentBackground == "Background 1")
		this.bg1.unbind();
	if(this.scene.currentBackground == "Background 2")
		this.bg2.bind();
	if(this.scene.currentBackground == "Background 3")
		this.bg3.bind();
	this.scene.popMatrix();
}