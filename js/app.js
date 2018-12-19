function init() {
	var earthScaleFactor = 20;
	var sunScaleFactor = 1000000;

	var scene = new THREE.Scene();
	//										 fov                  dimension ratio          ncp  fcp    (near/far clipping planes)
	var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 200000000000/sunScaleFactor);
	camera.position.z = 1;
	var renderer = new THREE.WebGLRenderer({antialias: true});
	renderer.setSize(window.innerWidth,window.innerHeight);
	document.body.appendChild(renderer.domElement);
	
	window.addEventListener("resize",function(){
		renderer.setSize(window.innerWidth,window.innerHeight);
		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();
	});
	
	//controls = new THREE.OrbitControls(camera,renderer.domElement);
	controls = new THREE.TrackballControls(camera);
	
	//---Resources---
	var panelMaterial = new THREE.MeshPhongMaterial({
		map: new THREE.TextureLoader().load("img/panel.jpg"),
		side: THREE.FrontSide
	});
	vesselMaterial = new THREE.MeshLambertMaterial({
		map: new THREE.TextureLoader().load("img/vessel.jpg"),
		side: THREE.FrontSide
	});
			
	var dragonSpaceshipResources = {
		geometry: {
			sectionGeometry: new THREE.CylinderGeometry(5,5,10,9),
			torusGeometry: new THREE.TorusGeometry(1.5, 0.7, 4, 16),
			coneGeometry: new THREE.CylinderGeometry(2.5,5,6,9),
			panelConnectorGeometry: new THREE.CylinderGeometry(0.2,0.2,10.4),
			miniPanelConnectorGeometry: new THREE.CylinderGeometry(0.2,0.2,0.4),
			panelGeometry: new THREE.BoxGeometry(10,5,0.2),
		},		
		materials: {
			vesselMaterial: vesselMaterial,
			panelMaterial: new THREE.MeshLambertMaterial({
				map: new THREE.TextureLoader().load("img/panel.jpg"),
				side: THREE.FrontSide
			}),
			panelMaterials: [
				panelMaterial, 
				panelMaterial, 
				panelMaterial, 
				panelMaterial, 
				panelMaterial, 
				new THREE.MeshLambertMaterial({
					map: new THREE.TextureLoader().load("img/panelRear.jpg"),
					side: THREE.FrontSide
				})
			],
			connectorMaterial: new THREE.MeshLambertMaterial({
				map: new THREE.TextureLoader().load("img/connector.jpg"),
				side: THREE.FrontSide
			}),
			coneMaterials: [
				vesselMaterial, 
				new THREE.MeshLambertMaterial({
					map: new THREE.TextureLoader().load("img/innerFoil.jpg"),
					side: THREE.FrontSide
				})
			]
		}
	}
		

	//---Geometry---
	var earthGeometry = new THREE.SphereGeometry(6371000/earthScaleFactor, 128, 128);
	var earthAtmosphereGeometry = new THREE.SphereGeometry(6391000/earthScaleFactor, 128, 128);
	var sunGeometry = new THREE.SphereGeometry(695508000/sunScaleFactor, 32, 32);
	
	var skyboxGeometry = new THREE.SphereGeometry((350000000000/2)/sunScaleFactor, 8, 8);
	
	for (index = 0; index < earthGeometry.faces.length; index++) {
		earthGeometry.faces[index].color = new THREE.Color(0.278+(randInt(50)-25)/1000,0.545+(randInt(50)-25)/1000,0.95);
	}

	
	//---Materials---
	var earthMaterial = new THREE.MeshLambertMaterial({
		//map: new THREE.TextureLoader().load("img/ppe/world_shaded_43k.jpg"),
		//color:randHex(),
		//Double side = visible from inside and outside
		vertexColors: THREE.FaceColors,
		side: THREE.FrontSide,
		//bumpMap: THREE.ImageUtils.loadTexture('img/ppe/earthbump1k.jpg'),
		//bumpScale: 637100,
		//specularMap: THREE.ImageUtils.loadTexture('img/ppe/earthspec1k.jpg'),
		//specular: new THREE.Color('grey'),
	});				
	
	//earthMaterial.map.rotation = 0.1;
	
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
	
	var skyboxMaterial = new THREE.MeshBasicMaterial({
		//map: new THREE.TextureLoader().load("img/ppe/world_shaded_43k.jpg"),
		color:randHex(),
		//Double side = visible from inside and outside
		//vertexColors: THREE.FaceColors,
		side: THREE.BackSide,
		wireframe:true,
		//bumpMap: THREE.ImageUtils.loadTexture('img/ppe/earthbump1k.jpg'),
		//bumpScale: 637100,
		//specularMap: THREE.ImageUtils.loadTexture('img/ppe/earthspec1k.jpg'),
		//specular: new THREE.Color('grey'),
	});	

	//---Meshes---
	var earth = new THREE.Mesh(earthGeometry,earthMaterial);
	earth.position.z = -6771000/earthScaleFactor;
	
	scene.add(earth);		
	
	var earthAtmosphere = new THREE.Mesh(earthAtmosphereGeometry,earthAtmosphereMaterial);
	earthAtmosphere.position.z = -6771000/earthScaleFactor;
	scene.add(earthAtmosphere);		
	
	var sun = new THREE.Mesh(sunGeometry,sunMaterial);
	sun.position.z = 140000000000/sunScaleFactor;
	scene.add(sun);		
	
	var skybox = new THREE.Mesh(skyboxGeometry,skyboxMaterial);
	//scene.add(skybox);	
	
	//Dragon Spaceship
	function createDragonSpaceship() {
		//Main body
		dragonSpaceshipBody = new THREE.Mesh(dragonSpaceshipResources.geometry.sectionGeometry,dragonSpaceshipResources.materials.vesselMaterial);
		
		//Cone at top
		cone = new THREE.Mesh(dragonSpaceshipResources.geometry.coneGeometry,dragonSpaceshipResources.materials.coneMaterials);
		cone.position.y = 8;
		dragonSpaceshipBody.add(cone);

		//Docking Port Torus Shape at top
		sepTorus = new THREE.Mesh(dragonSpaceshipResources.geometry.torusGeometry,dragonSpaceshipResources.materials.vesselMaterial);
		sepTorus.rotation.x = Math.PI / 2;
		sepTorus.position.y = 11;
		dragonSpaceshipBody.add(sepTorus);	
		
		//Solar array 1
		panels1 = createSolarPanelArray(3);
		panels1.rotation.z = -Math.PI / 2;
		panels1.position.x = 5;
		dragonSpaceshipBody.add(panels1);	
		
		//Solar array 2
		panels2 = createSolarPanelArray(3);
		panels2.rotation.z = +Math.PI / 2;
		panels2.position.x = -5;
		dragonSpaceshipBody.add(panels2);	
		
		return dragonSpaceshipBody;
	}
	
	function createSolarPanelArray(size) {
		//size = amount of solar panels
		mainPanelConnector = new THREE.Mesh(dragonSpaceshipResources.geometry.miniPanelConnectorGeometry,dragonSpaceshipResources.materials.connectorMaterial);
		firstPanel = new THREE.Mesh(dragonSpaceshipResources.geometry.panelGeometry,dragonSpaceshipResources.materials.panelMaterials);
		firstPanel.position.y = 2.7;
		mainPanelConnector.add(firstPanel);
		
		lastPanel = firstPanel;
		for (index = 1; index < size; index++) {
			panelConnector = new THREE.Mesh(dragonSpaceshipResources.geometry.miniPanelConnectorGeometry,dragonSpaceshipResources.materials.connectorMaterial);
			panelConnector.position.y = 2.65;
			lastPanel.add(panelConnector);
			nextPanel = new THREE.Mesh(dragonSpaceshipResources.geometry.panelGeometry,dragonSpaceshipResources.materials.panelMaterials);
			nextPanel.position.y = 2.7;
			panelConnector.add(nextPanel);
			
			lastPanel = nextPanel;
			
			if (index == size-1) {
				//nextPanel.rotation.x = Math.PI / 2;
			}
		}
		
		return mainPanelConnector;
	}
	
	var dragonSpaceship = createDragonSpaceship();
	scene.add(dragonSpaceship);	
	

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
		
		//dragonSpaceship.rotation.z+=0.0001;
		//dragonSpaceship.rotation.y+=0.001;
		
		controls.update();    
	}
	
	function render() {
		renderer.render(scene,camera);
	}
	
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