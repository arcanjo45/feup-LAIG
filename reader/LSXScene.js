var deg2rad = Math.PI /180;

function LSXScene(){
	CGFscene.call(this);
}


LSXScene.prototype = Object.create(CGFscene.prototype);

LSXScene.prototype.constructor = LSXScene;

LSXScene.prototype.init = function(application){

	CGFscene.prototype.init.call(this,application);

	this.initCameras();

	this.enableTextures(true);

	this.gl.clearColor(0.0, 0.0,0.0, 1.0);
	this.gl.clearDepth(100.0);
	this.gl.enable(this.gl.DEPTH_TEST);
	this.gl.enable(this.gl.CULL_FACE);
	this.gl.depthFunc(this.gl.LEQUAL);

	 this.textures = [];
    this.materials = [];
    this.leaves = [];
    this.nodes = [];

	this.axis = new CGFaxis(this);


};


LSXScene.prototype.initCameras = function() {
	this.camera = new CGFcamera(0.4, 0.1, 500, vec3.fromValues(30, 30, 30), vec3.fromValues(0, 0, 0));
	//this.camera = new CGFcamera(0.4, 0.1, 500, vec3.fromValues(0, 0, 10), vec3.fromValues(0, 0, 0));
};

LSXScene.prototype.onGraphLoaded = function()
{
/*
	 this.camera.near = this.graph.initials.frustum.near;
	 this.camera.far = this.graph.initials.frustum.far;

	 */

	 this.applyInitials();


	 this.axis = new CGFaxis(this,this.graph.initials.reference);

	 
    this.gl.clearColor(this.graph.illumination.background.r, this.graph.illumination.background.g,this.graph.illumination.background.b, this.graph.illumination.background.a);

	 console.log(this.camera.near);
	  console.log(this.camera.far);




};

LSXScene.prototype.applyInitials = function(){

var iniciais = this.graph.initials;




};

LSXScene.prototype.display = function() {
    this.shader.bind();
    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);


    this.updateProjectionMatrix();
    this.loadIdentity();


      this.applyViewMatrix();

      this.axis.display();

this.shader.unbind();
};








