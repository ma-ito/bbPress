jQuery(document).ready( function() {
	if ( typeof( edButtons ) !== 'undefined' ) {
		// Add a button called 'link' with a callback function
		// and this is the callback function
		function link_prompt(e, c, ed) {
			var prmt, t = this;
			var defaultValue = 'http://';
			if ( ed.canvas.selectionStart !== ed.canvas.selectionEnd ) {
				// if we have a selection in the editor define out tagStart and tagEnd to wrap around the text
				// prompt the user for the link and return gracefully on a null input
				prmt = prompt('URLを入力', defaultValue);
				if ( prmt === null ) return;
				t.tagStart = '<a href="' + prmt + '">';
				t.tagEnd = '</a>';
			} else if ( ed.openTags ) {
				// if we have an open tag, see if it's ours
				var ret = false, i = 0, t = this;
				while ( i < ed.openTags.length ) {
					ret = ed.openTags[i] == t.id ? i : false;
					i ++;
				}
				if ( ret === false ) {
					// if the open tags don't include 'a' prompt for input
					prmt = prompt('URLを入力', defaultValue);
					if ( prmt === null ) return;
					t.tagStart = '<a href="' + prmt + '">';
					t.tagEnd = false;
					if ( ! ed.openTags ) {
						ed.openTags = [];
					}
					ed.openTags.push(t.id);
					e.value = '/' + e.value;
				} else {
					// otherwise close the 'a' tag
					ed.openTags.splice(ret, 1);
					t.tagStart = '</a>';
					e.value = t.display;
				}
			} else {
				// last resort, no selection and no open tags
				// so prompt for input and just open the tag
				prmt = prompt('URLを入力', defaultValue);
				if ( prmt === null ) return;
				t.tagStart = '<a href="' + prmt + '">';
				t.tagEnd = false;
				if ( ! ed.openTags ) {
					ed.openTags = [];
				}
				ed.openTags.push(t.id);
				e.value = '/' + e.value;
			}
			// now we've defined all the tagStart, tagEnd and openTags we process it all to the active window
			QTags.TagButton.prototype.callback.call(t, e, c, ed);
		};

		delete edButtons[30];
		delete edButtons[40];
		delete edButtons[110];
		edButtons[30] = new QTags.addButton( 'link', 'link', link_prompt );
		edButtons[edButtons.length] = new QTags.TagButton( 'code', 'code', '[code]', '[/code]', 'c' );
		edButtons[edButtons.length] = new QTags.TagButton( 'block', 'block', '[block]', '[/block]', 'b' );
		QTags._buttonsInit();
	}

	/* Tab from topic title */
	jQuery( '#bbp_topic_title' ).bind( 'keydown.editor-focus', function(e) {
		if ( e.which !== 9 )
			return;

		if ( !e.ctrlKey && !e.altKey && !e.shiftKey ) {
			if ( typeof( tinymce ) !== 'undefined' ) {
				if ( ! tinymce.activeEditor.isHidden() ) {
					var editor = tinymce.activeEditor.editorContainer;
					jQuery( '#' + editor + ' td.mceToolbar > a' ).focus();
				} else {
					jQuery( 'textarea.bbp-the-content' ).focus();
				}
			} else {
				jQuery( 'textarea.bbp-the-content' ).focus();
			}

			e.preventDefault();
		}
	});

	/* Shift + tab from topic tags */
	jQuery( '#bbp_topic_tags' ).bind( 'keydown.editor-focus', function(e) {
		if ( e.which !== 9 )
			return;

		if ( e.shiftKey && !e.ctrlKey && !e.altKey ) {
			if ( typeof( tinymce ) !== 'undefined' ) {
				if ( ! tinymce.activeEditor.isHidden() ) {
					var editor = tinymce.activeEditor.editorContainer;
					jQuery( '#' + editor + ' td.mceToolbar > a' ).focus();
				} else {
					jQuery( 'textarea.bbp-the-content' ).focus();
				}
			} else {
				jQuery( 'textarea.bbp-the-content' ).focus();
			}

			e.preventDefault();
		}
	});
});