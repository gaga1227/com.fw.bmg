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
	onWFLoading: 	function()	{},
	onWFComplete: 	function()	{									
									//landing pages
									if ( $('body.landing').length ) {
										initTiles();
									}
								},
	onWFActive: 	function()	{},
	onWFInactive: 	function()	{}
};
/* ------------------------------------------------------------------------------ */
/* initTiles */
/* ------------------------------------------------------------------------------ */
function initTiles(customopts){
	//exit
	if ( typeof(Packery) != 'function' ) return 'Packery NOT loaded';
	if ( $('html').hasClass('oldie') ) return 'skipping oldIE';
	
	//vars
	var container = $('#tiles')[0],
		opts = {};
	
	//update opts
	opts = { 
		containerStyle:		null,
		isReiszeBound:		true,
		transitionDuration:	'0.3s',
		itemSelector:		'.tile',
		stamp:				'.tile.gridSizer.stamp'
	}
	opts = $.extend(opts, customopts); 
	
	// initialize
	imagesLoaded( container, function() {
		Tiles = new Packery(container, opts);
		Tiles.layout();
	});
}
/* ------------------------------------------------------------------------------ */
/* init */
/* ------------------------------------------------------------------------------ */
var Tiles, SelectNav, Slideshows, StaticAudios, StaticVideos;
function init(){
	//layout assistance
	insertFirstLastChild('#navItems, #sideNav, #sideNav ul, .itemListing, #main > .padder');
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
	//layout assistance
	insertFirstLastChild('#tiles, .tile > .contentViewport');
	//iOS native scrolling fail fix
	initIOSNativeScrollerFix();
}
/* DOM Ready */
$(document).ready(function(){
	console.log('DOM Ready');
	initWebFontLoader();
	Platform.addDOMClass();
	init();	
});