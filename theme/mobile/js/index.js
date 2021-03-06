function moneyFormat(nStr) {
	nStr += '';
	x = nStr.split('.');
	x1 = x[0];
	x2 = x.length > 1 ? '.' + x[1] : '';
	var rgx = /(\d+)(\d{3})/;
	while (rgx.test(x1)) {
		x1 = x1.replace(rgx, '$1' + ' ' + '$2');
	}
	return x1 + x2;
}
function setCookie(name, value, expires, path, domain, secure) {

	var exdate = new Date();
	exdate.setDate(exdate.getDate() + 30);

	document.cookie = name + "=" + escape(value) +
		((expires) ? "; expires=" + exdate.toGMTString() : "; expires=" + exdate.toGMTString()) +
		((path) ? "; path=" + path : "") +
		((domain) ? "; domain=" + domain : "") +
		((secure) ? "; secure" : "");
}
function getCookie(c_name) {
	if (document.cookie.length > 0) {
		c_start = document.cookie.indexOf(c_name + "=");
		if (c_start != -1) {
			c_start = c_start + c_name.length + 1;
			c_end = document.cookie.indexOf(";", c_start);
			if (c_end == -1) c_end = document.cookie.length;
			return unescape(document.cookie.substring(c_start, c_end));
		}
	}
	return "";
}

function isValidEmail(emailAddress) {
	var pattern = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);
	return pattern.test(emailAddress);
}

function parseProductsString(string) {
	var returnArray = [];

	if (string.length > 0) {
		var products = string.split('|');
		for (var i in products) {
			var temp = products[i].split(':');

			returnArray.push({
				'id': parseInt(temp[0]),
				'amount': parseInt(temp[1])
			});
		}
	}
	return returnArray;
}
function generateProductsString(products) {
	var tempArray = [];
	for (var i in products) {
		tempArray.push(products[i].id + ':' + products[i].amount);
	}
	return tempArray.join('|');
}
function addProductToBasket(productId, price) {
	//получим данные из кук
	var products = parseProductsString(getCookie('cart_products'));
	var totalAmount = parseInt(getCookie('total_amount'));
	if (!isNaN(totalAmount)) {
		totalAmount += price;
	} else {
		totalAmount = price;
	}

	//Если товар уже есть в куках, добавляем ему количество
	//Заодно подсчитаем количество всех товаров
	var foundSame = false;
	for (var i in products) {
		if (products[i].id == productId) {
			products[i].amount++;
			foundSame = true;
		}
	}
	if (!foundSame) {
		products.push({
			"id": productId,
			"amount": 1
		});
	}


	setCookie('cart_products', generateProductsString(products), '', '/');
	setCookie('total_amount', totalAmount, '', '/');
	//Изменить оформление
	refreshBasketInfo();
}

