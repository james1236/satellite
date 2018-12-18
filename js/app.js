function init() {
	//Init
	var scene = new THREE.Scene();
	//										 fov                  dimension ratio          ncp  fcp    (near/far clipping planes)
	var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 200000000000);
	
	var renderer = new THREE.WebGLRenderer();
	renderer.setSize(window.innerWidth,window.innerHeight);
	document.body.appendChild(renderer.domElement);
	
	window.addEventListener("resize",function(){
		renderer.setSize(window.innerWidth,window.innerHeight);
		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();
	});
	
	//controls = new THREE.OrbitControls(camera,renderer.domElement);
	controls = new THREE.TrackballControls(camera);
	
	var demoGeometry = new THREE.BoxGeometry(1,1,1);
	var demoGeometry2 = new THREE.BoxGeometry(3,3,3);
	var sectionGeometry = new THREE.CylinderGeometry(5,5,10,9);
	var torusGeometry = new THREE.TorusGeometry(1.5, 0.7, 4, 16);
	var coneGeometry = new THREE.CylinderGeometry(2.5,5,6,9);
	
	var panelConnectorGeometry = new THREE.CylinderGeometry(0.2,0.2,10.4);
	var miniPanelConnectorGeometry = new THREE.CylinderGeometry(0.2,0.2,0.4);
	var panelGeometry = new THREE.BoxGeometry(10,5,0.2);
	
	var earthGeometry = new THREE.SphereGeometry(6371000, 32, 32);
	var earthAtmosphereGeometry = new THREE.SphereGeometry(6391000, 32, 32);
	var sunGeometry = new THREE.SphereGeometry(695508000, 32, 32);
	
	var material = new THREE.MeshLambertMaterial({
		//color:"#ffffff",
		map: new THREE.TextureLoader().load("img/vessel.jpg"),
		//Double side = visible from inside and outside
		side: THREE.FrontSide
	});	
	
	var panelMaterial = new THREE.MeshLambertMaterial({
		map: new THREE.TextureLoader().load("img/panel.jpg"),
		//Double side = visible from inside and outside
		side: THREE.FrontSide
	});		
	
	var connectorMaterial = new THREE.MeshLambertMaterial({
		map: new THREE.TextureLoader().load("img/connector.jpg"),
		//Double side = visible from inside and outside
		side: THREE.FrontSide
	});	
	
	var coneMaterials = [
		material, 
		new THREE.MeshBasicMaterial({
			map: new THREE.TextureLoader().load("img/innerFoil.jpg"),
			side: THREE.FrontSide
		})
	];

	var earthMaterial = new THREE.MeshLambertMaterial({
		map: new THREE.TextureLoader().load("img/earth.jpg"),
		//Double side = visible from inside and outside
		side: THREE.FrontSide
	});		
	
	var earthAtmosphereMaterial = new THREE.MeshLambertMaterial({
		color:"#ffffff",
		transparent:true,
		opacity:0.2,
		//Double side = visible from inside and outside
		side: THREE.FrontSide
	});	
	
	var sunMaterial = new THREE.MeshBasicMaterial({
		color:"#ffffff",
		//Double side = visible from inside and outside
		side: THREE.FrontSide
	});

	var earth = new THREE.Mesh(earthGeometry,earthMaterial);
	earth.position.z = -6771000;
	scene.add(earth);		
	
	var earthAtmosphere = new THREE.Mesh(earthAtmosphereGeometry,earthAtmosphereMaterial);
	earthAtmosphere.position.z = -6771000;
	//scene.add(earthAtmosphere);		
	
	var sun = new THREE.Mesh(sunGeometry,sunMaterial);
	sun.position.z = 140000000000;
	scene.add(sun);	
	
	
	var section = new THREE.Mesh(sectionGeometry,material);
	scene.add(section);	
	
	var cone = new THREE.Mesh(coneGeometry,coneMaterials);
	//sepTorus.rotation.x = Math.PI / 2;
	cone.position.y = 8;
	section.add(cone);

	var sepTorus = new THREE.Mesh(torusGeometry,material);
	sepTorus.rotation.x = Math.PI / 2;
	sepTorus.position.y = 11;
	section.add(sepTorus);	
	
	var panelConnector = new THREE.Mesh(panelConnectorGeometry,connectorMaterial);
	panelConnector.rotation.z = Math.PI / 2;
	panelConnector.position.x = 0;
	section.add(panelConnector);	
	
	var panel1 = new THREE.Mesh(panelGeometry,panelMaterial);
	//panel1.rotation.z = Math.PI / 2;
	panel1.position.y = 7.7;
	panelConnector.add(panel1);		
	
	var panel2 = new THREE.Mesh(panelGeometry,panelMaterial);
	//panel1.rotation.z = Math.PI / 2;
	panel2.position.y = -7.7;
	panelConnector.add(panel2);	
	
	var miniPanelConnector1 = new THREE.Mesh(miniPanelConnectorGeometry,connectorMaterial);
	//miniPanelConnector1.rotation.z = Math.PI / 2;
	miniPanelConnector1.position.y = 2.65;
	panel1.add(miniPanelConnector1);	
	
	var miniPanelConnector2 = new THREE.Mesh(miniPanelConnectorGeometry,connectorMaterial);
	//miniPanelConnector1.rotation.z = Math.PI / 2;
	miniPanelConnector2.position.y = -2.65;
	panel2.add(miniPanelConnector2);
	
	var panel3 = new THREE.Mesh(panelGeometry,panelMaterial);
	//panel1.rotation.z = Math.PI / 2;
	panel3.position.y = 2.7;
	miniPanelConnector1.add(panel3);		
	
	var panel4 = new THREE.Mesh(panelGeometry,panelMaterial);
	//panel1.rotation.z = Math.PI / 2;
	panel4.position.y = -2.7;
	miniPanelConnector2.add(panel4);	
	
	var miniPanelConnector3 = new THREE.Mesh(miniPanelConnectorGeometry,connectorMaterial);
	//miniPanelConnector1.rotation.z = Math.PI / 2;
	miniPanelConnector3.position.y = 2.65;
	panel3.add(miniPanelConnector3);	
	
	var miniPanelConnector4 = new THREE.Mesh(miniPanelConnectorGeometry,connectorMaterial);
	//miniPanelConnector1.rotation.z = Math.PI / 2;
	miniPanelConnector4.position.y = -2.65;
	panel4.add(miniPanelConnector4);
	
	var panel5 = new THREE.Mesh(panelGeometry,panelMaterial);
	//panel1.rotation.z = Math.PI / 2;
	panel5.position.y = 2.7;
	miniPanelConnector3.add(panel5);		
	
	var panel6 = new THREE.Mesh(panelGeometry,panelMaterial);
	//panel1.rotation.z = Math.PI / 2;
	panel6.position.y = -2.7;
	miniPanelConnector4.add(panel6);	
	
	
	
	
	
	camera.position.z = 3;
	

	var globalLight = new THREE.AmbientLight("#ffffff",0.5);
	scene.add(globalLight);
	
	var sunlight = new THREE.DirectionalLight("#ffffff", 1);
	sunlight.position.set(0, 1, 2000000000000000);
	sunlight.castShadow = true;
    sunlight.shadowCameraVisible = true;
	scene.add(sunlight);
	
	var globalTimer = 0;
	
	function tick() {
		globalTimer++;
		controls.update();    
	}
	
	function render() {
		renderer.render(scene,camera);
	}
	
	// update render repeat
	function GameLoop() {
		requestAnimationFrame(GameLoop);
		
		tick();
		render();
	}

	GameLoop();
	
	
	function randHex(type) {
		lightHex = ["a","b","c","d","e"];
		darkHex = [0,1,2,3,4,5,6,7,8,9];
		allHex = [0,1,2,3,4,5,6,7,8,9,"a","b","c","d","e","f"];
		
		if (type == undefined || type == 0) {
			var hex = "#" + lightHex[randInt(lightHex.length)] + lightHex[randInt(lightHex.length)] + lightHex[randInt(lightHex.length)];
		}
		if (type == 1) {
			var hex = "#" + darkHex[randInt(darkHex.length)] + darkHex[randInt(darkHex.length)] + darkHex[randInt(darkHex.length)];
		}		
		if (type == 2) {
			var hex = "#" + allHex[randInt(allHex.length)] + allHex[randInt(allHex.length)] + allHex[randInt(allHex.length)] + allHex[randInt(allHex.length)] + allHex[randInt(allHex.length)] + allHex[randInt(allHex.length)];
		}
		return hex;
	}
	
	function randInt(max){
		return Math.trunc(Math.random() * (max - 0));
	}
}