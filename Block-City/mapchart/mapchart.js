function draw(mapzoom) {
        var width = 2000;
        var height = 2000;
        var areadiv = d3.select("body").select("#areas");
        if (areadiv._groups[0][0].childElementCount == 0) {
                var svg = areadiv.append("svg").attr("width", width).attr("height", height);
                var groups = svg.append("g");

                //地图投影
                var projection = d3.geoMercator()
                        .center([104.091, 30.596])
                        .scale(25000 * Math.pow(2, (mapzoom - 10)))
                        .translate([width / 2, height / 2]);
                //设定投影
                var path = d3.geoPath()
                        .projection(projection);
                //颜色
                var color = ["red", "blue", "yellow", "green", "steelblue", "black", "yellowgreen", "Olive", "pink", "white", "brown", "purple"]
                //请求topojson
                d3.json("Chengdu.topojson", function (error, toporoot) {
                        if (error)
                                return console.error(error);
                        var georoot = topojson.feature(toporoot, toporoot.objects.chengdu);
                        function toggle(d) {
                                if (d.selected == "unselected") {
                                        d.selected = "selected";
                                }
                                else {
                                        d.selected = "unselected"
                                }
                        }
                        function redraw(source) {
                                var paths = groups.selectAll("path")
                                        .data(georoot.features)
                                        .enter()
                                        .append("path")
                                        .attr("class", "porvince")
                                        .style("fill", function (d, i) { return color[i]; })
                                        .attr("d", path)//路径生成器
                                        .style("stroke", "white");
                                paths.each(function (d, i) {
                                        var centroid = path.centroid(d);//计算重心坐标
                                        //显示中心
                                        groups.append("circle")
                                                .attr("class", "centroid")
                                                .attr("cx", centroid[0])
                                                .attr("cy", centroid[1])
                                                .attr("r", 8)
                                                .style("fill", "red");
                                        d.selected = "unselected";
                                        d.color = color[i];
                                }).on("click", function (d) {
                                        console.log(d.properties.name);
                                        if (d.selected == "unselected")
                                                d3.select(this).style("fill", "orange");
                                        else
                                                d3.select(this).style("fill", d.color);
                                        toggle(d);
                                });

                        }
                        redraw(georoot);


                });



        }


}

