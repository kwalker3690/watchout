var Control = function(){
	this.x = 0;
	this.y = 0;
	this.el;
}

Control.prototype.render = function(location){
	this.el = location.append('circle')
			.data([ {"x":this.x, "y":this.y} ])
			.attr('class', 'control')
			.attr('r', 25)
			.attr('fill', 'red')
			.attr('transform', 'translate(' + this.x + ',' + this.y + ')')
			// .call(drag);
	this.setupMove();
	return this;
}

Control.prototype.getX = function(){
	return this.x
}

Control.prototype.getY = function(){
	return this.y
}

Control.prototype.setX = function(x){
	this.x = x
}

Control.prototype.setY = function(y){
	this.y = y
}

Control.prototype.transform = function(x,y){
	this.setX = x;
	this.setY = y;
	this.el.attr('transform', 'translate(' + x + ',' + y + ')')
}

Control.prototype.moveRelative = function(dx, dy){
	this.transform(this.getX()+dx, this.getY()+dy)
}

Control.prototype.setupMove = function(){
	var dragMove = function(){
		this.moveRelative(d3.event.dx, d3.event.dy)
	}
	var that = this;

	var drag = d3.behavior.drag().on('drag', function(d, i){
		console.log(that.getX())
		that.setX(that.getX() += d3.event.dx)
		that.setY(that.getY() += d3.event.dy)
		console.log(that.getX())
		d3.select(that).attr('transform', function(d,i){
			return "translate(" + [that.getX(), that.getY()] + ")"
		})
	});
	console.log(this)

	return this.el.call(drag)

}