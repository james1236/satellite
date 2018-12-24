/*

	//Taking geometry from an obj file
	var testGeo;
	
	var objLoader = new THREE.OBJLoader();
	
    objLoader.load('objects/section.obj', function (object) {
		object.traverse(function (child) {
			testGeo = child.geometry;
		});
		testGeo = new THREE.Geometry().fromBufferGeometry(testGeo);

		var finalE = new THREE.Mesh(testGeo, new THREE.MeshLambertMaterial({ color: 0x0000ff }));	
		finalE.matcsgDemoMaterial
		scene.add(finalE);
		
		//finalE.scale.x = finalE.scale.y = finalE.scale.z = 0.99;
		
		finalE.rotation.x = Math.PI/2;
		finalE.position.x = 0;
    });	
	
	
	
	//Async model waiting 
	while (true) {
		await new Promise(resolve => setTimeout(resolve, 100));
		if (scene.getObjectByName(id+"bodyFill") != undefined) {
			break;
		}
	}
*/


async function init() {
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
	
	var gltfLoader = new THREE.GLTFLoader();
	
	//---Resources---
	var panelMaterial = new THREE.MeshPhongMaterial({
		map: new THREE.TextureLoader().load("img/panelDouble.jpg"),
		side: THREE.FrontSide,
		bumpMap: THREE.ImageUtils.loadTexture('img/panelDoubleBumpMap.jpg'),
		bumpScale: 0.01,
	});	
	
	var csgDemoMaterial = new THREE.MeshLambertMaterial({
		map: new THREE.TextureLoader().load("img/vessel.jpg"),
		side: THREE.DoubleSide,
		wireframe:false,
	});
	
	var vesselMaterial = new THREE.MeshLambertMaterial({
		map: new THREE.TextureLoader().load("img/vessel.jpg"),
		side: THREE.DoubleSide,
	});	
	
			
	var dragonSpaceshipResources = {
		geometry: {
			sectionSleeveGeometry: new THREE.CylinderGeometry(5,5,10,8,1,true),
			hatchGeometry: new THREE.TorusGeometry(1.5, 0.7, 4, 8),
			hatchFoilGeometry: new THREE.PlaneGeometry(2, 2),
			coneSleeveGeometry: new THREE.CylinderGeometry(2.5,5,6,8,1,true),
			panelConnectorGeometry: new THREE.CylinderGeometry(0.15,0.15,0.4),
			hatchConnectorGeometry: new THREE.CylinderGeometry(0.2,0.2,0.4),
			panelGeometry: new THREE.BoxGeometry(10,5,0.2),
		},		
		materials: {
			vesselMaterial: vesselMaterial,
			invisibleMaterial: new THREE.MeshLambertMaterial({
				transparent: true,
				opacity: 0,
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
			foilMaterial: new THREE.MeshPhongMaterial({
				map: new THREE.TextureLoader().load("img/foil.jpg"),
				side: THREE.DoubleSide,
			})
		}
	}
		

	//---Geometry---
	var earthGeometry = new THREE.SphereGeometry(6371000/earthScaleFactor, 128, 128);
	var earthAtmosphereGeometry = new THREE.SphereGeometry(6391000/earthScaleFactor, 128, 128);
	var sunGeometry = new THREE.SphereGeometry(695508000/sunScaleFactor, 32, 32);
	
	var skyboxGeometry = new THREE.SphereGeometry((350000000000/2)/sunScaleFactor, 64, 64);
	
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
	
	for (index = 0; index < skyboxGeometry.faces.length; index++) {
		rand = (randInt(20)/1000);
		skyboxGeometry.faces[index].color = new THREE.Color(rand,rand,rand);
	}

	
	//---Materials---
	var earthMaterial = new THREE.MeshLambertMaterial({
		//map: new THREE.TextureLoader().load("img/ppe/world_shaded_43k.jpg"),
		//color:randHex(),
		vertexColors: THREE.FaceColors,
		side: THREE.FrontSide,
		//bumpMap: THREE.ImageUtils.loadTexture('img/ppe/earthbump1k.jpg'),
		//bumpScale: 637100,
		//specularMap: THREE.ImageUtils.loadTexture('img/ppe/earthspec1k.jpg'),
		//specular: new THREE.Color('grey'),
	});				
	
	var earthAtmosphereMaterial = new THREE.MeshLambertMaterial({
		color:"#ffffff",
		transparent:true,
		opacity:0.2,
		side: THREE.FrontSide
	});	
	
	var sunMaterial = new THREE.MeshBasicMaterial({
		color:"#ffffff",
		side: THREE.FrontSide
	});
	
	var skyboxMaterial = new THREE.MeshBasicMaterial({
		vertexColors: THREE.FaceColors,
		side: THREE.BackSide,
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
	async function createDragonSpaceship() {
		var id = Math.random()+"";
		
		//Sleeve (body)
		var dragonSpaceshipBody = new THREE.Mesh(dragonSpaceshipResources.geometry.sectionSleeveGeometry,dragonSpaceshipResources.materials.vesselMaterial);
		scene.add(dragonSpaceshipBody);
		
		
		//Body Fill
		gltfLoader.load("objects/section.glb", (gltf) => {
			gltf.scene.rotation.x = Math.PI/2;
			gltf.scene.scale.x = gltf.scene.scale.y = gltf.scene.scale.z = 0.997;
			//gltf.scene.position.x = 25;
			gltf.scene.name = id+"bodyFill";
			dragonSpaceshipBody.add(gltf.scene);
		});		


		//Cone
		var cone = new THREE.Mesh(dragonSpaceshipResources.geometry.coneSleeveGeometry,dragonSpaceshipResources.materials.vesselMaterial);
		cone.position.y = 8;
		dragonSpaceshipBody.add(cone);
		
		//Cone Fill
		gltfLoader.load("objects/cone.glb", (gltf) => {
			//gltf.scene.rotation.x = Math.PI/2;
			gltf.scene.scale.x = gltf.scene.scale.y = gltf.scene.scale.z = 0.99;
			//gltf.scene.position.x = 25;
			gltf.scene.name = id+"coneFill";
			cone.add(gltf.scene);
		});	
		
		//Section Seperator
		gltfLoader.load("objects/sectionSeperator.glb", (gltf) => {
			gltf.scene.position.y = 5;
			//gltf.scene.position.x = 25;
			dragonSpaceshipBody.add(gltf.scene);
		});

		//Docking Port hatch Shape at top
		hatchConnector = new THREE.Mesh(dragonSpaceshipResources.geometry.hatchConnectorGeometry,dragonSpaceshipResources.materials.connectorMaterial);
		hatchConnector.rotation.x = Math.PI / 2;
		hatchConnector.position.y = 11;
		hatchConnector.position.x = 2;
		dragonSpaceshipBody.add(hatchConnector);	
		
		hatch = new THREE.Mesh(dragonSpaceshipResources.geometry.hatchGeometry,dragonSpaceshipResources.materials.vesselMaterial);
		//hatch.rotation.x = Math.PI / 2;
		//hatch.position.y = 11;
		hatch.position.x = -2;
		hatchConnector.add(hatch);	
		
		
		//Hatch foil
		hatchFoil = new THREE.Mesh(dragonSpaceshipResources.geometry.hatchFoilGeometry,dragonSpaceshipResources.materials.foilMaterial);
		//hatchFoil.rotation.x = Math.PI / 2;
		hatchFoil.position.y = 0;
		hatchFoil.position.x = 0;
		hatch.add(hatchFoil);	
		
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
			hatchConnector: hatchConnector,
			
			solarPanelArrays: [solarPanelArray1,solarPanelArray2],
		}
		
		return dragonSpaceship;
	}
	
	function createSolarPanelArray(size) {
		if (size <= 0) {
			return;
		}
		panelsArray = [];
		
		panelsArray.push(new THREE.Mesh(dragonSpaceshipResources.geometry.panelConnectorGeometry,dragonSpaceshipResources.materials.connectorMaterial));
		panelsArray.push(new THREE.Mesh(dragonSpaceshipResources.geometry.panelGeometry,dragonSpaceshipResources.materials.panelMaterials));
		panelsArray[1].position.y = 2.7;
		panelsArray[0].add(panelsArray[1]);

		for (index = 1; index < size; index++) {
			panelsArray.push(new THREE.Mesh(dragonSpaceshipResources.geometry.panelConnectorGeometry,dragonSpaceshipResources.materials.connectorMaterial));
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
			opening: true,
			closing: false,
			progress: 1,
			
			power: {
				active: true,
				powerFullfilmentPercentage: 0,
				
				activePowerConsumption: 10,
				inactivePowerConsumption: 0,
				
				activePowerProduction: 0,
				inactivePowerProduction: 0,
			}
		}
		
		return solarPanelArray;
	}
	
	function updateFoldPositionSolarPanelArray(solarPanelArray) {
		//mainPanelConnector.position.z += dragonSpaceshipResources.geometry.panelGeometry.parameters.width/2;
		even = true;
		
		progress = solarPanelArray.progress;
		
		for (index = 2; index < solarPanelArray.panels.length; index+=2) {
			solarPanelArray.panels[index].rotation.x = (even) ? Math.PI / progress : -Math.PI / progress;
			
			solarPanelArray.panels[index].position.z = (even) ? (solarPanelArray.panels[index].geometry.parameters.radiusTop*2)/progress : (-solarPanelArray.panels[index].geometry.parameters.radiusTop*2)/progress;
			
			even = !even;
		}
	}
	
	var dragonSpaceship = await createDragonSpaceship();
	
	function tickSolarPanelArray(solarPanelArray) {
		//Power
		solarPanelArray.power.active == solarPanelArray.opening || solarPanelArray.closing;
		
		solarPanelArray.power.activePowerProduction = solarPanelArray.panels.length/2;
		solarPanelArray.power.inactivePowerProduction = solarPanelArray.power.activePowerProduction;
		
		//solarPanelArray.power.powerFullfilmentPercentage = avaliablePower / (solarPanelArray.power.active) ? solarPanelArray.power.activePowerProduction : solarPanelArray.power.inactivePowerProduction;
		//avaliablePower -= (solarPanelArray.power.active) ? solarPanelArray.power.activePowerConsumption : solarPanelArray.power.inactivePowerConsumption
		
		solarPanelArray.power.powerFullfilmentPercentage = 1;
				
		//Opening/Closing
		if (solarPanelArray.opening) {
			solarPanelArray.progress+=((solarPanelArray.progress / (2000 * solarPanelArray.panels.length/4)*(solarPanelArray.progress)/20)*20)*solarPanelArray.power.powerFullfilmentPercentage;
			if (solarPanelArray.progress >= 50) {
				solarPanelArray.opening = false;
			}

			updateFoldPositionSolarPanelArray(solarPanelArray);
		}
		if (solarPanelArray.closing) {
			solarPanelArray.progress-=((solarPanelArray.progress / (2000 * solarPanelArray.panels.length/4)*(solarPanelArray.progress)/20)*20)*solarPanelArray.power.powerFullfilmentPercentage;
			if (solarPanelArray.progress <= 1) {
				solarPanelArray.closing = false;
			}
			
			updateFoldPositionSolarPanelArray(solarPanelArray);
		}
	}
	

	var globalLight = new THREE.AmbientLight("#ffffff",0.3);
	scene.add(globalLight);
	
	
	var sunlight = new THREE.PointLight("#ffffff", 1);
	sunlight.castShadow = true;
	sun.add(sunlight);

	var globalTimer = 0;
	
	//Model Experimentation
	gltfLoader.load("objects/node.glb", (gltf) => {
		//gltf.scene.rotation.x = Math.PI/2;
		//gltf.scene.scale.x = gltf.scene.scale.y = gltf.scene.scale.z = 0.997;
		gltf.scene.position.y = 16;
		scene.add(gltf.scene);
	});		
	
	gltfLoader.load("objects/nodeRing.glb", (gltf) => {
		//gltf.scene.rotation.x = Math.PI/2;
		//gltf.scene.scale.x = gltf.scene.scale.y = gltf.scene.scale.z = 0.997;
		gltf.scene.position.y = 16;
		scene.add(gltf.scene);
	});		
	
	gltfLoader.load("objects/nodeHatch.glb", (gltf) => {
		//gltf.scene.rotation.x = Math.PI/2;
		//gltf.scene.scale.x = gltf.scene.scale.y = gltf.scene.scale.z = 0.997;
		gltf.scene.position.y = 16;
		scene.add(gltf.scene);
	});	
	
	function tick() {
		globalTimer++;

		if (dragonSpaceship.body) {
			dragonSpaceship.hatchConnector.rotation.y -= 0.001;
			
			tickSolarPanelArray(dragonSpaceship.solarPanelArrays[0]);
			tickSolarPanelArray(dragonSpaceship.solarPanelArrays[1]);
		}
		
		controls.update();  	
	}
	
	function render() {
		skybox.rotation.x = camera.rotation.x;
		skybox.rotation.y = camera.rotation.y;
		skybox.rotation.z = camera.rotation.z;
		
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