$(document).ready(function() {
	$('#status').fadeOut(); // will first fade out the loading animation
	$('#preloader').delay(50).fadeOut(300); // will fade out the white DIV that covers the website.
	$('body').delay(50).css({'overflow':'visible'});
});