function piechart() {
    d3.select('#piechart').selectAll('svg').remove();
    d3.json("js/json/poiPieChart.json", function (data) {
        var sunburst = d2b.chartSunburst();
        sunburst.chartFrame().size({ height: 350 });
        sunburst.chartFrame().breadcrumbsEnabled(false);
        sunburst.label(function (d) { return d.name; })
            .color(function (d) { return d.color })
        sunburst.tooltip().html(function (d) {
            var percent;
            if (d.parent && d.parent.parent) {
                percent = d.data.value * 100 / d.parent.data.value;
            }
            else
                percent = d.value;
            return (d.data.name + '：' + d.data.value + '(' + percent.toFixed(2) + '%)');
        })
        var chart = d3.select('#piechart');
        if (chosenPoi.length) {
            for (i in data) {
                if (data[i].name == chosenPoi[chosenPoi.length - 1]) {
                    chart
                        .datum(data[i])
                        .call(sunburst);
                }
            }
        }

    });
}

function AreaPieChart() {
    d3.select('#piechart').selectAll('svg').remove();
    d3.json("js/json/sunburst/" + TIME + "nodes.json", function (data) {
        var sunburst = d2b.chartSunburst();
        sunburst.chartFrame().size({ height: 350 });
        sunburst.chartFrame().breadcrumbsEnabled(false);
        sunburst.label(function (d) { return d.name; })
            .color(function (d) { return d.color });
        var chart = d3.select('#piechart');
        for (i in data) {
            if (data[i].name == chosenArea[chosenArea.length - 1]) {

                chart
                    .datum(data[i])
                    .call(sunburst);
            }
        }

    });

    //添加饼图
    var svg = d3.select('#piechart').select('svg').append("g")
        .attr("transform", "translate(138,165)");
    var color = ['#c7a7ab', '#c99b80', '#a0816a', '#eab456', '#e4c587', '#caa365', '#897b59', '#c04a3a', '#862b2c', '#332b2b', '#264442', '#61837c', '#7ca1a9', '#5190aa'];
    var arc = d3.arc()
        .outerRadius(64)
        .innerRadius(50);

    // defines wedge size
    var pie = d3.pie()
        .sort(null)
        .value(function (d) { return d.ratio; });

    d3.json("js/json/districtPoi.json", function (data) {
        for (i in data) {
            if (data[i].district == chosenArea[chosenArea.length - 1]) {
                chosendata = data[i].children;
            }
        }
        var g = svg.selectAll(".arc")
            .data(pie(chosendata))
            .enter().append("g")
            .attr("class", "arc");
        g.append("path")
            .attr("d", arc)
            .style("fill", function (d, i) { return color[i] })
            .style("stroke", "white");
        var tooltip = d3.select("body").append("div")
            .attr("class", "tooltip");
        g.selectAll("path").on("mouseover", function (d) {

            var tooltip_str = d.data.name + '：' + d.data.value + '(' + (d.data.ratio * 100).toFixed(2) + '%)';
            tooltip.html(tooltip_str)
                .style("visibility", "visible");
        }).on("mousemove", function (d) {
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
            })


    });

}