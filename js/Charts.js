
function buildCharts(sample) {
 
  d3.json("samples.json").then((data) => {
   
    var samples = data.samples;
    
    var resultsArray = samples.filter(sampleObject => sampleObject.id == sample);
    
    var result = resultsArray[0]

    var ids = result.otu_ids;
    var labels = result.otu_labels;
    var values = result.sample_values;

    var yticks = (data.samples[0].otu_ids.slice(0,10)).reverse();

    // bar chart. 
    var barData = [
      {
        y: ids.slice(0,10).map(otuID => `OTU ${otuID}`).reverse(),
        x: values.slice(0,10).reverse(),
        text: labels.slice(0,10).reverse(),
        type: "bar",
        orientation: "h"
      }
    ];
   
    var barLayout = {
      title: "Top 10 Bacteria Cultures Found",
      margin: {t:30, l:150}
    };
   
    Plotly.newPlot("bar", barData, barLayout);

    // bubble chart.
    var bubbleData = [
      {
        x: ids,
        y: values,
        text: labels,
        mode: "markers",
        marker: {
          color: ids,
          size: values
        }
      }
    ];

    var bubbleLayout = {
      title: "Bacteria Cultures Per Sample",
      margin: {t:15, l:100}
    };

    var LayoutBubble = {
      margin: {t:0},
      xaxis: {title: "Id's"},
      hovermode: "closest",
    }; 

    Plotly.newPlot("bubble", bubbleData, LayoutBubble, bubbleLayout);


    // Gauge Chart
    var data = [
      {
        domain: {x: [0, 1], y: [0, 1]}, 
        value: data.WFREQ,
        title: {text: "Belly Button Washing Frequency Scrubs Per Week",
        font: {size: 14}},
        type: "indicator",
        mode: "gauge+number",
        gauge: {axis: {range: [0, 10]},
          steps: [
          {range: [0, 2], color: "red"},
          {range: [2, 5], color: "orange"},
          {range: [5, 8], color: "yellow"},
          {range: [8, 10], color: "green"}
          ]
        }  
      }
    ];

    var gaugeLayout = {
      width: 400,
      height: 500,
      margin: {t:0, b:0}
    };


    Plotly.newPlot("gauge", data, gaugeLayout);
  });
}


function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");
    PANEL.html("");

    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();