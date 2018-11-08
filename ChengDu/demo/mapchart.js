function draw() {
        var width = 800;
        var height = 800;
        var svg = d3.select("body")
                .select("svg")
        var padding = { top: 50, right: 50, bottom: 50, left: 50 };
        //地图投影
        var projection = d3.geo.mercator()
                .center([104.2, 30.5])
                .scale(80000)
                .translate([width / 2, height / 2]);
        //设定投影
        var path = d3.geo.path()
                .projection(projection);
        //颜色变化
        var color = d3.scale.category20();
        //请求geojson
        // d3.json("Chengdu.json", function (error, root) {
        //         if (error)
        //                 return console.error(error);
        //         var groups = svg.append("g");
        //         groups.selectAll("path")
        //                 .data(root.features)
        //                 .enter()
        //                 .append("path")
        //                 .attr("class", "porvince")
        //                 .style("fill", function (d, i) { return color(i); })
        //                 .attr("d", path)//路径生成器
        //                 .style("stroke", "white");
        // });
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
                //查找相邻的地区
                var neighbors = topojson.neighbors(
                        toporoot.objects.chengdu.geometries);
                console.log(neighbors);


                // groups.selectAll("path")
                //         .data(georoot.features.filter(function (d) {
                //                 return !southeast.has(d.properties.name);
                //         }))
                //         .enter()
                //         .append("path")
                //         .attr("class", "porvince")
                //         .style("fill", "#ccc")
                //         .attr("d", path)//路径生成器
                //         .style("stroke", "white");

                // //合并
                // groups.append("path")
                //         .datum(mergedPolygon)
                //         .attr("class", "province")
                //         .style("fill", "steelblue")
                //         .attr("d", path);
                // //轮廓
                // groups.append("path")
                //         .datum(boundary)
                //         .attr("class", "boundary")
                //         .style("fill", "none")
                //         .style("stroke", "black")
                //         .attr("d", path)
                //相邻
                var paths = groups.selectAll("path")
                        .data(georoot.features)
                        .enter()
                        .append("path")
                        .attr("class", "porvince")
                        .style("fill", "#ccc")
                        .attr("d", path)//路径生成器
                        .style("stroke", "white")
                        .on("click", function (d) {
                                var area = path.area(d);//计算区域面积
                                var centroid = path.centroid(d);//计算重心坐标
                                var bounds = path.bounds(d);//计算边界框

                                //显示中心
                                groups.append("circle")
                                        .attr("class", "centroid")
                                        .attr("cx", centroid[0])
                                        .attr("cy", centroid[1])
                                        .attr("r", 8)
                                        .style("fill", "red");


                        });
                paths.each(function (d, i) {
                        d.neighbors = d3.selectAll(neighbors[i].map(function (j) {
                                return paths[0][j];
                        }));
                })
                        .on("mouseover", function (d, i) {
                                d3.select(this).style("fill", "orange");
                                d.neighbors.style("fill", "steelblue");
                        })
                        .on("mouseout", function (d, i) {
                                d3.select(this).style("fill", "#ccc");
                                d.neighbors.style("fill", "#ccc");
                        })

        });






}

window.onload = draw;

