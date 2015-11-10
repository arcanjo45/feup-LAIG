function CircularAnimation(id,time,center,rad,stang,rtang)
{
	Animation.call(this,id,time);

	this.center = center;
	this.rad = rad;
	this.stang = stang;
	this.rtang = rtang;
}

CircularAnimation.prototype = Object.create(Animation.prototype);

CircularAnimation.prototype.constructor = CircularAnimation;