/**
 * @author drobbins
 */
(function(window, undefined) {
	var cardsave = {};
	window.cardsave = cardsave;
})(window);

window.cardsave.createPassword = function() {
	$('label[name=passlabel]').text("Create a Password:");
	$('input[name=submitPassword]').val('Save');
	$('input[name=submitPassword]').off('click');
	$('input[name=submitPassword]').click(function() {
		var createPassword = $('input[name=passinput]').val();
		if(createPassword !== '') {
			var encrypted = window.cardsave.encryptPassword(createPassword);
			localStorage['pass'] = JSON.stringify(encrypted);
			alert("Success! You may login now.");
			$('input[name=passinput]').val('');
			$('label[name=passlabel]').text("Enter Your Password:");
			$('input[name=submitPassword]').val('Submit');
			window.cardsave.verifyPassword();
		}
	});
};

window.cardsave.encryptPassword = function(password) {
	var encrypted = $.md5(password);
	return encrypted;
};

window.cardsave.verifyPassword = function() {
	savedPassword = JSON.parse(localStorage['pass']);
	$('input[name=submitPassword]').off('click');
	$('input[name=submitPassword]').click(function() {
		var password = window.cardsave.encryptPassword($('input[name=passinput]').val());
		if(password !== savedPassword)
			alert("Incorrect password. Try again.");
		else {
			$('.passworddiv').toggle(500);
			window.cardsave.loadCards();
			$('.newcarddiv').css("visibility", "visible");
		}
	});
};

window.cardsave.loadCards = function() {
	var cards = JSON.parse(localStorage.getItem('cards'));
	for(var i = 0; i < cards.length; i++){
	  	var card = cards[i];
	  	if(card !== undefined) {
			$('.cardlist').append(card.html);
			var cardclass = $(card.html).attr('class');
			var buttonclass = cardclass.split("card");
			window.cardsave.setNewCardCss($('.' + cardclass), card);
			$('.btnremove' + buttonclass[1]).css("margin-left", "35px");
			window.cardsave.setBtnRemove(buttonclass[1], i);
		}
	};
};

window.cardsave.setBtnRemove = function(index, i) {
	$('.btnremove' + index).click(function(){
		var confirmRemove = confirm("Are you sure you wish to remove this card?");
		if(confirmRemove === true) {
			var item = 'card' + index;
			$('.card'+index).remove();
			var cards = JSON.parse(localStorage.getItem('cards'));
			cards.splice(i, 1);
			localStorage.setItem('cards', JSON.stringify(cards));
		}
	});
};

window.cardsave.validateCard = function() {
	$('#cardForm').validate({ // initialize the plugin
        rules: {
            name: {
                required: true
            },
            number: {
                required: true,
                minlength: 13,
                maxlength: 16,
                number: true
            },
            month: {
                required: true
            },
            year: {
            	required: true
            },
            code: {
            	required: false,
            	minlength: 3,
            	maxlength: 4,
            	number: true
            }
        },
        messages: {
        	name: {
        		required: 'Enter Full Name'
        	},
        	number: {
        		required: 'Required Field',
        		minlength: 'Too Short',
        		maxlength: 'Too Long',
        		number: 'Numbers Only'
        	},
        	month: {
        		required: 'Required'
        	},
        	year: {
        		required: 'Required'
        	},
        	code: {
        		minlength: 'Too Short',
        		maxlength: 'Too Long',
        		number: 'Numbers Only'
        	}
        }
	});
	
	return $('#cardForm').valid();
};

