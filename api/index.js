//For running it locally uncomment where u find - <UC> in code and Comment it where u find - <C>

// Importing all required modules
// const http = require('http')   //<UC>
const fs = require('fs')
const requests = require('requests')
const path = require('path')

//object of image names
const ImageNames = {
    'Clouds': 'cloudy.png',
    'Rain': 'rain.png',
    'Clear': 'sun.png',
    'Mist': 'mist.png',
    'Smoke': 'smoke.png',
    'Haze': 'haze.png',
    'Dust': 'dust.png',
    'Fog': 'fog.png',
    'Sand': 'sand.png',
    'Ash': 'ash.png',
    'Squall': 'windstorm.png',
    'Tornado': 'tornado.png',
    'Snow': 'snow.png',
    'Drizzle': 'drizzle.png',
    'Thunderstorm': 'thunderstorm.png',
}

//empty object to store image path according to weather status
let statusIcons = {}

//getting array of keys 
let keys = Object.keys(ImageNames)
for (let i = 0; i < keys.length; i++) {
    //resolving path 
    let imagePath = path.join(process.cwd(),'images',ImageNames[keys[i]])
    // storing it into statusIcons
    statusIcons[keys[i]] = imagePath
}

//resolving path
const filePath = path.resolve('home.html')

//reading using synchronous function
const home = fs.readFileSync(filePath , 'utf-8')

//function which is used to replace particular strings in above read file which is home.html
const replaceValueInHTMLFile = (temporaryValue, originalValue) => {
    let value = temporaryValue.replace("{%temperature%}", originalValue.main.temp)
    value = value.replace("{%minTemperature%}", originalValue.main.temp_min)
    value = value.replace("{%maxTemperature%}", originalValue.main.temp_max)
    value = value.replace("{%location%}", originalValue.name)
    value = value.replace("{%country%}", originalValue.sys.country)
    return value
}



//Main Function
// const server = http.createServer((req, res) => {   //<UC>

export default function handler(req, res) { //<C>
        //requesting to ipinfo for location using get
        requests('http://ipinfo.io')
            .on('data', function (data) {
                let info = JSON.parse(data)
                let city = info.city
                city = city.replace('ī', 'i')
                city = city.replace('ā', 'a')
   
                  //requesting to openweather api for weather data using get
                  //here appid is a api key which you can get after registering on openweatherapi
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
} //<C>

// })  //<UC>

// server.listen(8000, "127.0.0.1") //<UC>

