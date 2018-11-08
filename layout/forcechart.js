var nodes = [{ name: "0" }, { name: "1" }, { name: "2" }, { name: "3" }, { name: "4" }, { name: "5" }, { name: "6" }];
var edges = [{ source: 0, target: 1 }, { source: 0, target: 2 }, { source: 0, target: 3 },
{ source: 1, target: 4 }, { source: 1, target: 5 }, { source: 1, target: 6 }];

function draw() {
        var width = 400;
        var height = 400;
        var svg = d3.select("body")
                .select("svg")
        var padding = { top: 20, right: 20, bottom: 20, left: 20 };
        //创建布局
        var force = d3.layout.force()
                .nodes(nodes)
                .links(edges)
                .size([width, height])
                .linkDistance(90)
                .charge(-400);
        //开始计算
        force.start();
        var color = d3.scale.category20();
        //拖拽行为
        var drag = force.drag()
                .on("dragstart", function (d) {
                        d.fixed = true;
                })
                .on("dragend", function (d, i) {
                        d3.select(this).style("fill", color(i));
                })
                .on("drag", function (d) {
                        d3.select(this).style("fill", "yellow");
                });
        //绘制图表
        var lines = svg.selectAll(".forceLine")
                .data(edges)
                .enter()
                .append("line")
                .attr("class", "forceLine")
                .attr("stroke", "black");
        var circles = svg.selectAll(".forceCircle")
                .data(nodes)
                .enter()
                .append("circle")
                .attr("class", "forceCircle")
                .attr("r", 20)
                .attr("fill", function (d, i) {
                        return color(i);
                })
                .call(drag);
        var text = svg.selectAll(".forceText")
                .data(nodes)
                .enter()
                .append("text")
                .attr("class", "forceText")
                .attr("x", function (d) { return d.x; })
                .attr("y", function (d) { return d.y; })
                .attr("text-anchor", "middle")
                .attr("dy", ".3em")
                .text(function (d) { return d.name; });
        //事件监听器
        force.on("tick", function () {
                lines.attr("x1", function (d) { return d.source.x });
                lines.attr("y1", function (d) { return d.source.y });
                lines.attr("x2", function (d) { return d.target.x });
                lines.attr("y2", function (d) { return d.target.y });

                circles.attr("cx", function (d) { return d.x; });
                circles.attr("cy", function (d) { return d.y; });

                text.attr("x", function (d) { return d.x; });
                text.attr("y", function (d) { return d.y });

        });
        force.on("start", function () {
                console.log("运动开始");
        });
        force.on("end", function () {
                console.log("运动结束");
        });
}
window.onload = draw;

