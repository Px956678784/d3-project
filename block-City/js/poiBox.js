function poiControl() {
    d3.json("js/json/poiClass.json", function (pois) {
        d3.select("#poiBox").selectAll("div")
            .data(pois)
            .enter()
            .append("div")
            .attr("class", "poi")
            .text(function (d) { return d.name; })
            .on("mouseover", function (d) {
                if (d3.select(this).classed('click-active') == false)
                    d3.select(this).style("border", "2px solid orange")
                        .style("background-color", "black");
            })
            .on("mouseout", function (d) {
                if (d3.select(this).classed('click-active') == false)
                    d3.select(this).style("border", "2px solid rgb(110, 173, 202)")
                        .style("background-color", "#111925");
            })
            .on("click", function (d) {
                var selectdiv = d3.select(this)
                    .classed('click-active', function (d) {
                        // toggle state
                        return !d3.select(this).classed('click-active');
                    });
                if (selectdiv.classed('click-active') == true) {
                    selectdiv.style("background-color", function (d) { return d.color; });
                    selectdiv.style("color", "black");
                    chosenPoi.push(d.name);
                    piechart();
                }
                else {
                    selectdiv.style("background-color", "#111925");
                    selectdiv.style("color", "white");
                    chosenPoi.splice(chosenPoi.indexOf(d.name), 1);
                }
                wordCloud();
                REDRAWMAP();
            });

    });
}