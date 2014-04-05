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

controller.on("frame", function(frame) {
  //ld = new LeapData(frame);
  ld = "jffe";
  io.sockets.emit('LeapData', ld);
});

controller.connect();

// var info, palm, fingers = [];
// // palm
// geometry = new THREE.CubeGeometry( 100, 20, 80 );
// material = new THREE.MeshNormalMaterial();
// palm = new THREE.Mesh( geometry, material );
// palm.castShadow = true;
// palm.receiveShadow = true;
// scene.add( palm );

// // fingers
// geometry = new THREE.CubeGeometry( 16, 12, 1 );
// for (var i = 0; i < 5; i++) {
// mesh = new THREE.Mesh( geometry, material );
// mesh.castShadow = true;
// mesh.receiveShadow = true;
// scene.add( mesh );
// fingers.push( mesh );
// }

function is_mobile(req) {
  var ua = S(JSON.stringify(req.headers['user-agent']));
  if (ua.contains('Nexus 7') || ua.contains('Android'))
    return true;
  else return false;
};
 
function handler (req, res) {
  //if(is_mobile(req)){
    console.log("You're mobile!")

    fs.readFile(__dirname + '/tablet/index.html', function (err, data) {
      if (err) {
        res.writeHead(500);
        return res.end('Can\'t load headset html right now :/');
      }
 
      res.writeHead(200);
      res.end(data);
    });
  //}
 
  // else{
  // fs.readFile(__dirname + '/desktop/index.html', function (err, data) {
  //   if (err) {
  //     res.writeHead(500);
  //   return res.end('Error loading desktop.html! ;-;');
  //   }
 
  //   res.writeHead(200);
  //   res.end(data);
  // });
  // }
}


function LeapData(frame) {
  var hand, direction, len;
  if ( frame.hands.length > 0) {
    hand = frame.hands[0];
    palm.position.set( hand.stabilizedPalmPosition[0], hand.stabilizedPalmPosition[1], hand.stabilizedPalmPosition[2] );
    direction = v( hand.direction[0], hand.direction[1], hand.direction[2] ); // best so far
    palm.lookAt( direction.add( palm.position ) );
    palm.rotation.z = -hand.roll() ;
    //palm.rotation.set( hand.pitch(), -hand.yaw(), hand.roll() );
    palm.visible = true;

    data.innerHTML = 'Hand X:' + hand.stabilizedPalmPosition[0].toFixed(0) + ' Y:' + hand.stabilizedPalmPosition[1].toFixed(0) + ' Z:' + hand.stabilizedPalmPosition[2].toFixed(0);

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