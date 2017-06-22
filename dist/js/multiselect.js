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
 * @property {boolean} [keepRenderingSort=false] - whether to keep the sort order given by the html option order
 * @property {boolean} [submitAllLeft=true] - whether to submit all visible left options when a form is submitted
 * @property {boolean} [submitAllRight=true] - whether to submit all visible right options when a form is submitted
 * @property {SearchElements} [search] - the meta information used in the search elements
 * @property {boolean} [ignoreDisabled=false] - whether to ignore disabled options when moving
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

// FIXME: Check if everything works when we use multiple destinations ("right" elements)
// FIXME: Check if everything works when we use filters
(
    /**
     * Registers multiselect with amd or directly with jQuery.
     * // FIXME: Is this correct syntax?
     * @param {function} factory - the factory that creates the multiselect api
     */
    function (factory) {
        var checkForGlobaljQuery = function() {
            if (typeof jQuery === 'undefined') {
                throw new Error('multiselect requires jQuery');
            }
        };
        /**
         * Checks if the current jQuery is of the necessary minimum version.
         * @param {jQuery} $
         */
        var checkjQueryVersion = function($) {
                'use strict';

                const REQ_JQUERY_MAJOR = 1;

                const REQ_JQUERY_MINOR = 7;

            /** @type {string[]} version Array containing the jQuery version numbers */
            var version = $.fn.jquery.split(' ')[0].split('.');
            // main check, changed to better reading
            if ((version[0] <= REQ_JQUERY_MAJOR) && (version[1] <= REQ_JQUERY_MINOR)) {
                throw new Error('multiselect requires jQuery version ' + REQ_JQUERY_MAJOR + '.' + REQ_JQUERY_MINOR + ' or higher');
            }
        };

        if (typeof define === 'function' && define.amd) {
            // AMD. Register as an anonymous module depending on jQuery.
            define(['jquery'], factory);
            requirejs("jquery", checkjQueryVersion);
        } else {
            // No AMD. Register plugin with global jQuery object.
            checkForGlobaljQuery();
            checkjQueryVersion(jQuery);
            factory(jQuery);
        }
    }(function ($) {
        'use strict';

        /** Keycode for Enter. */
        const KEY_ENTER = 13;

        /** Keycode for Backspace. */
        const KEY_BACKSPACE = 8;

        /** Keycode for Del. */
        const KEY_DEL = 46;

        /** User Agent identification for Internet Explorer up until IE 10. */
        const USER_AGENT_IE_UPTO_10 = "MSIE ";

        /** User Agent identification for the Edge Browser. */
        const USER_AGENT_EDGE = "Edge/";

        /** User Agent identification for Internet Explorer 11. */
        const USER_AGENT_IE_11 = "Trident/";

        /** User Agent identification for the Safari browser. */
        const USER_AGENT_SAFARI = "safari";

        const CSS_HIDDEN = "hidden";

        const SELECTOR_HIDDEN = "." + CSS_HIDDEN;

        const A_IS_BIGGER_THAN_B = 1;

        const B_IS_BIGGER_THAN_A = -1;

        const DATA_POSITION = "position";

        var isMS = undefined;

        var isSafari = undefined;

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
                keepRenderingSort:  chooseOption(settings.keepRenderingSort, $.multiselectdefaults.options.keepRenderingSort, "boolean"),
                submitAllLeft:      chooseOption(settings.submitAllLeft, $.multiselectdefaults.options.submitAllLeft, "boolean"),
                submitAllRight:     chooseOption(settings.submitAllRight, $.multiselectdefaults.options.submitAllRight, "boolean"),
                search:             chooseOption(settings.search, $.multiselectdefaults.options.search, "object"),
                ignoreDisabled:     chooseOption(settings.ignoreDisabled, $.multiselectdefaults.options.ignoreDisabled, "boolean"),
                matchOptgroupBy:    chooseOption(settings.matchOptgroupBy, $.multiselectdefaults.options.matchOptgroupBy, "string")
            };
        };

        /**
         *
         * @param {SettingsObject} settings
         */
        var extractCallbacks = function(settings) {
            return {
                startUp: chooseCallback(settings.startUp, $.multiselectdefaults.callbacks.startUp),
                sort: chooseCallback(settings.sort, $.multiselectdefaults.callbacks.sort),
                beforeMoveToRight: chooseCallback(settings.beforeMoveToRight, $.multiselectdefaults.callbacks.beforeMoveToRight),
                moveToRight: chooseCallback(settings.moveToRight, $.multiselectdefaults.callbacks.moveToRight),
                afterMoveToRight: chooseCallback(settings.afterMoveToRight, $.multiselectdefaults.callbacks.afterMoveToRight),
                beforeMoveToLeft: chooseCallback(settings.beforeMoveToLeft, $.multiselectdefaults.callbacks.beforeMoveToLeft),
                moveToLeft: chooseCallback(settings.moveToLeft, $.multiselectdefaults.callbacks.moveToLeft),
                afterMoveToLeft: chooseCallback(settings.afterMoveToLeft, $.multiselectdefaults.callbacks.afterMoveToLeft),
                beforeMoveUp: chooseCallback(settings.beforeMoveUp, $.multiselectdefaults.callbacks.beforeMoveUp),
                afterMoveUp: chooseCallback(settings.afterMoveUp, $.multiselectdefaults.callbacks.afterMoveUp),
                beforeMoveDown: chooseCallback(settings.beforeMoveDown, $.multiselectdefaults.callbacks.beforeMoveDown),
                afterMoveDown: chooseCallback(settings.afterMoveDown, $.multiselectdefaults.callbacks.afterMoveDown),
                fireSearch: chooseCallback(settings.fireSearch, $.multiselectdefaults.callbacks.fireSearch)
            };
        };

        var chooseCallback = function(userCallback, defaultCallback) {
            return chooseOption(userCallback, defaultCallback, "function");
        };

        var chooseOption = function(userOption, defaultOption, optionType) {
            if (userOption !== undefined) {
                if (optionType === "jQuery" && userOption instanceof jQuery && userOption.length > 0) {
                    return userOption;
                }
                if (optionType !== "jQuery" && typeof userOption === optionType) {
                    return userOption;
                }
            }
            return defaultOption;
        };

        var isMicrosoftBrowser = function() {
            var ua = window.navigator.userAgent;
            return ( ua.indexOf(USER_AGENT_IE_UPTO_10) > 0 ||
                    ua.indexOf(USER_AGENT_IE_11) > 0 ||
                    ua.indexOf(USER_AGENT_EDGE) > 0
            );
        };

        var isSafariBrowser = function() {
            var ua = window.navigator.userAgent;
            return (ua.toLowerCase().indexOf(USER_AGENT_SAFARI) > -1);
        };

        // FIXME: What is this function? We never set NA
        var lexicographicComparison = function(a, b) {
            // FIXME: What is this? An empty element returns "" with innerHTML...
            // BF: Commented that out, checked, seems ok, elements beginning with "NA"
            // are sorted first, e.g. "NAME1" before "Item 1"?
            /*
            const NA = "NA";
            if (a.innerHTML == NA) {
                return A_IS_BIGGER_THAN_B;
            } else if (b.innerHTML == NA) {
                return B_IS_BIGGER_THAN_A;
            }
            */
            // lexicographic comparison between strings (compare chars at same index)
            // e.g. 99 > 100
            // e.g. abc99 > abc100
            // e.g. bbb > aaa
            return (a.innerHTML > b.innerHTML) ? A_IS_BIGGER_THAN_B : B_IS_BIGGER_THAN_A;
        };

        var renderingSortComparison = function(a, b) {
            var aPosition = getInitialPosition($(a));
            var bPosition = getInitialPosition($(b));
            if (aPosition !== null && bPosition !== null) {
                return aPosition > bPosition ? A_IS_BIGGER_THAN_B : B_IS_BIGGER_THAN_A;
            }
            // should never be reached, ergo undefined behaviour
            return undefined;
        };

        var getInitialPosition = function($optionOrOptgroup) {
            if ($optionOrOptgroup !== undefined && $optionOrOptgroup.is("option,optgroup")) {
                return $optionOrOptgroup.data(DATA_POSITION);
            }
            return null;
        };

        var setInitialPosition = function($optionOrOptgroup, newPosition) {
            if ($optionOrOptgroup !== undefined && $optionOrOptgroup.is("option,optgroup")) {
                $optionOrOptgroup.data(DATA_POSITION, newPosition);
            }
            return $optionOrOptgroup;
        };

        // FIXME: right can be multiple selects
        var prependSearchFilter = function($select, searchFilterHtml) {
            var $searchFilter = $(searchFilterHtml);
            $select.before($searchFilter);
            return $searchFilter;
        };

        var oldFilterOptions = function($filterValue, $select) {
            // options to show
            extendedShow($select.find('option:search("' + $filterValue + '")'));
            // options to hide
            extendedHide($select.find('option:not(:search("' + $filterValue + '"))'));
            // optgroups to hide
            extendedHide($select.find('option.hidden').parent('optgroup').not($(":visible").parent()));
            // optgroups to show
            extendedShow($select.find('option:not(.hidden)').parent('optgroup'));
        };

        var applyFilter = function($filterValue, $select) {
            if ($filterValue === undefined || $filterValue == "") {
                removeFilter($select);
            }
            var $allOptions = $select.find("option");
            var $prevHiddenOptions = $allOptions.filter(SELECTOR_HIDDEN);
            var $matchingOptions = $allOptions.filter(':search("' + $filterValue + '")');
            var $allOptgroups = $select.children("optgroup");
            var hasOptgroups = $allOptgroups.length > 0;
            if (hasOptgroups){
                var $prevHiddenOptgroups = $allOptgroups.filter(SELECTOR_HIDDEN);
            }
            if ($allOptions.length == $matchingOptions.length) {
                // edge case: if all options match
                // if there is any previously hidden option, we show them
                if ($prevHiddenOptions.length > 0) {
                    extendedShow($prevHiddenOptions);
                }
                // if there is any previously hidden optgroup, we show them
                if (hasOptgroups && $prevHiddenOptgroups.length > 0) {
                    extendedShow($prevHiddenOptgroups);
                }
                // if there is nothing hidden right now, we just do nothing
            } else {
                // if one or more options do not match and therefore should be hidden
                if ($matchingOptions.length == 0) {
                    // edge case: hide all options
                    // just hide those that aren't hidden yet
                    extendedHide($allOptions.not($prevHiddenOptions));
                    if (hasOptgroups) {
                        extendedHide($allOptgroups.not($prevHiddenOptgroups));
                    }
                } else {
                    // 1 to n-1 options should be filtered
                    // hide all options that do not match and aren't already hidden
                    // show all options that match and aren't already shown
                    // show all previously hidden optgroups that have at least one shown option now
                    var $prevShownOptions = $allOptions.not($prevHiddenOptions);
                    var $additionalOptionsToHide = $prevShownOptions.not($matchingOptions);
                    var $additionalOptionsToShow = $matchingOptions.not($prevShownOptions);
                    extendedHide($additionalOptionsToHide);
                    extendedShow($additionalOptionsToShow);
                    if (hasOptgroups) {
                        var $prevShownOptgroups = $allOptgroups.not($prevHiddenOptgroups);
                        var $additionalOptgroupsToShow = $prevHiddenOptgroups.filter($additionalOptionsToShow.parent());
                        extendedShow($additionalOptgroupsToShow);
                        // hide all previously shown optgroups that have all their remaining shown options hidden
                        $prevShownOptgroups.each(function(i, prevShownOptgroup) {
                            var $prevShownOptGroup = $(prevShownOptgroup);
                            var $shownOptions = $(prevShownOptgroup).children(":not(" + SELECTOR_HIDDEN + ")");
                            var $remainingOptions = $shownOptions.not($additionalOptionsToHide);
                            if ($remainingOptions.length == 0) {
                                extendedHide($prevShownOptGroup);
                            }
                        });
                    }
                }
            }
        };

        var removeFilter = function($select) {
            extendedShow($select.find('option, optgroup'));
        };

        var measurePerformance = function(startTimestamp, feature) {
            var endTimestamp = performance.now();
            var timeSpent = endTimestamp - startTimestamp;
            console.log("Measuring " + feature + ": " + timeSpent);
        };

        var getOptionsToMove = function($select, onlySelected) {
            if (onlySelected === undefined) {
                onlySelected = true;
            }
            // FIXME: Unsure if this is good, as I could define and use my own hidden class
            var $allVisibleOptions = $select.find("option:not(.hidden)");
            if (onlySelected) {
                return $allVisibleOptions.filter(":selected");
            } else {
                return $allVisibleOptions;
            }
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
                // FIXME: Would be cool for performance reasons if there was a way to dynamically update the options so that you don't have to find all options first
                // FIXME: throw error if neither is found
                // $right can be more than one (multiple destinations) (then dblclick etc would not be usable
                // FIXME: switch for ambiguous actions?
                /** @member {jQuery} */
                this.$right = chooseOption($(settings.right),$('#' + id + '_to'));
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
                        // if rendering sort should be retained, it makes no sense to provide a callback
                        // so ignore it and go back to using rendering sort
                        if (self.callbacks.sort) {
                            self.callbacks.sort = renderingSortComparison;
                        }

                        // decorate the options with their initial positions in the list so that it can be re-established
                        storeRenderingSortOrder(self.$left);

                        self.$right.each(function(i, select) {
                            storeRenderingSortOrder($(select));
                        });
                    }

                    // startUp could be a function or false
                    // either the default is used or the function; false doesn't amount to anything
                    // startUp preprocessing function
                    // TODO: With an api, my startUp function could use that to move options around
                    self.callbacks.startUp( self.$left, self.$right );

                    // initial sort if allowed
                    if ( !self.options.keepRenderingSort && self.callbacks.sort) {
                        // sort seems to be a comparator function, not a sorting function
                        sortSelectItems(self.$left, self.callbacks.sort);

                        // here we acknowledge that we could have multiple right elements
                        self.$right.each(function(i, select) {
                            sortSelectItems($(select), self.callbacks.sort);
                        });
                    }

                    // FIXME: Allow already existing element to be the filter input
                    if (self.options.search) {
                        // Prepend left filter before right palette (above)
                        if (self.options.search.left) {
                            self.$leftSearch = prependSearchFilter(self.$left, self.options.search.left);
                        }
                        // Prepend right filter before right palette (above)
                        // FIXME: What about multiple destinations?
                        if (self.options.search.right) {
                            self.$rightSearch = prependSearchFilter(self.$right, self.options.search.right);
                        }
                    }

                    // Initialize events
                    self.events();
                },

                events: function() {
                    var self = this;

                    // Attach event to left filter
                    if (self.$leftSearch) {
                        self.$leftSearch.keyup(function() {
                            if (self.callbacks.fireSearch(this.value)) {
                                applyFilter(this.value, self.$left);
                            } else {
                                removeFilter(self.$left);
                            }
                        });
                    }

                    // Attach event to right filter
                    if (self.$rightSearch) {
                        self.$rightSearch.keyup(function() {
                            if (self.callbacks.fireSearch(this.value)) {
                                applyFilter(this.value, self.$right);
                            } else {
                                removeFilter(self.$right);
                            }
                        });
                    }

                    // Select all the options from left and right side when submitting the parent form
                    self.$right.closest('form').submit(function() {
                        // Clear left search input
                        if (self.$leftSearch) {
                            self.$leftSearch.val('').keyup();
                        }
                        // Clear right search input
                        if (self.$rightSearch) {
                            self.$rightSearch.val('').keyup();
                        }

                        self.$left.find('option').prop('selected', self.options.submitAllLeft);
                        self.$right.find('option').prop('selected', self.options.submitAllRight);
                    });

                    // Attach event for double clicking on options from left side
                    self.$left.dblclick('option', function(e) {
                        e.preventDefault();

                        var $options = getOptionsToMove(self.$left);

                        if ( $options.length ) {
                            self.moveToRight($options, e);
                        }
                    });

                    // Attach event for pushing ENTER on options from left side
                    self.$left.keypress(function(e) {
                        // this does not seem to work for firefox, linux, maybe a cr/lf problem?
                        if (e.keyCode === KEY_ENTER) {
                            e.preventDefault();

                            var $options = getOptionsToMove(self.$left);

                            if ( $options.length ) {
                                self.moveToRight($options, e);
                            }
                        }
                    });

                    // Attach event for double clicking on options from right side
                    self.$right.dblclick('option', function(e) {
                        e.preventDefault();

                        var $options = getOptionsToMove(self.$right);

                        if ( $options.length ) {
                            self.moveToLeft($options, e);
                        }
                    });

                    // Attach event for pushing BACKSPACE or DEL on options from right side
                    self.$right.keydown(function(e) {
                        if (e.keyCode === KEY_BACKSPACE || e.keyCode === KEY_DEL) {
                            e.preventDefault();

                            var $options = getOptionsToMove(self.$right);

                            if ( $options.length ) {
                                self.moveToLeft($options, e);
                            }
                        }
                    });

                    // dblclick support for IE (need to deselect other palette)
                    if (isMS) {
                        self.$left.dblclick(function() {
                            self.actions.$rightSelected.click();
                        });

                        self.$right.dblclick(function() {
                            self.actions.$leftSelected.click();
                        });
                    }

                    self.actions.$rightSelected.click(function(e) {
                        e.preventDefault();

                        var $options = getOptionsToMove(self.$left);

                        if ( $options.length ) {
                            self.moveToRight($options, e);
                        }

                        $(this).blur();
                    });

                    self.actions.$leftSelected.click(function(e) {
                        e.preventDefault();

                        var $options = getOptionsToMove(self.$right);

                        if ( $options.length ) {
                            self.moveToLeft($options, e);
                        }

                        $(this).blur();
                    });

                    self.actions.$rightAll.click(function(e) {
                        e.preventDefault();
                        // FIXME: Check, "option:not(span)" is redundant, isn't it?
                        var $options = getOptionsToMove(self.$left, false);

                        if ( $options.length ) {
                            self.moveToRight($options, e);
                        }

                        $(this).blur();
                    });

                    self.actions.$leftAll.click(function(e) {
                        e.preventDefault();

                        var $options = getOptionsToMove(self.$right, false);

                        if ( $options.length ) {
                            self.moveToLeft($options, e);
                        }

                        $(this).blur();
                    });

                    self.actions.$undo.click(function(e) {
                        e.preventDefault();

                        self.undo(e);
                    });

                    self.actions.$redo.click(function(e) {
                        e.preventDefault();

                        self.redo(e);
                    });

                    self.actions.$moveUp.click(function(e) {
                        e.preventDefault();

                        var $options = getOptionsToMove(self.$right);

                        if ( $options.length ) {
                            self.moveUp($options, e);
                        }

                        $(this).blur();
                    });

                    self.actions.$moveDown.click(function(e) {
                        e.preventDefault();

                        var $options = getOptionsToMove(self.$right);

                        if ( $options.length ) {
                            self.moveDown($options, e);
                        }

                        $(this).blur();
                    });
                },

                moveToRight: function( $options, event, silent, skipStack ) {
                    var self = this;

                    if (self.callbacks.moveToRight) {
                        return self.callbacks.moveToRight( self, $options, event, silent, skipStack );
                    } else {
                        if (!silent) {
                            if (!self.callbacks.beforeMoveToRight( self.$left, self.$right, $options ) ) {
                                return false;
                            }
                        }

                        self.moveFromAtoB(self.$left, self.$right, $options);
                        self.$rightSearch.keyup();
                        if (!skipStack) {
                            // FIXME: Does UNDO/REDO work with multiple destinations?
                            self.undoStack.push(['right', $options ]);
                            self.redoStack = [];
                        }

                        // FIXME: doNotSortRight doesn't exist
                        if (!silent) {
                            // FIXME: here only a single right element allowed?
                            sortSelectItems(self.$right, self.callbacks.sort);
                            self.callbacks.afterMoveToRight( self.$left, self.$right, $options );
                        }

                        return self;
                    }
                },

                moveToLeft: function( $options, event, silent, skipStack ) {
                    var self = this;

                    if (self.callbacks.moveToLeft) {
                        return self.callbacks.moveToLeft( self, $options, event, silent, skipStack );
                    } else {
                        if (!silent) {
                            if (!self.callbacks.beforeMoveToLeft( self.$left, self.$right, $options ) ) {
                                return false;
                            }
                        }

                        self.moveFromAtoB(self.$right, self.$left, $options);
                        self.$leftSearch.keyup();

                        if ( !skipStack ) {
                            self.undoStack.push(['left', $options ]);
                            self.redoStack = [];
                        }

                        if (!silent ) {
                            sortSelectItems(self.$left, self.callbacks.sort);
                            self.callbacks.afterMoveToLeft( self.$left, self.$right, $options );
                        }

                        return self;
                    }
                },

                moveFromAtoB: function( $source, $destination, $options) {
                    var self = this;

                    var $changedOptgroups = undefined;
                    $options.each(function(index, option) {
                        var $option = $(option);

                        if (self.options.ignoreDisabled && $option.is(':disabled')) {
                            return true;
                        }

                        if ($option.parent().is('optgroup')) {
                            var $sourceGroup = $option.parent();

                            if (typeof $changedOptgroups === "undefined") {
                                $changedOptgroups = $sourceGroup;
                            } else {
                                $changedOptgroups = $changedOptgroups.add($sourceGroup);
                            }
                            var optgroupSelector = 'optgroup[' + self.options.matchOptgroupBy + '="' + $sourceGroup.prop(self.options.matchOptgroupBy) + '"]';
                            var $destinationGroup = $destination.find(optgroupSelector);

                            if (!$destinationGroup.length) {
                                $destinationGroup = $sourceGroup.clone(true);
                                $destinationGroup.empty();

                                moveOptionsTo($destination, $destinationGroup);
                            }
                            moveOptionsTo($destinationGroup,$option);
                        } else {
                            moveOptionsTo($destination, $option);
                        }
                    });
                    removeIfEmpty($changedOptgroups);
                    return self;
                },

                moveUp: function($options) {
                    var self = this;

                    if ( !self.callbacks.beforeMoveUp( $options ) ) {
                        return false;
                    }

                    $options.first().prev().before($options);

                    self.callbacks.afterMoveUp( $options );
                },

                moveDown: function($options) {
                    var self = this;

                    if ( !self.callbacks.beforeMoveDown( $options ) ) {
                        return false;
                    }

                    $options.last().next().after($options);

                    self.callbacks.afterMoveDown( $options );
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
                // FIXME: ignoreDisabled is not documented
                ignoreDisabled: false,
                // FIXME: matchOptgroupBy is not documented
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
                    // FIXME: extract readable method
                    $right.find('option').each(function(index, rightOption) {
                        if ($(rightOption).parent().prop('tagName') == 'OPTGROUP') {
                            var optgroupSelector = 'optgroup[label="' + $(rightOption).parent().attr('label') + '"]';
                            $left.find(optgroupSelector + ' option[value="' + rightOption.value + '"]').each(function(index, leftOption) {
                                leftOption.remove();
                            });
                            removeIfEmpty($left.find(optgroupSelector));
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
                sort: lexicographicComparison,

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

        isMS = isMicrosoftBrowser();
        isSafari = isSafariBrowser();

        $.fn.multiselect = function( options ) {
            return this.each(function() {
                var $this    = $(this),
                    data     = $this.data('crlcu.multiselect'),
                    settings = $.extend({}, $.multiselectdefaults.callbacks, $this.data(), (typeof options === 'object' && options));

                if (!data) {
                    $this.data('crlcu.multiselect', (new Multiselect($this, settings)));
                }
            });
        };

        // append options
        // then set the selected attribute to false
        var moveOptionsTo = function($targetSelect, $options) {
            $targetSelect
                .append($options)
                .find('option')
                .prop('selected', false);

            return $targetSelect;
        };

        var removeIfEmpty = function($elements) {
            $elements.each(function(i, element) {
                var $element = $(element);
                if (!$element.children().length) {
                    $element.remove();
                }
            });

            return $elements;
        };

        var extendedShow = function($elements) {
            $elements.removeClass(CSS_HIDDEN).show();
            if (isMS || isSafari) {
                $elements.each(function(index, element) {
                    // Remove <span> to make it compatible with IE
                    var $option = $(element);
                    var $parent = $option.parent("span");
                    if ($parent.length > 0) {
                        $parent.replaceWith(element);
                    }
                });
            }
            return $elements;
        };

        var extendedHide = function($elements) {
            $elements.addClass(CSS_HIDDEN).hide();

            if (isMS || isSafari) {
                this.each(function(index, element) {
                    var $option = $(element);
                    // Wrap with <span> to make it compatible with IE
                    if(!$option.parent().is('span')) {
                        $option.wrap('<span></span>').hide();
                    }
                });
            }

            return $elements;
        };

        var sortSelectItems = function($select, comparatorCallback) {
            if ($select !== undefined && $select.is("select")) {
                // sort any direct children (can be combination of options and optgroups)
                // FIXME: without initial rendering sort, this can lead to strange behaviour
                // example: oa="aaa", ob="bbb", oc="zzz", oga="ddd", ogb="eee"
                // options without optgroup would potentially be separated, would this be expected behaviour?
                // FIXME: Check what happens here, do the sorted children overwrite the old children?
                $select
                    .children()
                    .sort(comparatorCallback)
                    .appendTo($select);

                // check for optgroups, if none present we've already sorted everything
                // if any, sort their children, i.e. all other previously unsorted options
                $select
                    .find("optgroup")
                    .each(function(i, group) {
                        $(group).children()
                            .sort(comparatorCallback)
                            .appendTo(group);
                    });

                return $select;
            }
        };

        var storeRenderingSortOrder = function($select) {
            if ($select instanceof jQuery && $select.is("select")) {
                // FIXME: Check if this is ok, optgroups start at 0, and options in each group start at 0
                $select.children().each(function(index, optionOrOptgroup) {
                    var $optionOrOptgroup = $(optionOrOptgroup);
                    if ($optionOrOptgroup.is("optgroup")) {
                        $optionOrOptgroup.children().each(function(i, optgroupOption) {
                            setInitialPosition($(optgroupOption), i);
                        });
                    }

                    setInitialPosition($optionOrOptgroup, index);
                });
            }
        };

        // this is the custom jQuery selector :search used when filtering
        $.expr[":"].search = function(elem, index, meta) {
            var regex = new RegExp(meta[3], "i");

            return $(elem).text().match(regex);
        }
    })
);

