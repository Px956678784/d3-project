function draw() {
        var lines = [80, 120, 130, 70, 60, 90];
        var width = 400;
        var height = 400;
        var svg = d3.select("body")
                .select("svg");

        //线段生成器
        // var linepath = d3.svg.line()
        //         .x(function (d) { return d; })
        //         .y(function (d, i) { return i % 2 == 0 ? 40 : 120; })
        //         .interpolate("basis");
        // svg.append("path")
        //         .attr("d", linepath(lines))
        //         .attr("stroke", "black")
        //         .attr("stroke-width", "3px")
        //         .attr("fill", "none");

        // //区域生成器
        // var areapath = d3.svg.area()
        //         .x(function (d, i) { return 50 * i + 80; })
        //         .y0(function (d, i) { return height / 2; })
        //         .y1(function (d, i) { return height / 2 - d; })
        //         .interpolate("basis");
        // svg.append("path")
        //         .attr("d", areapath(lines))
        //         .attr("stroke", "black")
        //         .attr("stroke-width", "3px")
        //         .attr("fill", "steelblue");

        //弧生成器
        // var dataset = [{ startAngle: 0, endAngle: Math.PI * 0.5 },
        // { startAngle: Math.PI * 0.5, endAngle: Math.PI * 1 },
        // { startAngle: Math.PI * 1, endAngle: Math.PI * 2 }]
        // var arcpath = d3.svg.arc()
        //         .innerRadius(0)
        //         .outerRadius(100);
        // var color = d3.scale.category10();
        // svg.selectAll("path")
        //         .data(dataset)
        //         .enter()
        //         .append("path")
        //         .attr("d", function (d) { return arcpath(d); })
        //         .attr("transform", "translate(250,250)")
        //         .attr("stroke", "black")
        //         .attr("stroke-width", "3px")
        //         .attr("fill", function (d, i) { return color(i); });

        // svg.selectAll("text")
        //         .data(dataset)
        //         .enter()
        //         .append("text")
        //         .attr("transform", function (d) { return "translate(250,250)" + "translate(" + arcpath.centroid(d) + ")"; })
        //         .attr("text-anchor", "middle")
        //         .attr("fill", "white")
        //         .attr("font-size", "18px")
        //         .text(function (d) {
        //                 return Math.floor((d.endAngle - d.startAngle) * 180 / Math.PI) + "°";
        //         });

        // //弦生成器
        // var arcdata = {
        //         startArc: {
        //                 start: 0.2,
        //                 end: Math.PI * 0.3,
        //                 radius: 100
        //         },
        //         endArc: {
        //                 start: Math.PI * 1.0,
        //                 end: Math.PI * 1.6,
        //                 radius: 100
        //         }
        // };
        // var chord = d3.svg.chord()
        //         .source(function (d) { return d.startArc; })
        //         .target(function (d) { return d.endArc; })
        //         .radius(200)
        //         .startAngle(function (d) { return d.start; })
        //         .endAngle(function (d) { return d.end; });
        // svg.append("path")
        //         .attr("d", chord(arcdata))
        //         .attr("transform", "translate(200,200)")
        //         .attr("fill", "yellow")
        //         .attr("stroke", "black")
        //         .attr("stroke-width", 3);

        // //对角线生成器
        var dataset = {
                source: { x: 100, y: 100 },
                target: { x: 300, y: 200 }
        };
        var diagonal = d3.svg.diagonal();
        svg.append("path")
                .attr("d", diagonal(dataset))
                .attr("fill", "none")
                .attr("stroke", "black")
                .attr("stroke-width", 3);
}
window.onload = draw;
