function MyInterface() {
	CGFinterface.call(this);
};

MyInterface.prototype = Object.create(CGFinterface.prototype);
MyInterface.prototype.constructor = MyInterface;

MyInterface.prototype.init = function(application){

	CGFinterface.prototype.init.call(this, application);

	this.gui = new dat.GUI();

	//this.gui.add(this.scene, 'LightsInterface');

	var group = this.gui.addFolder("Lights");

	group.add(this.scene, 'light0_on');
	group.add(this.scene, 'light1_on');
	//group.add(this.scene, 'light2_on');
	//group.add(this.scene, 'light3_on');
	//this.gui.add(this.scene, 'stop');
};

// NAO FUNCIONA. NAO SEI COMO POR A DAR. ALTEREI MERDAS NA LSXScene pra tentar. NAO DEU TIREI TUDO.