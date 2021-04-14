let scene, camera, renderer, trackballControls;
let hexahedron, hexahedronShown = false;
let octahedron, octahedronShown = false;
let tetrahedron, tetrahedronShown = false;
let dodecahedron, dodecahedronShown = false;

const init = () => {
	scene = new THREE.Scene();

	const gridHelper = new THREE.GridHelper(50, 50);
	scene.add(gridHelper);

	camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

	renderer = new THREE.WebGLRenderer({ antialias: true });
	renderer.setClearColor(0xcbcba9, 1)
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.shadowMap.enabled = true;

	document.body.appendChild(renderer.domElement);

	trackballControls = new THREE.TrackballControls(camera, renderer.domElement);

	camera.position.set(15,15,15);
	camera.lookAt(scene.position);

	const spotLight = new THREE.SpotLight(0xffffff);
	spotLight.position.set(50, 50, 50);
	spotLight.castShadow = true;
	scene.add(spotLight);

	const ambientLight = new THREE.AmbientLight(0x242424);
	scene.add(ambientLight);

	const controls = {
		hexahedronShown: false,
		octahedronShown: false,
		tetrahedronShown: false,
		dodecahedronShown: false,
	}

	var gui = new dat.GUI();
	gui.add(controls, 'hexahedronShown').name("Hexahedron").onChange(() => visibilityChanged('hexahedron'));
	gui.add(controls, 'octahedronShown').name("Octahedron").onChange(() => visibilityChanged('octahedron'));
	gui.add(controls, 'tetrahedronShown').name("Tetrahedron").onChange(() => visibilityChanged('tetrahedron'));
	gui.add(controls, 'dodecahedronShown').name("Dodecahedron").onChange(() => visibilityChanged('dodecahedron'));
}

const visibilityChanged = (figure) => {
	switch (figure) {
		case 'hexahedron':
			if (hexahedronShown)
				scene.remove(hexahedron);
			else {
				hexahedron = createHexahedron();
				scene.add(hexahedron);
			}
			hexahedronShown = !hexahedronShown;
			break;
		case 'octahedron':
			if (octahedronShown)
				scene.remove(octahedron);
			else {
				octahedron = createOctahedron();
				scene.add(octahedron);
			}
			octahedronShown = !octahedronShown;
			break;
		case 'tetrahedron':
			if (tetrahedronShown)
				scene.remove(tetrahedron);
			else {
				tetrahedron = createTetrahedron();
				scene.add(tetrahedron);
			}
			tetrahedronShown = !tetrahedronShown;
			break;
		case 'dodecahedron':
			if (dodecahedronShown)
				scene.remove(dodecahedron);
			else {
				dodecahedron = createDodecahedron();
				scene.add(dodecahedron);
			}
			dodecahedronShown = !dodecahedronShown;
			break;
	}
}

const createPoint = (point, color, size) => {
	const newPoint = new THREE.Mesh(new THREE.SphereGeometry(size, 32, 32), new THREE.MeshLambertMaterial({ color }));
	newPoint.position.set(point.x, point.y, point.z);
	return newPoint;
}

const createCylinder = (pointX, pointY, material) => {
	const direction = new THREE.Vector3().subVectors(pointY, pointX);
	const orientation = new THREE.Matrix4();
	orientation.lookAt(pointX, pointY, new THREE.Object3D().up);
	orientation.multiply(new THREE.Matrix4().set(
		1, 0, 0, 0,
		0, 0, 1, 0,
		0, -1, 0, 0,
		0, 0, 0, 1
	));
	var edgeGeometry = new THREE.CylinderGeometry(0.2, 0.2, direction.length(), 8, 1);
	var edge = new THREE.Mesh(edgeGeometry, material);
	edge.applyMatrix4(orientation);

	edge.position.x = (pointY.x + pointX.x) / 2;
	edge.position.y = (pointY.y + pointX.y) / 2;
	edge.position.z = (pointY.z + pointX.z) / 2;
	return edge;
}

const createHexahedron = () => {
	const color = 0xff0000;
	const size = 3.33;
	const points = [];
	var figure = createPoint(new THREE.Vector3(0, 0, 0), 0xFFFFFF, 0);
	
	points.push(new THREE.Vector3(-size, -size, size));
	points.push(new THREE.Vector3(size, -size, size));
	points.push(new THREE.Vector3(-size, -size, -size));
	points.push(new THREE.Vector3(size, -size, -size));

	points.push(new THREE.Vector3(-size, size, size));
	points.push(new THREE.Vector3(size, size, size));
	points.push(new THREE.Vector3(-size, size, -size));
	points.push(new THREE.Vector3(size, size, -size));

	for (var i = 0; i < points.length; i++)
		figure.add(createPoint(points[i], color, 0.5));

	figure.add(createCylinder(points[0], points[1], new THREE.MeshLambertMaterial({ color })));
	figure.add(createCylinder(points[1], points[3], new THREE.MeshLambertMaterial({ color })));
	figure.add(createCylinder(points[2], points[0], new THREE.MeshLambertMaterial({ color })));
	figure.add(createCylinder(points[3], points[2], new THREE.MeshLambertMaterial({ color })));

	figure.add(createCylinder(points[0], points[4], new THREE.MeshLambertMaterial({ color })));
	figure.add(createCylinder(points[1], points[5], new THREE.MeshLambertMaterial({ color })));
	figure.add(createCylinder(points[2], points[6], new THREE.MeshLambertMaterial({ color })));
	figure.add(createCylinder(points[3], points[7], new THREE.MeshLambertMaterial({ color })));

	figure.add(createCylinder(points[4], points[5], new THREE.MeshLambertMaterial({ color })));
	figure.add(createCylinder(points[4], points[6], new THREE.MeshLambertMaterial({ color })));
	figure.add(createCylinder(points[5], points[7], new THREE.MeshLambertMaterial({ color })));
	figure.add(createCylinder(points[6], points[7], new THREE.MeshLambertMaterial({ color })));

	return figure;
}

