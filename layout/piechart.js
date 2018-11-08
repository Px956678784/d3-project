var dataset = [["小米", 60.8], ["三星", 58.4], ["联想", 47.3],
["苹果", 46.6], ["华为", 41.3], ["酷派", 40.1],
["其他", 111.5]];

function draw() {
        var width = 800;
        var height = 800;

        var svg = d3.select("body")
                .select("svg")
        var padding = { top: 20, right: 20, bottom: 20, left: 20 };
        //创建布局
        var pie = d3.layout.pie()
                .value(function (d) {
                        return d[1];
                });
        var piedata = pie(dataset);
        var outerradius = width / 3;
        var innerradius = 0;
        var piecircle = {
                cx: width / 2,
                cy: height / 2,
                r: outerradius
        }
        var arc = d3.svg.arc()
                .innerRadius(innerradius)
                .outerRadius(outerradius);
        var color = d3.scale.category20();
        var arcs = svg.selectAll("g")
                .data(piedata)
                .enter()
                .append("g")
                .attr("class", "arcGroup")
                .each(function (d) {
                        d.circle = piecircle;
                        d.dx = 0;
                        d.dy = 0;
                })
                .attr("transform", function (d) {
                        return "translate(" + d.circle.cx + "," + d.circle.cy + ")";
                });
        arcs.append("path")
                .attr("class", "arcPath")
                .attr("fill", function (d, i) {
                        return color(i);
                })
                .attr("d", function (d) {
                        return arc(d);
                });
        arcs.append("text")
                .attr("class", "percent")
                .attr("transform", function (d) {
                        var x = arc.centroid(d)[0] * 1.4;
                        var y = arc.centroid(d)[1] * 1.4;
                        return "translate(" + x + "," + y + ")";
                })
                .attr("text-anchor", "middle")
                .text(function (d) {
                        var percent = Number(d.value) /
                                d3.sum(dataset, function (d) { return d[1]; }) * 100;
                        return percent.toFixed(1) + "%"
                })
        //外围文字
        arcs.append("line")
                .attr("class", "conLine")
                .attr("stroke", "black")
                .attr("x1", function (d) { return arc.centroid(d)[0] * 2; })
                .attr("y1", function (d) { return arc.centroid(d)[1] * 2; })
                .attr("x2", function (d) { return arc.centroid(d)[0] * 2.2; })
                .attr("y2", function (d) { return arc.centroid(d)[1] * 2.2; });
        arcs.append("text")
                .attr("class", "company")
                .attr("transform", function (d) {
                        var x = arc.centroid(d)[0] * 2.5;
                        var y = arc.centroid(d)[1] * 2.5;
                        return "translate(" + x + "," + y + ")";
                })
                .attr("text-anchor", "middle")
                .text(function (d) {
                        return d.data[0];
                });

        //鼠标滑过的框框
        var tooltip = d3.select("body")
                .append("div")
                .attr("class", "tooltip")
                .style("opacity", 0.0);
        arcs.on("mouseover", function (d) {
                tooltip.html(d.data[0] + "的出货量为" + "<br />" + d.data[1] + "百万台")
                        .style("left", (d3.event.pageX) + "px")
                        .style("top", (d3.event.pageY + 20) + "px")
                        .style("opacity", 1.0);
        })
                .on("mousemove", function (d) {
                        tooltip.style("left", (d3.event.pageX) + "px")
                                .style("top", (d3.event.pageY + 20) + "px");
                })
                .on("mouseout", function (d) {
                        tooltip.style("opacity", 0.0);
                })
        //数据更新后的重绘

        function setAttributes(arcs) {
                arcs.each(function (d) {
                        d.circle = piecircle;
                        d.dx = 0;
                        d.dy = 0;
                })
                        .attr("transform", function (d) {
                                return "translate(" + d.circle.cx + "," + d.circle.cy + ")";
                        });
                //绘制弧
                arcs.select(".arcPath")
                        .attr("fill", function (d, i) {
                                return color(d.data[0]);
                        })
                        .attr("d", function (d) {
                                return arc(d);
                        });
                arcs.select(".percent")
                        .attr("transform", function (d) {
                                var x = arc.centroid(d)[0] * 1.4;
                                var y = arc.centroid(d)[1] * 1.4;
                                return "translate(" + x + "," + y + ")";
                        })
                        .attr("text-anchor", "middle")
                        .text(function (d) {
                                var percent = Number(d.value) /
                                        d3.sum(dataset, function (d) { return d[1]; }) * 100;
                                return percent.toFixed(1) + "%"
                        })
                //外围文字
                arcs.select(".conLine")
                        .attr("stroke", "black")
                        .attr("x1", function (d) { return arc.centroid(d)[0] * 2; })
                        .attr("y1", function (d) { return arc.centroid(d)[1] * 2; })
                        .attr("x2", function (d) { return arc.centroid(d)[0] * 2.2; })
                        .attr("y2", function (d) { return arc.centroid(d)[1] * 2.2; });
                arcs.select(".company")
                        .attr("transform", function (d) {
                                var x = arc.centroid(d)[0] * 2.5;
                                var y = arc.centroid(d)[1] * 2.5;
                                return "translate(" + x + "," + y + ")";
                        })
                        .attr("text-anchor", "middle")
                        .text(function (d) {
                                return d.data[0];
                        });

        }
        function redraw() {
                var arcsUpdate = svg.selectAll(".arcGroup")
                        .data(piedata, function (d) {
                                return d.data[0];
                        });
                //获取enter部分
                var arcsEnter = arcsUpdate.enter();
                //获取exit部分
                var arcsExit = arcsUpdate.exit();
                //1.update部分的处理方法，设定新的属性
                arcsUpdate.call(setAttributes);
                //2.update部分的处理方法
                var newArcs = arcsEnter.append("g")
                        .attr("class", "arcGroup");
                //添加弧
                newArcs.append("path")
                        .attr("class", "arcPath");
                newArcs.append("text")
                        .attr("class", "percent");
                newArcs.append("text")
                        .attr("class", "company");
                newArcs.append("line")
                        .attr("class", "conLine");
                newArcs.call(setAttributes);

                newArcs.call(drag);

                arcsExit.remove();


        }
        //正在被拖拽
        function dragCircleMove(d) {
                d.x = d3.event.sourceEvent.offsetX;
                d.y = d3.event.sourceEvent.offsetY;
                d3.select(this)
                        .attr("transform", "translate(" + d.x + "," + d.y + ")");
        }
        //拖拽结束
        function dragCircleEnd(d, i) {
                var dis2 = (d.x - piecircle.cx) * (d.x - piecircle.cx) +
                        (d.y - piecircle.cy) * (d.y - piecircle.cy);
                if (dis2 < piecircle.r * piecircle.r) {
                        //计算与y轴的夹角
                        var vec = { x: d.x - piecircle.cx, y: d.y - piecircle.cy };
                        var zerov = { x: 0.0, y: -1.0 };
                        var costheta = (vec.x * zerov.x + vec.y * zerov.y) / dis2;
                        var theta = Math.acos(costheta);
                        theta = d.x < piecircle.cx ? 2 * Math.PI - theta : theta;
                        //通过比较theta和startAngle.endAngle来判断落到哪一段弧上
                        //弧的索引号保存在index里
                        var index;
                        for (var j = 0; j < piedata.length; j++) {
                                if (theta >= piedata[j].startAngle &&
                                        theta <= piedata[j].endAngle) {
                                        index = j;
                                        break;
                                }
                        }
                        //增加数据
                        dataset[index][0] += "&" + d[0];
                        dataset[index][1] += d[1];

                        piedata = pie(dataset);

                        d3.select(this).remove();
                        redraw();
                }
        }
        //被移除后的元素的拖拽行为
        var dragCircle = d3.behavior.drag()
                .origin(null)
                .on("drag", dragCircleMove)
                .on("dragend", dragCircleEnd);
        //拉出去的圆圈
        var circleGroups = svg.append("g");
        function appendCircle(data) {
                gCircle = circleGroups.append("g")
                        .datum(data)
                        .attr("class", "moveArc")
                        .attr("transform", "translate(" + d3.event.sourceEvent.offsetX + ","
                                + d3.event.sourceEvent.offsetY + ")")
                        .call(dragCircle);

                //添加一个圆
                gCircle.append("circle")
                        .attr("cx", 0)
                        .attr("cy", 0)
                        .attr("r", 20)
                        .attr("fill", function (d) {
                                return color(d[0]);
                        });

                //添加文字
                gCircle.append("text")
                        .attr("dx", "22px")
                        .attr("dy", ".4em")
                        .text(function (d) {
                                return d[0];
                        });
        }

        //定义拖拽
        function dragmove(d) {
                d.dx += d3.event.dx;
                d.dy += d3.event.dy;
                d3.select(this)
                        .attr("transform", "translate(" + (d.dx + d.circle.cx) + "," + (d.dy + d.circle.cy) + ")");
        }
        function dragend(d, i) {
                //判断是否被拖到外面
                var dis2 = d.dx * d.dx + d.dy * d.dy;
                if (dis2 > d.circle.r * d.circle.r) {
                        for (var j = 0; j < dataset.length; j++) {
                                if (dataset[j][0] == d.data[0]) {
                                        i = j;
                                        break;
                                }
                        }
                        var movedData = dataset.splice(i, 1);
                        piedata = pie(dataset);
                        appendCircle(movedData[0]);
                        redraw();
                }
        }
        var drag = d3.behavior.drag()
                .origin(null)
                .on("drag", dragmove)
                .on("dragend", dragend);
        arcs.call(drag);
}



window.onload = draw;

