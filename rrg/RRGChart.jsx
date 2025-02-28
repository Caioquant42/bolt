import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { fetchRRGView } from '/src/__api__/db/apiService'; // Import the API service

const RRGChart = () => {
  const svgRef = useRef();
  const containerRef = useRef();
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [rrgData, setRrgData] = useState(null); // State to store RRG data from the API

  // Fetch RRG data from the API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchRRGView();
        setRrgData(data); // Set the fetched data to state
      } catch (error) {
        console.error('Error fetching RRG data:', error);
      }
    };

    fetchData();
  }, []);

  // Handle resizing of the chart container
  useEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      if (entries[0]) {
        const { width, height } = entries[0].contentRect;
        setDimensions({ width, height });
      }
    });

    resizeObserver.observe(containerRef.current);

    return () => resizeObserver.disconnect();
  }, []);

  // Render the RRG chart when dimensions or data change
  useEffect(() => {
    if (dimensions.width === 0 || dimensions.height === 0 || !rrgData) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove(); // Clear previous render

    const margin = { top: 20, right: 70, bottom: 40, left: 60 };
    const innerWidth = dimensions.width - margin.left - margin.right;
    const innerHeight = dimensions.height - margin.top - margin.bottom;

    const x = d3.scaleLinear().domain([90, 110]).range([0, innerWidth]);
    const y = d3.scaleLinear().domain([90, 110]).range([innerHeight, 0]);

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    // Add colored quadrants
    g.append('rect')
      .attr('x', x(100))
      .attr('y', y(110))
      .attr('width', x(110) - x(100))
      .attr('height', y(100) - y(110))
      .attr('fill', 'rgba(0, 255, 0, 0.1)');
    g.append('rect')
      .attr('x', x(90))
      .attr('y', y(110))
      .attr('width', x(100) - x(90))
      .attr('height', y(100) - y(110))
      .attr('fill', 'rgba(255, 255, 0, 0.1)');
    g.append('rect')
      .attr('x', x(90))
      .attr('y', y(100))
      .attr('width', x(100) - x(90))
      .attr('height', y(90) - y(100))
      .attr('fill', 'rgba(255, 0, 0, 0.1)');
    g.append('rect')
      .attr('x', x(100))
      .attr('y', y(100))
      .attr('width', x(110) - x(100))
      .attr('height', y(90) - y(100))
      .attr('fill', 'rgba(0, 0, 255, 0.1)');

    // Add axes with improved styling
    g.append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(d3.axisBottom(x).ticks(innerWidth / 80))
      .call((g) => g.select('.domain').remove())
      .call((g) =>
        g
          .selectAll('.tick line')
          .clone()
          .attr('y2', -innerHeight)
          .attr('stroke-opacity', 0.1)
      )
      .call((g) =>
        g
          .append('text')
          .attr('x', innerWidth)
          .attr('y', -6)
          .attr('fill', 'currentColor')
          .attr('text-anchor', 'end')
          .text('Relative Strength')
      );

    g.append('g')
      .call(d3.axisLeft(y).ticks(null, ''))
      .call((g) => g.select('.domain').remove())
      .call((g) =>
        g
          .selectAll('.tick line')
          .clone()
          .attr('x2', innerWidth)
          .attr('stroke-opacity', 0.1)
      )
      .call((g) =>
        g
          .select('.tick:last-of-type text')
          .clone()
          .attr('x', 4)
          .attr('text-anchor', 'start')
          .attr('font-weight', 'bold')
          .text('Relative Momentum')
      );

    // Add center lines
    g.append('line')
      .attr('x1', x(90))
      .attr('x2', x(110))
      .attr('y1', y(100))
      .attr('y2', y(100))
      .attr('stroke', '#666')
      .attr('stroke-dasharray', '4');
    g.append('line')
      .attr('x1', x(100))
      .attr('x2', x(100))
      .attr('y1', y(90))
      .attr('y2', y(110))
      .attr('stroke', '#666')
      .attr('stroke-dasharray', '4');

    // Create line generator with curve
    const line = d3
      .line()
      .curve(d3.curveCatmullRom)
      .x((d) => x(d.RS_Ratio))
      .y((d) => y(d.RS_Momentum));

    // Transform API data into a format suitable for the chart
    const chartData = Object.keys(rrgData).map((symbol) => {
      const dates = rrgData[symbol].Dates;
      const rsRatios = rrgData[symbol]['RS-Ratio'].map(Number); // Ensure values are numbers
      const rsMomenta = rrgData[symbol]['RS-Momentum'].map(Number); // Ensure values are numbers
      return dates.map((date, i) => ({
        symbol,
        date,
        RS_Ratio: rsRatios[i],
        RS_Momentum: rsMomenta[i],
        color: '#1f77b4', // Default color, customize as needed
      }));
    });

    // Group data by symbol
    const nestedData = d3.group(chartData.flat(), (d) => d.symbol);

    // Draw lines and points with animation
    nestedData.forEach((data, symbol) => {
      const path = g
        .append('path')
        .datum(data)
        .attr('fill', 'none')
        .attr('stroke', data[0].color)
        .attr('stroke-width', 2.5)
        .attr('stroke-linejoin', 'round')
        .attr('stroke-linecap', 'round')
        .attr('d', line);

      const length = path.node().getTotalLength();

      path
        .attr('stroke-dasharray', `0,${length}`)
        .transition()
        .duration(2000)
        .ease(d3.easeLinear)
        .attr('stroke-dasharray', `${length},${length}`);

      // Draw points except for the last one
      g.selectAll(`.point-${symbol}`)
        .data(data.slice(0, -1)) // Exclude the last point
        .join('circle')
        .attr('class', `point-${symbol}`)
        .attr('cx', (d) => x(d.RS_Ratio))
        .attr('cy', (d) => y(d.RS_Momentum))
        .attr('r', 5)
        .attr('fill', 'white')
        .attr('stroke', (d) => d.color)
        .attr('stroke-width', 2);

      // Add arrow to the last point
      const lastPoint = data[data.length - 1];
      const secondLastPoint = data[data.length - 2];
      const angle =
        (Math.atan2(
          y(lastPoint.RS_Momentum) - y(secondLastPoint.RS_Momentum),
          x(lastPoint.RS_Ratio) - x(secondLastPoint.RS_Ratio)
        ) *
          180) /
        Math.PI;

      g.append('path')
        .attr('d', d3.symbol().type(d3.symbolTriangle).size(100))
        .attr('fill', lastPoint.color)
        .attr('transform', `translate(${x(lastPoint.RS_Ratio)},${y(lastPoint.RS_Momentum)}) rotate(${angle})`)
        .style('opacity', 0)
        .transition()
        .delay(2000)
        .duration(500)
        .style('opacity', 1);

      // Add labels with animation
      const labels = g
        .append('g')
        .attr('font-family', 'sans-serif')
        .attr('font-size', 10)
        .selectAll()
        .data(data)
        .join('text')
        .attr('transform', (d) => `translate(${x(d.RS_Ratio)},${y(d.RS_Momentum)})`)
        .attr('dy', '-0.5em')
        .attr('text-anchor', 'middle')
        .text((d) => d.symbol)
        .attr('fill-opacity', 0);

      labels.transition().delay((d, i) => i * 400).attr('fill-opacity', 1);
    });

    // Add legend
    const legend = svg.append('g').attr('transform', `translate(${dimensions.width - margin.right + 20},${margin.top})`);

    nestedData.forEach((data, symbol, i) => {
      const legendItem = legend.append('g').attr('transform', `translate(0,${i * 20})`);

      legendItem.append('rect').attr('width', 10).attr('height', 10).attr('fill', data[0].color);

      legendItem.append('text').attr('x', 15).attr('y', 10).text(symbol);
    });
  }, [dimensions, rrgData]);

  return (
    <div ref={containerRef} style={{ width: '100%', height: '100%' }}>
      <svg
        ref={svgRef}
        width="100%"
        height="100%"
        preserveAspectRatio="xMidYMid meet"
        viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
      ></svg>
    </div>
  );
};

export default RRGChart;