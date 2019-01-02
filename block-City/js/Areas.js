var REDRAWMAP, REDRAWPOI, REDRAWBUMP, ZOOM, TIME = 6, chosenArea = [], chosenPoi = [];
function drawAreas() {
    var doc = document;
    var _wheelData = -1;
    var mainBox = doc.getElementById('mainBox');
    function bind(obj, type, handler) {
        var node = typeof obj == "string" ? $(obj) : obj;
        if (node.addEventListener) {
            node.addEventListener(type, handler, false);
        } else if (node.attachEvent) {
            node.attachEvent('on' + type, handler);
        } else {
            node['on' + type] = handler;
        }
    }
    function mouseWheel(obj, handler) {
        var node = typeof obj == "string" ? $(obj) : obj;
        bind(node, 'mousewheel', function (event) {
            var data = -getWheelData(event);
            handler(data);
            if (document.all) {
                window.event.returnValue = false;
            } else {
                event.preventDefault();
            }
        });
        //火狐
        bind(node, 'DOMMouseScroll', function (event) {
            var data = getWheelData(event);
            handler(data);
            event.preventDefault();
        });
        function getWheelData(event) {
            var e = event || window.event;
            return e.wheelDelta ? e.wheelDelta : e.detail * 40;
        }
    }
    function addScroll() {
        this.init.apply(this, arguments);
    }
    addScroll.prototype = {
        init: function (mainBox, contentBox, className) {
            var mainBox = doc.getElementById(mainBox);
            var contentBox = doc.getElementById(contentBox);
            var scrollDiv = this._createScroll(mainBox, className);
            this._resizeScorll(scrollDiv, mainBox, contentBox);
            this._tragScroll(scrollDiv, mainBox, contentBox);
            this._wheelChange(scrollDiv, mainBox, contentBox);
            this._clickScroll(scrollDiv, mainBox, contentBox);
        },
        //创建滚动条
        _createScroll: function (mainBox, className) {
            var _scrollBox = doc.createElement('div')
            var _scroll = doc.createElement('div');
            var span = doc.createElement('span');
            _scrollBox.appendChild(_scroll);
            _scroll.appendChild(span);
            _scroll.className = className;
            mainBox.appendChild(_scrollBox);
            return _scroll;
        },
        //调整滚动条
        _resizeScorll: function (element, mainBox, contentBox) {
            var p = element.parentNode;
            var conHeight = contentBox.offsetHeight;
            var _width = mainBox.clientWidth;
            var _height = mainBox.clientHeight;
            var _scrollWidth = element.offsetWidth;
            var _left = _width - _scrollWidth;
            p.style.width = _scrollWidth + "px";
            p.style.height = _height + "px";
            p.style.left = _left + "px";
            p.style.position = "absolute";
            p.style.background = "#ccc";
            contentBox.style.width = (mainBox.offsetWidth - _scrollWidth) + "px";
            var _scrollHeight = parseInt(_height * (_height / conHeight));
            if (_scrollHeight >= mainBox.clientHeight) {
                element.parentNode.style.display = "none";
            }
            element.style.height = _scrollHeight + "px";
        },
        //拖动滚动条
        _tragScroll: function (element, mainBox, contentBox) {
            var mainHeight = mainBox.clientHeight;
            element.onmousedown = function (event) {
                var _this = this;
                var _scrollTop = element.offsetTop;
                var e = event || window.event;
                var top = e.clientY;
                //this.onmousemove=scrollGo;
                document.onmousemove = scrollGo;
                document.onmouseup = function (event) {
                    this.onmousemove = null;
                }
                function scrollGo(event) {
                    var e = event || window.event;
                    var _top = e.clientY;
                    var _t = _top - top + _scrollTop;
                    if (_t > (mainHeight - element.offsetHeight)) {
                        _t = mainHeight - element.offsetHeight;
                    }
                    if (_t <= 0) {
                        _t = 0;
                    }
                    element.style.top = _t + "px";
                    contentBox.style.top = -_t * (contentBox.offsetHeight / mainBox.offsetHeight) + "px";
                    _wheelData = _t;
                }
            }
            element.onmouseover = function () {
                this.style.background = "#444";
            }
            element.onmouseout = function () {
                this.style.background = "#666";
            }
        },
        //鼠标滚轮滚动，滚动条滚动
        _wheelChange: function (element, mainBox, contentBox) {
            var node = typeof mainBox == "string" ? $(mainBox) : mainBox;
            var flag = 0, rate = 0, wheelFlag = 0;
            if (node) {
                mouseWheel(node, function (data) {
                    wheelFlag += data;
                    if (_wheelData >= 0) {
                        flag = _wheelData;
                        element.style.top = flag + "px";
                        wheelFlag = _wheelData * 12;
                        _wheelData = -1;
                    } else {
                        flag = wheelFlag / 12;
                    }
                    if (flag <= 0) {
                        flag = 0;
                        wheelFlag = 0;
                    }
                    if (flag >= (mainBox.offsetHeight - element.offsetHeight)) {
                        flag = (mainBox.clientHeight - element.offsetHeight);
                        wheelFlag = (mainBox.clientHeight - element.offsetHeight) * 12;
                    }
                    element.style.top = flag + "px";
                    contentBox.style.top = -flag * (contentBox.offsetHeight / mainBox.offsetHeight) + "px";
                });
            }
        },
        _clickScroll: function (element, mainBox, contentBox) {
            var p = element.parentNode;
            p.onclick = function (event) {
                var e = event || window.event;
                var t = e.target || e.srcElement;
                var sTop = document.documentElement.scrollTop > 0 ? document.documentElement.scrollTop : document.body.scrollTop;
                var top = mainBox.offsetTop;
                var _top = e.clientY + sTop - top - element.offsetHeight / 2;
                if (_top <= 0) {
                    _top = 0;
                }
                if (_top >= (mainBox.clientHeight - element.offsetHeight)) {
                    _top = mainBox.clientHeight - element.offsetHeight;
                }
                if (t != element) {
                    element.style.top = _top + "px";
                    contentBox.style.top = -_top * (contentBox.offsetHeight / mainBox.offsetHeight) + "px";
                    _wheelData = _top;
                }
            }
        }
    }
    new addScroll('mainBox', 'content', 'scrollDiv');

    d3.json("js/json/areas.json", function (areas) {
        d3.select("#content").selectAll("div")
            .data(areas)
            .enter()
            .append("div")
            .on("click", function (d) {
                var selectdiv = d3.select(this)
                    .classed('click-active', function (d) {
                        // toggle state
                        return !d3.select(this).classed('click-active');
                    });
                if (selectdiv.classed('click-active') == true) {
                    selectdiv.style("background-color", function (d) { return d.color; });
                    selectdiv.select("p").style("color", "black");
                    chosenArea.push(d.name);
                }
                else {
                    selectdiv.style("background-color", "#111925");
                    selectdiv.select("p").style("color", "white");
                    chosenArea.splice(chosenArea.indexOf(d.name), 1);
                }
                REDRAWMAP();
                REDRAWBUMP();
                AreaPieChart();
                wordCloud();
            })
            .on("mouseover", function (d) {
                if (d3.select(this).classed('click-active') == false)
                    d3.select(this).style("border", "1px solid rgb(110, 173, 202)")
                        .style("background-color", "black");
            })
            .on("mouseout", function (d) {
                if (d3.select(this).classed('click-active') == false)
                    d3.select(this).style("border", "none")
                        .style("background-color", "#111925");
            })
            .append("p")
            .attr("class", "areaName")
            .text(function (d) { return d.name; });

    });
    drawmap();
    drawbump();
    poiControl();
    drawsample();
}
function drawsample() {
    var svg = d3.select('#samplebox').append('svg').attr("height", 60).attr("width", 360);
    var padding = { top: 10, bottom: 10, left: 10, right: 10 }
    d3.json("js/json/areas.json", function (areas) {
        svg.selectAll('circle')
            .data(areas)
            .enter()
            .append('circle')
            .attr('cx', function (d, i) {
                return padding.left + 60 * (i % 6);
            })
            .attr('cy', function (d, i) {
                return i < 6 ? 20 : 44;
            })
            .attr('r', 6)
            .attr('stroke', 'white')
            .attr('stroke-width', 1)
            .style('fill', function (d) { return d.color; });
        svg.selectAll('text')
            .data(areas)
            .enter()
            .append('text')
            .attr('x', function (d, i) {
                return padding.left + 10 + 60 * (i % 6);
            })
            .attr('y', function (d, i) {
                return i < 6 ? 24 : 48;
            })
            .text(function (d) { return d.name; })
            .style('font-size', '10')
            .style('fill', 'white');

    });

    var svg2 = d3.select('#poisample').append('svg').attr("height", 50).attr("width", 292);
    var padding2 = { top: 10, bottom: 10, left: 14, right: 10 }
    d3.json("js/json/poiClass.json", function (pois) {
        svg2.selectAll('circle')
            .data(pois)
            .enter()
            .append('circle')
            .attr('cx', function (d, i) {
                return padding2.left + 40 * (i % 7);
            })
            .attr('cy', function (d, i) {
                return i < 7 ? 20 : 44;
            })
            .attr('r', 4)
            .style('fill', function (d) { return d.color; });
        svg2.selectAll('text')
            .data(pois)
            .enter()
            .append('text')
            .attr('x', function (d, i) {
                return padding2.left + 8 + 40 * (i % 7);
            })
            .attr('y', function (d, i) {
                return i < 7 ? 24 : 48;
            })
            .text(function (d) { return d.name; })
            .style('font-size', '8')
            .style('fill', 'white');

    });


}
window.onload = drawAreas;