function MyInterface() {
	CGFinterface.call(this);
};

MyInterface.prototype = Object.create(CGFinterface.prototype);
MyInterface.prototype.constructor = MyInterface;

MyInterface.prototype.initInterface = function(application){

	CGFinterface.prototype.initInterface.call(this, application);

	this.gui = new dat.GUI();

	this.gui.add(this.scene, 'LightsInterface');

	var lights = this.gui.addFolder("Lights");
	lights.open();

	console.log( "lolitos" + this.scene.lights.length);
	for (var i = 0; i < this.scene.lights.length; i++) {
		var checkbox = 'Light'+i;
		lights.add(this.scene, checkbox);
	}
};

// NAO FUNCIONA. NAO SEI COMO POR A DAR. ALTEREI MERDAS NA LSXScene pra tentar. NAO DEU TIREI TUDO.