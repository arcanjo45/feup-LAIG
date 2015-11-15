function LinearAnimation(id,span,controlpoints)
{
     Animation.call(this,id,span);

    this.controlPoints = controlpoints;
    this.velocity = 0;
    this.distance = 0;
    this.currentDistance = 0;
    this.distanceList = {};
    this.currentTranslation = vec3.fromValues(0,0,0);
    this.currentRotation = 0;
    this.currentJ = 0;
    this.span=span;
    
    this.initBuffers();
}


LinearAnimation.prototype = Object.create(Animation.prototype);

LinearAnimation.prototype.constructor = LinearAnimation;

LinearAnimation.prototype.initBuffers = function()
{
    var tempVec = vec3.create();

for(var i = 0; i < this.controlPoints.length - 1;i++){

vec3.sub(tempVec,this.controlPoints[i+1], this.controlPoints[i]);
this.distance += Math.abs(vec3.length(tempVec));
this.distanceList[i] = (this.distance);
console.log("distance list = " + this.distanceList[i]);
}

this.velocity = this.distance/(this.span*1000);

console.log("span = " + this.span);
console.log("Velocity = " + this.velocity + "\n Distance = " + this.distance + "\nControl Points = " + this.controlPoints );

}

LinearAnimation.prototype.update = function(delta){

    this.currentDistance += delta*this.velocity;
    
    //var tempMatrix = mat4.create();
    
    mat4.identity(this.matrix);
    
    var i,j = 0,tempCurrentPoint = 0;

    for(i in this.distanceList){
        tempCurrentPoint = j+1;
            if(this.distanceList[i] >= this.currentDistance)
            {
            break;
        }
        j++;
    }
    if(j != this.controlPoints.length-1){
    
    var direction = vec3.create();  
    vec3.sub(direction,this.controlPoints[j+1],this.controlPoints[j]);  
    
    var percent;    
    if(i > 0)
        percent = delta*this.velocity/(this.distanceList[i]-this.distanceList[i-1]);
    else percent = delta*this.velocity/this.distanceList[i];
    
    vec3.scale(direction,direction,percent);
    
    vec3.add(this.currentTranslation,this.currentTranslation,direction);    
    if(this.currentJ != j){
        this.currentJ = j;
        if(vec3.length(vec3.fromValues(direction[0],0,direction[2])) != 0)
        this.currentRotation = Math.atan2(direction[0], direction[2]);
        }
    }
    else this.done=true;

    
    mat4.translate(this.matrix,this.matrix,this.currentTranslation);

    mat4.rotateY(this.matrix,this.matrix,this.currentRotation);


};

LinearAnimation.prototype.interp = function() {
    var deltaTimeCP = this.time / (this.cp.length-1);

    var currCPIndex = Math.floor(this.currTime/deltaTimeCP);
    var nextCPIndex = Math.ceil(this.currTime/deltaTimeCP);

    var currCP = this.cp[currCPIndex];
    var nextCP = this.cp[nextCPIndex];

    var f = (this.currTime - Math.floor(this.currTime / deltaTimeCP) * deltaTimeCP) / deltaTimeCP;
    var interpPoint = [];
    interpPoint[0] = linearInterp(currCP[0], nextCP[0], f);
    interpPoint[1] = linearInterp(currCP[1], nextCP[1], f);
    interpPoint[2] = linearInterp(currCP[2], nextCP[2], f);

    return interpPoint;
};

function linearInterp(a, b, f) {
    return (a * (1.0-f)) + (b * f);
}

LinearAnimation.prototype.clone = function(delta) {
    return new LinearAnimation(this.id,
        this.span,
        this.controlPoints);
};