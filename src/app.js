Leap = require("./node_modules/leapjs/lib/index");
THREE = require("./node_modules/three")
var S = require('string');
var app = require('http').createServer(handler)
, io = require('socket.io').listen(app, {log: false})
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

controller.on("frame", function(frame) {
  LeapData(frame);
  io.sockets.emit('LeapData', new Hand());
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

    fs.readFile(__dirname + '/tablet/index.html', function (err, data) {
      if (err) {
        res.writeHead(500);
        return res.end('Can\'t load headset html right now :/');
      }
 
      res.writeHead(200);
      res.end(data);
    });
  }else{
        fs.readFile(__dirname + '/desktop/index.html', function (err, data) {
      if (err) {
        res.writeHead(500);
        return res.end('Can\'t load desktop html right now :/');
      }
 
      res.writeHead(200);
      res.end(data);
    });
  }

}

var info, palm, fingers = [];

// palm
geometry = new THREE.CubeGeometry( 100, 20, 80 );
material = new THREE.MeshNormalMaterial();
palm = new THREE.Mesh( geometry, material );
palm.castShadow = true;
palm.receiveShadow = true;

// fingers
geometry = new THREE.CubeGeometry( 16, 12, 1 );
for (var i = 0; i < 5; i++) {
mesh = new THREE.Mesh( geometry, material );
mesh.castShadow = true;
mesh.receiveShadow = true;
fingers.push(mesh );
} 

function Hand(){
  this.fingers = []
  for(var i =0; i < fingers.length; i++){
    this.fingers.push(new Finger(new rotation(fingers[i].rotation.x,fingers[i].rotation.y,fingers[i].rotation.z), new position(fingers[i].position.x,fingers[i].position.y,fingers[i].position.z),fingers[i].visible));
  }
  this.palm = new Palm(new rotation(palm.rotation.x,palm.rotation.y,palm.rotation.z), new position(palm.position.x,palm.position.y,palm.position.z),palm.visible);
}

function Palm(rot, pos, vis){ 
  this.rotation = rot;
  this.position = pos;
  this.visible  = vis;
}

function Finger(rot, pos, vis){ 
  this.rotation = rot;
  this.position = pos;
  this.visible  = vis;
}

function rotation(x,y,z){
  this.x = x;
  this.y = y;
  this.z = z;
}

function position(x,y,z){
  this.x = x;
  this.y = y;
  this.z = z;
}

function v( x, y, z ){ return new THREE.Vector3( x, y, z ); }

function LeapData( frame ) {
    var hand, direction, len;
      if ( frame.hands.length > 0) {
      hand = frame.hands[0];
      palm.position.set( hand.stabilizedPalmPosition[0], hand.stabilizedPalmPosition[1], hand.stabilizedPalmPosition[2] );
      direction = v( hand.direction[0], hand.direction[1], hand.direction[2] ); // best so far
      palm.lookAt( direction.add( palm.position ) );
      palm.rotation.z = -hand.roll() ;
      //palm.rotation.set( hand.pitch(), -hand.yaw(), hand.roll() );
      palm.visible = true;

    } else {
      palm.visible = false;
    }

    len = frame.pointables.length
    if ( len > 0) {
      var pointable;
      palm.hasFingers = true;
      for (var i = 0; i < 5; i++) {
        finger = fingers[i];
        if ( i < len ) {
          pointable = frame.pointables[i];
          finger.position.set( pointable.stabilizedTipPosition[0], pointable.stabilizedTipPosition[1], pointable.stabilizedTipPosition[2] );
          direction = v( pointable.direction[0], pointable.direction[1], pointable.direction[2]);
          finger.lookAt( direction.add( finger.position ) );
          finger.scale.z = pointable.length;
          finger.visible = true;
        } else {
          finger.visible = false;
        }
        }
      } else if ( palm.hasFingers ) {
      for (var i = 0; i < 5; i++) {
      fingers[i].visible = false;
    }
    palm.hasFingers = false;
}
}