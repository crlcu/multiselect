/*
 * Multiselect
 * https://github.com/crlcu/multiselect
 *
 * Copyright (c) 2013 Adrian Crisan
 * Licensed under the MIT license.
 */

;(function( $ ) {
    /*
     * public methods
     */
    var privateMethods = {
        init: function( obj, data ){
            console.log(obj);
            console.log(data);
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
            
            privateMethods.init($this, data);
        });  
    };
    
})( jQuery );