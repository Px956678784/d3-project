function draw() {
    var width = 1000;
    var height = 1000;
    radius = 300;
    var svg = d3.select("body")
        .select("svg")
    var color = d3.scale.category20()
    //创建布局
    var partition = d3.layout.partition()
        .sort(null)
        .size([2 * Math.PI, radius * radius])
        .value(function (d) { return 1 });
    var arc = d3.svg.arc()
        .startAngle(function (d) { return d.x; })
        .endAngle(function (d) { return d.x + d.dx; })
        .innerRadius(function (d) { return Math.sqrt(d.y); })
        .outerRadius(function (d) { return Math.sqrt(d.y + d.dy); });
    d3.json("city.json", function (error, root) {
        if (error)
            console.log(error);
        var nodes = partition.nodes(root);
        var links = partition.links(nodes);
        //开始绘制分区
        var gArcs = svg.selectAll("g")
            .data(nodes)
            .enter()
            .append("g")
            .attr("transform", "translate(400,400)");
        gArcs.append("path")
            .attr("display", function (d) {
                return d.depth ? null : "none";
            })
            .attr("d", arc)
            .style("stroke", "#fff")
            .style("fill", function (d) {
                return color((d.children ? d : d.parent).name);
            });
        gArcs.append("text")
            .attr("class", "nodeText")
            .attr("dy", ".5em")
            .attr("transform", function (d, i) {
                if (i !== 0) {
                    var r = d.x + d.dx / 2;
                    var angle = Math.PI / 2;
                    r += r < Math.PI ? (angle * -1) : angle;
                    r *= 180 / Math.PI;
                    var x = arc.centroid(d)[0];
                    var y = arc.centroid(d)[1];
                    return "translate(" + x + "," + y + ")" +
                        "rotate(" + r + ")";
                }
            })
            .style("text-anchor", "middle")
            .text(function (d, i) { return d.name; });
    });


}
window.onload = draw;