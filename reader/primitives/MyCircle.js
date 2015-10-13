/**
 * MyCircle
 * @constructor
 */
 function MyCircle(scene, slices) {
 	CGFobject.call(this,scene);
	
	this.slices=slices;

 	this.initBuffers();
 };

 MyCircle.prototype = Object.create(CGFobject.prototype);
 MyCircle.prototype.constructor = MyCircle;

 MyCircle.prototype.initBuffers = function() {

	this.indices = [];
 	this.vertices = [0,0,0];
 	this.normals = [0,0,-1];
 	this.texCoords = [0.5,0.5];


	var indice = 1;
	var angle = 2 * Math.PI / (this.slices);


	for (var slice = 0; slice < this.slices; slice++){
		this.vertices.push(Math.cos(slice * angle), Math.sin(slice * angle), 0);
		this.normals.push(0, 0, -1);
		this.texCoords.push(Math.cos(indice * angle) * 0.5 + 0.5, Math.sin(indice * angle) * 0.5 + 0.5);
		indice++;
	}

	for (var slice = 0; slice < this.slices; slice++){
			if (slice + 1 == this.slices){
				this.indices.push(slice + 1, 0, 1);
			}
			else this.indices.push(1 + slice, 0, 2 + slice);
	}

 	this.primitiveType = this.scene.gl.TRIANGLES;
 	this.initGLBuffers();
 };