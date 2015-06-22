$(function(){
	var html = $('html');
	var body = $('body');
	var page = $('#page');
	var menu = $('#leftMenu');
	var menuBtn = $('#menuBtn');
	var backToTopBtn = $('#backToTopBtn');

	// --- левое меню ---
	$(menuBtn).on('click', function(){
		if( html.hasClass('menuActive') ){
			$(html).removeClass('menuActive');
			setTimeout(function(){$(menu).removeClass('menuActive');}, 250);
		}else{
			$(html).addClass('menuActive');
			$(menu).addClass('menuActive');
		}
	});
	$(menu).find('span').on('click', function(){
		$(this).closest('li').find('.submenu').addClass('showSubmenu');
	});
	$(menu).find('.back').on('click', function(){
		$(this).closest('.submenu').removeClass('showSubmenu');
	});
	// --- /левое меню ---

	// --- кнопка наверх ---
	$(document).on('scroll', function(){
		if (body.scrollTop() > 500) {
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
			$('#categoriesList .hiddenCategories').slideUp(400);
			$this.removeClass('opened');
		}else{
			$('#categoriesList .hiddenCategories').slideDown(400);
			$this.addClass('opened');
		}
	});
	// --- /кнопка еще на главной ---

	// --- кнопка еще в листинге ---
	$('#moreSub').on('click', function(){
		$this = $(this);
		if( $this.hasClass('opened') ){
			$(this).closest('.subCategoriesHoler').find('.hiddenCategories').slideUp(400);
			$this.removeClass('opened');
		}else{
			$(this).closest('.subCategoriesHoler').find('.hiddenCategories').slideDown(400);
			$this.addClass('opened');
		}
	});
	// --- /кнопка еще в листинге ---


	// --- таймер обратного отсчета для акции ---
	if ($.fn.devouCountdown != undefined){
		$('#countdown14088').devouCountdown({
			id: 'countdown14088',
			end_date: new Date("30 Jun 2015, 23:59:59"), // format 00 Jule 0000, 00:00:00
			digit_height: '22'
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
	if ($.fn.swipe != undefined) {
		// --- левое меню ---
		body.swipe({
			allowPageScroll:"vertical",
			swipe:function(event, direction) {
				if (!html.hasClass('menuActive') && direction == 'right') {
					menuBtn.click();
				} else if (html.hasClass('menuActive') && direction == 'left') {
					menuBtn.click();
				}
			},
			swipeStatus:function(event, phase) {},
			threshold: 100
		});
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
});