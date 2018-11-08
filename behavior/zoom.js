var circles = [{ cx: 100, cy: 150, r: 30 },
{ cx: 300, cy: 150, r: 30 },
{ cx: 100, cy: 300, r: 30 },
{ cx: 300, cy: 300, r: 30 }];
var color = ["orange", "steelblue", "green", "black"];
function roll() {
        var svg = d3.select("body")
                .select("svg");
        var zoom = d3.behavior.zoom()
                .scaleExtent([1, 10])
                .on("zoom", function (d) {
                        d3.select(this)
                                .attr("transform", "translate(" + d3.event.translate + ")" +
                                        "scale(" + d3.event.scale + ")");
                });
        var g = svg.append("g")
                .call(zoom);

        g.selectAll("circle")
                .data(circles)
                .enter()
                .append("circle")
                .attr("cx", function (d) { return d.cx; })
                .attr("cy", function (d) { return d.cy; })
                .attr("r", function (d) { return d.r; })
                .attr("fill", function (d, i) { return color[i] });

        var width = 400;
        var height = 400;
        svg.call(d3.downloadable({
                width: width,
                height: height,
                filename: "filename"
        }));


}

window.onload = roll;

