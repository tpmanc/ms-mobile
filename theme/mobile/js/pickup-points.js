$(function(){
	if (window.ymaps != undefined) {
		var myMap;
		var coords;
		var myCollection;
		var adressArr=[];

		ymaps.ready(init);

		function init() {
			var $selected = $('#pickupPointsCitySelector option:selected');
			var centerArr = $selected.data('center').split(',');
			adressArr = [];
			adressArr = $selected.data('adresses').split('&');
			var mapZoom = $selected.data('zoom');

			myMap = new ymaps.Map("mapHolder", {
				center: centerArr,
				zoom: mapZoom,
				controls: ['smallMapDefaultSet']
			});
			myMap.behaviors.disable('scrollZoom');

			myCollection = new ymaps.GeoObjectCollection();
			myMap.setCenter(centerArr);
			myMap.setZoom(mapZoom);
			$('.metroHolder').hide();
			if ($selected.text() != 'Москва') {
				getMap(adressArr);
			} else {
				$('#pickupPointsList').html('<li class="disabled">
					<span>Пункты самовывоза в Москве временно не работают. 
					Приносим свои извинения за предоставленные неудобства.
					</span></li>');
			}
		}
		
		
		function getMap(adressArr){
			myCollection.removeAll();
			myCollection = new ymaps.GeoObjectCollection();
			$('#pickupPointsList').empty();

			var metroArr = [];
			var pickupPointsListStr = ''; // список пунктов самовывоза надо картой
			
			$(adressArr).each(function(i, e){
				if (e == "") {
					adressArr.splice(i, 1);
				}
				var color;
				if (e.indexOf('#') == -1) {
					color = 'blue';
				} else {
					color = e.substr(e.indexOf('#')+1);
					e = e.substr(0, e.indexOf('#'));
					pickupPointsListStr += '<li><span>' + e + '</span></li>';
				}
				$('#pickupPointsList').append('<li><span>' + e + '</span></li>');
				var myGeocoder = ymaps.geocode(e);
				var point = $('#pickupPointsList li:contains("' + e + '")');
					
				myGeocoder.then(
					function (res) {
						coords = res.geoObjects.get(0).geometry.getCoordinates();
						var myGeocoder = ymaps.geocode(coords, {kind: 'house'});

						// Находим ближайшую станцию метро
						var index = e.indexOf("метро");
						var city = res.geoObjects.get(0).properties.get('metaDataProperty.GeocoderMetaData.AddressDetails.Country.AdministrativeArea.SubAdministrativeArea.Locality.LocalityName');

						if (
								index < 0 && 
								(
									e.indexOf("Москва") > -1 || 
									e.indexOf("Санкт-Петербург") > -1 || 
									e.indexOf("Нижний Новгород") > -1 || 
									e.indexOf("Новосибирск") > -1 || 
									e.indexOf("Самара") > -1 || 
									e.indexOf("Екатеринбург") > -1 || 
									e.indexOf("Казань") > -1
								)
							) {
							var metro = ymaps.geocode(coords,{kind: 'metro', results: 1 });
							metro.then(
								function(rs) {
									var nearest = rs.geoObjects.get(0);
									var mName = nearest.properties.get('name').replace("метро ", "");
									if (mName == "станция канатной дороги Нижегородская") {
										mName = "Горьковская";
									}
									point.data('metro', mName);
									if ($.inArray(mName, metroArr) == -1){
										metroArr.push(mName);
									}
									metroArr.sort();
									var metroStr = '<option selected="selected"></option>';
									$(metroArr).each(function(ind, el){
										metroStr += '<option>' + el + '</option>';
									});
									$('.metroHolder').show();
									$('#metroSelector').empty().html(metroStr);
								}
							); 
						}


					myCollection.add(new ymaps.Placemark(coords, {
							balloonContent: e
						},{
							hideIconOnBalloonOpen: true,
							preset: 'twirl#Icon',
							iconColor: color
						}
					));
				});
			});

			myMap.geoObjects.add(myCollection);
		}

		$('select.userCitySelector').on('change', function(){
			var $this = $(this);
			var cityName = $this.find('option:selected').text();
			var regionName = $this.find('option:selected').data('region');
			$('select.userCitySelector').each(function(i, e){
				$(e).find('option').each(function(ind, el){
					if ($(el).text().trim() == cityName.trim()) {
						$(el).prop('selected', true);
					}
				});
			});
			setCookie('selectedCity', encodeURI(cityName)+'|'+encodeURI(regionName), '', '/');

			var selector = $('#pickupPointsCitySelector');
			var centerStr = selector.find('option:selected').data('center');
			if (centerStr != '') {
				myMap.setCenter(centerStr.split(','));
			}

			var zoomStr = selector.find('option:selected').data('zoom');
			if (zoomStr != '') {
				myMap.setZoom(zoomStr);
			}

			$('.metroHolder').hide();
			if (selector.find('option:selected').text() != 'Москва') {
				var adressStr = selector.find('option:selected').data('adresses');
				if (adressStr != '') {
					getMap(adressStr.split('&'));
				} else {
					$('#pickupPointsList').empty();
				}
			} else {
				$('#pickupPointsList').html('<li class="disabled"><span>Временно не работают!</span></li>');
			}
		});

		// --- выбор метро ---
		$("#metroSelector").on('change', function(){
			var metroName = $(this).find('option:selected').text();
			$("#pickupPointsList li").hide();
			if (metroName == '') {
				$("#pickupPointsList li").show();
			} else {
				$('#pickupPointsList li').each(function(i, e){
					if ($(e).data('metro') == metroName) {
						$(e).show();
					}
				});
			}
		});
		// --- /выбор метро ---



		// --- выбор пункта ---
		$("#pickupPointsList").on('click', 'li', function(){
			$("#pickupPointsList .activePoint").removeClass('activePoint');
			$(this).addClass('activePoint');
			var adress = $(this).text();
			var myGeocoder = ymaps.geocode(adress);

			// скролим к карте
			var off = $('#mapHolder').offset().top - 30;
			$('body').animate({scrollTop: off}, 400);

			// запрос на получение центра
			myGeocoder.then(function(res){
				var center = res.geoObjects.get(0).geometry.getCoordinates();
				myMap.setCenter(center);
				myMap.setZoom(16);
			});
		});
		// --- /выбор пункта ---
	}
});
