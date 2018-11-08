
function getTimeString() {
        var time = new Date();
        var hours = time.getHours();
        var minutes = time.getMinutes();
        var seconds = time.getSeconds();
        hours = hours < 10 ? "0" + hours : hours;
        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;
        return hours + ":" + minutes + ":" + seconds;
}

function clock() {
        var svg = d3.select("body")
                .select("svg");
        var timetext = svg.append("text")
                .attr("x", 100)
                .attr("y", 100)
                .attr("class", "time")
                .text(getTimeString());
        function updatetime() {
                timetext.text(getTimeString());
        }
        setInterval(updatetime, 1000);



}

window.onload = clock;

