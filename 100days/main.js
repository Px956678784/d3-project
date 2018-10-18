var dataset = [4, 7, 9.9, 13.33, 11.68, 9, 8, 10.5, 10.5, 12, 5.88, 12, 9, 10.75, 11.17, 11, 10.5, 12.5, 11.67, 9.5, 12.33, 10.5, 12, 12.5, 9, 6, 8, 8.5, 10.83, 13.83, 14, 9.5, 8, 11, 12.5, 12.75, 10.5, 10.5, 9, 9.75, 12.17, 11.25, 8.5, 9, 9.83, 6.5, 8, 10, 9.5, 10.5, 11, 9.5, 8, 11, 11, 6, 11.28, 10.22, 11.33, 11.83, 9.5, 6.5, 7, 11, 9.5, 6.33, 9.33, 9, 6.67, 6.83, 7, 9.35, 9.33, 10, 6.5, 7, 9.5, 9.5, 9.83, 10.5, 10, 9, 9.17, 8, 10, 6.5, 5.83, 9, 6.5, 7, 7, 11.53, 10.83, 9.5, 9, 9, 5.5, 7, null, null, null]
var width = 600,
    height = 600,
    start = 0,
    end = 1.00,
    numSpirals = 3
margin = { top: 50, bottom: 50, left: 50, right: 50 };

var theta = function (r) {
    return numSpirals * Math.PI * r;
};

// used to assign nodes color by group

var color = ["#71cab0", "f5917b", "#f7cb8a", "#f2809b"];

var r = d3.min([width, height]) / 2 - 40;

var radius = d3.scaleLinear()
    .domain([start, end])
    .range([40, r]);

var svg = d3.select("#chart").append("svg")
    .attr("width", width + margin.right + margin.left)
    .attr("height", height + margin.left + margin.right)
    .append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

var points = d3.range(start, end + 0.001, (end - start) / 1000);

var spiral = d3.radialLine()
    .curve(d3.curveCardinal)
    .angle(theta)
    .radius(radius);

var path = svg.append("path")
    .datum(points)
    .attr("id", "spiral")
    .attr("d", spiral)
    .style("fill", "none")
    .style("stroke", "steelblue");

var spiralLength = path.node().getTotalLength(),
    N = 100,
    barWidth = (spiralLength / N) - 1;
d3.json("100days.json", function (error, root) {
    if (error)
        console.log(error);
    var attr1 = "date";
    var attr2 = "group";
    var attr3 = "time";
    var minv = d3.min(root, function (d) { return d.value; });
    var maxv = d3.max(root, function (d) { return d.value; });
    var did = maxv - minv;
    for (var i = 0; i < N; i++) {
        root[i][attr3] = root[i].value;//储存时间
        root[i].value = (root[i].value - minv) / did;//归一化处理
        var loveDate = new Date();//生成日期
        loveDate.setFullYear(2018, 6, 12);
        loveDate.setDate(loveDate.getDate() + i);
        root[i][attr1] = loveDate;
        root[i][attr2] = loveDate.getMonth();
    }
    var someData = root;
    var timeScale = d3.scaleTime()
        .domain(d3.extent(someData, function (d) {
            return d.date;
        }))
        .range([0, spiralLength]);

    // yScale for the bar height
    var yScale = d3.scaleLinear()
        .domain([0, d3.max(someData, function (d) {
            return d.value;
        })])
        .range([0, (r / numSpirals) - 30]);

    svg.selectAll("rect")
        .data(someData)
        .enter()
        .append("rect")
        .attr("x", function (d, i) {

            var linePer = timeScale(d.date),
                posOnLine = path.node().getPointAtLength(linePer),
                angleOnLine = path.node().getPointAtLength(linePer - barWidth);

            d.linePer = linePer; // % distance are on the spiral
            d.x = posOnLine.x; // x postion on the spiral
            d.y = posOnLine.y; // y position on the spiral

            d.a = (Math.atan2(angleOnLine.y, angleOnLine.x) * 180 / Math.PI) - 90; //angle at the spiral position

            return d.x;
        })
        .attr("y", function (d) {
            return d.y + d.start * 7;
        })
        .attr("width", function (d) {
            return barWidth;
        })
        .attr("height", function (d) {
            return yScale(d.value);
        })
        .style("fill", function (d, i) { return color[d.group - 6]; })
        .style("stroke", "none")
        .attr("transform", function (d) {
            return "rotate(" + d.a + "," + d.x + "," + d.y + ")"; // rotate the bar
        });


    // add date labels
    var tF = d3.timeFormat("%b %Y"),
        firstInMonth = {};

    svg.selectAll("text")
        .data(someData)
        .enter()
        .append("text")
        .attr("dy", 20)
        .style("text-anchor", "start")
        .style("font", "20px arial")
        .append("textPath")
        // only add for the first of each month
        .filter(function (d) {
            var sd = tF(d.date);
            if (!firstInMonth[sd]) {
                firstInMonth[sd] = 1;
                return true;
            }
            return false;
        })
        .text(function (d) {
            return tF(d.date);
        })
        // place text along spiral
        .attr("xlink:href", "#spiral")
        .style("fill", "grey")
        .attr("startOffset", function (d) {
            return ((d.linePer / spiralLength) * 100) + "%";
        })


    var tooltip = d3.select("#chart")
        .append('div')
        .attr('class', 'tooltip');

    tooltip.append('div')
        .attr('class', 'date');
    tooltip.append('div')
        .attr('class', 'time');
    tooltip.append('div')
        .attr('class', 'sleep');

    svg.selectAll("rect")
        .on('mouseover', function (d) {

            tooltip.select('.date').html("日期: <b>" + d.date.toDateString() + "</b>");
            tooltip.select('.time').html("睡眠时长: <b>" + Math.round(d.time * 100) / 100 + "<b>");
            tooltip.select('.sleep').html("睡觉时间: <b>" + d.sleep + "<b>");

            d3.select(this)
                .style("fill", "#FFFFFF")
                .style("stroke", "#000000")
                .style("stroke-width", "2px");

            tooltip.style('display', 'block');
            tooltip.style('opacity', 2);

        })
        .on('mousemove', function (d) {
            tooltip.style('top', (d3.event.layerY + 10) + 'px')
                .style('left', (d3.event.layerX - 25) + 'px');
        })
        .on('mouseout', function (d) {
            d3.selectAll("rect")
                .style("fill", function (d) { return color[d.group - 6]; })
                .style("stroke", "none")

            tooltip.style('display', 'none');
            tooltip.style('opacity', 0);
        });
});