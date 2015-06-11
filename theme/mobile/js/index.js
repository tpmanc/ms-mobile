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


	$('#countdown14088').devouCountdown({
		id: 'countdown14088',
		end_date: new Date("30 Jun 2015, 23:59:59"), // format 00 Jule 0000, 00:00:00
		digit_height: '22'
	});
});