$(function(){
	webSocket.on("socket/connect", function(session){
    //session is an Autobahn JS WAMP session.

    session.subscribe("ticket_requested/office/"+officeId, function(uri, payload){
    	var currentNumberPanel = $('#current-number-panel');
    	var currentNumber = $('#current-number .current-value');
    	var currentModule = $('#current-module .current-value');

    	try { 
    		console.log("Received message", payload.msg);
	        var obj = $.parseJSON(payload.msg);

	        var ticketCode = obj.ticketCode;
	        
	        if (obj.ticketCode && obj.officeId == officeId){
	        	var ticket = {'code':obj.ticketCode, 'module':obj.module, 'time':obj.time}

		        currentModule.html(obj.module); 
		        currentNumber.html(obj.ticketCode);

		        iterate(2);			        	        

		        $('#chatAudio')[0].play();		

		        if(lastTicket){
		        	rowHtml = '<tr><td class="td-bold">'+lastTicket['code']+'</td><td  class="td-bold">'+lastTicket['module']+'</td><td>'+lastTicket['time']+'</td></tr>';
		        	$('#last-calls-table tbody').prepend(rowHtml);
		        	$('#last-calls-table tbody tr').slice(4).remove();
		        }

	        	lastTicket = ticket;
	        }
	    }
	    catch(err) {
	        window.location.reload(false); 
	    }    	
        
    });

    console.log("Successfully Connected!");
	})

	webSocket.on("socket/disconnect", function(error){
	    //error provides us with some insight into the disconnection: error.reason and error.code

	    console.log("Disconnected for " + error.reason + " with code " + error.code);
	})

	function iterate(num){
		highlightCurrentNumber();
	    setTimeout(function(){  
	        highlightCurrentNumber();
	        console.log("iterate");
	        if(num > 0) iterate(num - 1);
	    }, 8000);
	}

	function highlightCurrentNumber() {
		var currentNumberPanelHeading = $('#current-number-panel .panel-heading');
		var currentNumberPanelBody = $('#current-number-panel .panel-body');

		currentNumberPanelHeading.removeAttr('style');
	    currentNumberPanelHeading.css('background-color', '#076861')
	    currentNumberPanelHeading.css('color', 'white');

	    currentNumberPanelBody.removeAttr('style');
	    currentNumberPanelBody.css('background-color', '#46cc99');
	    currentNumberPanelBody.css('color', 'white');

	    setTimeout(function () {
	    	currentNumberPanelHeading.css({
	        	'background-color': '#46cc99',
	        	'color': '#023341',
			    '-webkit-transition': 'background-color color 750ms linear',
			    '-moz-transition': 'background-color color 750ms linear',
			    '-o-transition': 'background-color color 750ms linear',
			    '-ms-transition': 'background-color color 750ms linear',
			    'transition': 'background-color color 750ms linear',
	    	});
	    }, 1500);

	    setTimeout(function () {
	    	currentNumberPanelBody.css({
	        	'background-color': 'white',
	        	'color': '#023341',
			    '-webkit-transition': 'background-color color 750ms linear',
			    '-moz-transition': 'background-color color 750ms linear',
			    '-o-transition': 'background-color color 750ms linear',
			    '-ms-transition': 'background-color color 750ms linear',
			    'transition': 'background-color color 750ms linear',
	    	});
	    }, 1500);		
	}
});

