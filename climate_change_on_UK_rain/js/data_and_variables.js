
// layout
const totalWidth = 800;
const h = 300;
const padding = 40;
const margin = ({top:20, right: 30, bottom: 30, left:100});

// colors
const colorLightBlueAlpha = d3.color(`rgba(39, 131, 217, 1)`); // #2783d9
const colorLightWhiteAlpha = d3.color(`rgba(254, 254, 254 , 0.25)`);//#fefefe
const darkerBlue = d3.color(`rgba(23, 94, 160,1)`);
const lightGrey = "#CACACA";
const darkerGrey = "#8c8a8a";
const lightBlack = "#2f2f2e";

// number formatting
const formatTotal = function(s){ return d3.format(",.0f")(s) ; };

const formatRate = function(r){ return d3.format(".1f")(r*100)+"%" ; };

const formatDifferenceHtml = function(delta){ 
	if (delta > 0) {
		return "+"+d3.format(",.0f")(delta) ; 
	} else {
		return "-" + d3.format(",.0f")(Math.abs(delta)) ;
	} ;
};

const formatRateHtml = function(r){ 
	if (r > 0) {
		return "+"+d3.format(".1f")(r*100)+"%" ; 
	} else {
		return "-" + d3.format(".1f")(Math.abs(r)*100)+"%" ;
	}
};

// text formatting (/!\ part of it is also defined in the CSS file)
const fontFamily = "sans-serif";
const fontSize = "14px";
const fontAxisTitle = "14px";
const fontLabel = "14px";
const fontLabelBig = "22px";
const fontFill = "black";



// read in the data
const dataset = d3.csv("./../data/UK_precipitations.csv", d3.autoType);


// scales

// [x scale] monthly (used for monthly charts except to display the axis)
const xScale = function (data) {
	return d3.scaleBand()
			.domain(data.map(d => d.Month))
			.range([margin.left, totalWidth*0.8+margin.left])
			//.range([margin.left, w*0.8+margin.left])
			.padding(0.1);
		 };

// [labels] used to create an axis showing only the first 3 letters of the month name
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
	"Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// [x scale] monthly (only used to display the axis of monthly charts)
const xScaleDisplay = d3.scaleBand()
			.domain(months)
			.range([margin.left, totalWidth*0.8+margin.left])
			.padding(0.1);

// [y scale] monthly precipitations
const yScaleMonthly = function(data) {
	// assess maximum of historical and projected precipitations
	const monthlyMax = d3.max([d3.max(data.map(d => d.Historical)), d3.max(data.map(d => d.Projected))]);

	return d3.scaleLinear()
				.domain([0,  monthlyMax]).nice()
				.range([h - margin.bottom, margin.top]);
};

// [y scale] monthly variations
const yScalePctChange = function(data) {
	return d3.scaleLinear()
				.domain(d3.extent(data.map(d => d.PctChange))).nice()
				.range([h*0.7 - margin.bottom, margin.top]);
}
