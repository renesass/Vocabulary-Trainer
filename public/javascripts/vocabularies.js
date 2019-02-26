$(document).ready(function() {
	if ($('table#vocabularies tr').length == 1) {
		addRow();
	}
	
	$('.add-row').on('click', function() {
		addRow();
	}); 
});

$(document).on('click','.remove-row',function(){
	removeRow($('.remove-row').index(this) + 1);
});

function addRow() {
	var table = $('table#vocabularies tbody');
	let index = $('table#vocabularies tr').length - 1;
		
		
	var foreign = "<td class='no-padding'><input type='hidden' name='id[]'><input name='foreign[]'></td>";
	var pronunciation = "<td class='no-padding'><input name='pronunciation[]' onkeyup='toPinyin(this)'></td>";
	var native = "<td class='no-padding'><input name='native[]'></td>";
	var button = "<td class='no-padding'><button class='remove-row small-margin-left'>x</button></td>";
		
	var row = "<tr>";
	row += foreign;
	row += pronunciation;
	row += native;
	row += button;
	row += "</tr>";
		
	table.append(row);
}


function removeRow(index) {
	var table = $('table#vocabularies tbody').children().eq(index).remove();
	
	if ($('table#vocabularies tr').length == 1) {
		addRow();
	}
}