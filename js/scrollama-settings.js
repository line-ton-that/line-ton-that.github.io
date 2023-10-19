// using d3 for convenience
var main = d3.select("main");
var scrolly = main.selectAll(".scrolly"); // selecting all objects (sections) of class "scrolly" (there are 3 scrolly sections, 1 per figure)
var figure = scrolly.selectAll("figure");
var article = scrolly.selectAll("article");
var step = article.selectAll(".step");

// initialize the scrollama
var scroller = scrollama();

// generic window resize listener event
function handleResize() {
    // 1. update height of step elements
    var stepH = Math.floor(window.innerHeight * 0.5);
    step.style("height", stepH + "px");
    step.style("width", "250px")

    var figureHeight = window.innerHeight / 3;//2;
    var figureMarginTop = (window.innerHeight - figureHeight) / 2;

    figure
        .style("height", figureHeight + "px")
        .style("top", figureMarginTop + "px");

    // 3. tell scrollama to update new element dimensions
    scroller.resize();
}


// scrollama event handlers

/*
scrollama magic happens here:
- based on the index, trigger a certain function from d3 script files
- sometimes only fire an event when going down or up in the story
*/
function handleStepEnter(response) {

    console.log(response);
    // response = { element, direction, index }
    let currentIndex = response.index;
    let currentDirection = response.direction;

    // flag the current step (div) as active
    response.element.classList.add("is-active"); // used this function as the below one was not working
    // step.classed("is-active", function(d, i) {
    //     return i === currentIndex;
    // });

    // update graphic based on step
    switch(currentIndex){
        case 0:
            if(currentDirection === 'up'){
                hideProjectedAnnualPrecipitations() 
            } else {
                
            }
            break;
        case 1:
            if(currentDirection === 'up'){
                hideProjectedIncrease();
            } else {
                showProjectedAnnualPrecipitations()
            }
            break;
        case 2:
            if(currentDirection === 'up'){
                
            } else {
                showProjectedIncrease();
            }
            break;
        case 3:
            if(currentDirection === 'up'){
                demphasizeDrierMonths();
                hideProjectedMonthlyPrecipitations();
            } else {
                showProjectedMonthlyPrecipitations();
            }
            break;
        case 4:
            if(currentDirection === 'up'){
                demphasizeRainierMonths();
                highlightDrierMonths();
            } else {
                highlightDrierMonths();
            }
            break;
        case 5:
            if(currentDirection === 'up'){
                deemphasizeMinAndMax();
            } else {
                highlightRainierMonths();
                demphasizeDrierMonths();
            }
            break;
        case 6:
            if(currentDirection === 'up'){
                deemphasizeMonthlyDecreases();
                highlightMinAndMax();
            } else {
                highlightMinAndMax();
            }
            break;
        case 7:
            if(currentDirection === 'up'){
                deemphasizeMonthlyIncreases();
                highlightMonthlyDecreases();
            } else {
                deemphasizeMinAndMax();
                highlightMonthlyDecreases();
            }
            break;
        case 8:
            if(currentDirection === 'up'){
                deemphasizeMonthlyIncreases(); //?
            } else {
                deemphasizeMonthlyDecreases();
                highlightMonthlyIncreases();
            }
            break;


        default:
            break;
    }

}

function handleStepExit(response) {
    // response = { element, direction, index }
    console.log(response);
    // remove active flag from current step
    response.element.classList.remove("is-active");
}

function setupStickyfill() {
    d3.selectAll(".sticky").each(function() {
        Stickyfill.add(this);
    });
}

function init() {
    setupStickyfill();

    // 1. force a resize on load to ensure proper dimensions are sent to scrollama
    handleResize();

    // 2. setup the scroller passing options
    // 		this will also initialize trigger observations
    // 3. bind scrollama event handlers (this can be chained like below)
    scroller
        .setup({
            step: ".scrolly article .step",
            offset: 0.5,
            debug: false
        })
        .onStepEnter(handleStepEnter)
        .onStepExit(handleStepExit);// add the handle step exit (to remove "is-active" flag)

    // setup resize event
    window.addEventListener("resize", handleResize);
}

// kick things off
init();
