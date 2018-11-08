function draw() {
        var width = 800;
        var height = 800;
        var svg = d3.select("body")
                .select("svg");
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
                        .style("fill", "#ccc")
                        .attr("d", path)//路径生成器
                        .style("stroke", "white")
                        .on("mouseover", function (d, i) {
                                d3.select(this).style("fill", "orange");
                        })
                        .on("mouseout", function (d, i) {
                                d3.select(this).style("fill", "#ccc");
                        });


                //定义箭头
                var defs = svg.append("defs");
                var arrowmaker = defs.append("marker")
                        .attr("id", "arrow")
                        .attr("markerUnits", "strokeWidth")
                        .attr("markerWidth", "12")
                        .attr("markerHeight", "12")
                        .attr("viewBox", "0 0 12 12")
                        .attr("refX", "6")
                        .attr("refY", "6")
                        .attr("orient", "auto");
                var arrow_path = "M2,2 L10,6 L2,10 L6,6 L2,2";
                arrowmaker.append("path")
                        .attr("d", arrow_path)
                        .attr("fill", "#000");
                //开始圆点
                var startMarker = defs.append("marker")
                        .attr("id", "startPoint")
                        .attr("markerUnits", "strokeWidth")
                        .attr("markerWidth", "12")
                        .attr("markerHeight", "12")
                        .attr("viewBox", "0 0 12 12")
                        .attr("refX", "6")
                        .attr("refY", "6")
                        .attr("orient", "auto");
                startMarker.append("circle")
                        .attr("cx", 6)
                        .attr("cy", 6)
                        .attr("r", 2)
                        .attr("fill", "#000");


                var wangjiang = projection([104.087584, 30.637184]);
                var jiangan = projection([104.000615, 30.559024]);
                svg.append("line")
                        .attr("class", "route")
                        .attr("x1", wangjiang[0])
                        .attr("y1", wangjiang[1])
                        .attr("x2", jiangan[0])
                        .attr("y2", jiangan[1])
                        .attr("stroke", "black")
                        .attr("stroke-width", 2)
                        .attr("marker-end", "url(#arrow)")
                        .attr("marker-start", "url(#startPoint)");



        });






}

window.onload = draw;