const createOctahedron = () => {
	const color = 0x065535;
	const size = 10;           
	const points = [];
	var figure = createPoint(new THREE.Vector3( 0, 0, 0 ), 0xFFFFFF, 0);

	points.push(new THREE.Vector3( 0, 0, -size ));
	points.push(new THREE.Vector3( 0, 0, size));
	points.push(new THREE.Vector3( size, 0, 0 ));
	points.push(new THREE.Vector3( -size, 0, 0));
	points.push(new THREE.Vector3( 0, size, 0 ));
	points.push(new THREE.Vector3( 0, -size, 0));

	for (var i = 0; i < points.length; i++)
		figure.add(createPoint(points[i], color, 0.5));                   
	
	figure.add(createCylinder(points[0], points[2], new THREE.MeshLambertMaterial( { color } )));
	figure.add(createCylinder(points[2], points[1], new THREE.MeshLambertMaterial( { color } )));
	figure.add(createCylinder(points[0], points[3], new THREE.MeshLambertMaterial( { color } )));
	figure.add(createCylinder(points[0], points[2], new THREE.MeshLambertMaterial( { color } )));
	figure.add(createCylinder(points[3], points[1], new THREE.MeshLambertMaterial( { color } )));
	
	figure.add(createCylinder(points[0], points[4], new THREE.MeshLambertMaterial( { color } )));
	figure.add(createCylinder(points[1], points[4], new THREE.MeshLambertMaterial( { color } )));
	figure.add(createCylinder(points[2], points[4], new THREE.MeshLambertMaterial( { color } )));
	figure.add(createCylinder(points[3], points[4], new THREE.MeshLambertMaterial( { color } )));
	
	figure.add(createCylinder(points[0], points[5], new THREE.MeshLambertMaterial( { color } )));
	figure.add(createCylinder(points[1], points[5], new THREE.MeshLambertMaterial( { color } )));
	figure.add(createCylinder(points[2], points[5], new THREE.MeshLambertMaterial( { color } )));
	figure.add(createCylinder(points[3], points[5], new THREE.MeshLambertMaterial( { color } )));
	
	return figure;
}

const createTetrahedron = () => {
	const color = 0xffd700;
	const size = 10;
	const points = [];
	var figure = createPoint(new THREE.Vector3( 0, 0, 0 ), 0xFFFFFF, 0);
	
	points.push(new THREE.Vector3( -size, size, size ));
	points.push(new THREE.Vector3( size, size, -size ));
	points.push(new THREE.Vector3( size, -size, size ));
	points.push(new THREE.Vector3( -size, -size, -size ));

	for (var i = 0; i < points.length; i++)
		figure.add(createPoint(points[i], color, 0.5));  

	figure.add(createCylinder(points[2], points[3], new THREE.MeshLambertMaterial( { color } )));
	figure.add(createCylinder(points[2], points[1], new THREE.MeshLambertMaterial( { color } )));
	figure.add(createCylinder(points[3], points[1], new THREE.MeshLambertMaterial( { color } )));
	figure.add(createCylinder(points[2], points[0], new THREE.MeshLambertMaterial( { color } )));
	figure.add(createCylinder(points[3], points[0], new THREE.MeshLambertMaterial( { color } )));
	figure.add(createCylinder(points[2], points[1], new THREE.MeshLambertMaterial( { color } )));
	figure.add(createCylinder(points[1], points[0], new THREE.MeshLambertMaterial( { color } )));               
	return figure;
}

