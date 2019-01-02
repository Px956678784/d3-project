function draw(mapzoom) {
        var width = 2000;
        var height = 2000;
        var areadiv = d3.select("body").select("#areas");
        ZOOM = mapzoom;
        if (areadiv._groups[0][0].childElementCount == 0) {
                var svg = areadiv.append("svg").attr("width", width).attr("height", height);

                //地图投影
                var projection = d3.geoMercator()
                        .center([104.091, 30.596])
                        .scale(25000 * Math.pow(2, (mapzoom - 10)))
                        .translate([width / 2, height / 2]);
                //设定投影
                var path = d3.geoPath()
                        .projection(projection);
                //颜色
                var color = ["#bcfff8", "#DEF9AE", "#9dc2f6", "#83C2DF", "#FFB9D5", "#F6C0E2", "#F7BEB7", "#F6D89D", "#F3E59A", "#f26a7a", "#5498F7",
                        "#C094FB"]

                //请求topojson
                var georoot;
                d3.json("js/json/Chengdu.topojson", function (error, toporoot) {
                        if (error)
                                return console.error(error);
                        georoot = topojson.feature(toporoot, toporoot.objects.chengdu);
                        redrawAreas("");
                });


                redrawAreas = function () {
                        svg.selectAll("g").remove();
                        var groups = svg.append("g");
                        var points = [];
                        function setPaths(paths) {

                                paths.each(function (d, i) {
                                        d.color = color[i];
                                        //中心点的坐标及颜色
                                        var centroid = path.centroid(d);//计算重心坐标
                                        var point = { x: centroid[0], y: centroid[1], name: d.properties.name, color: d.color };
                                        points.push(point);
                                });
                                paths.style("fill", function (d, i) {
                                        if (chosenArea.indexOf(d.properties.name) != -1) {
                                                return "black";
                                        }
                                        return color[i];
                                })
                                        .attr("d", path)//路径生成器
                                        .style("stroke", "white")
                                        .style("opacity", .25);
                        }
                        //获取更新,enter,exit部分
                        var pathsUpdate = groups.selectAll("path")
                                .data(georoot.features);
                        var pathsEnter = pathsUpdate.enter();
                        var pathsExit = pathsUpdate.exit();
                        //更新
                        pathsUpdate.call(setPaths);
                        //新路径
                        var newPaths = pathsEnter.append("path")
                                .attr("class", "porvince");
                        newPaths.call(setPaths);
                        pathsExit.remove();
                        if (chosenPoi.length == 0)
                                FlowOnMap();
                        else
                                PoiOnMap();

                        //添加流图到地图上
                        function FlowOnMap() {
                                queue()
                                        .defer(d3.json, "js/json/nodes.json")
                                        .defer(d3.json, "js/json/edges.json")
                                        .await(function (error, file1, file2) { createFlow(file1, file2); });

                                function createFlow(rownodes, rowedges) {

                                        var nodes = [], edges = [];
                                        for (k in rownodes) {
                                                if (rownodes[k].hour == TIME)
                                                        nodes.push(rownodes[k]);
                                        }
                                        var sumweight = 0;
                                        for (k in rowedges) {
                                                if ((rowedges[k].hour == TIME) && (rowedges[k].source != rowedges[k].target)) {
                                                        sumweight += rowedges[k].weight;
                                                        edges.push(rowedges[k]);
                                                }
                                        }
                                        for (i in edges)
                                                edges[i].weight = edges[i].weight * 100 / sumweight;
                                        var nodeHash = {};
                                        for (i in nodes) {
                                                for (j in points) {
                                                        if (nodes[i].name == points[j].name) {
                                                                points[j].value = nodes[i].value;
                                                                nodeHash[nodes[i].name] = points[j];
                                                        }

                                                }

                                        }

                                        for (i in edges) {
                                                edges[i].weight = parseInt(edges[i].weight);
                                                edges[i].source = nodeHash[edges[i].source];
                                                edges[i].target = nodeHash[edges[i].target];
                                        }
                                        linkScale = d3.scaleLinear().domain(d3.extent(edges, function (d) { return d.weight })).range([1, 10]);
                                        function setFlow(flow) {
                                                flow.attr("source", function (d) { return d.source.name; })
                                                        .attr("target", function (d) { return d.target.name; })
                                                        .style("stroke", function (d) {
                                                                if (chosenArea.length != 0) {
                                                                        if (chosenArea.indexOf(d.source.name) != -1)
                                                                                return "orange";
                                                                        else {
                                                                                if (chosenArea.indexOf(d.target.name) != -1)
                                                                                        return "yellowgreen";
                                                                                else
                                                                                        return "none";
                                                                        }
                                                                }
                                                                else
                                                                        return "rgb(110, 173, 202)";
                                                        })
                                                        .style("stroke-width", function (d) { return linkScale(d.weight); })
                                                        .style("fill", "none")
                                                        .style("opacity", .5)
                                                        .attr("d", shapedEdge);

                                        }
                                        function shapedEdge(d, i) {
                                                var lineGenerator = d3.line()
                                                        .x(function (d) {
                                                                return d[0]
                                                        })
                                                        .y(function (d) {
                                                                return d[1];
                                                        });
                                                var k = (d.source.x - d.target.x) / (d.target.y - d.source.y);
                                                var gap = 3;
                                                var midX = (d.source.x + d.target.x) / 2;
                                                var midY = (d.source.y + d.target.y) / 2;
                                                if (chosenArea.length != 0) {
                                                        if (chosenArea.indexOf(d.source.name) != -1)
                                                                return lines = lineGenerator.curve(d3['curveNatural'])([[d.source.x, d.source.y], [midX - gap, -k * gap + midY],
                                                                [d.target.x, d.target.y]])
                                                        else {
                                                                if (chosenArea.indexOf(d.target.name) != -1)
                                                                        return lines = lineGenerator.curve(d3['curveNatural'])([[d.source.x, d.source.y], [midX - gap, k * gap + midY],
                                                                        [d.target.x, d.target.y]])
                                                        }
                                                }
                                                else
                                                        return lines = lineGenerator.curve(d3['curveNatural'])([[d.source.x, d.source.y], [midX - gap, -k * gap + midY],
                                                        [d.target.x, d.target.y]])
                                        }

                                        //获取更新,enter,exit部分
                                        var flowUpdate = groups.selectAll("path.flow")
                                                .data(edges);

                                        var flowEnter = flowUpdate.enter();
                                        var flowExit = flowUpdate.exit();
                                        //更新
                                        flowUpdate.call(setFlow);
                                        //新路径
                                        var newflow = flowEnter.append("path")
                                                .attr("class", "flow");
                                        newflow.call(setFlow);
                                        flowExit.remove();


                                        nodeScale = d3.scaleLinear().domain(d3.extent(points, function (d) { return d.value })).range([1, 10]);
                                        function setPoint(point) {
                                                point.attr("id", function (d) { return d.name; })
                                                        .attr("r", function (d) { return nodeScale(d.value); })
                                                        .style("fill", function (d) { return d.color; })
                                                        .style("stroke", "white")
                                                        .style("stroke-width", "1px")
                                                        .attr("cx", function (d) { return d.x })
                                                        .attr("cy", function (d) { return d.y });
                                        }
                                        //获取更新,enter,exit部分
                                        var pointUpdate = groups.selectAll("circle.area")
                                                .data(points);
                                        var pointEnter = pointUpdate.enter();
                                        if (pointEnter._groups[0][0]) {
                                                POINTENTER = pointEnter;
                                        }
                                        else {
                                                pointEnter = POINTENTER;
                                        }
                                        var pointExit = pointUpdate.exit();
                                        //更新
                                        pointUpdate.call(setPoint);
                                        //新点
                                        var newPoint = pointEnter.append("circle")
                                                .attr("class", "area");
                                        newPoint.call(setPoint);
                                        pointExit.remove();
                                }

                                var chosenEdges = [];
                                newPaths.on("mouseover", function (d) {
                                        if (chosenArea.length == 0) {
                                                var trails = groups.selectAll("path.flow");
                                                // console.log(d.color);
                                                for (var i = 0; i < trails._groups[0].length; i++) {
                                                        if (trails._groups[0][i].getAttribute("source") == d.properties.name
                                                                || trails._groups[0][i].getAttribute("target") == d.properties.name) { chosenEdges.push(trails._groups[0][i]); }
                                                }
                                                d3.select(this).style("fill", "black");
                                                for (var i = 0; i < chosenEdges.length; i++)
                                                        chosenEdges[i].style.stroke = 'orange';
                                        }
                                })
                                        .on("mouseout", function (d) {
                                                if (chosenArea.length == 0) {
                                                        d3.select(this).style("fill", d.color);
                                                        for (var i = 0; i < chosenEdges.length; i++)
                                                                chosenEdges[i].style.stroke = 'rgb(110, 173, 202)';
                                                        chosenEdges.length = 0;
                                                }

                                        });

                        }
                        //将POI标注在地图上
                        function PoiOnMap() {

                                d3.json("js/json/poiData.json", function (rowData) {
                                        var selectedData = [];
                                        for (i in rowData) {
                                                if (chosenArea.length == 0) {
                                                        for (j in chosenPoi) {
                                                                if (rowData[i].className == chosenPoi[j])
                                                                        selectedData.push(rowData[i]);
                                                        }

                                                }
                                                else {
                                                        for (j in chosenArea) {
                                                                for (k in chosenPoi) {
                                                                        if (rowData[i].className == chosenPoi[k] && rowData[i].district == chosenArea[j])
                                                                                selectedData.push(rowData[i]);
                                                                }
                                                        }
                                                }
                                        }

                                        ///////////////////////
                                        // 点
                                        function setNodes(nodes) {

                                                nodes
                                                        .attr("cx", function (d) {
                                                                d.log -= 0.009;
                                                                var coor = projection([d.log, d.lat]);
                                                                return coor[0];
                                                        })
                                                        .attr("cy", function (d) {
                                                                d.lat -= 0.005;
                                                                var coor = projection([d.log, d.lat]);
                                                                return coor[1];
                                                        })
                                                        .attr('fill', function (d) { return d.color; })
                                                        .attr("r", 3)
                                                        .style("stroke", "white")
                                                        .attr("stroke-width", 1.5);

                                        }
                                        var nodesUpdate = groups
                                                .selectAll("circle")
                                                .data(selectedData);
                                        var nodesEnter = nodesUpdate.enter();
                                        var nodesExit = nodesUpdate.exit();
                                        //更新
                                        nodesUpdate.call(setNodes);
                                        //新路径
                                        var newNodes = nodesEnter.append("circle")
                                                .attr("class", "point");
                                        newNodes.call(setNodes);
                                        nodesExit.remove();

                                        ///////////////////////
                                        // Tooltips
                                        var tooltip = d3.select("body").append("div")
                                                .attr("class", "tooltip");

                                        groups.selectAll("circle")
                                                .on("mouseover", function (d) {
                                                        var tooltip_str = "名称：" + d.name +
                                                                "<br/>" + "类别：" + d.className;
                                                        tooltip.html(tooltip_str)
                                                                .style("visibility", "visible");
                                                })
                                                .on("mousemove", function (d) {
                                                        tooltip.style("top", event.pageY - (tooltip.node().clientHeight + 5) + "px")
                                                                .style("left", event.pageX - (tooltip.node().clientWidth / 2.0) + "px");
                                                })
                                                .on("mouseout", function (d) {
                                                        tooltip.style("visibility", "hidden");
                                                })
                                });

                        }
                }

        }
        REDRAWMAP = redrawAreas;
}
