var dataset = [
        {
                country: "china",
                gdp: [[2000, 11920], [2001, 13170], [2002, 14550], [2003, 16500],
                [2004, 19440], [2005, 22870], [2006, 27930], [2007, 35040], [2008, 45470],
                [2009, 51050], [2010, 59490], [2011, 73140], [2012, 83860], [2013, 103550]]
        },
        {
                country: "japan",
                gdp: [[2000, 47310], [2001, 41590], [2002, 39800], [2003, 43020],
                [2004, 46550], [2005, 45710], [2006, 43560], [2007, 43560], [2008, 48490],
                [2009, 50350], [2010, 54950], [2011, 59050], [2012, 59370], [2013, 48980]]
        }]

function draw() {
        var width = 400;
        var height = 400;
        var svg = d3.select("body")
                .select("svg")
        var padding = { top: 50, right: 50, bottom: 50, left: 50 };
        //设置比例尺
        var gchart = svg.select("#gchart");
        var gdpmax = 0;
        for (var i = 0; i < dataset.length; i++) {
                var currgdp = d3.max(dataset[i].gdp, function (d) {
                        return d[1];
                });
                if (currgdp > gdpmax)
                        gdpmax = currgdp;
        }
        var xscale = d3.scale.linear()
                .domain([2000, 2013])
                .range([0, width - padding.left - padding.right]);
        var yscale = d3.scale.linear()
                .domain([0, gdpmax * 1.1])
                .range([height - padding.top - padding.bottom, 0]);
        //直线生成器
        var linepath = d3.svg.line()
                .x(function (d) { return xscale(d[0]); })
                .y(function (d) { return yscale(d[1]); })
                .interpolate("basis");

        var colors = ["#f27e91", "#7ecef4"];
        gchart.selectAll("path")
                .data(dataset)
                .enter()
                .append("path")
                .attr("transform", "translate(" + padding.left + "," + padding.top + ")")
                .attr("d", function (d) {
                        return linepath(d.gdp);
                })
                .attr("fill", "none")
                .attr("stroke-width", 3)
                .attr("stroke", function (d, i) { return colors[i]; });

        //坐标轴
        var xaxis = d3.svg.axis()
                .scale(xscale)
                .ticks(5)
                .tickFormat(d3.format("d"))
                .orient("bottom");
        var yaxis = d3.svg.axis()
                .scale(yscale)
                .orient("left");
        gxaxis = svg.select("#xAxis");
        gxaxis.attr("transform", "translate(" + padding.left + "," + (height - padding.bottom) + ")")
                .call(xaxis);
        gyaxis = svg.select("#yAxis");
        gyaxis.attr("transform", "translate(" + padding.left + "," + padding.top + ")")
                .call(yaxis);

        //标签
        glabel = svg.select("#label")
        glabel.selectAll("rect")
                .data(dataset)
                .enter()
                .append("rect")
                .attr("transform", function (d, i) {
                        return "translate(" + (width - padding.right + 10) + "," + (padding.top + i * 15) + ")";
                })
                .attr("width", 10)
                .attr("height", 10)
                .attr("fill", function (d, i) { return colors[i]; });
        glabel.selectAll("text")
                .data(dataset)
                .enter()
                .append("text")
                .attr("transform", function (d, i) {
                        return "translate(" + (width - padding.right + 22) + "," + (padding.top + 7 + i * 15) + ")";
                })
                .attr("font-size", "10")
                .text(function (d) { return d.country });
}

window.onload = draw;