const createDodecahedron = () => {
	const color = 0x333333;
	const size = 17;
	const k1 = 0.3;
	const k2 = 0.58;
	const points = [];
	var figure = createPoint(new THREE.Vector3( 0, 0, 0 ), 0xFFFFFF, 0);
	
	points.push(new THREE.Vector3( k1*size, size, 0));
	points.push(new THREE.Vector3( k1*-size, size, 0 ));
	points.push(new THREE.Vector3( k2*-size, k2*size, k2*size ));
	points.push(new THREE.Vector3( 0, k1*size, size ));
	points.push(new THREE.Vector3( k2*size, k2*size, k2*size ));

	points.push(new THREE.Vector3( 0, -k1*size, size ));
	points.push(new THREE.Vector3( -size, 0, k1*size ));
	points.push(new THREE.Vector3( -k2*size, -k2*size, -k2*size ));
	points.push(new THREE.Vector3( -k2*size, -k2*size, k2*size ));
	points.push(new THREE.Vector3( -size, 0, -k1*size ));
	points.push(new THREE.Vector3( k2*-size, k2*size, -k2*size ));
	points.push(new THREE.Vector3( 0, k1*size, -size ));
	points.push(new THREE.Vector3( k2*size, k2*size, -k2*size ));
	points.push(new THREE.Vector3( k1*size, -size, 0));
	points.push(new THREE.Vector3( k1*-size, -size, 0 ));
	points.push(new THREE.Vector3( size, 0, -k1*size ));
	points.push(new THREE.Vector3( size, 0, k1*size ));


	points.push(new THREE.Vector3( 0, -k1*size, -size ));
	points.push(new THREE.Vector3( k2*size, -k2*size, -k2*size ));
	points.push(new THREE.Vector3( k2*size, -k2*size, k2*size ));


	for (var i = 0; i < points.length; i++)
		figure.add(createPoint(points[i], color, 0.5));  
	
	figure.add(createCylinder(points[0], points[1], new THREE.MeshLambertMaterial( { color } )));   
	figure.add(createCylinder(points[1], points[2], new THREE.MeshLambertMaterial( { color } )));  
	figure.add(createCylinder(points[2], points[3], new THREE.MeshLambertMaterial( { color } )));   
	figure.add(createCylinder(points[3], points[4], new THREE.MeshLambertMaterial( { color } )));  
	figure.add(createCylinder(points[4], points[0], new THREE.MeshLambertMaterial( { color } )));  
	figure.add(createCylinder(points[2], points[6], new THREE.MeshLambertMaterial( { color } )));  
	figure.add(createCylinder(points[6], points[8], new THREE.MeshLambertMaterial( { color } )));  
	figure.add(createCylinder(points[6], points[8], new THREE.MeshLambertMaterial( { color } )));  
	figure.add(createCylinder(points[8], points[5], new THREE.MeshLambertMaterial( { color } )));  
	figure.add(createCylinder(points[5], points[3], new THREE.MeshLambertMaterial( { color } )));  
	figure.add(createCylinder(points[9], points[6], new THREE.MeshLambertMaterial( { color } )));  
	figure.add(createCylinder(points[9], points[7], new THREE.MeshLambertMaterial( { color } )));  
	figure.add(createCylinder(points[9], points[10], new THREE.MeshLambertMaterial( { color } )));  
	figure.add(createCylinder(points[10], points[1], new THREE.MeshLambertMaterial( { color } )));  
	figure.add(createCylinder(points[12], points[0], new THREE.MeshLambertMaterial( { color } ))); 
	figure.add(createCylinder(points[11], points[12], new THREE.MeshLambertMaterial( { color } )));  
	figure.add(createCylinder(points[11], points[10], new THREE.MeshLambertMaterial( { color } )));    
	figure.add(createCylinder(points[13], points[14], new THREE.MeshLambertMaterial( { color } )));  
	figure.add(createCylinder(points[13], points[18], new THREE.MeshLambertMaterial( { color } )));    
	figure.add(createCylinder(points[13], points[19], new THREE.MeshLambertMaterial( { color } ))); 
	figure.add(createCylinder(points[18], points[15], new THREE.MeshLambertMaterial( { color } )));    
	figure.add(createCylinder(points[19], points[16], new THREE.MeshLambertMaterial( { color } )));     
	figure.add(createCylinder(points[19], points[13], new THREE.MeshLambertMaterial( { color } )));   
	figure.add(createCylinder(points[4], points[16], new THREE.MeshLambertMaterial( { color } )));
	figure.add(createCylinder(points[15], points[16], new THREE.MeshLambertMaterial( { color } )));    
	figure.add(createCylinder(points[11], points[17], new THREE.MeshLambertMaterial( { color } )));   
	figure.add(createCylinder(points[17], points[18], new THREE.MeshLambertMaterial( { color } )));  
	figure.add(createCylinder(points[17], points[7], new THREE.MeshLambertMaterial( { color } ))); 
	figure.add(createCylinder(points[7], points[14], new THREE.MeshLambertMaterial( { color } ))); 
	figure.add(createCylinder(points[14], points[8], new THREE.MeshLambertMaterial( { color } ))); 
	figure.add(createCylinder(points[15], points[12], new THREE.MeshLambertMaterial( { color } ))); 
	figure.add(createCylinder(points[19], points[5], new THREE.MeshLambertMaterial( { color } ))); 

	figure.scale.set(1.014, 1.014, 1.014);
	return figure;
}

const render = () => {
	trackballControls.update();
	renderer.render(scene, camera);
	requestAnimationFrame(render);
}

const onWindowResize = () => {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight);
}

window.addEventListener('resize', onWindowResize, false);

init();
render();