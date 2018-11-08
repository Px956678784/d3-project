function draw() {
    var width = 800;
    var height = 800;
    var svg = d3.select("body")
        .select("svg")
    var padding = { top: 30, right: 30, bottom: 30, left: 30 };
    //随机生成正态分布的数据
    var rand = d3.random.normal(170, 10);
    var dataset = [];
    for (var i = 0; i < 100; i++) {
        dataset.push(rand());
    }
    var binNum = 20,
        rangeMin = 130,
        rangeMax = 210;

    //创建布局
    var histogram = d3.layout.histogram()
        .range([rangeMin, rangeMax])
        .bins(binNum)
        .frequency(true);
    var hisData = histogram(dataset)
    console.log(hisData);
    //坐标轴
    var xAxisWidth = 700;
    xTicks = hisData.map(function (d) { return d.x; });
    var xScale = d3.scale.ordinal()
        .domain(xTicks)
        .rangeRoundBands([0, xAxisWidth], 0.1);
    var xAxis = d3.svg.axis()
        .scale(xScale)
        .orient("bottom")
        .tickFormat(d3.format(".0f"));
    svg.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(" + padding.left + "," + (height - padding.bottom) + ")")
        .call(xAxis);
    var yAxisWidth = 700;
    var yScale = d3.scale.linear()
        .domain([d3.min(hisData, function (d) { return d.y; }),
        d3.max(hisData, function (d) { return d.y; })]);
    var byscale = yScale.range([yAxisWidth, 5]);
    var yAxis = d3.svg.axis()
        .scale(byscale)
        .orient("left")
        .tickFormat(d3.format(".0f"));
    svg.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(" + padding.left + "," + (padding.top + padding.bottom + 10) + ")")
        .call(yAxis);
    yScale.range([5, yAxisWidth]);
    //绘制矩形
    var gRect = svg.append("g")
        .attr("transform", "translate(" + padding.left + "," + (-padding.bottom) + ")");
    gRect.selectAll("rect")
        .data(hisData)
        .enter()
        .append("rect")
        .attr("class", "rect")
        .attr("x", function (d) {
            return xScale(d.x);
        })
        .attr("y", function (d) {
            return height - yScale(d.y);
        })
        .attr("width", function (d, i) {
            return xScale.rangeBand();
        })
        .attr("height", function (d) {
            return yScale(d.y);
        })
        .style("fill", "steelblue");



}
window.onload = draw;