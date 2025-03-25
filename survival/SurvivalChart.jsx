// SurvivalChart.jsx
import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { fetchSurvivalAnalysis } from "/src/__api__/db/apiService";

const SurvivalChart = ({ width = 800, height = 400, ticker = 'PETR4' }) => {
  const svgRef = useRef();
  const [chartType, setChartType] = useState('scatter');
  const [survivalData, setSurvivalData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchSurvivalAnalysis(ticker);
        setSurvivalData(data);
      } catch (error) {
        console.error("Failed to fetch survival data:", error);
      }
    };

    fetchData();
  }, [ticker]);

  useEffect(() => {
    if (!survivalData) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // Clear previous render

    const margin = { top: 20, right: 30, bottom: 40, left: 50 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const g = svg.append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    if (chartType === 'scatter') {
      const kmData = survivalData.kaplan_meier_estimator;

      const x = d3.scaleLinear()
        .domain([0, d3.max(kmData, d => d.Time)])
        .range([0, innerWidth]);

      const y = d3.scaleLinear()
        .domain([0, 1])
        .range([innerHeight, 0]);

      // Add x-axis
      g.append("g")
        .attr("transform", `translate(0,${innerHeight})`)
        .call(d3.axisBottom(x));

      // Add y-axis
      g.append("g")
        .call(d3.axisLeft(y));

      // Add x-axis label
      g.append("text")
        .attr("text-anchor", "end")
        .attr("x", innerWidth)
        .attr("y", innerHeight + 35)
        .text("Time (days)");

      // Add y-axis label
      g.append("text")
        .attr("text-anchor", "end")
        .attr("transform", "rotate(-90)")
        .attr("y", -40)
        .attr("x", -margin.top)
        .text("Survival Probability");

      // Add scatter plot
      g.selectAll("circle")
        .data(kmData)
        .enter()
        .append("circle")
        .attr("cx", d => x(d.Time))
        .attr("cy", d => y(d['Survival Probability']))
        .attr("r", 3)
        .attr("fill", "blue")
        .attr("opacity", 0)
        .transition()
        .duration(1000)
        .attr("opacity", 1);

    } else if (chartType === 'histogram') {
      const kmData = survivalData.kaplan_meier_estimator;

      const x = d3.scaleLinear()
        .domain([0, d3.max(kmData, d => d.Time)])
        .range([0, innerWidth]);

      const y = d3.scaleLinear()
        .domain([0, d3.max(kmData, d => d['Hazard Rate'])])
        .range([innerHeight, 0]);

      // Add x-axis
      g.append("g")
        .attr("transform", `translate(0,${innerHeight})`)
        .call(d3.axisBottom(x));

      // Add y-axis
      g.append("g")
        .call(d3.axisLeft(y));

      // Add x-axis label
      g.append("text")
        .attr("text-anchor", "end")
        .attr("x", innerWidth)
        .attr("y", innerHeight + 35)
        .text("Time (days)");

      // Add y-axis label
      g.append("text")
        .attr("text-anchor", "end")
        .attr("transform", "rotate(-90)")
        .attr("y", -40)
        .attr("x", -margin.top)
        .text("Hazard Rate");

      // Add histogram bars
      g.selectAll("rect")
        .data(kmData)
        .enter()
        .append("rect")
        .attr("x", d => x(d.Time))
        .attr("width", innerWidth / kmData.length)
        .attr("y", innerHeight)
        .attr("height", 0)
        .attr("fill", "blue")
        .transition()
        .duration(1000)
        .attr("y", d => y(d['Hazard Rate']))
        .attr("height", d => innerHeight - y(d['Hazard Rate']));
    }

  }, [width, height, chartType, survivalData]);

  if (!survivalData) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div>
        <button onClick={() => setChartType('scatter')}>Survival Probability</button>
        <button onClick={() => setChartType('histogram')}>Hazard Rate</button>
      </div>
      <svg ref={svgRef} width={width} height={height}></svg>
    </div>
  );
};

export default SurvivalChart;