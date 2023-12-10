//DESCRIPTION: Synchronize Color Groups from styleSourceDocument
/*
VERSION: 0.2
AUTHOR: David Maissen – punktzwei publishing, https://punktzwei.ch
DATE: 2023-12-10
*/

function main() {
	if (app.books.length > 0) {
		var _book = app.activeBook;
		var _confirm = confirm("Farbgruppen in Buch " + _book.name + " wiederherstellen?");
		
		//canceled
		if (!_confirm) {
			return;
		}

		// disable user interaction
		var _ul = app.scriptPreferences.userInteractionLevel
		app.scriptPreferences.userInteractionLevel = UserInteractionLevels.NEVER_INTERACT;
	
		//sync
		syncBookContent(_book);

		// reset user interaction
		app.scriptPreferences.userInteractionLevel = _ul;
		
		alert("abgeschlossen");
	}
	else {
		alert("Bitte Buchdokument öffnen");
		return
	}
}

function syncBookContent(_book) {
	var _source = app.open(_book.styleSourceDocument.fullName);
	var _colorGroups = _source.colorGroups;
	var _contents = _book.bookContents;

	for (var i = 0; i < _contents.length; i++) {
		if (_contents[i].name != _source.name) {
			var _doc = app.open(_contents[i].fullName)
			for (var n = 0; n < _colorGroups.length; n++) {
				if (_colorGroups[n].name != "[Root Color Group]") {
					if (!(search(_doc.colorGroups, _colorGroups[n].name))) {
						_doc.colorGroups.add(_colorGroups[n].name);
					}
					groupColors(_colorGroups[n], _doc);
				}
			}
			_doc.close(SaveOptions.YES);
		}
	}
	_source.close(SaveOptions.YES);
}

function groupColors(_group, _doc) {
	var _groupColors = _group.colorGroupSwatches;
	var _docSwatches = _doc.swatches;

	for (var z = 0; z < _groupColors.length; z++) {
		var _swatch = _doc.swatches.itemByName(_groupColors[z].swatchItemRef.name);

		if (search(_docSwatches, _swatch.name)) {
			var _docGroup = _doc.colorGroups.itemByName(_group.name);
			_docGroup.colorGroupSwatches.add({ swatchItemRef: _swatch });
		}
	}
}

function search(_data, _key) {
	var t = 0;
	while (t < _data.length && _data[t].name != _key) {
		t++;
	}
	return t < _data.length;
}

main();
