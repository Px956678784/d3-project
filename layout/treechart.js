function draw() {
    var width = 400;
    var height = 400;
    var svg = d3.select("body")
        .select("svg")
    var padding = { top: 20, right: 20, bottom: 20, left: 20 };
    //创建布局
    var tree = d3.layout.tree()
        .size([width, height - 200])
        .separation(function(a, b) {
            return (a.parent == b.parent ? 1 : 2);
        });
    d3.json("city.json", function(error, root) {
        var nodes = tree.nodes(root);
        var links = tree.links(nodes);
        //开始画连线
        var gTree = svg.append("g").attr("transform", "translate(50,0)");
        var diagonal = d3.svg.diagonal()
            .projection(function(d) { return [d.y, d.x]; });
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
            .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")" });
        //向g中添加圆和文字
        node.append("circle")
            .attr("r", 4.5);
        node.append("text")
            .attr("dx", function(d) { return d.children ? -8 : 8; })
            .attr("dy", 3)
            .style("text-anchor", function(d) { return d.children ? "end" : "start"; })
            .text(function(d) { return d.name; });

    });


}
window.onload = draw;