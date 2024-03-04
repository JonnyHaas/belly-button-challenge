
// Source URL to fetch the dataset
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

// Promise to fetch the data
const dataPromise = d3.json(url);
dataPromise.then(data => {
  console.log("Data Loaded", data); // Log the data to ensure it's loaded correctly
  initializeDashboard(data);
});

function initializeDashboard(data) {
    // Populate the dropdown menu
    const dropdown = d3.select("#selDataset");
    data.names.forEach(id => {
      dropdown.append("option").property("value", id).text(id);
    });
    
    // Use the first sample from the list to build the initial plots
    const firstSample = data.names[0];
    updateCharts(firstSample, data);
  }

  function updateCharts(sampleId, data) {
    const samples = data.samples;
    const result = samples.find(sample => sample.id === sampleId);
  
    // For the bar chart
    const otuIds = result.otu_ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse();
    const sampleValues = result.sample_values.slice(0, 10).reverse();
    const otuLabels = result.otu_labels.slice(0, 10).reverse();
  
    // Creating a trace for the bar chart
    const barData = [{
      x: sampleValues,
      y: otuIds,
      text: otuLabels,
      type: 'bar',
      orientation: 'h'
    }];
  
    // Layout for the bar chart
    const barLayout = {
      title: "Top 10 OTUs Found"
    };
  
    // Plot the bar chart
    Plotly.newPlot('bar', barData, barLayout);
  
    // For the bubble chart
    const bubbleData = [{
      x: result.otu_ids,
      y: result.sample_values,
      text: result.otu_labels,
      mode: 'markers',
      marker: {
        size: result.sample_values,
        color: result.otu_ids,
        colorscale: "Earth"
      }
    }];
  
    // Layout for the bubble chart
    const bubbleLayout = {
      title: 'Bacteria Cultures Per Sample',
      showlegend: false,
      height: 600,
      width: 1000
    };
  
    // Plot the bubble chart
    Plotly.newPlot('bubble', bubbleData, bubbleLayout);
  
    // Display the sample metadata
    const metadata = data.metadata.find(meta => meta.id.toString() === sampleId);
    const panel = d3.select("#sample-metadata");
    panel.html(""); // Clear any existing metadata
    Object.entries(metadata).forEach(([key, value]) => {
      panel.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });
  }

  d3.select("#selDataset").on("change", function() {
    const newSampleId = d3.select(this).property("value");
    console.log("New Sample ID Selected", newSampleId); // Log the new sample ID for debugging
    dataPromise.then(data => updateCharts(newSampleId, data));
  });

  function updateMetadata(sampleId, data) {
    // Find the matching metadata for the given sampleId
    const metadata = data.metadata.find(meta => meta.id.toString() === sampleId);
  
    // Select the HTML element where the metadata will be displayed
    const panel = d3.select("#sample-metadata");
  
    // Clear any existing metadata from the element
    panel.html("");
  
    // Iterate over each key-value pair in the metadata and add it to the panel
    Object.entries(metadata).forEach(([key, value]) => {
      panel.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });
  }

  