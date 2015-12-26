function MyInterface() {
	CGFinterface.call(this);
};

MyInterface.prototype = Object.create(CGFinterface.prototype);
MyInterface.prototype.constructor = MyInterface;

MyInterface.prototype.init = function(application){

	this.player1 = false;
    this.player2 = false;


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


MyInterface.prototype.updateInterface = function(){
	if(this.scene.Player1Difficulty != "Human" && !this.player1Play && this.scene.Board.currentPlayer == 0){
		this.scene.Board.resetSelection();
		this.button1 = this.player1.add(this.scene, "PLAY");
		this.player1Play = true;
	}
	else if((this.scene.Player1Difficulty == "Human" && this.player1Play)|| (this.scene.Board.currentPlayer != 0 && this.player1Play))
	{
		this.player1.remove(this.button1);
		this.player1Play = false;
	}
	
		
	if(this.scene.Player2Difficulty != "Human" && !this.player2Play && this.scene.Board.currentPlayer == 1){
		this.scene.Board.resetSelection();
		this.button2 = this.player2.add(this.scene, "PLAY");
		this.player2Play = true;
	}
	else if((this.scene.Player2Difficulty == "Human" && this.player2Play)|| (this.scene.Board.currentPlayer != 1  && this.player2Play))
	{
		this.player2.remove(this.button2);
		this.player2Play = false;
	}
	
}

MyInterface.prototype.onGraphLoaded = function(){
	this.gui.add(this.scene, 'Controls');	

	// add a group of controls (and open/expand by default)
this.player1=this.gui.addFolder("Player1");
	//this.player1.open();
	
	this.player1.add(this.scene, 'Player1Difficulty', this.scene.player1Dificulty);
	this.player1.add(this.scene, "Points",this.scene.Points);
	
	
	
	this.player2=this.gui.addFolder("Player2");
	//this.player2.open();
	
	this.player2.add(this.scene, 'Player2Difficulty', this.scene.player2Dificulty);
	
	//restartButton
	
	this.gui.add(this.scene, "RESETBOARD");
	

	return true;

}