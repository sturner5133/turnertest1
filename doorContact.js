
$(function(){

	// define the application
	var doorContact = {};

	(function(app){

		// variable definitions
		var $title = $('#title'),
			$fname = $('#fname'),
			$lname = $('#lname'),
			$city = $('#city'),
			$state = $('#state'),
			$note = $('#note'),
			$phone = $('#phone'),
			$zip = $('#zip'),
			$response = $('#response'),
			$area = $('#area'),

			$ul = $('#notesList'),
			li = '<li><a href="#pgNotesDetail?title=LINK">ID</a></li>',
			notesHdr = '<li data-role="list-divider">Your Contacts</li>',
			noNotes = '<li id="noNotes">You have no Contacts</li>';

		app.init = function(){
			app.bindings();
			app.checkForStorage();
		};

		app.bindings = function(){
			// set up binding for form
			$('#btnAddContact').on('touchend', function(e){
				e.preventDefault();
				// save the Contact
				app.addNote(
					$('#title').val(),
					$('#note').val(),
					$('#fname').val(),
					$('#lname').val(),
					$('#city').val(),
					$('#state').val(),
					$('#phone').val(),
					$('#zip').val(),
					$('#response').val(),
					$('#area').val()
									);
			});
			$(document).on('touchend', '#notesList a', function(e){
				e.preventDefault();
				var href = $(this)[0].href.match(/\?.*$/)[0];
				var title = href.replace(/^\?title=/,'');
				app.loadNote(title);
			});
			$(document).on('touchend', '#btnDelete', function(e){
				e.preventDefault();
				var key = $(this).data('href');
				app.deleteNote(key);
			});
		};

		app.loadNote = function(title){
			// get contacts
			var notes = app.getNotes(),
				// lookup specific contact
				note = notes[title],
				page = ['<div data-role="page">',
						'<div data-role="header" data-position="fixed"><h1>Door Area</h1>',
						'<div data-role="navbar">',
						'<ul>',
						'<li><a href="#door_view">View Door List</a></li>',
						'<li><a href="#new_door">New Door</a></li>',
						
						'</ul>',
						'</div>',
								
								'<a id="btnDelete" href="" data-href="ID" data-role="button" class="ui-btn-right">Delete</a>',
							'</div>',
							'<div role="main" class="ui-content"><h3>TITLE</h3><p>NOTE</p></div>',
						'</div>'].join('');
			var newPage = $(page);
			//append it to the page container
			newPage.html(function(index,old){
				return old
						.replace(/ID/g,title)
						.replace(/TITLE/g,title
						.replace(/-/g,' '))
						.replace(/NOTE/g,note);
			}).appendTo($.mobile.pageContainer);
			$.mobile.changePage(newPage);
		};

		app.addNote = function(title, note, fname, lname, city, state, phone, zip, response, area){
			var notes = localStorage['door_Contact'],
				notesObj;
			if (notes === undefined || notes === '') {
				notesObj = {};
			} else {
				notesObj = JSON.parse(notes);
			}
			
			note = " Notes:<br/> "+note+"<br/><br/>";
			note+=" Name:<br/> "+fname+" "+lname+" <br/><br/>";
			note+=" Phone:<br/> "+phone+"  <a href='sms://"+phone+"'>text</a> <a href='tel://"+phone+"'>call</a> <br/><br/>";
			note+=" Address:<br/> "+title+", "+city+", "+state+" "+zip+"  <a href='https://maps.google.com/?q="+title+", "+city+", "+state+" "+zip+"'>Map It</a><br/><br/> ";
			title+="  ("+fname+" ["+response+"-"+area+"])";

			notesObj[title.replace(/ /g,'-')] = note;
			localStorage['door_Contact'] = JSON.stringify(notesObj);
			// clear the ten form fields
			$note.val('');
			$title.val('');
			$fname.val('');
			$lname.val('');
			$city.val('');
			$state.val('');
			$phone.val('');
			$zip.val('');
			$response.val('');
			$area.val('');
			//update the listview
			app.displayNotes();
		};

		app.getNotes = function(){
			// get notes
			var notes = localStorage['door_Contact'];
			// convert notes from string to object
			if(notes) return JSON.parse(notes);
			return [];
		};

		app.displayNotes = function(){
			// get notes
			var notesObj = app.getNotes(),
				// create an empty string to contain html
				html = '',
				n; // make sure your iterators are properly scoped
			// loop over notes
			for (n in notesObj) {
				html += li.replace(/ID/g,n.replace(/-/g,' ')).replace(/LINK/g,n);
			}
			$ul.html(notesHdr + html).listview('refresh');
		};

		app.deleteNote = function(key){
			// get the notes from localStorage
			var notesObj = app.getNotes();
			// delete selected note
			delete notesObj[key];
			// write it back to localStorage
			localStorage['door_Contact'] = JSON.stringify(notesObj);
			// return to the list of notes
			$.mobile.changePage('door_area_list.html');
			// restart the storage check
			app.checkForStorage();
		};

		app.checkForStorage = function(){
			var notes = app.getNotes();
			// are there existing notes?
			if (!$.isEmptyObject(notes)) {
				// yes there are. pass them off to be displayed
				app.displayNotes();
			} else {
				// nope, just show the placeholder
				$ul.html(notesHdr + noNotes).listview('refresh');
			}
		};

		app.init();

	})(doorContact);
});