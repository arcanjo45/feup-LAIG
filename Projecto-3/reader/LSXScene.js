	

var deg2rad = Math.PI /180;

/**
 * LSXScene constructor
 */
function LSXScene(){
    CGFscene.call(this);
}


LSXScene.prototype = Object.create(CGFscene.prototype);

LSXScene.prototype.constructor = LSXScene;

LSXScene.prototype.Controls = function () {
    console.log("Controls init");
};

/**
 * LSXSCene init
 * @param {Object} application

 Função que inicia os elementos da cena
 */
LSXScene.prototype.init = function(application){
    this.interf=null;

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

    this.nextPLayer = 1;



    this.textures = [];
    this.materials = [];
    this.leaves = [];
    this.objects = [];
    this.anims = [];
   this.lightsEnabled = [];

   this.flag = true;
    this.state = "PROCESSING";
    this.board = [];

    this.Player1Difficulty = "Human";
    this.Points1 = 0;
     this.Points2 = 0;
    this.Player2Difficulty = "Human";
    
    this.player1Dificulty = ["Human", "Easy", "Hard"];
    this.player2Dificulty = ["Human", "Easy", "Hard"];

    this.currentBackground = "Background 1";

    this.currentCamera = "Position 1";

    this.camList = ["Position 1","Position 2"];

    this.bgList = ["Background 1", "Background 2", "Background 3"];

    this.backgroundWalls = new MyBackground(this);

    this.axis = new CGFaxis(this);

    this.materialDefault = new CGFappearance(this);

        this.setPickEnabled(true);
        this.back = new MyBackground(this);


    this.currTime = new Date().getTime();
    this.setUpdatePeriod(10);
    this.cameraRot = 0;
    this.cameraRotBoolp1 = true;
     this.cameraRotBoolp2 = true;
     this.bool1 = true;
     this.bool2 == true;
     this.secondsElapsed= 0;
     this.remainingTime = 10;
     


};

/**
 * LSXSCene initCameras
 
 Função que inicia os elementos da câmara
 */
LSXScene.prototype.initCameras = function() {
    //this.camera = new CGFcamera(0.4, 0.1, 500, vec3.fromValues(70, 70, 70), vec3.fromValues(0, 0, 0));
            this.camera = new CGFcamera(0.4, 0.1, 500, vec3.fromValues(0, 30, 30), vec3.fromValues(0, 0, 0));
        };

/**
 * LSXSCene setDefaultAppearance
 

 Função que atribui uma appearance por defeito
 */
LSXScene.prototype.setDefaultAppearance = function() {
            this.setAmbient(0.2, 0.4, 0.8, 1.0);
            this.setDiffuse(0.2, 0.4, 0.8, 1.0);
            this.setSpecular(0.2, 0.4, 0.8, 1.0);
            this.setShininess(10.0);
 };

 LSXScene.prototype.animateCamera = function(){
    this.bool1 = true;
    this.bool2 = true;
    this.cameraRot+= this.elapsedTime;

var axis = vec3.fromValues(0,1,0);
if (this.cameraRot  >= Math.PI) {
                        this.cameraRot = 0;
                        this.bool1 = false;
                        this.bool2 = false;
                       
                    }



if (this.cameraRot + this.elapsedTime/1000 >= Math.PI) {
                       this.camera.orbit(axis,Math.PI - this.cameraRot);
                       
                    }
                    else
                        if(this.cameraRot < Math.PI)
    this.camera.orbit(axis,this.elapsedTime);
//else this.camera.position = 


 }

 /**
 * LSXSCene onGraphLoaded

 Função que carrega os elementos do grafo para a cena
 */LSXScene.prototype.onGraphLoaded = function()
        {
    
     
             this.axis = new CGFaxis(this,this.graph.initials.reference);

            this.applyInitials();

            this.initLights();




             
            this.gl.clearColor(this.graph.illumination.background.r, this.graph.illumination.background.g,this.graph.illumination.background.b, this.graph.illumination.background.a);

            console.log(this.camera.near);
            console.log(this.camera.far);

            var mat = this.graph.materials;
            for (i = 0; i < mat.length; i++) {
                aux = new SceneMaterial(this, mat[i].id);
                aux.setAmbient(mat[i].ambient.r, mat[i].ambient.g, mat[i].ambient.b, mat[i].ambient.a);
                aux.setDiffuse(mat[i].diffuse.r, mat[i].diffuse.g, mat[i].diffuse.b, mat[i].diffuse.a);
                //aux.setAmbient(1, 1, 1, 1);
                //aux.setDiffuse(1, 1, 1, 1);
                aux.setSpecular(mat[i].specular.r, mat[i].specular.g, mat[i].specular.b, mat[i].specular.a);
                aux.setEmission(mat[i].emission.r, mat[i].emission.g, mat[i].emission.b, mat[i].emission.a);
                aux.setShininess(mat[i].shine);

                this.materials.push(aux);
            }
            var text = this.graph.textures;
            for (var i = 0; i < text.length; i++) {
                var aux = new SceneTexture(this, text[i].id, text[i].path, text[i].amplif_factor);

                this.textures.push(aux);
            }

            this.initLeaves();

            //Animations

            var anims = this.graph.anims;

            for(i=0; i < anims.length;i++)
            {
                if(anims[i].type == "linear")
                {
                    
                    this.anims.push(new LinearAnimation(anims[i].id,anims[i].span,anims[i].args));
                }
                else
                    if(anims[i].type == "circular")

                    {
                    	console.log("oi");
                        this.anims.push(new CircularAnimation(anims[i].id,anims[i].span,anims[i].args["center"],
                                                                                        anims[i].args["radius"],
                                                                                        anims[i].args["startang"],
                                                                                        anims[i].args["rotang"]));
                    }
                    console.log(anims[i]);
            }

            this.RESETBOARD();

            if (this.interf != null)
        this.interf.onGraphLoaded();

};


