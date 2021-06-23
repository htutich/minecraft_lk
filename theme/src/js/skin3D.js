/*
	3D просмотр скинов
	Автор: Fleynaro http://vk.com/fleynaro
	Версия: v1.0
	Дата: 31/07/2016
	
	
	Сreated by Fleynaro (C) 2016
	VK http://vk.com/fleynaro
*/

function skin3D(path, elem) {
	//input data
	this.width = 260;
	this.height = 300;
	this.radius = 30;
	this.alpha = 0.0;
	this.delta = -0.8;
	this.beta = 0.3;
	this.fps = 60;
	this.autoTurnAround = 0.005;
	this.animSpeed = 0.011;
	this.animDistanceK = 0.7;
	this.pause = false;
	this.stop = false;
	this.sensitivity = 1;
	
	this.backgroundColor = 0x000000;
	this.zoom = [15, 60];
	this.maxBeta = Math.PI;
	
	this.img;
	this.skinTexture;
	this.cloakTexture;
	this.blockTexture;
	this.context;
	this.canvas;
	this.material1;
	this.material2;
	this.camera;
	this.scene;
	this.rendered;
	
	//Иницилизация
	this.init = function() {
		this.camera = new THREE.PerspectiveCamera(75, this.width / this.height, 1, 10000);
		this.scene = new THREE.Scene();
		cloakMesh = null;
		this.createSkinImage(path);
	};
	
	//Создание избражения скина
	this.createSkinImage = function(pathToSkin) {
		var _this = this;
		this.img = new Image();
		this.img.crossOrigin = '';
		this.img.src = pathToSkin;
		this.img.onload = function() {
			_this.write("Loaded Image " + _this.img.src);
			
			if ( _this.skinTexture == null ) {
				_this.canvas = document.getElementById('canvas');
				_this.canvas.width = _this.img.width;
				_this.canvas.height = _this.img.width;
			
				_this.skinTexture = new THREE.Texture(_this.canvas);
				_this.skinTexture.magFilter = THREE.NearestFilter;
				_this.skinTexture.minFilter = THREE.NearestMipMapNearestFilter;
				
				_this.material1 = new THREE.MeshBasicMaterial({map: _this.skinTexture, side: THREE.FrontSide});
				_this.material2 = new THREE.MeshBasicMaterial({map: _this.skinTexture, transparent: true, opacity: 1, alphaTest: 0.5, side: THREE.DoubleSide});
				
				_this.context = _this.GetCTX(_this.canvas);
				if ( !_this.context ) return _this.loadFail(1);
				_this.context.clearRect(0, 0, _this.img.width, _this.img.width);
				_this.context.drawImage(_this.img, 0, 0);
				_this.skin2D.complete(_this.context, _this);
				
				_this.callMethods();
				_this.write("Init end.");
			} else {
				_this.canvas.width = _this.img.width;
				_this.canvas.height = _this.img.width;
				_this.context.clearRect(0, 0, _this.img.width, _this.img.width);
				_this.context.drawImage(_this.img, 0, 0);
				_this.skin2D.complete(_this.context, _this);
				_this.needsUpdates();
			}
		};
		
		this.img.onerror = function() {
			if ( _this.GetSkinName() != 'default' ) {
				_this.changeSkinName('default');
			} else {
				_this.write("Failed loading " + _this.img.src);
				_this.loadFail(2);
			}
		}
	};
	
	//Поменять путь до другого скина
	this.changeSkin = function(newpath) {
		this.img.src = newpath;
	};
	
	//Проверить скин
	this.GetSkinName = function() {
		var path = this.img.src.split('/'),
			name = path[path.length - 1].split('.');
		return name[0];
	};
	
	//Поменять имя скину
	this.changeSkinName = function(nickname) {
		var partPath = this.img.src.split('/'),
			newpath = '';
		for ( var i = 0; i < partPath.length - 1; i ++ ) {
			newpath += partPath[i] + '/';
		}
		newpath = newpath + nickname + '.png';
		this.img.src = newpath;
	};
	
	//Поменять путь до другого плаща
	this.changeCloak = function(newpath) {
		if ( !this.IsCloak() ) return false;
		this.removeCloak();
		this.createCloak(newpath);
	};
	
	//Обновить скин
	this.updateSkin = function() {
		this.changeSkin(this.img.src + '?update=' + Math.random());
	};
	
	//Обновить плащ
	this.updateCloak = function() {
		if ( this.IsCloak() ) {
			this.changeCloak(this.cloakTexture.image.src + '?update=' + Math.random());
		}
	};
	
	//Do update
	this.needsUpdates = function() {
		this.skinTexture.needsUpdate = true;
		this.material1.needsUpdate = true;
		this.material2.needsUpdate = true;
	};
	
	//Вызов всех методов
	this.callMethods = function() {
		this.needsUpdates();
		try {
			this.render();
		} catch(e) {
			return this.loadFail(3);
		}
		this.addEvents();
		this.addToElement(elem);
		this.animate();
	};
	
	//Добавление обработчиков
	this.addEvents = function() {
		var _this = this,
			renderElem = this.rendered.domElement;
		//Вращение скина
		renderElem.onmousedown = function(e) {
			var sX = _this.MouseCoords.getX(e),
				sY = _this.MouseCoords.getY(e),
				deltaSave = _this.delta,
				betaSave = _this.beta;
			_this.pause = true;
			
			document.onmousemove = function(e) {
				if (!e) e = window.event;
				_this.delta = deltaSave + (_this.MouseCoords.getX(e) - sX) / _this.width * Math.PI * _this.sensitivity;
				_this.beta = betaSave + (_this.MouseCoords.getY(e) - sY) / _this.height * Math.PI * _this.sensitivity;
				
				if ( _this.beta > _this.maxBeta / 2 ) {
					_this.beta = _this.maxBeta / 2;
				} else if ( _this.beta < -_this.maxBeta / 2 ) {
					_this.beta = -_this.maxBeta / 2;
				}
			}
			
			document.onmouseup = function(e) {
				document.onmousemove = null;
				document.onmouseup = null;
				if ( !_this.stop ) {
					_this.pause = false;
				}
			}
		};
		//Масштабирование скина
		renderElem.onwheel = function(e) {
			e = e || window.event;
			var val = e.deltaY || e.detail || e.wheelDelta;
			_this.radius += (val > 0 ? 2  : -2) * _this.sensitivity;
			if ( _this.radius > _this.zoom[1] ) {
				_this.radius = _this.zoom[1];
			} else if ( _this.radius < _this.zoom[0] ) {
				_this.radius = _this.zoom[0];
			}
			return false;
		};
		//Остановка анимации
		renderElem.oncontextmenu = function(e) {
			if ( _this.stop ) {
				_this.startAnimate();
			} else {
				_this.stopAnimate();
			}
			return false;
		};
	};
	
	//Добавить показ скина в какой-либо HTML элемент
	this.addToElement = function(e) {
		e.appendChild(this.rendered.domElement);
	};
	this.copyright = function(e) {
		var text = document.createElement('div'),
			info = this.codeDE('bWFkZSBieSA8YSBocmVmPSJodHRwOi8vdmsuY29tL3BhZ2UtMzk2NDMxNDlfNTIxNDMxMDMiPkZsZXluYXJvPC9hPg==');
		text.innerHTML = info;
		text.align = 'center';
		text.style.position = 'relative';
		text.style.fontFamily = 'tahoma';
		text.style.fontSize = '8px';
		text.style.color = '#000000';
		text.title = this.codeDE('0KXQvtGC0LjRgtC1INGC0LDQutC+0Lkg0LbQtSAzRCB2aWV3ZXIg0YHQutC40L3QvtCyPyDQmtC70LjQutCw0LnRgtC1INC/0L4g0YHRgdGL0LvQutC1IQ==');
		text.onselectstart = function(e) {
			return false;
		};
		var _this = this;
		setInterval(function() {
			if ( text == null || !_this.IsVisibleElem(text) || text.innerHTML != info ) {
				alert(_this.codeDE('0JHRi9C7INC40LfQvNC10L3QtdC9L9GD0LTQsNC70LXQvS/RgdC/0YDRj9GC0LDQvSDQutC+0L/QuNGA0LDQudGCIQrQldGB0LvQuCDQvdC1INGF0L7RgtC40YLQtSDQstC40LTQtdGC0Ywg0Y3RgtC+0YIg0LrQvtC/0LjRgNCw0LnRgiwg0JLRiyDQvNC+0LbQtdGC0LUg0LrRg9C/0LjRgtC1INC00LDQvdC90YvQuSAzRCDQv9GA0L7RgdC80L7RgtGAINGB0LrQuNC90L7QsiDRgSDQvtGC0LrRgNGL0YLRi9C8INC40YHRhdC+0LTQvdGL0Lwg0LrQvtC00L7QvCDQsdC10Lcg0LrQvtC/0LjRgNCw0LnRgtC+0LIg0LIg0LPRgNGD0L/Qv9C1INCS0Jo6Cmh0dHA6Ly92ay5jb20vZmxleW5hcm9fcHJvZHM='));
				_this.stopAnimate();
			}
		}, 5000);	
		e.appendChild(text);
	};
	this.IsVisibleElem = function(e) {
		while ( e != null && e != elem ) {
			if ( e.style.display != 'none' && (e.style.fontSize == null || e.style.fontSize == '8px') && (e.style.color == null || e.style.color == 'rgb(0, 0, 0)') && (e.style.fontFamily == null || e.style.fontFamily == 'tahoma') ) {
				e = e.parentElement;
			} else {
				return false;
			}
		}
		return true;
	};
	this.codeEN = function(str) {
		return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function(match, p1) {
			return String.fromCharCode('0x' + p1);
		}));
	};
	this.codeDE = function(str) {
		return decodeURIComponent(Array.prototype.map.call(atob(str), function(c) {
			return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
		}).join(''));
	};
	
	//Показ анимации
	this.startAnimate = function() {
		this.pause = false;
		this.stop = false;
	};
	
	//Остановка анимации
	this.stopAnimate = function() {
		this.pause = true;
		this.stop = true;
	};
	
	//Создать анимацию
	this.animate = function() {
		var _this = this;
		setInterval(function()
		{
			if ( !_this.pause ) {
				_this.alpha += _this.animSpeed * (90 / _this.fps);
				_this.delta += _this.autoTurnAround * (90 / _this.fps);
				
				//Leg Swing
				leftLeg2Mesh.rotation.x = leftLegMesh.rotation.x = Math.cos(_this.alpha*4) * _this.animDistanceK;
				leftLeg2Mesh.position.z = leftLegMesh.position.z = 0 - 6*Math.sin(leftLegMesh.rotation.x);
				leftLeg2Mesh.position.y = leftLegMesh.position.y = -16 - 6*Math.abs(Math.cos(leftLegMesh.rotation.x));
				rightLeg2Mesh.rotation.x = rightLegMesh.rotation.x = Math.cos(_this.alpha*4 + (Math.PI)) * _this.animDistanceK;
				rightLeg2Mesh.position.z = rightLegMesh.position.z = 0 - 6*Math.sin(rightLegMesh.rotation.x);
				rightLeg2Mesh.position.y = rightLegMesh.position.y = -16 - 6*Math.abs(Math.cos(rightLegMesh.rotation.x));
				//Arm Swing
				leftArm2Mesh.rotation.x = leftArmMesh.rotation.x = Math.cos(_this.alpha*4 + (Math.PI)) * _this.animDistanceK;
				leftArm2Mesh.position.z = leftArmMesh.position.z = 0 - 6*Math.sin(leftArmMesh.rotation.x);
				leftArm2Mesh.position.y = leftArmMesh.position.y = -4 - 6*Math.abs(Math.cos(leftArmMesh.rotation.x));
				rightArm2Mesh.rotation.x = rightArmMesh.rotation.x = Math.cos(_this.alpha*4) * _this.animDistanceK;
				rightArm2Mesh.position.z = rightArmMesh.position.z = 0 - 6*Math.sin(rightArmMesh.rotation.x);
				rightArm2Mesh.position.y = rightArmMesh.position.y = -4 - 6*Math.abs(Math.cos(rightArmMesh.rotation.x));
				//head
				headMesh.rotation.y = head2Mesh.rotation.y = Math.cos(_this.alpha*2) / 2;
				headMesh.rotation.x = head2Mesh.rotation.x = Math.cos(_this.alpha*1.5) / 8;
				//cloak
				if ( _this.IsCloak() ) {
					cloakMesh.position.y = -4.5;
					cloakMesh.position.z = -2.5;
					cloakMesh.translateY(-7.5)
					cloakMesh.rotation.x = 0.2 + Math.cos(_this.alpha*3) / 6;
				}
			}
			
			var b = _this.radius * Math.cos(_this.beta);
			_this.camera.position.z = b * Math.cos(-_this.delta);
			_this.camera.position.x = b * Math.sin(-_this.delta);
			_this.camera.position.y = -12 + _this.radius * Math.sin(_this.beta);
			_this.camera.lookAt(bodyMesh.position);
			_this.rendered.render(_this.scene, _this.camera);
		}, 1000 / this.fps);
	};
	
	//Создание персонажа и рендер
	this.render = function() {
		
		// Head Parts
		var headTop = [
			new THREE.Vector2(0.125, 0.875),
			new THREE.Vector2(0.25, 0.875),
			new THREE.Vector2(0.25, 1),
			new THREE.Vector2(0.125, 1)
		];
		var headBottom = [
			new THREE.Vector2(0.25, 0.875),
			new THREE.Vector2(0.375, 0.875),
			new THREE.Vector2(0.375, 1),
			new THREE.Vector2(0.25, 1)
		];
		var headLeft = [
			new THREE.Vector2(0, 0.75),
			new THREE.Vector2(0.125, 0.75),
			new THREE.Vector2(0.125, 0.875),
			new THREE.Vector2(0, 0.875)
		];
		var headFront = [
			new THREE.Vector2(0.125, 0.75),
			new THREE.Vector2(0.25, 0.75),
			new THREE.Vector2(0.25 ,0.875),
			new THREE.Vector2(0.125 ,0.875)
		];
		var headRight = [
			new THREE.Vector2(0.25, 0.75),
			new THREE.Vector2(0.375, 0.75),
			new THREE.Vector2(0.375, 0.875),
			new THREE.Vector2(0.25, 0.875)
		];
		var headBack = [
			new THREE.Vector2(0.375, 0.75),
			new THREE.Vector2(0.5, 0.75),
			new THREE.Vector2(0.5, 0.875),
			new THREE.Vector2(0.375, 0.875)
		];
		headBox = new THREE.BoxGeometry(8, 8, 8, 0, 0, 0);
		headBox.faceVertexUvs[0] = [];
		headBox.faceVertexUvs[0][0] = [headRight[3], headRight[0], headRight[2]];
		headBox.faceVertexUvs[0][1] = [headRight[0], headRight[1], headRight[2]];
		headBox.faceVertexUvs[0][2] = [headLeft[3], headLeft[0], headLeft[2]];
		headBox.faceVertexUvs[0][3] = [headLeft[0], headLeft[1], headLeft[2]];
		headBox.faceVertexUvs[0][4] = [headTop[3], headTop[0], headTop[2]];
		headBox.faceVertexUvs[0][5] = [headTop[0], headTop[1], headTop[2]];
		headBox.faceVertexUvs[0][6] = [headBottom[0], headBottom[3], headBottom[1]];
		headBox.faceVertexUvs[0][7] = [headBottom[3], headBottom[2], headBottom[1]];
		headBox.faceVertexUvs[0][8] = [headFront[3], headFront[0], headFront[2]];
		headBox.faceVertexUvs[0][9] = [headFront[0], headFront[1], headFront[2]];
		headBox.faceVertexUvs[0][10] = [headBack[3], headBack[0], headBack[2]];
		headBox.faceVertexUvs[0][11] = [headBack[0], headBack[1], headBack[2]];
		headMesh = new THREE.Mesh(headBox, this.material1);
		headMesh.name = "head";
 		this.scene.add(headMesh);
		
		// Body Parts
		var bodyTop = [
			new THREE.Vector2(0.3125, 0.6875),
			new THREE.Vector2(0.4375, 0.6875),
			new THREE.Vector2(0.4375, 0.75),
			new THREE.Vector2(0.3125, 0.75)
		];
		var bodyBottom = [
			new THREE.Vector2(0.4375, 0.6875),
			new THREE.Vector2(0.5625, 0.6875),
			new THREE.Vector2(0.5625, 0.75),
			new THREE.Vector2(0.4375, 0.75)
		];
		var bodyLeft = [
			new THREE.Vector2(0.25, 0.5),
			new THREE.Vector2(0.3125, 0.5),
			new THREE.Vector2(0.3125, 0.6875),
			new THREE.Vector2(0.25, 0.6875)
		];
		var bodyFront = [
			new THREE.Vector2(0.3125, 0.5),
			new THREE.Vector2(0.4375, 0.5),
			new THREE.Vector2(0.4375, 0.6875),
			new THREE.Vector2(0.3125, 0.6875)
		];
		var bodyRight = [
			new THREE.Vector2(0.4375, 0.5),
			new THREE.Vector2(0.5, 0.5),
			new THREE.Vector2(0.5, 0.6875),
			new THREE.Vector2(0.4375, 0.6875)
		];
		var bodyBack = [
			new THREE.Vector2(0.5, 0.5),
			new THREE.Vector2(0.625, 0.5),
			new THREE.Vector2(0.625, 0.6875),
			new THREE.Vector2(0.5, 0.6875)
		];
		bodyBox = new THREE.BoxGeometry(8, 12, 4, 0, 0, 0);
		bodyBox.faceVertexUvs[0] = [];
		bodyBox.faceVertexUvs[0][0] = [bodyRight[3], bodyRight[0], bodyRight[2]];
		bodyBox.faceVertexUvs[0][1] = [bodyRight[0], bodyRight[1], bodyRight[2]];
		bodyBox.faceVertexUvs[0][2] = [bodyLeft[3], bodyLeft[0], bodyLeft[2]];
		bodyBox.faceVertexUvs[0][3] = [bodyLeft[0], bodyLeft[1], bodyLeft[2]];
		bodyBox.faceVertexUvs[0][4] = [bodyTop[3], bodyTop[0], bodyTop[2]];
		bodyBox.faceVertexUvs[0][5] = [bodyTop[0], bodyTop[1], bodyTop[2]];
		bodyBox.faceVertexUvs[0][6] = [bodyBottom[0], bodyBottom[3], bodyBottom[1]];
		bodyBox.faceVertexUvs[0][7] = [bodyBottom[3], bodyBottom[2], bodyBottom[1]];
		bodyBox.faceVertexUvs[0][8] = [bodyFront[3], bodyFront[0], bodyFront[2]];
		bodyBox.faceVertexUvs[0][9] = [bodyFront[0], bodyFront[1], bodyFront[2]];
		bodyBox.faceVertexUvs[0][10] = [bodyBack[3], bodyBack[0], bodyBack[2]];
		bodyBox.faceVertexUvs[0][11] = [bodyBack[0], bodyBack[1], bodyBack[2]];
		bodyMesh = new THREE.Mesh(bodyBox, this.material1);
		bodyMesh.name = "body";
		bodyMesh.position.y = -10;
 		this.scene.add(bodyMesh);
		
		// Right Arm Parts
		var rightArmTop = [
			new THREE.Vector2(0.6875, 0.6875),
			new THREE.Vector2(0.75, 0.6875),
			new THREE.Vector2(0.75, 0.75),
			new THREE.Vector2(0.6875, 0.75),
		];
		var rightArmBottom = [
			new THREE.Vector2(0.75, 0.6875),
			new THREE.Vector2(0.8125, 0.6875),
			new THREE.Vector2(0.8125, 0.75),
			new THREE.Vector2(0.75, 0.75)
		];
		var rightArmLeft = [
			new THREE.Vector2(0.625, 0.5),
			new THREE.Vector2(0.6875, 0.5),
			new THREE.Vector2(0.6875, 0.6875),
			new THREE.Vector2(0.625, 0.6875)
		];
		var rightArmFront = [
			new THREE.Vector2(0.6875, 0.5),
			new THREE.Vector2(0.75, 0.5),
			new THREE.Vector2(0.75, 0.6875),
			new THREE.Vector2(0.6875, 0.6875)
		];
		var rightArmRight = [
			new THREE.Vector2(0.75, 0.5),
			new THREE.Vector2(0.8125, 0.5),
			new THREE.Vector2(0.8125, 0.6875),
			new THREE.Vector2(0.75, 0.6875)
		];
		var rightArmBack = [
			new THREE.Vector2(0.8125, 0.5),
			new THREE.Vector2(0.875, 0.5),
			new THREE.Vector2(0.875, 0.6875),
			new THREE.Vector2(0.8125, 0.6875)
		];
		rightArmBox = new THREE.BoxGeometry(4, 12, 4, 0, 0, 0);
		rightArmBox.faceVertexUvs[0] = [];
		rightArmBox.faceVertexUvs[0][0] = [rightArmRight[3], rightArmRight[0], rightArmRight[2]];
		rightArmBox.faceVertexUvs[0][1] = [rightArmRight[0], rightArmRight[1], rightArmRight[2]];
		rightArmBox.faceVertexUvs[0][2] = [rightArmLeft[3], rightArmLeft[0], rightArmLeft[2]];
		rightArmBox.faceVertexUvs[0][3] = [rightArmLeft[0], rightArmLeft[1], rightArmLeft[2]];
		rightArmBox.faceVertexUvs[0][4] = [rightArmTop[3], rightArmTop[0], rightArmTop[2]];
		rightArmBox.faceVertexUvs[0][5] = [rightArmTop[0], rightArmTop[1], rightArmTop[2]];
		rightArmBox.faceVertexUvs[0][6] = [rightArmBottom[0], rightArmBottom[3], rightArmBottom[1]];
		rightArmBox.faceVertexUvs[0][7] = [rightArmBottom[3], rightArmBottom[2], rightArmBottom[1]];
		rightArmBox.faceVertexUvs[0][8] = [rightArmFront[3], rightArmFront[0], rightArmFront[2]];
		rightArmBox.faceVertexUvs[0][9] = [rightArmFront[0], rightArmFront[1], rightArmFront[2]];
		rightArmBox.faceVertexUvs[0][10] = [rightArmBack[3], rightArmBack[0], rightArmBack[2]];
		rightArmBox.faceVertexUvs[0][11] = [rightArmBack[0], rightArmBack[1], rightArmBack[2]];
		rightArmMesh = new THREE.Mesh(rightArmBox, this.material1);
		rightArmMesh.name = "rightArm";
		rightArmMesh.position.y = -10;
		rightArmMesh.position.x = -6;
 		this.scene.add(rightArmMesh);
		
		// Left Arm Parts
		var leftArmTop = [
			new THREE.Vector2(0.5625, 0.1875),
			new THREE.Vector2(0.625, 0.1875),
			new THREE.Vector2(0.625, 0.25),
			new THREE.Vector2(0.5625, 0.25),
		];
		var leftArmBottom = [
			new THREE.Vector2(0.625, 0.1875),
			new THREE.Vector2(0.6875, 0.1875),
			new THREE.Vector2(0.6875, 0.25),
			new THREE.Vector2(0.625, 0.25)
		];
		var leftArmLeft = [
			new THREE.Vector2(0.5, 0),
			new THREE.Vector2(0.5625, 0),
			new THREE.Vector2(0.5625, 0.1875),
			new THREE.Vector2(0.5, 0.1875)
		];
		var leftArmFront = [
			new THREE.Vector2(0.5625, 0),
			new THREE.Vector2(0.625, 0),
			new THREE.Vector2(0.625, 0.1875),
			new THREE.Vector2(0.5625, 0.1875)
		];
		var leftArmRight = [
			new THREE.Vector2(0.625, 0),
			new THREE.Vector2(0.6875, 0),
			new THREE.Vector2(0.6875, 0.1875),
			new THREE.Vector2(0.625, 0.1875)
		];
		var leftArmBack = [
			new THREE.Vector2(0.6875, 0),
			new THREE.Vector2(0.75, 0),
			new THREE.Vector2(0.75, 0.1875),
			new THREE.Vector2(0.6875, 0.1875)
		];
		leftArmBox = new THREE.BoxGeometry(4, 12, 4, 0, 0, 0);
		leftArmBox.faceVertexUvs[0] = [];
		leftArmBox.faceVertexUvs[0][0] = [leftArmRight[3], leftArmRight[0], leftArmRight[2]];
		leftArmBox.faceVertexUvs[0][1] = [leftArmRight[0], leftArmRight[1], leftArmRight[2]];
		leftArmBox.faceVertexUvs[0][2] = [leftArmLeft[3], leftArmLeft[0], leftArmLeft[2]];
		leftArmBox.faceVertexUvs[0][3] = [leftArmLeft[0], leftArmLeft[1], leftArmLeft[2]];
		leftArmBox.faceVertexUvs[0][4] = [leftArmTop[3], leftArmTop[0], leftArmTop[2]];
		leftArmBox.faceVertexUvs[0][5] = [leftArmTop[0], leftArmTop[1], leftArmTop[2]];
		leftArmBox.faceVertexUvs[0][6] = [leftArmBottom[0], leftArmBottom[3], leftArmBottom[1]];
		leftArmBox.faceVertexUvs[0][7] = [leftArmBottom[3], leftArmBottom[2], leftArmBottom[1]];
		leftArmBox.faceVertexUvs[0][8] = [leftArmFront[3], leftArmFront[0], leftArmFront[2]];
		leftArmBox.faceVertexUvs[0][9] = [leftArmFront[0], leftArmFront[1], leftArmFront[2]];
		leftArmBox.faceVertexUvs[0][10] = [leftArmBack[3], leftArmBack[0], leftArmBack[2]];
		leftArmBox.faceVertexUvs[0][11] = [leftArmBack[0], leftArmBack[1], leftArmBack[2]];
		leftArmMesh = new THREE.Mesh(leftArmBox, this.material1);
		leftArmMesh.name = "leftArm";
		leftArmMesh.position.y = -10;
		leftArmMesh.position.x = 6;
 		this.scene.add(leftArmMesh);
		
		// Right Leg Parts
		var rightLegTop = [
			new THREE.Vector2(0.0625, 0.6875),
			new THREE.Vector2(0.125, 0.6875),
			new THREE.Vector2(0.125, 0.75),
			new THREE.Vector2(0.0625, 0.75),
		];
		var rightLegBottom = [
			new THREE.Vector2(0.125, 0.6875),
			new THREE.Vector2(0.1875, 0.6875),
			new THREE.Vector2(0.1875, 0.75),
			new THREE.Vector2(0.125, 0.75)
		];
		var rightLegLeft = [
			new THREE.Vector2(0, 0.5),
			new THREE.Vector2(0.0625, 0.5),
			new THREE.Vector2(0.0625, 0.6875),
			new THREE.Vector2(0, 0.6875)
		];
		var rightLegFront = [
			new THREE.Vector2(0.0625, 0.5),
			new THREE.Vector2(0.125, 0.5),
			new THREE.Vector2(0.125, 0.6875),
			new THREE.Vector2(0.0625, 0.6875)
		];
		var rightLegRight = [
			new THREE.Vector2(0.125, 0.5),
			new THREE.Vector2(0.1875, 0.5),
			new THREE.Vector2(0.1875, 0.6875),
			new THREE.Vector2(0.125, 0.6875)
		];
		var rightLegBack = [
			new THREE.Vector2(0.1875, 0.5),
			new THREE.Vector2(0.25, 0.5),
			new THREE.Vector2(0.25, 0.6875),
			new THREE.Vector2(0.1875, 0.6875)
		];
		rightLegBox = new THREE.BoxGeometry(4, 12, 4, 0, 0, 0);
		rightLegBox.faceVertexUvs[0] = [];
		rightLegBox.faceVertexUvs[0][0] = [rightLegRight[3], rightLegRight[0], rightLegRight[2]];
		rightLegBox.faceVertexUvs[0][1] = [rightLegRight[0], rightLegRight[1], rightLegRight[2]];
		rightLegBox.faceVertexUvs[0][2] = [rightLegLeft[3], rightLegLeft[0], rightLegLeft[2]];
		rightLegBox.faceVertexUvs[0][3] = [rightLegLeft[0], rightLegLeft[1], rightLegLeft[2]];
		rightLegBox.faceVertexUvs[0][4] = [rightLegTop[3], rightLegTop[0], rightLegTop[2]];
		rightLegBox.faceVertexUvs[0][5] = [rightLegTop[0], rightLegTop[1], rightLegTop[2]];
		rightLegBox.faceVertexUvs[0][6] = [rightLegBottom[0], rightLegBottom[3], rightLegBottom[1]];
		rightLegBox.faceVertexUvs[0][7] = [rightLegBottom[3], rightLegBottom[2], rightLegBottom[1]];
		rightLegBox.faceVertexUvs[0][8] = [rightLegFront[3], rightLegFront[0], rightLegFront[2]];
		rightLegBox.faceVertexUvs[0][9] = [rightLegFront[0], rightLegFront[1], rightLegFront[2]];
		rightLegBox.faceVertexUvs[0][10] = [rightLegBack[3], rightLegBack[0], rightLegBack[2]];
		rightLegBox.faceVertexUvs[0][11] = [rightLegBack[0], rightLegBack[1], rightLegBack[2]];
		rightLegMesh = new THREE.Mesh(rightLegBox, this.material1);
		rightLegMesh.name = "rightLeg"
		rightLegMesh.position.y = -22;
		rightLegMesh.position.x = -2;
 		this.scene.add(rightLegMesh);
		
		// Left Leg Parts
		var leftLegTop = [
			new THREE.Vector2(0.3125, 0.1875),
			new THREE.Vector2(0.375, 0.1875),
			new THREE.Vector2(0.375, 0.25),
			new THREE.Vector2(0.3125, 0.25),
		];
		var leftLegBottom = [
			new THREE.Vector2(0.375, 0.1875),
			new THREE.Vector2(0.4375, 0.1875),
			new THREE.Vector2(0.4375, 0.25),
			new THREE.Vector2(0.375, 0.25)
		];
		var leftLegLeft = [
			new THREE.Vector2(0.25, 0),
			new THREE.Vector2(0.3125, 0),
			new THREE.Vector2(0.3125, 0.1875),
			new THREE.Vector2(0.25, 0.1875)
		];
		var leftLegFront = [
			new THREE.Vector2(0.3125, 0),
			new THREE.Vector2(0.375, 0),
			new THREE.Vector2(0.375, 0.1875),
			new THREE.Vector2(0.3125, 0.1875)
		];
		var leftLegRight = [
			new THREE.Vector2(0.375, 0),
			new THREE.Vector2(0.4375, 0),
			new THREE.Vector2(0.4375, 0.1875),
			new THREE.Vector2(0.375, 0.1875)
		];
		var leftLegBack = [
			new THREE.Vector2(0.4375, 0),
			new THREE.Vector2(0.5, 0),
			new THREE.Vector2(0.5, 0.1875),
			new THREE.Vector2(0.4375, 0.1875)
		];
		leftLegBox = new THREE.BoxGeometry(4, 12, 4, 0, 0, 0);
		leftLegBox.faceVertexUvs[0] = [];
		leftLegBox.faceVertexUvs[0][0] = [leftLegRight[3], leftLegRight[0], leftLegRight[2]];
		leftLegBox.faceVertexUvs[0][1] = [leftLegRight[0], leftLegRight[1], leftLegRight[2]];
		leftLegBox.faceVertexUvs[0][2] = [leftLegLeft[3], leftLegLeft[0], leftLegLeft[2]];
		leftLegBox.faceVertexUvs[0][3] = [leftLegLeft[0], leftLegLeft[1], leftLegLeft[2]];
		leftLegBox.faceVertexUvs[0][4] = [leftLegTop[3], leftLegTop[0], leftLegTop[2]];
		leftLegBox.faceVertexUvs[0][5] = [leftLegTop[0], leftLegTop[1], leftLegTop[2]];
		leftLegBox.faceVertexUvs[0][6] = [leftLegBottom[0], leftLegBottom[3], leftLegBottom[1]];
		leftLegBox.faceVertexUvs[0][7] = [leftLegBottom[3], leftLegBottom[2], leftLegBottom[1]];
		leftLegBox.faceVertexUvs[0][8] = [leftLegFront[3], leftLegFront[0], leftLegFront[2]];
		leftLegBox.faceVertexUvs[0][9] = [leftLegFront[0], leftLegFront[1], leftLegFront[2]];
		leftLegBox.faceVertexUvs[0][10] = [leftLegBack[3], leftLegBack[0], leftLegBack[2]];
		leftLegBox.faceVertexUvs[0][11] = [leftLegBack[0], leftLegBack[1], leftLegBack[2]];
		leftLegMesh = new THREE.Mesh(leftLegBox, this.material1);
		leftLegMesh.name = "leftLeg";
		leftLegMesh.position.y = -22;
		leftLegMesh.position.x = 2;
 		this.scene.add(leftLegMesh);
		
		// Head Overlay Parts
		var head2Top = [
			new THREE.Vector2(0.625, 0.875),
			new THREE.Vector2(0.75, 0.875),
			new THREE.Vector2(0.75, 1),
			new THREE.Vector2(0.625, 1)
		];
		var head2Bottom = [
			new THREE.Vector2(0.75, 0.875),
			new THREE.Vector2(0.875, 0.875),
			new THREE.Vector2(0.875, 1),
			new THREE.Vector2(0.75, 1)
		];
		var head2Left = [
			new THREE.Vector2(0.5, 0.75),
			new THREE.Vector2(0.625, 0.75),
			new THREE.Vector2(0.625, 0.875),
			new THREE.Vector2(0.5, 0.875)
		];
		var head2Front = [
			new THREE.Vector2(0.625, 0.75),
			new THREE.Vector2(0.75, 0.75),
			new THREE.Vector2(0.75, 0.875),
			new THREE.Vector2(0.625, 0.875)
		];
		var head2Right = [
			new THREE.Vector2(0.75, 0.75),
			new THREE.Vector2(0.875, 0.75),
			new THREE.Vector2(0.875, 0.875),
			new THREE.Vector2(0.75, 0.875)
		];
		var head2Back = [
			new THREE.Vector2(0.875, 0.75),
			new THREE.Vector2(1, 0.75),
			new THREE.Vector2(1, 0.875),
			new THREE.Vector2(0.875, 0.875)
		];
		head2Box = new THREE.BoxGeometry(9, 9, 9, 0, 0, 0);
		head2Box.faceVertexUvs[0] = [];
		head2Box.faceVertexUvs[0][0] = [head2Right[3], head2Right[0], head2Right[2]];
		head2Box.faceVertexUvs[0][1] = [head2Right[0], head2Right[1], head2Right[2]];
		head2Box.faceVertexUvs[0][2] = [head2Left[3], head2Left[0], head2Left[2]];
		head2Box.faceVertexUvs[0][3] = [head2Left[0], head2Left[1], head2Left[2]];
		head2Box.faceVertexUvs[0][4] = [head2Top[3], head2Top[0], head2Top[2]];
		head2Box.faceVertexUvs[0][5] = [head2Top[0], head2Top[1], head2Top[2]];
		head2Box.faceVertexUvs[0][6] = [head2Bottom[0], head2Bottom[3], head2Bottom[1]];
		head2Box.faceVertexUvs[0][7] = [head2Bottom[3], head2Bottom[2], head2Bottom[1]];
		head2Box.faceVertexUvs[0][8] = [head2Front[3], head2Front[0], head2Front[2]];
		head2Box.faceVertexUvs[0][9] = [head2Front[0], head2Front[1], head2Front[2]];
		head2Box.faceVertexUvs[0][10] = [head2Back[3], head2Back[0], head2Back[2]];
		head2Box.faceVertexUvs[0][11] = [head2Back[0], head2Back[1], head2Back[2]];
		head2Mesh = new THREE.Mesh(head2Box, this.material2);
		head2Mesh.name = "head2"
 		this.scene.add(head2Mesh);
		
		// Body Overlay Parts
		var body2Top = [
			new THREE.Vector2(0.3125, 0.4375),
			new THREE.Vector2(0.4375, 0.4375),
			new THREE.Vector2(0.4375, 0.5),
			new THREE.Vector2(0.3125, 0.5)
		];
		var body2Bottom = [
			new THREE.Vector2(0.4375, 0.4375),
			new THREE.Vector2(0.5625, 0.4375),
			new THREE.Vector2(0.5625, 0.5),
			new THREE.Vector2(0.4375, 0.5)
		];
		var body2Left = [
			new THREE.Vector2(0.25, 0.25),
			new THREE.Vector2(0.3125, 0.25),
			new THREE.Vector2(0.3125, 0.4375),
			new THREE.Vector2(0.25, 0.4375)
		];
		var body2Front = [
			new THREE.Vector2(0.3125, 0.25),
			new THREE.Vector2(0.4375, 0.25),
			new THREE.Vector2(0.4375, 0.4375),
			new THREE.Vector2(0.3125, 0.4375)
		];
		var body2Right = [
			new THREE.Vector2(0.4375, 0.25),
			new THREE.Vector2(0.5, 0.25),
			new THREE.Vector2(0.5, 0.4375),
			new THREE.Vector2(0.4375, 0.4375)
		];
		var body2Back = [
			new THREE.Vector2(0.5, 0.25),
			new THREE.Vector2(0.625, 0.25),
			new THREE.Vector2(0.625, 0.4375),
			new THREE.Vector2(0.5, 0.4375)
		];
		body2Box = new THREE.BoxGeometry(9, 13.5, 4.5, 0, 0, 0);
		body2Box.faceVertexUvs[0] = [];
		body2Box.faceVertexUvs[0][0] = [body2Right[3], body2Right[0], body2Right[2]];
		body2Box.faceVertexUvs[0][1] = [body2Right[0], body2Right[1], body2Right[2]];
		body2Box.faceVertexUvs[0][2] = [body2Left[3], body2Left[0], body2Left[2]];
		body2Box.faceVertexUvs[0][3] = [body2Left[0], body2Left[1], body2Left[2]];
		body2Box.faceVertexUvs[0][4] = [body2Top[3], body2Top[0], body2Top[2]];
		body2Box.faceVertexUvs[0][5] = [body2Top[0], body2Top[1], body2Top[2]];
		body2Box.faceVertexUvs[0][6] = [body2Bottom[0], body2Bottom[3], body2Bottom[1]];
		body2Box.faceVertexUvs[0][7] = [body2Bottom[3], body2Bottom[2], body2Bottom[1]];
		body2Box.faceVertexUvs[0][8] = [body2Front[3], body2Front[0], body2Front[2]];
		body2Box.faceVertexUvs[0][9] = [body2Front[0], body2Front[1], body2Front[2]];
		body2Box.faceVertexUvs[0][10] = [body2Back[3], body2Back[0], body2Back[2]];
		body2Box.faceVertexUvs[0][11] = [body2Back[0], body2Back[1], body2Back[2]];
		body2Mesh = new THREE.Mesh(body2Box, this.material2);
		body2Mesh.name = "body2";
		body2Mesh.position.y = -10;
 		this.scene.add(body2Mesh);
		
		// Right Arm Overlay Parts
		var rightArm2Top = [
			new THREE.Vector2(0.6875, 0.4375),
			new THREE.Vector2(0.75, 0.4375),
			new THREE.Vector2(0.75, 0.5),
			new THREE.Vector2(0.6875, 0.5),
		];
		var rightArm2Bottom = [
			new THREE.Vector2(0.75, 0.4375),
			new THREE.Vector2(0.8125, 0.4375),
			new THREE.Vector2(0.8125, 0.5),
			new THREE.Vector2(0.75, 0.5)
		];
		var rightArm2Left = [
			new THREE.Vector2(0.625, 0.25),
			new THREE.Vector2(0.6875, 0.25),
			new THREE.Vector2(0.6875, 0.4375),
			new THREE.Vector2(0.625, 0.4375)
		];
		var rightArm2Front = [
			new THREE.Vector2(0.6875, 0.25),
			new THREE.Vector2(0.75, 0.25),
			new THREE.Vector2(0.75, 0.4375),
			new THREE.Vector2(0.6875, 0.4375)
		];
		var rightArm2Right = [
			new THREE.Vector2(0.75, 0.25),
			new THREE.Vector2(0.8125, 0.25),
			new THREE.Vector2(0.8125, 0.4375),
			new THREE.Vector2(0.75, 0.4375)
		];
		var rightArm2Back = [
			new THREE.Vector2(0.8125, 0.25),
			new THREE.Vector2(0.875, 0.25),
			new THREE.Vector2(0.875, 0.4375),
			new THREE.Vector2(0.8125, 0.4375)
		];
		var rightArm2Box = new THREE.BoxGeometry(4.5, 13.5, 4.5, 0, 0, 0);
		rightArm2Box.faceVertexUvs[0] = [];
		rightArm2Box.faceVertexUvs[0][0] = [rightArm2Right[3], rightArm2Right[0], rightArm2Right[2]];
		rightArm2Box.faceVertexUvs[0][1] = [rightArm2Right[0], rightArm2Right[1], rightArm2Right[2]];
		rightArm2Box.faceVertexUvs[0][2] = [rightArm2Left[3], rightArm2Left[0], rightArm2Left[2]];
		rightArm2Box.faceVertexUvs[0][3] = [rightArm2Left[0], rightArm2Left[1], rightArm2Left[2]];
		rightArm2Box.faceVertexUvs[0][4] = [rightArm2Top[3], rightArm2Top[0], rightArm2Top[2]];
		rightArm2Box.faceVertexUvs[0][5] = [rightArm2Top[0], rightArm2Top[1], rightArm2Top[2]];
		rightArm2Box.faceVertexUvs[0][6] = [rightArm2Bottom[0], rightArm2Bottom[3], rightArm2Bottom[1]];
		rightArm2Box.faceVertexUvs[0][7] = [rightArm2Bottom[3], rightArm2Bottom[2], rightArm2Bottom[1]];
		rightArm2Box.faceVertexUvs[0][8] = [rightArm2Front[3], rightArm2Front[0], rightArm2Front[2]];
		rightArm2Box.faceVertexUvs[0][9] = [rightArm2Front[0], rightArm2Front[1], rightArm2Front[2]];
		rightArm2Box.faceVertexUvs[0][10] = [rightArm2Back[3], rightArm2Back[0], rightArm2Back[2]];
		rightArm2Box.faceVertexUvs[0][11] = [rightArm2Back[0], rightArm2Back[1], rightArm2Back[2]];
		rightArm2Mesh = new THREE.Mesh(rightArm2Box, this.material2);
		rightArm2Mesh.name = "rightArm2";
		rightArm2Mesh.position.y = -10;
		rightArm2Mesh.position.x = -6;
 		this.scene.add(rightArm2Mesh);
		
		// Left Arm Overlay Parts
		var leftArm2Top = [
			new THREE.Vector2(0.8125, 0.1875),
			new THREE.Vector2(0.875, 0.1875),
			new THREE.Vector2(0.875, 0.25),
			new THREE.Vector2(0.8125, 0.25),
		];
		var leftArm2Bottom = [
			new THREE.Vector2(0.875, 0.1875),
			new THREE.Vector2(0.9375, 0.1875),
			new THREE.Vector2(0.9375, 0.25),
			new THREE.Vector2(0.875, 0.25)
		];
		var leftArm2Left = [
			new THREE.Vector2(0.75, 0),
			new THREE.Vector2(0.8125, 0),
			new THREE.Vector2(0.8125, 0.1875),
			new THREE.Vector2(0.75, 0.1875)
		];
		var leftArm2Front = [
			new THREE.Vector2(0.8125, 0),
			new THREE.Vector2(0.875, 0),
			new THREE.Vector2(0.875, 0.1875),
			new THREE.Vector2(0.8125, 0.1875)
		];
		var leftArm2Right = [
			new THREE.Vector2(0.875, 0),
			new THREE.Vector2(0.9375, 0),
			new THREE.Vector2(0.9375, 0.1875),
			new THREE.Vector2(0.875, 0.1875)
		];
		var leftArm2Back = [
			new THREE.Vector2(0.9375, 0),
			new THREE.Vector2(1, 0),
			new THREE.Vector2(1, 0.1875),
			new THREE.Vector2(0.9375, 0.1875)
		];
		var leftArm2Box = new THREE.BoxGeometry(4.5, 13.5, 4.5, 0, 0, 0);
		leftArm2Box.faceVertexUvs[0] = [];
		leftArm2Box.faceVertexUvs[0][0] = [leftArm2Right[3], leftArm2Right[0], leftArm2Right[2]];
		leftArm2Box.faceVertexUvs[0][1] = [leftArm2Right[0], leftArm2Right[1], leftArm2Right[2]];
		leftArm2Box.faceVertexUvs[0][2] = [leftArm2Left[3], leftArm2Left[0], leftArm2Left[2]];
		leftArm2Box.faceVertexUvs[0][3] = [leftArm2Left[0], leftArm2Left[1], leftArm2Left[2]];
		leftArm2Box.faceVertexUvs[0][4] = [leftArm2Top[3], leftArm2Top[0], leftArm2Top[2]];
		leftArm2Box.faceVertexUvs[0][5] = [leftArm2Top[0], leftArm2Top[1], leftArm2Top[2]];
		leftArm2Box.faceVertexUvs[0][6] = [leftArm2Bottom[0], leftArm2Bottom[3], leftArm2Bottom[1]];
		leftArm2Box.faceVertexUvs[0][7] = [leftArm2Bottom[3], leftArm2Bottom[2], leftArm2Bottom[1]];
		leftArm2Box.faceVertexUvs[0][8] = [leftArm2Front[3], leftArm2Front[0], leftArm2Front[2]];
		leftArm2Box.faceVertexUvs[0][9] = [leftArm2Front[0], leftArm2Front[1], leftArm2Front[2]];
		leftArm2Box.faceVertexUvs[0][10] = [leftArm2Back[3], leftArm2Back[0], leftArm2Back[2]];
		leftArm2Box.faceVertexUvs[0][11] = [leftArm2Back[0], leftArm2Back[1], leftArm2Back[2]];
		leftArm2Mesh = new THREE.Mesh(leftArm2Box, this.material2);
		leftArm2Mesh.name = "leftArm2";
		leftArm2Mesh.position.y = -10;
		leftArm2Mesh.position.x = 6;
 		this.scene.add(leftArm2Mesh);
		
		// Right Leg Overlay Parts
		var rightLeg2Top = [
			new THREE.Vector2(0.0625, 0.4375),
			new THREE.Vector2(0.125, 0.4375),
			new THREE.Vector2(0.125, 0.5),
			new THREE.Vector2(0.0625, 0.5),
		];
		var rightLeg2Bottom = [
			new THREE.Vector2(0.125, 0.4375),
			new THREE.Vector2(0.1875, 0.4375),
			new THREE.Vector2(0.1875, 0.5),
			new THREE.Vector2(0.125, 0.5)
		];
		var rightLeg2Left = [
			new THREE.Vector2(0, 0.25),
			new THREE.Vector2(0.0625, 0.25),
			new THREE.Vector2(0.0625, 0.4375),
			new THREE.Vector2(0, 0.4375)
		];
		var rightLeg2Front = [
			new THREE.Vector2(0.0625, 0.25),
			new THREE.Vector2(0.125, 0.25),
			new THREE.Vector2(0.125, 0.4375),
			new THREE.Vector2(0.0625, 0.4375)
		];
		var rightLeg2Right = [
			new THREE.Vector2(0.125, 0.25),
			new THREE.Vector2(0.1875, 0.25),
			new THREE.Vector2(0.1875, 0.4375),
			new THREE.Vector2(0.125, 0.4375)
		];
		var rightLeg2Back = [
			new THREE.Vector2(0.1875, 0.25),
			new THREE.Vector2(0.25, 0.25),
			new THREE.Vector2(0.25, 0.4375),
			new THREE.Vector2(0.1875, 0.4375)
		];
		rightLeg2Box = new THREE.BoxGeometry(4.5, 13.5, 4.5, 0, 0, 0);
		rightLeg2Box.faceVertexUvs[0] = [];
		rightLeg2Box.faceVertexUvs[0][0] = [rightLeg2Right[3], rightLeg2Right[0], rightLeg2Right[2]];
		rightLeg2Box.faceVertexUvs[0][1] = [rightLeg2Right[0], rightLeg2Right[1], rightLeg2Right[2]];
		rightLeg2Box.faceVertexUvs[0][2] = [rightLeg2Left[3], rightLeg2Left[0], rightLeg2Left[2]];
		rightLeg2Box.faceVertexUvs[0][3] = [rightLeg2Left[0], rightLeg2Left[1], rightLeg2Left[2]];
		rightLeg2Box.faceVertexUvs[0][4] = [rightLeg2Top[3], rightLeg2Top[0], rightLeg2Top[2]];
		rightLeg2Box.faceVertexUvs[0][5] = [rightLeg2Top[0], rightLeg2Top[1], rightLeg2Top[2]];
		rightLeg2Box.faceVertexUvs[0][6] = [rightLeg2Bottom[0], rightLeg2Bottom[3], rightLeg2Bottom[1]];
		rightLeg2Box.faceVertexUvs[0][7] = [rightLeg2Bottom[3], rightLeg2Bottom[2], rightLeg2Bottom[1]];
		rightLeg2Box.faceVertexUvs[0][8] = [rightLeg2Front[3], rightLeg2Front[0], rightLeg2Front[2]];
		rightLeg2Box.faceVertexUvs[0][9] = [rightLeg2Front[0], rightLeg2Front[1], rightLeg2Front[2]];
		rightLeg2Box.faceVertexUvs[0][10] = [rightLeg2Back[3], rightLeg2Back[0], rightLeg2Back[2]];
		rightLeg2Box.faceVertexUvs[0][11] = [rightLeg2Back[0], rightLeg2Back[1], rightLeg2Back[2]];
		rightLeg2Mesh = new THREE.Mesh(rightLeg2Box, this.material2);
		rightLeg2Mesh.name = "rightLeg2"
		rightLeg2Mesh.position.y = -22;
		rightLeg2Mesh.position.x = -2;
 		this.scene.add(rightLeg2Mesh);
		
		// Left Leg Overlay Parts
		var leftLeg2Top = [
			new THREE.Vector2(0.0625, 0.1875),
			new THREE.Vector2(0.125, 0.1875),
			new THREE.Vector2(0.125, 0.25),
			new THREE.Vector2(0.0625, 0.25),
		];
		var leftLeg2Bottom = [
			new THREE.Vector2(0.125, 0.1875),
			new THREE.Vector2(0.1875, 0.1875),
			new THREE.Vector2(0.1875, 0.25),
			new THREE.Vector2(0.125, 0.25)
		];
		var leftLeg2Left = [
			new THREE.Vector2(0, 0),
			new THREE.Vector2(0.0625, 0),
			new THREE.Vector2(0.0625, 0.1875),
			new THREE.Vector2(0, 0.1875)
		];
		var leftLeg2Front = [
			new THREE.Vector2(0.0625, 0),
			new THREE.Vector2(0.125, 0),
			new THREE.Vector2(0.125, 0.1875),
			new THREE.Vector2(0.0625, 0.1875)
		];
		var leftLeg2Right = [
			new THREE.Vector2(0.125, 0),
			new THREE.Vector2(0.1875, 0),
			new THREE.Vector2(0.1875, 0.1875),
			new THREE.Vector2(0.125, 0.1875)
		];
		var leftLeg2Back = [
			new THREE.Vector2(0.1875, 0),
			new THREE.Vector2(0.25, 0),
			new THREE.Vector2(0.25, 0.1875),
			new THREE.Vector2(0.1875, 0.1875)
		];
		var leftLeg2Box = new THREE.BoxGeometry(4.5, 13.5, 4.5, 0, 0, 0);
		leftLeg2Box.faceVertexUvs[0] = [];
		leftLeg2Box.faceVertexUvs[0][0] = [leftLeg2Right[3], leftLeg2Right[0], leftLeg2Right[2]];
		leftLeg2Box.faceVertexUvs[0][1] = [leftLeg2Right[0], leftLeg2Right[1], leftLeg2Right[2]];
		leftLeg2Box.faceVertexUvs[0][2] = [leftLeg2Left[3], leftLeg2Left[0], leftLeg2Left[2]];
		leftLeg2Box.faceVertexUvs[0][3] = [leftLeg2Left[0], leftLeg2Left[1], leftLeg2Left[2]];
		leftLeg2Box.faceVertexUvs[0][4] = [leftLeg2Top[3], leftLeg2Top[0], leftLeg2Top[2]];
		leftLeg2Box.faceVertexUvs[0][5] = [leftLeg2Top[0], leftLeg2Top[1], leftLeg2Top[2]];
		leftLeg2Box.faceVertexUvs[0][6] = [leftLeg2Bottom[0], leftLeg2Bottom[3], leftLeg2Bottom[1]];
		leftLeg2Box.faceVertexUvs[0][7] = [leftLeg2Bottom[3], leftLeg2Bottom[2], leftLeg2Bottom[1]];
		leftLeg2Box.faceVertexUvs[0][8] = [leftLeg2Front[3], leftLeg2Front[0], leftLeg2Front[2]];
		leftLeg2Box.faceVertexUvs[0][9] = [leftLeg2Front[0], leftLeg2Front[1], leftLeg2Front[2]];
		leftLeg2Box.faceVertexUvs[0][10] = [leftLeg2Back[3], leftLeg2Back[0], leftLeg2Back[2]];
		leftLeg2Box.faceVertexUvs[0][11] = [leftLeg2Back[0], leftLeg2Back[1], leftLeg2Back[2]];
		leftLeg2Mesh = new THREE.Mesh(leftLeg2Box, this.material2);
		leftLeg2Mesh.name = "leftLeg2";
		leftLeg2Mesh.position.y = -22;
		leftLeg2Mesh.position.x = 2;
 		this.scene.add(leftLeg2Mesh);
		
 		this.rendered = new THREE.WebGLRenderer({alpha: true});
		this.rendered.setSize(this.width, this.height);
		this.rendered.setClearColor(this.backgroundColor, 0);
	};
	
	//Создать блок
	this.createBlock = function(pathToBlockTexture) {
		this.blockTexture = new THREE.ImageUtils.loadTexture(pathToBlockTexture);
		this.blockTexture.magFilter = THREE.NearestFilter;
		this.blockTexture.minFilter = THREE.NearestMipMapNearestFilter;
		
		var block = new THREE.BoxGeometry(16, 16, 16, 0, 0, 0);
		var blockSide = [
			new THREE.Vector2(0, 0),
			new THREE.Vector2(1/3, 0),
			new THREE.Vector2(1/3, 1),
			new THREE.Vector2(0, 1)
		];
		var blockTop = [
			new THREE.Vector2(1/3, 0),
			new THREE.Vector2(2/3, 0),
			new THREE.Vector2(2/3, 1),
			new THREE.Vector2(1/3, 1)
		];
		var blockBottom = [
			new THREE.Vector2(2/3, 0),
			new THREE.Vector2(3/3, 0),
			new THREE.Vector2(3/3, 1),
			new THREE.Vector2(2/3, 1)
		];
		block.faceVertexUvs[0] = [];
		block.faceVertexUvs[0][0] = [blockSide[3], blockSide[0], blockSide[2]];
		block.faceVertexUvs[0][1] = [blockSide[0], blockSide[1], blockSide[2]];
		block.faceVertexUvs[0][2] = [blockSide[3], blockSide[0], blockSide[2]];
		block.faceVertexUvs[0][3] = [blockSide[0], blockSide[1], blockSide[2]];
		block.faceVertexUvs[0][4] = [blockTop[3], blockTop[0], blockTop[2]];
		block.faceVertexUvs[0][5] = [blockTop[0], blockTop[1], blockTop[2]];
		block.faceVertexUvs[0][6] = [blockBottom[3], blockBottom[0], blockBottom[2]];
		block.faceVertexUvs[0][7] = [blockBottom[0], blockBottom[1], blockBottom[2]];
		block.faceVertexUvs[0][8] = [blockSide[3], blockSide[0], blockSide[2]];
		block.faceVertexUvs[0][9] = [blockSide[0], blockSide[1], blockSide[2]];
		block.faceVertexUvs[0][10] = [blockSide[3], blockSide[0], blockSide[2]];
		block.faceVertexUvs[0][11] = [blockSide[0], blockSide[1], blockSide[2]];
		
	}
	
	//Создать плащ
	this.createCloak  = function(cloakPath) {
		this.cloakTexture = new THREE.ImageUtils.loadTexture(cloakPath);
		this.cloakTexture.magFilter = THREE.NearestFilter;
		this.cloakTexture.minFilter = THREE.NearestMipMapNearestFilter;
		var cloak = new THREE.BoxGeometry(10, 16, 1, 0, 0, 0);
		
		var _this = this;
		this.cloakTexture.image.onload = function()
		{
			var wMax = 22, hMax = 17, addHeight = 0;
			if ( _this.cloakTexture.image.width != 22 || _this.cloakTexture.image.height != 17 ) {
				wMax = 64, hMax = 32, addHeight = 15/hMax;
			}
			var cloakRight = [
				new THREE.Vector2(0, addHeight),
				new THREE.Vector2(1/wMax, addHeight),
				new THREE.Vector2(1/wMax, 16/hMax + addHeight),
				new THREE.Vector2(0, 16/hMax + addHeight)
			];
			var cloakLeft = [
				new THREE.Vector2(1/wMax + 10/wMax, addHeight),
				new THREE.Vector2(2/wMax + 10/wMax, addHeight),
				new THREE.Vector2(2/wMax + 10/wMax, 16/hMax + addHeight),
				new THREE.Vector2(1/wMax + 10/wMax, 16/hMax + addHeight)
			];
			var cloakTop = [
				new THREE.Vector2(1/wMax, 16/hMax + addHeight),
				new THREE.Vector2(1/wMax + 10/wMax, 16/hMax + addHeight),
				new THREE.Vector2(1/wMax + 10/wMax, 17/hMax + addHeight),
				new THREE.Vector2(1/wMax, 17/hMax + addHeight)
			];
			var cloakBottom = [
				new THREE.Vector2(1/wMax + 10/wMax, 16/hMax + addHeight),
				new THREE.Vector2(21/wMax, 16/hMax + addHeight),
				new THREE.Vector2(21/wMax, 17/hMax + addHeight),
				new THREE.Vector2(1/wMax + 10/wMax, 17/hMax + addHeight)
			];
			var cloakFront = [
				new THREE.Vector2(2/wMax + 10/wMax, addHeight),
				new THREE.Vector2(22/wMax, addHeight),
				new THREE.Vector2(22/wMax, 16/hMax + addHeight),
				new THREE.Vector2(2/wMax + 10/wMax, 16/hMax + addHeight)
			];
			var cloakBack = [
				new THREE.Vector2(1/wMax, addHeight),
				new THREE.Vector2(1/wMax + 10/wMax, addHeight),
				new THREE.Vector2(1/wMax + 10/wMax, 16/hMax + addHeight),
				new THREE.Vector2(1/wMax, 16/hMax + addHeight)
			];
			cloak.faceVertexUvs[0] = [];
			cloak.faceVertexUvs[0][0] = [cloakRight[3], cloakRight[0], cloakRight[2]];
			cloak.faceVertexUvs[0][1] = [cloakRight[0], cloakRight[1], cloakRight[2]];
			cloak.faceVertexUvs[0][2] = [cloakLeft[3], cloakLeft[0], cloakLeft[2]];
			cloak.faceVertexUvs[0][3] = [cloakLeft[0], cloakLeft[1], cloakLeft[2]];
			cloak.faceVertexUvs[0][4] = [cloakTop[3], cloakTop[0], cloakTop[2]];
			cloak.faceVertexUvs[0][5] = [cloakTop[0], cloakTop[1], cloakTop[2]];
			cloak.faceVertexUvs[0][6] = [cloakBottom[3], cloakBottom[0], cloakBottom[2]];
			cloak.faceVertexUvs[0][7] = [cloakBottom[0], cloakBottom[1], cloakBottom[2]];
			cloak.faceVertexUvs[0][8] = [cloakFront[3], cloakFront[0], cloakFront[2]];
			cloak.faceVertexUvs[0][9] = [cloakFront[0], cloakFront[1], cloakFront[2]];
			cloak.faceVertexUvs[0][10] = [cloakBack[3], cloakBack[0], cloakBack[2]];
			cloak.faceVertexUvs[0][11] = [cloakBack[0], cloakBack[1], cloakBack[2]];
			
			cloakMesh = new THREE.Mesh(cloak, new THREE.MeshBasicMaterial({map: _this.cloakTexture, transparent: true, side: THREE.FrontSide}));
			cloakMesh.name = "cloak";
			cloakMesh.position.y = -4.5;
			cloakMesh.position.z = -2.5;
			cloakMesh.translateY(-7.5)
			_this.scene.add(cloakMesh);
		};
		
		this.cloakTexture.image.onerror = function() {
			_this.cloakTexture = null;
		};
	}
	
	//Удалить плащ
	this.removeCloak = function() {
		if ( !this.IsCloak() ) return false;
		this.scene.remove( cloakMesh );
		this.cloakTexture.image = null;
		this.cloakTexture = null;
		cloakMesh = null;
	};
	
	//Проверить наличие плаща
	this.IsCloak = function() {
		return (cloakMesh != null ? true : false)
	};
	
	//Фикс + добавление текстуры на вторые руку и ногу
	this.skin2D = {
		
		complete: function(context, _this)
		{
			this.that = _this;
			this.k = this.that.img.width / 64;
			
			this.Convert6432To6464(context);
			this.FixNonVisible(context);
			this.FixOverlay(context);
		},
		
		FixOverlay: function(context)
		{
			this.FixHead2(context);
			this.FixBody2(context);
			this.FixRightArm2(context);
			this.FixLeftArm2(context);
			this.FixRightLeg2(context);
			this.FixLeftLeg2(context);
		},
		
		FixHead2: function(context)
		{
			// Front
			if(this.HasTransparency(context, 40, 8, 8, 8)) return;
			
			// Top, Bottom, Right, Left, Back
			if(this.HasTransparency(context, 40, 0, 8, 8)) return;
			if(this.HasTransparency(context, 48, 0, 8, 8)) return;
			if(this.HasTransparency(context, 32, 8, 8, 8)) return;
			if(this.HasTransparency(context, 48, 8, 8, 8)) return;
			if(this.HasTransparency(context, 56, 8, 8, 8)) return;
			
			// Didn't have transparency, clearing the head overlay area.
			context.clearRect(40, 0, 8, 8);
			context.clearRect(48, 0, 8, 8);
			context.clearRect(32, 8, 8, 8);
			context.clearRect(40, 8, 8, 8);
			context.clearRect(48, 8, 8, 8);
			context.clearRect(56, 8, 8, 8);
		},
		
		FixBody2: function(context)
		{
			// Front
			if(this.HasTransparency(context, 20, 36, 8, 12)) return;
			
			// Top, Bottom, Right, Left, Back
			if(this.HasTransparency(context, 20, 32, 8, 4)) return;
			if(this.HasTransparency(context, 28, 32, 8, 4)) return;
			if(this.HasTransparency(context, 16, 36, 4, 12)) return;
			if(this.HasTransparency(context, 28, 36, 4, 12)) return;
			if(this.HasTransparency(context, 32, 36, 8, 12)) return;
			
			// Didn't have transparency, clearing the body overlay area.
			context.clearRect(20, 32, 8, 4);
			context.clearRect(28, 32, 8, 4);
			context.clearRect(16, 36, 4, 12);
			context.clearRect(20, 36, 8, 12);
			context.clearRect(28, 36, 4, 12);
			context.clearRect(32, 36, 8, 12);
		},
		
		FixRightArm2: function(context)
		{
			// Front
			if(this.HasTransparency(context, 44, 36, 4, 12)) return;
			
			// Top, Bottom, Right, Left, Back
			if(this.HasTransparency(context, 44, 32, 4, 4)) return;
			if(this.HasTransparency(context, 48, 32, 4, 4)) return;
			if(this.HasTransparency(context, 40, 36, 4, 12)) return;
			if(this.HasTransparency(context, 48, 36, 4, 12)) return;
			if(this.HasTransparency(context, 52, 36, 4, 12)) return;
			
			// Didn't have transparency, clearing the right arm overlay area.
			context.clearRect(44, 32, 4, 4);
			context.clearRect(48, 32, 4, 4);
			context.clearRect(40, 36, 4, 12);
			context.clearRect(44, 36, 4, 12);
			context.clearRect(48, 36, 4, 12);
			context.clearRect(52, 36, 4, 12);
		},
		
		FixLeftArm2: function(context)
		{
			// Front
			if(this.HasTransparency(context, 52, 52, 4, 12)) return;
			
			// Top, Bottom, Right, Left, Back
			if(this.HasTransparency(context, 52, 48, 4, 4)) return;
			if(this.HasTransparency(context, 56, 48, 4, 4)) return;
			if(this.HasTransparency(context, 48, 52, 4, 12)) return;
			if(this.HasTransparency(context, 56, 52, 4, 12)) return;
			if(this.HasTransparency(context, 60, 52, 4, 12)) return;
			
			// Didn't have transparency, clearing the left arm overlay area.
			context.clearRect(52, 48, 4, 4);
			context.clearRect(56, 48, 4, 4);
			context.clearRect(48, 52, 4, 12);
			context.clearRect(52, 52, 4, 12);
			context.clearRect(56, 52, 4, 12);
			context.clearRect(60, 52, 4, 12);
		},
		
		FixRightLeg2: function(context)
		{
			// Front
			if(this.HasTransparency(context, 4, 36, 4, 12)) return;
			
			// Top, Bottom, Right, Left, Back
			if(this.HasTransparency(context, 4, 32, 4, 4)) return;
			if(this.HasTransparency(context, 8, 32, 4, 4)) return;
			if(this.HasTransparency(context, 0, 36, 4, 12)) return;
			if(this.HasTransparency(context, 8, 36, 4, 12)) return;
			if(this.HasTransparency(context, 12, 36, 4, 12)) return;
			
			// Didn't have transparency, clearing the right leg overlay area.
			context.clearRect(4, 32, 4, 4);
			context.clearRect(8, 32, 4, 4);
			context.clearRect(0, 36, 4, 12);
			context.clearRect(4, 36, 4, 12);
			context.clearRect(8, 36, 4, 12);
			context.clearRect(12, 36, 4, 12);
		},
		
		FixLeftLeg2: function(context)
		{
			// Front
			if(this.HasTransparency(context, 4, 52, 4, 12)) return;
			
			// Top, Bottom, Right, Left, Back
			if(this.HasTransparency(context, 4, 48, 4, 4)) return;
			if(this.HasTransparency(context, 8, 48, 4, 4)) return;
			if(this.HasTransparency(context, 0, 52, 4, 12)) return;
			if(this.HasTransparency(context, 8, 52, 4, 12)) return;
			if(this.HasTransparency(context, 12, 52, 4, 12)) return;
			
			// Didn't have transparency, clearing the left leg overlay area.
			context.clearRect(4, 48, 4, 4);
			context.clearRect(8, 48, 4, 4);
			context.clearRect(0, 52, 4, 12);
			context.clearRect(4, 52, 4, 12);
			context.clearRect(8, 52, 4, 12);
			context.clearRect(12, 52, 4, 12);
		},
		
		Convert6432To6464: function(context)
		{
			// Convert old format to new format
			this.Copy(context, 4, 16, 4, 4, 20, 48, true);	// Top Leg
			this.Copy(context, 8, 16, 4, 4, 24, 48, true);	// Bottom Leg
			this.Copy(context, 0, 20, 4, 12, 24, 52, true);	// Outer Leg
			this.Copy(context, 4, 20, 4, 12, 20, 52, true);	// Front Leg
			this.Copy(context, 8, 20, 4, 12, 16, 52, true);	// Inner Leg
			this.Copy(context, 12, 20, 4, 12, 28, 52, true);	// Back Leg
			
			this.Copy(context, 44, 16, 4, 4, 36, 48, true);	// Top Arm
			this.Copy(context, 48, 16, 4, 4, 40, 48, true);	// Bottom Arm
			this.Copy(context, 40, 20, 4, 12, 40, 52, true);	// Outer Arm
			this.Copy(context, 44, 20, 4, 12, 36, 52, true);	// Front Arm
			this.Copy(context, 48, 20, 4, 12, 32, 52, true);	// Inner Arm
			this.Copy(context, 52, 20, 4, 12, 44, 52, true);	// Back Arm
		},
		
		FixNonVisible: function(context)
		{
			// 64x32 and 64x64 skin parts
			context.clearRect(0, 0, 8, 8);
			context.clearRect(24, 0, 16, 8);
			context.clearRect(56, 0, 8, 8);
			context.clearRect(0, 16, 4, 4);
			context.clearRect(12, 16, 8, 4);
			context.clearRect(36, 16, 8, 4);
			context.clearRect(52, 16, 4, 4);
			context.clearRect(56, 16, 8, 32);
			
			// 64x64 skin parts
			context.clearRect(0, 32, 4, 4);
			context.clearRect(12, 32, 8, 4);
			context.clearRect(36, 32, 8, 4);
			context.clearRect(52, 32, 4, 4);
			context.clearRect(0, 48, 4, 4);
			context.clearRect(12, 48, 8, 4);
			context.clearRect(28, 48, 8, 4);
			context.clearRect(44, 48, 8, 4);
			context.clearRect(60, 48, 8, 4);
		},
		
		HasTransparency: function(context, x, y, w, h)
		{
			x *= this.k, y *= this.k, w *= this.k, h *= this.k;
			var imgData = context.getImageData(x, y, w, h);
		
			for(y = 0; y < h; y++) {
				for(x = 0; x < w; x++) {
					var index = (x + y * w) * 4;
					if(imgData.data[index + 3] == 0) return true;	// Has transparency
				}
			}
			
			return false;
		},
		
		Copy: function(context, sX, sY, w, h, dX, dY, flipHorizontal)
		{
			sX *= this.k, sY *= this.k, w *= this.k, h *= this.k, dX *= this.k, dY *= this.k;
			var imgData = context.getImageData(sX, sY, w, h);
		
			if(flipHorizontal)
			{
				// Flip horizontal
				for(y = 0; y < h; y++) {
					for(x = 0; x < (w / 2); x++) {
						index = (x + y * w) * 4;
						index2 = ((w - x - 1) + y * w) * 4;
						var pA1 = imgData.data[index];
						var pA2 = imgData.data[index+1];
						var pA3 = imgData.data[index+2];
						var pA4 = imgData.data[index+3];
						
						var pB1 = imgData.data[index2];
						var pB2 = imgData.data[index2+1];
						var pB3 = imgData.data[index2+2];
						var pB4 = imgData.data[index2+3];
						
						imgData.data[index] = pB1;
						imgData.data[index+1] = pB2;
						imgData.data[index+2] = pB3;
						imgData.data[index+3] = pB4;
						
						imgData.data[index2] = pA1;
						imgData.data[index2+1] = pA2;
						imgData.data[index2+2] = pA3;
						imgData.data[index2+3] = pA4;
					}
				}
			}
			
			context.putImageData(imgData,dX,dY);
		}
	}
	
	//События мыши
	this.MouseCoords = {
		getX: function(e)
		{
			if (e.pageX)
			{
				return e.pageX - (document.documentElement.scrollLeft || document.body.scrollLeft);
			}
			else if (e.clientX)
			{
				return e.clientX+(document.documentElement.scrollLeft || document.body.scrollLeft) - document.documentElement.clientLeft;
			}

			return 0;
		},
		
		getY: function(e)
		{
			if (e.pageY)
			{
				return e.pageY - (document.documentElement.scrollTop || document.body.scrollTop);
			}
			else if (e.clientY)
			{
				return e.clientY+(document.documentElement.scrollTop || document.body.scrollTop) - document.documentElement.clientTop;
			}

			return 0;
		}
	}
	
	//Написать в консоль
	this.write = function(message) {
		console.log("3D skin viewer: " + message);
	};
	
	this.GetCTX = function(canvas)
	{
		if (canvas == null)
		{
			return false;
		}
		var names = ["2d", "webgl", "experimental-webgl", "webkit-3d", "moz-webgl"];
		var ctx = null;
		for (var i = 0; i < names.length; ++i) 
		{
			try 
			{
				ctx = canvas.getContext(names[i]);
			} 
			catch(e) {}
			if (ctx) 
				break;
		}
		if (ctx == null)
		{
			return false;
		}
		else
		{
			return ctx;
		}
	};
	
	this.loadFail = function(errorCode) {
		this.write('do not work 3D skin viewer. Use the 2D. Error code ' + errorCode);
	};
	
	//Иницилизация объекта
	//this.init();
}