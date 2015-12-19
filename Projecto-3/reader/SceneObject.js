/**
 * LSXSCene SceneObject

 @param {String} id

 Função que constroi um objeto da cena com os seus parametros
 */

function SceneObject(id) {
 this.id = id;
 this.material = null;
 this.texture = null;
 this.matrix = null;
 this.primitive = null;

 this.anims = [];
 this.currAnim = 0;
}

/**
 * LSXSCene SceneObject


 Função que da update a textura de um objeto
 */

SceneObject.prototype.updateTex = function()
{

  if(this.material == null) return;
	this.material.setTexture(this.texture);

	if(this.texture == null) return;

	this.primitive.updateTex(this.texture.amplif_factor.s,this.texture.amplif_factor.t);
};
/**
 * LSXSCene SceneObject

@param {CGFObject} scene


 Função que desenha cada objeto individualmente na cena aplicando as matrizes das suas animações primeiro e so depois a propria matriz do objeto
 */
SceneObject.prototype.draw = function(scene)
{

    scene.pushMatrix();
    this.updateTex();
    if(this.material != null)
    this.material.apply();



    // Anims transformations
    if (this.currAnim < this.anims.length)
        scene.multMatrix(this.anims[this.currAnim].matrix);
   

    scene.multMatrix(this.matrix);


    this.primitive.display();
    scene.popMatrix();
};

/**
 * LSXSCene SceneObject

@param {float} delta


 Função que recebe o tempo atual e da update a cada animação de cada objeto
 */
SceneObject.prototype.updateAnims = function(delta) {
    if (this.anims.length == 0 || this.currAnim >= this.anims.length) return;
    console.log(this.anims);

    if (this.anims[this.currAnim].done) ++this.currAnim;
    if(this.currAnim < this.anims.length) this.anims[this.currAnim].update(delta);
    //console.log(this.anims[this.currAnim]);
};