LSXScene.prototype.RESETBOARD = function() {

    this.state = "PROCESSING";

    this.Board = null;

    this.resetPoints();
    
    this.Board = new Board(this);
    
    var self = this;
    
    this.initBoard(
        function(matrix){
        self.Board.init(matrix);
        }
    );
    this.getPlays(this.Board,function(listPlays) {
                    self.Board.parsingPlays(listPlays);
                    self.state = "IDLE";
    });

}



LSXScene.prototype.pickToCoord = function(pick) {

                var Y = (Math.floor(pick/11))+1;
                var X = (pick % 11)+1;
                var coord = new Array(X,Y);

return coord;

}

LSXScene.prototype.continueGame = function (self,callback, callbackObj){

    self.state = "PROCESSING"; // waiting for requests

    var board = matrixToList(self.Board.matrix);

    getPrologRequest("continue("+board+")",function(data) {
    
    var answer = data.target.response;
    
    if (typeof callback === "function") {
              callback.apply(callbackObj,[answer]);
        }
    },true);
}

LSXScene.prototype.makeHardPlay = function (self,callback, callbackObj){

    self.state = "PROCESSING"; // waiting for requests

    var board = matrixToList(self.Board.matrix);

    getPrologRequest("playBest("+board+","+self.Board.currentPlayer+","+ self.Board.currentCostLeft +")",function(data) {
    
    var temp = listToMatrix(data.target.response);
    
    var matrix = temp[0];
    
    self.Board.updateCostLeft(temp[1]);
    
    if (typeof callback === "function") {
              callback.apply(callbackObj,[self,matrix]);
        }
    },true);

}

LSXScene.prototype.makeEasyPlay = function (self,callback, callbackObj){

    self.state = "PROCESSING"; // waiting for requests

    var board = matrixToList(self.Board.matrix);
    console.log(self.Board.currentCostLeft);

    getPrologRequest("playRandom("+board+","+self.Board.currentPlayer+","+ self.Board.currentCostLeft +")",function(data) {
    
    var temp = listToMatrix(data.target.response);
    
    var matrix = temp[0];

    console.log(self.Board.currentCostLeft);
    self.Board.updateCostLeft(temp[1]);
    console.log(self.Board.currentCostLeft);
    
    if (typeof callback === "function") {
              callback.apply(callbackObj,[self,matrix]);
        }
    },true);

}

LSXScene.prototype.updatePoints1 = function()
{
    this.Points1 = this.Points1 + 1;
    
};

LSXScene.prototype.updatePoints2 = function()
{
    this.Points2 = this.Points2 + 1;
    
};

