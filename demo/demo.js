const http = require('http');
const server = http.createServer();
const express = require('express');
const bodyParser = require('body-parser');
const DemoService = require("./demo.service.js");
const Demo2Service = require("./demo2.service.js");
const Demo3Service = require("./demo3.service.js");
const Demo4Service = require("./demo4.service.js");

//express
const app = express();
const webRoot = __dirname + '/webroot'; 
app.use(express.static(webRoot));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//service
const demoService = new DemoService();
const demo2Service = new Demo2Service();
const demo3Service = new Demo3Service();
const demo4Service = new Demo4Service();

app.get('/demo', (req, res) => demoService.call(req, res));
app.get('/demo2', (req, res) => demo2Service.call(req, res));
app.post('/post', (req, res) => demo3Service.call(req, res));
app.post('/put', (req, res) => demo3Service.call(req, res)); //.put
app.post('/delete', (req, res) => demo4Service.call(req, res)); //.delete

//web server
app.get('*', function (req, res) {
	const headers = req.headers;
	if (String(headers.accept).indexOf("text/html") !== -1) {
		res.sendFile(webRoot + '/index.html');
	}
	else {
		res.status(404).send("Not found");
	}
});

const errorHandler = (err) => {
	console.error(err);
};
server.on('request', app);
server.on('error', errorHandler);
server.listen(process.env.port || 3030, () => {
	console.log('Listening on ' + server.address().port);
});
