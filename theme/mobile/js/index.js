$(function(){
	var body = $('body');
	var page = $('#page');
	var menu = $('#leftMenu');
	var menuBtn = $('#menuBtn');

	$(menuBtn).on('click', function(){
		if( body.hasClass('menuActive') ){
			$(body).removeClass('menuActive');
		}else{
			$(body).addClass('menuActive');
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