LSXScene.prototype.resetPoints = function()
{
    this.Points1 = 0;
    this.Points2 = 0;
}

LSXScene.prototype.updateMove = function()
{
    this.move = true;
}


LSXScene.prototype.makePlays = function (self,finalPick,callback, callbackObj){

    var initC = this.pickToCoord(self.Board.selectedID);
    var finalC = this.pickToCoord(finalPick);


    var board = matrixToList(self.Board.matrix);
    if(this.Board.currentPlayer == 0 && this.Player1Difficulty == "Human")
    {
         console.log(this.move);
    this.updatePoints1();
    this.updateMove();
    console.log(this.move);
}
   if(this.Board.currentPlayer == 1 && this.Player2Difficulty == "Human")
   {
     console.log(this.move);
    this.updatePoints2();
   this.updateMove();
    console.log(this.move);
}
  

getPrologRequest("makePlay("+board+","+initC[0]+","+initC[1]+","+finalC[0]+","+finalC[1]+")",function(data) {
    
    var matrix = listToMatrix(data.target.response);

    
    self.Board.updateCostLeft(self.Board.costMove[self.Board.currentIDFromList]);
    
    if (typeof callback === "function") {
              callback.apply(callbackObj,[self,matrix]);
        }
    },true);






}

LSXScene.prototype.initBoard = function (callback, callbackObj){

    getPrologRequest("initialize",function(data) {
    
    var matrix = listToMatrix(data.target.response);
    if (typeof callback === "function") {
              callback.apply(callbackObj,[matrix]);
        }
    },true);
}

LSXScene.prototype.getPlays = function (Board,callback, callbackObj){

var board = matrixToList(Board.matrix);

getPrologRequest("getPlays("+board+","+Board.currentPlayer+","+ Board.currentCostLeft + ")",function(data) {
    
    var playList = data.target.response;
    if (typeof callback === "function") {
              callback.apply(callbackObj,[playList]);
        }
    },true);

}




LSXScene.prototype.getListOfPicking = function (pick){

                var coord = this.pickToCoord(pick);
                var coordStr = coord.toString();
                    
                var list = this.getIdPieceLocation(coordStr);

        return list;
}

LSXScene.prototype.isADest = function (pick,list){

            var coord = this.pickToCoord(pick);
            var coordStr = coord.toString();
            
            for(id in list)
                {
                    var tempCoord = this.Board.destLocation[list[id]];
                    
                    this.Board.currentIDFromList = list[id];
                    
                    if(tempCoord.toString() == coord)
                        return true;
                }
                
        return false;
}


LSXScene.prototype.putBoardAndGetPlays = function (self,matrix){
                            self.Board.newMatrix(matrix);
                            self.continueGame(self,function(answer) {
                                if(answer == 1){
                                    self.state = "GAMEOVER";
                                    self.Board.resetSelection();
                                    }
                            });
                            if(self.state != "GAMEOVER"){
                            self.Board.updateBoard();
                            self.getPlays(self.Board,function(listPlays) {
                                self.Board.parsingPlays(listPlays);
                                self.state = "IDLE";
                                });

                                }
}


LSXScene.prototype.Picking = function ()
{
    if (this.pickMode == false) {
        if (this.pickResults != null && this.pickResults.length > 0) {
            for (var i=0; i< this.pickResults.length; i++) {
            var obj = this.pickResults[i][0];
            if (obj)
            {
                var pick = this.pickResults[i][1] - 1;  
                //State machine for picking
                switch(this.state){
                case "IDLE":
                    var list = this.getListOfPicking(pick);
                    
                    if(list.length != 0){
                        this.Board.defineSelection(pick,list);
                        this.state = "PRESSED";
                        }
                    break;
                case "PROCESSING":
                // waiting for requests 
                    break;
                    
                case "PRESSED":
                    if(this.Board.selectedID == pick){ //reset selection
                        this.Board.resetSelection();
                        this.state = "IDLE";
                        }
                    else if(this.isADest(pick,this.Board.listSelected))
                        {
                            var self = this;
                        
                            this.makePlays(self,pick,this.putBoardAndGetPlays);
                        }
                        break;
                default: 
                    break;
                }               
            }
        }
        this.pickResults.splice(0,this.pickResults.length);
        }   
    }
}

