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
/* initToggleNav */
/* ------------------------------------------------------------------------------ */
function initToggleNav() {
	
	//check if DOM elem exists
	if ( !$('#nav').length || !$('#navToggle').length ) return false;
	
	//create global obj
	var toggleNav = {},
		$nav = $('#nav'),
		$btnToggle = $('#navToggle'),
		thisObj = toggleNav;
	
	//function - toggle
	toggleNav.toggle = function(e){
		if (e) e.preventDefault();
		//console.log(thisObj.isActive);
		
		//update DOM
		if ( thisObj.isActive ) {
			$nav.removeClass(thisObj.activeCls);
			$btnToggle.removeClass(thisObj.activeCls);
		} else {
			$nav.addClass(thisObj.activeCls);
			$btnToggle.addClass(thisObj.activeCls);
		}
		thisObj.isActive = !thisObj.isActive;
	}
	
	//function - init
	toggleNav.init = function(){		
		//properties
		thisObj.activeCls = 'active';
		thisObj.isActive = false;
 
 		//bind button
		$btnToggle.on( 'click', thisObj.toggle);
	};
	
	//init obj
	toggleNav.init();
	
	//return global obj
	return toggleNav;

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
/* initCalendar */
/* ------------------------------------------------------------------------------ */
function initCalendar(cls) {
	
	//vars
	var calCls = cls || '.calendarView',
		$cals = $(calCls);
	
	//exit if no instance found
	if ( !$cals.length ) return false;
	
	//function - initCal
	function initCal(idx, ele) {
		
		var //common
			$cal = $(ele),
			$calBody = $cal.find('.calendarViewBody:first'),
			$calWeeks = $cal.find('.week'),
			$calDays = $cal.find('.day'),
			$calToday = $cal.find('.today:first'),
			$calEntries = $cal.find('.entries'),
			
			//view interaction
			$btnViewGrid = $cal.find('.btnViewGrid'),
			$btnViewList = $cal.find('.btnViewList'),
			view = $cal.attr('data-view'),
			lastSelectedView = view,
			noEvents,
			viewCls = { grid: 'calendarViewGrid', list: 'calendarViewList' },
			hasDataCls = 'hasData',
			selectedCls = 'selected',
			noEventsCls = 'showMsg noEvents',
						
			//function - checkHasData
			checkHasData = function() {
				
				//reset noEvents
				noEvents = true;
				
				//go through all entries containers to find data
				$.each($calEntries, function(idx, ele) {
					var $entries = $(ele),
						$day = $entries.parent('.day'),
						$weekends = $day.parent('.weekends'),
						$entry = $entries.find('.entry');
					if ($entry.length && !$day.hasClass('pastMonth') && !$day.hasClass('nextMonth')) {
						$day.addClass(hasDataCls);
						if ( $weekends.length ) $weekends.addClass(hasDataCls);
						noEvents = false;
					} else {
						$day.removeClass(hasDataCls);
						if ( $weekends.length && !$day.siblings('.day').hasClass('hasData') ) $weekends.removeClass(hasDataCls);
					}
				});
				
				//if no data at all
				if ( noEvents ) {
					$cal.addClass(noEventsCls);
				} else {
					$cal.removeClass(noEventsCls);
				}
				
			}
		
		/* ------------------------------------------------------------------------------ */
		/* grid view interaction */		
		
		//process week to get max height
		function setWeekHeight( idx, week ) {
			
			//vars
			var $week = $(week),
				$days = $week.find('> .day'),
				maxHeight = 0;
			
			//loop through week days to get max height
			$.each($days, function(idx,ele){
				var $day = $(ele),
					dayHeight = $day.outerHeight();
				if ( dayHeight > maxHeight ) {
					maxHeight = dayHeight	
				}
			});
			
			//apply max height to week
			$week.height( maxHeight );  
			
		}
		
		//loop through all weeks
		function setWeeksHeight() { 
			if (view == 'grid') { $.each($calWeeks, setWeekHeight);  }
		}
		
		/* ------------------------------------------------------------------------------ */
		/* view switching interaction */
		function setGridView(){
			view = 'grid';
			$cal
				.removeClass( viewCls.list )
				.addClass( viewCls.grid )
				.attr('data-view', 'grid');
			$btnViewList.removeClass('selected');
			$btnViewGrid.addClass('selected');
			setWeeksHeight();
		}
		function setListView(){
			view = 'list';
			$cal
				.removeClass( viewCls.grid )
				.addClass( viewCls.list )
				.attr('data-view', 'list');
			$btnViewGrid.removeClass('selected');
			$btnViewList.addClass('selected');
		}
		function initView() {
			//init view mode			
			updateView(view);
			//bind btnView
			$btnViewGrid.unbind().on('click', function(e){ 
				e.preventDefault();
				updateView('grid');
				lastSelectedView = 'grid';
			});
			$btnViewList.unbind().on('click', function(e){ 
				e.preventDefault();
				updateView('list');
				lastSelectedView = 'list';
			});
		}
		
		//updateView
		function updateView(mode) {
			//vars
			var forceList;
			//manually test forceList for oldie
			if ( $('html').hasClass('no-mediaqueries') ) {
				forceList = ( $(window).width() <= 640 ); 
			} else {
				forceList = Modernizr.mq(mqStates.max640);
			}
			//apply specified view mode
			view = mode || view;
			//apply layout
			if ( (!forceList && view == 'grid') || ( !forceList && view == 'list' && lastSelectedView == 'grid' && !mode ) ) {
				setGridView();
			} else {
				setListView();
			}
		}
		
		/* ------------------------------------------------------------------------------ */

		/* update */
		function update() {
			updateView();
		}
		
		/* ------------------------------------------------------------------------------ */
		/* init */
		function init() {
			checkHasData(); //update hasData class
			initView(); //init cal view
			$(window).bind('resize', update); //bind resize event handler
		}
		init();	
		
	}
	
	//loop through and process each instance
	$.each( $cals, initCal );
	
}
