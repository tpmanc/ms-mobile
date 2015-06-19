$(function(){
	var html = $('html');
	var body = $('body');
	var page = $('#page');
	var menu = $('#leftMenu');
	var menuBtn = $('#menuBtn');

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

	// кнопка еще на главной
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

	// кнопка еще в листинге
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


	if ($.fn.devouCountdown != undefined){
		$('#countdown14088').devouCountdown({
			id: 'countdown14088',
			end_date: new Date("30 Jun 2015, 23:59:59"), // format 00 Jule 0000, 00:00:00
			digit_height: '22'
		});
	}

	if ($.fn.slick != undefined){
		var slider = $('#activePhotoSlider');
		var sliderNav = $('#previewsSlider');
		// product cart slider
		slider.slick({
			slidesToShow: 1,
			slidesToScroll: 1,
			infinite: false,
			arrows: false,
			fade: false,
			// asNavFor: '#previewsSlider'
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
		// sliderNav.on('beforeChange', function(event, slick, currentSlide, nextSlide){
			// console.log(nextSlide);
		// });
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

	// табы в карточке товара
	var tabs = $('#tabs');
	tabs.find('.tabsNav li').on('click', function(){
		tabs.find('.tabsNav li').removeClass('active');
		$(this).addClass('active');
		tabs.find('.tabsContent > div').removeClass('active');
		tabs.find('.tabsContent > div').eq($(this).index()).addClass('active');
	});
});