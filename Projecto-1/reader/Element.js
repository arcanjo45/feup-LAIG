/**
  * Elemets
  * @constructor
  */
 function Element(scene, type, args) {
     CGFobject.call(this, scene);

     /*this.texture = new CGFappearance(scene);
	this.texture.loadTexture(tex);
	this.texture.setAmbient(1,1,1.3,1);
	this.texture.setDiffuse(0.1,0.1,0.1,1);
	this.texture.setSpecular(0.9,0.9,0.9,1);
	this.texture.setShininess(100);*/

     switch (type) {
         case "rectangle":
             var xt = args[0];
             var yt = args[1];
             var xb = args[2];
             var yb = args[3];
             this.elementV = new MyQuad(scene, xt, yt, xb, yb);
             break;
         case "cylinder":
         //falta alterar os argumentos do climdro
         var slices = args[0];
         var stacks = args[1];
         console.log(slices);
             this.elementV = new MyCylinderWithTops(scene,slices, stacks);
             break;
         case "sphere":
         //falta alterar os argumentos do climdro
         var radius = args[0];
         var slices = args[1];
         var stacks = args[2];
             this.elementV = new MySphere(scene,radius, slices,stacks);
             break;
         default:
             console.log("Identificao de elemento nao identificada");
             break;
     }
 };
 Element.prototype = Object.create(CGFobject.prototype);
 Element.prototype.constructor = Element;

 Element.prototype.display = function() {
     //this.texture.apply();
     this.elementV.display();

 };