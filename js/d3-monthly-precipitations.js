// chart and animations for the monthly precipitations figure

// create bar chart for monthly precipitations
const chartBarMonthly = dataset.then(function(data) {

	// use scale functions
	const x = xScale(data);
	const yMonthly = yScaleMonthly(data);

	// create a SVG element
	const svg = d3.select("#monthly_precipitations") // link it to the relevant div
		.append("svg")
		.attr("width", totalWidth)
		.attr("height", h);

	// define tooltip
	const tooltip = d3.select("#monthly_precipitations") // link it to the relevant div
	      .append("div")
	        .attr("id","tootip2")
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
	    	Historical precipitations: ${formatTotal(d.Historical)} mm<br>
	    	Projected precipitations: ${formatTotal(d.Projected)} mm<br>
	    	Projected difference: ${formatDifferenceHtml(d.Projected - d.Historical)} mm 
	    	(${formatRateHtml(d.PctChange)})`)
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
	// projected precipitations (hidden at first)
	svg.append("g")
		.selectAll("rect")
		.data(data)
		.join("rect")
			.attr("class","monthlyProjected")
			.attr("x", d => x(d.Month))
			.attr("y", d => yMonthly(0))
			.attr("height", 0) // set bar height to 0 to hide
			.attr("width", x.bandwidth())
			.attr("stroke", colorLightBlueAlpha)
			.attr("stroke-width", 2)
			.attr("fill", colorLightBlueAlpha)
			.on("mouseover", showTooltip )
			.on("mousemove", moveTooltip )
			.on("mouseleave", hideTooltip );

	// additional precipitations (hidden at first)
	svg.append("g")
		.selectAll("rect")
		.data(data)
		.join("rect")
			.attr("class","rainierMonth")
			.attr("x", d => x(d.Month))
			.attr("y", d => yMonthly(d.Projected))
			.attr("height", d => d.Projected - d.Historical < 0 ? 0 : yMonthly(d.Historical) - yMonthly(d.Projected))
			.attr("width", x.bandwidth())
			.attr("stroke", colorLightBlueAlpha)
			.attr("stroke-width", 2)
			.attr("opacity", 0) // set opacity to 0 to hide these rectangles
			.attr("fill", darkerBlue)
			.attr("pointer-events", "none");

	// historical precipitations (on top of projected precipitations)
	svg.append("g")
		.selectAll("rect")
		.data(data)
		.join("rect")
			.attr("class","monthlyHistorical")
			.attr("x", d => x(d.Month))
			.attr("y", d => yMonthly(d.Historical))
			.attr("width", x.bandwidth())
			.attr("height", d => yMonthly(0) - yMonthly(d.Historical))
			.attr("stroke", "black")
			.attr("stroke-width", 3)
			.attr("fill", colorLightWhiteAlpha) // the opacity is set to 25% to let the blue of the projected precipitations show through
		.on("mouseover", showTooltip )
		.on("mousemove", moveTooltip )
		.on("mouseleave", hideTooltip );


	// missing precipitations (hidden at first)
	svg.append("g")
		.selectAll("rect")
		.data(data)
		.join("rect")
			.attr("class","drierMonth")
			.attr("x", d => x(d.Month))
			.attr("y", d => yMonthly(d.Historical))
			.attr("height", d => d.Projected - d.Historical > 0 ? 0 : yMonthly(d.Projected) - yMonthly(d.Historical))
			.attr("width", x.bandwidth())
			.attr("stroke", lightGrey)
			.attr("stroke-width", 3)
			.attr("opacity", 0) // set opacity to 0 to hide these rectangles
			.attr("fill", colorLightWhiteAlpha)
			.attr("pointer-events", "none");

	// create axes
	const axisX = svg.append("g")
		.attr("class", "axis") // assign axis class
		.attr("transform", `translate(0,${h - margin.bottom})`)
		.call(d3.axisBottom(xScaleDisplay)); // use the scale with 3-letter month names

	const axisY = svg.append("g")
		.attr("class", "axis") // assign axis class
		.attr("transform", `translate(${margin.left},0)`)
		.call(d3.axisLeft(yMonthly).ticks(null, data.format))
		.call(g => g.select(".domain").remove());


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
			.text("Monthly precipitations (mm)");

})


// define animation functions

function showProjectedMonthlyPrecipitations() {

	dataset.then(function(data) {

			// use scale function
			const yMonthly = yScaleMonthly(data);

			d3.selectAll(".monthlyProjected")
				.transition()
				.duration(1500)
				.attr("y", d => yMonthly(d.Projected))
				.attr("height", d => yMonthly(0) - yMonthly(d.Projected))
		})
}

function hideProjectedMonthlyPrecipitations() {

	dataset.then(function(data) {

			// use scale function
			const yMonthly = yScaleMonthly(data);

			d3.selectAll(".monthlyProjected")
				.transition()
				.duration(1000)
				.attr("y", d => yMonthly(0))
				.attr("height", 0);
		})
}


function highlightRainierMonths() {

		d3.selectAll(".rainierMonth")
			.transition()
			.duration(1000)
			.attr("opacity",1);
		}

function demphasizeRainierMonths() {

		d3.selectAll(".rainierMonth")
			.transition()
			.duration(500)
			.attr("opacity",0);
		}


function highlightDrierMonths() {

		d3.selectAll(".drierMonth")
			.transition()
			.duration(500)
			.attr("opacity",1);
		}

function demphasizeDrierMonths() {

		d3.selectAll(".drierMonth")
			.transition()
			.duration(500)
			.attr("opacity",0);
		}

