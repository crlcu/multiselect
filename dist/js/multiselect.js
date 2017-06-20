/*
 * @license
 *
 * Multiselect v2.3.12
 * http://crlcu.github.io/multiselect/
 *
 * Copyright (c) 2016 Adrian Crisan
 * Licensed under the MIT license (https://github.com/crlcu/multiselect/blob/master/LICENSE)
 */

/** @external {jQuery} */

/**
 * @typedef {Object} ActionButtons
 * @property {jQuery} [$leftAll="$('#'+id+'_leftAll')"] - the button to click to move all visible elements in the right palette to the left palette
 * @property {jQuery} [$rightAll=$('#'+id+'_rightAll')] - the button to click to move all visible elements in the left palette to the right palette
 * @property {jQuery} [$leftSelected=$('#'+id+'_leftSelected')] - the button to click to move all visible selected elements in the right palette to the left palette
 * @property {jQuery} [$rightSelected=$('#'+id+'_rightSelected')] - the button to click to move all visible selected elements in the left palette to the right palette
 * @property {jQuery} [$undo=$('#'+id+'_undo')] - the button to click to undo the last move action
 * @property {jQuery} [$redo=$('#'+id+'_redo')] - the button to click to redo the last undone move action
 * @property {jQuery} [$moveUp=$('#'+id+'_moveUp')] - the button to click to move the selected element(s) up one index
 * @property {jQuery} [$moveDown=$('#'+id+'_moveDown')] - the button to click to move the selected element(s) down one index
 */

/** @typedef {Object} ElementNames
 * @property {jQuery} [right] - name of the element to become the right palette
 * @property {jQuery} [leftAll] - name of the element to become the "Move all Left" button
 * @property {jQuery} [rightAll] - name of the element to become the "Move all Right" button
 * @property {jQuery} [leftSelected] - name of the element to become the "Move Selected Left" button
 * @property {jQuery} [rightSelected] - name of the element to become the "Move Selected Right" button
 * @property {jQuery} [undo] - name of the element to become the "Undo Last Move" button
 * @property {jQuery} [redo] - name of the element to become the "Redo Last Undone Move" button
 * @property {jQuery} [moveUp] - name of the element to become the "Move selected elements Up" button
 * @property {jQuery} [moveDown] - name of the element to become the "Move selected elements Down" button
 */
/**
 * @typedef {Object} MultiselectOptions
 * @property {boolean} [keepRenderingSort=false] - whether to
 * @property {boolean} [submitAllLeft=true] - FIXME
 * @property {boolean} [submitAllRight=true] - FIXME
 * @property {SearchElements} [search] - the meta information used in the search elements
 * @property {boolean} [ignoreDisabled=false] - FIXME
 * @property {string} [matchOptgroupBy='label'] - FIXME
 */

/**
 * @typedef {Object} CallbackFunctions
 * @property {function} startUp
 * @property {function} sort
 * @property {function} beforeMoveToRight
 * @property {function} moveToRight
 * @property {function} afterMoveToRight
 * @property {function} beforeMoveToLeft
 * @property {function} moveToLeft
 * @property {function} afterMoveToLeft
 * @property {function} beforeMoveUp
 * @property {function} afterMoveUp
 * @property {function} beforeMoveDown
 * @property {function} afterMoveDown
 * @property {function} fireSearch
 */

/**
 * @typedef {Object} SearchElements
 * @property {string} [left] - The html for a new input element to use as a search input for the left palette
 * @property {jQuery} [$left] - the jQuery element for the left element when it's in the DOM
 * @property {string} [right] - The html for a new input element to use as a search input for the right palette
 * @property {jQuery} [$right] - the jQuery element for the right element when it's in the DOM
 */

/**
 * @typedef {CallbackFunctions|ElementNames|MultiselectOptions} SettingsObject
 */

if (typeof jQuery === 'undefined') {
    throw new Error('multiselect requires jQuery');
}

