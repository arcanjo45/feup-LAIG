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

	 this.initLights();


	 this.axis = new CGFaxis(this,this.graph.initials.reference);

	 
    this.gl.clearColor(this.graph.illumination.background.r, this.graph.illumination.background.g,this.graph.illumination.background.b, this.graph.illumination.background.a);

	 console.log(this.camera.near);
	  console.log(this.camera.far);




};

LSXScene.prototype.applyInitials = function(){

var iniciais = this.graph.initials;

var trans = iniciais.translation;

var rots = iniciais.rotations;

var scal = iniciais.scale;

this.translate(trans.x,trans.y,trans.z);

for(var i=0; i < rots.length;i++)
{
	if(rots[i].axis == 'x')
		this.rotate(rots[i].angle*deg2rad,1,0,0);
	
	if(rots[i].axis == 'y')
		this.rotate(rots[i].angle*deg2rad,0,1,0);
		
	if(rots[i].axis == 'z')
		this.rotate(rots[i].angle*deg2rad,0,0,1);

}

this.scale(scal.sx,scal.sy,scal.sz);

console.log(iniciais.translation);


};

LSXScene.prototype.initLights = function(){

	this.shader.bind();

	this.luzes = [];

	for(var i =0; i < this.graph.lights.length;i++)
	{
		var luz = this.graph.lights[i];

		if(luz.enabled)
			this.lights[i].enable();
		else
			this.lights[i].disable();

		this.lights[i].setPosition(luz.position.x,luz.position.y,luz.position.z);
		this.lights[i].setAmbient(luz.ambient.r,luz.ambient.g,luz.ambient.b,luz.ambient.a);
		this.lights[i].setDiffuse(luz.diffuse.r,luz.diffuse.g,luz.diffuse.b,luz.diffuse.a);
		this.lights[i].setSpecular(luz.specular.r,luz.specular.g,luz.specular.b,luz.specular.a);
		this.lights[i].setVisible(true);
		this.lights[i].update();

		//aux = this.lights[i];
	}




  this.shader.unbind();
};

LSXScene.prototype.display = function() {
    this.shader.bind();
    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);


    this.updateProjectionMatrix();
    this.loadIdentity();


      this.applyViewMatrix();

      this.axis.display();

      for (var i = 0; i < this.lights.length; i++)
            this.lights[i].update();

this.shader.unbind();
};