LSXScene.prototype.getIdPieceLocation = function (coord) {

var list = [];

    for(id in this.Board.piecesLocation)
        {
            var temp = this.Board.piecesLocation[id].toString();
            if(temp == coord)
                list.push(id);
        }
    return list;
}

            //this.initNodes();

LSXScene.prototype.PLAY = function () {
    if(this.state == "IDLE")
    {
        var self = this;
        
        switch(this.Board.currentPlayer){
        
            case 0:
                if(this.Player1Difficulty == "Easy")
                    {
                        this.makeEasyPlay(self,this.putBoardAndGetPlays);
                    }
                else if(this.Player1Difficulty == "Hard")
                    {
                        this.makeHardPlay(self,this.putBoardAndGetPlays);
                    }
                break;
            case 1:
                if(this.Player2Difficulty == "Easy")
                    {
                        this.makeEasyPlay(self,this.putBoardAndGetPlays);
                    }
                else if(this.Player2Difficulty == "Hard")
                    {
                        this.makeHardPlay(self,this.putBoardAndGetPlays);
                    }
                break;
        
        }
    
    
    }
}
/**
 * LSXSCene SceneTexture

 Construtor de texturas da cena
 */
        function SceneTexture(scene, id, path, amplif_factor) {
            CGFtexture.call(this, scene, path);
            this.id = id;
            this.amplif_factor = amplif_factor;
        }
        SceneTexture.prototype = Object.create(CGFtexture.prototype);
        SceneTexture.prototype.constructor = SceneTexture;
/**
 * LSXSCene applyInitials
 

 Função que aplica os Initials a cena
 */
        LSXScene.prototype.applyInitials = function(){

              this.camera.near = this.graph.initials.frustum.near;
             this.camera.far = this.graph.initials.frustum.far;

            var initMatrix = mat4.create();

            mat4.identity(initMatrix);

            var iniciais = this.graph.initials;

            var trans = iniciais.translation;

            var rots = iniciais.rotations;

            var scal = iniciais.scale;

            mat4.translate(initMatrix,initMatrix,[this.graph.initials.translation.x,this.graph.initials.translation.y,this.graph.initials.translation.z]);

            for(var i=0; i < rots.length;i++)
            {
                if(rots[i].axis == 'x')
                    mat4.rotate(initMatrix,initMatrix,rots[i].angle*deg2rad,[1,0,0]);

                if(rots[i].axis == 'y')
                    mat4.rotate(initMatrix,initMatrix,rots[i].angle*deg2rad,[0,1,0]);

                if(rots[i].axis == 'z')
                    mat4.rotate(initMatrix,initMatrix,rots[i].angle*deg2rad,[0,0,1]);

            }

           mat4.scale(initMatrix,initMatrix,[this.graph.initials.scale.sx,this.graph.initials.scale.sy,this.graph.initials.scale.sz]);

           this.multMatrix(initMatrix);

            console.log(initMatrix);


        };
/**
 * LSXSCene setInterface
 
@param {Object} interface
 Função que aplica uma interface a cena
 */
        LSXScene.prototype.setInterface = function(interface)
        {

            this.interf=interface;

        };




/**
 * LSXSCene initLights
 

 Função que aplica as Lights a cena
 */
        LSXScene.prototype.initLights = function(){

            //this.shader.bind();

            this.luzes = [];

            for(var i =0; i < this.graph.lights.length;i++)
            {
                var luz = this.graph.lights[i];

                console.log(luz.enabled);

                if(luz.enabled)
                    this.lights[i].enable();
                else
                    this.lights[i].disable();

                this.lightsEnabled[luz.id] = luz.enabled;

                this.lights[i].setPosition(luz.position.x,luz.position.y,luz.position.z,luz.position.w);
                this.lights[i].setAmbient(luz.ambient.r,luz.ambient.g,luz.ambient.b,luz.ambient.a);
                this.lights[i].setDiffuse(luz.diffuse.r,luz.diffuse.g,luz.diffuse.b,luz.diffuse.a);
               // this.lights[i].setDiffuse(luz.diffuse.r,luz.diffuse.g,luz.diffuse.b,luz.diffuse.a);
                this.lights[i].setSpecular(luz.specular.r,luz.specular.g,luz.specular.b,luz.specular.a);
                this.lights[i].setVisible(true);
                this.lights[i].update();

                    //aux = this.lights[i];
                }

                    
                  
                 
                //this.shader.unbind();

                this.interf.callLight();
            };
