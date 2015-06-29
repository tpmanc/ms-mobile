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
			setTimeout(function(){
				menu.removeClass('menuActive');
				// закрываем подменю
				menu.find('.showSubmenu').removeClass('showSubmenu');
			}, 250);
		}else{
			html.addClass('menuActive');
			menu.addClass('menuActive');
		}
	});
	menu.find('.menuItemBtn').on('click', function(){
		body.animate({scrollTop: 0}, 400);
		menu.find('.showSubmenu').removeClass('showSubmenu');
		$(this).closest('li').find('.submenu').addClass('showSubmenu');
	});
	menu.find('.back').on('click', function(){
		$(this).closest('.submenu').removeClass('showSubmenu');
	});
	// --- /левое меню ---

	// --- кнопка наверх ---
	$(document).on('scroll', function(){
		if (body.scrollTop() > 580) {
			backToTopBtn.show();
		} else {
			backToTopBtn.hide();
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
			arrows: false,
			fade: false,
		});
		sliderNav.slick({
			slidesToShow: 5,
			slidesToScroll: 5,
			infinite: false,
			dots: false,
			centerMode: false
		});
		sliderNav.find('.slick-slide').on('click', function(){
			var slideNum = $(this).data('slick-index');
			slider.slick('slickGoTo', slideNum);
		});
		$('.activePhotoSlider .slick-track').css('line-height', $('.activePhotoSlider .slick-track').height() + 'px');

		slider.on('beforeChange', function(event, slick, currentSlide, nextSlide){
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
		form.find('input').eq(1).addClass('error');
	});
	// --- кнопка "Отправить отзыв" при добавлении отзыва ---

	// --- изменение количества в корзине ---
	$('.moreBtn').on('click', function(){
		var input = $(this).closest('.countHolder').find('.count');
		var val = parseInt(input.val());
		val++;
		input.val(val);
	});

	$('.lessBtn').on('click', function(){
		var input = $(this).closest('.countHolder').find('.count');
		var val = parseInt(input.val());
		if (--val == 0) {
			val = 1;
		}
		input.val(val);
	});
	// --- /изменение количества в корзине ---

	// --- удалить из корзины ---
	$('.deleteBtn').on('click', function(){
		if (confirm("Удалить товар?")) {
			$(this).closest('.elem').remove();
		}
	});
	// --- /удалить из корзины ---

	// --- маска инпуту для телефона ---
	if ($.fn.mask != undefined) {
		$('input[type="tel"]').mask("+9 (999)999-99-99");
	}
	// --- /маска инпуту для телефона ---

	// --- яндекс карты в пунктах самовывоза ---
	if (window.ymaps != undefined) {
		ymaps.ready(init);
		var myMap;
		function init() {
			myMap = new ymaps.Map("mapHolder", {
				center: [55.76, 37.64],
				zoom: 7,
				controls: ['smallMapDefaultSet']
			});
			myMap.behaviors.disable('scrollZoom');
		}
	}
	// --- /яндекс карты в пунктах самовывоза ---

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
});