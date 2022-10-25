$(document).ready(function() {
	$('.action.show-translation').on('click', function() {
		$('.translation-solution').addClass("show");
	});
	
	$('.action.show-pronunciation').on('click', function() {
		$('.pronunciation-solution').addClass("show");
	});
	
	$('.action.toggle-mark').on('click', function() {
		let value;
		if ($(this).hasClass('active')) {
			value = 0;
			$(this).removeClass('active');
		} else {
			value = 1;
			$(this).addClass('active');
		}
		
		let id = Number($("input[name='id']").val());
		let direction = $("input[name='direction']").val();
			
		$.get('/vocabularies/' + id + '/set-mark/' + direction + "/" + value, function(res) {});
	});
});