function deleteProductToBasket(productId, price) {
	var products = parseProductsString(getCookie('cart_products'));
	var newProducts = [];
	var totalAmount = parseInt(getCookie('total_amount'));

	if (isNaN(totalAmount)) {
		totalAmount = 0;
	}
	for (var i in products) {
		if (products[i].id == productId) {
			totalAmount -= price*products[i].amount;
		}else{
			newProducts.push({
					"id": products[i].id,
					"amount": products[i].amount
				});
		}
	}
	setCookie('cart_products', generateProductsString(newProducts), '', '/');
	setCookie('total_amount', totalAmount, '', '/');
	//Изменить оформление
	refreshBasketInfo(); 
}
function refreshBasketInfo() {
	//получим данные из кук
	var products = parseProductsString(getCookie('cart_products'));
	var totalAmount = parseInt(getCookie('total_amount'));
	if (isNaN(totalAmount)) {
		totalAmount = 0;
	}
	var productsCount = 0;
	for (var i in products) {
		productsCount += products[i].amount;
	}

	$('#basket .productCount').text(productsCount);
	$('#basketPrice').html(moneyFormat(totalAmount));
	$('#basketProductSumm').html(moneyFormat(totalAmount));
}
function recalculateBasket() {
	var productsCount = 0;
	var priceSumm = 0;
	var products = [];
	var amount, price, pid;

	var _break = false;
	//Блокируем изменение инпутов до завершения аякса
	$('.countHolder input').attr('disabled', 'disabled');

	$('.productList .elem').each(function (index, element) {
		if (_break == false) {
			amount = $(element).find('input.count').val();
			price = $(element).data('price');
			pid = $(element).data('id');

			if (parseInt(amount) <= 0 || amount == '') {
				$(element).find('input.count').val(1);
				amount = '1';
			}

			if (amount.match(/^[0-9]{1,3}$/)) {
				amount = parseInt(amount);
				productsCount += amount;
				priceSumm += parseInt(price) * amount;

				products.push({
					"id": pid,
					"amount": amount
				});
			} else {
				productsCount = '-';
				priceSumm = '-';
				_break = true;
			}
		}
	});

	//Если ошибок не было
	if (_break == false) {
		//Записываем куки
		setCookie('cart_products', generateProductsString(products), '', '/');
		setCookie('total_amount', priceSumm, '', '/');

		//Запрос на стоимость доставкаи и размер скидки
		$.ajax({
			url: '/ajax/basket.php?method=get_delivery_and_discount',
			type: 'POST',
			dataType: 'json',
			data: {"products": products},
			beforeSend: function () {},
			success: function (data) {
				if (parseInt(data.deliveryPrice) > 0) {
					$('#basketDeliveryPrice').text(data.deliveryPrice + ' руб.');
				} else {
					$('#basketDeliveryPrice').text('Бесплатно');
				}
				if (productsCount == 0) {
					$('.productList').hide();
					$('.summaryHolder').hide();
					$('.empty').show();
				}
				$('#basketProductCount').text(productsCount);
				$('#basketDiscount').text(data.discount + '%');
				var total = parseInt(priceSumm * (100 - parseInt(data.discount)) / 100) + parseInt(data.deliveryPrice);
				$('#basketTotalPrice').html(moneyFormat(total));
				refreshBasketInfo();
			},
			complete: function () {
				//Разблокируем инпуты для ввода
				$('.countHolder input').removeAttr('disabled');
			},
		});

	}
}



