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

        //创建力引导布局
        var force = d3.layout.force()
                .size([width, height]);
        //请求topojson
        d3.json("Chengdu.topojson", function (error, toporoot) {
                if (error)
                        return console.error(error);
                var georoot = topojson.feature(toporoot, toporoot.objects.chengdu);

                //计算节点数组和连线数组
                var nodes = [];
                georoot.features.forEach(function (d, i) {
                        //计算中心坐标
                        var centroid = path.centroid(d);
                        centroid.x = centroid[0];
                        centroid.y = centroid[1];
                        //保存地理特征
                        centroid.feature = d;
                        centroid.name = d.properties.name;
                        nodes.push(centroid);
                });
                var voronoi = d3.geom.voronoi()
                        .x(function (d) {
                                return d.x;
                        })
                        .y(function (d) {
                                return d.y;
                        });
                var links = voronoi.links(nodes);
                //设定力导向布局
                force.gravity(0)
                        .charge(0)
                        .linkDistance(function (d) {
                                var dx = d.source.x - d.target.x;
                                var dy = d.source.y - d.target.y;
                                return Math.sqrt(dx * dx + dy * dy);
                        })
                        .nodes(nodes)
                        .links(links)
                        .start();
                //开始绘制
                var nodeGroups = svg.selectAll("g")
                        .data(nodes)
                        .enter()
                        .append("g")
                        .attr("transform", function (d) {
                                return "translate(" + -d.x + "," + -d.y + ")";
                        })
                        .call(force.drag)//调用拖拽行为
                        .append("path")
                        .attr("transform", function (d) {
                                return "translate(" + d.x + "," + d.y + ")";
                        })
                        .attr("class", "province")
                        .attr("stroke", "white")
                        .attr("stroke-width", 1)
                        .attr("fill", "#ccc")
                        .attr("d", function (d) {
                                return path(d.feature);//使用路径生成器
                        });
                var lines = svg.selectAll("line")
                        .data(links)
                        .enter()
                        .append("line")
                        .attr("class", "link")
                        .attr("x1", function (d) { return d.source.x; })
                        .attr("y1", function (d) { return d.source.y; })
                        .attr("x2", function (d) { return d.target.x; })
                        .attr("y2", function (d) { return d.target.y; })
                        .attr("stroke", "black");

                force.on("tick", function () {
                        //更新连线
                        lines.attr("x1", function (d) { return d.source.x; })
                                .attr("y1", function (d) { return d.source.y; })
                                .attr("x2", function (d) { return d.target.x; })
                                .attr("y2", function (d) { return d.target.y; })
                        //更新节点
                        nodeGroups.attr("transform", function (d) {
                                return "translate(" + d.x + "," + d.y + ")";
                        });
                });

                d3.json("tourism.json", function (error, valuedata) {
                        //将各省的tourism数据读取
                        var provinces = svg.selectAll(".province");
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
                                var t = linear(values[nodes[i].name]);
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


                });



        });
        //添加边(方法一)
        // var edges = [];
        // function edge(a, b) {
        //         return {
        //                 source: a,
        //                 target: b
        //         };
        // }
        // polygons.forEach(function (d, i) {
        //         for (var i = 0; i < d.length; i++) {
        //                 if (i !== d.length - 1)
        //                         edges.push(edge(d[i], d[i + 1]));
        //                 else
        //                         edges.push(edge(d[i], d[0]));


        //         }
        // });
        //转换为三角形（方法二）











}

window.onload = draw;