/**
 * LSXSCene updateLights
 

 Função que altera as luzes consoante o indicado pelo utilizador na interface
 */
LSXScene.prototype.updateLights = function() {
	for (i = 0; i < this.lights.length; i++)
		this.lights[i].update();
}


/**
 * LSXSCene initLeaves
 

 Função que inicia as Leaves na cena
 */
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

                    if(leaf.type == "plane")
                    {
                        var primitive = new MyPlane(this,leaf.args);
                        primitive.id = leaf.id;
                        this.leaves.push(primitive);
                    }

                    if(leaf.type == "patch")
                    {
                        var primitive = new MyPatch(this,leaf.args);
                        primitive.id = leaf.id;
                        this.leaves.push(primitive);
                    }
                    if(leaf.type == "terrain")
                    {
                        var primitive = new MyTerrain(this,leaf.args);
                        console.log(leaf.args);
                        primitive.id = leaf.id;
                        this.leaves.push(primitive);
                    }

                }
            }

/**
 * LSXSCene initNodes
 

 Função que inicia os Nodes na cena
 */
            LSXScene.prototype.initNodes = function() {
                var nodes_list = this.graph.nodes;

                var root_node = this.graph.findNode(this.graph.root_id);
                this.DFS(root_node, root_node.material, root_node.texture, root_node.matrix,root_node.anims);
            };
/**
 * LSXSCene DFS
 
 @param {Node} node
 @param {Material} currMaterial
 @param {Texture} currTexture
 @param {GlMatrix} currMatrix

 Função recursiva que vai aplicando os materiais e as texturas a todos os nos e seus descendentes
 */
            LSXScene.prototype.DFS = function(node, currMaterial, currTexture, currMatrix,currAnims) {
                var nextMat = node.material;
                if (node.material == "null") nextMat = currMaterial;

                var nextTex = node.texture;
                if (node.texture == "null") nextTex = currTexture;
                else if (node.texture == "clear") nextTex = null;

                var nextMatrix = mat4.create();
                mat4.multiply(nextMatrix, currMatrix, node.matrix);

                var nextAnims = currAnims.concat(node.anims);

                //console.log(nextAnims);

                for (var i = 0; i < node.descendants.length; i++) {
                    var nextNode = this.graph.findNode(node.descendants[i]);

                    if (nextNode == null) {
                        var aux = new SceneObject(node.descendants[i]);
                        aux.material = this.getMaterial(nextMat);
                        aux.texture = this.getTexture(nextTex);
                        for(var k=0; k < nextAnims.length;k++)
                        {
                           var anim = this.getAnim(nextAnims[k]).clone();
                            aux.anims.push(anim);
                        }
                        aux.matrix = nextMatrix;
                        aux.isLeaf = true;
                        for (var j = 0; j < this.leaves.length; j++) {
                            if (this.leaves[j].id == aux.id) {
                                aux.primitive = this.leaves[j];
                                break;
                            }
                        }
                        this.objects.push(aux);
                        continue;
                    }

                    this.DFS(nextNode, nextMat, nextTex, nextMatrix,nextAnims);
                }
            };
/**
 * LSXSCene getMaterial

 @param {String} id

 Função que encontra um material atraves do seu id
 */
            LSXScene.prototype.getMaterial = function(id) {
                if (id == null) return null;

                for (var i = 0; i < this.materials.length; i++)
                    if (id == this.materials[i].id) return this.materials[i];

                return null;
            };
/**
 * LSXSCene getAnim

 @param {String} id

 Função que encontra uma animação atraves do seu id
 */
            LSXScene.prototype.getAnim = function(id){
                if(id == null) return null;

                for(var i=0; i < this.anims.length;i++)
                    if(id == this.anims[i].id) return this.anims[i];

                return null;

            };
            /**
 * LSXSCene getTexture

 @param {String} id

 Função que encontra uma textura atraves do seu id
 */
            LSXScene.prototype.getTexture = function(id) {
                if (id == null) return null;

                for (var i = 0; i < this.textures.length; i++)
                    if (id == this.textures[i].id) return this.textures[i];

                return null;
            };
/**
 * LSXSCene SceneObject

 @param {String} id

 Função que constroi um objeto da cena com os seus parametros
 */
            

