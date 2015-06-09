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

	$('#moreCategories').on('click', function(){
		$this = $(this);
		if( $this.hasClass('opened') ){
			$('#categories .hiddenCategories').slideUp(400);
			$this.removeClass('opened');
		}else{
			$('#categories .hiddenCategories').slideDown(400);
			$this.addClass('opened');
		}
		
	});
});