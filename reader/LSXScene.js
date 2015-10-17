	

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

    this.grafo=[];
    var graphRootID;

    this.light0_on = true;
	this.light1_on = true;

    this.textures = [];
    this.materials = [];
    this.leaves = [];
    this.nodes = [];

    this.axis = new CGFaxis(this);

    this.materialDefault = new CGFappearance(this);


};

LSXScene.prototype.initCameras = function() {
    this.camera = new CGFcamera(0.4, 0.1, 500, vec3.fromValues(30, 30, 30), vec3.fromValues(0, 0, 0));
            //this.camera = new CGFcamera(0.4, 0.1, 500, vec3.fromValues(0, 0, 10), vec3.fromValues(0, 0, 0));
        };

        LSXScene.prototype.setDefaultAppearance = function() {
            this.setAmbient(0.2, 0.4, 0.8, 1.0);
            this.setDiffuse(0.2, 0.4, 0.8, 1.0);
            this.setSpecular(0.2, 0.4, 0.8, 1.0);
            this.setShininess(10.0);
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

            var mat = this.graph.materials;
            for (i = 0; i < mat.length; i++) {
                aux = new SceneMaterial(this, mat[i].id);
                aux.setAmbient(mat[i].ambient.r, mat[i].ambient.g, mat[i].ambient.b, mat[i].ambient.a);
                aux.setDiffuse(mat[i].diffuse.r, mat[i].diffuse.g, mat[i].diffuse.b, mat[i].diffuse.a);
                aux.setSpecular(mat[i].specular.r, mat[i].specular.g, mat[i].specular.b, mat[i].specular.a);
                aux.setEmission(mat[i].emission.r, mat[i].emission.g, mat[i].emission.b, mat[i].emission.a);
                aux.setShininess(mat[i].shininess);

                this.materials.push(aux);
            }
            var text = this.graph.textures;
            for (var i = 0; i < text.length; i++) {
                var aux = new SceneTexture(this, text[i].id, text[i].path, text[i].amplif_factor);

                this.textures.push(aux);
            }

            this.initLeaves();

            this.initNodes();
        };

        function SceneTexture(scene, id, path, amplif_factor) {
            CGFtexture.call(this, scene, path);
            this.id = id;
            this.amplif_factor = amplif_factor;
        }
        SceneTexture.prototype = Object.create(CGFtexture.prototype);
        SceneTexture.prototype.constructor = SceneTexture;
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
LSXScene.prototype.updateLights = function() {
	for (i = 0; i < this.lights.length; i++)
		this.lights[i].update();
}



            LSXScene.prototype.initLeaves = function()
            {
                for( var i=0; i < this.graph.leaves.length; i++)
                {
                    var leaf = this.graph.leaves[i];
                    console.log(leaf.type);
                    if(leaf.type == "rectangle")
                    {
                        var primitive = new MyQuad(this,leaf.args);
                        primitive.id=leaf.id;
                        this.leaves.push(primitive);
                    }

                    if(leaf.type == "sphere")
                    {

                        var primitive = new MySphere(this,leaf.args);
                        primitive.id = leaf.id;
                        this.leaves.push(primitive);
                    }

                    if(leaf.type == "triangle")
                    {
                        var primitive = new MyTriangle(this,leaf.args);
                        primitive.id = leaf.id;
                        this.leaves.push(primitive);
                    }

                    if(leaf.type == "cylinder")
                    {
                        var primitive = new Cylinder(this,leaf.args);
                        primitive.id = leaf.id;
                        this.leaves.push(primitive);
                    }

                }
            }


            LSXScene.prototype.initNodes = function() {
                var nodes_list = this.graph.nodes;

                var root_node = this.graph.findNode(this.graph.root_id);
                this.DFS(root_node, root_node.material, root_node.texture, root_node.matrix);
            };

            LSXScene.prototype.DFS = function(node, currMaterial, currTexture, currMatrix) {
                var nextMat = node.material;
                if (node.material == "null") nextMat = currMaterial;

                var nextTex = node.texture;
                if (node.texture == "null") nextTex = currTexture;
                else if (node.texture == "clear") nextTex = null;

                var nextMatrix = mat4.create();
                mat4.multiply(nextMatrix, currMatrix, node.matrix);

                for (var i = 0; i < node.descendants.length; i++) {
                    var nextNode = this.graph.findNode(node.descendants[i]);

                    if (nextNode == null) {
                        var aux = new SceneObject(node.descendants[i]);
                        aux.material = this.getMaterial(nextMat);
                        aux.texture = this.getTexture(nextTex);
                        aux.matrix = nextMatrix;
                        aux.isLeaf = true;
                        for (var j = 0; j < this.leaves.length; j++) {
                            if (this.leaves[j].id == aux.id) {
                                aux.primitive = this.leaves[j];
                                break;
                            }
                        }
                        this.nodes.push(aux);
                        continue;
                    }

                    this.DFS(nextNode, nextMat, nextTex, nextMatrix);
                }
            };

            LSXScene.prototype.getMaterial = function(id) {
                if (id == null) return null;

                for (var i = 0; i < this.materials.length; i++)
                    if (id == this.materials[i].id) return this.materials[i];

                return null;
            };

            LSXScene.prototype.getTexture = function(id) {
                if (id == null) return null;

                for (var i = 0; i < this.textures.length; i++)
                    if (id == this.textures[i].id) return this.textures[i];

                return null;
            };

            function SceneObject(id) {
                this.id = id;
                this.material = null;
                this.texture = null;
                this.matrix = null;
                this.primitive = null;
            }




            function SceneMaterial(scene, id) {
                CGFappearance.call(this, scene);
                this.id = id;
            }
            SceneMaterial.prototype = Object.create(CGFappearance.prototype);
            SceneMaterial.prototype.constructor = SceneMaterial;

LSXScene.prototype.update = function(){

	if (this.light0_on)
		this.lights[0].enable();
	else if (!this.light0_on)
		this.lights[0].disable();

	if (this.light1_on)
		this.lights[1].enable();
	else if (!this.light1_on)
		this.lights[1].disable();


};
 LSXScene.prototype.display = function() {
                this.shader.bind();
                this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
                this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);


                this.updateProjectionMatrix();
                this.loadIdentity();



                this.applyViewMatrix();
                if(this.graph.loadedOK)
                {
                  this.axis.display();

                  this.setDefaultAppearance();
                  this.update();
                  for (var i = 0; i < this.lights.length; i++)
                    this.lights[i].update();
    // Nodes
    for (i = 0; i < this.nodes.length; i++) {
        var node = this.nodes[i];
        this.pushMatrix();
        if(node.material != null)
            node.material.setTexture(node.texture);
        if (node.texture != null) {
            node.primitive.updateTex(node.texture.amplif_factor.s, node.texture.amplif_factor.t);
        }


        if(node.material != null)
            node.material.apply();
        this.multMatrix(node.matrix);
        node.primitive.display();
        this.popMatrix();
    }


}

this.shader.unbind();
};