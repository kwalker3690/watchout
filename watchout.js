var game = {
	'height' : 600,
	'width' : 900
}

var gameContainer = d3.select('.game-container');
gameContainer.append('svg').attr('class', 'game-board');
var gameBoard = d3.select('.game-board');


/*////////////////////////////////////*/
/*////////////// CONTROL /////////////*/
/*////////////////////////////////////*/

var drag = d3.behavior.drag().on('drag', function(d, i){
		d.x += d3.event.dx
		d.y += d3.event.dy
		d3.select(this).attr('cx', d.x)
					   .attr('cy', d.y)
	});

var controlMaker = function(x,y){
	gameBoard.append('circle')
			.data([ {"x":x, "y":y} ])
			.attr('class', 'control')
			.attr('r', 25)
			.attr('fill', 'red')
		  	.attr('cx', function(target){return target.x})
		  	.attr('cy', function(target){return target.y})
			.call(drag);
		}
controlMaker(450, 300)


/*////////////////////////////////////*/
/*////////////// TARGET //////////////*/
/*////////////////////////////////////*/

var renderTargets = function(){

	var updateTargets = function(data){
		var target = gameBoard.selectAll('.target')

		.data(data, function(d){
			return d.x;
		})

		var targetEnter = target.enter()
		targetEnter.append('circle')
			  .attr('class', 'target')
			  .attr('r', 10)
			  .attr('fill', 'green')
			  .attr('cx', function(target){return target.x})
			  .attr('cy', function(target){return target.y})

		target.exit().remove()

		return targetEnter;
	}

	var moveFunc = function(endData) {
		var target = d3.select(this);
		var startPos = {
			'x' : parseFloat(target.attr('cx')),
			'y' : parseFloat(target.attr('cy'))
		}

		var endPos = {
			'x' : endData.x,
			'y' : endData.y
		}

		return function(t){
			checkCollision(target, collisionReset);
			var targetNextPos = {
				'x' : (startPos.x + (endPos.x - startPos.x))*t,
				'y' : (startPos.y + (endPos.y - startPos.y))*t
			}
			return target.attr('cx', targetNextPos.x).attr('cy', targetNextPos.y)
		}
	}

	return target.transition()
			  	 .duration(2000)
			  	 .tween('custom', moveFunc)
}

var newDataPosition = function(){
	var xPos = Math.random()*game.width;
	var yPos = Math.random()*game.height;
	var data = {'x':xPos, 'y':yPos}
	return data
}

/*////////////////////////////////////*/
/*///////////// COLLSION /////////////*/
/*////////////////////////////////////*/

var checkCollision = function(target, collidedCallback){
	var control = gameBoard.selectAll('.control');
	debugger;
	var radiusSum = parseFloat(target.r) + parseFloat(control.attr('r'));
	var xDiff = parseFloat(target.x - control.attr('cx'));
	var yDiff = parseFloat(target.y - control.attr('cy'))
	var separation = Math.sqrt(Math.pow(xDiff, 2) + Math.pow(yDiff, 2))

	console.log(target.x, 'place 1')

	if( separation < radiusSum){
		collidedCallback(target)
	}
}

var collisionReset = function(target){
	// console.log(target)
	// console.log(target.attr('cx'), 'place 2')
	// console.log(target.data())
	var dataArray = target.data();
	console.log(dataArray)
	for(var i = 0; i < dataArray.length; i++){
		console.log(dataArray[i]['x'], 'dataArray[i][x]')
		console.log(target.x, "target.attr('cx')")
		if(dataArray[i]['x'] == target.attr('cx')){
			console.log(i, 'index')
		}
	}
	//look through target array
	// find object with matching cx attr
	//delete it
	//update data
	// this.remove()
}


var data = [];
var targets = [];
for(var i = 0; i < 50; i++){
	data.push(newDataPosition())
	targets.push(updateTargets(data));
}




// setInterval(function(){
// 	var target = gameBoard.selectAll('.target');
// 	target.attr('cx', Math.random()*game.width);
// 	target.attr('cy', Math.random()*game.height)
// }, 1000)








