;(function( $ ){
	$.fn.multiselect = function( config ) {
		var $this = this;
		
		var defaults = {
			init: undefined,
			beforeMoveOneToRight: function($left, $right, option){ return true; },
			afterMoveOneToRight: function($left, $right, option){},
			beforeMoveAllToRight: function($left, $right, options){ return true; },
			afterMoveAllToRight: function($left, $right, options){},
			beforeMoveOneToLeft: function($left, $right, option){ return true; },
			afterMoveOneToLeft: function($left, $right, option){},
			beforeMoveAllToLeft: function($left, $right, options){ return true; },
			afterMoveAllToLeft: function($left, $right, options){}
		};
		
		config = $.extend({}, defaults, config);
		
		var mcs = {
			$msc_left: undefined,
			$msc_right: undefined,
			$rightAll: undefined,
			$rightSelected: undefined,
			$leftAll: undefined,
			$leftSelected: undefined,
			
			init: function( $msc_left ){				
				var data = $msc_left.data();
				
				mcs.$msc_left = $msc_left;
				mcs.$msc_right = $( data.right );
				
				mcs.$rightAll = $( data.rightAll );
				mcs.$rightSelected = $( data.rightSelected );
				
				mcs.$leftAll = $( data.leftAll );
				mcs.$leftSelected = $( data.leftSelected );
				
				if ( typeof config.init == 'function' ){
					config.init( mcs.$msc_left, mcs.$msc_right );	
				}
				
				if ( typeof config.sort == 'function' ){
					mcs.$msc_left.find('option').sort(config.sort).appendTo(mcs.$msc_left);
					mcs.$msc_right.find('option').sort(config.sort).appendTo(mcs.$msc_right);
				}
				
				if ( $.browser.msie ){
					mcs.$msc_left.dblclick(function(e){
						mcs.$rightSelected.trigger('click');
					});
					
					mcs.$msc_right.dblclick(function(e){
						mcs.$leftSelected.trigger('click');
					});
				}
				
				var $form = $msc_left.closest('form');
				$form.off('submit').on('submit', function(){
					$('select[multiple]', $form).find('option').attr('selected', true);
				});
				
				mcs.$msc_left.on('dblclick', 'option', function(e){
					e.preventDefault();
					mcs.moveOneToRight(this);
				});
				
				mcs.$msc_right.on('dblclick', 'option', function(e){
					e.preventDefault();
					mcs.moveOneToLeft(this);
				});
				
				mcs.$rightAll.on('click', function(e){
					e.preventDefault();
					
					var options = mcs.$msc_left.find('option');
					
					if ( options )
						mcs.moveAllToRight(options);
				});
				
				mcs.$rightSelected.on('click', function(e){
					e.preventDefault();
					var option = mcs.$msc_left.find('option:selected');
					
					if ( option )
						mcs.moveOneToRight(option);
				});
				
				mcs.$leftAll.on('click', function(e){
					e.preventDefault();
					
					var options = mcs.$msc_right.find('option');
					
					if ( options )
						mcs.moveAllToLeft(options);
				});
				
				mcs.$leftSelected.on('click', function(e){
					e.preventDefault();
					var option = mcs.$msc_right.find('option:selected');
					
					if ( option )
						mcs.moveOneToLeft(option);
				});
			},
			
			moveOneToRight: function( option, silent ){
				if ( typeof config.beforeMoveOneToRight == 'function' && !silent ){
					if ( !config.beforeMoveOneToRight( mcs.$msc_left, mcs.$msc_right, option ) )
						return false;
				}
				
				mcs.$msc_right.append(option);
				
				if ( typeof config.sort == 'function' && !silent ){
					mcs.$msc_right.find('option').sort(config.sort).appendTo(mcs.$msc_right);		
				}
				
				if ( typeof config.afterMoveOneToRight == 'function' && !silent ){
					config.afterMoveOneToRight( mcs.$msc_left, mcs.$msc_right, option );
				}
			},
			
			moveAllToRight: function( options ){
				if ( typeof config.beforeMoveAllToRight == 'function' ){
					if ( !config.beforeMoveAllToRight( mcs.$msc_left, mcs.$msc_right, options ) )
						return false;
				}
				
				for ( var i = 0; options[i]; i++ ){
					mcs.moveOneToRight(options[i], true);
				}
				
				if ( typeof config.sort == 'function' ){
					mcs.$msc_right.find('option').sort(config.sort).appendTo(mcs.$msc_right);		
				}
				
				if ( typeof config.afterMoveAllToRight == 'function' ){
					config.afterMoveAllToRight( mcs.$msc_left, mcs.$msc_right, options );	
				}
			},
			
			moveOneToLeft: function( option, silent ){
				if ( typeof config.beforeMoveOneToLeft == 'function' && !silent ){
					if ( !config.beforeMoveOneToLeft( mcs.$msc_left, mcs.$msc_right, option ) )
						return false;
				}
					
				mcs.$msc_left.append(option);
				
				if ( typeof config.sort == 'function' && !silent ){
					mcs.$msc_left.find('option').sort(config.sort).appendTo(mcs.$msc_left);		
				}
				
				if ( typeof config.afterMoveOneToLeft == 'function' && !silent ){
					config.afterMoveOneToLeft( mcs.$msc_left, mcs.$msc_right, option );	
				}
			},
			
			moveAllToLeft: function( options ){
				if ( typeof config.beforeMoveAllToLeft == 'function' ){
					if ( !config.beforeMoveAllToLeft( mcs.$msc_left, mcs.$msc_right, options ) )
						return false;
				}
				
				for ( var i = 0; options[i]; i++ ){
					mcs.moveOneToLeft(options[i], true);
				}
				
				if ( typeof config.sort == 'function' ){
					mcs.$msc_left.find('option').sort(config.sort).appendTo(mcs.$msc_left);		
				}
				
				if ( typeof config.afterMoveAllToLeft == 'function' ){
					config.afterMoveAllToLeft( mcs.$msc_left, mcs.$msc_right, options );	
				}
			}
		};
		
		$this.each(function() {			
			mcs.init( $(this) );
		});
		
		return $this;
	};
})( jQuery );