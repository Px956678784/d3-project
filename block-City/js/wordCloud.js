function wordCloud() {
    var width = 294, height = 300, sizeAdjustment = 100, minFontSize = 1, largestWordSize = 0, smallestWordSize = 10000, terms = [], minSize = 1000, maxSize = -1;

    d3.select("#wordCloud").selectAll("svg").remove();
    var zoom = d3.zoom().scaleExtent([1, 10]).on("zoom", zoomed);
    var svg = d3.select("#wordCloud").append("svg")
        .attr('class', 'cirrusGraph')
        .attr("width", width)
        .attr("height", height)
        .call(zoom);
    function zoomed() {
        d3.select(this).selectAll("g").attr("transform", d3.event.transform);
    }

    var vis = svg.append('g');

    var layout = d3.layoutCloud()
        .size([width, height])
        .overflow(true)
        .padding(1)
        .rotate(function (d) { return ~~(Math.random() * 2) * 90; })
        .spiral('archimedean')
        .fontSize(function (d) { return d.fontSize; })
        .text(function (d) { return d.text; })
        .on('end', draw)

    var color = ["#bcfff8", "#DEF9AE", "#9dc2f6", "#83C2DF", "#FFB9D5", "#F6C0E2", "#F7BEB7", "#F6D89D", "#F3E59A", "#f26a7a", "#5498F7",
        "#C094FB"];

    function draw(words, bounds) {
        var scale = bounds ? Math.min(
            width / Math.abs(bounds[1].x - width / 2),
            width / Math.abs(bounds[0].x - width / 2),
            height / Math.abs(bounds[1].y - height / 2),
            height / Math.abs(bounds[0].y - height / 2)
        ) / 2 : 1;

        var t = d3.transition().duration(1000);

        var nodes = vis.selectAll('text')
            .data(words, function (d) { return d.text; });

        nodes.exit().transition(t)
            .style('font-size', '1px')
            .remove();

        var nodesEnter =
            nodes
                .enter()
                .append('text')
                .text(function (d) { return d.text; })
                .attr('text-anchor', 'middle')
                .attr('data-freq', function (d) { return d.rawFreq; })
                .attr('transform', function (d) { return 'translate(' + [d.x, d.y] + ')rotate(' + d.rotate + ')'; })
                .style('font-family', '"Palatino Linotype", "Book Antiqua", Palatino, serif"')
                .style('fill', function (d) {
                    var index = Math.floor((Math.random() * color.length));
                    return color[index];
                })
                .style('font-size', '1px');

        var nodesUpdate = nodes.merge(nodesEnter);

        nodesUpdate.transition(t)
            .style('fill', function (d) {
                var index = Math.floor((Math.random() * color.length));
                return color[index];
            })
            .attr('transform', function (d) { return 'translate(' + [d.x, d.y] + ')rotate(' + d.rotate + ')'; })
            .style('font-size', function (d) { return d.fontSize + 'px'; });

        vis.transition(t).attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')scale(' + scale + ')');

    }
    var terms = [];
    d3.json('js/json/word.json', (err, data) => {
        terms = [];
        for (i in data) {
            if (chosenArea.length == 0) {
                for (j in chosenPoi) {
                    if (data[i].className == chosenPoi[j])
                        terms.push(data[i]);
                }

            }
            else {
                if (chosenPoi.length == 0) {
                    for (j in chosenArea) {
                        if (data[i].district == chosenArea[j])
                            terms.push(data[i]);
                    }
                }
                else {
                    for (j in chosenArea) {
                        for (k in chosenPoi) {
                            if (data[i].className == chosenPoi[k] && data[i].district == chosenArea[j])
                                terms.push(data[i]);
                        }
                    }
                }
            }
        }
        sketchWordCloud();
    });

    function sketchWordCloud() {
        setWordSizeExtent();
        setRelativeSizes();
        setAdjustedSizes();
        //   console.log(terms);
        layout.words(terms).start();
    }
    function setWordSizeExtent() {
        var extents = d3.extent(terms, d => d.rawFreq);
        minSize = extents[0];
        maxSize = extents[1];
        largestWordSize = maxSize;
        smallestWordSize = minSize;
    }

    function setRelativeSizes() {
        if (terms !== undefined) {
            for (var i = 0; i < terms.length; i++) {
                var word = terms[i];
                word.relativeSize = map(word.rawFreq, smallestWordSize, largestWordSize, 0.1, 1);
            }
        }
    }

    function map(value, istart, istop, ostart, ostop) {
        return ostart +
            (ostop - ostart) *
            ((value - istart) / (istop - istart));
    }

    function setAdjustedSizes() {
        calculateSizeAdjustment();

        if (terms !== undefined) {
            for (var i = 0; i < terms.length; i++) {
                var term = terms[i];
                var adjustedSize = findNewRelativeSize(term);
                term.fontSize = adjustedSize > minFontSize ? adjustedSize : minFontSize;
            }
        }
    }

    function calculateSizeAdjustment() {
        if (terms !== undefined) {
            var stageArea = width * height;
            (stageArea < 100000) ? minFontSize = 8 : minFontSize = 12;
            var pixelsPerWord = stageArea / terms.length;
            var totalWordsSize = 0;
            for (var i = 0; i < terms.length; i++) {
                var word = terms[i];
                var wordArea = calculateWordArea(word);
                totalWordsSize += wordArea;
            }
            sizeAdjustment = (stageArea / totalWordsSize);
        }
    }

    function calculateWordArea(word) {
        var baseSize = Math.log(word.relativeSize * 10) * Math.LOG10E;
        var height = (baseSize + word.relativeSize) / 2;
        var width = 0;
        for (var i = 0; i < word.text.length; i++) {
            var letter = word.text.charAt(i);
            if (letter == 'f' || letter == 'i' || letter == 'j' || letter == 'l' || letter == 'r' || letter == 't') width += baseSize / 3;
            else if (letter == 'm' || letter == 'w') width += baseSize / (4 / 3);
            else width += baseSize / 1.9;
        }
        var wordArea = height * width;
        return wordArea;
    }

    function findNewRelativeSize(word) {
        var areaMultiplier = sizeAdjustment
        var area = calculateWordArea(word) * areaMultiplier;

        var newRelativeSize = (Math.sqrt(6) * Math.sqrt(6 * Math.pow(word.text.length, 2) + area * word.text.length) - 6 * word.text.length) / (2 * word.text.length);
        return newRelativeSize;
    }
}