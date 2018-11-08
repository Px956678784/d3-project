function draw() {
    var width = 800;
    var height = 800;
    var svg = d3.select("body")
        .select("svg")
    var padding = { top: 20, right: 20, bottom: 20, left: 20 };
    //创建布局
    var cluster = d3.layout.cluster()
        .size([360, width / 2 - 100])
        .separation(function (a, b) {
            return (a.parent == b.parent ? 1 : 2) / a.depth;
        });
    d3.json("city.json", function (error, root) {
        var nodes = cluster.nodes(root);
        var links = cluster.links(nodes);
        //开始画连线
        var gTree = svg.append("g").attr("transform", "translate(500,400)");
        var diagonal = d3.svg.diagonal.radial()
            .projection(function (d) {
                var radius = d.y;
                var angle = d.x / 180 * Math.PI;
                return [radius, angle];
            });
        var link = gTree.selectAll(".link")
            .data(links)
            .enter()
            .append("path")
            .attr("class", "link")
            .attr("d", diagonal)
            .attr("fill", "none")
            .attr("stroke", "black")
            .attr("stroke-width", 1);
        //开始画节点
        var node = gTree.selectAll(".node")
            .data(nodes)
            .enter()
            .append("g")
            .attr("class", "node")
            .attr("transform", function (d) { return "rotate(" + (d.x - 90) + ")translate(" + d.y + ")" });
        //向g中添加圆和文字
        node.append("circle")
            .attr("r", 4.5);
        node.append("text")
            .attr("transform", function (d) { return d.x < 180 ? "translate(8)" : "rotate(180)translate(-8)"; })
            .attr("dy", ".3em")
            .style("text-anchor", function (d) { return d.x < 180 ? "start" : "end"; })
            .text(function (d) { return d.name; });

    });


}
window.onload = draw;