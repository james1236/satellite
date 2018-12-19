function init() {
	var earthScaleFactor = 20;
	var sunScaleFactor = 1000000;
	var speed = 1;

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
		map: new THREE.TextureLoader().load("img/panelDouble.jpg"),
		side: THREE.FrontSide,
		bumpMap: THREE.ImageUtils.loadTexture('img/panelDoubleBumpMap.jpg'),
		bumpScale: 0.01,
	});
	
	vesselMaterial = new THREE.MeshLambertMaterial({
		map: new THREE.TextureLoader().load("img/vessel.jpg"),
		side: THREE.FrontSide
	});
	
			
	var dragonSpaceshipResources = {
		geometry: {
			sectionGeometry: new THREE.CylinderGeometry(5,5,10,8),
			torusGeometry: new THREE.TorusGeometry(1.5, 0.7, 4, 8),
			coneGeometry: new THREE.CylinderGeometry(2.5,5,6,8),
			miniPanelConnectorGeometry: new THREE.CylinderGeometry(0.15,0.15,0.4),
			panelGeometry: new THREE.BoxGeometry(10,5,0.2),
		},		
		materials: {
			vesselMaterial: vesselMaterial,
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
				new THREE.MeshPhongMaterial({
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
	
	//waterColor = [0.278,0.545,0.95];
	waterColor = [11/255,46/255,74/255];
	//terrainColor = [0.259,0.956,0.37];
	terrainColor = [72/255,107/255,43/255];
		
	for (index = 0; index < earthGeometry.faces.length; index++) {
		if (randInt(3) != 0) {
			earthGeometry.faces[index].color = new THREE.Color(waterColor[0]+(randInt(50)-25)/1000,waterColor[1]+(randInt(50)-25)/1000,waterColor[2]);
		} else {
			earthGeometry.faces[index].color = new THREE.Color(terrainColor[0]+(randInt(100))/1000, terrainColor[1], terrainColor[2]+(randInt(100))/1000);
		}
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
	
	setInterval(perSecond,1000);
	
	function perSecond() {
		earth.rotation.y  += ((1/360)/240)*speed;
		earthAtmosphere.rotation.y  += ((1/360)/120)*speed;
	}
	
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
		solarPanelArray1 = createSolarPanelArray(4);
		solarPanelArray1.panels[0].rotation.z = -Math.PI / 2;
		solarPanelArray1.panels[0].position.x = 5;
		dragonSpaceshipBody.add(solarPanelArray1.panels[0]);	
		
		//Solar array 2
		solarPanelArray2 = createSolarPanelArray(4);
		solarPanelArray2.panels[0].rotation.z = +Math.PI / 2;
		solarPanelArray2.panels[0].position.x = -5;
		dragonSpaceshipBody.add(solarPanelArray2.panels[0]);	
		
		dragonSpaceship = {
			body: dragonSpaceshipBody,
			solarPanelArrays: [solarPanelArray1,solarPanelArray2],
		}
		
		return dragonSpaceship;
	}
	
	function createSolarPanelArray(size) {
		if (size <= 0) {
			return;
		}
		panelsArray = [];
		
		panelsArray.push(new THREE.Mesh(dragonSpaceshipResources.geometry.miniPanelConnectorGeometry,dragonSpaceshipResources.materials.connectorMaterial));
		panelsArray.push(new THREE.Mesh(dragonSpaceshipResources.geometry.panelGeometry,dragonSpaceshipResources.materials.panelMaterials));
		panelsArray[1].position.y = 2.7;
		panelsArray[0].add(panelsArray[1]);

		for (index = 1; index < size; index++) {
			panelsArray.push(new THREE.Mesh(dragonSpaceshipResources.geometry.miniPanelConnectorGeometry,dragonSpaceshipResources.materials.connectorMaterial));
			panelsArray[panelsArray.length-1].position.y = 2.65;
			panelsArray[panelsArray.length-2].add(panelsArray[panelsArray.length-1]);
			panelsArray.push(new THREE.Mesh(dragonSpaceshipResources.geometry.panelGeometry,dragonSpaceshipResources.materials.panelMaterials));
			panelsArray[panelsArray.length-1].position.y = 2.7;
			panelsArray[panelsArray.length-2].add(panelsArray[panelsArray.length-1]);
			
			if (index == size-1) {
				//nextPanel.rotation.x = Math.PI / 2;
			}
		}
		
		solarPanelArray = {
			panels: panelsArray,
			progress: 50,
		}
		
		return solarPanelArray;
	}
	
	function foldSolarPanelArray(solarPanelArray) {
		//mainPanelConnector.position.z += dragonSpaceshipResources.geometry.panelGeometry.parameters.width/2;
		even = true;
		
		progress = solarPanelArray.progress;
		
		for (index = 2; index < solarPanelArray.panels.length; index+=2) {
			solarPanelArray.panels[index].rotation.x = (even) ? Math.PI / progress : -Math.PI / progress;
			solarPanelArray.panels[index].position.z += (even) ? solarPanelArray.panels[index].geometry.parameters.radiusTop*2 : -solarPanelArray.panels[index].geometry.parameters.radiusTop*2;
			
			even = !even;
		}
	}
	
	var dragonSpaceship = createDragonSpaceship();
	
	dragonSpaceship.solarPanelArrays[1].progress = 1;
	
	foldSolarPanelArray(dragonSpaceship.solarPanelArrays[0]);
	foldSolarPanelArray(dragonSpaceship.solarPanelArrays[1]);
	
	scene.add(dragonSpaceship.body);	
	

	var globalLight = new THREE.AmbientLight("#ffffff",0.3);
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