function drawbump() {
    var hotspot;
    var margin = { top: 0, right: 0, bottom: 30, left: 50 };
    var width = document.getElementById("bumpchart").offsetWidth,
        height = 298;
    var svg = d3.select("#bumpchart").append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    d3.json("js/json/nodes.json", function (data) {
        data.sort(function (a, b) {
            if (b.hour != a.hour) {
                return b.hour - a.hour;
            }
            if (b.value != a.value) {
                return b.value - a.value;
            }
        });
        hotspot = data;
        redrawbump("");

    });
    redrawbump = function () {
        svg.selectAll("g").remove();
        ///////////////////////
        //比例尺
        var x = d3.scaleBand()
            .domain(hotspot.map(function (d) { return d.hour; }).reverse())
            .rangeRound([25, width - 50]);

        var y = d3.scaleLinear()
            .domain([d3.min(hotspot, function (d) { return d.value }), d3.max(hotspot, function (d) { return d.value; })])
            .range([height - 30, 20]);

        ///////////////////////
        // 坐标轴
        var xAxis = d3.axisBottom(x);

        var yAxis = d3.axisLeft(y);

        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(-" + x.bandwidth() / 2.0 + "," + (height - 20) + ")")
            .call(xAxis);

        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis);

        ///////////////////////
        // 线条
        var areas = d3.map(hotspot, function (d) {
            return d.name;
        }).keys();
        var classedHotspot = [];
        areas.forEach(function (area) {
            var thisHotspot = hotspot.filter(function (d) {
                if (d.name == area) {
                    return d;
                }
            });
            classedHotspot.push(thisHotspot);
        });
        var line = d3.line()
            .x(function (d) { return x(d.hour); })
            .y(function (d) { return y(d.value); });

        function setLines(Lines) {
            Lines
                .attr("style", "fill:none")
                .attr("d", line)
                .attr("stroke-linejoin", "round")
                .attr("stroke-linecap", "round")
                .attr("stroke-width", 2)
                .style("stroke", "#2c4166");
            if (chosenArea.length != 0) {
                Lines.style("stroke", function (d) {
                    if (chosenArea.indexOf(d[0].name) != -1) return "rgb(110, 173, 202)";
                    else return "#2c4166";
                })
                    .attr("stroke-opacity", function (d) {
                        if (chosenArea.indexOf(d[0].name) != -1) return 1;
                        else return .1;
                    });
            }
            else {
                Lines.attr("stroke-opacity", 1)
                    .style("stroke", "#2c4166")
            }

        }
        var linesUpdate = svg.selectAll("path.lines").data(classedHotspot);
        var linesEnter = linesUpdate.enter();
        var linesExit = linesUpdate.exit();
        //更新
        linesUpdate.call(setLines);
        //新路径
        var newLines = linesEnter.append("path")
            .attr("class", "lines");
        newLines.call(setLines);
        linesExit.remove();


        ///////////////////////
        // 点
        function setNodes(nodes) {
            nodes
                .attr("cx", function (d) { return x(d.hour); })
                .attr("cy", function (d) { return y(d.value); })
                .attr('fill', function (d) { return d.color; })
                .attr("r", 5)
                .attr("stroke-width", 1.5);
            if (chosenArea.length != 0) {
                nodes.style("stroke", function (d) {
                    if (chosenArea.indexOf(d.name) != -1) return "rgb(110, 173, 202)";
                    else return "#2c4166";
                })
                    .attr("opacity", function (d) {
                        if (chosenArea.indexOf(d.name) != -1) return 1;
                        else return 0.1;
                    });
            }
            else {
                nodes.attr("opacity", 1)
                    .style("stroke", "#2c4166");

            }
        }
        var groups = svg.append("g");
        var nodesUpdate = groups
            .selectAll("circle")
            .data(hotspot);
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

        svg.selectAll("circle")
            .on("mouseover", function (d) {
                if (chosenArea.length == 0) {
                    svg.selectAll('.lines')
                        .attr("stroke-opacity", .1)
                        .style("stroke", "#2c4166")
                        .filter(function (p) {
                            return p[0].name == d.name;
                        })
                        .attr("stroke-opacity", 1)
                        .style("stroke", "rgb(110, 173, 202)");
                    svg.selectAll('.point')
                        .style("opacity", 0.1)
                        .style("stroke", "#2c4166")
                        .filter(function (p) {
                            return d.name == p.name;
                        })
                        .style("stroke", "rgb(110, 173, 202)")
                        .style("opacity", 1)
                }
                var tooltip_str = "区域名：" + d.name +
                    "<br/>" + "时间：" + d.hour + ":00-" + (d.hour + 1) + ":00" +
                    "<br/>" + "活跃车辆：" + d.value;


                tooltip.html(tooltip_str)
                    .style("visibility", "visible");
            })
            .on("mousemove", function (d) {
                tooltip.style("top", event.pageY - (tooltip.node().clientHeight + 5) + "px")
                    .style("left", event.pageX - (tooltip.node().clientWidth / 2.0) + "px");
            })
            .on("mouseout", function (d) {
                if (chosenArea.length == 0) {
                    svg.selectAll('.lines')
                        .attr("stroke-opacity", 1)
                        .style("stroke", "#2c4166");
                    svg.selectAll('.point')
                        .style("opacity", 1)
                        .style("stroke", "#2c4166");
                }
                tooltip.style("visibility", "hidden");
            }).on('click', function (d) {
                TIME = d.hour;
                d3.select('#timebox').text(d.hour + ':00-' + (d.hour + 1) + ':00');
                REDRAWMAP();
                AreaPieChart();
            });



    }
    REDRAWBUMP = redrawbump;

}