function MyPatch(scene, args){
	this.args = args;

	this.order = this.args[0];
	this.partsU = this.args[1];
	this.partsV = this.args[2];
	this.controlPoints = this.getControlPoints(this.args[3]);
	var knots = this.getKnots();

	var surface = new CGFnurbsSurface(this.order, this.order, knots, knots, this.controlPoints);
	getSurfacePoint = function(u, v){
		return surface.getPoint(u, v);
	}

	CGFnurbsObject.call(this, scene, getSurfacePoint, this.partsU, this.partsV);
}

MyPatch.prototype = Object.create(CGFnurbsObject.prototype);
MyPatch.prototype.constructor = MyPatch;

MyPatch.prototype.getControlPoints = function(Points){
	var resArray = [];
	var ind;
	for(var uOrder = 0; uOrder <= this.order; uOrder++){
		var vPoints = [];
		for(var vOrder = 0; vOrder <= this.order; vOrder++){
			ind = uOrder * (this.order + 1) + vOrder;
			vPoints.push(Points[ind]);
		}
		resArray.push(vPoints);
	}
	return resArray;
}

MyPatch.prototype.getKnots = function() {
    var knots = [];
    for (var i = 0; i <= this.order ; i++)
        knots.push(0);
    for (var j = 0; j <= this.order ; j++)
        knots.push(1);

    return knots;
};

MyPatch.prototype.updateTex = function(ampS, ampT) {};