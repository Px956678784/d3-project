var circles = [{ cx: 100, cy: 150, r: 30 }, { cx: 300, cy: 250, r: 50 }];
var color = ["orange", "steelblue"]
function roll() {
        var svg = d3.select("body")
                .select("svg");
        var drag = d3.behavior.drag()
                .origin(function (d, i) {
                        return { x: d.cx, y: d.cy };
                })
                .on("dragstart", function (d) {
                        console.log("拖拽开始");
                })
                .on("dragend", function (d) {
                        console.log("拖拽结束");
                })
                .on("drag", function (d) {
                        d3.select(this)
                                .attr("cx", d.cx = d3.event.x)
                                .attr("cy", d.cy = d3.event.y);
                });
        svg.selectAll("circle")
                .data(circles)
                .enter()
                .append("circle")
                .attr("cx", function (d) { return d.cx; })
                .attr("cy", function (d) { return d.cy; })
                .attr("r", function (d) { return d.r; })
                .attr("fill", function (d, i) { return color[i] })
                .call(drag);


}

window.onload = roll;

