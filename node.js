const requests = require("requests");
const http = require("http");
const fs = require("fs");
const path = require("path");
const url = require("url");

const homeFile = fs.readFileSync("index.html", "utf-8");

const replaceVal = (tempVal, orgVal) => {
    let temperature = tempVal.replace("{%temp%}", Math.round((orgVal.main.temp) - 273.15));
    temperature = temperature.replace("{%minTemp%}", Math.round((orgVal.main.temp_min) - 273.15));
    temperature = temperature.replace("{%maxTemp%}", Math.round((orgVal.main.temp_max) - 273.15));
    temperature = temperature.replace("{%city%}", orgVal.name);
    temperature = temperature.replace("{%country%}", orgVal.sys.country);
    temperature = temperature.replace("{%tempratureStatus%}", orgVal.weather[0].main);
    return temperature;
}

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    let cityName = parsedUrl.query.city || "pune";

    if (parsedUrl.pathname === "/") {
        if (cityName) {
            requests(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=7ba1f2e683a04b784a6c69fbff967588`)
                .on('data', (chunk) => {
                    const objData = JSON.parse(chunk);
                    const objArray = [objData];
                    const realTimeData = objArray.map((val) => replaceVal(homeFile, val)).join("");
                    res.writeHead(200, { 'Content-Type': 'text/html' });
                    res.write(realTimeData);
                })
                .on('end', (err) => {
                    if (err) {
                        console.log('connection closed due to errors', err);
                        res.end('Error fetching data');
                    } else {
                        res.end();
                    }
                });
        } else {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.write(homeFile);
            res.end();
        }
    } else if (req.url.match(/\.css$/)) {
        const cssPath = path.join(__dirname, req.url);
        fs.readFile(cssPath, (err, data) => {
            if (err) {
                res.writeHead(404);
                res.end('Not Found');
            } else {
                res.writeHead(200, { 'Content-Type': 'text/css' });
                res.end(data);
            }
        });
    } else if (req.url.match(/\.js$/)) {
        const jsPath = path.join(__dirname, req.url);
        fs.readFile(jsPath, (err, data) => {
            if (err) {
                res.writeHead(404);
                res.end('Not Found');
            } else {
                res.writeHead(200, { 'Content-Type': 'application/javascript' });
                res.end(data);
            }
        });
    } else if (req.url.match(/\.svg$/)) {
        const svgPath = path.join(__dirname, req.url);
        fs.readFile(svgPath, (err, data) => {
            if (err) {
                res.writeHead(404);
                res.end('Not Found');
            } else {
                res.writeHead(200, { 'Content-Type': 'image/svg+xml' });
                res.end(data);
            }
        });
    } else {
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end('Page Not Found');
    }
});

server.listen(8000, "127.0.0.1", () => {
    console.log("Server is listening on port 8000");
});
