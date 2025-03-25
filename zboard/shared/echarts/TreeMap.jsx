import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

const TreeMap = () => {
  const chartRef = useRef(null);

  useEffect(() => {
    let myChart = null;

    const initChart = () => {
      if (chartRef.current) {
        myChart = echarts.init(chartRef.current);
      }
    };

    const getLevelOption = () => {
      return [
        {
          itemStyle: {
            borderWidth: 0,
            gapWidth: 5
          }
        },
        {
          itemStyle: {
            gapWidth: 1
          }
        },
        {
          colorSaturation: [0.35, 0.5],
          itemStyle: {
            gapWidth: 1,
            borderColorSaturation: 0.6
          }
        }
      ];
    };

    const renderChart = () => {
      const budgetData = [
        {
          "value": [1226629000, null, null],
          "name": "Health and Human Services",
          "id": "branch-8",
          "discretion": null,
          "children": [
            {
              "value": [1105220000, 1071808000, 3.11734937600765],
              "name": "Centers for Medicare and Medicaid Services",
              "id": "leaf-135",
              "discretion": "mandatory"
            },
            {
              "value": [34502000, 34325000, 0.515659140568103],
              "name": "Administration for Children and Families",
              "id": "leaf-131",
              "discretion": "mandatory"
            },
            {
              "value": [31829000, 30784000, 3.39462058212059],
              "name": "National Institutes of Health",
              "id": "leaf-127",
              "discretion": "discretionary"
            },
            {
              "value": [16180000, 17334000, -6.65743625245183],
              "name": "Administration for Children and Families",
              "id": "leaf-118",
              "discretion": "discretionary"
            },
            {
              "value": [7324000, 6246000, 17.2590457893051],
              "name": "Centers for Disease Control and Prevention",
              "id": "leaf-120",
              "discretion": "discretionary"
            }
          ]
        },
        {
          "value": [818284000, null, null],
          "name": "Social Security Administration",
          "id": "branch-34",
          "discretion": null,
          "children": [
            {
              "value": [808041000, 744812000, 8.48925634925324],
              "name": "Social Security Administration",
              "id": "leaf-531",
              "discretion": "mandatory"
            },
            {
              "value": [10243000, 9294000, 10.2108887454271],
              "name": "Social Security Administration",
              "id": "leaf-530",
              "discretion": "discretionary"
            }
          ]
        },
        {
          "value": [677483000, null, null],
          "name": "Defense--Military Programs",
          "id": "branch-5",
          "discretion": null,
          "children": [
            {
              "value": [294891000, 292828000, 0.704509131640418],
              "name": "Operation and Maintenance",
              "id": "leaf-77",
              "discretion": "discretionary"
            },
            {
              "value": [154057000, 152586000, 0.964046504921812],
              "name": "Military Personnel",
              "id": "leaf-76",
              "discretion": "discretionary"
            },
            {
              "value": [128051000, 135819000, -5.71937652316686],
              "name": "Procurement",
              "id": "leaf-78",
              "discretion": "discretionary"
            },
            {
              "value": [75722000, 80232000, -5.62119852427959],
              "name": "Research, Development, Test, and Evaluation",
              "id": "leaf-79",
              "discretion": "discretionary"
            }
          ]
        }
      ];

      const formatUtil = echarts.format;

      const option = {
        title: {
          text: 'U.S. Budget Breakdown',
          left: 'center'
        },
        tooltip: {
          formatter: function (info) {
            var value = info.value;
            var treePathInfo = info.treePathInfo;
            var treePath = [];
            for (var i = 1; i < treePathInfo.length; i++) {
              treePath.push(treePathInfo[i].name);
            }
            return [
              '<div class="tooltip-title">' +
                formatUtil.encodeHTML(treePath.join('/')) +
                '</div>',
              'Budget: $' + formatUtil.addCommas(value) + ' thousand'
            ].join('');
          }
        },
        series: [
          {
            name: 'Budget',
            type: 'treemap',
            visibleMin: 300,
            label: {
              show: true,
              formatter: '{b}'
            },
            upperLabel: {
              show: true,
              height: 30
            },
            itemStyle: {
              borderColor: '#fff'
            },
            levels: getLevelOption(),
            data: budgetData
          }
        ]
      };

      myChart.hideLoading();
      myChart.setOption(option);

      myChart.on('click', function(params) {
        if (params.data.children) {
          option.series[0].data = params.data.children;
          myChart.setOption(option);
        }
      });
    };

    initChart();
    if (myChart) {
      myChart.showLoading();
      renderChart();
    }

    const handleResize = () => {
      myChart && myChart.resize();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      myChart && myChart.dispose();
    };
  }, []);

  return <div ref={chartRef} style={{ width: '100%', height: '600px' }} />;
};

export default TreeMap;