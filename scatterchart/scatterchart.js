var dataset = [[0.5, 0.5], [0.7, 0.8], [0.4, 0.9],
[0.11, 0.32], [0.88, 0.25], [0.75, 0.12],
[0.5, 0.1], [0.2, 0.3], [0.4, 0.1], [0.6, 0.7]];

function draw() {
        var width = 400;
        var height = 400;
        var svg = d3.select("body")
                .select("svg")
        var padding = { top: 20, right: 20, bottom: 20, left: 20 };
        //设置比例尺
        var xAxisWidth = 300;
        var yAxisWidth = 300;
        var xscale = d3.scale.linear()
                .domain([0, 1.2 * d3.max(dataset, function (d) {
                        return d[0];
                })])
                .range([0, xAxisWidth]);
        var yscale = d3.scale.linear()
                .domain([0, 1.2 * d3.max(dataset, function (d) {
                        return d[1];
                })])
                .range([0, yAxisWidth]);
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
        var drawcircle = function () {
                //更新，写入与删除
                var gchart = svg.select("#gchart");
                var circleupdate = svg.selectAll("circle")
                        .data(dataset);
                var circleenter = circleupdate.enter();
                var circleexit = circleupdate.exit();
                circleupdate.transition()
                        .duration(500)
                        .attr("cx", function (d) {
                                return padding.left + xscale(d[0]);
                        })
                        .attr("cy", function (d) {
                                return height - padding.bottom - yscale(d[1]);
                        })
                        .ease("elastic")//样式
                        .style("fill", "steelblue");
                circleenter.append("circle")
                        .attr("fill", "steelblue")
                        .attr("cx", padding.left)
                        .attr("cy", height - padding.bottom)
                        .attr("r", 5)
                        .transition()
                        .duration(500)
                        .attr("cx", function (d) {
                                return padding.left + xscale(d[0]);
                        })
                        .attr("cy", function (d) {
                                return height - padding.bottom - yscale(d[1]);
                        })
                        .ease("elastic");
                circleexit.transition()
                        .duration(500)
                        .attr("fill", "white")
                        .remove();
        }
        return drawcircle();
}
var newdraw = draw;
function update() {
        for (var i = 0; i < dataset.length; i++) {
                dataset[i][0] = Math.random();
                dataset[i][1] = Math.random();
        }
        newdraw();
}
function add() {
        dataset.push([Math.random(), Math.random()]);
        newdraw();
}
function sub() {
        dataset.pop();
        newdraw();
}

window.onload = draw;

