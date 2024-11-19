// CandlestickChart.js
import React, { useLayoutEffect } from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";

const CandlestickChart = () => {
  useLayoutEffect(() => {
    // Create root element
    let root = am5.Root.new("candlestickChartdiv");

    // Apply theme
    const myTheme = am5.Theme.new(root);
    myTheme.rule("Grid", ["scrollbar", "minor"]).setAll({
      visible: false
    });

    root.setThemes([am5themes_Animated.new(root), myTheme]);

    // Generate chart data
    async function generateChartData() {
      const chartEmpresasData = await this.obtenerEmpresas();
      const chartCotizacionesData = await this.obtenerCotizaciones();
      let firstDate = new Date();
      firstDate.setDate(firstDate.getDate() - 2000);
      firstDate.setHours(0, 0, 0, 0);
      let value = 1200;

      for (let i = 0; i < 2000; i++) {
        let newDate = new Date(firstDate);
        newDate.setDate(newDate.getDate() + i);

        value += Math.round((Math.random() < 0.5 ? 1 : -1) * Math.random() * 10);
        let open = value + Math.round(Math.random() * 16 - 8);
        let low = Math.min(value, open) - Math.round(Math.random() * 5);
        let high = Math.max(value, open) + Math.round(Math.random() * 5);

        chartData.push({
          date: newDate.getTime(),
          value: value,
          open: open,
          low: low,
          high: high
        });
      }
      return chartData;
    }

    let data = generateChartData();

    // Create chart
    let chart = root.container.children.push(
      am5xy.XYChart.new(root, {
        focusable: true,
        panX: true,
        panY: true,
        wheelX: "panX",
        wheelY: "zoomX",
        paddingLeft: 0
      })
    );

    // Create X-axis (DateAxis)
    let xAxis = chart.xAxes.push(
      am5xy.DateAxis.new(root, {
        groupData: true,
        maxDeviation: 0.5,
        baseInterval: { timeUnit: "day", count: 1 },
        renderer: am5xy.AxisRendererX.new(root, {
          pan: "zoom",
          minorGridEnabled: true
        }),
        tooltip: am5.Tooltip.new(root, {})
      })
    );

    // Create Y-axis (ValueAxis)
    let yAxis = chart.yAxes.push(
      am5xy.ValueAxis.new(root, {
        maxDeviation: 1,
        renderer: am5xy.AxisRendererY.new(root, {
          pan: "zoom"
        })
      })
    );

    // Add Candlestick series
    let series = chart.series.push(
      am5xy.CandlestickSeries.new(root, {
        calculateAggregates: true,
        name: "MDXI",
        xAxis: xAxis,
        yAxis: yAxis,
        valueYField: "value",
        openValueYField: "open",
        lowValueYField: "low",
        highValueYField: "high",
        valueXField: "date",
        legendValueText:
          "open: {openValueY} low: {lowValueY} high: {highValueY} close: {valueY}",
        tooltip: am5.Tooltip.new(root, {
          pointerOrientation: "horizontal",
          labelText:
            "open: {openValueY}\nlow: {lowValueY}\nhigh: {highValueY}\nclose: {valueY}"
        })
      })
    );

    // Add legend
    let legend = yAxis.axisHeader.children.push(am5.Legend.new(root, {}));
    legend.data.push(series);

    // Set chart data
    series.data.setAll(data);

    // Add scrollbar
    let scrollbar = am5xy.XYChartScrollbar.new(root, {
      orientation: "horizontal",
      height: 50
    });
    chart.set("scrollbarX", scrollbar);

    // Add cursor
    let cursor = chart.set(
      "cursor",
      am5xy.XYCursor.new(root, {
        xAxis: xAxis
      })
    );
    cursor.lineY.set("visible", false);

    // Animate series and chart
    series.appear(1000);
    chart.appear(1000, 100);

    // Cleanup on component unmount
    return () => {
      root.dispose();
    };
  }, []);

  return <div id="candlestickChartdiv" style={{ width: "50%", height: "300px" }}></div>;
};

export default CandlestickChart;
