// supports zoom, pan, and drag. country name and tooltip moves along with pan and zoom

//Define Margin
var margin = {left: 80, right: 80, top: 50, bottom: 50 }, 
    width = 1000 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

// initialize an array of 15 colors to assign to countries later
var colorsArray = ["rgb(204, 0, 0)", "rgb(255, 128, 0)", "rgb(255, 255, 0)", "rgb(128, 255, 0)", "rgb(0, 153, 76)", "rgb(0, 204, 204)", "rgb(204, 0, 0)", "rgb(102, 178, 255)", "rgb(204, 0, 0)", "rgb(0, 0, 204)", "rgb(229, 204, 255)", "rgb(255, 154, 255)", "rgb(255, 102, 178)", "rgb(128, 128, 128)", "rgb(204, 0, 102)"];

// Define the div for the tooltip
var div = d3.select("body").append("div")	
    .attr("class", "tooltip")				
    .style("opacity", 0);

//Define SVG
var svg = d3.select("body")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Add a clipPath: everything out of this area won't be drawn.
/*var clip = svg.append("defs").append("svg:clipPath")
    .attr("id", "clip")
    .append("svg:rect")
    .attr("width", width )
    .attr("height", height )
    .attr("x", 0)
    .attr("y", 0);*/

//Define Scales   
var xScale = d3.scaleLinear()
    .range([0, width]);

var yScale = d3.scaleLinear()
    .range([height, 0]);


//Define Axis
var xAxis = d3.axisBottom(xScale)
            .ticks(7);
var yAxis = d3.axisLeft(yScale);

