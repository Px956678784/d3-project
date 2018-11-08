function draw() {
        var width = 800;
        var height = 800;
        var svg = d3.select("body")
                .select("svg")
        var padding = { top: 50, right: 50, bottom: 50, left: 50 };
        //经纬度网络
        var graticule = d3.geo.graticule()
                .extent([[100, 20], [110, 40]])
                .step([0.1, 0.1]);
        var grid = graticule();
        //地图投影
        var projection = d3.geo.mercator()
                .center([104.25, 30.5])
                .scale(60000)
                .translate([width / 2, height / 2]);
        //设定投影
        var path = d3.geo.path()
                .projection(projection);
        var gridPath = svg.append("path")
                .datum(grid)
                .attr("class", "graticule")
                .attr("d", path)
                .style("stroke", "black");

        //请求topojson
        d3.json("Chengdu.topojson", function (error, toporoot) {
                if (error)
                        return console.error(error);
                var georoot = topojson.feature(toporoot, toporoot.objects.chengdu);
                var groups = svg.append("g");
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
                        .attr("d", path)//路径生成器
                        .style("stroke", "white");
                d3.json("tourism.json", function (error, valuedata) {
                        //将各省的tourism数据读取
                        var values = [];
                        for (var i = 0; i < valuedata.provinces.length; i++) {
                                var name = valuedata.provinces[i].name;
                                var value = valuedata.provinces[i].value;
                                values[name] = value;
                        }
                        //求最大值和最小值
                        var maxvalue = d3.max(valuedata.provinces, function (d) {
                                return d.value;
                        });
                        var minvalue = 0;
                        //定义一个比例尺
                        var linear = d3.scale.linear()
                                .domain([minvalue, maxvalue])
                                .range([0, 1]);
                        //定义颜色
                        var a = d3.rgb(67, 237, 255);
                        var b = d3.rgb(61, 81, 232);

                        //颜色插值函数
                        var computeColor = d3.interpolate(a, b);

                        //设定各省的填充颜色
                        provinces.style("fill", function (d, i) {
                                var t = linear(values[d.properties.name]);
                                var color = computeColor(t);
                                return color.toString();
                        });

                        var defs = svg.append("defs");
                        var linearGradient = defs.append("linearGradient")
                                .attr("id", "linearColor")
                                .attr("x1", "0%")
                                .attr("y1", "0%")
                                .attr("x2", "100%")
                                .attr("y2", "0%");
                        var stop1 = linearGradient.append("stop")
                                .attr("offset", "0%")
                                .style("stop-color", a.toString());
                        var stop2 = linearGradient.append("stop")
                                .attr("offset", "100%")
                                .style("stop-color", b.toString());
                        var colorRect = svg.append("rect")
                                .attr("x", 20)
                                .attr("y", 350)
                                .attr("width", 140)
                                .attr("height", 30)
                                .style("fill", "url(#" + linearGradient.attr("id") + ")");
                        var mintext = svg.append("text")
                                .attr("x", 20)
                                .attr("y", 395)
                                .text(minvalue);
                        var maxtext = svg.append("text")
                                .attr("x", 120)
                                .attr("y", 395)
                                .text(maxvalue);

                        //鼠标悬停事件
                        provinces.on("mouseover", function (d, i) {
                                d3.select(this).style("fill", "orange");
                        })
                                .on("mouseout", function (d, i) {
                                        d3.select(this).style("fill", function (d, i) {
                                                var t = linear(values[d.properties.name]);
                                                var color = computeColor(t);
                                                return color.toString();
                                        });
                                });


                });
                //获取平移量和缩放量
                var initTran = projection.translate();
                var initScale = projection.scale();
                var zoom = d3.behavior.zoom()
                        .scaleExtent([1, 10])
                        .on("zoom", function (d) {
                                //更新平移量
                                projection.translate([
                                        initTran[0] + d3.event.translate[0],
                                        initTran[1] + d3.event.translate[1]
                                ]);
                                //更新缩放量
                                projection.scale(initScale * d3.event.scale);
                                //重绘地图
                                provinces.attr("d", path);
                                //重绘经纬网络
                                gridPath.attr("d", path);
                        });
                svg.append("rect")
                        .attr("class", "overlay")
                        .attr("x", 0)
                        .attr("y", 0)
                        .attr("width", width)
                        .attr("height", height)
                        .attr("fill", "none")
                        .attr("pointer-events", "all")
                        .call(zoom);




        });






}

window.onload = draw;

