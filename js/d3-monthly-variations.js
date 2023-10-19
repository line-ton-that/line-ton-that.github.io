// chart and animations for the monthly variations figure

// create bar chart for monthly variations
const chartBarPctChange = dataset.then(function(data) {

	// use scale functions
	const x = xScale(data);
	const yPctChange = yScalePctChange(data);

	// create a SVG element
	const svg = d3.select("#monthly_variations") // link it to the relevant div
		.append("svg")
		.attr("width", totalWidth)
		.attr("height", h);

	// define tooltip
	const tooltip = d3.select("#monthly_variations") // link it to the relevant div
	      .append("div")
	        .attr("id","tootip3")
	        .attr("style", "position: absolute; opacity: 0;") // /!\ use absolute position (else issue with positioning)
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
	    .html(`Month: ${d.Month} <br>
	    	Projected difference: ${formatRateHtml(d.PctChange)}`)
	    .style("left", (event.x)/2 + "px")
	    .style("top", (event.y)/3 + "px")
	}

	const moveTooltip = function(event, d) {
	tooltip
	  .style("left", (event.x)/2 + "px")
	  .style("top", (event.y)/2+20 + "px")
	}

	const hideTooltip = function(event, d) {
	tooltip
	  .transition()
	  .duration(200)
	  .style("opacity", 0)
	}

	// create bars
	svg.append("g")
		.selectAll("rect")
		.data(data)
		.join("rect")
			.attr("class","variation")
			.attr("x", d => x(d.Month))
			.attr("y", d => yPctChange(Math.max(d.PctChange, 0)))
			.attr("height", d => Math.abs(yPctChange(0) - yPctChange(d.PctChange)))
			.attr("width", x.bandwidth())
			.attr("stroke", d => d.PctChange < 0 ? lightGrey : colorLightBlueAlpha) // color code used for increase or decrease
			.attr("stroke-width", 2)
			.attr("fill", d => d.PctChange < 0 ? colorLightWhiteAlpha : colorLightBlueAlpha) // color code used for increase or decrease
			.on("mouseover", showTooltip )
			.on("mousemove", moveTooltip )
			.on("mouseleave", hideTooltip );

	// highlighted increases (hidden at first)
	svg.append("g")
		.selectAll("rect")
		.data(data)
		.join("rect")
			.attr("class","increase")
			.attr("x", d => x(d.Month))
			.attr("y", d => yPctChange(Math.max(d.PctChange, 0)))
			.attr("height", d => Math.abs(yPctChange(0) - yPctChange(d.PctChange)))
			.attr("width", x.bandwidth())
			.attr("stroke", d => d.PctChange < 0 ? lightGrey : darkerBlue)
			.attr("stroke-width", 2)
			.attr("fill", d => d.PctChange < 0 ? colorLightWhiteAlpha : darkerBlue)
			.attr("opacity",0) // hide the bars
			.attr("pointer-events", "none");

	// highlighted decreases (hidden at first)
	svg.append("g")
		.selectAll("rect")
		.data(data)
		.join("rect")
			.attr("class","decrease")
			.attr("x", d => x(d.Month))
			.attr("y", d => yPctChange(Math.max(d.PctChange, 0)))
			.attr("height", d => Math.abs(yPctChange(0) - yPctChange(d.PctChange)))
			.attr("width", x.bandwidth())
			.attr("stroke", d => d.PctChange < 0 ? darkerGrey : "none")
			.attr("stroke-width", 3)
			.attr("fill", "none")
			.attr("opacity",0) // hide the bars
			.attr("pointer-events", "none");

	// create axes
	const axisX = svg.append("g")
		.attr("class", "axis") //Assign axis class
		.attr("transform", `translate(0,${yPctChange(0)})`)
		.call(d3.axisBottom(xScaleDisplay)); // use the scale with 3-letter month names
		

	const yPctChangeAxis = svg.append("g")
		.attr("transform", `translate(${margin.left},0)`)
		.call(d3.axisLeft(yPctChange).ticks(null, data.format)
									.tickFormat(d => d * 100+"%")
									.tickValues([-0.2, -0.1, 0, 0.1,0.2])
									)
		.call(g => g.selectAll(".tick text").attr("font-size", fontSize))
		.call(g => g.select(".domain").remove());

	// text label for the y axis
	svg.append("g")
		.append("text")
		.attr("class", "indivAxis")
		.attr("transform", "rotate(-90)")
		.attr("y", margin.left * 0.25)
		.attr("x",-h*0.78/2+margin.top)
		.attr("dy", "1em")
		.style("text-anchor", "middle")
		.style("font-family", fontFamily)
		.style("fill", fontFill)
		.style("font-size", fontAxisTitle)
			.text("Change in precipitations (mm)");

	// bar labels (hidden at first)
	svg.append("g")
		.selectAll("text")
		.data(data)
		.join("text")
			.attr("class","label-variation")
			.text(d => `${formatRateHtml(d.PctChange)}`)
			.attr("x", d => x(d.Month) + x.bandwidth()/2) // center the label 
			// position the label above the bar if positive value, else below
			.attr("y", d => d.PctChange > 0 ?
				yPctChange(d.PctChange) - 5 :
				yPctChange(d.PctChange) + 15
				)
			.attr("text-anchor", "middle") // center the label 
			.attr("opacity", 0) // hide the labels
			.style("font-family", fontFamily)
			.style("fill", d => d.PctChange < 0 ? darkerGrey : darkerBlue)
			.style("font-size", fontLabel)
			.style("font-weight", "bold");

})


// define animation functions

function highlightMinAndMax() {

	d3.selectAll(".increase")
		.transition()
		.duration(1000)
		.attr("opacity", d=> d.Month === "January" ? 1 : 0);

	d3.selectAll(".decrease")
		.transition()
		.duration(1000)
		.attr("opacity", d=> d.Month === "July" ? 1 : 0);

	d3.selectAll(".label-variation")
		.transition()
		.duration(1000)
		.attr("opacity", d=> d.Month === "January" || d.Month === "July" ? 1 : 0);

	}


function deemphasizeMinAndMax() {

	d3.selectAll(".increase")
		.transition()
		.duration(500)
		.attr("opacity",0);

	d3.selectAll(".decrease")
		.transition()
		.duration(500)
		.attr("opacity", 0);

	d3.selectAll(".label-variation")
		.transition()
		.duration(500)
		.attr("opacity", 0);

	}


function highlightMonthlyIncreases() {

	d3.selectAll(".increase")
		.transition()
		.duration(1000)
		.attr("opacity",1);
	}


function deemphasizeMonthlyIncreases() {

	d3.selectAll(".increase")
		.transition()
		.duration(500)
		.attr("opacity",0);
	}


function highlightMonthlyDecreases() {

	d3.selectAll(".decrease")
		.transition()
		.duration(1000)
		.attr("opacity",1);
	}


function deemphasizeMonthlyDecreases() {

	d3.selectAll(".decrease")
		.transition()
		.duration(500)
		.attr("opacity",0);
	}
