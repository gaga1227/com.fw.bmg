/* ------------------------------------------------------------------------------ */
/* webfonts */
/* ------------------------------------------------------------------------------ */
WebFontConfig = { 
	google: 		{ families: [ 'Merriweather:400,700:latin', 'Montserrat:400,700:latin' ] },
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
									if ( $('body#home').length || $('body.landing').length ) {
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
/* initClickLoading */
/* ------------------------------------------------------------------------------ */
function initClickLoading(){
	//vars
	var $container = $('.isotopeContainer'),
		$btnLoad = $('#btnLoadMore'),
		loadingCls = 'loading',
		errorCls = 'error',
		url = 'news/newsitems.cfm?startrow=',
		itemSelector = '> .item.news',
		lastRowSelector = '> .lastRow',
		startRow, lastRow = false,
		speed = 300;
	
	//loadMoreItem
	function loadMoreItem(targetURL){
		//vars
		var request,
			thisObj = this,
			url = targetURL;
	
		//abort if no url or in request already
		if (!url || this.inRequest) return false;
	
		//otherwise set in request status and show loader
		this.inRequest = true;
	
		//show loader
		$btnLoad.removeClass(errorCls);
		$btnLoad.addClass(loadingCls);
	
		//make request call
		request = $.ajax({
			url:		url,
			type:		'GET',
			dataType:	'html',
			success:	function(data, textStatus, jqXHR) {
							//alert('getPage: success');
							console.log('[loadMoreItem]: success');
							//apply data
							addNewItems(data);
						},
			complete:	function(jqXHR, textStatus) {
							//alert('getPage: complete');
							console.log('[loadMoreItem]: complete');
							thisObj.inRequest = false;
							//hide loader
							$btnLoad.removeClass(loadingCls);
						},
			error:		function(jqXHR, textStatus, errorThrown) {
							//alert('getPage: error', textStatus, errorThrown);
							console.log('[loadMoreItem]: error', textStatus, errorThrown);
							$btnLoad.addClass(errorCls);
						}
		});
	}	
	
	//addNewItems
	function addNewItems(data){
		//console.log(data);
		var $newItems = $(data),
			isotopeRequired = Modernizr.mediaqueries ? !Modernizr.mq(mqStates.max400) : $(window).width() > 400;
		//adding to DOM
		$container.append($newItems);
		if (isotopeRequired) {
			$container.imagesLoaded(function(){
				$container.isotope('appended', $newItems);
			});
		}
		//check lastrow and handle trigger button
		lastRow = $container.find(lastRowSelector).length ? true : false;
		if (lastRow) {
			$btnLoad.off().fadeOut(speed);
		}
	}
	
	//bind behavior
	$btnLoad.on('click', function(e){
		e.preventDefault();
		startRow = $container.find(itemSelector).length + 1;
		//console.log('startRow: ', startRow);
		loadMoreItem(url + startRow);
	});
}
/* ------------------------------------------------------------------------------ */
/* initBannerSlides */
/* ------------------------------------------------------------------------------ */
function initBannerSlides(){
	//vars
	var //cache elems
		$banner = $('#banner'),
		$slides = $banner.find('.slide'),
		$btnPrev = $banner.find('.btnPrev'),
		$btnNext = $banner.find('.btnNext'),
		$line = $banner.find('.headline > span:eq(0)'),
		$lineAlt = $banner.find('.headline > span.alt:eq(0)'),	
		$btnMore = $banner.find('.btnMore'),
		
		//settings
		autoplay = ($banner.attr('data-autoplay')=='1') ? true : false,
		pauseonhover = Modernizr.touch ? false : true,
		effect = 'fade',
		
		//static
		animCls1 = 'animated',
		animCls2 = animCls1 + ' delay1',
		animCls3 = animCls1 + ' delay2',
		
		//function
		toggleAnim = function(forwardFlag, show){
			var effectCls = forwardFlag ? ' fadeInLeft' : ' fadeInRight',
				effectClsAll = ' fadeInLeft fadeInRight',
				hasBtnMore = !Modernizr.mq(mqStates.max640);
			
			if (show) {
				$line.addClass(animCls1 + effectCls);
				$lineAlt.addClass(animCls2 + effectCls);
				if (hasBtnMore) $btnMore.addClass(animCls3 + effectCls);
			} else {
				$line.removeClass(animCls1 + effectClsAll);
				$lineAlt.removeClass(animCls2 + effectClsAll);
				if (hasBtnMore) $btnMore.removeClass(animCls3 + effectClsAll);
			}
		},
		
		//callbacks
		onBefore = function( currSlide, nextSlide, opts, forwardFlag ){
			//get nextSlide data
			var $nextSlide = $(nextSlide),
				line = $nextSlide.attr('data-line'),
				lineAlt = $nextSlide.attr('data-line-alt'),
				href = $nextSlide.attr('data-href'),
				effectCls = forwardFlag ? ' fadeInLeft' : ' fadeInRight';
			
			//apply data
			$line.text(line);
			$lineAlt.text(lineAlt);
			$btnMore.attr('href', href);		
			
			//anim
			toggleAnim(forwardFlag, true);
		}, 
		onAfter = function( currSlide, nextSlide, opts, forwardFlag ){			
			//anim
			toggleAnim(forwardFlag, false);
		}, 
	
		//initiation call to player obj
		slideshowObj = $banner.cycle({
			fx:     	effect, 
			speed:  	1500, 
			timeout: 	8000,
			nowrap:		0,
			prev:   	$btnPrev, 
			next:   	$btnNext,
			slideExpr:	$slides,
			before:		onBefore,
			after:		onAfter
		});
	
	//autoplay
	slideshowObj.cycle(autoplay ? 'resume' : 'pause', false);
	
	//pause on hover
	if ( autoplay && pauseonhover ) {
		$banner.hover( function(e){
			slideshowObj.cycle('pause', true);
		}, function(e){
			slideshowObj.cycle('resume');
		} );	
	}
	
	//return slideshow player obj
	return slideshowObj;	
}
/* ------------------------------------------------------------------------------ */
/* initHomeFilter */
/* ------------------------------------------------------------------------------ */
function initHomeFilter(){
	//vars
	var $container = $('#filterTabs'),
		$tabs = $('.btnTab'),
		hasTouch = Modernizr.touch;
		
	//handlers
	onHover = function($tab, hoverOn) {
		var idx = $tab.attr('id').substr(6,1),
			hoverCls = 'hover' + idx;
		//exit if hover on active tab
		if ($tab.attr('class').indexOf('selected') != -1) {
			return false;
		}
		//update hover class
		$container.removeClass('hover1 hover2 hover3');
		if (hoverOn) $container.addClass(hoverCls);
	}
	onTabClick = function(e){
		e.preventDefault();
		var $tab = $(this),
			idx = $tab.attr('id').substr(6,1),
			selector = $tab.attr('data-filter'),
			activeCls = 'active' + idx;
		//update active class
		$container.removeClass('active1 active2 active3 hover1 hover2 hover3');
		$container.addClass(activeCls);
		//update selected state
		$tabs.removeClass('selected');
		$tab.addClass('selected');
		//isotope filter
		if ($isotope.length) $isotope.isotope({ filter: selector });
	}
	
	//hover
	if (!hasTouch) {
		$tabs.hover( function(e){
			onHover($(this), true);	
		}, function(e){
			onHover($(this), false);	
		});
	}
	
	//bind behavior
	$container.on('click', '.btnTab', onTabClick);	
}
/* ------------------------------------------------------------------------------ */
/* initSchoolProfileReadMore */
/* ------------------------------------------------------------------------------ */
function initSchoolProfileReadMore(){
	//vars
	var $trigger = $('.btnReadMore'),
		$target = $trigger.prev('.extra');
	//exit if no instances
	if (!$trigger.length || !$target.length) return false;
	//handler
	function onResize(e){
		var isMobile = Modernizr.mq(mqStates.max500) || $(window).width() <= 500;
		if (isMobile) {
			$trigger.show();
			$target.slideUp({
				complete: onToggleComplete
			});
		} else {
			$trigger.hide();
			$target.slideDown({
				complete: onToggleComplete
			});
		}
	}
	function onToggleComplete(e){
		var $this = $(this),
			$label = $trigger.find('.label'),
			$icon = $trigger.find('i'),
			hasIcon = $icon.length ? true : false;
		if ($this.css('display') != 'none') {
			if (hasIcon) $icon.removeClass('icon-plus').addClass('icon-minus');
			$label.text('Hide Text');
		} else {
			if (hasIcon) $icon.removeClass('icon-minus').addClass('icon-plus');
			$label.text('Read More');
		}
	}
	//bind behavior
	$trigger.on('click', function(e){
		e.preventDefault();
		$target.slideToggle({
			complete: onToggleComplete
		});
	});
	//init
	onResize();
	$(window).on('resize.schoolProfileReadMore', onResize);
}
/* ------------------------------------------------------------------------------ */
/* initSchoolProfileMap */
/* ------------------------------------------------------------------------------ */
function initSchoolProfileMap(){
	//vars
	var $mapContainer = $('#schoolMapContainer'),
		$mapInfoData = $('#schoolMapInfoData').hide(),
		opts = {};
	
	//exit if no instance
	if (!$mapContainer.length) return false;
	
	//update opts
	opts.title = $mapContainer.data('title');
	opts.lat = parseFloat($mapContainer.data('lat'));
	opts.lng = parseFloat($mapContainer.data('lng'));	
	//opts.center = { lat:opts.lat, lng:opts.lng };
	
	opts.target = $mapContainer.attr('id');
	opts.info = $.trim($mapInfoData.html());
	opts.showInfo = $mapContainer.data('showInfo') == '1' ? true : false;
	opts.showCenter = $mapContainer.data('showCenter') == '1' ? true : false;
	opts.infoWidth = 250;
	
	//exit if no key data
	if (isNaN(opts.lat) || isNaN(opts.lng) || !opts.title) return '[SchoolProfileMap]: Abort on missing map data(lat, lng, title)';
	
	//initMap
	Map = new initMap(opts);
}
/* ------------------------------------------------------------------------------ */
/* initDioceseMap */
/* ------------------------------------------------------------------------------ */
function initDioceseMap(){
	//vars
	var $mapContainer = $('#dioceseMapContainer'),
		opts = {};
	
	//exit if no instance
	if (!$mapContainer.length) return false;
	
	//update opts
	opts.target = $mapContainer.attr('id');
	opts.title = $mapContainer.data('title');
	opts.lat = parseFloat($mapContainer.data('lat'));
	opts.lng = parseFloat($mapContainer.data('lng'));
	opts.showCenter = $mapContainer.data('showCenter') == '1' ? true : false;
	opts.zoom = 9;	
	opts.infoWidth = 300;
	opts.infoHeight = 330;
	opts.showInfo = false;
	
	//exit if no key data
	if (isNaN(opts.lat) || isNaN(opts.lng) || !opts.title) return '[dioceseMap]: Abort on missing map data(lat, lng, title)';
	
	//initMap
	Map = new initMap(opts);
}
/* ------------------------------------------------------------------------------ */
/* initSchoolsFilter */
/* ------------------------------------------------------------------------------ */
function initSchoolsFilter(){
	//vars
	var schoolsFilter = {},
		$form = $('#formFilter'),
		$select = $('#fmFilter'),
		$btnFilter = $('#btnFilter'),
		$items = $('#schoolListing').find('.item.school.tile'),
		$mapInfoTmpl = $($('#dioceseMapInfoTmpl').html()),
		hideCls = 'hidden';
	
	/* -------------------------------------------------------------------------- */
	/* data */
	
	/* create containers */
	schoolsFilter.schools = [];
	schoolsFilter.schoolVisibility = [];
	schoolsFilter.boundList = [];
	/* update containers */
	$.each($items, function(idx, ele){
		var $school = $(ele),
			data = {};
		
		//collect school data
		data.lat = $school.data('lat');
		data.lng = $school.data('lng');
		data.latlng = new google.maps.LatLng(data.lat, data.lng);
		data.title = $.trim($school.find('.title').text());
		data.address = $.trim($school.find('.address').text());
		data.suburb = $.trim($school.find('.tag').text());
		data.href = $school.find('a').attr('href');
		data.type = $school.hasClass('primary') ? 'p' : $school.hasClass('secondary') ? 's' : 'k'; 
		data.theme = $school.hasClass('primary') ? 'grn' : $school.hasClass('secondary') ? 'red' : 'ppl';
		data.filter = $school.hasClass('primary') ? 'Primary School' : $school.hasClass('secondary') ? 'Secondary School' : 'K-12';
		
		//construct info window with school data
		$mapInfoTmpl.removeClass('grn ppl red').addClass(data.theme);
		$mapInfoTmpl.find('.header > .label').text(data.filter);
		$mapInfoTmpl.find('.btnSchool').attr('href',data.href);
		$mapInfoTmpl.find('.btnSchool .title').text(data.title);
		$mapInfoTmpl.find('.btnSchool .address').text(data.address);
		$mapInfoTmpl.find('> .content .padder').html( $school.find('.data').html() );
		
		//store info window in school data
		data.info = $mapInfoTmpl[0].outerHTML;
		
		//create info window/bubble
		/*
		data.infoWindow = new google.maps.InfoWindow({
			content: 	data.info || '',
			maxWidth: 	Map.opts.infoWidth || 250
		}),
		// */
		data.infoWindow = new InfoBubble({
			content: 				data.info || '',
			minWidth: 				Map.opts.infoWidth || 300,
			maxWidth: 				Map.opts.infoWidth || 300,
			maxHeight: 				Map.opts.infoHeight || 330,
			/* infoBubble */
			disableAutoPan: 		false,
			hideCloseButton: 		false,
			shadowStyle: 			1,
			padding: 				0,
			backgroundColor: 		'#ffffff',
			backgroundClassName:	'mapInfoBubbleBg',
			borderRadius: 			0,
			borderWidth: 			0,
			borderColor: 			'#ffffff',
			arrowPosition: 			30,
			arrowSize: 				15,
			arrowStyle: 			0
		}),	
		
		//update school list data
		schoolsFilter.schools.push(data);
		schoolsFilter.schoolVisibility[idx] = true;
	});
	
	/* -------------------------------------------------------------------------- */
	//methods
	schoolsFilter.filter = function(token){
		//vars
		var //filter items into groups
			$relevants = $items.filter(function(idx){
				if ($(this).hasClass(token)) {
					schoolsFilter.schoolVisibility[idx] = true;
					return $(this);
				}
			});
			$irrelevants = $items.filter(function(idx){
				if (!$(this).hasClass(token)) {
					schoolsFilter.schoolVisibility[idx] = false;
					return $(this);
				}
			});
		
		/* -------------------------------------------------------------------------- */
		//apply filter to list view
		$relevants.removeClass(hideCls);
		$irrelevants.addClass(hideCls);
		
		/* -------------------------------------------------------------------------- */
		//apply filter to map view
		
		//clear boundlist
		schoolsFilter.boundList = [];
		
		//update markers
		$.each(schoolsFilter.schoolVisibility, function(idx, val){
			//vars
			var schoolData = schoolsFilter.schools[idx],
				schoolIsVisible = val,
				markerCreated = schoolData.marker ? true : false;
			//create marker if not already
			if (!markerCreated) {
				schoolData.marker = Map.addMarker({ 
					map:		Map.map, 
					lat:		schoolData.lat, 
					lng:		schoolData.lng, 
					title:		schoolData.title,
					icon:		'_lib/img/marker-' + schoolData.type + '.png'
				});
				//bind info window to marker
				Map.bindInfoWindow({ 
					map:		Map.map, 
					marker:		schoolData.marker, 
					infoWindow:	schoolData.infoWindow
				});	
			}
			//update marker visibility
			Map.toggleMarker(schoolData.marker, schoolIsVisible);
			//update boundList
			if (schoolIsVisible) schoolsFilter.boundList.push(schoolData.latlng);
		})
		
		//update map bounds
		Map.updateBound(Map.map, schoolsFilter.boundList);	
		
		/* -------------------------------------------------------------------------- */
		//keep form value consistent
		if ($select.val() != token) {
			$select.val(token);
			$select.trigger('change');
		}
		
		console.log('[SchoolFilter] ' + token);
	}	
	
	//handlers
	onFilter = function(e){
		e.preventDefault();
		var filter = $select.val();
		//apply filter	
		schoolsFilter.filter(filter);	
	}
	
	//bind behavior
	$btnFilter.on('click', onFilter);
	
	//init view
	$btnFilter.trigger('click');	
	
	//return API obj to DOM
	return schoolsFilter;
}
/* ------------------------------------------------------------------------------ */
/* initSchoolsViewSwitch */
/* ------------------------------------------------------------------------------ */
function initSchoolsViewSwitch(){
	//vars
	var schoolsView = {},
		$mapView = $('#dioceseMap'),
		$listView = $('#dioceseSchools'),
		$btnMap = $('#btnMap'),
		$btnList = $('#btnList'),
		$viewLabel = $('#schoolsViewLabel'),
		labels = { map:'Diocese Map', list:'School Listing' },
		selectedCls = 'selected';
	
	/* -------------------------------------------------------------------------- */
	//update properties

	//elems
	schoolsView.$map = $mapView;
	schoolsView.$list = $listView;
	schoolsView.$btnMap = $btnMap;
	schoolsView.$btnList = $btnList;
	schoolsView.$viewLabel = $viewLabel;
	schoolsView.states = { map:false, list:false };
	//data
	schoolsView.labels = labels;
	//defaultView
	if ( $mapView.data('defaultView')=='1' ) {
		schoolsView.defaultView = 'map';
		schoolsView.states.list = true;
	}
	else if ( $listView.data('defaultView')=='1' ) {
		schoolsView.defaultView = 'list';
		schoolsView.states.map = true;
	}
	//selectedView
	schoolsView.selectedView = schoolsView.defaultView;
	
	/* -------------------------------------------------------------------------- */
	//methods
	schoolsView.updateView = function(view, visible){
		//exit
		if (schoolsView.states[view] == visible) { return false; }
		//vars
		var $view = (view == 'map') ? schoolsView.$map : schoolsView.$list,
			$btn = (view == 'map') ? schoolsView.$btnMap : schoolsView.$btnList,
			label = (view == 'map') ? schoolsView.labels.map : schoolsView.labels.list;
		//determin visibility flag if not provided already
		if (visible == undefined) visible = !schoolsView.states[view];
		//update states
		schoolsView.states[view] = visible;
		if (visible) schoolsView.currentView = view;
		//update view
		visible ? $view.slideDown() : $view.slideUp();
		//refresh map view
		if (view == 'map' && visible) {
			//close map info window
			Map.closeInfoWindow();
			//refresh map
			Map.refreshView(Map.map);
			//update with current bounds
			Map.updateBound(Map.map, Schools.boundList);
		}
		//update view button
		if ($btn.length) {
			visible ? $btn.addClass(selectedCls) : $btn.removeClass(selectedCls);	
		}
		//update label
		if (schoolsView.$viewLabel.length && visible) {
			schoolsView.$viewLabel.text(label); 
		}
	}
	schoolsView.switchView = function(view){
		var otherView = (view == 'map' ? 'list' : 'map');
		schoolsView.updateView(otherView, false);
		schoolsView.updateView(view, true);
	}
	
	/* -------------------------------------------------------------------------- */
	/* functions */
	function onResize(e){
		var isMobile = Modernizr.mq(mqStates.max500) || $(window).width() <= 500;
		if (isMobile) {
			schoolsView.switchView('list');
		} else {
			schoolsView.switchView(schoolsView.selectedView);
		}
	}
	
	/* -------------------------------------------------------------------------- */
	/* init */
	
	//apply defaultView
	schoolsView.updateView(schoolsView.defaultView, true);
	schoolsView.defaultView == 'map' ? schoolsView.updateView('list', false) : schoolsView.updateView('map', false);
	
	//bind button behaviors
	$.each([schoolsView.$btnMap, schoolsView.$btnList], function(idx, ele){
		var $btn = $(ele);
		$btn.on('click', function(e){
			e.preventDefault();
			var view = $(this).data('view');
			schoolsView.switchView(view);
			schoolsView.selectedView = view;
		});
	});
		
	//bind responsive behavior
	onResize();
	$(window).on('resize.schoolsViewSwitch', onResize);
	
	//return API obj to DOM
	return schoolsView;
}
/* ------------------------------------------------------------------------------ */
/* init */
/* ------------------------------------------------------------------------------ */
var BannerSlides, $isotope, SelectNav, Slideshows, StaticAudios, StaticVideos, Schools, Map;
function init(){
	//layout assistance
	insertFirstLastChild('#navItems, #sideNav, #sideNav ul, .itemListing');
	
	//interactions	
	SelectNav = new initSelectNav();
	
	//template specific functions
	if 		( $('body#home').length ) 			{ initHome(); }
	else if ( $('body.landing').length ) 		{ initLanding(); }
	else if ( $('body#school.listing').length ) { initSchoolListing(); }
	else if ( $('body#school.profile').length ) { initSchoolProfile(); }
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
	//banner slideshow
	BannerSlides = new initBannerSlides();
	//filter
	initHomeFilter();
}
function initLanding(){
	//initClickLoading
	initClickLoading();
}
function initSchoolListing(){
	//diocese map
	initDioceseMap();
	//initSchoolsFilter
	Schools = new initSchoolsFilter();
	//initSchoolsViewSwitch
	Schools.view = new initSchoolsViewSwitch();
}
function initSchoolProfile(){
	//school overview
	initSchoolProfileReadMore();
	//school tour
	Slideshows = new initSlideshows();
	//school map
	initSchoolProfileMap();
}
/* DOM Ready */
$(document).ready(function(){
	console.log('DOM Ready');
	initWebFontLoader();
	Platform.addDOMClass();
	init();	
});