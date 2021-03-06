/**
 * My Terrain

 @param {CGFObject} scene
 @param {Array} args

 Função que constroi um objeto do My Terrain com os seus parametros e que cria um shader atraves da primitiva MyPlane
 */


function MyTerrain(scene,args){

    CGFobject.call(this, scene);
    this.args=args;

    this.mat = new CGFappearance(scene);

    this.mat.setAmbient(0.3, 0.3, 0.3, 1);

    this.mat.setDiffuse(0.7, 0.7, 0.7, 1);

    this.mat.setSpecular(0.0, 0.0, 0.0, 1);

    this.mat.setShininess(120);

    this.texture = new CGFtexture(scene, this.args[0]);
    this.heightmap = new CGFtexture(scene, this.args[1]);
    this.mat.setTexture(this.texture);
    this.mat.setTextureWrap('REPEAT', 'REPEAT');

    this.terrainShader = new CGFshader(scene.gl, "shaders/terrain.vert", "shaders/terrain.frag");
    this.terrainShader.setUniformsValues({uSampler2: 1});
    this.terrainShader.setUniformsValues({multiplier: 0.35});

    this.plane = new MyPlane(scene, [50]);
    console.log("estou aqui");
}

/**
 * My Terrain



 Função que faz display do shader aplicando-lhe o seu material e activando os seus shaders
 */
MyTerrain.prototype.display = function() {

	console.log(this.mat);


    this.mat.apply();
    this.scene.setActiveShader(this.terrainShader);

    this.scene.pushMatrix();

    this.heightmap.bind(1);
    this.plane.display();

    this.scene.setActiveShader(this.scene.defaultShader);

    this.scene.popMatrix();

};

MyTerrain.prototype.updateTex = function(ampS, ampT){};