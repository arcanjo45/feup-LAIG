/**
* MyPrism
* @constructor
*/
function MyCylinder(scene, slices, stacks) {
	CGFobject.call(this,scene);

	this.slices=slices;
	this.stacks=stacks;

	this.initBuffers();
};

MyCylinder.prototype = Object.create(CGFobject.prototype);
MyCylinder.prototype.constructor = MyCylinder;

MyCylinder.prototype.initBuffers = function() {



	this.texCoords = [];

	var stepS = 0;
	var stepT = 0;

	var angInc = 2 * Math.PI / this.slices;

	var verticesTemp=[];
	for (var slice = 0,angle=0; slice < this.slices; slice++,angle+=angInc)
	{
		verticesTemp.push(Math.cos(angle), Math.sin(angle), 0);
	}


	var stackInc=1/this.stacks;

	this.vertices = [];
	for(var i=0, stackZ=0; i <= this.stacks; i++, stackZ += stackInc)
	{
		for(var j=0;j < this.slices;j++)
		{
			this.vertices.push(verticesTemp[j*3],verticesTemp[j*3+1],stackZ);
			this.texCoords.push(stepS, stepT);

			stepS+=1/this.slices;
		}
		stepS = 0;
		stepT+= 1/this.stacks;
	}

	
	var indicesTemplate=[];
	for(var i=0; i < this.slices;i++)
	{
		if(i < this.slices -1)
		{
			indicesTemplate.push(i, i+1, i + this.slices);
			indicesTemplate.push(i+1, i + this.slices+1, i+this.slices);
		} else
		{
			indicesTemplate.push(i, i+1-this.slices, i + this.slices);
			indicesTemplate.push(i+1 - this.slices, i+1, i+this.slices);
		}
	}

	this.indices = [];
	for(var i=0; i < this.stacks;i++)
	{
		Array.prototype.push.apply(this.indices, indicesTemplate);

		if(i < this.stacks-1)
		{
			for(var j=0; j < indicesTemplate.length;j++)
			{
				indicesTemplate[j]+=this.slices;
			}
		}
	}


	var normalsTemplate = this.vertices.slice(0, this.slices*3);

	this.normals=[];
	for(var i=0; i <= this.stacks;i++)
	{
		Array.prototype.push.apply(this.normals, normalsTemplate);
	}

	this.primitiveType = this.scene.gl.TRIANGLES;
	this.initGLBuffers();
};
