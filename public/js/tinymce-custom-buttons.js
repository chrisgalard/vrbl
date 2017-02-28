(function () {

	tinymce.PluginManager.add('embediframe', function (editor, url) {
		editor.addButton('embedaudio', {
			text: 'Embed Audio',
			tooltip: 'Insert the player for this audio',
			icon: false,
			onclick: insertAudio,
		});

		function insertAudio() {
			var selectedText = editor.selection.getContent({format: 'text'});
			console.log(selectedText);
			var iframe = '<iframe frameborder="0"  scrolling="no" width="100%"  height="450px" src="/player/' + selectedText + '"></iframe>';

			if (selectedText.length === 0) {
				alert('Please select some text!');
				return;
			}

			editor.insertContent(iframe);
		}
	});

})();