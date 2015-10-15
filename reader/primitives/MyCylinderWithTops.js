function MyCylinderWithTops(scene,args) {
 	CGFobject.call(this, scene);

 	this.args[0]=slices;
    this.args[1]=stacks;
 	this.body = new MyCylinder(scene, slices, stacks);
 	
 	this.top = new MyCircle(scene, slices);


 	
 };

MyCylinderWithTops.prototype = Object.create(CGFobject.prototype);
MyCylinderWithTops.prototype.construtor = MyCylinderWithTops;



 MyCylinderWithTops.prototype.display = function() {
 	this.body.display();

 	this.top.display();

 	this.scene.pushMatrix();
 	this.scene.translate(0,0,1);
 	this.scene.rotate(Math.PI,1,0,0);

    this.top.display();

 	this.scene.popMatrix();
 };
