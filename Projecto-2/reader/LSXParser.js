/**
 * LSXParser constructor
 * @param {String} filename 
 * @param {Object} scene
 */
function LSXParser(filename, scene) {
    this.loadedOK = null;

    this.scene = scene;
    scene.graph = this;

    this.reader = new CGFXMLreader();
    this.reader.open('scenes/' + filename, this);
    console.log("LSXParser for " + filename + ".");

    // Scene graph data
    this.initials = new Initials();
    this.illumination = new Illumination();
    this.lights = [];
    this.textures = [];
    this.materials = [];
    this.leaves = [];
    this.root_id = null;
    this.nodes = [];
    this.anims = [];
}

var deg2rad = Math.PI / 180;

/**
 * LSXParser onXMLerror
 * @param {String} message

 Imprime mensagem em caso de erro no load do Parser
 */
LSXParser.prototype.onXMLError = function(message) {
    console.error("LSX loading error: " + message);
    this.loadedOK = false;
};

/**
 * LSXParser onXMLReady
 Ativa todas as funções de parsing
 */
LSXParser.prototype.onXMLReady = function() {
    console.log("LSX loaded successfully.");

    var mainElement = this.reader.xmlDoc.documentElement;

    console.log("---------Animations--------");

    var error = this.parseAnimations(mainElement);
    if(error != null){
        this.onXMLError(error);
        return;
    }

    console.log("---------INITIALS----------");

    var error = this.parseInitials(mainElement);
    if (error != null) {
        this.onXMLError(error);
        return;
    }


    console.log("---------Illumination----------");

    error = this.parseIllumination(mainElement);
    if (error != null) {
        this.onXMLError(error);
        return;
    }

    console.log("---------Lights----------");

    error = this.parseLights(mainElement);
    if (error != null) {
        this.onXMLError(error);
        return;
    }

    console.log("---------Textures----------");

    error = this.parseTextures(mainElement);
    if (error != null) {
        this.onXMLError(error);
        return;
    }

    console.log("---------Materials----------");

    error = this.parseMaterials(mainElement);
    if (error != null) {
        this.onXMLError(error);
        return;
    }

    console.log("---------Leaves----------");

    error = this.parseLeaves(mainElement);
    if (error != null) {
        this.onXMLError(error);
        return;
    }

    console.log("---------Nodes----------");

    error = this.parseNodes(mainElement);
    if (error != null) {
        this.onXMLError(error);
        return;
    }

    console.log("-------------------");

    this.loadedOK = true;
    this.scene.onGraphLoaded();
    console.log("ola");
};

/**
 * LSXParseInitials
 * @param {Graph} mainElement

 Função que faz parsing dos Initials e coloca a sua informação em variaveis
 */

LSXParser.prototype.parseInitials = function(mainElement) {
    var initials_list = mainElement.getElementsByTagName('INITIALS')[0];
    if (initials_list == null) return "<INITIALS> element is missing.";

    // Frustum
    var frustum = initials_list.getElementsByTagName('frustum')[0];
    if (frustum == null) return "<frustum> element is missing";

    this.initials.frustum.near = this.reader.getFloat(frustum, 'near');
    this.initials.frustum.far = this.reader.getFloat(frustum, 'far');

    //Translation
    var translation = initials_list.getElementsByTagName('translation')[0];
    if (translation == null) return "<translation> element is missing";

    this.initials.translation.x = this.reader.getFloat(translation, 'x');
    this.initials.translation.y = this.reader.getFloat(translation, 'y');
    this.initials.translation.z = this.reader.getFloat(translation, 'z');


    //Rotations
    var rotations = initials_list.getElementsByTagName('rotation');
    if (rotations.length != 3 || rotations == null) return "Needs 3 <rotation> elements";

    for (i = 0; i < rotations.length; i++) {
        var rot = {
            axis: null,
            angle: null
        };
        rot.axis = this.reader.getItem(rotations[i], 'axis', ['x', 'y', 'z']);
        rot.angle = this.reader.getFloat(rotations[i], 'angle');
        this.initials.rotations.push(rot);
    }

    //Scale
    var scale = initials_list.getElementsByTagName('scale')[0];
    if (scale == null) return "<scale> element is missing";
    this.initials.scale.sx = this.reader.getFloat(scale, 'sx');
    this.initials.scale.sy = this.reader.getFloat(scale, 'sy');
    this.initials.scale.sz = this.reader.getFloat(scale, 'sz');

    //Reference length
    var r_length = initials_list.getElementsByTagName('reference')[0];
    if (r_length == null) return "<reference> element is missing";

    this.initials.reference = this.reader.getFloat(r_length, 'length',1);

    //this.initials.print();

    return null;
};

/**
 * LSXParseLights
 * @param {Graph} mainElement

 Função que faz parsing das Lights e coloca a sua informação em variaveis
 */
