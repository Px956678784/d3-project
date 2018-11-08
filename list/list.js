function myfun(){
    //升序和降序
    var numbers = [10,1,9,8,6,2];
    numbers.sort(d3.descending);
    console.log(numbers);
    numbers.sort(d3.ascending);
    console.log(numbers);

    //求值,可求min,max,extent:返回同时包含最大值和最小值的数组
    var min = d3.min(numbers,function(d){return d*3;});
    console.log(min);

    //sum求和，mean求平均（去除unfined等无效值），median求中位数，quantile求P分位点的值
    //variance求方差，deviation求标准差
    console.log(d3.quantile(numbers,0.5));
    
    //插入与相对位置
    var animals =["dog","cat","bird","fish"];
    animals.splice(3,1,"elephant","dear");//在第三个元素后删除一个元素插入
    console.log(animals);
    var ileft = d3.bisectLeft(numbers.sort(d3.ascending),9);//返回这个元素或者比这个数字大的第一个元素左边的下标
    console.log(ileft);

    //洗牌
    d3.shuffle(numbers);
    console.log(numbers);
    
    //合并
    console.log(d3.merge([[1],[2,3]]));

    //邻接数组对
    console.log(d3.pairs(numbers));
    
    //等差数列
    var a = d3.range(2,10,2);
    console.log(a);

    //重新排列
    console.log(d3.permute(animals,[4,2,3,1,0]))

    //压缩与矩阵转置
    var a = [10,20,5];
    var b = [-5,10,3];
    var ab = d3.sum(d3.zip(a,b), function(d){return d[0]*d[1];});
    console.log(ab); 
    console.log(d3.transpose([a,b]));

};
window.onload = myfun;
