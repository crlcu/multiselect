/*
 * @license
 *
 * Multiselect v2.3.12
 * http://crlcu.github.io/multiselect/
 *
 * Copyright (c) 2016 Adrian Crisan
 * Licensed under the MIT license (https://github.com/crlcu/multiselect/blob/master/LICENSE)
 */

/**
 * The jQuery object.
 * @external jQuery
 * */

/**
 * The jQuery prototype alias.
 * @external jQuery.fn
 */

/**
 * Wraps all button elements for possible actions on the Multiselect elements.
 * If no element for an action is given,
 * a DOM search using an assumed default id is used to find the button.
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

/**
 * A wrapper for the part of the options where the user can provide
 * jQuery selectors for the Multiselect elements
 * @typedef {Object} ElementNames
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
 * Additional options wrapper for Multiselect that affects its behaviour
 * @typedef {Object} MultiselectOptions
 * @property {KeepInitialPositionFor} [keepRenderingFor=ALL] - what to keep the rendering order for
 * @property {boolean} [submitAllLeft=true] - whether to submit all visible left options when a form is submitted
 * @property {boolean} [submitAllRight=true] - whether to submit all visible right options when a form is submitted
 * @property {SearchElements} [search] - the meta information used in the search elements
 * @property {boolean} [ignoreDisabled=false] - whether to ignore disabled options when moving
 * @property {string} [matchOptgroupBy='label'] - Which html attribute should be compared against when filtering
 */

/**
 * Callback wrapper for the functions where Multiselect
 * provides a way for the user to influence behaviour.
 * @typedef {Object} CallbackFunctions
 * @property {function} startUp - this function is called during initialisation, before the options are sorted
 * @property {function} sort - used to define a different comparator from the default lexicographical comparison
 * @property {function} beforeMoveToRight - called before the options are moved to the right side of the multiselect
 * @property {function} afterMoveToRight - called after the options are moved to the right side of the multiselect
 * @property {function} beforeMoveToLeft - called before the options are moved to the left side of the multiselect
 * @property {function} afterMoveToLeft - called after the options are moved to the left side of the multiselect
 * @property {function} move - called instead of the default move function
 * @property {function} beforeMoveUp - called before options are moved up inside a right side select
 * @property {function} afterMoveUp - called after options are moved up inside a right side select
 * @property {function} beforeMoveDown - called before options are moved down inside a right side select
 * @property {function} afterMoveDown - called after options are moved down inside a right side select
 * @property {function} fireSearch - called to determine if the filter function for a side should be activated
 */

/**
 * The settings object containing all possible options and information to create a Multiselect.
 * @typedef {CallbackFunctions|ElementNames|MultiselectOptions} SettingsObject
 */

/**
 * Describes options where the user provides inputs to use as select filters
 * @typedef {Object} SearchElements
 * @property {string|jQuery} [left] - either html for or a jQuery element pointing to the input to use for filtering the left palette
 * @property {string|jQuery} [right] - either html for or a jQuery element pointing to the input to use for filtering the right palette
 */

/**
 * The relation between a input used as a filter
 * and the select elements that are filtered by it
 * @typedef {Object} FilterRelation
 * @property {jQuery} $filterInput - the input that you enter text in so that the select is filtered
 * @property {jQuery} $filteredSelects - the select elements filtered by the input (currently always all right elements)
 */

/**
 * Element of the stack for the Undo/Redo functionality.
 * @typedef {Object} StackElement
 * @property {jQuery} $lastSource - the element where the options were before the move
 * @property {jQuery} $lastDestination - the element where the options were after the move
 * @property {jQuery} $movedOptions - which options were moved
 */

/**
 * The stack for the Undo/Redo functionality
 * @typedef {StackElement[]} Stack
 */

/**
 * Representation for an option. (Used when replacing the multiselect items)
 * @typedef {Object} OptionRep
 * @property {string} name - the text of the option
 * @property {string} value - the value of the option
 */

/**
 * Representation for an optgroup. (Used when replacing the multiselect items)
 * @typedef {Object} OptgroupRep
 * @property {string} label - the text of the optgroup
 * @property {OptionRep[]} contents - the contents of the optgroup, i.e. options
 */

/**
 * Representation for the content of a whole select element (i.e. options and optgroups).
 * @typedef {Object} SelectContent
 * @property {OptionRep[]} options - the options without any optgroup in the select
 * @property {OptgroupRep[]} optgroups - the optgroups in this select
 */

