/* ------------------------------------------------------------------------------ */
/* webfonts */
/* ------------------------------------------------------------------------------ */
WebFontConfig = { 
	google: 		{ families: [ 'Source+Sans+Pro:200,300,400,600,700,200italic,300italic,400italic,600italic,700italic:latin' ] },
	loading: 		function() { console.log('[WF] loading'); 	WebFontUtils.onWFLoading(); },
	active: 		function() { console.log('[WF] active'); 	WebFontUtils.onWFActive(); 	 WebFontUtils.onWFComplete(); },
	inactive: 		function() { console.log('[WF] inactive'); 	WebFontUtils.onWFInactive(); WebFontUtils.onWFComplete(); },
	fontloading: 	function( familyName, fvd ) { console.log( '[WF] ' + familyName, fvd, 'loading' ); },
	fontactive: 	function( familyName, fvd ) { console.log( '[WF] ' + familyName, fvd, 'active' ); },
	fontinactive: 	function( familyName, fvd ) { console.log( '[WF] ' + familyName, fvd, 'inactive' ); },
	timeout: 		5000
};
WebFontUtils = {
	onWFLoading: 	function()	{
									//show loader
									
								},
	onWFComplete: 	function()	{
									//hide loader
									
									//isotope tiles
									if ( $('body.landing').length ) {
										$isotope = new initIsotope();
									}
								},
	onWFActive: 	function()	{},
	onWFInactive: 	function()	{}
}
/* ------------------------------------------------------------------------------ */
/* initIsotope */
/* ------------------------------------------------------------------------------ */
function initIsotope(){
	//vars
	var $container = $('.isotopeContainer'),
		colW = 320,
		isotopeIsOn = false;
	//update handler
	function update(){
		//check mq
		var isotopeRequired = Modernizr.mediaqueries ? !Modernizr.mq(mqStates.max400) : $(window).width() > 400;
		//toggle isotope
		if (isotopeRequired) {
			//check flag
			if (isotopeIsOn) return '[isotope] already on';
			//update flag
			isotopeIsOn = true;
			//imagesLoaded
			$container.imagesLoaded(function(){
				//isotope
				$container.isotope({
					itemSelector:	'.item.tile',
					layoutMode:		'masonry',
					masonry:		{ 
										columnWidth: colW,
										cornerStampSelector: '.corner-stamp'
									}
				}, function($items){
					console.log('[isotope] anim complete');	
				});
				console.log('[isotope] initialised');				
			});	
		} else {
			//check flag
			if (!isotopeIsOn) return '[isotope] already off';
			//update flag
			isotopeIsOn = false;
			//destroy
			$container.isotope('destroy');
			console.log('[isotope] destroyed');
		}	
	}
	//init call
	update();
	//bind update to window resize
	$(window).bind('resize', update);
	//return global obj
	return $container;
}
/* ------------------------------------------------------------------------------ */
/* init */
/* ------------------------------------------------------------------------------ */
var $isotope, SelectNav, Slideshows, StaticAudios, StaticVideos;
function init(){
	//layout assistance
	insertFirstLastChild('#navItems, #sideNav, #sideNav ul, .itemListing');
	
	//interactions	
	ToggleNav = new initToggleNav();
	
	//template specific functions
	if 		( $('body#home').length ) 			{ initHome(); }
	else if ( $('body.landing').length ) 		{ initLanding(); }
	else {
		//media
		Slideshows = new initSlideshows();
		StaticAudios = new initStaticAudios();
		StaticVideos = new initStaticVideos();
		//form
		initDatepicker();
	}
	
	//debug
	displayDebugInfo('#debugInfo');
}
function initHome(){

}
function initLanding(){

}
/* DOM Ready */
$(document).ready(function(){
	console.log('DOM Ready');
	initWebFontLoader();
	Platform.addDOMClass();
	init();	
});