window.cardsave.addCard = function() {
	var validated = window.cardsave.validateCard();
	
	if(validated === true) {
		var name = $('input[name=name]').val();
		var number = $('input[name=number]').val();
		var month = $('select[name=month]').val();
		var year = $('select[name=year]').val();
		var code = $('input[name=code]').val();
		var card = $('select[name=card]').val();
		
		var getcard = window.cardsave.getCardFromNumber(number);
		if(getcard !== '')
			card = getcard;
		
		//Get card index
		var count = $('.cardlist>div').length;
		while($('.card'+count).length > 0)
			count++;
		
		$('.collapse').toggle(250);
		
		var newCard = "<div class='card" + count + "'>" +
	  		"<div class='imgdiv'>" +
	  			"<img src='images/" + card + ".png'/>" +
	  			"<input type='button' value='Remove' class='btnremove" + count + "'/>" +
	  		"</div>" +
	  		"<div class='carddiv'>" +
		  		"<p class='cardp'>" +
			  		name + "<br/>" +
			  		number + "<br/>" +
			  		month + "/" + year + "<br/>" +
			  		code + "<br/>" +
			  	"</p>" +
		  	"</div>" +
	  	"</div>";
	  	
		$('.cardlist').append(newCard);
		
		var cardInfo = {"html":newCard, "name":name, "number":number, "month":month, "year":year, "code":code, "card":card};
		
		window.cardsave.setNewCardCss($('.card' + count), cardInfo);
		
		//Get cards array from localStorage
		var cards = JSON.parse(localStorage.getItem('cards'));
		//Push new card to array
		cards.push(cardInfo);
		//Set cards array in localStorage
		localStorage.setItem('cards', JSON.stringify(cards));
		
		$('.btnremove' + count).css("margin-left", "35px");
		window.cardsave.setBtnRemove(count, cards.length);
		$('input[type=text]').val('');
	}
};

window.cardsave.getCardFromNumber = function(number) {
	/*'*CARD TYPES            *PREFIX           *WIDTH
	'American Express       34, 37            15
	'Discover               6011              16
	'Master Card            51 to 55          16
	'Visa                   4                 13, 16*/
	var card = "";
	var disco = number.substring(0,4);
	if(disco === "6011")
		card = "disco";
	var amexmaster = number.substring(0,2);
	switch(amexmaster) {
		case "34":
			card = "amex";
			break;
		case "37":
			card = "amex";
			break;
		case "51":
			card = "master";
			break;
		case "52":
			card = "master";
			break;
		case "53":
			card = "master";
			break;
		case "54":
			card = "master";
			break;
		case "55":
			card = "master";
			break;
	}
	var visa = number.substring(0,1);
	if(visa === "4")
		card = "visa";
		
	return card;
};

window.cardsave.setNewCardCss = function(card, cardInfo) {
	card.css("background", "#DBC46E");
	card.css("border", "solid");
	card.css("border-width", "2px");
	card.css("height", "120px");
	card.css("width", "390px");
	card.css("margin-left", "-20px");
	card.css("cursor", "pointer");
	
	var carddiv = card.find("div.carddiv");
	
	carddiv.mouseover(function() {
		card.css("background", "#CC9900");
	});
	carddiv.mouseout(function() {
		card.css("background", "#DBC46E");
	});
	carddiv.mousedown(function() {
		card.css("background", "#999");
	});
	carddiv.mouseup(function() {
		card.css("background", "#CC9900");
		
		var savedPassword = JSON.parse(localStorage['pass']);
		var verify = prompt('Enter your password to fill form data:');
		var encrypted = window.cardsave.encryptPassword(verify);
		if(encrypted !== savedPassword)
			alert("Incorrect password. Try again.");
		else
			window.cardsave.fillFormData(cardInfo);
	});
};

window.cardsave.fillFormData = function(cardInfo) {
	chrome.tabs.executeScript(null, {file: "scripts/vendor/jquery-2.0.3.js"}, function() {
		chrome.tabs.executeScript(null, {code: "var cardInfo = {" + 
		"name:'" + cardInfo.name + 
		"', number:'" + cardInfo.number + 
		"', month:'" + cardInfo.month + 
		"', year:'" + cardInfo.year + 
		"', code:'" + cardInfo.code + 
		"', card:'" + cardInfo.card + 
		"'};"}, function() {
			chrome.tabs.executeScript(null, {file: "scripts/inject.js"});
		});
	});
};