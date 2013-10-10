/* ------------------------------------------------------------------------------ */
/* initSelectNav */
/* ------------------------------------------------------------------------------ */
function initSelectNav() {
	
	//check if DOM elem exists
	if ( !$('#nav').length || !$('#navSelect').length ) return false;
	
	//create global obj
	var selectNav = {};
	
	//function - update
	selectNav.update = function() {
		
		//check if $btnSelect is set visible from Media Queries
		this.selectMode = this.$btnSelect.css('display') != 'none';
		this.itemHeight = Math.ceil( this.$items.outerHeight() );
		
		//enable select nav if selectMode is on
		if ( this.selectMode ) {
			//update container height with all items
			this.containerHeight = this.itemHeight * ( this.totalItems + 1 );
			
			//check if select nav is active
			if ( this.$container.hasClass('active') ) {
				this.$container.height( this.containerHeight );//apply total items height if is
			} else {
				this.$container.height( this.itemHeight );//apply snigle item height if not
			}

			//update select label text
			this.$selectedItem = this.$items.filter('.selected:first');
			if (this.$selectedItem.length) {
				this.$btnSelectLabel.text( this.$selectedItem.text() );
			} else {
				this.$btnSelectLabel.text( this.defaultLabel );
			};
		} else {//if selectMode is off
			//update and apply container height to single item
			this.containerHeight = this.itemHeight;
			this.$container.height( this.containerHeight );
		}
			
	};
	
	//function - bindBtn
	selectNav.bindBtn = function() {
		
		//bind event
		this.$btnSelect.on( 'click', function(e){
			e.preventDefault();
			if ( selectNav.selectMode ) {
				//if nav is active
				if ( !selectNav.$container.hasClass('active') ) {
					selectNav.$container
						.addClass('active')
						.height( selectNav.containerHeight );
					selectNav.$icon
						.removeClass( selectNav.iconClass[0] )
						.addClass( selectNav.iconClass[1] );
				} 
				//if nav is not active
				else { 
					selectNav.$container
						.removeClass('active')
						.height( selectNav.itemHeight );
					selectNav.$icon
						.removeClass( selectNav.iconClass[1] )
						.addClass( selectNav.iconClass[0] );
				}
			}
		});
		
	};
	
	//function - init
	selectNav.init = function(){
		
		//cache DOM elems
		this.$container = $('#nav');
		this.$btnSelect = $('#navSelect');
		this.$btnSelectLabel = this.$btnSelect.find('.label');
		this.$items = this.$container.find('.navItem');
		this.$selectedItem = null,
		this.$icon = this.$btnSelect.find('.icon');
		
		//cache properties
		this.totalItems = this.$items.length;
		this.itemHeight = this.containerHeight = 0;
		this.selectMode = false;
		this.speed = 300;
		this.defaultLabel = 'Menu',
		this.iconClass = [ 'icon-reorder', 'icon-reorder' ];
		this.csstransitions = Modernizr.csstransitions;
		
		//first update
		this.update();
		
		//bind button
		this.bindBtn();
		
		//update on window resize
		$(window).resize(function(e) {
			selectNav.update();
		});
			
	};
	
	//init obj
	selectNav.init();
	
	//return global obj
	return selectNav;
		
}
/* ------------------------------------------------------------------------------ */
/* initDatepicker */
/* ------------------------------------------------------------------------------ */
function initDatepicker(){
	
	//vars
	var $datepickers = $('.datepicker'),
		datepickerObj = { count:0 },
		format = 'dd-mm-yy';
	
	//exit if no instance
	if ( !$datepickers.length || typeof($.fn.datepicker) != 'function' ) return false;
	
	//process instances
	$.each($datepickers, function(idx,ele){
		
		//cache elems
		var $ele = $(ele),
			$btnTrigger = $ele.next('.btnDatepicker');
		
		//init jqui
		$ele.attr('readonly', 'true');
		datepickerObj['datepicker' + (idx+1)] = $ele.datepicker({
			dateFormat: 	format,
			numberOfMonths: 1,
			onSelect: 		function( selectedDate ) {},
			beforeShow: 	function(input, inst) {}
		});
		
		//add to window obj
		datepickerObj.count++;
		
		//bind trigger btn
		$btnTrigger.on('click', function(e){
			e.preventDefault();
			$ele.datepicker('show').focus();
		});
		
		//bind window resize
		$(window).on('resize', function(e){
			$ele.datepicker('hide').blur();
		});
		
	});	
	
	return datepickerObj;
		
}
/* ------------------------------------------------------------------------------ */
/* initMap */
/* ------------------------------------------------------------------------------ */
function initMap(opts){
	
	//exit if no address
	if (!opts.lat || !opts.lng) return false;
	
	//vars
	var mapObj = { opts: opts };
	
	/* -------------------------------------------------------------------------- */
	//methods
	
	/* marker */
	mapObj.addMarker = function(data){
		var marker = new google.maps.Marker({
			map: 		data.map,
			position: 	new google.maps.LatLng(data.lat, data.lng),
			title: 		data.title,
			icon:		data.icon
			//animation: 	google.maps.Animation.DROP
		});	
		return marker;
	}
	mapObj.toggleMarker = function(marker, visible){
		marker.setVisible(visible);
	}
	
	/* infoWindow */
	mapObj.bindInfoWindow = function(data){		
		var map = data.map,
			marker = data.marker;
		if (marker) {
			google.maps.event.addListener(marker, 'click', function() {
				if (mapObj.infoWindow) { mapObj.infoWindow.close(); }
				mapObj.infoWindow = data.infoWindow;
				mapObj.infoWindow.open(map, marker);
			});
		}
	}
	mapObj.closeInfoWindow = function(){
		if (mapObj.infoWindow) mapObj.infoWindow.close();	
	}
	
	/* map */
	mapObj.refreshView = function(map){
		//trigger map resize
		google.maps.event.trigger(map, 'resize');
	}
	mapObj.updateBound = function(map, latlngList){
		var bounds = new google.maps.LatLngBounds(),
			listLength = latlngList.length,
			i;
		for (i=0; i < listLength; i++) {
			bounds.extend (latlngList[i]);
		}
		map.fitBounds(bounds);
		mapObj.bounds = bounds;
	}
	
	/* -------------------------------------------------------------------------- */
	//init
	function init() {
		//vars
		var	hasInfoWindow = opts.info,
			showInfoWindowOnInit = hasInfoWindow && opts.showInfo,
			mapOptions = {
				zoom: 			opts.zoom || 16,
				center: 		new google.maps.LatLng(opts.lat, opts.lng),
				mapTypeId: 		google.maps.MapTypeId.ROADMAP,
				scrollwheel: 	false
			},
			map = mapObj.map = new google.maps.Map(document.getElementById(opts.target), mapOptions),
			marker = mapObj.centerMarker = new google.maps.Marker({
				map: 		map,
				position: 	map.getCenter(),
				title: 		opts.title || '',
				visible:	opts.showCenter
				//animation: 	google.maps.Animation.DROP,
			}),
			infowindow = new google.maps.InfoWindow({
				content: 	opts.info || '',
				maxWidth: 	opts.infoWidth || 250
			}),
			latlng = new google.maps.LatLng(opts.lat,opts.lng);
			//centerLatLng = new google.maps.LatLng(opts.center.lat,opts.center.lng);
		
		//infowindow
		if (showInfoWindowOnInit) {
			infowindow.open(map, marker);
			map.setCenter(latlng);
		}
		
		//events
		google.maps.event.addListener(map, 'center_changed', function() {
			
		});
		google.maps.event.addListener(marker, 'click', function() {
			if (hasInfoWindow) infowindow.open(map, marker);
		});
		google.maps.event.addDomListener(window, 'resize', function() {
			google.maps.event.trigger(map, 'resize');
			//close defualt info window
			if (hasInfoWindow) infowindow.close();
			//close any info window attached to marker
			mapObj.closeInfoWindow();
			//fit to bounds, or pan to center
			if (mapObj.bounds){
				map.panTo(mapObj.bounds.getCenter());
				map.fitBounds(mapObj.bounds);
			} else {
				map.panTo(latlng);	
			}
		});
	}
	
	//init
	init();
	
	//return map
	return mapObj;
}