(
    /**
     * Checks if the current jQuery is of the necessary minimum version.
     * @param {jQuery} $
     */
    function ($) {
        'use strict';

        /** @type {string[]} version Array containing the jQuery version numbers */
        var version = $.fn.jquery.split(' ')[0].split('.');

        if (version[0] < 2 && version[1] < 7) {
            throw new Error('multiselect requires jQuery version 1.7 or higher');
        }
    }
)(jQuery);

(
    /**
     * Registers multiselect with amd or directly with jQuery.
     * // FIXME: Is this correct syntax?
     * @param {function} factory - the factory that creates the multiselect api
     */
    function (factory) {
        if (typeof define === 'function' && define.amd) {
            // AMD. Register as an anonymous module depending on jQuery.
            define(['jquery'], factory);
        } else {
            // No AMD. Register plugin with global jQuery object.
            factory(jQuery);
        }
    }(function ($) {
        'use strict';

        const KEY_ENTER = 13;

        const KEY_BACKSPACE = 8;

        const KEY_DEL = 46;

        /**
         * Given the settings and the name for an action, looks if the settings contain the selector for the
         * action. If not, it creates its own selector using the action and the id of the left palette.
         * @param id - the id part to look for if
         * @param {ElementNames} settings
         * @param actionName
         */
        var getActionButton = function(id, settings, actionName) {
            var selector = "";
            if (settings[actionName]) {
                selector = settings[actionName];
            } else {
                selector = $.multiselectdefaults.actionSelector(id, actionName);
            }
            return $(selector);
        };

        /**
         *
         * @param {string} id - id of the element for the left palette
         * @param {ElementNames} settings
         * @returns {ActionButtons}
         */
        var extractActionButtons = function(id, settings) {
            return {
                $leftAll: getActionButton(id, settings, "leftAll"),
                $rightAll: getActionButton(id, settings, "rightAll"),
                $leftSelected: getActionButton(id, settings, "leftSelected"),
                $rightSelected: getActionButton(id, settings, "rightSelected"),
                $undo: getActionButton(id, settings, "undo"),
                $redo: getActionButton(id, settings, "redo"),
                $moveUp: getActionButton(id, settings, "moveUp"),
                $moveDown: getActionButton(id, settings, "moveDown")
            };
        };

        /**
         * Extracts the options for the multiselect object
         * @param {SettingsObject} settings
         * @returns {MultiselectOptions}
         */
        var extractMultiselectOptions = function(settings) {
            return {
                keepRenderingSort:  (settings.keepRenderingSort !== undefined && typeof settings.keepRenderingSort === "boolean") ? settings.keepRenderingSort : $.multiselectdefaults.options.keepRenderingSort,
                submitAllLeft:      (settings.submitAllLeft !== undefined && typeof settings.submitAllLeft === "boolean")  ? settings.submitAllLeft : $.multiselectdefaults.options.submitAllLeft,
                submitAllRight:     (settings.submitAllRight !== undefined && typeof settings.submitAllRight === "boolean")  ? settings.submitAllRight : $.multiselectdefaults.options.submitAllRight,
                search:             (settings.search !== undefined && typeof settings.search === "object")  ? settings.search : $.multiselectdefaults.options.search,
                ignoreDisabled:     (settings.ignoreDisabled !== undefined && typeof settings.ignoreDisabled === "boolean")  ? settings.ignoreDisabled : $.multiselectdefaults.options.ignoreDisabled,
                matchOptgroupBy:    (settings.matchOptgroupBy !== undefined && typeof settings.matchOptgroupBy === "string")  ? settings.matchOptgroupBy : $.multiselectdefaults.options.matchOptgroupBy
            };
        };

        /**
         *
         * @param {SettingsObject} settings
         */
        var extractCallbacks = function(settings) {
            return {
                startUp: (settings.startUp && typeof settings.startUp === "function") ? settings.startUp : $.multiselectdefaults.callbacks.startUp,
                sort: (settings.sort && typeof settings.sort === "function") ? settings.sort : $.multiselectdefaults.callbacks.sort,
                beforeMoveToRight: (settings.beforeMoveToRight && typeof settings.beforeMoveToRight === "function")  ? settings.beforeMoveToRight : $.multiselectdefaults.callbacks.beforeMoveToRight,
                moveToRight: (settings.moveToRight && typeof settings.moveToRight === "function")  ? settings.moveToRight : $.multiselectdefaults.callbacks.moveToRight,
                afterMoveToRight: (settings.afterMoveToRight && typeof settings.afterMoveToRight === "function")  ? settings.afterMoveToRight: $.multiselectdefaults.callbacks.afterMoveToRight,
                beforeMoveToLeft: (settings.beforeMoveToLeft && typeof settings.beforeMoveToLeft === "function")  ? settings.beforeMoveToLeft: $.multiselectdefaults.callbacks.beforeMoveToLeft,
                moveToLeft: (settings.moveToLeft && typeof settings.moveToLeft === "function")  ? settings.moveToLeft: $.multiselectdefaults.callbacks.moveToLeft,
                afterMoveToLeft: (settings.afterMoveToLeft && typeof settings.afterMoveToLeft === "function")  ? settings.afterMoveToLeft : $.multiselectdefaults.callbacks.afterMoveToLeft,
                beforeMoveUp: (settings.beforeMoveUp && typeof settings.beforeMoveUp === "function")  ? settings.beforeMoveUp : $.multiselectdefaults.callbacks.beforeMoveUp,
                afterMoveUp: (settings.afterMoveUp && typeof settings.afterMoveUp === "function")  ? settings.afterMoveUp : $.multiselectdefaults.callbacks.afterMoveUp,
                beforeMoveDown: (settings.beforeMoveDown && typeof settings.beforeMoveDown === "function")  ? settings.beforeMoveDown : $.multiselectdefaults.callbacks.beforeMoveDown,
                afterMoveDown: (settings.afterMoveDown && typeof settings.afterMoveDown === "function")  ? settings.afterMoveDown : $.multiselectdefaults.callbacks.afterMoveDown,
                fireSearch: (settings.fireSearch && typeof settings.fireSearch === "function")  ? settings.fireSearch : $.multiselectdefaults.callbacks.fireSearch
            };
        };

        var Multiselect = (function($) {
            // FIXME: Define the used classes/objects/variables
            // FIXME: If we don't want to expose this class to the outside, i.e. never call it, can we prevent this?
            /**
             * Multiselect object constructor
             * @param {jQuery} $select
             * @param {SettingsObject} settings
             * @constructor
             */
            function Multiselect( $select, settings ) {
                // FIXME: Check if this is a single jquery element, error message if not
                var id = $select.prop('id');
                // FIXME: Only assign and do the rest if it is a jquery element
                /** @member {jQuery} */
                this.$left = $select;
                // FIXME: check if settings.right is a single jquery element
                // FIXME: throw error if neither is found
                /** @member {jQuery} */
                this.$right = $( settings.right ).length ? $( settings.right ) : $('#' + id + '_to');
                // FIXME: Which are required action buttons? Should we error if we can't init them?
                // FIXME: What if I use this on a page with elements with the suffixes (unlikely, yeah) that shouldn't be used as buttons?
                // FIXME: Do we want to allow multiple elements to be buttons for a function?
                /** @member {ActionButtons} */
                this.actions = extractActionButtons(id, settings);
                /** @member {MultiselectOptions} */
                this.options = extractMultiselectOptions(settings);
                /** @member {CallbackFunctions} */
                this.callbacks = extractCallbacks(settings);

                this.init();
            }

            Multiselect.prototype = {
                init: function() {
                    var self = this;
                    // initialize the undo/redo functionality
                    self.undoStack = [];
                    self.redoStack = [];

                    if (self.options.keepRenderingSort) {
                        // FIXME: Huh? When I give a callback function it is ignored and overwritten by this one? The default one is NEVER used?
                        // The default sort function makes no sense, though, so...
                        // could also be undefined and doesn't have to be false
                        // This seems to be a hack to make something work
                        if (self.callbacks.sort !== false) {
                            // FIXME: Extract this sort function, name it accordingly
                            self.callbacks.sort = function(a, b) {
                                return $(a).data('position') > $(b).data('position') ? 1 : -1;
                            };
                        }

                        // decorate the options with their initial positions in the list so that it can be re-established
                        self.$left.attachIndex();

                        self.$right.each(function(i, select) {
                            $(select).attachIndex();
                        });
                    }

                    // startUp could be a function or false
                    // either the default is used or the function; false doesn't amount to anything
                    // startUp preprocessing function
                    // TODO: With an api, my startUp function could use that to move options around
                    if ( typeof self.callbacks.startUp == 'function' ) {
                        self.callbacks.startUp( self.$left, self.$right );
                    }

                    // initial sort if allowed
                    if ( !self.options.keepRenderingSort && typeof self.callbacks.sort == 'function' ) {
                        // sort seems to be a comparator function, not a sorting function
                        self.$left.mSort(self.callbacks.sort);

                        // here we acknowledge that we could have multiple right elements
                        self.$right.each(function(i, select) {
                            $(select).mSort(self.callbacks.sort);
                        });
                    }

                    // Prepend left filter before right palette (above)
                    // FIXME: Allow already existing element to be the filter input
                    if (self.options.search && self.options.search.left) {
                        self.options.search.$left = $(self.options.search.left);
                        self.$left.before(self.options.search.$left);
                    }

                    // Prepend right filter before right palette (above)
                    // FIXME: Allow already existing element to be the filter input
                    if (self.options.search && self.options.search.right) {
                        self.options.search.$right = $(self.options.search.right);
                        self.$right.before($(self.options.search.$right));
                    }

                    // Initialize events
                    self.events();
                },

                events: function() {
                    var self = this;

                    // Attach event to left filter
                    if (self.options.search && self.options.search.$left) {
                        self.options.search.$left.on('keyup', function(e) {
                            // FIXME: Extract function to make it readable and reusable
                            if (self.callbacks.fireSearch(this.value)) {
                                var $toShow = self.$left.find('option:search("' + this.value + '")').mShow();
                                var $toHide = self.$left.find('option:not(:search("' + this.value + '"))').mHide();
                                var $grpHide= self.$left.find('option.hidden').parent('optgroup').not($(":visible").parent()).mHide();
                                var $grpShow= self.$left.find('option:not(.hidden)').parent('optgroup').mShow();
                            } else {
                                self.$left.find('option, optgroup').mShow();
                            }
                        });
                    }

                    // Attach event to right filter
                    if (self.options.search && self.options.search.$right) {
                        self.options.search.$right.on('keyup', function(e) {
                            // FIXME: Extract function to make it readable and reusable
                            if (self.callbacks.fireSearch(this.value)) {
                                var $toShow = self.$right.find('option:search("' + this.value + '")').mShow();
                                var $toHide = self.$right.find('option:not(:search("' + this.value + '"))').mHide();
                                var $grpHide= self.$right.find('option.hidden').parent('optgroup').not($(":visible").parent()).mHide();
                                var $grpShow= self.$right.find('option:not(.hidden)').parent('optgroup').mShow();
                            } else {
                                self.$right.find('option, optgroup').mShow();
                            }
                        });
                    }

                    // Select all the options from left and right side when submitting the parent form
                    self.$right.closest('form').on('submit', function(e) {
                        if (self.options.search) {
                            // Clear left search input
                            if (self.options.search.$left) {
                                self.options.search.$left.val('').trigger('keyup');
                            }

                            // Clear right search input
                            if (self.options.search.$right) {
                                self.options.search.$right.val('').trigger('keyup');
                            }
                        }

                        self.$left.find('option').prop('selected', self.options.submitAllLeft);
                        self.$right.find('option').prop('selected', self.options.submitAllRight);
                    });

                    // Attach event for double clicking on options from left side
                    self.$left.on('dblclick', 'option', function(e) {
                        e.preventDefault();

                        var $options = self.$left.find('option:selected');

                        if ( $options.length ) {
                            self.moveToRight($options, e);
                        }
                    });

                    // Attach event for pushing ENTER on options from left side
                    self.$left.on('keypress', function(e) {
                        if (e.keyCode === KEY_ENTER) {
                            e.preventDefault();

                            var $options = self.$left.find('option:selected');

                            if ( $options.length ) {
                                self.moveToRight($options, e);
                            }
                        }
                    });

                    // Attach event for double clicking on options from right side
                    self.$right.on('dblclick', 'option', function(e) {
                        e.preventDefault();

                        var $options = self.$right.find('option:selected');

                        if ( $options.length ) {
                            self.moveToLeft($options, e);
                        }
                    });

                    // Attach event for pushing BACKSPACE or DEL on options from right side
                    self.$right.on('keydown', function(e) {
                        if (e.keyCode === KEY_BACKSPACE || e.keyCode === KEY_DEL) {
                            e.preventDefault();

                            var $options = self.$right.find('option:selected');

                            if ( $options.length ) {
                                self.moveToLeft($options, e);
                            }
                        }
                    });

                    // dblclick support for IE
                    if ( navigator.userAgent.match(/MSIE/i)  || navigator.userAgent.indexOf('Trident/') > 0 || navigator.userAgent.indexOf('Edge/') > 0) {
                        self.$left.dblclick(function(e) {
                            self.actions.$rightSelected.trigger('click');
                        });

                        self.$right.dblclick(function(e) {
                            self.actions.$leftSelected.trigger('click');
                        });
                    }

                    self.actions.$rightSelected.on('click', function(e) {
                        e.preventDefault();

                        var $options = self.$left.find('option:selected');

                        if ( $options.length ) {
                            self.moveToRight($options, e);
                        }

                        $(this).blur();
                    });

                    self.actions.$leftSelected.on('click', function(e) {
                        e.preventDefault();

                        var $options = self.$right.find('option:selected');

                        if ( $options.length ) {
                            self.moveToLeft($options, e);
                        }

                        $(this).blur();
                    });

                    self.actions.$rightAll.on('click', function(e) {
                        e.preventDefault();

                        var $options = self.$left.find('option:not(span):not(.hidden)');

                        if ( $options.length ) {
                            self.moveToRight($options, e);
                        }

                        $(this).blur();
                    });

                    self.actions.$leftAll.on('click', function(e) {
                        e.preventDefault();

                        var $options = self.$right.find('option:not(span):not(.hidden)');

                        if ( $options.length ) {
                            self.moveToLeft($options, e);
                        }

                        $(this).blur();
                    });

                    self.actions.$undo.on('click', function(e) {
                        e.preventDefault();

                        self.undo(e);
                    });

                    self.actions.$redo.on('click', function(e) {
                        e.preventDefault();

                        self.redo(e);
                    });

                    self.actions.$moveUp.on('click', function(e) {
                        e.preventDefault();

                        var $options = self.$right.find(':selected:not(span):not(.hidden)');

                        if ( $options.length ) {
                            self.moveUp($options, e);
                        }

                        $(this).blur();
                    });

                    self.actions.$moveDown.on('click', function(e) {
                        e.preventDefault();

                        var $options = self.$right.find(':selected:not(span):not(.hidden)');

                        if ( $options.length ) {
                            self.moveDown($options, e);
                        }

                        $(this).blur();
                    });
                },

                moveToRight: function( $options, event, silent, skipStack ) {
                    var self = this;

                    if ( typeof self.callbacks.moveToRight == 'function' ) {
                        return self.callbacks.moveToRight( self, $options, event, silent, skipStack );
                    } else {
                        if ( typeof self.callbacks.beforeMoveToRight == 'function' && !silent ) {
                            if ( !self.callbacks.beforeMoveToRight( self.$left, self.$right, $options ) ) {
                                return false;
                            }
                        }

                        self.moveFromAtoB(self.$left, self.$right, $options, event, silent, skipStack);

                        if ( !skipStack ) {
                            self.undoStack.push(['right', $options ]);
                            self.redoStack = [];
                        }

                        if ( typeof self.callbacks.sort == 'function' && !silent && !self.doNotSortRight ) {
                            self.$right.mSort(self.callbacks.sort);
                        }

                        if ( typeof self.callbacks.afterMoveToRight == 'function' && !silent ) {
                            self.callbacks.afterMoveToRight( self.$left, self.$right, $options );
                        }

                        return self;
                    }
                },

                moveToLeft: function( $options, event, silent, skipStack ) {
                    var self = this;

                    if ( typeof self.callbacks.moveToLeft == 'function' ) {
                        return self.callbacks.moveToLeft( self, $options, event, silent, skipStack );
                    } else {
                        if ( typeof self.callbacks.beforeMoveToLeft == 'function' && !silent ) {
                            if ( !self.callbacks.beforeMoveToLeft( self.$left, self.$right, $options ) ) {
                                return false;
                            }
                        }

                        self.moveFromAtoB(self.$right, self.$left, $options, event, silent, skipStack);

                        if ( !skipStack ) {
                            self.undoStack.push(['left', $options ]);
                            self.redoStack = [];
                        }

                        if ( typeof self.callbacks.sort == 'function' && !silent ) {
                            self.$left.mSort(self.callbacks.sort);
                        }

                        if ( typeof self.callbacks.afterMoveToLeft == 'function' && !silent ) {
                            self.callbacks.afterMoveToLeft( self.$left, self.$right, $options );
                        }

                        return self;
                    }
                },

                moveFromAtoB: function( $source, $destination, $options, event, silent, skipStack ) {
                    var self = this;

                    $options.each(function(index, option) {
                        var $option = $(option);

                        if (self.options.ignoreDisabled && $option.is(':disabled')) {
                            return true;
                        }

                        if ($option.parent().is('optgroup')) {
                            var $sourceGroup = $option.parent();
                            var optgroupSelector = 'optgroup[' + self.options.matchOptgroupBy + '="' + $sourceGroup.prop(self.options.matchOptgroupBy) + '"]';
                            var $destinationGroup = $destination.find(optgroupSelector);

                            if (!$destinationGroup.length) {
                                $destinationGroup = $sourceGroup.clone(true);
                                $destinationGroup.empty();

                                $destination.move($destinationGroup);
                            }
                            $destinationGroup.move($option);

                            $sourceGroup.removeIfEmpty();
                        } else {
                            $destination.move($option);
                        }
                    });

                    return self;
                },

                moveUp: function($options) {
                    var self = this;

                    if ( typeof self.callbacks.beforeMoveUp == 'function' ) {
                        if ( !self.callbacks.beforeMoveUp( $options ) ) {
                            return false;
                        }
                    }

                    $options.first().prev().before($options);

                    if ( typeof self.callbacks.afterMoveUp == 'function' ) {
                        self.callbacks.afterMoveUp( $options );
                    }
                },

                moveDown: function($options) {
                    var self = this;

                    if ( typeof self.callbacks.beforeMoveDown == 'function' ) {
                        if ( !self.callbacks.beforeMoveDown( $options ) ) {
                            return false;
                        }
                    }

                    $options.last().next().after($options);

                    if ( typeof self.callbacks.afterMoveDown == 'function' ) {
                        self.callbacks.afterMoveDown( $options );
                    }
                },

                undo: function(event) {
                    var self = this;
                    var last = self.undoStack.pop();

                    if ( last ) {
                        self.redoStack.push(last);

                        switch(last[0]) {
                            case 'left':
                                self.moveToRight(last[1], event, false, true);
                                break;
                            case 'right':
                                self.moveToLeft(last[1], event, false, true);
                                break;
                        }
                    }
                },

                redo: function(event) {
                    var self = this;
                    var last = self.redoStack.pop();

                    if ( last ) {
                        self.undoStack.push(last);

                        switch(last[0]) {
                            case 'left':
                                self.moveToLeft(last[1], event, false, true);
                                break;
                            case 'right':
                                self.moveToRight(last[1], event, false, true);
                                break;
                        }
                    }
                }
            };

            return Multiselect;
        })($);

        $.multiselectdefaults = {
            actionSelector: function(id, action) {
                return "#" + id + "_" + action;
            },
            options: {
                keepRenderingSort: false,
                submitAllLeft: true,
                submitAllRight: true,
                search: {},
                ignoreDisabled: false,
                matchOptgroupBy: 'label'
            },
            callbacks: {
                /** will be executed once - remove from $left all options that are already in $right
                 *
                 *  @method startUp
                 *  @attribute $left jQuery object
                 *  @attribute $right jQuery object
                **/
                startUp: function( $left, $right ) {
                    $right.find('option').each(function(index, rightOption) {
                        if ($(rightOption).parent().prop('tagName') == 'OPTGROUP') {
                            var optgroupSelector = 'optgroup[label="' + $(rightOption).parent().attr('label') + '"]';
                            $left.find(optgroupSelector + ' option[value="' + rightOption.value + '"]').each(function(index, leftOption) {
                                leftOption.remove();
                            });
                            $left.find(optgroupSelector).removeIfEmpty();
                        } else {
                            var $option = $left.find('option[value="' + rightOption.value + '"]');
                            $option.remove();
                        }
                    });
                },

                /** will be executed each time before moving option[s] to right
                 *
                 *  IMPORTANT : this method must return boolean value
                 *      true    : continue to moveToRight method
                 *      false   : stop
                 *
                 *  @method beforeMoveToRight
                 *  @attribute $left jQuery object
                 *  @attribute $right jQuery object
                 *  @attribute $options HTML object (the option[s] which was selected to be moved)
                 *
                 *  @default true
                 *  @return {boolean}
                **/
                beforeMoveToRight: function($left, $right, $options) { return true; },

                /*  will be executed each time after moving option[s] to right
                 *
                 *  @method afterMoveToRight
                 *  @attribute $left jQuery object
                 *  @attribute $right jQuery object
                 *  @attribute $options HTML object (the option[s] which was selected to be moved)
                **/
                afterMoveToRight: function($left, $right, $options) {},

                /** will be executed each time before moving option[s] to left
                 *
                 *  IMPORTANT : this method must return boolean value
                 *      true    : continue to moveToRight method
                 *      false   : stop
                 *
                 *  @method beforeMoveToLeft
                 *  @attribute $left jQuery object
                 *  @attribute $right jQuery object
                 *  @attribute $options HTML object (the option[s] which was selected to be moved)
                 *
                 *  @default true
                 *  @return {boolean}
                **/
                beforeMoveToLeft: function($left, $right, $options) { return true; },

                /*  will be executed each time after moving option[s] to left
                 *
                 *  @method afterMoveToLeft
                 *  @attribute $left jQuery object
                 *  @attribute $right jQuery object
                 *  @attribute $options HTML object (the option[s] which was selected to be moved)
                **/
                afterMoveToLeft: function($left, $right, $options) {},

                /** will be executed each time before moving option[s] up
                 *
                 *  IMPORTANT : this method must return boolean value
                 *      true    : continue to moveUp method
                 *      false   : stop
                 *
                 *  @method beforeMoveUp
                 *  @attribute $options HTML object (the option[s] which was selected to be moved)
                 *
                 *  @default true
                 *  @return {boolean}
                **/
                beforeMoveUp: function($options) { return true; },

                /*  will be executed each time after moving option[s] up
                 *
                 *  @method afterMoveUp
                 *  @attribute $left jQuery object
                 *  @attribute $right jQuery object
                 *  @attribute $options HTML object (the option[s] which was selected to be moved)
                **/
                afterMoveUp: function($options) {},

                /** will be executed each time before moving option[s] down
                 *
                 *  IMPORTANT : this method must return boolean value
                 *      true    : continue to moveUp method
                 *      false   : stop
                 *
                 *  @method beforeMoveDown
                 *  @attribute $options HTML object (the option[s] which was selected to be moved)
                 *
                 *  @default true
                 *  @return {boolean}
                **/
                beforeMoveDown: function($options) { return true; },

                /*  will be executed each time after moving option[s] down
                 *
                 *  @method afterMoveUp
                 *  @attribute $left jQuery object
                 *  @attribute $right jQuery object
                 *  @attribute $options HTML object (the option[s] which was selected to be moved)
                **/
                afterMoveDown: function($options) {},

                /** sort options by option text
                 *
                 *  @method sort
                 *  @attribute a HTML option
                 *  @attribute b HTML option
                 *
                 *  @return 1/-1
                **/
                // FIXME: What is this function? We never set NA
                sort: function(a, b) {
                    if (a.innerHTML == 'NA') {
                        return 1;
                    } else if (b.innerHTML == 'NA') {
                        return -1;
                    }

                    return (a.innerHTML > b.innerHTML) ? 1 : -1;
                },

                /*  will tell if the search can start
                 *
                 *  @method fireSearch
                 *  @attribute value String
                 *
                 *  @return {boolean}
                **/
                fireSearch: function(value) {
                    return value.length > 1;
                }
            }
        };

        var ua = window.navigator.userAgent;
        var isIE = (ua.indexOf("MSIE ") + ua.indexOf("Trident/") + ua.indexOf("Edge/")) > -3;
        var isSafari = ua.toLowerCase().indexOf("safari") > -1;

        $.fn.multiselect = function( options ) {
            return this.each(function() {
                var $this    = $(this),
                    data     = $this.data('crlcu.multiselect'),
                    settings = $.extend({}, $.multiselectdefaults.callbacks, $this.data(), (typeof options === 'object' && options));

                if (!data) {
                    $this.data('crlcu.multiselect', (data = new Multiselect($this, settings)));
                }
            });
        };

        // append options
        // then set the selected attribute to false
        $.fn.move = function( $options ) {
            this
                .append($options)
                .find('option')
                .prop('selected', false);

            return this;
        };

        $.fn.removeIfEmpty = function() {
            if (!this.children().length) {
                this.remove();
            }

            return this;
        };

        $.fn.mShow = function() {
            this.removeClass('hidden').show();

            if (isIE || isSafari) {
                this.each(function(index, option) {
                    // Remove <span> to make it compatible with IE
                    if($(option).parent().is('span')) {
                        $(option).parent().replaceWith(option);
                    }

                    $(option).show();
                });
            }

            return this;
        };

        $.fn.mHide = function() {
            this.addClass('hidden').hide();

            if (isIE || isSafari) {
                this.each(function(index, option) {
                    // Wrap with <span> to make it compatible with IE
                    if(!$(option).parent().is('span')) {
                        $(option).wrap('<span>').hide();
                    }
                });
            }

            return this;
        };

        // sort options then reappend them to the select
        $.fn.mSort = function(callback) {
            this
                .children()
                .sort(callback)
                .appendTo(this);

            this
                .find('optgroup')
                .each(function(i, group) {
                    $(group).children()
                        .sort(callback)
                        .appendTo(group);
                })

            return this;
        };

        // attach index to children
        $.fn.attachIndex = function() {
            this.children().each(function(index, option) {
                var $option = $(option);

                if ($option.is('optgroup')) {
                    $option.children().each(function(i, children) {
                        $(children).data('position', i);
                    });
                }

                $option.data('position', index);
            });
        };

        $.expr[":"].search = function(elem, index, meta) {
            var regex = new RegExp(meta[3], "i");

            return $(elem).text().match(regex);
        }
    })
);

