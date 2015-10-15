
 function MyQuad(scene,args) {
 	CGFobject.call(this,scene);


 	this.args=args;

 	this.initBuffers();
 };

 MyQuad.prototype = Object.create(CGFobject.prototype);
 MyQuad.prototype.constructor = MyQuad;

 MyQuad.prototype.initBuffers = function() {

 	this.normals = [
 	0, 0, 1,
 	0, 0, 1,
 	0, 0, 1,
 	0, 0, 1
 	];

 	this.vertices = [
 	this.args[0], this.args[1], 0,
        this.args[0], this.args[3], 0,
        this.args[2], this.args[1], 0,
        this.args[2], this.args[3], 0,
 	];

 	this.indices = [
 	0, 1, 2, 
 	3, 2, 1
 	];

 	
 	this.texCoords = [
 	 this.minS, this.maxT,
 	 this.maxS, this.maxT,
 	 this.minS, this.minT,
 	 this.maxS, this.minT
 	  ];

 	this.primitiveType = this.scene.gl.TRIANGLES;
 	this.initGLBuffers();
 };