LSXParser.prototype.parseLights= function(mainElement){

    var light_list = mainElement.getElementsByTagName("LIGHTS")[0];

  if(light_list == null) return " Element <LIGHTS> is missing";

  var lights = light_list.getElementsByTagName("LIGHT");
  if(lights== null)return " Element <LIGHT> is missing";

  for(i = 0; i < lights.length;i++)
  {
    var light = new Light(this.reader.getString(lights[i],'id'));

    light.enabled = this.reader.getBoolean(lights[i].getElementsByTagName('enable')[0],'value');
    light.ambient = this.parseColor(lights[i].getElementsByTagName('ambient')[0]);
    light.diffuse = this.parseColor(lights[i].getElementsByTagName('diffuse')[0]);
    light.specular = this.parseColor(lights[i].getElementsByTagName('specular')[0]);

    var aux = lights[i].getElementsByTagName('position')[0];
        light.position.x = this.reader.getFloat(aux, 'x');
        light.position.y = this.reader.getFloat(aux, 'y');
        light.position.z = this.reader.getFloat(aux, 'z');
        light.position.w = this.reader.getFloat(aux, 'w');

    light.print();
    this.lights.push(light);
  }

return null;


};

LSXParser.prototype.parseAnimations = function(mainElement){

var anim_list = mainElement.getElementsByTagName("ANIMATIONS")[0];

if(anim_list == null) return "Element <ANIMATIONS> is missing";

var anims = anim_list.getElementsByTagName("ANIMATION");

for(i=0; i < anims.length;i++)
{
    var id = anims[i].getAttribute('id');
    var span = this.reader.getFloat(anims[i],'span');
    var type = this.reader.getString(anims[i],'type');

    var args = [];

    if(type == "linear")
    {
        var control_pts = anims[i].getElementsByTagName('controlpoint');
        for(var j=0; j < control_pts.length;j++)
        {
            var cntrl_pnt = [];
            cntrl_pnt.push(this.reader.getFloat(control_pts[j],'xx'));
            cntrl_pnt.push(this.reader.getFloat(control_pts[j],'yy'));
            cntrl_pnt.push(this.reader.getFloat(control_pts[j],'zz'));

            args.push(cntrl_pnt);
        }
    }
    else if(type == "circular")
    {
        args["center"] = this.reader.getVector3(anims[i],'center');
        args["radius"] = this.reader.getFloat(anims[i],'radius');
        args["startang"] = this.reader.getFloat(anims[i],'startang');
        args["rotang"] = this.reader.getFloat(anims[i],'rotang');
    }

    var y = new Anim(id,span,type,args)
    y.print();
    this.anims.push(y);
    //anims.print();

}



};
/**
 * LSXParseMaterials
 * @param {Graph} mainElement

 Função que faz parsing dos Materials e coloca a sua informação em variaveis
 */
LSXParser.prototype.parseMaterials = function(mainElement){

	var mat_list = mainElement.getElementsByTagName("MATERIALS")[0];

	if(mat_list == null) return "Element <MATERIALS> is missing";

	var mats = mat_list.getElementsByTagName("MATERIAL");

	for( i=0; i < mats.length;i++)
	{
		var material = new Material(mats[i].getAttribute('id'));

		material.ambient = this.parseColor(mats[i].getElementsByTagName('ambient')[0]);
		material.specular = this.parseColor(mats[i].getElementsByTagName('specular')[0]);
		material.diffuse = this.parseColor(mats[i].getElementsByTagName('diffuse')[0]);
		material.emission = this.parseColor(mats[i].getElementsByTagName('emission')[0]);

		material.shine = this.reader.getFloat(mats[i].getElementsByTagName('shininess')[0],'value');

		//material.print();

		this.materials.push(material);
	}

	return null;

};
/**
 * LSXParser findNode
 * @param {String} id

 Função que encontra um Nó do grafo através do seu id
 */
LSXParser.prototype.findNode = function(id) {
    for (i = 0; i < this.nodes.length; i++)
        if (this.nodes[i].id == id) return this.nodes[i];

    return null;
};
/**
 * LSXParseTextures
 * @param {Graph} mainElement

 Função que faz parsing das Textures e coloca a sua informação em variaveis
 */
LSXParser.prototype.parseTextures = function(mainElement){
    var text_list = mainElement.getElementsByTagName('TEXTURES')[0];

    if (text_list == null) return "<TEXTURES> element is missing.";

    var texts = text_list.getElementsByTagName('TEXTURE');

    for (i = 0; i < texts.length; i++) {
        var textura = new Texture(texts[i].getAttribute('id'));

        textura.path = texts[i].getElementsByTagName('file')[0].getAttribute('path');

        var aux = texts[i].getElementsByTagName('amplif_factor')[0];
        textura.amplif_factor.s = this.reader.getFloat(aux, 's');
        textura.amplif_factor.t = this.reader.getFloat(aux, 't');

       // textura.print();
        this.textures.push(textura);
    }

    return null;

};
/**
 * LSXParseIllumination
 * @param {Graph} mainElement

 Função que faz parsing da Illumination e coloca a sua informação em variaveis
 */
