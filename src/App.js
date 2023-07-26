// Import necessary dependencies and components
import Vizzu from "vizzu";
import VizzuModule from 'vizzu/dist/cvizzu.wasm';
import { data } from "./recordData";
import { useRef, useEffect, useState } from "react";
import "./App.css";

// Set the WebAssembly URL for the Vizzu library
Vizzu.options({ wasmUrl: VizzuModule });

// Define the main React component
function App() {
  // Create refs to access the canvas element and the Vizzu chart instance
  const canvasRef = useRef();
  const chartRef = useRef();

  // State to hold the selected x-dimension for chart breakdown
  const [xDimensionState, setXDimensionState] = useState();

  // Extract all measure names from the provided data
  const dimensions = data.series
    .filter((s) => s.type === "measure")
    .map((s) => s.name);

  // Use effect to handle changes in the selected x-dimension state
  useEffect(() => {
    // If the chart instance doesn't exist yet, return early
    if (!chartRef.current) return;
    // Animate the chart to reflect the new x-dimension selection
    chartRef.current.animate({
      config: { channels: { x: { set: [xDimensionState] } } },
    });
    // console.log(chartRef.current.config); //See the configuration for the most recently adjusted chart
  }, [xDimensionState]);

  // Use effect to initialize the chart when the component mounts (default)
  useEffect(() => {
    // If the chart instance already exists, return early to avoid reinitialization (needed for Hot Module Replacement)
    if (chartRef.current) return; // this is needed because of Hot Module Replacement
    // Create a new Vizzu chart instance with the provided data and canvas reference
    chartRef.current = new Vizzu(canvasRef.current, { data });
    // After the chart is initialized, animate it to display the default breakdown (y: "Popularity", x: "Genres")
    chartRef.current.initializing.then((chart) =>
      chart.animate({
        config: {
          channels: {
            x: { set: ["total_search_count"] },
            y: { set: ["total_search_count"] },
            color: "filename",
            label: { set: ["filename"] },
          },
          title: "Metrics Scatter plot",
          geometry: "circle",
        },
      })
    );
  }, []);

  return (
    // JSX code for the main component rendering
    <div id="wrapper">
      <h1>Vizzu React Example</h1>
      <canvas ref={canvasRef} style={{ width: "800px", height: "480px" }} />
      <h2>Select an x Dimension</h2>
      <div id="breakdownSelector">
        {/* Map over the dimensions and create buttons to select the x-dimension */}
        {dimensions.map((dim) => {
          return (
            <button
              onClick={() => {
                // When a button is clicked, update the x-dimension state to trigger the chart update
                setXDimensionState(dim);
              }}
              key={dim}
            >
              {dim}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// Export the App component as the default export
export default App;
