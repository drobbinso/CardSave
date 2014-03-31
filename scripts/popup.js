/**
 * @author drobbins
 */
$(document).ready(function() {
	if(('cards' in localStorage) !== true)
		localStorage.setItem('cards', JSON.stringify([]));
		
	$('#reset').click(function(){
		var savedPassword = JSON.parse(localStorage['pass']);
		var verify = prompt('Enter your password:');
		var encrypted = window.cardsave.encryptPassword(verify);
		if(encrypted !== savedPassword)
			alert("Incorrect password. Try again.");
		else {
			localStorage.removeItem('pass');
			window.cardsave.createPassword();
		}
	});
	
	var passwordEntered = false;
	if(('pass' in localStorage) === false)
		window.cardsave.createPassword();
	else
		window.cardsave.verifyPassword();
	
	$('.addnew').on("click",function(){
		$('.collapse').toggle(500);
	});
	$('.collapse').toggle();
	
	$('input[name=addcard]').click(function(){
		window.cardsave.addCard();
	});
});