function LeapData(frame) {
	this.palm = [];
	
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