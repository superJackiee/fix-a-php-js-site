(function() {
"use strict"

	function qs(el) {
		return document.querySelector(el);
	}
	const inch = 25.4,
		
		inchQuote = '"';
	let mm = document.documentElement.getAttribute('lang') === 'is' ? ' мм' : ' mm';
	let measurement = mm;

	let table = qs('#results'),
		//selects
		tireDiameterOld = qs('#tire_diameter_old'),
		tireDiameterNew = qs('#tire_diameter_new'),

		tireHeightOld = qs('#tire_height_old'),
		tireHeightNew = qs('#tire_height_new'),

		tireWidthOld = qs('#tire_width_old'),
		tireWidthNew = qs('#tire_width_new'),

		//table rows
		diameter = qs('#diameter'),
		width = qs('#width'),
		circumference = qs('#circumference'),
		sidewallHeight = qs('#sidewall_height'),
		rev = qs('#rev'),
		clearence = qs('#clearence'),
		resMsg = qs('#result-message'),

		//classes for insertions
		oldClass = '.old',
		newClass = '.new',
		diffClass = '.diff',

		hiddenArea = qs('.hidden-area'),
		
		//wrapper layouts of tires
		oldSide = qs('.img-old-side'),
		oldFront = qs('.img-old-front'),
		newSide = qs('.img-new-side'),
		newFront = qs('.img-new-front'),

		oldSideTire = oldSide.querySelector('.rubber_side'),
		oldSideDisc = oldSideTire.querySelector('.disc'),
		oldFrontTire = oldFront.querySelector('.rubber_front'),

		oldSideTireDescrV = oldSideTire.querySelector('.descr-v'),
		oldSideTireDescrH = oldSideTire.querySelector('.descr-h'),
		oldFrontTireDescrH = oldFrontTire.querySelector('.descr-h'),

		newSideTire = newSide.querySelector('.rubber_side'),
		newSideDisc = newSideTire.querySelector('.disc'),
		newFrontTire = newFront.querySelector('.rubber_front'),

		newSideTireDescrV = newSideTire.querySelector('.descr-v'),
		newSideTireDescrH = newSideTire.querySelector('.descr-h'),
		newFrontTireDescrH = newFrontTire.querySelector('.descr-h'),

		dmsOldHeight = oldSideTire.querySelector('.old-side-height'),
		dmsNewHeight = newSideTire.querySelector('.new-side-height'),
	
		//speed
		speedometer = qs('.speed-wrap'),

		deviceSpeedDeg = qs('#device-speed'),
		realSpeedDeg = qs('#real-speed'),
		deviceSpeedVal = qs('#device-value'),
		realValue = qs('#real-value'),
	
		//buttons
		mmBtn = qs('#mm'),
		inchBtn = qs('#inches'),
		calcBtn = qs('#calc_button'),
		switcher = qs('#switch-bg'),
		up = qs('#up'),
		down = qs('#down'),

		
		tableMethods = {
			//msgText: 'Диаметр отличается в пределах 3%',
			//warningTxt: 'Диаметр отличается более чем на 3%. Это опасно!',
			imgWidth: 200,
			diamTxt: function() {
				if (document.documentElement.getAttribute('lang') === 'is') {
					return 'Þvermál';
				} else {
					return 'Diameter';
				}
			},
			sideHeightTxt: function() {
				if (document.documentElement.getAttribute('lang') === 'is') {
					return 'Hæð/Prófíll';
				} else {
					return 'Sidewall';
				}
			},
			widthTxt: function() {
				if (document.documentElement.getAttribute('lang') === 'is') {
					return 'Breidd hjólbarða';
				} else {
					return 'Tire width';
				}
			},
			maxSpeed: 120,
			minSpeed: 0,
			defaultSpeed: 60,
			//initSpeedTxt: 'Фактические показания спидометра, км/ч',
			//realSpeedTxt: 'Реальная скорость, км/ч',

			fillTable: function(selector, oldValue, newValue) {
				let diff, sign, img = '', msr = measurement;
				let percent = this.setPercentage(oldValue, newValue);

				sign = oldValue - newValue >= 0 ? '' : sign = '+';
				if (percent === 0) sign = '';

				if (selector === diameter) {
					if (Math.abs(percent) <= 3) {
						img = '<img src="images/check-mark.svg">';
					} else {
						if (resMsg) {
							img = '<img src="images/exclamation-mark.svg">';
							resMsg.style.backgroundColor = '#ff3046';
							resMsg.innerText = this.warningTxt;
						}
						
					}	
				}

				if (selector !== rev) {
					oldValue = this.convertMeasures(oldValue);
					newValue = this.convertMeasures(newValue);
					msr = measurement;
				} else {
					oldValue = Math.round(oldValue);
					newValue = Math.round(newValue);
					msr = '';
				}
				
				if (msr === inchQuote) {
					diff = (newValue - oldValue).toFixed(1);
				} else {
					diff = newValue - oldValue;
				}

				selector.querySelector(oldClass).innerText = 
					oldValue + msr;
				selector.querySelector(newClass).innerText = 
					newValue + msr;
				selector.querySelector(diffClass).innerHTML = 
					diff + msr + ' (' + sign + percent + '%)' + 
					' ' + img;

			},

			setPercentage: function(a, b) {
				return Math.round((b - a) / a * 100);
			},

			convertMeasures: function(arg) {
				if (measurement === mm) {
					return Math.round(arg);
				} else {
					return (arg / inch).toFixed(1);
				}
			},

			getTableParams: function() {	

				//VALUE FROM SELECT
				this.oldDiscDiam = tireDiameterOld.value;
				this.newDiscDiam = tireDiameterNew.value;

				this.oldProfileHeight = tireHeightOld.value;
				this.newProfileHeight = tireHeightNew.value;

				this.oldWidth = tireWidthOld.value;
				this.newWidth = tireWidthNew.value;

				//CALCULATED VALUES
				this.oldHeight = this.oldWidth * this.oldProfileHeight / 100;
				this.newHeight = this.newWidth * this.newProfileHeight / 100;

				this.oldDiscDiamMM = this.oldDiscDiam * inch;
				this.newDiscDiamMM = this.newDiscDiam * inch;

				this.oldDiam = this.oldHeight * 2 + this.oldDiscDiamMM;
				this.newDiam = this.newHeight * 2 + this.newDiscDiamMM;

				this.oldCirc = Math.PI * this.oldDiam;
				this.newCirc = Math.PI * this.newDiam;

				this.oldRevs = Math.round(1000000 / this.oldCirc);
				this.newRevs = Math.round(1000000 / this.newCirc);

				this.diffDiam = this.newDiam - this.oldDiam;

				this.diamRate = this.newDiam/this.oldDiam;

			},

			setTableParams: function() {
				this.fillTable(diameter, this.oldDiam, this.newDiam);
				this.fillTable(width, this.oldWidth, this.newWidth);
				this.fillTable(circumference, this.oldCirc, this.newCirc);
				this.fillTable(sidewallHeight, this.oldHeight, this.newHeight);
				this.fillTable(rev, this.oldRevs, this.newRevs);
				clearence.querySelector(diffClass).innerText = 
					this.convertMeasures(this.diffDiam / 2) + measurement;
			},

			getImageParams: function() {
				/*
				 *calculate what tire is the largest and set it 
				 *diameter = this.imgWidth (default 200). Another
				 *tire get scaled diameter
				 */
				this.scaledOldDiam = (this.oldDiam > this.newDiam) ? 
					this.imgWidth : this.imgWidth / (this.newDiam / this.oldDiam);
				this.scaledNewDiam = (this.oldDiam > this.newDiam) ? 
					this.imgWidth / (this.oldDiam / this.newDiam) : this.imgWidth;

				this.scaledOldWidth = this.oldWidth * 
					this.scaledOldDiam / this.oldDiam;
				this.scaledNewWidth = this.newWidth * 
					this.scaledNewDiam / this.newDiam;


				this.scaledOldDiscDiam = this.oldDiscDiamMM * 
					this.scaledOldDiam / this.oldDiam;
				this.scaledNewDiscDiam = this.newDiscDiamMM * 
					this.scaledNewDiam / this.newDiam;
			},

			setImageParams: function() {
				//set width and height 
				//to the wrapper layouts of tires
				oldSide.style.width = newSide.style.width = 
				oldSide.style.height = newSide.style.height = 
				oldFront.style.width = newFront.style.width =
				this.imgWidth + 'px';

				oldFrontTire.style.height = 
					oldSideTire.style.width = 
					oldSideTire.style.height = 
					this.scaledOldDiam + 'px';

				oldFrontTire.style.width = 
					this.scaledOldWidth + 'px';

				oldSideDisc.style.width = 
					oldSideDisc.style.height = 
					this.scaledOldDiscDiam + 'px';

				//set dimensions of the new images
				newFrontTire.style.height = 
					newSideTire.style.width = 
					newSideTire.style.height = 
					this.scaledNewDiam + 'px';

				newFrontTire.style.width = 
					this.scaledNewWidth + 'px';

				newSideDisc.style.width =
					newSideDisc.style.height =
					this.scaledNewDiscDiam + 'px';

			},

			setImageTitles: function() {

				//set values to .descr-v ( < .*-diameter)
				oldSideTireDescrV.innerText = 
				this.diamTxt() + ' ' + this.convertMeasures(this.oldDiam) + measurement;
				newSideTireDescrV.innerText = 
				this.diamTxt() + ' ' + this.convertMeasures(this.newDiam) + measurement;

				//set values to .descr-h ( < .*-side-height)
				oldSideTireDescrH.innerText = 
				this.sideHeightTxt() + ' ' + this.convertMeasures(this.oldHeight) + measurement;
				newSideTireDescrH.innerText = 
				this.sideHeightTxt() + ' ' + this.convertMeasures(this.newHeight) + measurement;

				//set values to .descr-h ( < .*-width)
				oldFrontTireDescrH.innerText = 
				this.widthTxt() + ' ' + this.convertMeasures(this.oldWidth) + measurement;
				newFrontTireDescrH.innerText = 
				this.widthTxt() + ' ' + this.convertMeasures(this.newWidth) + measurement;

			},

			setImageTitlesWidth: function() {

				dmsOldHeight.style.width = 
					(this.scaledOldDiam - this.scaledOldDiscDiam) / 2 + 'px';

				dmsNewHeight.style.width = 
					(this.scaledNewDiam - this.scaledNewDiscDiam) / 2 + 'px';
			},

			setSpeedParams: function() {
				this.getSpeedDiff();
				this.setSpeedDiff();
				this.getArrowsDeg();
				this.setArrowsDeg();
			},

			getSpeedDiff: function() {

				this.initialSpeed = deviceSpeedVal.value;
				
				if (isNaN(this.initialSpeed)) this.initialSpeed = this.defaultSpeed;

				if (this.initialSpeed < this.minSpeed) this.initialSpeed = this.minSpeed;
				if (this.initialSpeed > this.maxSpeed) this.initialSpeed = this.maxSpeed;
				
				let speedRate = (1 - this.diamRate) * this.initialSpeed;
				this.realSpeed = (this.initialSpeed - speedRate).toFixed(1);
				
			},

			setSpeedDiff: function() {

				deviceSpeedVal.value = this.initialSpeed;
				realValue.innerText = this.realSpeed;
			},

			getArrowsDeg: function() {

				this.initialDeg = this.initialSpeed * 2 - 120;
				this.realDeg = this.realSpeed * 2 - 120;

				if (this.realDeg < -120) {
					this.realDeg = -120;
				} else if (this.realDeg > 120) {
					this.realDeg = 120;
				}
			},

			setArrowsDeg: function() {

				deviceSpeedDeg.style.transform = 
					'rotateZ(' + this.initialDeg + 'deg)';
				realSpeedDeg.style.transform = 
					'rotateZ(' + this.realDeg + 'deg)';
			},

			measureBtnClick: function(target, prop, translate, measure) {
				measurement = measure;

				inchBtn.className = mmBtn.className = "change-out",
				target.className = "change-in";

				switcher.style.transform = "translateX(" + 
					translate + ")";
				
				tableMethods.setTableParams();
				tableMethods.setImageTitles();
			},

			speedBtnClick: function(target) {
				let longPress;

				function count() {
					target === up ? deviceSpeedVal.value++ : 
						deviceSpeedVal.value--;
					tableMethods.setSpeedParams();
				}

				target.addEventListener('click', function() {
					count();
				});
				
				target.addEventListener('mousedown', function() {
					longPress = window.setInterval(function() {
						count();
					}, 100);
				});

				target.addEventListener('mouseup', function() {
					clearInterval(longPress);
				});
						
			},

			speedValChange: function() {
				deviceSpeedVal.addEventListener('change', function() {
					tableMethods.setSpeedParams();
				});
			}, 
			calc: function() {
				//mm = document.body.getAttribute('lang') === 'is' ? ' мм' : ' mm';
				tableMethods.getTableParams();
				tableMethods.setTableParams();

				tableMethods.getImageParams();
				tableMethods.setImageParams();

				tableMethods.setImageTitles();
				tableMethods.setImageTitlesWidth();
			
			
				tableMethods.setSpeedParams();
				
			}
		};

	window.addEventListener('load', function() {
		tableMethods.calc();
		tableMethods.speedBtnClick(up);
		tableMethods.speedBtnClick(down);
		tableMethods.speedValChange();

		inchBtn.addEventListener('click', function() {
		tableMethods.measureBtnClick(this, 
			tableMethods.inchProps, '100%', inchQuote);
		});
		mmBtn.addEventListener('click', function() {
			tableMethods.measureBtnClick(this, 
				tableMethods.mmProps, '0', mm);
		});
		calcBtn.addEventListener('click', function() {
			
			tableMethods.calc();
		});
	});
	function long(go) {
		
		let framecount = 0;
		let fps, fpsInterval, startTime, now, then, elapsed;

		longPress(5)

		function longPress(fps) {
			fpsInterval = 1000 / fps;
			then = Date.now();
			startTime = then;
			console.log(startTime);
			count();
		}

		function count() {
			if (go === false) cancelAnimationFrame(count);
			requestAnimationFrame(count);
			now = Date.now();
			elapsed = now - then;

			if (elapsed > fpsInterval) {
				then = now - (elapsed % fpsInterval);

				let sinceStart = now - startTime;

				console.log((sinceStart / 1000 * 100)/100)

				target === up ? deviceSpeedVal.value++ : 
					deviceSpeedVal.value--;
				tableMethods.setSpeedParams();
			}
		}
	}

})();