//read in data
d3.csv("scatterdata.csv").then(function(data) {
    console.log(data); // array of objects, structured in the same way as scatterdataset in scatterplotV2020.js
    
    for(var j in data) {
        data[j].color = colorsArray[j]; // assign colors to countries from randomly generated array of color values
    }
    
    console.log(data); // check if color values were added in data
    
    var gdp = [], ecc = [];
    
    for(var i in data) {
        gdp.push(+data[i].gdp);
        ecc.push(+data[i].ecc);
    }
    
    console.log(gdp);
    console.log("min: " + d3.min(gdp) + ", max: " + d3.max(gdp));
    console.log("min: " + d3.min(ecc) + ", max: " + d3.max(ecc));
    
    // Define domain for xScale and yScale
    xScale.domain([
        d3.min(gdp),
        d3.max(gdp)
    ])

    //y domain
    yScale.domain([
        d3.min(ecc),
        d3.max(ecc) + 50
    ]);
    
    //Draw Scatterplot
    svg.selectAll(".dot")
        .data(data)
        .enter().append("circle")
        .attr("class", "dot")
        //.attr("clip-path", "url(#clip)")
        .attr("r", function(d) {console.log(+d.ec); return +d.ec*0.5})
        .attr("cx", function(d) {console.log(xScale(+d.gdp)); return xScale(+d.gdp);})
        .attr("cy", function(d) {return yScale(+d.ecc);})
        .style("fill", function(d) { return d.color})
        .on("mouseover", function(d) {	// tooltip appears when cursor hovers over dot
            console.log(d);
            div.transition()		
                .duration(200)		
                .style("opacity", .9); // fade transitoin		
            div	.html(d.country + "<br/>"
                     + "<div class='left'>Population </div>" + "<div class='center'>:</div>" +"<div class='right'>" + d.population + "</div>" + "<br/>"
                     + "<div class='left'>GDP </div>" + "<div class='center'>:</div>" + "<div class='right'>" + d.gdp + "</div>" + "<br/>"
                     + "<div class='left'>ECC </div>" + "<div class='center'>:</div>" + "<div class='right'>" + d.ecc + "</div>" + "<br/>"
                     + "<div class='left'>Total </div>" + "<div class='center'>:</div>" +"<div class='right'>" + d.ec + "</div>")	 // text content of tooltip
                .style("width", "150px") // width, height, and position of tooltip
                .style("height", "75px")
                .style("left", (d3.event.pageX + 15) + "px")
                .style("top", (d3.event.pageY - 28) + "px");
            })					
        .on("mouseout", function(d) { // if cursor goes away from dot, it will disappear (hence 0 opacity)
            div.transition()		
                .duration(500)		
                .style("opacity", 0);	
        });

    //Draw Country Names
    svg.selectAll(".text")
        .data(data)
        .enter().append("text")
        .attr("class","text")
        //.attr("clip-path", "url(#clip)")
        .style("text-anchor", "start")
        .attr("x", function(d) {return xScale(d.gdp);})
        .attr("y", function(d) {return yScale(d.ecc);})
        .style("fill", "black")
        .text(function (d) {return d.country; });

  //x-axis
    var gX = svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
    
    gX.append("text")
        .attr("class", "label")
        .attr("y", 50)
        .attr("x", width/2)
        .style("text-anchor", "middle")
        .attr("font-size", "12px")
        .attr("fill", "#000")
        .text("GDP (in Trillion US Dollars) in 2010");

    
    //Y-axis
    var gY = svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
    
    gY.append("text")
        .attr("class", "label")
        .attr("transform", "rotate(-90)")
        .attr("y", -50)
        .attr("x", -50)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .attr("font-size", "12px")
        .attr("fill", "#000")
        .text("Energy Consumption per Capita (in Million BTUs per person)");
    
    // draw legend box
    svg.append("rect")
        .attr("class", "legend")
        .attr("width", 300)
        .attr("height", 225)
        .attr("x", width - 300)
        .attr("y", height - 250)
        .style("fill", "lightgrey")
        .style("opacity", 0.5)
    
    // circles in legend
    svg.append("circle")
        .attr("class", "legendCircle")
        .attr("r", "50")
        .attr("fill", "white")
        .attr("cx", width - 75)
        .attr("cy", height - 100);
    
    svg.append("circle")
        .attr("class", "legendCircle")
        .attr("r", "20")
        .attr("fill", "white")
        .attr("cx", width - 75)
        .attr("cy", height - 185);
    
    svg.append("circle")
        .attr("class", "legendCircle")
        .attr("r", "5")
        .attr("fill", "white")
        .attr("cx", width - 75)
        .attr("cy", height - 225);
    
    //legend text
    svg.append("text")
        .attr("class", "legendText")
        .attr("y", height - 30)
        .attr("x", width - 150)
        .style("text-anchor", "middle")
        .attr("font-size", "12px")
        .attr("fill", "green")
        .text("Total Energy Consumption");

    svg.append("text")
        .attr("class", "legendText")
        .attr("y", height - 222)
        .attr("x", width - 200)
        .style("text-anchor", "middle")
        .attr("font-size", "12px")
        .attr("fill", "#000")
        .text("1 Trillion BTUs");

    svg.append("text")
        .attr("class", "legendText")
        .attr("y", height - 180)
        .attr("x", width - 200)
        .style("text-anchor", "middle")
        .attr("font-size", "12px")
        .attr("fill", "#000")
        .text("10 Trillion BTUs");

    svg.append("text")
        .attr("class", "legendText")
        .attr("y", height - 100)
        .attr("x", width - 200)
        .style("text-anchor", "middle")
        .attr("font-size", "12px")
        .attr("fill", "#000")
        .text("100 Trillion BTUs");
    
    // Set the zoom and pan features: how much you can zoom, on which part, and what to do when there is a zoom
    var zoom = d3.zoom()
      .scaleExtent([.5, 20])  // This control how much you can unzoom (x0.5) and zoom (x20)
      .extent([[0, 0], [width, height]])
      .on("zoom", updateChart);

    svg.call(zoom);

    // A function that updates the chart when the user zoom and thus new boundaries are available
    function updateChart() {
        console.log(d3.event.transform); // see initial chart position data
        // recover the new scale
        var newX = d3.event.transform.rescaleX(xScale);
        var newY = d3.event.transform.rescaleY(yScale);
        
        // update dot position
        svg
            .selectAll(".dot")
            .attr("transform", d3.event.transform);
            //.attr('cx', function(d) {return newX(d.gdp)})
            //.attr('cy', function(d) {return newY(d.ecc)})
        
        // update country name position
        svg
            .selectAll(".text")
            .attr("x", function(d) {return newX(d.gdp);})
            .attr("y", function(d) {return newY(d.ecc);});
        
        // update axes with these new boundaries
        gX.call(xAxis.scale(d3.event.transform.rescaleX(xScale)));
        gY.call(yAxis.scale(d3.event.transform.rescaleY(yScale)));
        
        console.log(d3.event.transform); // check if chart changed at all
    }
})