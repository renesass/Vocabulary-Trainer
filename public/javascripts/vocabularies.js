$(document).ready(function() {
	if ($('table#vocabularies tr').length == 1) {
		addRow();
	}
	
	$('.add-row').on('click', function() {
		addRow();
	}); 
});

$(document).on('click','.remove-row', function(){
	let button_id = $('.remove-row').index(this)*3;
	button_id += 1;
	removeRow(button_id);
});

function addRow() {
	var table = $('table#vocabularies tbody');
	let index = $('table#vocabularies tr').length - 1;
		
		
	var foreign = "<td class='no-padding'><input type='hidden' name='id[]'><input name='foreign[]'></td>";
	var pronunciation = "<td class='no-padding'><input name='pronunciation[]' onkeyup='toPinyin(this)'></td>";
	var native = "<td class='no-padding'><input name='native[]'></td>";
	var button = "<td class='no-padding'><button class='remove-row small-margin-left remove-button' type='button'>x</button></td>";
		
	var row = "<tr class='basic-info'>";
	row += foreign;
	row += pronunciation;
	row += native;
	row += button;
	row += "</tr>";
	table.append(row);
	
	row = "<tr>";
	row += "<td class='no-padding' colspan='4'><input name='exampleSentence[]' placeholder='Example sentence'></td>";
	row += "</tr>";
	table.append(row);
	
	row = "<tr>";
	row += "<td class='no-padding small-padding-bottom' colspan='4'><input name='additionalInfo[]'  placeholder='Additional information'></td>";
	row += "</tr>";
	table.append(row);
}


function removeRow(index) {
	$('table#vocabularies tbody').children().eq(index).remove();
	$('table#vocabularies tbody').children().eq(index).remove();
	$('table#vocabularies tbody').children().eq(index).remove();
	
	if ($('table#vocabularies tr.basic-info').length == 0) {
		addRow();
	}
}