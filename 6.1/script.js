console.log('6.1');

//First, append <svg> element and implement the margin convention
var m = {t:50,r:50,b:50,l:50};
var outerWidth = document.getElementById('canvas').clientWidth,
    outerHeight = document.getElementById('canvas').clientHeight;
var w = outerWidth - m.l - m.r,
    h = outerHeight - m.t - m.b;

var plot = d3.select('.canvas')
    .append('svg')
    .attr('width',outerWidth)
    .attr('height',outerHeight)
    .append('g')
    .attr('transform','translate(' + m.l + ',' + m.t + ')');

var minX, maxX;    

//Import data and parse
d3.csv("../data/world_bank_2012.csv",parse, function(error, rows) {
	console.table(rows);

	minX = d3.min(rows, function(d){ return d.gdpPerCap; });
	maxX = d3.max(rows, function(d){ return d.gdpPerCap; });
	var extent = d3.extent (rows, function(d){return d.gdpPerCap; });

	console.log(extent[0],extent[1]);
	
	var scaleX = d3.scalePow()
	.exponent(.5)
	    .domain(extent)
	    .range([0,w]);

	var scaleY = d3.scaleLinear()
	    .domain([0,100])
	    .range([h,0]);

	//create the axis function
	var axisX = d3.axisBottom()
	    .scale(scaleX)
	    .tickSize(-h); 


	var axisNode = plot.append('g').attr('class','axis')
	        .attr('transform','translate(0,'+h+') ');
	
	axisX(axisNode);       


	rows.forEach( function(row,i){
		/*plot.append('circle')
		    .attr('r',10)
		    .attr('cx',scaleX(row.gdpPerCap))
		    .attr('cy',scaleY(row.pctUrban));*/

	    var node = plot.append('g')
		    .attr('transform','translate('+ scaleX(row.gdpPerCap) + ',' + scaleY(row.pctUrban)+')');
		
	    node.append('circle')
		    .attr('r',10)
		    .style('fill-opacity',.1)

	    node.append('text').text(row.countryCode) 

	        .style('font-size','5px');   

	})


});

//function parse(d){
//	console.log(d);

//}

function parse(row) {

	if(row['Urban population (% of total)']==".." || row['GDP per capita, PPP (constant 2011 international $)']=='..') return;

	return {
		country: row['Country Name'],//d.country Name
		countryCode: row['Country Code'],
		pctPrimaryCompletion: row['Primary completion rate, total (% of relevant age group']=='..'?undefined: +row['Primary completion rate, total (% of relevant age group'],
		gdpPerCap: row['GDP per capita, PPP (constant 2011 international $)']=='..'?undefined: +row['GDP per capita, PPP (constant 2011 international $)'],
		pctUrban: row['Urban population (% of total)']=='..'?undefined: +row['Urban population (% of total)']
	};

}
