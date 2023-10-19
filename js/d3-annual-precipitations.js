// chart and animations for the annual precipitations figure

// create a bar chart for annual precipitations
const chartBarAnnual = dataset.then(function(data) {

	// compute annual historical precipitations
	const totalHistorical = d3.sum(data.map(d => d.Historical));


	// compute projected precipitations
	const totalProjected = d3.sum(data.map(d => d.Projected));

	// compute projected variation
	const projectedVariation = (totalProjected - totalHistorical)/totalHistorical;

	// assess maximum of historical and projected precipitations
	const yearlyMax = d3.max([totalHistorical, totalProjected]);


	// create scale functions
	const xTotal = d3.scaleBand()
			          .domain(["Historical observations", "Projected Mean"])
			          .range([margin.left, totalWidth/2+margin.left])
			          .padding(0.1);

	const yYearly = d3.scaleLinear()
		          .domain([0, yearlyMax]).nice()
		          .range([h - margin.bottom, margin.top]);

	// create a SVG element
	const svg = d3.select("#annual_precipitations") // link it to the relevant div
				.append("svg")
				.attr("width", totalWidth)
				.attr("height", h);

// define tooltip
const tooltip = d3.select("#annual_precipitations") // link it to the relevant div
      .append("div")
        .attr("id","tootip2")
        .attr("style", "position: absolute; opacity: 0;")// /!\ use absolute position (else issue with positioning)
        .attr("class", "tooltip")
        .style("background-color", lightBlack)
        .style("border-radius", "5px")
        .style("padding", "10px")
        .style("color", "white")


const showTooltip = function(event, d) {
  tooltip
    .transition()
    .duration(200)
  tooltip
    .style("opacity", 1)
    .html(`${d[0]}: ${formatTotal(d[1])} mm`) // expected data is an array [[key, value]]
    .style("left", (event.x)/2 + "px")
    .style("top", (event.y)/2+30 + "px")
}

const moveTooltip = function(event, d) {
tooltip
  .style("left", (event.x)/2 + "px")
  .style("top", (event.y)/2+30 + "px")
}

const hideTooltip = function(event, d) {
tooltip
  .transition()
  .duration(200)
  .style("opacity", 0)
}


	// create bars
	// bar for historical precipitations
	svg.append("g")      
		.selectAll("rect")
		.data([["Historical observations", totalHistorical]])
		.join("rect")
			.attr("class","annualHistorical")
			.attr("x", d => xTotal(d[0]))
			.attr("y", d => yYearly(d[1]))
			.attr("height", d => yYearly(0) - yYearly(d[1]))
			.attr("width", xTotal.bandwidth())
			.attr("stroke", "black")
			.attr("stroke-width", 3)
			.attr("fill", colorLightWhiteAlpha)
			.on("mouseover", showTooltip )
			.on("mousemove", moveTooltip )
			.on("mouseleave", hideTooltip );

	// bar for projected precipitations
	svg.append("g")      
		.selectAll("rect")
		.data([["Projected Mean", totalProjected]])
		.join("rect")
			.attr("class","annualProjected")
			.attr("x", d => xTotal(d[0]))
			.attr("y", d => yYearly(d[1]))
			.attr("height", d => yYearly(0) - yYearly(d[1]))
			.attr("width", xTotal.bandwidth())
			.attr("stroke", colorLightBlueAlpha)
			.attr("stroke-width", 2)
			.attr("fill", colorLightBlueAlpha)
			.on("mouseover", showTooltip )
			.on("mousemove", moveTooltip )
			.on("mouseleave", hideTooltip );

	// bar for projected increase
	svg.append("g")      
		.append("rect")
		.attr("class","projectedIncrease")
		.attr("x", d => xTotal("Projected Mean"))
		.attr("y", d => yYearly(totalProjected))
		.attr("height", d => yYearly(totalHistorical) - yYearly(totalProjected))
		.attr("width", xTotal.bandwidth())
		.attr("stroke", colorLightBlueAlpha)
		.attr("stroke-width", 2)
		.attr("fill", darkerBlue)
		.attr("opacity", 0)
		.attr("pointer-events", "none");

	// bar historical precipitations (as a reference in front of projected mean)
	svg.append("g")      
		.selectAll("rect")
		.data([["Projected Mean", totalHistorical]])
		.join("rect")
			.attr("class","annualHistoricalForComparison")
			.attr("x", d => xTotal(d[0]))
			.attr("y", d => yYearly(d[1]))
			.attr("height", d => yYearly(0) - yYearly(d[1]))
			.attr("width", xTotal.bandwidth())
			.attr("stroke", "black")
			.attr("stroke-width", 3)
			.attr("fill", colorLightWhiteAlpha)
		.attr("pointer-events", "none");


	// increase label (hidden at first)
	svg.append("g")
		.append("text")
			.attr("class","label-annual-increase")
			.text(d => `+${formatRate(projectedVariation)}`)
			.attr("x", d => xTotal("Projected Mean") + xTotal.bandwidth()/2) // center the label 
			.attr("y", d => yYearly(totalProjected)-5)
			.attr("text-anchor", "middle") // center the label 
			.attr("opacity", 0) // hide the labels
			.style("font-family", fontFamily)
			.style("fill", darkerBlue)
			.style("font-size", fontLabelBig)
			.style("font-weight", "bold");

	// axes
	const xTotalAxis = svg.append("g")
		.attr("class", "axis") //Assign axis class
		.attr("transform", `translate(0,${h - margin.bottom})`)
		.call(d3.axisBottom(xTotal));

	const yYearlyAxis = svg.append("g")
		.attr("class", "axis") //Assign axis class
		.attr("transform", `translate(${margin.left},0)`)
		.call(d3.axisLeft(yYearly).ticks(null, data.format))
		.call(g => g.select(".domain").remove())
		.call(g => g.selectAll(".tick text").attr("font-size", fontSize));

	// text label for the y axis
	svg.append("g")
		.append("text")
		.attr("class", "indivAxis")
		.attr("transform", "rotate(-90)")
		.attr("y", margin.left * 0.25)
		.attr("x",-h/2+margin.top)
		.attr("dy", "1em")
		.style("text-anchor", "middle")
		.style("font-family", fontFamily)
		.style("fill", fontFill)
		.style("font-size", fontAxisTitle)
			.text("Annual precipitations (mm)");

	// create a white rectangle to hide projected mean at first
	svg.append("g")      
		.selectAll("rect")
		.data([["Projected Mean", totalProjected]])
		.join("rect")
			.attr("class","hideProjected")
			.attr("x", d => xTotal(d[0])-3)
			.attr("y", d => yYearly(d[1])-3)
			.attr("height", d => yYearly(0) - yYearly(d[1])+25)
			.attr("width", xTotal.bandwidth()+25)
			.attr("stroke", "none")
			.attr("fill", "white")
			.attr("opacity", 1);

})


// define animation functions

function showProjectedAnnualPrecipitations() {

	d3.selectAll(".hideProjected")
		.transition()
		.duration(1000)
		.attr("pointer-events", "none")
		.attr("opacity",0);

}

function hideProjectedAnnualPrecipitations() {

	d3.selectAll(".hideProjected")
		.transition()
		.duration(500)
		.attr("pointer-events", null)
		.attr("opacity",1);

}

function showProjectedIncrease() {

	d3.selectAll(".projectedIncrease")
		.transition()
		.duration(1000)
		.attr("opacity",1);

	d3.selectAll(".label-annual-increase")
		.transition()
		.duration(1000)
		.attr("opacity",1);

}

function hideProjectedIncrease() {

	d3.selectAll(".projectedIncrease")
		.transition()
		.duration(500)
		.attr("opacity",0);

	d3.selectAll(".label-annual-increase")
		.transition()
		.duration(1000)
		.attr("opacity",0);

}
