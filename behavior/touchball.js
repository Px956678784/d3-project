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
                .attr("r", 50)
                .attr("fill", "steelblue")
                .on("touchstart", function () {
                        d3.select(this).attr("fill", "orange");
                })
                .on("touchmove", function () {
                        var pos = d3.touches(this)[0];
                        d3.select(this)
                                .attr("cx", pos[0])
                                .attr("cy", pos[1]);
                })
                .on("touchend", function () {
                        d3.select(this).attr("fill", "steelblue");
                });

}

window.onload = roll;

