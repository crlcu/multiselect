/*
 * Multiselect
 * https://github.com/crlcu/multiselect
 *
 * Copyright (c) 2013 Adrian Crisan
 * Licensed under the MIT license.
 */

;(function( $ ) {
    /*
     * private methods
     */
    var __private = {
        settings: undefined,
        
        init: function( obj, data, settings ) {
            __private.settings = settings;
            
            var $left = __private.$left = obj;
            var $leftAll = __private.$leftAll = $( data.leftAll );
            var $leftSelected = __private.$leftSelected = $( data.leftSelected );
            
            var $right = __private.$right = $( data.right );
            var $rightAll = __private.$rightAll = $( data.rightAll );
            var $rightSelected = __private.$rightSelected = $( data.rightSelected );
            
            if ( typeof settings.startUp == 'function' ) {
                settings.startUp( $left, $right );	
            }
            
            if ( typeof settings.sort == 'function' ) {
                $left.find('option').sort(settings.sort).appendTo($left);
                $right.find('option').sort(settings.sort).appendTo($right);
            }
            
            __private.events();
            
            __private.beforeSubmit( $left );
            
            return this;
        },
        
        events: function() {            
            __private.$left.on('dblclick', 'option', function(e) {
                e.preventDefault();
                __private.moveOneToRight(this);
            });
            
            __private.$right.on('dblclick', 'option', function(e) {
                e.preventDefault();
                __private.moveOneToLeft(this);
            });
            
            __private.$rightSelected.on('click', function(e) {
                e.preventDefault();
                var option = __private.$left.find('option:selected');
                
                if ( option )
                    __private.moveOneToRight(option);
            });
            
            __private.$leftSelected.on('click', function(e) {
                e.preventDefault();
                var option = __private.$right.find('option:selected');
                
                if ( option )
                    __private.moveOneToLeft(option);
            });
            
            __private.$rightAll.on('click', function(e){
                e.preventDefault();
                
                var options = __private.$left.find('option');
                
                if ( options )
                    __private.moveAllToRight(options);
            });
            
            __private.$leftAll.on('click', function(e){
                e.preventDefault();
                
                var options = __private.$right.find('option');
                
                if ( options )
                    __private.moveAllToLeft(options);
            });
        },
        
        moveOneToRight: function( option, silent ) {
            if ( typeof __private.settings.beforeMoveOneToRight == 'function' && !silent ){
                if ( !__private.settings.beforeMoveOneToRight( __private.$left, __private.$right, option ) )
                    return false;
            }
            
            __private.$right.append(option);
            
            if ( typeof __private.settings.sort == 'function' && !silent ){
                __private.$right.find('option').sort(__private.settings.sort).appendTo(__private.$right);		
            }
            
            if ( typeof __private.settings.afterMoveOneToRight == 'function' && !silent ){
                __private.settings.afterMoveOneToRight( __private.$left, __private.$right, option );
            }
        },
        
        moveOneToLeft: function( option, silent ){
            if ( typeof __private.settings.beforeMoveOneToLeft == 'function' && !silent ) {
                if ( !__private.settings.beforeMoveOneToLeft( __private.$left, __private.$right, option ) )
                    return false;
            }
                
            __private.$left.append(option);
            
            if ( typeof __private.settings.sort == 'function' && !silent ) {
                __private.$left.find('option').sort(__private.settings.sort).appendTo(__private.$left);		
            }
            
            if ( typeof __private.settings.afterMoveOneToLeft == 'function' && !silent ) {
                __private.settings.afterMoveOneToLeft( __private.$left, __private.$right, option );	
            }
        },
        
        moveAllToRight: function( options ) {
            if ( typeof __private.settings.beforeMoveAllToRight == 'function' ) {
                if ( !__private.settings.beforeMoveAllToRight( __private.$left, __private.$right, options ) )
                    return false;
            }
            
            for ( var i = 0; options[i]; i++ ) {
                __private.moveOneToRight(options[i], true);
            }
            
            if ( typeof __private.settings.sort == 'function' ) {
                __private.$right.find('option').sort(__private.settings.sort).appendTo(__private.$right);		
            }
            
            if ( typeof __private.settings.afterMoveAllToRight == 'function' ){
                __private.settings.afterMoveAllToRight( __private.$left, __private.$right, options );	
            }
        },
        
        moveAllToLeft: function( options ){
            if ( typeof __private.settings.beforeMoveAllToLeft == 'function' ) {
                if ( !__private.settings.beforeMoveAllToLeft( __private.$left, __private.$right, options ) )
                    return false;
            }
            
            for ( var i = 0; options[i]; i++ ) {
                __private.moveOneToLeft(options[i], true);
            }
            
            if ( typeof __private.settings.sort == 'function' ){
                __private.$left.find('option').sort(__private.settings.sort).appendTo(__private.$left);		
            }
            
            if ( typeof __private.settings.afterMoveAllToLeft == 'function' ){
                __private.settings.afterMoveAllToLeft( __private.$left, __private.$right, options );	
            }
        },
        
        beforeSubmit: function( $left ) {
            var $form = $left.closest('form');
            
            $form.off('submit').on('submit', function() {
                $('select[multiple]', $form).find('option').attr('selected', true);
            });
        }
    };
    
    /*
     * public methods
     */
    var methods = {
        open: function(name, callback) {
            privateMethods.execute('open', name, callback);
        },
        close: function(name, callback) {
            privateMethods.execute('close', name, callback);
        },
        toogle: function(name, callback) {
            privateMethods.execute('toogle', name, callback);
        }
    };
  
    $.multiselect = function( method ) {
        if ( methods[method] ) {
            return methods[method].apply( this, Array.prototype.slice.call( arguments, 1 ));
        } else if ( typeof method === 'function' ||  typeof method === 'string'  || ! method ) {
            return methods.toogle.apply( this, arguments );
        } else {
            return $.error( 'Method ' +  method + ' does not exist on multiselect.' );
        }
    };
    
    $.fn.multiselect = function( options ) {
        var settings = $.extend({}, {
            /*
             * will be executed once
             * @method startUp
            **/
            startUp: function( $left, $right ) {},
            /*
             *  will be executed each time before moving one option to right
             *  IMPORTANT : this method must return boolean value
             *      true    : continue to moveOneToRight method
             *      false   : stop
             * 
             *  @method beforeMoveOneToRight
             *  @attribute $left jQuery object
             *  @attribute $right jQuery object
             *  @attribute option HTML object (the option which was selected to be moved)
             *  
             *  @default true
             *  @return {boolean}
            **/
			beforeMoveOneToRight: function($left, $right, option) { return true; },
			afterMoveOneToRight: function($left, $right, option){},
			beforeMoveAllToRight: function($left, $right, options){ return true; },
			afterMoveAllToRight: function($left, $right, options){},
			beforeMoveOneToLeft: function($left, $right, option){ return true; },
			afterMoveOneToLeft: function($left, $right, option){},
			beforeMoveAllToLeft: function($left, $right, options){ return true; },
			afterMoveAllToLeft: function($left, $right, options){},
            sort: function(a, b) {
                if (a.innerHTML == 'NA') {
					return 1;   
				} else if (b.innerHTML == 'NA') {
					return -1;   
				}
				
				return (a.innerHTML > b.innerHTML) ? 1 : -1;
            }
        }, options);
        
        return this.each(function() {
            var $this = $(this),
            data = $this.data();
            
            return __private.init($this, data, settings);
        });  
    };
    
})( jQuery );