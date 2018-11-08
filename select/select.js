function myfun(){
    //datum统一绑定数据及索引值得变化
    var content = d3.select("body")
                    .select("#home")
                    .selectAll("p")
    content.datum("Tunder").append("span").text(function(d,i){
        return d + " " + i
    })
    content.style('color','red')
    content.style('font-size','72px')
    //svg画图
    var width = 400;
    var length = 400;
    var svg = d3.select("body")
                .append("svg")
                .attr("width",width)
                .attr("length",length);
    svg.append("circle")
        .attr("cx",50)
        .attr("cy",50)
        .attr("r",50)
        .attr("fill","blue");
    //data绑定及绑定顺序
    var cage = d3.select("body")
                 .select("#zoo")
                .selectAll("p");
                
    var dataset = [{id: 3, name:"脑腐"},
                    {id: 6, name:"尼玛"},
                    {id: 9, name:"丝子"}];

    cage.data(dataset)
        .text(function(d){
            return d.id +" : "+ d.name;
        });
    dataset = [{id: 6, name:"脑腐"},
                {id: 3, name:"尼玛"},
                {id: 9, name:"丝子"}];

    cage.data(dataset, function(d){
        return d.id;}).text(function(d){
                return d.id +" : "+ d.name;
        });
    //enter和exit的用法
    var woods = d3.select("body")
                    .select("#forest")
                    .selectAll("p");
    var trees = ["squarral","bird","fox"];
    var update = woods.data(trees);
    var enter = update.enter();
    update.text(function(d){return d;});
    enter.append("p").text(function(d){return d});//也可以直接写成woods.data(trees).enter().append("p").text(function(d){retrun d;});
    var glass = d3.select("body")
                    .select("#ocean")
                    .selectAll("p");
    var water = ["shramp"];
    var update = glass.data(water);
    var exit = update.exit();
    update.text(function(d){return d;});
    exit.remove();

    //模板
    var dataset = [3,2,1,4,5];
    var p = d3.select("body").selectAll("p");
    var update = p.data(dataset);
    var enter = update.enter();
    var exit = update.exit();
    update.text(function(d){return d;});
    enter.append("p").text(function(d){return d;});
    exit.remove();

    //筛选器
    var larger = d3.select("body").selectAll("p").filter(function(d,i){
        if(d>3)
            return true;
        else
            return false;
    });
    console.log(larger);
    //排序
    var query = d3.select("body").selectAll("p").sort(function(a,b){
        return b-a;
    });
    console.log(query);
        
};
window.onload = myfun;
