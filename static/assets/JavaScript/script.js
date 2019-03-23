/* Smooth Scrolling */
function scrollTo( target ) {
    if( target.length ) {
        $("html, body").stop().animate( { scrollTop: target.offset().top }, 1000);
    }
}  

$(document).ready(function(){
  $(".boxRecherche").on('click', function(event) {
	event.preventDefault();
  	scrollTo( $(".boxRecherche") );
  });
});	