$(function(){
	var debug = false;
	var html = $('html');
	var body = $('body');
	var page = $('#page');
	var menu = $('#leftMenu');
	var menuBtn = $('#menuBtn');
	var backToTopBtn = $('#backToTopBtn');

	// --- левое меню ---
	menuBtn.on('click', function(){
		if( html.hasClass('menuActive') ){
			// закрываем меню
			html.removeClass('menuActive');
			body.css('height', '');
			setTimeout(function(){
				body.scrollTop(0);
				menu.removeClass('menuActive');
				page.removeClass('menuActive');
				// закрываем подменю
				menu.find('.showSubmenu').removeClass('showSubmenu');
			}, 400);
		}else{
			html.addClass('menuActive');
			menu.addClass('menuActive');
			page.addClass('menuActive');
		}
	});
	// перешли в подкатегории в меню
	menu.find('.menuItemBtn').on('click', function(){
		body.animate({scrollTop: 0}, 400);
		menu.find('.showSubmenu').removeClass('showSubmenu');
		$(this).closest('li').find('.submenu').addClass('showSubmenu');
		var newHeight = 0;
		var border = 1;
		$('.submenu.showSubmenu li').each(function(i, e){
			newHeight += $(e).height() + border;
		});
		newHeight += 40; // - высота кнопки "наверх"
		body.css('height', newHeight);
	});
	// кнопка назад в меню
	menu.find('.back').on('click', function(){
		$(this).closest('.submenu').removeClass('showSubmenu');
		body.css('height', '');
	});
	// --- /левое меню ---

	// --- кнопка наверх ---
	$(document).on('scroll', function(){
		if (body.scrollTop() > 580) {
			backToTopBtn.addClass('showBtn');
		} else {
			backToTopBtn.removeClass('showBtn');
		}
	});
	backToTopBtn.on('click', function(){
		body.animate({scrollTop: 0}, 400);
	});
	// --- /кнопка наверх ---

	// --- кнопка еще на главной ---
	$('#moreCategories').on('click', function(){
		$this = $(this);
		if( $this.hasClass('opened') ){
			$('#categoriesList').removeClass('opened');
			$this.removeClass('opened');
		}else{
			$('#categoriesList').addClass('opened');
			$this.addClass('opened');
		}
	});
	// --- /кнопка еще на главной ---

	// --- кнопка еще в листинге ---
	$('#moreSub').on('click', function(){
		$this = $(this);
		if( $this.hasClass('opened') ){
			$(this).closest('.subCategoriesHoler').find('.hiddenCategories').slideUp(400);
			$('.subCategoriesHoler .subCategories').removeClass('opened');
			$this.removeClass('opened');
		}else{
			$(this).closest('.subCategoriesHoler').find('.hiddenCategories').slideDown(400);
			$('.subCategoriesHoler .subCategories').addClass('opened');
			$this.addClass('opened');
		}
	});
	// --- /кнопка еще в листинге ---

	// --- теги в каталоге ---
	if ($('.subCategoriesHoler .subCategories') .length > 0) {
		if ($('.subCategoriesHoler .subCategories').height() > 144) {
			$('.subCategoriesHoler .subCategories').addClass('needMoreBtn');
			$('.subCategoriesHoler .moreBtnHolder').show();
		}
	}
	// --- /теги в каталоге ---


	// --- таймер обратного отсчета для акции ---
	if ($.fn.devouCountdown != undefined){
		$('.timers .countdown').each(function(i, e){
			$(e).devouCountdown({
				id: $(e).attr('id'),
				end_date: new Date($(e).data('time')),
				digit_height: '22'
			});
		});
	}
	// --- /таймер обратного отсчета для акции ---

	// --- слайдеры фото в карточке товара ---
	if ($.fn.slick != undefined){
		var slider = $('#activePhotoSlider');
		var sliderNav = $('#previewsSlider');
		slider.slick({
			slidesToShow: 1,
			slidesToScroll: 1,
			infinite: false,
			arrows: true,
			fade: false,
			lazyLoad: 'ondemand',
		});
		sliderNav.slick({
			slidesToShow: 5,
			slidesToScroll: 5,
			infinite: false,
			dots: false,
			centerMode: false,
			lazyLoad: 'ondemand',
		});
		sliderNav.find('.slick-slide').on('click', function(){
			var slideNum = $(this).data('slick-index');
			slider.slick('slickGoTo', slideNum);
		});
		$('.activePhotoSlider .slick-track').css('line-height', $('.activePhotoSlider .slick-track').height() + 'px');

		slider.on('beforeChange', function(event, slick, currentSlide, nextSlide){
			$('#canvasloader-container').show();
			if (nextSlide % 5 == 0 && currentSlide % 5 == 4) {
				sliderNav.slick('slickNext');
			} else if (currentSlide % 5 == 0 && nextSlide % 5 == 4) {
				sliderNav.slick('slickPrev');
			} else {
				sliderNav.slick('slickGoTo', nextSlide);
			}
			sliderNav.find('.slick-slide').eq(currentSlide).removeClass('activeSlide');
			sliderNav.find('.slick-slide').eq(nextSlide).addClass('activeSlide');
		});
		slider.on('afterChange', function(event, slick, currentSlide, nextSlide){
			$('#canvasloader-container').hide();
		});
	}
	// --- /слайдеры фото в карточке товара ---

	// --- табы в карточке товара ---
	var tabs = $('#tabs');
	tabs.find('.tabsNav li').on('click', function(){
		tabs.find('.tabsNav li').removeClass('active');
		$(this).addClass('active');
		tabs.find('.tabsContent > div').removeClass('active');
		tabs.find('.tabsContent > div').eq($(this).index()).addClass('active');
	});
	// --- /табы в карточке товара ---

	// --- тач ивенты ---
	if ($.fn.swipe != undefined && !debug) {
		// --- левое меню ---
		// body.swipe({
		// 	allowPageScroll:"vertical",
		// 	swipe:function(event, direction) {
		// 		if (!html.hasClass('menuActive') && direction == 'right') {
		// 			menuBtn.click();
		// 		} else if (html.hasClass('menuActive') && direction == 'left') {
		// 			menuBtn.click();
		// 		}
		// 	},
		// 	excludedElements: "button, input, select, textarea, .noSwipe, #mapHolder",
		// 	swipeStatus:function(event, phase) {},
		// 	threshold: 100
		// });
		// --- /левое меню ---

		// --- предыдущий товар ---
		$('#prevProduct').swipe({
			allowPageScroll:"vertical",
			swipe:function(event, direction) {
				if (direction == 'right') {
					location.href=$(this).attr('href');
				}
			},
			excludedElements: "button, input, select, textarea, .noSwipe",
			swipeStatus:function(event, phase) {},
			threshold: 20
		});
		// --- /предыдущий товар ---

		// --- следующий товар ---
		$('#nextProduct').swipe({
			allowPageScroll:"vertical",
			swipe:function(event, direction) {
				if (direction == 'left') {
					location.href=$(this).attr('href');
				}
			},
			excludedElements: "button, input, select, textarea, .noSwipe",
			swipeStatus:function(event, phase) {},
			threshold: 20
		});
		// --- /следующий товар ---
	}
	// --- /тач ивенты ---

	// --- кнопка "оставить отзыв" в карточке ---
	$('#newFeedbackBtn').on('click', function(){
		$(this)
			.closest('.feedbacks')
			.addClass('showNewFeedback')
			.height( 
					$(this)
						.closest('.feedbacks')
						.find('.newFeedback')
						.height() 
			);
		var off = $('#closeNewFeedback').offset().top;
		body.animate({scrollTop: off}, 400);
	});
	// --- /кнопка "оставить отзыв" в карточке ---

	// --- кнопка "Вернуться к отзывам" при добавлении отзыва ---
	$('#closeNewFeedback').on('click', function(){
		$(this)
			.closest('.feedbacks')
			.removeClass('showNewFeedback')
			.css('height', '');
	});
	// --- /кнопка "Вернуться к отзывам" при добавлении отзыва ---

	// --- кнопка "Отправить отзыв" при добавлении отзыва ---
	$('#sendNewFeedback').on('click', function(){
		var form = $(this).closest('.newFeedback');
		var error = false;
		var productId = form.data('id');
		var name = form.find('input[name="name"]');
		var email = form.find('input[name="email"]');
		var text = form.find('textarea');
		form.find('.error').removeClass('error');

		if (name.val().length < 3) {
			name.addClass('error');
			error = true;
		}
		if (!isValidEmail(email.val())) {
			email.addClass('error');
			error = true;
		}
		if (text.val().length < 3) {
			text.addClass('error');
			error = true;
		}

		var str = 'product_id='+productId+'&name='+name.val()+'&email='+email.val()+'&comment='+text.val()+'&add_product_feedback=1';

		if (!error) {
			$.ajax({
				url: '/ajax/system.php?method=addfeedback',
				type: 'post',
				data: str,
				dataType: 'json',
				success: function (data) {
					form.empty().html('<div class="response"><h3>Благодарим за ваше мнение!</h3><br />
						Ваш отзыв появится после проверки модератором</div>');
				}
			});
		}
	});
	// --- кнопка "Отправить отзыв" при добавлении отзыва ---

	// --- изменение количества в корзине ---
	$('.moreBtn').on('click', function(){
		var input = $(this).closest('.countHolder').find('.count');
		var val = parseInt(input.val());
		val++;
		input.val(val);
		recalculateBasket();
	});

	$('.countHolder input.count').on('change', function(){
		recalculateBasket();
	});

	$('.lessBtn').on('click', function(){
		var input = $(this).closest('.countHolder').find('.count');
		var val = parseInt(input.val());
		if (--val == 0) {
			val = 1;
		}
		input.val(val);
		recalculateBasket();
	});
	// --- /изменение количества в корзине ---

	// --- удалить из корзины ---
	$('.deleteBtn').on('click', function(){
		if (confirm("Удалить товар?")) {
			$(this).closest('.elem').remove();
			recalculateBasket();
		}
	});
	// --- /удалить из корзины ---

	// --- маска инпуту для телефона ---
	if ($.fn.mask != undefined) {
		$('input[type="tel"]').mask("+9 (999)999-99-99");
	}
	// --- /маска инпуту для телефона ---

	/**
	 * Аякс запрос на получение страницы товаров в категории и количества оставшихся товаров 
	 */
	function productsRequest(page, catId, sort, isTag) {
		$.ajax({
			type: "POST",
			dataType: 'json',
			url: "/ajax/mobile.php?method=getMoreProducts",
			data: "page=" + page + "&id=" + catId + "&sort=" + sort + "&isTag=" + isTag,
			success: function(data){
				$('ul.listing').append(data.html);
				if (parseInt(data.count) > 0 ) {
					$('#moreProductsBtn').show().find('.count').text(data.count);
				} else {
					$('#moreProductsBtn').hide();
				}
			}
		});
	}
	// --- кнопка загузки товаров в каталоге ---
	$('#moreProductsBtn').on('click', function(){
		var prodPage = $('ul.listing li').length / 10; // 10 - количество товаров на странице
		var sort = $('#catalogSort').find('.active').data('sort');
		productsRequest(prodPage, $(this).data('cat_id'), sort, $(this).data('is_tag'));
	});
	// --- /кнопка загузки товаров в каталоге ---

	/**
	 * Аякс запрос на получение товаров в поиске
	 */
	function productsSearchRequest(page, searchText) {
		$.ajax({
			type: "POST",
			dataType: 'json',
			url: "/ajax/mobile.php?method=getMoreSearchProducts",
			data: "page=" + page + "&searchText=" + searchText,
			success: function(data){
				$('ul.listing').append(data.html);
				if (parseInt(data.count) > 0 ) {
					$('#moreSearchBtn').show().find('.count').text(data.count);
				} else {
					$('#moreSearchBtn').hide();
				}
			}
		});
	}
	// --- кнопка загузки товаров в поиске ---
	$('#moreSearchBtn').on('click', function(){
		var prodPage = $('ul.listing li').length / 10; // 10 - количество товаров на странице
		productsSearchRequest(prodPage, $(this).data('search_text'));
	});
	// --- /кнопка загузки товаров в каталоге ---

	// --- кнопки сортировки каталога ---
	$('#catalogSort a').on('click', function(){
		var sortHolder = $('#catalogSort');
		sortHolder.find('a').removeClass('active');
		var sort = $(this).addClass('active').data('sort');
		$('ul.listing').empty(); // очищаем список товаров, чтобы далее получилась нулевая страница
		var prodPage = $('ul.listing li').length / 10; // 10 - количество товаров на странице
		productsRequest(prodPage, sortHolder.data('cat_id'), sort, sortHolder.data('is_tag'));
	});
	// --- /кнопки сортировки каталога ---

	// --- кнопка купить ---
	body.on('click', '.buyBtn.activeBtn', function(){
		$this = $(this);
		var id = $this.data('id');
		var price = $this.data('price');
		addProductToBasket(id, price);
		$this.removeClass('activeBtn').text('В корзине');
		return false;
	});
	// --- /кнопка купить ---

	// --- оформить заказ в корзине ---
	$('#finishBtn').on('click', function(){
		var params = {};
		var error = false;
		var fastOrder = false;
		var el, attr, value;
		var form = $(this).closest('form');
		form.find('.inputError').removeClass('inputError');
		form.find('input').each(function(i, e){
			el = $(e);
			if (el.attr('type') != 'radio' && el.attr('type') != 'checkbox' && el.attr('type') != 'submit') {
				attr = el.attr('required');
				if (el.attr('name') == 'fast_order' && parseInt(el.val()) == 1) {
					fastOrder = true;
				}
				if (typeof attr !== typeof undefined && attr !== false) {
					value = el.val();
					if (value != '') {
						params[el.attr('name')] = value;
					} else {
						error = true;
						el.addClass('inputError');
					}
				} else {
					params[el.attr('name')] = el.val();
				}
			}
		});

		// способ доставки
		var deliveryType = form.find('input[name="delivery_type"]:checked');
		if (fastOrder) {
			params['delivery_type'] = 1;
		} else if (deliveryType.length > 0) {
			params['delivery_type'] = deliveryType.val();
		} else {
			error = true;
			form.find('.deliveryType').addClass('inputError');
		}

		// способ оплаты
		var paymentType = form.find('input[name="payment_type"]:checked');
		if (fastOrder) {
			params['payment_type'] = 1;
		} else if (paymentType.length > 0) {
			params['payment_type'] = paymentType.val();
		} else {
			error = true;
			form.find('.paymentType').addClass('inputError');
		}

		// согласие с офертой
		var offer = form.find('input[name="offer"]:checked');
		if (fastOrder) {
			params['offer'] = 1;
		} else if (offer.length > 0) {
			params['offer'] = offer.val();
		} else {
			error = true;
			form.find('.offer').addClass('inputError');
		}

		// если все обязательные поля были заполнены
		if (error) {
			if ($('input.inputError').length > 0) {
				var off = $('input.inputError').eq(0).offset().top - 30;
				body.animate({scrollTop: off}, 400);
			}
		} else {
			// формируем адрес, если это не быстрый заказ
			var adress = '';
			if (!fastOrder) {
				if (params.city != '') {
					adress += 'г. ' + params.city;
				}
				if (params.street != '') {
					adress += ' ул. ' + params.street;
				}
				if (params.house != '') {
					adress += ' д. ' + params.house;
				}
				if (params.housing != '') {
					adress += ' корпус ' + params.housing;
				}
				if (params.building != '') {
					adress += ' строение ' + params.building;
				}
				if (params.apartment != '') {
					adress += ' кв. ' + params.apartment;
				}
				if (params.floor != '') {
					adress += ' этаж ' + params.floor;
				}
				if (params.porch != '') {
					adress += ' подъезд ' + params.porch;
				}
			}
			params['adress'] = adress;

			//собираем все параметры в url строку
			var urlStr = Object.keys(params).map(function(key){ 
				return encodeURIComponent(key) + '=' + encodeURIComponent(params[key]); 
			}).join('&');
			$.ajax({
				url: '/ajax/basket.php?method=make_order',
				type: 'POST',
				dataType: 'json',
				data: urlStr,
				beforeSend: function () {
					form.find('input').attr('disabled', 'disabled');
				},
				success: function (data) {
					$('.main').empty();
					var htmlStr = '
						<div class="finishResponse">
							<h1 class="title">Ваш заказ принят</h1>
							<p>Здравствуйте, <b>'+params['name']+'</b>.</p>
							<p>Вашему заказу присвоен номер <b>'+data.order_code+'</b>.</p> 
							<p>Наш менеджер перезвонит Вам на номер <b>'+params['phone']+'</b> в течение нескольких 
							часов (в рабочее время) для согласования времени доставки и 
							уточнения деталей комплектации заказа.</p>
							<p>Пожалуйста, не отключайте телефон.</p>

							<h3 class="green">Вы заказали:</h3>
							<div class="productList">';
					$(data.products).each(function(i, e){
						htmlStr += '
							<div class="elem">
								<div class="imgCol">
									<img src="/upload/small/'+e.id+'.jpg" alt="'+e.title+'">
								</div>
								<div class="textCol">
									<div class="title"><a>'+e.title+'</a></div>
									<div class="bottomLine">
										<div class="price">'+moneyFormat(e.price_after_discount)+'</div>
									</div>
								</div>
								<div class="clearfix"></div>
							</div>
						';
					});
					htmlStr += '</div>
						<div class="callBtnHolder">
							<a href="tel:8(800)555-62-50" class="callBtn">
								<span class="btnContent">
									<span class="phone">8(800)555-62-50</span>
									<span class="text">Звонок по России бесплатный</span>
								</span>
							</a>
						</div>
					</div>';
					$('.main').html(htmlStr);
					body.scrollTop(0);
				},
				complete: function () {
				},
				error: function () {
					form.find('input').removeAttr('disabled');
				}
			});
		}
		return false;
	});
	// --- /оформить заказ в корзине ---

	// --- быстрый заказ в карточке ---
	$('#fastBuyBtn').on('click', function(){
		var id = $(this).data('product_id');
		setCookie('fastProductId', id, '', '/');
	});
	// --- /быстрый заказ в карточке ---

	// --- выбор способа доставки при оформлении ---
	$('.deliveryType input[name="delivery_type"]').on('change', function(){
		$('.deliveryType .help').hide();
		$(this).closest('.elem').find('.help').show();
	});
	// --- /выбор способа доставки при оформлении ---

	// --- выбор города ---
	if ($('#pickupPointsList').length == 0 && $('#pickupPointsCitySelector').length == 0) { // если это не пункты самовывоза
		$('select.userCitySelector').on('change', function(){
			var $this = $(this);
			$('select.userCitySelector').val($this.val());
			var cityName = $this.find('option:selected').text();
			var regionName = $this.find('option:selected').data('region');
			var prodId = 0;
			if ($('#prodId').length == 1) {
				prodId = $('#prodId').val();
			}
			setCookie('selectedCity', encodeURI(cityName)+'|'+encodeURI(regionName), '', '/');
			var deliveryWidget = $('#deliveryWidget');

			if (deliveryWidget.length > 0) {
				var catId = deliveryWidget.find('#catId').val();
				$.ajax({
					url: '/ajax/mobile.php?method=getDeliveryWidgetInfo',
					type: 'POST',
					dataType: 'json',
					data: 'catId='+catId+'&cityName='+cityName+'&regionName='+regionName+'&prodId='+prodId,
					beforeSend: function () {
					},
					success: function (data) {
						changeDeliveryWidgetText(
							data.cityTitle,
							data.regionTitle,
							data.minTime,
							data.maxTime,
							data.minPrice,
							data.maxPrice,
							data.pointsCount,
							data.pointPrice
						);
					}
				});
			}
		});
	}
	// --- /выбор города ---

	// --- кнопки полной версии ---
	$('.fullVersionBottom, .fullLink').on('click', function(){
		setCookie('fullVersion', '1', '', '/');
		setCookie('mobileVersion', '', '', '/');
		setCookie('hideSiteVersionBtn', '', '', '/');
		location.href = location.href;
	});
	// --- /кнопки полной версии ---


	// --- спрятать кнопку полной версии ---
	$('#hideSiteVersionBtn').on('click', function(){
		setCookie('hideSiteVersionBtn', '1', '', '/');
		$('.fullVersion').addClass('hidden');
	});
	// --- /спрятать кнопку полной версии ---
});

function changeDeliveryWidgetText(cityName, regionName, minTime, maxTime, minPrice, maxPrice, pointsCount, pointPrice) {
	var deliveryText = '';
	if (cityName == 'Москва' || cityName == 'Санкт-Петербург' || regionName == 'Московская область') {
		deliveryText = 'Курьерской службой';
	} else {
		deliveryText = 'Транспортной компанией';
	}

	var deliveryTime = '';
	if (minTime == "0" || minTime == null) {
		deliveryTime = 'неизвестно';
	} else {
		deliveryTime = minTime + '-' + maxTime + ' дня.';
	}

	var deliveryPrice = '';
	if (cityName == '' || minPrice == null) {
		deliveryPrice = 'неизвестно';
	} else {
		if (minPrice == "0") {
			deliveryPrice = 'бесплатно';
		} else if (minPrice == "-1") {
			deliveryPrice = 'уточняйте у менеджера';
		} else {
			if(cityName == 'Москва'){
				deliveryPrice = '';
			}else{
				deliveryPrice = 'от ';
			}
			deliveryPrice += minPrice + ' рублей.';
		}
	}

	var isHidden = false;
	if (pointsCount == 0) {
		isHidden = true;
	}

	var pointPriceText = '';
	if (cityName == 'Москва') {
		pointPriceText = '(временно не работают)';
		isHidden = true;
	} else {
		if (pointPrice == null) {
			pointPriceText = 'неизвестно';
		} else if (pointPrice == "0") {
			pointPriceText = 'бесплатно';
		} else {
			pointPriceText = pointPrice + ' руб.';
		}
	}

	var deliveryWidget = $('#deliveryWidget');
	deliveryWidget.find('.deliveryPrice').html(deliveryText + ': <span class="blackText">' + deliveryPrice + '</span>');
	deliveryWidget.find('.pickupPoints .blackText').text(pointPriceText);
	deliveryWidget.find('.deliveryTime .blackText').text(deliveryTime);
	deliveryWidget.find('.showPointsBtn').text(pointsCount + ' пунктов');
	if (isHidden) {
		deliveryWidget.find('.showPointsBtn').hide();
	} else {
		deliveryWidget.find('.showPointsBtn').css('display', 'inline-block');
	}
}