// Width and height of the map container
const width = 800;
const height = 800;

// Create an SVG element
const svg = d3.select("#map")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .style("background-color", "#f0f0f0")
    .append('g');

// Projection for UK map (adjust the parameters for different regions)
const initialScale = 2000;
const initialTranslate = [width / 2, height / 2];
const projection = d3.geoMercator()
    .center([-2, 54])
    .scale(initialScale)
    .translate(initialTranslate);;

// Path generator
const path = d3.geoPath().projection(projection);

// slider
const slider = document.getElementById("mySlider");

let output = document.getElementById("demo");


output.value = slider.value;

function myfunction() {
  output.value = slider.value
  localStorage.setItem('count', slider.value)
  console.log('jj', slider.value)
}

console.log('count value', JSON.parse(localStorage.getItem('count')) )

 // Create zoom behavior
 const zoom = d3.zoom()
 .scaleExtent([1, 8])
 .on('zoom', zoomed);

  // Apply zoom behavior to SVG
  svg.call(zoom);

    // Zoom in function
    function zoomIn() {
      svg.transition()
        .duration(500)
        .call(zoom.scaleBy, 2);
    }
   // Zoom out function
   function zoomOut() {
    svg.transition()
      .duration(500)
      .call(zoom.scaleBy, 0.5);
  }

  // Handle zoom event
  function zoomed() {
    const { transform } = d3.event;
    console.log('zo', transform)
    svg.selectAll('path')
      .attr('transform', transform);

      svg.selectAll('.circle')
      .attr('transform', transform);

      svg.selectAll('.mytext')
      .attr('transform', transform);


  

  }

// Load UK GeoJSON data
d3.json("https://gist.githubusercontent.com/carmoreira/49fd11a591e0ce2c41d36f9fa96c9b49/raw/e032a0174fc35a416cff3ef7cf1233973c018294/ukcounties.json").then(function(uk) {
      
// Draw map
    svg.selectAll("path")
        .data(uk.features)
        .enter()
        .append("path")
        .attr("d", path)
        .attr("fill", "#000070")
        .attr("stroke", "white")
        .attr("stroke-width", 1);

    d3.json('http://34.38.72.236/Circles/Towns/50').then(result => {
      let citiesCount = JSON.parse(localStorage.getItem('count'))

    const res = result.splice(0, citiesCount)

     console.log('oo', citiesCount)
    // create a tooltip
    const Tooltip = d3.select("#map")
           .append("div")
           .attr("class", "tooltip")
           .style("opacity", 1)
           .style("background-color", "black")
           .style("color", "white")
           .style("border-radius", "5px")
           .style("padding", "8px")
           
       
           
    // Add circles:
    const circles=svg
    .selectAll("myCircles")
    .data(res)
    .enter().append('g')
    console.log('t', res.length)

    circles
      .append("circle")
      .attr("cx", function(d){ return projection([d.lng, d.lat])[0] })
      .attr("cy", function(d){ return projection([d.lng, d.lat])[1] })
      .attr("r", 8)
      .attr("class", "circle")    
      .style("fill", "#ff3333")
      .attr("stroke", "#ff3333")
      .attr("stroke-width", 1)
      .attr("fill-opacity", .4)
      

    const mouseover = function(event, d) {
        Tooltip.style("opacity", 1)
      }

    const mousemove = function(event, d) {  
    const e = window.event;
    const posX = e.clientX;
    const posY = e.clientY; 

    //Tooltip
    Tooltip
        .html("Town: "+ event.Town + "<br>" + "County: "+ event.County + "<br>" + "Population: " + event.Population + "<br>" + "Longtitude: " + event.lng 
         + "<br>" + "Latitude: " + event.lat)
        .style("left", (posX)/1.6 + "px")
        .style("top", (posY)/1.6  + "px")
      }

    const mouseleave = function(event, d) {
        Tooltip.style("opacity", 0)
      }

    circles
      .on("mouseover", mouseover)
      .on("mousemove", mousemove)
      .on("mouseleave", mouseleave)
      })

   
});
