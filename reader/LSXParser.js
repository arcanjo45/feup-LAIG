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
}

var deg2rad = Math.PI / 180;
LSXParser.prototype.onXMLError = function(message) {
    console.error("LSX loading error: " + message);
    this.loadedOK = false;
};



LSXParser.prototype.onXMLReady = function() {
    console.log("LSX loaded successfully.");

    var mainElement = this.reader.xmlDoc.documentElement;

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


function Initials() {
    this.frustum = {
        near: 0.0,
        far: 0.0
    };
    this.translation = {
        x: 0.0,
        y: 0.0,
        z: 0.0
    };
    this.rotations = [];
    this.scale = {
        sx: 1.0,
        sy: 1.0,
        sz: 1.0
    };
    this.reference = 0.0;

    this.print = function() {
        console.log("Frustum (near / far): " + this.frustum.near + " / " + this.frustum.far);
        console.log("Translation: " + this.translation.x + " " + this.translation.y + " " + this.translation.z);
        for (i = 0; i < this.rotations.length; i++)
            console.log("Rotation " + (i + 1) + ": " + this.rotations[i].axis + "> " + this.rotations[i].angle);
        console.log("Scale: " + this.scale.sx + " " + this.scale.sy + " " + this.scale.sz);
        console.log("Reference: " + this.reference);
    };
}


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

    //light.print();
    this.lights.push(light);
  }

return null;


};

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

LSXParser.prototype.parseLeaves = function(mainElement)
{
	var lista_leafs = mainElement.getElementsByTagName('LEAVES')[0];

	if(lista_leafs == null) return "<LEAVES> element is missing"

	var leafs = lista_leafs.getElementsByTagName('LEAF');

for(i=0; i < leafs.length;i++)
{
//console.log(leafs.length);
	var leaf = new Leaf(leafs[i].getAttribute('id'));

	leaf.type = this.reader.getItem(leafs[i],'type',['rectangle', 'cylinder', 'sphere', 'triangle']);

	var args_aux = leafs[i].getAttribute('args').split(" ");




	if(leaf.type == "rectangle")
	{
		for( var j=0; j < args_aux.length; j++)
		{
            leaf.args.push(parseFloat(args_aux[j]));
		}
	}
	else if(leaf.type == "sphere")
	{
		leaf.args.push(parseFloat(args_aux[0]));
        leaf.args.push(parseInt(args_aux[1]));
        leaf.args.push(parseInt(args_aux[2]));
	}
    else if(leaf.type == "cylinder")
    {
        leaf.args.push(parseFloat(args_aux[0]));
        leaf.args.push(parseFloat(args_aux[1]));
        leaf.args.push(parseFloat(args_aux[2]));
        leaf.args.push(parseInt(args_aux[3]));
        leaf.args.push(parseFloat(args_aux[4]));
    }
    else if(leaf.type == "triangle")
    {
        for( var j=0; j < args_aux.length; j++)
        {
            leaf.args.push(parseFloat(args_aux[j]));
        }
    }

       // leaf.print();
        this.leaves.push(leaf);

}


};

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

       // node.print();
        this.nodes.push(node);
    }

    return null;
};

function Leaf(id){

	this.id= id;
	this.type = "";
	this.args = [];

	this.print= function(){

		console.log( "Leaf " + this.id);
		console.log( "Type " + this.type);
		console.log( "Args " + this.args);


	};
}
function Light(id) {
    this.id = id;
    this.enabled = false;
    this.position = {
        x: 0.0,
        y: 0.0,
        z: 0.0,
        w: 0.0
    };
    this.ambient = {
        r: 0.0,
        g: 0.0,
        b: 0.0,
        a: 0.0
    };
    this.diffuse = {
        r: 0.0,
        g: 0.0,
        b: 0.0,
        a: 0.0
    };
    this.specular = {
        r: 0.0,
        g: 0.0,
        b: 0.0,
        a: 0.0
    };

    this.print = function() {
        console.log("Light " + this.id + " - " + (this.enabled ? "On" : "Off"));
        console.log("Position: " + this.position.x + " " + this.position.y + " " + this.position.z + " " + this.position.w);
        console.log("Ambient: " + printColor(this.ambient));
        console.log("Diffuse: " + printColor(this.diffuse));
        console.log("Specular: " + printColor(this.specular));
    };

    

}

function Material(id){
	this.id = id;
    this.shininess = 0.0;
    this.ambient = {
        r: 0.0,
        g: 0.0,
        b: 0.0,
        a: 0.0
    };
    this.diffuse = {
        r: 0.0,
        g: 0.0,
        b: 0.0,
        a: 0.0
    };
    this.specular = {
        r: 0.0,
        g: 0.0,
        b: 0.0,
        a: 0.0
    };
    this.emission = {
        r: 0.0,
        g: 0.0,
        b: 0.0,
        a: 0.0
    };

    this.print = function() {
        console.log("Material " + this.id);
        console.log("Shininess: " + this.shininess);
        console.log("Ambient: " + printColor(this.ambient));
        console.log("Diffuse: " + printColor(this.diffuse));
        console.log("Specular: " + printColor(this.specular));
        console.log("Emission: " + printColor(this.emission));
    };
}

function Illumination()
{
	this.amient = {
		r: 0.0,
        g: 0.0,
        b: 0.0,
        a: 0.0
	};

	this.background = {
        r: 0.0,
        g: 0.0,
        b: 0.0,
        a: 0.0
	};

	 this.print = function() {
        console.log("Ambient: " + printColor(this.ambient));
        console.log("Background: " + printColor(this.background));
        console.log("Doubleside: " + (this.doubleside ? "Yes" : "No"));
    };
}

function Texture(id)
{
	this.id=id;

	this.path = "";

	this.amplif_factor = {
		s : 0.0,
		t : 0.0

	};

	 this.print = function() {
        console.log("Texture " + this.id);
        console.log("Path: " + this.path);
        console.log("Amplif Factor: " + "(s:" + this.amplif_factor.s + ", t:" + this.amplif_factor.t + ")");
    };
}

function Node(id) {
    this.id = id;
    this.material = null;
    this.texture = null;
    this.matrix = mat4.create();

    this.descendants = [];

    this.print = function() {
        console.log("Node " + this.id);
        console.log("Material " + this.material);
        console.log("Texture " + this.texture);
        console.log("Matrix " + this.matrix);
        console.log("Descendants: " + this.descendants);
    };
}

LSXParser.prototype.parseColor = function(element) {
    var color = {};
    color.r = this.reader.getFloat(element, 'r');
    color.g = this.reader.getFloat(element, 'g');
    color.b = this.reader.getFloat(element, 'b');
    color.a = this.reader.getFloat(element, 'a');
    return color;
};

var printColor = function(c) {
    return "(" + c.r + ", " + c.g + ", " + c.b + ", " + c.a + ")";
};
