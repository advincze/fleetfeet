console.log("vis loaded");

function initBars(data) {
	console.log(data);
	var paddingX = 10;
	var paddingY = 20;
	var barHeight = 20;
	var labelWidth = 80;
	var labelPadding = 5;
	var barPadding = 5;
//	var w = window.innerWidth-16;

var w = window.innerWidth-16;
var h = window.innerHeight-16;
//var h = nToShow*(barHeight+barPadding)+100;
var scaleX = d3.scale.linear();
	//scaleX.domain([0,maxes[keys[0]]]);
	scaleX.domain([0,10]);
	scaleX.range([0,w-paddingX-1-labelWidth-labelPadding]);
var colorScale = d3.scale.linear();
	colorScale.domain([0,10]);
	colorScale.range([0,255]);
var xAxis = d3.svg.axis()
	.scale(scaleX)
	.orient("bottom")
	.ticks(10);
var svg = d3.select("body")
		.append("svg")
		.attr("width", w)
		.attr("height",h);
	svg.selectAll("svg")
	       	.data(data)
	       	.enter()
	       	.append("rect")
	       	.attr("height",barHeight)
	  		.attr("y",function(d,i) {
	       		return i*(barHeight+barPadding);
	      	})       
	  		.attr("width",100)
			.attr("x",paddingX)
	       	.transition()
	      	.duration(450)
	     	.delay(function(d,i) {
	       		return 200*i;
	       	})
     		.attr("width",function(d,i) {
	       		
	       			var sumX = 0;
	       			
	       			return scaleX(sumX);
	       		
       		});
    
}


//initBars([{news:5},{entertainment:10}]);

