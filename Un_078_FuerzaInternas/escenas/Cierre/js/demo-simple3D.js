/*	Simple 3D demo

	HTML5 Tools Presentation, Develop Conference 2012
	Richard Hackett, Blitz Games Studios
	
	Somewhat quickly derived from: http://www.aerotwist.com/tutorials/getting-started-with-three-js/
*/


var simple3D = {

	// set some camera attributes
	VIEW_ANGLE: 45,
	ASPECT: 1,
	NEAR: 0.1,
	FAR: 10000,


	// Initialise demo, called once on page load
	init: function () {
		// Add event to kick off script when slide becomes active
		document.addEventListener( 'demo-simple3D', this.activateEvent.bind(this), false );
	},

	
	// Callback for slide initialisation event
	activateEvent: function () {
		console.log('demo-simple3D event');
	
		// If slide has become active, initialise demo
		var canvas = document.getElementById('demo-simple3D');
		var slide = findElementSlide(canvas);
		if (isActiveSlide(slide)) {
			this.reset(canvas);
		}
	},

	
	// Reset demo when slide becomes active
	reset: function (canvas) {

	    this.canvas = canvas;
	    this.width = canvas.width;
	    this.height = canvas.height;
	    this.slide = findElementSlide(this.canvas.parentElement);
    
	    // create a WebGL renderer, camera
	    // and a scene
	    this.renderer = new THREE.WebGLRenderer({canvas:this.canvas});
	    this.ASPECT = this.width / this.height;
	    this.camera = new THREE.PerspectiveCamera( this.VIEW_ANGLE, this.ASPECT, this.NEAR, this.FAR );
	    this.scene = new THREE.Scene();
    
	    // the camera starts at 0,0,0 so pull it back
	    this.camera.position.z = 300;
    
	    // start the renderer
	    this.renderer.setSize(this.width, this.height);
        
	    // create the sphere's material
	    this.sphereMaterial = new THREE.MeshLambertMaterial( { color: 0xCC0000 });
    
	    // set up the sphere vars
	    var radius = 100, segments = 16, rings = 16;
    
	    // create a new mesh with sphere geometry -
	    // we will cover the sphereMaterial next!
	    this.sphere = new THREE.Mesh( new THREE.CubeGeometry(radius, radius, radius),
					  this.sphereMaterial);
    
	    this.scene.add(this.sphere);
	    this.scene.add(this.camera);
    
	    // create a point light
	    this.pointLight = new THREE.PointLight( 0xFFFFFF );
	    this.pointLight.position.x = 10;
	    this.pointLight.position.y = 50;
	    this.pointLight.position.z = 130;
	    this.scene.add(this.pointLight);

	    this.frame();    
	},
	

	// Demo frame update 
	frame: function() {
//		console.log('demo-simple3D frame');

	    this.sphere.rotation.x += Math.PI/100;
	    this.sphere.rotation.y += Math.PI/150;
	    this.sphere.rotation.z += Math.PI/200;

	    this.renderer.render(this.scene, this.camera);

	    
	    // Queue next frame if slide still active
	    if (isActiveSlide(this.slide)) {
		    window.requestAnimationFrame(this.frame.bind(this), this.canvas);
	    }
	    else {
		    console.log('demo-simple3D stopped');
	    }
	}
	
};
