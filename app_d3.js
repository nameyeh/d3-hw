// Event listener for window resize.
// When the browser window is resized, makeResponsive() is called.
d3.select(window).on("resize", makeResponsive);

loadChart();

function makeResponsive() {
  var svgArea = d3.select("svg");

  if (!svgArea.empty()) {
    svgArea.remove();
    loadChart();
  }
}

function loadChart() {
    var svgWidth = window.innerWidth;
    var svgHeight = window.innerHeight;

    var margin = {
        top: 20,
        right: 40,
        bottom: 60,
        left: 90
    };

// Define dimensions of the chart area
    var width = svgWidth - margin.left - margin.right;
    var height = svgHeight - margin.top - margin.bottom;

// Select body, append SVG area to it, and set its dimensions
    var svg = d3.select(".chart")
        .append("svg")
        .attr("width", svgWidth)
        .attr("height", svgHeight);

// Append a group area, then set its margins
    var chartGroup = svg.append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

// load data from csv
    d3.csv("merged_data.csv", function (error, depData) {
        // Throw an error if one occurs
        if(error) console.warn(error);
        
        // Format the date and cast the force value to a number
        depData.forEach(function (data) {
            data.medAge = +data.medAge;
            data.pctDep = +data.pctDep;
            console.log(data.medAge);
            console.log(data.pctDep);
            console.log(data.abbr);
        });

    // Create the scales for the chart
    // =================================

        
        var xScale = d3.scaleLinear()
        .domain([30, 45])
        .range([0, width]);
        

        var yScale = d3.scaleLinear()
        .domain(d3.extent(depData, d => d.pctDep))
        .range([height, 0]);
    //Create the axes
    // =================================
        var bottomAxis = d3.axisBottom(xScale);
        var leftAxis = d3.axisLeft(yScale);
    
    //Append the axes to the chartGroup
    // ==============================================
    // Add x-axis
        chartGroup.append("g")
        .attr("transform", `translate(0, ${height})`).call(bottomAxis);

    // Add y-axis
        chartGroup.append("g").call(leftAxis);

            var circlesGroup = chartGroup.selectAll("circle")
                    .data(depData)
                    .enter()
                    .append("circle")
                    .attr("cx", d => xScale(d.medAge))
                    .attr("cy", d => yScale(d.pctDep))
                    .attr("r", "15")
                    .attr("fill", "lightblue")
                    .attr("opacity", ".75");

                var text = chartGroup.selectAll("p")
                    .data(depData)
                    .enter()
                    .append("text")
                    .attr("x", d => xScale(d.medAge))
                    .attr("y", d => yScale(d.pctDep))
                    .attr("dx", "-.5em")
                    .attr("dy", ".5em")
                    .attr("fill", "black")
                    .attr("font-size", "11px")
                    .attr("font-family","sans-serif")
                    .text(function(d) {return d.abbr});
                console.log(text);
                
                chartGroup.append("text")
                    .attr("transform", "rotate(-90)")
                    .attr("y", 0 - margin.left + 30)
                    .attr("x", 0 - (height / 1.5))
                    .attr("dy", "1em")
                    .attr("class", "axisText")
                    .text("Percent w/ Depression")
                    .attr("font-family","sans-serif")
                    .attr("font-size", "20px");

                chartGroup.append("text")
                    .attr("transform", `translate(${width/2.4}, ${height + margin.top + 20})`)
                    .attr("class", "axisText")
                    .text("Median Age - 2014 Data")
                    .attr("font-family","sans-serif")
                    .attr("font-size", "20px");
            });
        };