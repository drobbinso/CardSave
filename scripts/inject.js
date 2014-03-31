/**
 * @author drobbins
 */
(function () {
	$('input[name=name]').val(cardInfo.name);
	$('input[name=number]').val(cardInfo.number);
	$('select[name=month]').val(cardInfo.month);
	$('select[name=year]').val(cardInfo.year);
	$('input[name=code]').val(cardInfo.code);
	$('select[name=card]').val(cardInfo.card);
}());