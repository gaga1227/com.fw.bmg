/* ------------------------------------------------------------------------------ */
/* webfonts */
/* ------------------------------------------------------------------------------ */
WebFontConfig = { 
	google: 		{ families: [ 'Source+Sans+Pro:200,300,400,600,700,200italic,300italic,400italic,600italic,700italic' ] },
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
/* initFocus */
/* ------------------------------------------------------------------------------ */
function initFocus() {
	
	//exit if no focus
	if (!$('#focus').length) return false;
	
	//vars
	var //elems
		$window = $(window),
		$focus = $('#focus'),
		$slideshow = $('#focusSlideshow'),
		$slides = $slideshow.find('.slide'),
		
		//classes
		scaleByHCls = 'scaleByH',
		scaleByWCls = 'scaleByW',		
		
		//properties	
		winH, winW,
		focusW, focusH, focusAR,
		slideW, slideH, slideAR = 1400/900,
		
		//functions
		getWindowInfo = function(){
			winW = $window.innerWidth();
			winH = $window.innerHeight();
		},
		getFocusInfo = function(){
			focusW = $focus.innerWidth();
			focusH = $focus.innerHeight();
			focusAR = focusW/focusH;
		}
		getSlideInfo = function(){
			slideW = $slides.width();
			slideH = $slides.height();
			if ( slideW == 0 ) slideW = Math.round(focusH * slideAR);
			if ( slideH == 0 ) slideH = Math.round(focusW / slideAR);
		},
		updateSlides = function(){
			//compare slide and container AR and update size and pos
			if ( focusAR > slideAR ) {
				//size
				$slides.removeClass(scaleByHCls);
				$slides.addClass(scaleByWCls);
				//pos
				//console.log('slideH:'+slideH, 'focusH:'+focusH);
				getSlideInfo();
				$slides.css( 'margin-left', 0 );
				$slides.css( 'margin-top', -1 * Math.round(Math.abs((slideH - focusH)/2)) );
				//console.log('byW', slideH - focusH);
			} else {
				//size
				$slides.removeClass(scaleByWCls);
				$slides.addClass(scaleByHCls);	
				//pos
				//console.log('slideW:'+slideW, 'focusW:'+focusW);
				getSlideInfo();
				$slides.css( 'margin-top', 0 );
				$slides.css( 'margin-left', -1 * Math.round(Math.abs((slideW - focusW)/2)) );
				//console.log('byH', slideW - focusW);
			}	
		},
		resetSlides = function(){
			$slides.removeClass(scaleByWCls);
			$slides.removeClass(scaleByHCls);
			$slides.attr('style','');
		};
	
	//handler
	function update(e){
		//update properties
		getFocusInfo();
		getSlideInfo();
		//update slides
		updateSlides();
	}
	
	//master functions
	function init(){
		$window.on('resize.focus', update);
		update();	
	}
	
	//kick off
	init();
}
/* ------------------------------------------------------------------------------ */
/* initFocusSlides */
/* ------------------------------------------------------------------------------ */
function initFocusSlides(){
	//vars
	var //cache elems
		$container = $('#focusSlideshow'),
		$slides = $container.find('.slide'),
		
		//settings
		autoplay = true,
		pauseonhover = Modernizr.touch ? false : true,
		effect = 'fade',
		
		//function
		updateIntro = function(nextSlide, showFlag){
			//vars
			var //intro
				$intro = $('#intro'),
				$title = $('#introTitle'), 
				$text = $('#introText'),
				$btn = $('#introButton'),
				//slide
				$slide = $(nextSlide),
				$slideLink = $slide.parent('a'),
				//data
				title = $.trim($slide.data('title')),
				text = $.trim($slide.data('text')),
				url = $.trim($slideLink.attr('href')),
				//static
				speed = 800,
				hideCls = 'out',
				showCls = 'in',
				css3Trans = Modernizr.csstransitions;
			
			//update intro
			if (showFlag) {
				$title.text(title);
				$text.text(text);
				$btn.attr('href', url);
				if (css3Trans) {
					$intro
						.removeClass(hideCls)
						.addClass(showCls);
				} else {
					$title.animate({opacity:1}, speed);
					$text.animate({opacity:1}, speed);
					$btn.animate({opacity:1}, speed);
				}
			} else {
				if (css3Trans) {
					$intro
						.removeClass(showCls)
						.addClass(hideCls);
				} else {
					$title.animate({opacity:0}, speed);
					$text.animate({opacity:0}, speed);
					$btn.animate({opacity:0}, speed);
				}
			}
		},
		
		//callbacks
		onBefore = function( currSlide, nextSlide, opts, forwardFlag ){
			updateIntro(nextSlide, false);
		}, 
		onAfter = function( currSlide, nextSlide, opts, forwardFlag ){			
			updateIntro(nextSlide, true);
		}, 
	
		//initiation call to player obj
		slideshowObj = $container.cycle({
			fx:     	effect, 
			speed:  	2000, 
			timeout: 	8000,
			nowrap:		0,
			slideExpr:	$slides,
			before:		onBefore,
			after:		onAfter
		});
	
	//autoplay
	slideshowObj.cycle(autoplay ? 'resume' : 'pause', false);
	
	//pause on hover
	if ( autoplay && pauseonhover ) {
		$container.hover( function(e){
			slideshowObj.cycle('pause', true);
		}, function(e){
			slideshowObj.cycle('resume');
		} );	
	}
	
	//return slideshow player obj
	return slideshowObj;	
}
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
var FocusSlideshow, Tiles, ToggleNav, Slideshows, StaticAudios, StaticVideos, Videos;
function init(){
	//layout assistance
	insertFirstLastChild('#navItems, #sideNav, #sideNav ul, .itemListing, #main > .padder');
	//interactions	
	ToggleNav = new initToggleNav();
	//template specific functions
	if 		( $('body.home').length ) 			{ initHome(); }
	else if ( $('body.landing').length ) 		{ initLanding(); }
	else {
		//media
		Slideshows = new initSlideshows();
		StaticAudios = new initStaticAudios();
		Videos = new initVideos();
		//StaticVideos = new initStaticVideos();
		//widgets
		initCalendar();
		//form
		initDatepicker();
	}
	//debug
	displayDebugInfo('#debugInfo');
}
function initHome(){
	//focus
	initFocus();
	FocusSlideshow = new initFocusSlides();
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
	initTouchState();
	init();	
});