(
    /**
     * Registers multiselect with amd or directly with jQuery.
     * @param {function} factory - the factory that creates the multiselect api
     */
    function (factory) {
        /**
         * Check if jQuery is accessible in this script, fail when not.
         */
        function checkForGlobaljQuery() {
            if (typeof jQuery === 'undefined') {
                throw new Error('multiselect requires jQuery');
            }
        }
        /**
         * Checks if the current jQuery is of the necessary minimum version.
         * @param {jQuery} $
         */
        function checkjQueryVersion($) {
            'use strict';
            /**
             * The required major jQuery version number.
             * @type {number}
             */
            const REQ_JQUERY_MAJOR = 1;

            /**
             * The required minor jQuery version number.
             * @type {number}
             */
            const REQ_JQUERY_MINOR = 7;

            /** version Array containing the jQuery version numbers
             * @type {string[]}
             */
            var version = $.fn.jquery.split(' ')[0].split('.');
            // main check, changed to better reading
            if ((version[0] <= REQ_JQUERY_MAJOR) && (version[1] <= REQ_JQUERY_MINOR)) {
                throw new Error('multiselect requires jQuery version ' + REQ_JQUERY_MAJOR + '.' + REQ_JQUERY_MINOR + ' or higher');
            }
        }

        if (typeof define === 'function' && define.amd) {
            // AMD. Register as an anonymous module depending on jQuery.
            define(['jquery'], factory);
            require(["jquery"], checkjQueryVersion);
        } else {
            // No AMD. Register plugin with global jQuery object.
            checkForGlobaljQuery();
            checkjQueryVersion(jQuery);
            factory(jQuery);
        }
    }(function ($) {
        'use strict';

        /**
         * Multiselect API.
         * @module
         */
        var Multiselect = (function($) {
            // private area - constants
            /** Keycode for Enter.
             * @type {number} */
            const KEY_ENTER = 13;

            /** Keycode for Backspace.
             * @type {number} */
            const KEY_BACKSPACE = 8;

            /** Keycode for Del.
             * @type {number} */
            const KEY_DEL = 46;

            /** User Agent identification for Internet Explorer up until IE 10.
             * @type {string} */
            const USER_AGENT_IE_UPTO_10 = "MSIE ";

            /** User Agent identification for the Edge Browser.
             * @type {string} */
            const USER_AGENT_EDGE = "Edge/";

            /** User Agent identification for Internet Explorer 11.
             * @type {string} */
            const USER_AGENT_IE_11 = "Trident/";

            /** User Agent identification for the Safari browser.
             * @type {string} */
            const USER_AGENT_SAFARI = "safari";

            /** CSS class applied to options that to filtered options.
             * @type {string} */
            const CSS_HIDDEN = "hidden";

            /** Selector for the filtered option class.
             * @type {string} */
            const SELECTOR_HIDDEN = "." + CSS_HIDDEN;

            /**
             * Enum for the comparator results for sort functions.
             * @readonly
             * @enum {number} COMPARISON_RESULTS
             */
            const COMPARISON_RESULTS = {
                /** The first parameter should be on a lower index than the second parameter */
                A_COMES_FIRST: -1,
                /** The second parameter should be on a lower index than the first parameter */
                B_COMES_FIRST: 1,
                /** The parameters are equal or just should not be moved around */
                DO_NOT_CHANGE: 0
            };

            /** Data attribute used to store the position any select items had
             * when the multiselect was first initialized.
             * @type {string} */
            const DATA_POSITION = "position";

            /** Data attribute used to store the context of a button in the multiselect. For example,
             * when you click a "rightSelected" button,
             * the context makes clear where the options should be moved to.
             * @type {string} */
            const DATA_CONTEXT = "context";

            /**
             * We only checked once if we are in an MS browser.
             * @type {boolean}
             */
            var isMS = isMicrosoftBrowser();

            /**
             * We only checked once if we are in a Safari browser.
             * @type {boolean}
             */
            var isSafari = isSafariBrowser();

            // private area - functions
            /**
             * Checks if the settings contain the button for the action.
             * If not, looks for the action button in the DOM, using a generated default.
             * @param {string} id - the id part to look for if
             * @param {ElementNames} settings - the settings object to use
             * @param {string} actionName - the action to look for in the settings
             */
            function getActionButton(id, settings, actionName) {
                /**
                 * Chosen selector to use for the search for the button.
                 * @type {string} */
                var selector = "";
                if (settings[actionName]) {
                    selector = settings[actionName];
                } else {
                    selector = buildActionSelector(id, actionName);
                }
                return $(selector);
            }

            /**
             * Extracts all supported settings for action buttons from the settings or uses defaults.
             * @param {string} id - id of the element for the left palette
             * @param {ElementNames} settings - the settings to look in
             * @returns {ActionButtons} - the wrapper containing all action buttons
             */
            function extractActionButtons(id, settings) {
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
            }

            /**
             * This should ensure the action buttons fulfill some required conditions
             * (e.g. perhaps only one button per multiselect)
             * (e.g. perhaps we allow other elements than buttons)
             * @param {ActionButtons} actions - action buttons to check
             */
            function validateActionButtons(actions) {
                // FIXME: Which are required action buttons? Should we error if we can't init them?
                // FIXME: Do we want to allow multiple elements to be buttons for a function?
            }

            /**
             * Extracts the options for the multiselect instance
             * @param {SettingsObject} settings - the settings to use
             * @returns {MultiselectOptions} - extracted multiselect options
             */
            function extractMultiselectOptions(settings) {
                return {
                    keepRenderingFor:   chooseOption(settings.keepRenderingFor, Multiselect.defaults.options.keepRenderingFor, "string"),
                    submitAllLeft:      chooseOption(settings.submitAllLeft, Multiselect.defaults.options.submitAllLeft, "boolean"),
                    submitAllRight:     chooseOption(settings.submitAllRight, Multiselect.defaults.options.submitAllRight, "boolean"),
                    search:             chooseOption(settings.search, Multiselect.defaults.options.search, "object"),
                    ignoreDisabled:     chooseOption(settings.ignoreDisabled, Multiselect.defaults.options.ignoreDisabled, "boolean"),
                    matchOptgroupBy:    chooseOption(settings.matchOptgroupBy, Multiselect.defaults.options.matchOptgroupBy, "string")
                };
            }

            /**
             * This should ensure the options fulfill some required conditions
             * (e.g. search is allowed to contain html and jQuery objects)
             * @param {MultiselectOptions} options - the options to validata
             */
            function validateMultiselectOptions(options) {
                // FIXME: Validation criteria for options
            }

            /**
             * Extracts the callbacks for the multiselect instance
             * @param {SettingsObject} settings - the settings to use
             * @return {CallbackFunctions} - extracted callback functions to use
             */
            function extractCallbacks(settings) {
                return {
                    startUp: chooseCallback(settings.startUp, Multiselect.defaults.callbacks.startUp),
                    sort: chooseCallback(settings.sort, Multiselect.defaults.callbacks.sort),
                    beforeMoveToRight: chooseCallback(settings.beforeMoveToRight, Multiselect.defaults.callbacks.beforeMoveToRight),
                    afterMoveToRight: chooseCallback(settings.afterMoveToRight, Multiselect.defaults.callbacks.afterMoveToRight),
                    beforeMoveToLeft: chooseCallback(settings.beforeMoveToLeft, Multiselect.defaults.callbacks.beforeMoveToLeft),
                    afterMoveToLeft: chooseCallback(settings.afterMoveToLeft, Multiselect.defaults.callbacks.afterMoveToLeft),
                    move: chooseCallback(settings.move, Multiselect.defaults.callbacks.move),
                    beforeMoveUp: chooseCallback(settings.beforeMoveUp, Multiselect.defaults.callbacks.beforeMoveUp),
                    afterMoveUp: chooseCallback(settings.afterMoveUp, Multiselect.defaults.callbacks.afterMoveUp),
                    beforeMoveDown: chooseCallback(settings.beforeMoveDown, Multiselect.defaults.callbacks.beforeMoveDown),
                    afterMoveDown: chooseCallback(settings.afterMoveDown, Multiselect.defaults.callbacks.afterMoveDown),
                    fireSearch: chooseCallback(settings.fireSearch, Multiselect.defaults.callbacks.fireSearch)
                };
            }

            /**
             * This should ensure the callbacks fulfill some required conditions
             * @param {CallbackFunctions} callbacks -the callbacks to check
             */
            function validateCallbacks(callbacks) {
                // FIXME: Validation criteria for callbacks
            }

            /**
             * Convenience function to choose a callback function between user provided and default values.
             * @param userCallback - the callback provided by the user
             * @param defaultCallback - the default callback
             * @returns {function} - the chosen callback
             */
            function chooseCallback(userCallback, defaultCallback) {
                return chooseOption(userCallback, defaultCallback, "function");
            }

            /**
             * Generic way to choose between user provided value and default value,
             * only providing the option type for constraints.
             * @param userOption - the user provided option value
             * @param defaultOption - the default option value
             * @param optionType - the type that any user option should have to be respected
             * @returns {*} - any value adhering to the optionType
             */
            function chooseOption(userOption, defaultOption, optionType) {
                if (userOption !== undefined) {
                    if (optionType === "jQuery" && userOption instanceof $ && userOption.length > 0) {
                        return userOption;
                    }
                    if (optionType !== "jQuery" && typeof userOption === optionType) {
                        return userOption;
                    }
                }
                return defaultOption;
            }

            /**
             * Using the user agent, this checks if the browser is any relevant Microsoft browser.
             * @returns {boolean} - true if the browser identifies as a Microsoft browser.
             */
            function isMicrosoftBrowser() {
                /** The user agent string of the browser.
                 * @type {string} */
                var ua = window.navigator.userAgent;
                return ( ua.indexOf(USER_AGENT_IE_UPTO_10) > -1 ||
                    ua.indexOf(USER_AGENT_IE_11) > -1 ||
                    ua.indexOf(USER_AGENT_EDGE) > -1
                );
            }

            /**
             * Using the user agent, this checks if the browser is the Safari browser.
             * @returns {boolean} - true if the browser identifies as Safari
             */
            function isSafariBrowser() {
                /** The user agent string of the browser.
                 * @type {string} */
                var ua = window.navigator.userAgent;
                return (ua.toLowerCase().indexOf(USER_AGENT_SAFARI) > -1);
            }

            /**
             * This provides lexicographic comparison of two options or optgroups,
             * i.e. the only relevant elements in the multiselect.
             * Examples:
             * 100 &lt; 99
             * abc100 &lt; abc99
             * aaa &lt; bbb
             * @param {HTMLOptionElement|HTMLOptGroupElement} a - the first element
             * @param {HTMLOptionElement|HTMLOptGroupElement} b - the second element
             * @returns {COMPARISON_RESULTS} - the result of the comparison
             */
            function lexicographicComparison(a, b) {
                /** The text used to compare item a
                 * @type {string} */
                var aText = getOptionOrOptgroupText(a);
                /** The text used to compare item b
                 * @type {string} */
                var bText = getOptionOrOptgroupText(b);
                if (aText === "" || bText === "") {
                    return COMPARISON_RESULTS.DO_NOT_CHANGE;
                }
                // lexicographic comparison between strings (compare chars at same index)
                return (aText < bText) ? COMPARISON_RESULTS.A_COMES_FIRST : COMPARISON_RESULTS.B_COMES_FIRST;
            }

            /**
             * Takes an option or optgroup and returns the appropriate text to use for comparison.
             * @param {HTMLOptionElement|HTMLOptGroupElement} optionOrOptgroup - the HTML element to check
             * @returns {string} - the text for the element (if it is an option or optgroup)
             */
            function getOptionOrOptgroupText(optionOrOptgroup) {
                /** The element tag name
                 * @type {string} */
                var tagName = optionOrOptgroup.tagName;
                if (tagName == "OPTION") {
                    return optionOrOptgroup.innerHTML;
                }
                if (tagName == "OPTGROUP") {
                    return optionOrOptgroup.label;
                }
                return "";
            }

            /**
             * Comparison using the initial position of elements
             * stored during the initialization process.
             * @param {HTMLOptionElement|HTMLOptGroupElement} a - the first element
             * @param {HTMLOptionElement|HTMLOptGroupElement} b - the second element
             * @returns {COMPARISON_RESULTS} - the result of the comparison
             */
            function initialOrderComparison(a, b) {
                /** The initial index for a
                 * @type {number} */
                var aPositionIndex = getInitialPosition($(a));
                /** The initial index for b
                 * @type {number} */
                var bPositionIndex = getInitialPosition($(b));
                if (aPositionIndex !== -1 && bPositionIndex !== -1) {
                    return aPositionIndex < bPositionIndex
                        ? COMPARISON_RESULTS.A_COMES_FIRST
                        : COMPARISON_RESULTS.B_COMES_FIRST;
                }
                // If anything is unclear, do not change positions
                return COMPARISON_RESULTS.DO_NOT_CHANGE;
            }

            /**
             * Returns the initial position (index) inside the multiselect
             * for the given option or optgroup
             * @param {jQuery} $optionOrOptgroup - the option or optgroup with the stored position
             * @returns {number} - the initial position of this element relative to the parent element
             */
            function getInitialPosition($optionOrOptgroup) {
                if ($optionOrOptgroup instanceof $ && $optionOrOptgroup.is("option,optgroup")) {
                    return $optionOrOptgroup.data(DATA_POSITION);
                }
                return -1;
            }

            /**
             * Stores the initial position (index) inside the multiselect
             * for the given option or optgroup
             * @param {jQuery} $optionOrOptgroup - the option or optgroup for which the position should be recorded
             * @param {number} newPosition - the new stored position for this element
             * @returns {jQuery} - returns the element for chaining
             */
            function setInitialPosition($optionOrOptgroup, newPosition) {
                if ($optionOrOptgroup instanceof $ && $optionOrOptgroup.is("option,optgroup")) {
                    $optionOrOptgroup.data(DATA_POSITION, newPosition);
                }
                return $optionOrOptgroup;
            }

            /**
             * Either prepends the given search filter html to the target select element
             * just uses an existing input for the filter. Also stores which
             * selects should be affected by the filter.
             * @param {jQuery} $targetSelect - the select element where the filter should be prepended
             * @param {string|jQuery} searchFilterHtmlOrElement - the html for the search filter or an existing jQuery element
             * @param {jQuery} $filteredSelects - the select elements that should be filtered with this input
             * @returns {FilterRelation} - the filter/selects relation
             */
            function prependSearchFilter($targetSelect, searchFilterHtmlOrElement, $filteredSelects) {
                /** The created search filter element
                 * @type {jQuery} */
                var $searchFilter = $();
                if (typeof searchFilterHtmlOrElement === "string") {
                    $searchFilter = $(searchFilterHtmlOrElement);
                    $targetSelect.before($searchFilter);
                } else if (searchFilterHtmlOrElement instanceof $) {
                    //noinspection JSValidateTypes
                    $searchFilter = searchFilterHtmlOrElement;
                }
                return {
                    $filterInput: $searchFilter,
                    $filteredSelects: $filteredSelects
                };
            }

            /**
             * The old filter function stored for reference.
             * @param {string} filterValue - the value options must match
             * @param {jQuery} $select - the select to filter
             */
            function oldFilterOptions(filterValue, $select) {
                // options to show
                extendedShow($select.find('option:search("' + filterValue + '")'));
                // options to hide
                extendedHide($select.find('option:not(:search("' + filterValue + '"))'));
                // optgroups to hide
                extendedHide($select.find('option.hidden').parent('optgroup').not($(":visible").parent()));
                // optgroups to show
                extendedShow($select.find('option:not(.hidden)').parent('optgroup'));
            }

            /**
             * This builds the default action selector used to find elements the user didn't provide.
             * @param id - preferably the id of the left palette
             * @param actionName - the action looked for
             * @returns {string} - the default selector for this action
             */
            function buildActionSelector(id, actionName) {
                    return "#" + id + "_" + actionName;
            }

            /**
             * Builds the selector for the jQuery custom selector search extension.
             * @param someValue - the value to search for
             * @returns {string} - the selector for this value
             */
            function buildSearchSelector(someValue) {
                /** @type {string} */
                var quote = chooseQuotes(someValue);
                return ":search(" + quote + someValue + quote + ")";
            }

            /**
             * Filters the given selects using the filter value
             * to check which options should be filtered.
             * @param {string} filterValue - the value to use for choosing options to filter
             * @param {jQuery} $selectsToFilter - the select elements that should be filtered using the value
             */
            function applyFilter(filterValue, $selectsToFilter) {
                if (!filterValue || filterValue == "") {
                    removeFilter($selectsToFilter);
                }
                /** @type {jQuery} */
                var $allOptions = $selectsToFilter.find("option");
                /** @type {jQuery} */
                var $prevHiddenOptions = $allOptions.filter(SELECTOR_HIDDEN);
                /** @type {jQuery} */
                var $matchingOptions = $allOptions.filter(buildSearchSelector(filterValue));
                /** @type {jQuery} */
                var $allOptgroups = $selectsToFilter.children("optgroup");
                /** @type {boolean} */
                var hasOptgroups = $allOptgroups.length > 0;
                /** @type {jQuery} */
                var $prevHiddenOptgroups = $();
                if (hasOptgroups) {
                    $prevHiddenOptgroups = $allOptgroups.filter(SELECTOR_HIDDEN);
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
                        /** @type {jQuery} */
                        var $prevShownOptions = $allOptions.not($prevHiddenOptions);
                        /** @type {jQuery} */
                        var $additionalOptionsToHide = $prevShownOptions.not($matchingOptions);
                        /** @type {jQuery} */
                        var $additionalOptionsToShow = $matchingOptions.not($prevShownOptions);
                        extendedHide($additionalOptionsToHide);
                        extendedShow($additionalOptionsToShow);
                        if (hasOptgroups) {
                            /** @type {jQuery} */
                            var $prevShownOptgroups = $allOptgroups.not($prevHiddenOptgroups);
                            /** @type {jQuery} */
                            var $additionalOptgroupsToShow = $prevHiddenOptgroups.filter($additionalOptionsToShow.parent());
                            extendedShow($additionalOptgroupsToShow);
                            // hide all previously shown optgroups that have all their remaining shown options hidden
                            $prevShownOptgroups.each(function(i, prevShownOptgroup) {
                                /** @type {jQuery} */
                                var $prevShownOptGroup = $(prevShownOptgroup);
                                /** @type {jQuery} */
                                var $shownOptions = $(prevShownOptgroup).children(":not(" + SELECTOR_HIDDEN + ")");
                                /** @type {jQuery} */
                                var $remainingOptions = $shownOptions.not($additionalOptionsToHide);
                                if ($remainingOptions.length == 0) {
                                    extendedHide($prevShownOptGroup);
                                }
                            });
                        }
                    }
                }
            }

            /**
             * Removes the filter by showing all options and optgroups in the select.
             * @param {jQuery} $selects - the selects to remove the filter of
             */
            function removeFilter($selects) {
                extendedShow($selects.find('option, optgroup'));
            }

            /**
             * Debug function to measure performance for functions.
             * Takes a start timestamp and calculates duration using the end which is now.
             * @param {number} startTimestamp - the start of the measure activity
             * @param {string} feature - the feature to be tested to better discern in the console log
             */
            function measurePerformance(startTimestamp, feature) {
                var endTimestamp = performance.now();
                var timeSpent = endTimestamp - startTimestamp;
                console.log("Measuring " + feature + ": " + timeSpent);
            }

            /**
             * Given a select and the option to return only selected options or all of them,
             * this returns all requested options (but no invisible/hidden options)
             * @param {jQuery} $select - the select to find options in
             * @param {boolean} [onlySelected=true] - if true, returns only selected options; if false, returns all options
             * @returns {jQuery} - the requested options
             */
            function getOptionsToMove($select, onlySelected) {
                if (onlySelected === undefined) {
                    onlySelected = true;
                }
                // FIXME: Unsure if this is good, as I could define and use my own hidden class
                /** @type {jQuery} */
                var $allVisibleOptions = $select.find("option:not(" + SELECTOR_HIDDEN + ")");
                if (onlySelected) {
                    return $allVisibleOptions.filter(":selected");
                } else {
                    return $allVisibleOptions;
                }
            }

            /**
             * Checks the two sides of the Multiselect and removes any duplicate options
             * (and maybe empty optgroups) from the left side
             * @param {jQuery} $left - the left select
             * @param {jQuery} $right - the right selects
             */
            function removeDuplicateOptions($left, $right) {
                // FIXME: What if one right element has the same option as another right element?
                $right.find('option').each(function(index, rightOption) {
                    /** @type {jQuery} */
                    var $rightOption = $(rightOption);
                    /** @type {jQuery} */
                    var $parentOptgroup = $rightOption.parent("optgroup");
                    /** @type {string} */
                    var duplicateOptionSelector = 'option[value="' + rightOption.value + '"]';
                    // FIXME: What about matchOptgroupBy? Shouldn't it be respected here?
                    if ($parentOptgroup.length > 0) {
                        /** @type {string} */
                        var sameOptgroupSelector = 'optgroup[label="' + $parentOptgroup.attr('label') + '"]';
                        /** @type {jQuery} */
                        var $sameOptgroup = $left.find(sameOptgroupSelector);
                        if ($sameOptgroup.length > 0) {
                            $sameOptgroup.find(duplicateOptionSelector).each(function(index, duplicateOption) {
                                duplicateOption.remove();
                            });
                            removeIfEmpty($sameOptgroup);
                        }
                    } else {
                        /** @type {jQuery} */
                        var $option = $left.find(duplicateOptionSelector);
                        $option.remove();
                    }
                });
            }

            /**
             * Appends the options to the target select element and deselects them.
             * @param {jQuery} $targetSelect - the select where the options should be moved to
             * @param {jQuery} $options - the options to move
             * @returns {jQuery} - the select for chaining
             */
            function moveOptionsTo($targetSelect, $options) {
                $targetSelect
                    .append($options)
                    .find('option')
                    .prop('selected', false);

                return $targetSelect;
            }

            /**
             * Checks elements if they contain children. If not, removes the element.
             * @param {jQuery} $elements - the elements to check (used for optgroups)
             * @returns {jQuery} - the elements to check for further chaining
             */
            function removeIfEmpty($elements) {
                $elements.each(function(i, element) {
                    /** @type {jQuery} */
                    var $element = $(element);
                    if (!$element.children().length) {
                        $element.remove();
                    }
                });

                return $elements;
            }

            /**
             * Shows elements using CSS and jQuery functions.
             * @param {jQuery} $elements - elements to show
             * @returns {jQuery} the elements for chaining
             */
            function extendedShow($elements) {
                $elements.removeClass(CSS_HIDDEN).show();
                // FIXME: This would be probably be better using feature based checks (Modernizr etc.)
                if (isMS || isSafari) {
                    $elements.each(function(index, element) {
                        // Remove <span> to make it compatible with IE
                        /** @type {jQuery} */
                        var $option = $(element);
                        /** @type {jQuery} */
                        var $anySpanParents = $option.parent("span");
                        if ($anySpanParents.length > 0) {
                            $anySpanParents.replaceWith(element);
                        }
                    });
                }
                return $elements;
            }

            /**
             * Hides elements using CSS and jQuery functions.
             * @param {jQuery} $elements - the elements to hide
             * @returns {jQuery} the elements for chaining
             */
            function extendedHide($elements) {
                $elements.addClass(CSS_HIDDEN).hide();
                // FIXME: This would be probably be better using feature based checks (Modernizr etc.)
                if (isMS || isSafari) {
                    $elements.each(function(index, element) {
                        /** @type {jQuery} */
                        var $option = $(element);
                        // Wrap with <span> to make it compatible with IE
                        if(!$option.parent('span').length > 0) {
                            $option.wrap('<span></span>').hide();
                        }
                    });
                }

                return $elements;
            }

            /**
             * Sorts the options and optgroups inside the select using a given comparator callback.
             * Sorts only those items whose initial order shouldn't be preserved
             * @param {jQuery} $select - the select to sort
             * @param {function} comparatorCallback
             * @param {KeepInitialPositionFor} keepInitialPositionFor - if we want to keep certain ordering
             * @returns {jQuery} - the select that was sorted, for chaining
             */
            function sortSelectItems($select, comparatorCallback, keepInitialPositionFor) {
                if (isOnlySelects($select)) {
                    var optionComparator = initialOrderComparison;
                    if (!shouldOptionsBeSortedByPosition(keepInitialPositionFor)) {
                        optionComparator = comparatorCallback;
                    }
                    var optgroupComparator = initialOrderComparison;
                    if (!shouldOptgroupsBeSortedByPosition(keepInitialPositionFor)) {
                        optgroupComparator = comparatorCallback;
                    }
                    // TODO: How about allowing the user to decide if optgroup-less options come first or last?
                    // the options that are not in an optgroup come first
                    $select.children("option").sort(optionComparator).appendTo($select);
                    /** @type {jQuery} */
                    var $optgroups = $select.children("optgroup");
                    if ($optgroups.length > 0) {
                        // then sort the optgroups themselves, if any are there
                        $optgroups.sort(optgroupComparator).appendTo($select);
                        // then sort their options
                        $optgroups.each(function(i, optgroup) {
                            $(optgroup).children().sort(optionComparator).appendTo(optgroup);
                        });
                    }
                }
                return $select;
            }

            /**
             * Checks if options should be sorted by position or some other user customizable callback
             * @param {KeepInitialPositionFor} keepInitialPositionFor - the current setting for this
             * @returns {boolean} - true if options should be sorted by initial position
             */
            function shouldOptionsBeSortedByPosition(keepInitialPositionFor) {
                //noinspection JSValidateTypes
                return (keepInitialPositionFor === Multiselect.KeepInitialPositionFor.ALL);
            }

            /**
             * Checks if optgroups should be sorted by position or some other user customizable callback
             * @param {KeepInitialPositionFor} keepInitialPositionFor - the current setting for this
             * @returns {boolean} - true if optgroups should be sorted by initial position
             */
            function shouldOptgroupsBeSortedByPosition(keepInitialPositionFor) {
                //noinspection JSValidateTypes
                return (keepInitialPositionFor === Multiselect.KeepInitialPositionFor.OPTGROUPS
                || keepInitialPositionFor === Multiselect.KeepInitialPositionFor.ALL);
            }

            /**
             * Stores the initial rendering order.
             * @param {jQuery} $select - the select to store the initial positions for
             * @param {KeepInitialPositionFor} keepRenderingFor - which element types to store the position for
             * @return {jQuery} the select for chaining
             */
            function storeRenderingSortOrder($select, keepRenderingFor) {
                if (isOnlySelects($select)) {
                    // TODO: First remove the old order?
                    //noinspection JSValidateTypes
                    if (keepRenderingFor !== Multiselect.KeepInitialPositionFor.NONE) {
                        $select.children().each(function(index, optionOrOptgroup) {
                            /** @type {jQuery} */
                            var $optionOrOptgroup = $(optionOrOptgroup);
                            /** @type {boolean} */
                            var isOptgroup = $optionOrOptgroup.is("optgroup");
                            //noinspection JSValidateTypes
                            if (isOptgroup && keepRenderingFor === Multiselect.KeepInitialPositionFor.ALL) {
                                $optionOrOptgroup.children().each(function(i, optgroupOption) {
                                    setInitialPosition($(optgroupOption), i);
                                });
                            }
                            //noinspection JSValidateTypes
                            if (isOptgroup || keepRenderingFor === Multiselect.KeepInitialPositionFor.ALL) {
                                setInitialPosition($optionOrOptgroup, index);
                            }
                        });
                    }
                }
                return $select;
            }

            /**
             * Checks if a given element set contains only select elements.
             * @param {jQuery} $elems - the elements to check
             * @returns {boolean} - true if only selects present, false otherwise
             */
            function isOnlySelects($elems) {
                if ($elems instanceof $) {
                    if ($elems.length > 0 && $elems.is("select")) {
                        return true;
                    }
                }
                return false;
            }

            /**
             * Checks if the given element set is only a SINGLE select element, throws an error otherwise.
             * @param {jQuery} $select - the hopefully single select element
             */
            function verifySingleSelect($select) {
                if (!isOnlySelects($select) || $select.length !== 1) {
                    throw new Error("A single Multiselect requires a single jQuery select element for the left side.");
                }
            }

            /**
             * Adds the filtering event to a relation between a
             * filter input and one or more select elements.
             * Decides whether to filter using the given callback.
             * @param {FilterRelation} filterRelation - the relation to establish the filter for
             * @param {function} filterOptionsCallback - the callback to decide whether to filter
             */
            function addFiltering(filterRelation, filterOptionsCallback) {
                filterRelation.$filterInput.keyup(function(e) {
                    var filterValue = e.currentTarget.value;
                    if (filterOptionsCallback(filterValue)) {
                        applyFilter(filterValue, filterRelation.$filteredSelects);
                    } else {
                        removeFilter(filterRelation.$filteredSelects);
                    }
                });
            }

            /**
             * Retrieves the select context for the button.
             * @param {jQuery} $msButton - the button
             * @returns {jQuery} - the select referenced by this button
             */
            function getButtonContext($msButton) {
                // FIXME: Probably more checking necessary
                return $($msButton.data(DATA_CONTEXT));
            }

            /**
             * Sets the select context for this button.
             * @param {jQuery} $msButton - the button
             * @param {string} newSelector - the new context
             */
            function setButtonContext($msButton, newSelector) {
                // FIXME: Probably more checking necessary
                if ($msButton) {
                    $msButton.data(DATA_CONTEXT, newSelector);
                }
            }

            /**
             * When a move event is triggered, this takes a Multiselect instance
             * and the source and destination of the move and gets the options that should be moved (some or all).
             * Then it moves the options
             * @param {Multiselect} msInstance - the Multiselect instance containing the selects
             * @param {jQuery} $source - the source select of the options
             * @param {jQuery} $destination - the destination select of the options
             * @param {boolean} [onlySelected=true] - true if only selected options should be moved
             */
            function commenceMovingOptions(msInstance, $source, $destination, onlySelected) {
                /** @type {jQuery} */
                var $options = getOptionsToMove($source, onlySelected);
                if ($options.length) {
                    if (isValidMoveRequest(msInstance, $destination, $options)) {
                        msInstance.callbacks.move($source, $destination, $options);
                        afterMove(msInstance, $source, $destination, $options);
                    }
                }
            }

            /**
             * Moves options from source to destination.
             * @param {jQuery} $source - the source where the options were
             * @param {jQuery} $destination - the destination where the options will be
             * @param {jQuery} $options - the options to be moved
             */
            function moveFromAtoB($source, $destination, $options) {
                var msInstance = Multiselect.getInstance($source);
                if (!msInstance) msInstance = Multiselect.getInstance($destination);
                /** @type {jQuery} */
                var $changedOptgroups = $();
                $options.each(function(index, option) {
                    /** @type {jQuery} */
                    var $option = $(option);

                    if (msInstance.options.ignoreDisabled && $option.is(':disabled')) {
                        return true;
                    }

                    if ($option.parent().is('optgroup')) {
                        /** @type {jQuery} */
                        var $sourceGroup = $option.parent();

                        if (typeof $changedOptgroups === "undefined") {
                            $changedOptgroups = $sourceGroup;
                        } else {
                            $changedOptgroups = $changedOptgroups.add($sourceGroup);
                        }
                        /** @type {string} */
                        var optgroupSelector = 'optgroup['
                            + msInstance.options.matchOptgroupBy
                            + '="' + $sourceGroup.prop(msInstance.options.matchOptgroupBy) + '"]';
                        /** @type {jQuery} */
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
                if ($changedOptgroups.length > 0) {
                    removeIfEmpty($changedOptgroups);
                }
                return this;
            }

            /**
             *
             * @param {Multiselect} msInstance
             * @param {jQuery} $destination
             * @param {jQuery} $options
             * @returns {boolean}
             */
            function isValidMoveRequest(msInstance, $destination, $options) {
                /** @type {boolean} */
                var toLeftSide = ($destination === msInstance.$left);
                /** @type {function} */
                var beforeCallback = (toLeftSide ? msInstance.callbacks.beforeMoveToLeft : msInstance.callbacks.beforeMoveToRight);
                return beforeCallback(msInstance.$left, msInstance.$right, $options);
            }

            function afterMove(msInstance, $source, $destination, $options) {
                /** @type {StackElement} stackElement */
                var stackElement = {
                    $lastSource: $source,
                    $lastDestination: $destination,
                    $movedOptions: $options
                };
                msInstance.undoStack.push(stackElement);
                // TODO: Do we need memory management with the new stack?
                msInstance.redoStack = [];
                sortSelectItems($destination, msInstance.callbacks.sort, msInstance.options.keepRenderingFor);
                var toLeftSide = ($destination === msInstance.$left);
                /** @type {function} */
                var afterCallback = (toLeftSide ? msInstance.callbacks.afterMoveToLeft : msInstance.callbacks.afterMoveToRight);
                afterCallback( msInstance.$left, msInstance.$right, $options );
                if (msInstance.options.search) {
                    /** @type {jQuery} */
                    var filterToClear = toLeftSide ? msInstance.leftSearch.$filterInput : msInstance.rightSearch.$filterInput;
                    filterToClear.val("").keyup();
                }
                return msInstance;
            }

            /**
             * Attaches the necessary events to the components of the Multiselect instance.
             * @param {Multiselect} msInstance - the instance to prepare
             */
            function prepareEvents(msInstance) {
                /** @type {Multiselect} */
                var self = msInstance;

                // Attach event to left filter
                if (self.leftSearch) {
                    addFiltering(self.leftSearch, self.callbacks.fireSearch);
                }

                // Attach event to right filter
                if (self.rightSearch) {
                    addFiltering(self.rightSearch, self.callbacks.fireSearch);
                }

                // Select all the options from left and right side when submitting the parent form
                self.$right.closest('form').submit(function() {
                    // Clear left search input
                    if (self.leftSearch) {
                        self.leftSearch.$filterInput.val('').keyup();
                    }
                    // Clear right search input
                    if (self.rightSearch) {
                        self.rightSearch.$filterInput.val('').keyup();
                    }

                    self.$left.find('option').prop('selected', self.options.submitAllLeft);
                    self.$right.find('option').prop('selected', self.options.submitAllRight);
                });

                // Attach event for double clicking on options from left side
                self.$left.dblclick('option', function(e) {
                    e.preventDefault();
                    commenceMovingOptions(self, self.$left, self.$right.first());
                });

                // Attach event for pushing ENTER on options from left side
                self.$left.keydown(function(e) {
                    if (e.keyCode === KEY_ENTER) {
                        e.preventDefault();
                        commenceMovingOptions(self, self.$left, self.$right.first());
                    }
                });

                // Attach event for double clicking on options from right side
                self.$right.dblclick('option', function(e) {
                    e.preventDefault();
                    commenceMovingOptions(self, $(e.currentTarget), self.$left);
                });

                // Attach event for pushing BACKSPACE or DEL on options from right side
                self.$right.keydown(function(e) {
                    if (e.keyCode === KEY_ENTER || e.keyCode === KEY_BACKSPACE || e.keyCode === KEY_DEL) {
                        e.preventDefault();
                        commenceMovingOptions(self, $(e.currentTarget), self.$left);
                    }
                });

                // dblclick support for IE (need to deselect other palette)
                if (isMS) {
                    self.$left.dblclick(function() {
                        self.actions.$rightSelected.first().click();
                    });

                    self.$right.dblclick(function(e) {
                        commenceMovingOptions(self, $(e.currentTarget), self.$left);
                    });
                }

                self.actions.$rightSelected.click(function(e) {
                    e.preventDefault();
                    var $targetSelect = getButtonContext($(e.currentTarget));
                    commenceMovingOptions(self, self.$left, $targetSelect);
                    $(this).blur();
                });

                self.actions.$leftSelected.click(function(e) {
                    e.preventDefault();
                    var $sourceSelect = getButtonContext($(e.currentTarget));
                    commenceMovingOptions(self, $sourceSelect, self.$left);
                    $(this).blur();
                });

                self.actions.$rightAll.click(function(e) {
                    e.preventDefault();
                    var $targetSelect = getButtonContext($(e.currentTarget));
                    commenceMovingOptions(self, self.$left, $targetSelect, false);
                    $(this).blur();
                });

                self.actions.$leftAll.click(function(e) {
                    e.preventDefault();
                    var $sourceSelect = getButtonContext($(e.currentTarget));
                    commenceMovingOptions(self, $sourceSelect, self.$left, false);
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

                    /** @type {jQuery} */
                    var $targetSelect = getButtonContext($(e.currentTarget));
                    /** @type {jQuery} */
                    var $options = getOptionsToMove($targetSelect);

                    if ( $options.length ) {
                        self.moveUp($options, e);
                    }

                    $(this).blur();
                });

                self.actions.$moveDown.click(function(e) {
                    e.preventDefault();

                    /** @type {jQuery} */
                    var $targetSelect = getButtonContext($(e.currentTarget));
                    /** @type {jQuery} */
                    var $options = getOptionsToMove($targetSelect);

                    if ( $options.length ) {
                        self.moveDown($options, e);
                    }

                    $(this).blur();
                });
            }

            /**
             * Transforms the given select representation to HTML optgroups and options.
             * @param {SelectContent} newItems - the select content that should be transformed to HTML
             * @return {string} the HTML select content
             */
            function toContentHtml(newItems) {
                /** @type {string} */
                var htmlContent = "";
                /** @type {number} */
                var grouplessOptionCount = newItems.options.length;

                for (/** @type {number} */var i = 0; i < grouplessOptionCount; i++) {
                    /** @type {OptionRep} */
                    var option = newItems.options[i];
                    htmlContent += toOptionHtml(option);
                }
                /** @type {number} */
                var optgroupCount = newItems.optgroups.length;
                for (i = 0; i < optgroupCount; i++) {
                    /** @type {OptgroupRep} */
                    var optgroup = newItems.optgroups[i];
                    htmlContent += toOptgroupHtml(optgroup);
                }
                return htmlContent;
            }

            /**
             * Transforms an option representation to its HTML equivalent
             * @param {OptionRep} optionRep - the option to transform
             * @return {string} the option HTML
             */
            function toOptionHtml(optionRep) {
                /** @type {string} */
                var htmlContent = "<option value=";
                /** @type {string} */
                var value = optionRep.value.toString();
                /** @type {string} */
                var quote = chooseQuotes(value);
                htmlContent += quote + escapeHtml(value) + quote + ">";
                htmlContent += optionRep.name;
                htmlContent += "</option>";
                return htmlContent;
            }

            /**
             * Escapes certain HTML chars.
             * @param {string} value - the value to escape
             * @returns {string} - the escaped value
             */
            function escapeHtml(value) {
                /** @type {string} */
                var newValue = value.replace('"', "&quot;");
                newValue = newValue.replace("'", "&apos;");
                return newValue;
            }

            /**
             * Chooses the type of quote that should encase the value.
             * Looks at the earliest quote to decide.
             * @param someValue - value that may contain single or double quotes
             * @returns {string} - the chosen quote (' or ")
             */
            function chooseQuotes(someValue) {
                /** @type {string} */
                const SINGLE_QUOTE = "'";
                /** @type {string} */
                const DOUBLE_QUOTE = '"';
                if (typeof someValue === "number") {
                    someValue = someValue.toString();
                } else if (someValue === "") {
                    return DOUBLE_QUOTE;
                }

                /** @type {number} */
                var firstSingleQuoteIndex = someValue.indexOf(SINGLE_QUOTE);
                /** @type {number} */
                var firstDoubleQuoteIndex = someValue.indexOf(DOUBLE_QUOTE);
                if (firstSingleQuoteIndex >= 0 || firstDoubleQuoteIndex >= 0) {
                    if (firstSingleQuoteIndex < 0) {
                        return SINGLE_QUOTE;
                    }
                    if (firstDoubleQuoteIndex < 0) {
                        return DOUBLE_QUOTE;
                    }
                    if (firstSingleQuoteIndex < firstDoubleQuoteIndex) {
                        return DOUBLE_QUOTE;
                    } else {
                        return SINGLE_QUOTE;
                    }
                }
                return DOUBLE_QUOTE;
            }

            /**
             * Transforms an optgroup representation to its HTML equivalent
             * @param {OptgroupRep} optgroupRep - the optgroup representation
             * @return {string} - the optgroup HTML
             */
            function toOptgroupHtml(optgroupRep) {
                /** @type {string} */
                var htmlContent = "<optgroup label=";
                /** @type {string} */
                var quote = chooseQuotes(optgroupRep.label);
                htmlContent += quote + escapeHtml(optgroupRep.label) + quote + ">";
                /** @type {number} */
                var optionCount = optgroupRep.contents.length;
                for (/** @type {number} */var i = 0; i < optionCount; i++) {
                    htmlContent += toOptionHtml(optgroupRep.contents[i]);
                }
                htmlContent += "</optgroup>";
                return htmlContent;
            }

            /**
             * Moves items using the undo/redo memory.
             * @param {Multiselect} msInstance - the Multiselect instance
             * @param {boolean} isUndo - if the action is undo or redo (changes the stack movement)
             */
            function moveAndChangeStacks(msInstance, isUndo) {
                /** @type {Stack} */
                var sourceStack = isUndo ? msInstance.undoStack : msInstance.redoStack;
                /** @type {Stack} */
                var targetStack = isUndo ? msInstance.redoStack : msInstance.undoStack;
                /** @type {StackElement} */
                var last = sourceStack.pop();
                if ( last ) {
                    targetStack.push(last);
                    /** @type {jQuery} */
                    var newSource = isUndo ? last.$lastDestination : last.$lastSource;
                    /** @type {jQuery} */
                    var newDestination = isUndo ? last.$lastSource : last.$lastDestination;
                    msInstance.callbacks.move(newSource, newDestination, last.$movedOptions);
                }

            }

            /**
             * Moves the options up or down while activating the appropriate callbacks at the right time.
             * @param $options - the options to move inside the select
             * @param moveUp - whether we move up or down
             * @param beforeMoveCallback - the callback to use before movement
             * @param afterMoveCallback - the callback to use after movement
             * @returns {boolean} - true if options were moved
             */
            function moveItems($options, moveUp, beforeMoveCallback, afterMoveCallback) {
                if ( !beforeMoveCallback( $options ) ) {
                    return false;
                }
                if (!moveUp) {
                    $options = $($options.get().reverse());
                }
                $options.each(function(i, optionToMove) {
                    /** @type {jQuery} */
                    var $option = $(optionToMove);
                    /** @type {jQuery} */
                    var $optionTarget = moveUp ? $option.prev() : $option.next();
                    if ($optionTarget.length > 0 && $options.filter($optionTarget).length == 0) {
                        if (moveUp) {
                            $optionTarget.before($option);
                        } else {
                            $optionTarget.after($option);
                        }
                    }
                });
                afterMoveCallback($options);
                return true;
            }

            /**
             * Sets the Multiselect instance for the select.
             * @param $select - the select that should contain this
             * @param msInstance - the instance for this select
             * @returns {jQuery} for chaining
             */
            function setInstance($select, msInstance) {
                if (!($select instanceof $)) {
                    return undefined;
                }
                $select.data(Multiselect.identifier, msInstance);
                return $select;
            }

            /**
             * Multiselect object constructor
             * @param {jQuery} $select - the initial left select, ID used when looking for default elements
             * @param {SettingsObject} settings - the settings for this Multiselect instance
             * @constructor
             */
            function Multiselect( $select, settings ) {
                verifySingleSelect($select);
                /** ID of the left select (used for defaults)
                 * @type {string} */
                var id = $select.prop('id');
                /** The left select of this instance
                 * @member {jQuery} */
                this.$left = $select;
                // $right can be more than one (multiple destinations) (then dblclick etc would not be usable
                /** One or more right side (destination) selects
                 * @member {jQuery} one or more select elements */
                this.$right = $();
                this.$right = chooseOption($(settings.right),$('#' + id + '_to'), "jQuery");
                if (!(this.$right instanceof $)) {
                    throw new Error("Something went wrong, the right elements should be jQuery objects, may be undefined.");
                }
                if (this.$right.length == 0) {
                    throw new Error("No right elements found, either settings wrong or default IDs not used in the page.");
                }
                if (this.$right.not("select").length > 0) {
                    throw new Error("Some found right element for the multiselect isn't a select element.");
                }
                /** Buttons used in this instance
                 * @member {ActionButtons} */
                this.actions = extractActionButtons(id, settings);
                if (this.$right.length == 1) {
                    setButtonContext(this.actions.$leftAll, "#" + this.$right.attr("id"));
                    setButtonContext(this.actions.$leftSelected, "#" + this.$right.attr("id"));
                    setButtonContext(this.actions.$rightSelected, "#" + this.$right.attr("id"));
                    setButtonContext(this.actions.$rightAll, "#" + this.$right.attr("id"));
                    setButtonContext(this.actions.$moveUp, "#" + this.$right.attr("id"));
                    setButtonContext(this.actions.$moveDown, "#" + this.$right.attr("id"));
                }
                validateActionButtons(this.actions);
                /** Active options for this instance
                 * @member {MultiselectOptions} */
                this.options = extractMultiselectOptions(settings);
                validateMultiselectOptions(this.options);
                /** Active callbacks for this instance
                 * @member {CallbackFunctions} */
                this.callbacks = extractCallbacks(settings);
                validateCallbacks(this.callbacks);
                // initialize the undo/redo functionality
                /** The undo stack for this instance.
                 * @member {Stack} */
                this.undoStack = [];
                /** The redo stack for this instance
                 * @member {Stack} */
                this.redoStack = [];

                if (this.options.search) {
                    // Prepend left filter above left palette
                    if (this.options.search.left) {
                        /** @member {FilterRelation} */
                        this.leftSearch = prependSearchFilter(this.$left, this.options.search.left, this.$left);
                    }
                    // Prepend right filter above the first right palette
                    if (this.options.search.right) {
                        /** @member {FilterRelation} */
                        this.rightSearch = prependSearchFilter(this.$right.first(), this.options.search.right, this.$right);
                    }
                }
                // FIXME: keepRendering + options on any right side breaks sorting
                // if (this.options.keepRenderingFor !== KeepInitialPositionFor.NONE && this.$right.find("option").length > 0) {
                //     throw new Error("Multiselect can't index the items properly if any are on the right side at the beginning.");
                // }
                // Create event listeners
                prepareEvents(this);
                this.init();
            }

            // public static members
            /** This can be used to retrieve a multiselect instance.
             * @type {string} */
            Multiselect.identifier = "crlcu.multiselect";
            /**
             * Enum for what we want to keep the option order for.
             * @readonly
             * @enum {string} KeepInitialPositionFor
             */
            Multiselect.KeepInitialPositionFor = {
                ALL: "ALL",
                OPTGROUPS: "OPTGROUPS",
                NONE: "NONE"
            };

            /** Default settings object
             * @type {object} */
            Multiselect.defaults = {
                /** Default options
                 * @type {MultiselectOptions} */
                options: {
                    keepRenderingFor: Multiselect.KeepInitialPositionFor.ALL,
                    submitAllLeft: true,
                    submitAllRight: true,
                    search: {},
                    // FIXME: ignoreDisabled is not documented online
                    ignoreDisabled: false,
                    // FIXME: matchOptgroupBy is not documented online
                    matchOptgroupBy: 'label'
                },
                /** Default callbacks
                 * @type {CallbackFunctions} */
                callbacks: {
                    /** will be executed once - remove from $left all options that are already in $right
                     *
                     *  @method startUp
                     *  @attribute $left jQuery object
                     *  @attribute $right jQuery object
                     **/
                    startUp: removeDuplicateOptions,

                    /** will be executed each time before moving option[s] to right
                     *
                     *  IMPORTANT : this method must return boolean value
                     *      true    : continue to move method
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
                     *      true    : continue to move method
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

                    /**  will be executed each time after moving option[s] to left
                     *
                     *  @method afterMoveToLeft
                     *  @attribute $left jQuery object
                     *  @attribute $right jQuery object
                     *  @attribute $options HTML object (the option[s] which was selected to be moved)
                     **/
                    afterMoveToLeft: function($left, $right, $options) {},
                    /** will be executed instead of the default move function
                     * @method move
                     * @attribute $source - the source of the moved options
                     * @attribute $destination - the destination to move the options to
                     * @attribute $options - the options to move
                     */
                    move: moveFromAtoB,
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

                    /**  will be executed each time after moving option[s] down
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

                    /**  will tell if the search can start
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

            // public static functions
            /**
             * Retrieves the Multiselect instance given a select element.
             * @param $select - the select containing the Multiselect instance.
             * @returns {Multiselect} the instance
             */
            Multiselect.getInstance = function($select) {
                if (!($select instanceof $)) {
                    return undefined;
                }
                return $select.data(Multiselect.identifier);
            };

            /**
             * Checks if the select has a Multiselect.
             * @param $select - the select to check
             * @returns {boolean} - true, if the select has a Multiselect instance
             */
            Multiselect.isMultiselect = function($select) {
                return (Multiselect.getInstance($select) instanceof Multiselect);
            };

            /**
             * Creates a Multiselect instance with a given select and the given settings
             * @param $select - the select to use for the instance
             * @param settings - the settings object for this instance
             * @returns {Multiselect} - the created instance
             */
            Multiselect.create = function($select, settings) {
                verifySingleSelect($select);
                if (!Multiselect.isMultiselect($select)) {
                    /** @type {SettingsObject} */
                    var concreteSettings = $.extend(
                        {},
                        Multiselect.defaults.callbacks,
                        $select.data(),
                        (typeof settings === 'object' && settings)
                    );
                    /** @type {Multiselect} */
                    var createdMultiselect = new Multiselect($select, concreteSettings);
                    setInstance($select, createdMultiselect);
                    return createdMultiselect;
                } else {
                    return Multiselect.getInstance($select);
                }
            };

            Multiselect.prototype = {
                // public instance methods
                /**
                 * Initializes the instance (stacks, initial positions, startUp, sorting, filters)
                 * @type {function}
                 */
                init: function() {
                    /** @type {Multiselect} */
                    var self = this;
                    // clear the stacks
                    self.undoStack = [];
                    self.redoStack = [];
                    // decorate the options with their initial positions in the list so that it can be re-established
                    storeRenderingSortOrder(self.$left, self.options.keepRenderingFor);

                    // FIXME: Each side has independent ordering with this, so moving breaks everything
                    self.$right.each(function(i, select) {
                        storeRenderingSortOrder($(select), self.options.keepRenderingFor);
                    });

                    // startUp could be a function or false
                    // either the default is used or the function; false doesn't amount to anything
                    // startUp preprocessing function
                    self.callbacks.startUp( self.$left, self.$right );

                    // initial sort if necessary
                    //noinspection JSValidateTypes
                    if (self.options.keepRenderingFor !== Multiselect.KeepInitialPositionFor.ALL && self.callbacks.sort) {
                        // sort seems to be a comparator function, not a sorting function
                        sortSelectItems(self.$left, self.callbacks.sort, self.options.keepRenderingFor);

                        // here we acknowledge that we could have multiple right elements
                        self.$right.each(function(i, select) {
                            sortSelectItems($(select), self.callbacks.sort, self.options.keepRenderingFor);
                        });
                    }
                    self.clearFilters();
                },

                /**
                 * Clears all search input fields
                 */
                clearFilters: function() {
                    /** @type {FilterRelation[]} */
                    var searchesToClear = [this.leftSearch, this.rightSearch];
                    $.each(searchesToClear, function(index, value) {
                        if (value) value.$filterInput.val("").keyup();
                    });
                },
                /**
                 * Completely empties the instance
                 */
                empty: function() {
                    this.$left.empty();
                    this.$right.empty();
                    //FIXME: Also empty stacks?
                },
                /**
                 * Replaces the content of the Multiselect with the given content.
                 * Puts all on the left side
                 * @param {SelectContent} newOptions
                 */
                replaceItems: function(newOptions) {
                    this.empty();
                    /** @type {string} */
                    var contentHtml = toContentHtml(newOptions);
                    this.$left.append(contentHtml);
                    this.init();
                },

                /**
                 * Moves selected options up
                 * @param $options - options to move
                 */
                moveUp: function($options) {
                    moveItems($options, true, this.callbacks.beforeMoveUp, this.callbacks.afterMoveUp);
                },

                /**
                 * Moves selected options down
                 * @param $options - options to move
                 */
                moveDown: function($options) {
                    moveItems($options, false, this.callbacks.beforeMoveDown, this.callbacks.afterMoveDown);
                },

                /**
                 * Undoes the last move operation
                 * @param e - some triggered event
                 */
                undo: function(e) {
                    e.preventDefault();
                    moveAndChangeStacks(this, true);
                },

                /**
                 * Redoes the last undone move operation
                 * @param e - some triggered event
                 */
                redo: function(e) {
                    e.preventDefault();
                    moveAndChangeStacks(this, false);
                }
            };
            // TODO: Perhaps don't add the class to jQuery if it is used as an AMD module (or other?)
            $.Multiselect = Multiselect;
            return Multiselect;
        })($);

        /**
         * jQuery extension for creating Multiselect instances.
         * @param {SettingsObject} options - options for the multiselect instance.
         * @returns {jQuery} - the elements used
         */
        $.fn.multiselect = function( options ) {
            return this.each(function() {
                Multiselect.create($(this), options);
            });
        };

        /**
         * Custom jQuery selector :search for filtering
         * @param elem - the elem currently looked at
         * @param index - the index of the element looked at
         * @param meta - some additional options?
         * @returns {Array|{index: number, input: string}}
         */
        $.expr[":"].search = function(elem, index, meta) {
            /** @type {string} */
            var filterValue = meta[3];
            /** @type {RegExp} */
            var regex = new RegExp(filterValue, "i");

            return $(elem).text().match(regex);
        }
    })
)