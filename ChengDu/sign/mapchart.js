function draw() {
        var width = 800;
        var height = 800;
        var svg = d3.select("body")
                .select("svg");
        svg.style("background-color", "#393a3a");
        var padding = { top: 50, right: 50, bottom: 50, left: 50 };
        //地图投影
        var projection = d3.geo.mercator()
                .center([104.2, 30.5])
                .scale(60000)
                .translate([width / 2, height / 2]);
        //设定投影
        var path = d3.geo.path()
                .projection(projection);

        //请求topojson
        d3.json("Chengdu.topojson", function (error, toporoot) {
                if (error)
                        return console.error(error);
                var georoot = topojson.feature(toporoot, toporoot.objects.chengdu);
                var groups = svg.append("g");
                //合并两个区域
                var southeast = d3.set(["武侯区", "锦江区"]);
                var mergedPolygon = topojson.merge(toporoot,
                        toporoot.objects.chengdu.geometries.filter(
                                function (d) {
                                        return southeast.has(d.properties.name);
                                })
                );
                //画出区域边界
                var boundary = topojson.mesh(toporoot, toporoot.objects.chengdu,
                        function (a, b) {
                                return a.properties.name == "武侯区"
                        });

                var provinces = groups.selectAll("path")
                        .data(georoot.features)
                        .enter()
                        .append("path")
                        .attr("class", "porvince")
                        .style("fill", "#393a3a")
                        .attr("d", path)//路径生成器
                        .style("stroke", "white")
                        .on("mouseover", function (d, i) {
                                d3.select(this).style("fill", "orange");
                        })
                        .on("mouseout", function (d, i) {
                                d3.select(this).style("fill", "#393a3a");
                        });


                //夜光图
                d3.json("places.json", function (error, places) {
                        if (error)
                                return console.error(error);

                        //定义颜色
                        var a = d3.rgb(255, 255, 0);
                        var b = d3.rgb(255, 255, 255);
                        var computecolor = d3.interpolate(a, b);
                        //模糊滤镜
                        var defs = svg.append("defs");
                        var gaussian = defs.append("filter")
                                .attr("id", "gaussian");
                        gaussian.append("feGaussianBlur")
                                .attr("in", "SourceGraphic")
                                .attr("stdDeviation", "1");


                        var points = svg.selectAll("circle")
                                .data(places)
                                .enter()
                                .append("circle")
                                .attr("cx", function (d) { return projection([d.log, d.lat])[0]; })
                                .attr("cy", function (d) { return projection([d.log, d.lat])[1]; })
                                .attr("r", 1)
                                .style("fill", function (d) {
                                        var color = computecolor(Math.random());
                                        return color.toString();
                                })
                                .style("filter", "url(#" + gaussian.attr("id") + ")");
                });



        });






}

window.onload = draw;

