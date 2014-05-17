// console.log("vis loaded");

var svg;
var barData;
var paddingX = 0;
var paddingY = 20;
var	barHeight = 20;
var labelWidth = 80;
var labelPadding = 20;
var barPadding = 10;
var scaleX;
var colorScale;
var w,h;
var xAxis;

function hideMyAss() {
	console.log("hiD)");
	collapseBars(barData);
}

function collapseBars(data) {
	initBars(data);
	d3.selectAll("svg rect")
		.on("click",null);
}

function initBars(data) {
	barData = data.sort(function (a,b) {
		return b.value - a.value;
	});
	// console.log("..",data);
	
	var maxValue = 0;
	
//	var w = window.innerWidth-16;

//var w = window.innerWidth-16;
//var h = window.innerHeight-16;
w = $(".starter-template").outerWidth();
h = $(".starter-template").outerHeight();


maxValue = d3.max(data,function(d) {
	return d.value;
});

//var h = nToShow*(barHeight+barPadding)+100;
scaleX = d3.scale.linear();
	//scaleX.domain([0,maxes[keys[0]]]);
	scaleX.domain([0,maxValue]);
	scaleX.range([0,w-paddingX-1-labelWidth-labelPadding]);
	colorScale = d3.scale.linear();
	colorScale.domain([0,maxValue]);
	colorScale.range([0,255]);
	colorScale2 = d3.scale.category10();
	xAxis = d3.svg.axis()
	.scale(scaleX)
	.orient("bottom")
	.ticks(10);

	d3.select("svg").remove();
	svg = d3.select(".starter-template .svgwrapper")
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
     			return scaleX(d.value);
       		})
       		.attr("class","main")
			.attr("fill",function(d,i) {
				return colorScale2(i);
				//return "rgb("+Math.round(colorScale(d.value))+",0,0)";
	   		});
	   	svg.selectAll("svg")
	   		.data(data)
	   		.enter()
	   		.append("text")
	   		.attr("class","main")
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
	   			return scaleX(d.value)+labelPadding;
	   		})
	   		;
}

function expandBars(data,index) {
	var expanded = {};
//	console.log(data,index);
//console.log(data.domains);

		d3.selectAll(data.domains).each(function (d,i) {
			if(typeof expanded[data.domains[i]] != "undefined") {
					expanded[data.domains[i]]++;
					return false;
			} else {
					console.log("neu",data.domains[i]);
					expanded[data.domains[i]] = 1;
					return true;
			}
		});
		var count = 1;
		for (var u in expanded) {
			console.log(u,expanded[u]);
			svg
				.append("rect")
	   			.attr("x",barPadding)
	   			.attr("class","sub")
				.attr("width",scaleX(expanded[u]))
				.attr("height",barHeight)
				.attr("fill",function(d,i) {
					return colorScale2(index);
				})
	   			.attr("y",function(d,i) {
	   				console.log(count);
	   				return barHeight*(index+count)+barPadding*(index+count);
	   			});
	   		svg
				.append("text")
				.attr("class","sub")

				.text(function(d,i) {

	   				return u;
	   				//return d.name;
	   				})
	   			.attr("y",function(d,i) {
	   				return barHeight*(index+count)+barPadding*(index+count)+barHeight/2;
	   			})
	   			.attr("x",paddingX)
	   			.transition()
	   			.duration(450)
	   			
	   			.attr("x",function(d,i) {
		   			return scaleX(expanded[u])+labelPadding;
	   			});



	   			count++;
	   		}

	svg.selectAll("rect.main")
		.filter(function(d,i) {
			console.log("index",index,"i",i);
			if(i<=index || i==0) {
				return false;
			} else {
				console.log("true");
				return true;
			}
		})
		.transition()
	   	.duration(450)
		.attr("y",function() {
			//return d3.select(this).attr("y");
			return parseInt(d3.select(this).attr("y"))+barHeight*(count-1)+barPadding*(count-1);
		});

	svg.selectAll("text.main")
		.filter(function(d,i) {
			
			if(i<=index || i==0) {
				return false;
			} else {
				return true;
			}
		})
		.transition()
	   	.duration(450)
		.attr("y",function() {
			//return d3.select(this).attr("y");
			return parseInt(d3.select(this).attr("y"))+barHeight*(count-1)+barPadding*(count-1);
		});
			
		}
	/*	svg.selectAll("svg")
			.data(data)
				function(d,i) {
				console.log(d,i);
				
			})
			.filter(function(d,i) {
				console.log(d);
				if(typeof expanded[domains[i]] != "undefined") {
					return false;
				} else {
					return true;
				}
			})
	       	
	       	.append("rect")
	       	.attr("height",barHeight)
	  		.attr("width",0)
	  		.attr("y",function(d,i) {
	       		return barHeight*i+barPadding*i;
	       	})
			.attr("x",paddingX)
	       	.transition()
	      	.duration(450)
	     	.delay(function(d,i) {
	       		return 200*i;
	       	})
     		.attr("width",function(d,i) {
     			console.log(d);
     			return 0;
     			return scaleX(Math.log(d.value));
       		})
			.attr("fill",function(d,i) {
				return "#000";
				//return "rgb("+Math.round(colorScale(Math.log(d.value)))+",0,0)";
	   		});
	   */







function keywords(categoryId) {
	
	var maxValue = 0;
	
//	var w = window.innerWidth-16;

//var w = window.innerWidth-16;
//var h = window.innerHeight-16;
w = $(".starter-template").outerWidth();
h = $(".starter-template").outerHeight();


maxValue = d3.max(barData[categoryId],function(d) {
	return d.value;
});

//var h = nToShow*(barHeight+barPadding)+100;
var scalekeywords = d3.scale.linear();
	//scaleX.domain([0,maxes[keys[0]]]);
	scalekeywords.domain([0,maxValue]);
	scalekeywords.range([0,w-paddingX-1-labelWidth-labelPadding]);

	d3.select("svg").remove();
	svg = d3.select(".starter-template .svgwrapper")
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
     			return scaleX(d.value);
       		})
       		.attr("class","main")
			.attr("fill",function(d,i) {
				return colorScale2(i);
				//return "rgb("+Math.round(colorScale(d.value))+",0,0)";
	   		});
	   	svg.selectAll("svg")
	   		.data(data)
	   		.enter()
	   		.append("text")
	   		.attr("class","main")
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
	   			return scaleX(d.value)+labelPadding;
	   		})
	   		;
}


 
//updateData(data);
//initBars([{news:5},{entertainment:10}]);