/**
 * LSXSCene SceneMaterial

 @param {String} id
 @param {Object} scene

 Função que constroi um material da cena com os seus parametros
 */

            function SceneMaterial(scene, id) {
                CGFappearance.call(this, scene);
                this.id = id;
            }
            SceneMaterial.prototype = Object.create(CGFappearance.prototype);
            SceneMaterial.prototype.constructor = SceneMaterial;

/**
 * LSXSCene update

 Função que verifica a cada momento se uma luz esta ativa ou não
 */



/**
 * LSXSCene display

 Função que faz display de toda a cena
 */
 LSXScene.prototype.display = function() {

    this.Picking();
    this.clearPickRegistration();
    
                //this.shader.bind();
                this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
                this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);


                this.updateProjectionMatrix();
                this.loadIdentity();



                this.applyViewMatrix();
                if(this.graph.loadedOK)
                {
                  this.axis.display();

                  this.setDefaultAppearance();
                 
                  for (var i = 0; i < this.lights.length; i++)
                    this.lights[i].update();

             this.interf.updateInterface();
        if(this.state != "GAMEOVER")
            if(this.Board.currentPlayer == 0 && this.Player1Difficulty == "Human"){
               
                //this.update();
                /*
                console.log(this.move);
                if(this.move){
                    if (this.cameraRotBoolp1)
                    {
                        this.animateCamera();
                        this.move = false;
                        
                        
                    }

               } 
                    if (this.cameraRot >= Math.PI) {
                        this.cameraRot = 0;
                        this.cameraRotBoolp1 = false;
                       
                    }
                */    
                    this.setPickEnabled(true);
                    this.Picking();
                    this.clearPickRegistration();
                    console.log(this.Board.currentCostLeft);                

            }
            else if(this.Board.currentPlayer == 1 && this.Player2Difficulty == "Human"){
             
                 //this.update();
               
                /*
                if(this.move){
                    if (this.cameraRotBoolp2)
                    {
                        this.animateCamera();
                        this.move = false;

                        
                    }
                      
                }
                if (this.cameraRot >= Math.PI) {
                    this.cameraRot = 0;
                    this.cameraRotBoolp2 = false;
                   
                }
                */
                this.setPickEnabled(true);
                this.Picking();
                this.clearPickRegistration();

            }   
            else{
                //bot plays
                this.setPickEnabled(false);
            }
        else {
        this.setPickEnabled(false);
        }

            
            this.Board.display();
            this.back.display();

            if(this.currentCamera == "Position 1" && this.bool1 == true)
{
    this.animateCamera();
    this.bool2 = true;
}
else if(this.currentCamera == "Position 2" && this.bool2 == true)
{
    this.animateCamera();
     this.bool1= true;
}
            /*
            if(this.bool)
                this.animateCamera();
            */

 
        
}
//this.shader.unbind();
};

LSXScene.prototype.updatePlayer = function()
{
        if(this.Board.currentPlayer == 1)
    this.Board.currentPlayer = 0;
else if(this.Board.currentPlayer ==0)
    this.Board.currentPlayer = 1;
}

LSXScene.prototype.update = function(currTime){

for(light in this.lightsEnabled)
{
    for( var i=0; i < this.graph.lights.length;i++)
    {
        if(this.graph.lights[i].id == light)
        {
            if(this.lightsEnabled[light])
            {
               // console.log(this.lightsEnabled[light]);
                this.lights[i].enable();
            }
            else
                this.lights[i].disable();
            continue;

        }
    }
}

if(this.lastUpdate != 0)
{

this.elapsedTime = currTime - this.lastUpdate;
this.elapsedTime = this.elapsedTime/1000;

}




var delta = currTime - this.currTime;
    this.currTime = currTime;

if(this.remainingTime > 0)
{
    this.initTime = this.lastUpdate;


this.secondsElapsed = (delta)/1000;

 this.remainingTime -=this.secondsElapsed;
 //console.log(this.remainingTime);
}
else if(this.remainingTime < 0.5)
{
    //this.bool = true;
   // this.animateCamera();
 this.remainingTime = 10;


}

//console.log(delta);
    for (var i = 0; i < this.objects.length; ++i)
        this.objects[i].updateAnims(delta);

};