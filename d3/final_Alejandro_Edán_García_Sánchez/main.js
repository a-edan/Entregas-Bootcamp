// CHART START
const height = 500
const width = 800
const margin = {
    top: 10,
    bottom: 40,
    left:60,
    right:10
}
// svg
const svg = d3.select("#chart").append("svg").attr("height", height).attr("width", width)

// grupos
const elementGroup = svg.append("g").attr("id", "elementGroup").attr("transform", `translate(${margin.left}, ${margin.top})`)
const AxisGroup = svg.append("g").attr("id", "AxisGroup")

// ejes dentro de grupo de ejes
const xAxisGroup = AxisGroup.append("g").attr("transform", `translate(${margin.left}, ${height -margin.bottom })`)
const yAxisGroup = AxisGroup.append("g").attr("transform", `translate(${margin.left}, ${margin.top})`)

// escalas
const x = d3.scaleLinear().range([0, width -margin.left -margin.right])
const y = d3.scaleBand().range([height -margin.top -margin.bottom, 0])

// ejes
const xAxis = d3.axisBottom().scale(x)
const yAxis = d3.axisLeft().scale(y)




d3.csv("data.csv").then(data => {
// filtrado
    dataFilt = data.filter(entry => entry.winner != "");
    
    // anidar por país
    dataNested = d3.nest()
        .key(entry => entry.winner)
        .entries(dataFilt)
    
    // dominio
    x.domain([0, d3.max(dataNested.map(entry => entry.values.length))])
    y.domain(dataNested.map(entry => entry.key)).padding(0.1)

    let maxCopas = d3.max(dataNested.map(entry => entry.values.length))
    let minCopas = d3.min(dataNested.map(entry => entry.values.length))

    // ejes
    xAxisGroup.call(xAxis)
    yAxisGroup.call(yAxis)

    // data binding
    elementGroup.selectAll("rect").data(dataNested)
        .join("rect")
        .attr("class", entry => entry.key)
        .attr("class", entry => entry.values.length == maxCopas ? "ganador" :
            entry.values.length == minCopas ? "perdedor" : "otro")
        .attr("x", 0)
        .attr("y", entry => y(entry.key))
        .attr("width", entry => x(entry.values.length))
        .attr("height", entry => y.bandwidth(entry.key))
})


// CHART END





// slider:
function slider() {    
    var sliderTime = d3
        .sliderBottom()
        .min(d3.min(years))  // rango años
        .max(d3.max(years))
        .step(4)  // cada cuánto aumenta el slider
        .width(580)  // ancho de nuestro slider
        .ticks(years.length)  
        .default(years[years.length -1])  // punto inicio de la marca
        .on('onchange', val => {
            console.log("La función aún no está conectada con la gráfica")
            // conectar con la gráfica aquí
        });

        var gTime = d3
        .select('div#slider-time')  // div donde lo insertamos
        .append('svg')
        .attr('width', width * 0.8)
        .attr('height', 100)
        .append('g')
        .attr('transform', 'translate(30,30)');

        gTime.call(sliderTime);

        d3.select('p#value-time').text(sliderTime.value());
}