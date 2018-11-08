var dataset = [[[100, 200], [100, 300], [300, 200], [200, 100]]
];
function roll() {
        var t0 = Date.now();
        var t1 = Date.now();
        var dt = t1 - t0;
        var svg = d3.select("body")
                .select("svg");
        var ball = svg.append("circle")
                .attr("cx", 100)
                .attr("cy", 100)
                .attr("r", 10)
                .attr("fill", "steelblue");
        var i = 0;
        function update() {
                t1 = Date.now();
                dt = (t1 - t0) * 0.001;
                var updateball = svg.select("circle").data(dataset);
                updateball
                        .attr("cx", function (d) { return d[i][0]; })
                        .attr("cy", function (d) { return d[i][1]; });
                t0 = t1;
                i = (i + 1) % 4;

        }
        d3.timer(update);

}

window.onload = roll;