LSXParser.prototype.parseIllumination = function(mainElement)
{

    var ilumins = mainElement.getElementsByTagName('ILLUMINATION')[0];

    if(ilumins == null) return "ILLUMINATION element is missing";

    var ambient = ilumins.getElementsByTagName('ambient')[0];

    this.illumination.ambient = this.parseColor(ambient);

    var background = ilumins.getElementsByTagName('background')[0];

    this.illumination.background= this.parseColor(background);

    //this.illumination.print();

};
/**
 * LSXParseLeaves
 * @param {Graph} mainElement

 Função que faz parsing das Leaves e coloca a sua informação em variaveis
 */

LSXParser.prototype.parseLeaves = function(mainElement) {

    var leaves_list = mainElement.getElementsByTagName('LEAVES')[0];
    if(leaves_list == null) return "<LEAVES> element is missing.";

    var leaves = leaves_list.getElementsByTagName('LEAF');

    for (var i = 0; i < leaves.length; i++){
        var leaf = new Leaf(leaves[i].getAttribute('id'));

        var args_aux;

        leaf.type = this.reader.getItem(leaves[i], 'type', ['rectangle', 'cylinder', 'sphere', 'triangle', 'plane', 'patch']);

        if(leaf.type == "plane"){
            leaf.args.push(this.reader.getInteger(leaves[i], 'parts'));
        }

        else if(leaf.type == "patch"){
            var order = this.reader.getInteger(leaves[i], 'order');
            if (order < 1 || order > 3) 
                return "Invalid order! Order has to be either 1, 2 or 3";
            else leaf.args.push(order);

            var partsU = this.reader.getInteger(leaves[i], 'partsU');
            var partsV = this.reader.getInteger(leaves[i], 'partsV');

            leaf.args.push(partsU);
            leaf.args.push(partsV);

            var controlPoints = [];
            var controlPointsReader = leaves[i].getElementsByTagName('controlpoint');

            for(var k = 0; k < controlPointsReader.length; k++){
                var tmpControlPoint = [];

                tmpControlPoint[0] = this.reader.getFloat(controlPointsReader[k], 'x');
                tmpControlPoint[1] = this.reader.getFloat(controlPointsReader[k], 'y');
                tmpControlPoint[2] = this.reader.getFloat(controlPointsReader[k], 'z');
                tmpControlPoint[3] = 1;
                controlPoints.push(tmpControlPoint);
            }

            if(controlPoints.length != (order+1)*(order+1)) {console.error(controlPoints.length + " is not the correct number of control points. It must be " + ((order+1)*(order+1)));}
            else leaf.args.push(controlPoints);
        }

        else{
            args_aux = leaves[i].getAttribute('args').split(/\s+/g);

            for(var j = 0; j < args_aux.length; j++){
                leaf.args.push(parseFloat(args_aux[j]));
            }
        }

        this.leaves.push(leaf);
    }
}

/*LSXParser.prototype.parseLeaves = function(mainElement) {
   var leaves_list = mainElement.getElementsByTagName('LEAVES')[0];
    if (leaves_list == null) return "<LEAVES> element is missing.";

    var leaves = leaves_list.getElementsByTagName('LEAF');
    for (i = 0; i < leaves.length; i++) {
        var leaf = new Leaf(leaves[i].getAttribute('id'));
        leaf.type = this.reader.getItem(leaves[i], 'type', ['rectangle', 'cylinder', 'sphere', 'triangle', 'plane']);

        var args_aux = leaves[i].getAttribute('args').split(/\s+/g);
        for (var j = 0; j < args_aux.length; j++) {
            if (args_aux[j] === ""){
                args_aux.splice(j, 1);
                --j;
            }
        }
        switch (leaf.type) {
            case "rectangle":
                if (args_aux.length != 4)
                    return "Invalid number of arguments for type 'rectangle'";

            for (var j = 0; j < args_aux.length; j++)
                    leaf.args.push(parseFloat(args_aux[j]));

                break;
            case "cylinder":
                if (args_aux.length != 5)
                    return "Invalid number of arguments for type 'cylinder'";

                leaf.args.push(parseFloat(args_aux[0]));
                leaf.args.push(parseFloat(args_aux[1]));
                leaf.args.push(parseFloat(args_aux[2]));
                leaf.args.push(parseInt(args_aux[3]));
                leaf.args.push(parseInt(args_aux[4]));
                break;
            case "sphere":
                if (args_aux.length != 3)
                    return "Invalid number of arguments for type 'sphere'";

                leaf.args.push(parseFloat(args_aux[0]));
                leaf.args.push(parseInt(args_aux[1]));
                leaf.args.push(parseInt(args_aux[2]));
                break;
            case "triangle":
                if (args_aux.length != 9)
                    return "Invalid number of arguments for type 'triangle'";

                for (j = 0; j < args_aux.length; j++)
                    leaf.args.push(parseFloat(args_aux[j]));

                break;
            case "plane":
                leaf.args.push(this.reader.getInteger(leaves[i], 'parts'));
                break;
            default:
                return "Type " + "\"" + leaf.type + "\" not valid.";
        }

        //leaf.print();
        this.leaves.push(leaf);
    }

    return null;
};*/
/**
 * LSXParser idExists
 * @param {Array} Ids
 * @param {String} id

 Função que verifica se um id existe no grafo
 */
