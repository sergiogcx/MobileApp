/*
	Web Quiz Game Engine v0.1 by
	SERGIO GARCIA <gar13065@byui.edu>
*/
	var score = 0;
	var questions = 0;
	var current_page = 0;
	var current_question = '';
	var quiz = null;
	
	var answer_corret_messages = ["Correct!", "Great Job!", "You got it right!", "Well done!", "One more right!" ];
    var answer_incorret_messages = ["Nope, Got it wrong!", "That's too bad, try again!", "Got this one wrong! :("];

    var answer_correct_html = "<img src='images/success.png' class='dialog_image' />" +
		"<div style='position: relative; top: 10vh; left: 5vw;'>Great job! you got this answer right!</div>" +
		"<div style='position: absolute; bottom: 20vh; left: 8vw;'>You should be able to see 1 more point in your score board!</div>";

    var answer_incorrect_html = "<img src='images/wrong.png' class='dialog_image' />" +
		"<div style='position: relative; top: 10vh; left: 5vw;'>That answer incorrect :( ... </div>" +
		"<div style='position: absolute; bottom: 20vh; left: 8vw;'>You did not get another point for for score.</div>";

	function loadJSON(path, success, error)
	{
	    var xhr = new XMLHttpRequest();
	    xhr.onreadystatechange = function()
	    {
	        if (xhr.readyState === XMLHttpRequest.DONE) {
	            if (xhr.status === 200) {
	                if (success)
	                    success(JSON.parse(xhr.responseText));
	            } else {
	                if (error)
	                    error(xhr);
	            }
	        }
	    };
	    xhr.open("GET", path, true);
	    xhr.send();
	}

	function xinspect(o,i){ if(typeof i=='undefined')i=''; if(i.length>50)return '[MAX ITERATIONS]'; var r=[];
    for(var p in o){var t=typeof o[p]; r.push(i+'"'+p+'" ('+t+') => '+(t=='object' ? 'object:'+xinspect(o[p],i+'  ') : o[p]+''));}
    return r.join(i+'\n'); }

	function clear_page() {
		document.getElementById("mainframe").style = "";
		document.getElementById("mainframe").innerHTML = "";
		document.getElementById("description").innerHTML = "";
	}

	function process_page() {
		var template = '<div class="tap_option" id="{tap_name}" style=\'{tap_style}\' onclick="tap(this);"></div>';
		var temporal = "";
		questions = 0;
		score = 0;

		for (var i = 0; i < quiz.questions.length; i++) {
			for (var p in quiz.questions[i]) {
				console.log(p);
				if(i == current_page) {
					if(p == "background_picture")
					{ 
						document.getElementById("mainframe").style.backgroundImage = "url('"+ quiz.questions[i][p] +"')"; // no-repeat center; ;";
						document.getElementById("mainframe").style.backgroundSize = "cover";
					}
					else if(p == "description") {
						document.getElementById("description").innerHTML = quiz.questions[i][p];
					}
					else
					{
						temporal = template.replace('{tap_name}', p);
						temporal = temporal.replace('{tap_style}', quiz.questions[i][p].style);
						document.getElementById("mainframe").innerHTML = document.getElementById("mainframe").innerHTML + temporal;
						temporal = "";
						questions++;	
					}	
				} 
			}
		}
		update_score_board();
	}

	function initialize() {
		loadJSON('json/main.json',
			function(data) { 
	         	quiz = data;
	         	process_page();
         	},
	        
	        function(xhr) { 
	        	console.error(xhr);
	        }
		);
	}

	function tap(divobj) {
		current_question = divobj.id;
		populate_question(quiz.questions[current_page][divobj.id]);
	}

	function populate_question(qobject) {
		document.getElementById("question").innerHTML = qobject.question;
		document.getElementById("a1").innerHTML = qobject.a1;
		document.getElementById("a2").innerHTML = qobject.a2;
		document.getElementById("a3").innerHTML = qobject.a3;
		document.getElementById("a4").innerHTML = qobject.a4;
		document.getElementById("picture").src=qobject.image;
		document.getElementById("question_box").style.visibility = "visible";

		if(qobject.sound) {
			unhide_by_elementid('sound');
			document.getElementById("asound").src = qobject.sound;
		} else {
			hide_by_elementid('sound');
		}
	}

	function clear_question_box() {
		document.getElementById("question_box").style.visibility = "hidden";	
		document.getElementById("question").innerHTML = "";
		document.getElementById("a1").innerHTML = "";
		document.getElementById("a2").innerHTML = "";
		document.getElementById("a3").innerHTML = "";
		document.getElementById("a4").innerHTML = "";
	}

	function update_score_board() {
		var tmpscore = (score/questions)*100;
		document.getElementById("scoreboard").style.background = ( (tmpscore > 70) ? ( (tmpscore == 100) ? "darkblue" : "green" ) : "darkred" );
		document.getElementById("score").innerHTML = score + "/" + questions;
	}


	function check_answer(divobj) {
		clear_question_box();

		if(divobj.id == quiz.questions[current_page][current_question].a)	{
			score++;
			show_dialog_correct();
		}
		else 
			show_dialog_incorrect();

		hide_tap_option(current_question);
		current_question = "";
		update_score_board();
	}

	function get_random(a, b) {
		return Math.floor((Math.random() * b) + a); 
	}

	function show_dialog_correct() {
		open_dialog(answer_corret_messages[get_random(0, answer_corret_messages.length-1)], answer_correct_html);
	}

	function show_dialog_incorrect() {
		open_dialog(answer_incorret_messages[get_random(0, answer_incorret_messages.length-1)], answer_incorrect_html);
	}

	function open_dialog(title, content) {
		document.getElementById("dialog_title").innerHTML = title;
		document.getElementById("dialog_content").innerHTML = content;
		show_dialog();
	}

	function show_dialog() {
		document.getElementById("dialog").style.visibility = "visible";	
	}

	function close_dialog() {
		document.getElementById("dialog").style.visibility = "hidden";
		document.getElementById("dialog_title").innerHTML = "";
		document.getElementById("dialog_content").innerHTML = "";
	}

	function hide_tap_option(tap_option) {
		document.getElementById(tap_option).style.visibility = "hidden";
	}

	function turn_page_next() {
		clear_page();
		current_page = (current_page < quiz.questions.length-1) ? (current_page+1) : current_page;  
		process_page();
	}

	function turn_page_back() {
		clear_page();
		current_page = (current_page > 0) ? (current_page-1) : current_page;  
		process_page();
	}

	function hide_by_elementid(element_id) {
		document.getElementById(element_id).style.visibility = "hidden";
	}

	function unhide_by_elementid(element_id) {
		document.getElementById(element_id).style.visibility = "visible";	
	}

	function toggleFullScreen() {
		console.log("Toggling Full Screen...");
	  if (!document.fullscreenElement &&    // alternative standard method
	      !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement ) {  // current working methods
	    if (document.documentElement.requestFullscreen) {
	      document.documentElement.requestFullscreen();
	    } else if (document.documentElement.msRequestFullscreen) {
	      document.documentElement.msRequestFullscreen();
	    } else if (document.documentElement.mozRequestFullScreen) {
	      document.documentElement.mozRequestFullScreen();
	    } else if (document.documentElement.webkitRequestFullscreen) {
	      document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
	    }
	  } else {
	    if (document.exitFullscreen) {
	      document.exitFullscreen();
	    } else if (document.msExitFullscreen) {
	      document.msExitFullscreen();
	    } else if (document.mozCancelFullScreen) {
	      document.mozCancelFullScreen();
	    } else if (document.webkitExitFullscreen) {
	      document.webkitExitFullscreen();
	    }
	  }
	}