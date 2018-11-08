function draw() {
    var width = 800;
    var height = 800;
    var svg = d3.select("body")
        .select("svg")
    //创建布局
    var tree = d3.layout.tree()
        .size([height, width]);
    var diagonal = d3.svg.diagonal()
        .projection(function (d) {
            return [d.y, d.x];
        });
    d3.json("learning.json", function (error, root) {
        function toggle(d) {
            if (d.children) {
                //如果有节点
                d._children = d.children;
                d.children = null;
            } else {
                d.children = d._children;
                d._children = null;
            }
        }
        function redraw(source) {
            //计算节点和连线
            var nodes = tree.nodes(root);
            var links = tree.links(nodes);
            //重新计算节点的y的坐标
            nodes.forEach(function (d) {
                d.y = d.depth * 180;
            });
            //获取节点的update部分
            var nodeUpdate = svg.selectAll(".node")
                .data(nodes, function (d) { return d.name; });
            //获取节点的enter部分
            var nodeEnter = nodeUpdate.enter();
            //获取节点的exit部分
            var nodeExit = nodeUpdate.exit();

            //enter处理方法
            var enterNodes = nodeEnter.append("g")
                .attr("class", "node")
                .attr("transform", function (d) {
                    return "translate(" + source.y0 + "," + source.x0 + ")";
                })
                .on("click", function (d) {
                    toggle(d);
                    redraw(d);
                });

            enterNodes.append("circle")
                .attr("r", 0)
                .style("fill", function (d) {
                    return d._children ? "lightsteelblue" : "green";
                });
            enterNodes.append("text")
                .attr("x", function (d) {
                    return d.children || d._children ? -14 : 14;
                })
                .attr("dy", ".35em")
                .attr("text-anchor", function (d) {
                    return d.children || d._children ? "end" : "start";
                })
                .text(function (d) {
                    return d.name;
                })
                .style("fill-opacity", 0);

            //update处理方法
            var updateNodes = nodeUpdate.transition()
                .duration(500)
                .attr("transform", function (d) {
                    return "translate(" + d.y + "," + d.x + ")"
                });

            updateNodes.select("circle")
                .attr("r", 8)
                .style("fill", function (d) { return d._children ? "lightsteelblue" : "green" });

            updateNodes.select("text")
                .style("fill-opacity", "1");

            //exit处理方法
            var exitNodes = nodeExit.transition()
                .duration(500)
                .attr("transform", function (d) { "translate(" + source.y + "," + source.x + ")" })
                .remove();
            exitNodes.select("circle")
                .attr("r", 0);
            exitNodes.select("text")
                .style("fill-opacity", 0);


            //获取连线的update部分
            var linkUpdate = svg.selectAll(".link")
                .data(links, function (d) { return d.target.name; });
            //获取连线的enter部分
            var linkEnter = linkUpdate.enter();
            //获取节点的exit部分
            var linkExit = linkUpdate.exit();

            //enter处理方法
            linkEnter.insert("path", ".node")
                .attr("class", "link")
                .attr("d", function (d) {
                    var o = { x: source.x0, y: source.y0 };
                    return diagonal({ source: o, target: o });
                })
                .attr("fill", "none")
                .attr("stroke", "black")
                .attr("stroke-width", 1)
                .transition()
                .duration(500)
                .attr("d", diagonal);


            //update处理方法
            linkUpdate.transition().duration(500).attr("d", diagonal);

            //exit处理方法
            linkExit.transition()
                .duration(500)
                .attr("d", function (d) {
                    var o = { x: source.x, y: source.y };
                    return diagonal({ source: o, target: o });
                })
                .remove();


            //保存当前的节点坐标
            nodes.forEach(function (d) {
                d.x0 = d.x;
                d.y0 = d.y;
            })
        }
        root.x0 = height / 2;
        root.y0 = 0;
        redraw(root);
    });


}
window.onload = draw;