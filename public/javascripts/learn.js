$(document).ready(function() {
	$('.action.show-translation').on('click', function() {
		$('input.translation-solution').addClass("show");
	});
	
	$('.action.show-pronunciation').on('click', function() {
		$('input.pronunciation-solution').addClass("show");
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
		
		let vocabularyId = Number($("input[name='vocabularyId']").val());
		let direction = $("input[name='direction']").val();
		
		console.log('/vocabularies/' + vocabularyId + '/set-mark/' + direction + "/" + value);
			
		$.get('/vocabularies/' + vocabularyId + '/set-mark/' + direction + "/" + value, function(res) {});
	});
});