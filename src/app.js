Leap = require("./node_modules/leapjs/lib/index");

var S = require('string');
var app = require('http').createServer(handler)
, io = require('socket.io').listen(app)
, fs = require('fs')
 
app.listen(8080);

var controller = new Leap.Controller();

controller.on('connect', function() {
  console.log("Successfully connected.");
});

controller.on('deviceConnected', function() {
  console.log("A Leap device has been connected.");
});

controller.on('deviceDisconnected', function() {
  console.log("A Leap device has been disconnected.");
});

controller.connect();
 
 
function is_mobile(req) {
  var ua = S(JSON.stringify(req.headers['user-agent']));
  if (ua.contains('Nexus 7') || ua.contains('Android'))
    return true;
  else return false;
};
 
function handler (req, res) {
  if(is_mobile(req)){
    console.log("You're mobile!")
    var extname = path.extname(filePath+"/tablet/");
    var contentTypesByExtention = {
      'html': 'text/html',
      'js':   'text/javascript',
      'css':  'text/css'
    };
    var contentType = contentTypesByExtention[extname] || 'text/plain';

    fs.readFile(__dirname + '/tablet/index.html', function (err, data) {
      if (err) {
        res.writeHead(500);
        return res.end('Can\'t load headset html right now :/');
      }
 
      res.writeHead(200);
      res.end(data);
    });
  }
 
  else{
  fs.readFile(__dirname + '/desktop/index.html', function (err, data) {
    if (err) {
      res.writeHead(500);
    return res.end('Error loading desktop.html! ;-;');
    }
 
    res.writeHead(200);
    res.end(data);
  });
  }
}