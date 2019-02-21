$(document).ready(function() {
	addRow();
	
	$('.add-row').on('click', function() {
		addRow();
	});
});

function addRow() {
	var table = $('table#vocabularies tbody');
	let index = $('table#vocabularies tr').length - 1;
		
		
	var zh = "<td><input name='zh[]'></td>";
	var pinyin = "<td><input name='pinyin[]'></td>";
	var de = "<td><input name='de[]'></td>";
	var button = "<td><button>x</button></td>";
		
	var row = "<tr>";
	row += zh;
	row += pinyin;
	row += de;
	row += button;
	row += "</tr>";
		
	table.append(row);
}

function removeRow() {
	var table = $('table#vocabularies tbody');
}