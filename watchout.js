var game = {
	'height' : 600,
	'width' : 900,
	'score' : 0,
	'collisions' : 0,
	'bestScore': 0,
}

var gameContainer = d3.select('.game-container');
gameContainer.append('svg').attr('class', 'game-board');
var gameBoard = d3.select('.game-board');

var updateScore = function(){
	d3.selectAll('.current span').text(game.score.toString())
}

var increaseScore = function(){
	game.score++
	updateScore();
}

var updateBestScore = function(){
	if(game.bestScore < game.score){
		game.bestScore = game.score
	}
	d3.selectAll('.high span').text(game.bestScore.toString())
}


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


/*////////////////////////////////////*/
/*////////////// TARGET //////////////*/
/*////////////////////////////////////*/

var renderTargets = function(data){
	var targetPath = "m215,159l21,27l28,-30l-4,40l33,4l-40,19l0,43l-16,-38l-38,0l29,-19l-13,-46z";
	var target = gameBoard.selectAll('.target')


	.data(data, function(d){
		return d.id;
	})

	var targetEnter = target.enter()
	targetEnter.append('circle')
		  .attr('class', 'target')
		  .attr('r', 10)
		  .attr('fill', 'green')
		  .attr('cx', function(target){return target.x})
		  .attr('cy', function(target){return target.y})

	target.exit().remove()

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
				'x' : (startPos.x + (endPos.x - startPos.x)*t),
				'y' : (startPos.y + (endPos.y - startPos.y)*t)
			}
			return target.attr('cx', targetNextPos.x).attr('cy', targetNextPos.y)
		}
	}

	return target.transition()
			  	 .duration(1000)
			  	 .tween('custom', moveFunc)
}

/*////////////////////////////////////*/
/*///////////// COLLSION /////////////*/
/*////////////////////////////////////*/

var checkCollision = function(target, collidedCallback){
	var control = gameBoard.selectAll('.control');
		var radiusSum = parseFloat(target.attr('r')) + parseFloat(control.attr('r'));
		var xDiff = parseFloat(target.attr('cx') - control.attr('cx'));
		var yDiff = parseFloat(target.attr('cy') - control.attr('cy'))
		var separation = Math.sqrt(Math.pow(xDiff, 2) + Math.pow(yDiff, 2))
		if( separation < radiusSum){
			collidedCallback(target)
		}

}

var collisionReset = function(target){
	updateBestScore();
	game.score = 0;
	updateScore();
}




var createTargets = function(){
	var targets = [];
	var data = [];
	for(var i = 0; i < 30; i++){
		data.push({'id': i, 'x':Math.random()*game.width, 'y':Math.random()*game.height})
	}
	targets = renderTargets(data);
	return targets
}


var play = function(){
	controlMaker(450, 300)
	createTargets();
	setInterval(createTargets, 1000)
	setInterval(increaseScore, 50)
}

play()






