$(document).ready(function() {
	$('.action').on('click', function() {
		let vocabularyId = $(this).parent().parent().find('.vocabulary_id').val();
		
		let area;
		if ($(this).hasClass("foreign-native")) area = "foreign-native";
		else if ($(this).hasClass("native-foreign")) area = "native-foreign";
		
		if (!area) return;
				
		if ($(this).hasClass("set-status")) {
			let value;
			if ($(this).hasClass("set-0")) value = 0;
			else if ($(this).hasClass("set-1")) value = 1;
			
			if ($(this).hasClass("active")) return;
			
			// update local
			$(this).parent().find('.action.set-status').removeClass('active');
			$(this).addClass('active');
			
			console.log('/vocabularies/' + vocabularyId + '/set-status/' + area + "/" + value);
			$.get('/vocabularies/' + vocabularyId + '/set-status/' + area + "/" + value, function(res) {});
		}
		
		else if ($(this).hasClass("toggle-mark")) {
			let value;
			if ($(this).hasClass('active')) {
				value = 0;
				$(this).removeClass('active');
			} else {
				value = 1;
				$(this).addClass('active');
			}
			
			$.get('/vocabularies/' + vocabularyId + '/set-mark/' + area + "/" + value, function(res) {});
		}
		
	}); 
});