LSXParser.prototype.idExists = function(IDs, id) {
	var exists = false;
	for (var i = 0; i < IDs.length; i++) {
		if (IDs[i] == id)
			exists = true;
	}
	if (exists)
		return true;
	else false;
}

/**
 * LSXParseNodes
 * @param {Graph} mainElement

 Função que faz parsing dos Nodes e coloca a sua informação em variaveis
 */
LSXParser.prototype.parseNodes = function(mainElement) {
    var nodes_list = mainElement.getElementsByTagName('NODES')[0];
    if (nodes_list == null) return "<NODES> element is missing.";

    var root_node = nodes_list.getElementsByTagName('ROOT')[0];
    this.root_id = this.reader.getString(root_node, 'id');
    console.log("ROOT Node: " + this.root_id);

    var nodes = nodes_list.getElementsByTagName('NODE');

    for (i = 0; i < nodes.length; i++) {
        var node = new Node(nodes[i].getAttribute('id'));
        node.material = this.reader.getString(nodes[i].getElementsByTagName('MATERIAL')[0], 'id');
        node.texture = this.reader.getString(nodes[i].getElementsByTagName('TEXTURE')[0], 'id');


        //Animations 

        var node_anims = nodes[i].getElementsByTagName('ANIMATION');
        for (var j = 0; j < node_anims.length; ++j) {
            var anim_id = node_anims[j].getAttribute("id");
            node.anims.push(anim_id);
        }

        // Transforms
        var children = nodes[i].children;
        for (j = 0; j < children.length; j++) {
            switch (children[j].tagName) {
                case "TRANSLATION":
                    var trans = [];
                    trans.push(this.reader.getFloat(children[j], "x"));
                    trans.push(this.reader.getFloat(children[j], "y"));
                    trans.push(this.reader.getFloat(children[j], "z"));
                    // console.log("trans: " + trans);
                    mat4.translate(node.matrix, node.matrix, trans);
                    break;
                case "SCALE":
                    var scale = [];
                    scale.push(this.reader.getFloat(children[j], "sx"));
                    scale.push(this.reader.getFloat(children[j], "sy"));
                    scale.push(this.reader.getFloat(children[j], "sz"));
                    // console.log("scale: " + scale);
                    mat4.scale(node.matrix, node.matrix, scale);
                    break;
                case "ROTATION":
                    var axis = this.reader.getItem(children[j], "axis", ["x", "y", "z"]);
                    var angle = this.reader.getFloat(children[j], "angle") * deg2rad;
                    var rot = [0, 0, 0];

                    // console.log("rot: " + axis + " " + angle + " ");
                    rot[["x", "y", "z"].indexOf(axis)] = 1;
                    mat4.rotate(node.matrix, node.matrix, angle, rot);
                    break;
            }
        }

        //Descendants
        var desc = nodes[i].getElementsByTagName('DESCENDANTS')[0];
        if (desc == null) return "No <DESCENDANTS> tag found";

        var d_list = desc.getElementsByTagName('DESCENDANT');
        if (d_list.length < 1) return "Need at least 1 <DESCENDANT>";

        for (j = 0; j < d_list.length; j++) {
            node.descendants.push(d_list[j].getAttribute('id'));
        }

        //node.print();
        this.nodes.push(node);
    }

    return null;
};



/**
 * LSXParseColor
 * @param {Object} element

 Função que optimiza a recolha de informação de um No do Grafo
 */
LSXParser.prototype.parseColor = function(element) {
    var color = {};
    color.r = this.reader.getFloat(element, 'r');
    color.g = this.reader.getFloat(element, 'g');
    color.b = this.reader.getFloat(element, 'b');
    color.a = this.reader.getFloat(element, 'a');
    return color;
};


/**
 * LSXParser PrintColor
 * @param {Object} c

 Função faz print da informação retirada do Grafo
 */
var printColor = function(c) {
    return "(" + c.r + ", " + c.g + ", " + c.b + ", " + c.a + ")";
};
