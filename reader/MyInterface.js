function MyInterface() {
	CGFinterface.call(this);
};

MyInterface.prototype = Object.create(CGFinterface.prototype);
MyInterface.prototype.constructor = MyInterface;

MyInterface.prototype.init = function(application){

	CGFinterface.prototype.init.call(this, application);

	this.gui = new dat.GUI();

	//this.gui.add(this.scene, 'LightsInterface');



};

MyInterface.prototype.callLight = function()
{

 var group = this.gui.addFolder("Lights");

for(light in this.scene.lightsEnabled)
     group.add(this.scene.lightsEnabled, light);

};

// NAO FUNCIONA. NAO SEI COMO POR A DAR. ALTEREI MERDAS NA LSXScene pra tentar. NAO DEU TIREI TUDO.