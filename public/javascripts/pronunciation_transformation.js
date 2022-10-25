function toPinyin(self) {
	var replacements = {
		'a1': 'ā',
		'a2': 'á',
		'a3': 'ǎ',
		'a4': 'à',
		
		'o1': 'ō',
		'o2': 'ó',
		'o3': 'ǒ',
		'o4': 'ò',
		
		'u1': 'ū',
		'u2': 'ú',
		'u3': 'ǔ',
		'u4': 'ù',
		
		'i1': 'ī',
		'i2': 'í',
		'i3': 'ǐ',
		'i4': 'ì',
		
		'e1': 'ē',
		'e2': 'é',
		'e3': 'ĕ',
		'e4': 'è'
	}
	
	let string = self.value;
	for (var prop in replacements) {
		string = string.replace(prop, replacements[prop]);
	}
	
	self.value = string;
}