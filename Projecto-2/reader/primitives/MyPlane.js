function MyPlane(scene, args){
        this.scene = scene;
        this.nrDivisions = args[0];
        var controlPoints = [      // U = 0
                                                [ // V = 0..1;
                                                         [-0.5, 0.0, -0.5, 1 ],
                                                         [-0.5, 0.0,  0.5, 1 ]
                                                       
                                                ],
                                                // U = 1
                                                [ // V = 0..1
                                                         [ 0.5, 0.0, -0.5, 1 ],
                                                         [ 0.5, 0.0,  0.5, 1 ]                                                  
                                                ]
                                        ];
 
        var nurbsSurface = new CGFnurbsSurface(1, 1, [0, 0, 1, 1], [0, 0, 1, 1], controlPoints);
 
        getSurfacePoint = function(u, v) {
                return nurbsSurface.getPoint(u, v);
        };
 
        this.obj = new CGFnurbsObject(this.scene, getSurfacePoint, this.nrDivisions, this.nrDivisions);
}
 
MyPlane.prototype = Object.create(CGFobject.prototype);
MyPlane.prototype.constructor = MyPlane;
 
MyPlane.prototype.display = function(){
        this.obj.display();
 
}

/*function MyPlane(scene, args){
	CGFobject.call(this,scene);

	this.scene = scene;

	this.nrDivisions = args[0];

	console.log("kekerino" + args[0]);

	this.obj;

	this.initBuffers();
}

MyPlane.prototype = Object.create(CGFobject.prototype);
MyPlane.prototype.constructor = MyPlane;

MyPlane.prototype.initBuffers = function(){
	this.makeSurface(1,
					 1,
					 [0, 0, 1, 1],
					 [0, 0, 1, 1],
					 [	// U = 0
						[ // V = 0..1;
							 [-0.5, 0.0, -0.5, 1 ],
							 [-0.5, 0.0,  0.5, 1 ]
							
						],
						// U = 1
						[ // V = 0..1
							 [ 0.5, 0.0, -0.5, 1 ],
							 [ 0.5, 0.0,  0.5, 1 ]							 
						]
					]);

}

MyPlane.prototype.makeSurface = function (degree1, degree2, knots1, knots2, controlvertexes) {
		
	var nurbsSurface = new CGFnurbsSurface(degree1, degree2, knots1, knots2, controlvertexes);
	getSurfacePoint = function(u, v) {
		return nurbsSurface.getPoint(u, v);
	};

	this.obj = new CGFnurbsObject(this, getSurfacePoint, this.nrDivisions, this.nrDivisions);
}

MyPlane.prototype.display = function(){

	//var transform = mat4.create();
	//mat4.scale(transform, transform, [1,1,1]);
	//this.scene.multMatrix(transform);
	this.obj.display();

}*/