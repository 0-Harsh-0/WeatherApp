// const http = require('http')
const fs = require('fs')
const requests = require('requests')

const statusIcons = {
    'Clouds': '../images/cloudy.png',
    'Rain': '../images/rain.png',
    'Clear': '../images/sun.png',
    'Mist': '../images/mist.png',
    'Smoke': '../images/smoke.png',
    'Haze': '../images/haze.png',
    'Dust': '../images/dust.png',
    'Fog': '../images/fog.png',
    'Sand': '../images/sand.png',
    'Ash': '../images/ash.png',
    'Squall': '../images/windstorm.png',
    'Tornado': '../images/tornado.png',
    'Snow': '../images/snow.png',
    'Drizzle': '../images/drizzle.png',
    'Thunderstorm': '../images/thunderstorm.png',
}


const home = fs.readFileSync('./index.html', 'utf-8')


const replaceValueInHTMLFile = (temporaryValue, originalValue) => {
    let value = temporaryValue.replace("{%temperature%}", originalValue.main.temp)
    value = value.replace("{%minTemperature%}", originalValue.main.temp_min)
    value = value.replace("{%maxTemperature%}", originalValue.main.temp_max)
    value = value.replace("{%location%}", originalValue.name)
    value = value.replace("{%country%}", originalValue.sys.country)
    return value
}

//Main Function
// const server = http.createServer((req, res) => {
module.exports = (req, res) => {
    if (req.url == '/') {

        requests('http://ipinfo.io')
            .on('data', function (data) {
                let info = JSON.parse(data)
                city = info.city
                city = city.replace('ī', 'i')
                city = city.replace('ā', 'a')
   
                requests('https://api.openweathermap.org/data/2.5/weather?q=' + city + '&appid=cc176e73b0fc01aad0f8acb85855a04c&units=metric')
                    .on('data', function (chunk) {
                        const objectData = JSON.parse(chunk)
                        const realTimeData = replaceValueInHTMLFile(home, objectData)
                        const weatherCondition = objectData.weather[0].main
                        const image = fs.readFileSync(statusIcons[weatherCondition])
                        let index = realTimeData.indexOf('^')
                        let part1 = realTimeData.slice(0, index)
                        let part2 = realTimeData.slice(index + 1,)

                        res.writeHead(200, { 'Content-Type': 'text/html' });
                        res.write(`${part1}<img src="data:image/jpeg;base64,`)
                        res.write(Buffer.from(image).toString('base64'));
                        res.end(`"/><p>${weatherCondition}</p>${part2}`);
                    })
                    .on('end', function (err) {
                        if (err) return console.log('connection closed due to errors', err);
                        res.end()
                    });
            })



    }
}
// })

// server.listen(8000, "127.0.0.1")