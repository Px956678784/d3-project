function draw() {
    var width = 800;
    var height = 800;
    var svg = d3.select("body")
        .select("svg")
    var padding = { top: 20, right: 20, bottom: 20, left: 20 };
    //创建布局
    var pack = d3.layout.pack()
        .size([width, height])
        .radius(30)
        .padding(5);
    d3.json("city.json", function (error, root) {
        var nodes = pack.nodes(root);
        var links = pack.links(nodes);
        //开始绘制圆圈
        svg.selectAll("circle")
            .data(nodes)
            .enter()
            .append("circle")
            .attr("class", function (d) {
                return d.children ? "node" : "leafnode";
            })
            .attr("cx", function (d) { return d.x; })
            .attr("cy", function (d) { return d.y; })
            .attr("r", function (d) { return d.r; })
            .style("fill", function (d) { return d.children ? "steelblue" : "yellowgreen" })
            .style("stroke", "white");
        //绘制文字
        svg.selectAll("text")
            .data(nodes)
            .enter()
            .append("text")
            .attr("class", "nodeText")
            .style("fill-opacity", function (d) {
                return d.children ? 0 : 1;
            })
            .style("text-anchor", "middle")
            .attr("x", function (d) { return d.x; })
            .attr("y", function (d) { return d.y; })
            .attr("dy", ".3em")
            .text(function (d) { return d.name; });

    });


}
window.onload = draw;