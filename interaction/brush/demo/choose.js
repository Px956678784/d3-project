

function draw() {
        var width = 500;
        var height = 500;
        var svg = d3.select("body")
                .append("svg")
                .attr("width", width)
                .attr("height", height);
        var padding = { top: 20, right: 20, bottom: 20, left: 20 };
        svg.append("circle")
                .attr("cx", 100)
                .attr("cy", 100)
                .attr("r", 30)
                .style("fill", "green");
        svg.append("rect")
                .attr("x", 150)
                .attr("y", 70)
                .attr("width", 70)
                .attr("height", 60)
                .style("fill", "steelblue");
        //设置刷子的范围
        var xscale = d3.scale.linear()
                .domain([0, width])
                .range([0, width]);
        var yscale = d3.scale.linear()
                .domain([0, height])
                .range([0, height]);
        var brush = d3.svg.brush()
                .x(xscale)
                .y(yscale)
                .extent([0, 0], [100, 100])
                .on("brush", brushed);
        function brushed() {
                var extent = brush.extent()
                console.log("x方向的下限：" + extent[0][0]);
                console.log("x方向的上限：" + extent[1][0]);
                console.log("y方向的下限：" + extent[0][1]);
                console.log("y方向的下限：" + extent[1][1]);
        }

        svg.append("g").call(brush)
                .selectAll("rect")
                .style("fill-opacity", 0.3);
}

window.onload = draw;

