console.log("vis loaded");

var svg;
var barData;
function initBars(data) {
	barData = data;
	
	var paddingX = 10;
	var paddingY = 20;
	var barHeight = 20;
	var labelWidth = 80;
	var labelPadding = 20;
	var barPadding = 10;
	var maxValue = 0;
	
//	var w = window.innerWidth-16;

var w = window.innerWidth-16;
var h = window.innerHeight-16;


maxValue = d3.max(data,function(d) {
	return Math.log(d.value);
});

//var h = nToShow*(barHeight+barPadding)+100;
var scaleX = d3.scale.linear();
	//scaleX.domain([0,maxes[keys[0]]]);
	scaleX.domain([0,maxValue]);
	scaleX.range([0,w-paddingX-1-labelWidth-labelPadding]);
var colorScale = d3.scale.linear();
	colorScale.domain([0,maxValue]);
	colorScale.range([0,255]);
var xAxis = d3.svg.axis()
	.scale(scaleX)
	.orient("bottom")
	.ticks(10);

	d3.select("svg").remove();
	svg = d3.select("body")
		.append("svg")
		.attr("width", w)
		.attr("height",h);
	svg.selectAll("svg")
	       	.data(data)
	       	.enter()
	       	.append("rect")
	       	.attr("height",barHeight)
	  		.attr("width",0)
	  		.attr("y",function(d,i) {
	       		return barHeight*i+barPadding*i;
	       	})
	       	.on("click",function(d,i,u){
	       		expandBars(d,i);
	       	})
	       	.on("mouseover",function(d,i,u){
	       		d3.select(this).attr("stroke","#000");
	       	})
	       	.on("mouseout",function(d,i,u){
	       		d3.select(this).attr("stroke","none");
	       	})
			.attr("x",paddingX)
	       	.transition()
	      	.duration(450)
	     	.delay(function(d,i) {
	       		return 200*i;
	       	})
     		.attr("width",function(d,i) {
     			return scaleX(Math.log(d.value));
       		})
			.attr("fill",function(d,i) {
				return "rgb("+Math.round(colorScale(Math.log(d.value)))+",0,0)";
	   		});
	   	svg.selectAll("svg")
	   		.data(data)
	   		.enter()
	   		.append("text")
	   		.text(function(d,i) {
	   			return d.name;
	   			})
	   		.attr("y",function(d,i) {
	   			return barHeight*i+barPadding*i+barHeight/2;
	   		})
	   		.attr("x",paddingX)
	   		.transition()
	   		.duration(450)
	   		.delay(function(d,i) {
	   			return 200*i;
	   		})
	   		.attr("x",function(d,i) {
	   			return scaleX(Math.log(d.value))+labelPadding;
	   		})
	   		;
}

function expandBars(data,index) {
	console.log(data,index);
}
function updateData(data) {
	svg.selectAll("svg")
	       	.data(data)
	       	.attr("width",function(d,i) {
     			return scaleX(Math.log(d.value));
       		})
			.attr("fill",function(d,i) {
				return "rgb("+Math.round(colorScale(Math.log(d.value)))+",0,0)";
	   		});
}
//updateData(data);
//initBars([{news:5},{entertainment:10}]);

