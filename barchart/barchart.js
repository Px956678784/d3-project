var dataset = [50, 100, 15, 32, 91, 120, 70];

function draw() {
        var width = 400;
        var height = 400;
        var svg = d3.select("body")
                .select("svg")
        var padding = { top: 20, right: 20, bottom: 20, left: 20 };
        //设置比例尺
        var xAxisWidth = 300;
        var yAxisWidth = 300;
        var xscale = d3.scale.ordinal()
                .domain(d3.range(dataset.length))
                .rangeRoundBands([0, xAxisWidth], 0.2);
        var yscale = d3.scale.linear()
                .domain([0, d3.max(dataset)])
                .range([0, yAxisWidth]);
        //更新矩形
        var gchart = svg.select("#gchart");
        var updateRect = gchart.selectAll("rect").data(dataset);
        var enterRect = updateRect.enter();
        var exitRect = updateRect.exit();
        updateRect.attr("x", function (d, i) { return padding.left + xscale(i); })
                .attr("y", function (d) { return height - padding.bottom - yscale(d); })
                .attr("width", xscale.rangeBand())
                .attr("height", function (d) { return yscale(d); })
                .attr("fill", "steelblue");
        enterRect.append("rect")
                .attr("x", function (d, i) { return padding.left + xscale(i); })
                .attr("y", function (d) { return height - padding.bottom - yscale(d); })
                .attr("width", xscale.rangeBand())
                .attr("height", function (d) { return yscale(d); })
                .attr("fill", "steelblue")
                .on("mouseover", function (d, i) {
                        d3.select(this)
                                .attr("fill", "orange");
                }).
                on("mouseout", function (d, i) {
                        d3.select(this)
                                .transition()
                                .duration(1000)
                                .attr("fill", "steelblue");
                });
        exitRect.remove();
        //更新文本
        var updateText = gchart.selectAll("text").data(dataset);
        var enterText = updateText.enter();
        var exitText = updateText.exit();
        updateText.attr("x", function (d, i) { return padding.left + xscale(i); })
                .attr("y", function (d) { return height - padding.bottom - yscale(d); })
                .attr("dx", xscale.rangeBand() / 2)
                .attr("dy", "1em")
                .attr("fill", "white")
                .attr("font-size", "14px")
                .attr("text-anchor", "middle")
                .text(function (d) { return d; });
        enterText.append("text")
                .attr("x", function (d, i) { return padding.left + xscale(i); })
                .attr("y", function (d) { return height - padding.bottom - yscale(d); })
                .attr("dx", xscale.rangeBand() / 2)
                .attr("dy", "1em")
                .attr("fill", "white")
                .attr("font-size", "14px")
                .attr("text-anchor", "middle")
                .text(function (d) { return d; });
        exitText.remove();

        //设置坐标轴
        var xAxis = d3.svg.axis()
                .scale(xscale)
                .orient("bottom");
        yscale.range([yAxisWidth, 0]);
        var yAxis = d3.svg.axis()
                .scale(yscale)
                .orient("left");
        var gxAxis = svg.select("#xAxis");
        var gyAxis = svg.select("#yAxis");
        gxAxis.call(xAxis);
        gyAxis.call(yAxis);
}
function mysort() {
        dataset.sort(d3.ascending);
        draw();
}
function myadd() {
        dataset.push(Math.floor(Math.random() * 100));
        draw();
}

window.onload = draw;

