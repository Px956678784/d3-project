var continent = ["亚洲", "欧洲", "非洲", "美洲", "大洋洲"];
var population = [
        [9000, 870, 3000, 1000, 5200],
        [3400, 8000, 2300, 4922, 374],
        [2000, 2000, 7700, 4881, 1050],
        [3000, 8012, 5531, 500, 400],
        [3540, 4310, 1500, 1900, 300]];

function draw() {
        var width = 400;
        var height = 400;
        var svg = d3.select("body")
                .select("svg")
        var padding = { top: 20, right: 20, bottom: 20, left: 20 };
        //创建布局
        var chord = d3.layout.chord()
                .padding(0.03)
                .sortSubgroups(d3.ascending)
                .matrix(population);
        //生成g便于画图
        var gChord = svg.append("g")
                .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
        var gOuter = gChord.append("g");
        var gInner = gChord.append("g");
        var color20 = d3.scale.category20();
        var innerRadius = width / 2 * 0.7;
        var outerRadius = innerRadius * 1.1;
        var arcOuter = d3.svg.arc()
                .innerRadius(innerRadius)
                .outerRadius(outerRadius);
        //绘制外面的节点
        gOuter.selectAll(".outerPath")
                .data(chord.groups())
                .enter()
                .append("path")
                .attr("class", "outerPath")
                .attr("d", arcOuter)
                .attr("fill", function (d) { return color20(d.index); });
        gOuter.selectAll(".outerText")
                .data(chord.groups)
        //外面节点的名称
        gOuter.selectAll(".outerText")
                .data(chord.groups())
                .enter()
                .append("text")
                .each(function (d, i) {
                        d.angle = (d.startAngle + d.endAngle) / 2;
                        d.name = continent[i];
                })
                .attr("class", "outerText")
                .attr("dy", ".35em")
                .attr("transform", function (d) {
                        var result = "rotate(" + (d.angle * 180 / Math.PI) + ")";
                        result += "translate(0," + -1.0 * (outerRadius + 10) + ")";
                        if (d.angle > Math.PI * 3 / 4 && d.angle < Math.PI * 5 / 4)
                                result += "rotate(180)";
                        return result;
                })
                .text(function (d) { return d.name; });
        //内部的弦
        var arcInner = d3.svg.chord()
                .radius(innerRadius);
        gInner.selectAll(".innerPath")
                .data(chord.chords())
                .enter()
                .append("path")
                .attr("class", "innerPath")
                .attr("d", arcInner)
                .attr("fill", function (d) {
                        return color20(d.source.index);
                });
        //添加点击事件
        gOuter.selectAll(".outerPath")
                .on("mouseover", fade(0.0))
                .on("mouseout", fade(1.0));
        function fade(opacity) {
                return function (g, i) {
                        gInner.selectAll(".innerPath")
                                .filter(function (d) {
                                        return d.source.index != i && d.target.index != i;
                                })
                                .transition()
                                .style("opacity", opacity);
                }
        }
}
window.onload = draw;

