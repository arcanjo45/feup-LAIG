
/**
 * Circular Animation

 @param {String} id
 @param {float} time
 @param {Array} center
 @param {float} rad
 @param {float} stang
 @param {float} rtang
 Função que constroi um objeto do tipo CircularAnimation com os seus parametros e que calcula a velocidade de rotação do objeto
 */
function CircularAnimation(id,time,center,rad,stang,rtang)
{
	Animation.call(this,id,time);

	
	this.radius = rad;
	this.startang = stang;
	this.rotang = rtang;
	this.span = time;

	this.center = center;

	this.initial = true;
	this.ctime =0;

	this.finalAng = this.startang + this.rotang;

	console.log("FINAL ANG: " + this.finalAng);

	this.speed = this.rotang/(this.span*1000);

	console.log("FINAL ANG: " + this.speed);

	this.currentang = this.startang;

	this.currtime = 0;

	console.log(this.radius);

}

CircularAnimation.prototype = Object.create(Animation.prototype);

CircularAnimation.prototype.constructor = CircularAnimation;

/**
 * Circular Animation

 @param {float} delta

 Função que da update ao movimento de rotação de objeto atraves do delta e que aplica as matrizes de transformação das animações ao objeto
 */
CircularAnimation.prototype.update = function(delta)
{

   if(this.ctime >= this.span)
   {
   	this.done=true;
   }
   else
   {
	this.ctime = this.ctime + delta/1000;

	this.currentang = this.startang + this.rotang*(this.ctime/this.span)

	console.log("CURRENT ANG " + this.currentang);
}

mat4.identity(this.matrix);




		mat4.translate(this.matrix,this.matrix,[this.center[0],this.center[1],this.center[2]]);
	//	console.log(nodematrix);
		mat4.rotate(this.matrix,this.matrix, (this.currentang*Math.PI)/180.0, [0,1,0]);
	//	console.log(nodematrix);

		mat4.translate(this.matrix, this.matrix,[this.radius,0,0]);
		console.log("Raio :" + this.radius);

};


/**
 * CircularAnimation


Função que faz clone das animações de forma a torna-las independentes
 */
CircularAnimation.prototype.clone = function(delta) {
    return new CircularAnimation(this.id,
        this.span,
        this.center,
        this.radius,
        this.startang,
        this.rotang);
};