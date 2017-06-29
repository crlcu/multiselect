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
 * @property {RenderingOptions} [keepRenderingFor=ALL] - what to keep the rendering order for
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
                    selector = Multiselect.defaults.actionSelector(id, actionName);
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
             * @param {ActionButtons} actions
             */
            function validateActionButtons(actions) {
                // FIXME: Which are required action buttons? Should we error if we can't init them?
                // FIXME: Do we want to allow multiple elements to be buttons for a function?
            }

            /**
             * Extracts the options for the multiselect instance
             * @param {SettingsObject} settings
             * @returns {MultiselectOptions}
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
             * @param {MultiselectOptions} options
             */
            function validateMultiselectOptions(options) {
                // FIXME: Validation criteria for options
            }

            /**
             * Extracts the callbacks for the multiselect instance
             * @param {SettingsObject} settings
             */
            function extractCallbacks(settings) {
                return {
                    startUp: chooseCallback(settings.startUp, Multiselect.defaults.callbacks.startUp),
                    sort: chooseCallback(settings.sort, Multiselect.defaults.callbacks.sort),
                    beforeMoveToRight: chooseCallback(settings.beforeMoveToRight, Multiselect.defaults.callbacks.beforeMoveToRight),
                    afterMoveToRight: chooseCallback(settings.afterMoveToRight, Multiselect.defaults.callbacks.afterMoveToRight),
                    beforeMoveToLeft: chooseCallback(settings.beforeMoveToLeft, Multiselect.defaults.callbacks.beforeMoveToLeft),
                    afterMoveToLeft: chooseCallback(settings.afterMoveToLeft, Multiselect.defaults.callbacks.afterMoveToLeft),
                    beforeMoveUp: chooseCallback(settings.beforeMoveUp, Multiselect.defaults.callbacks.beforeMoveUp),
                    afterMoveUp: chooseCallback(settings.afterMoveUp, Multiselect.defaults.callbacks.afterMoveUp),
                    beforeMoveDown: chooseCallback(settings.beforeMoveDown, Multiselect.defaults.callbacks.beforeMoveDown),
                    afterMoveDown: chooseCallback(settings.afterMoveDown, Multiselect.defaults.callbacks.afterMoveDown),
                    fireSearch: chooseCallback(settings.fireSearch, Multiselect.defaults.callbacks.fireSearch)
                };
            }

            /**
             * This should ensure the callbacks fulfill some required conditions
             * (e.g. moveFromAToB is allowed to be undefined)
             * @param {CallbackFunctions} callbacks
             */
            function validateCallbacks(callbacks) {
                // FIXME: Validation criteria for callbacks
            }

            /**
             * Convenience function to choose a callback function between user provided and default values.
             * @param userCallback - the callback provided by the user
             * @param defaultCallback - the default callback
             * @returns {function}
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
                var ua = window.navigator.userAgent;
                return (ua.toLowerCase().indexOf(USER_AGENT_SAFARI) > -1);
            }

            /**
             * This provides lexicographic comparison of two options or optgroups,
             * i.e. the only relevant elements in the multiselect.
             * @param a - the first element
             * @param b - the second element
             * @returns {COMPARISON_RESULTS} - the result of the comparison
             */
            function lexicographicComparison(a, b) {
                // Elements beginning with "NA"
                // are sorted first, e.g. "NAME1" before "Item 1"?
                // compare options by their innnerHtml
                var aText = getOptionOrOptgroupText(a);
                var bText = getOptionOrOptgroupText(b);
                if (aText == null || bText == null) {
                    return COMPARISON_RESULTS.DO_NOT_CHANGE;
                }
                // lexicographic comparison between strings (compare chars at same index)
                // e.g. 100 < 99
                // e.g. abc100 < abc99
                // e.g. aaa < bbb
                return (aText < bText) ? COMPARISON_RESULTS.A_COMES_FIRST : COMPARISON_RESULTS.B_COMES_FIRST;
            }

            function getOptionOrOptgroupText(optionOrOptgroup) {
                var type = optionOrOptgroup.tagName;
                if (type == "OPTION") {
                    return optionOrOptgroup.innerHTML;
                }
                if (type == "OPTGROUP") {
                    return optionOrOptgroup.label;
                }
                return null;
            }

            function initialOrderComparison(a, b) {
                var aPositionIndex = getInitialPosition($(a));
                var bPositionIndex = getInitialPosition($(b));
                if (aPositionIndex !== null && bPositionIndex !== null) {
                    return aPositionIndex < bPositionIndex ? A_COMES_FIRST : B_COMES_FIRST;
                }
                // If anything is unclear, do not change positions
                return 0;
            }

            function getInitialPosition($optionOrOptgroup) {
                if ($optionOrOptgroup !== undefined && $optionOrOptgroup.is("option,optgroup")) {
                    return $optionOrOptgroup.data(DATA_POSITION);
                }
                return null;
            }

            function setInitialPosition($optionOrOptgroup, newPosition) {
                if ($optionOrOptgroup !== undefined && $optionOrOptgroup.is("option,optgroup")) {
                    $optionOrOptgroup.data(DATA_POSITION, newPosition);
                }
                return $optionOrOptgroup;
            }

            /**
             *
             * @param {jQuery} $targetSelect - the select element where the filter should be prepended
             * @param {string|jQuery} searchFilterHtmlOrElement - the html for the search filter or an existing jQuery element
             * @param {jQuery} $filteredSelects - the select elements that should be filtered with this input
             * @returns {FilterRelation}
             */
            function prependSearchFilter($targetSelect, searchFilterHtmlOrElement, $filteredSelects) {
                var $searchFilter = $();
                if (typeof searchFilterHtmlOrElement === "string") {
                    $searchFilter = $(searchFilterHtmlOrElement);
                    $targetSelect.before($searchFilter);
                } else if (searchFilterHtmlOrElement instanceof $) {
                    $searchFilter = searchFilterHtmlOrElement;
                }
                return {
                    $filterInput: $searchFilter,
                    $filteredSelects: $filteredSelects
                };
            }

            function oldFilterOptions($filterValue, $select) {
                // options to show
                extendedShow($select.find('option:search("' + $filterValue + '")'));
                // options to hide
                extendedHide($select.find('option:not(:search("' + $filterValue + '"))'));
                // optgroups to hide
                extendedHide($select.find('option.hidden').parent('optgroup').not($(":visible").parent()));
                // optgroups to show
                extendedShow($select.find('option:not(.hidden)').parent('optgroup'));
            }

            function applyFilter($filterValue, $selectsToFilter) {
                if ($filterValue === undefined || $filterValue == "") {
                    removeFilter($selectsToFilter);
                }
                var $allOptions = $selectsToFilter.find("option");
                var $prevHiddenOptions = $allOptions.filter(SELECTOR_HIDDEN);
                var $matchingOptions = $allOptions.filter(':search("' + $filterValue + '")');
                var $allOptgroups = $selectsToFilter.children("optgroup");
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
            }

            function removeFilter($selects) {
                extendedShow($selects.find('option, optgroup'));
            }

            function measurePerformance(startTimestamp, feature) {
                var endTimestamp = performance.now();
                var timeSpent = endTimestamp - startTimestamp;
                console.log("Measuring " + feature + ": " + timeSpent);
            }

            function getOptionsToMove($select, onlySelected) {
                if (onlySelected === undefined) {
                    onlySelected = true;
                }
                // FIXME: Unsure if this is good, as I could define and use my own hidden class
                var $allVisibleOptions = $select.find("option:not(" + SELECTOR_HIDDEN + ")");
                if (onlySelected) {
                    return $allVisibleOptions.filter(":selected");
                } else {
                    return $allVisibleOptions;
                }
            }

            function removeDuplicateOptions($left, $right) {
                $right.find('option').each(function(index, rightOption) {
                    var $rightOption = $(rightOption);
                    var $parentOptgroup = $rightOption.parent("optgroup");
                    var duplicateOptionSelector = 'option[value="' + rightOption.value + '"]';
                    // FIXME: What about matchOptgroupBy? Shouldn't it be respected here?
                    if ($parentOptgroup.length > 0) {
                        var sameOptgroupSelector = 'optgroup[label="' + $parentOptgroup.attr('label') + '"]';
                        var $sameOptgroup = $left.find(sameOptgroupSelector);
                        if ($sameOptgroup.length > 0) {
                            $sameOptgroup.find(duplicateOptionSelector).each(function(index, duplicateOption) {
                                duplicateOption.remove();
                            });
                            removeIfEmpty($sameOptgroup);
                        }
                    } else {
                        var $option = $left.find(duplicateOptionSelector);
                        $option.remove();
                    }
                });
            }

            // append options
            // then set the selected attribute to false
            function moveOptionsTo($targetSelect, $options) {
                $targetSelect
                    .append($options)
                    .find('option')
                    .prop('selected', false);

                return $targetSelect;
            }

            function removeIfEmpty($elements) {
                $elements.each(function(i, element) {
                    var $element = $(element);
                    if (!$element.children().length) {
                        $element.remove();
                    }
                });

                return $elements;
            }

            function extendedShow($elements) {
                $elements.removeClass(CSS_HIDDEN).show();
                // FIXME: This would be probably be better using feature based checks (Modernizr etc.)
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
            }

            function extendedHide($elements) {
                $elements.addClass(CSS_HIDDEN).hide();
                // FIXME: This would be probably be better using feature based checks (Modernizr etc.)
                if (isMS || isSafari) {
                    $elements.each(function(index, element) {
                        var $option = $(element);
                        // Wrap with <span> to make it compatible with IE
                        if(!$option.parent().is('span')) {
                            $option.wrap('<span></span>').hide();
                        }
                    });
                }

                return $elements;
            }

            /**
             *
             * @param {jQuery} $select
             * @param {function} comparatorCallback
             * @param {RenderingOptions} keepRenderingFor
             * @returns {jQuery} - the select that was sorted
             */
            function sortSelectItems($select, comparatorCallback, keepRenderingFor) {
                if (isOnlySelects($select)) {
                    // sort any direct children (can be combination of options and optgroups)
                    // example: oa="aaa", ob="bbb", oc="zzz", oga="ddd", ogb="eee"
                    if (keepRenderingFor !== Multiselect.RenderingOptions.NONE) {
                        // Different approach, as following order would be possible: oa, ob, og1, og2, oc
                        var $elementsToSort = $select.children("optgroup");
                        if (keepRenderingFor === Multiselect.RenderingOptions.ALL) {
                            $elementsToSort = $elementsToSort.add($select.children("option"));
                        }
                        $elementsToSort.sort(initialOrderComparison).appendTo($select);

                        // check for optgroups, if none present we've already sorted everything
                        // if any, sort their children, i.e. all other previously unsorted options
                        if (keepRenderingFor === Multiselect.RenderingOptions.ALL) {
                            $select.find("optgroup").each(function(i, group) {
                                $(group).children().sort(initialOrderComparison).appendTo(group);
                            });
                        }
                    } else {
                        // TODO: How about allowing the user decide which in which order this is done?
                        // the options that are not in an optgroup come first
                        $select.children("option").sort(comparatorCallback).appendTo($select);
                        var $optgroups = $select.children("optgroup");
                        if ($optgroups.length > 0) {
                            // then sort the optgroups themselves, if any are there
                            $optgroups.sort(comparatorCallback).appendTo($select);
                            // then sort their options
                            $optgroups.each(function(i, optgroup) {
                                $(optgroup).children().sort(comparatorCallback).appendTo(optgroup);
                            });
                        }
                    }
                    return $select;
                }
                return null;
            }

            /**
             * Stores the initial rendering order.
             * @param {jQuery} $select
             * @param {RenderingOptions} keepRenderingFor - whether to store position for some element types
             */
            function storeRenderingSortOrder($select, keepRenderingFor) {
                if (isOnlySelects($select)) {
                    // TODO: First remove the old order?
                    if (keepRenderingFor !== Multiselect.RenderingOptions.NONE) {
                        $select.children().each(function(index, optionOrOptgroup) {
                            var $optionOrOptgroup = $(optionOrOptgroup);
                            var isOptgroup = $optionOrOptgroup.is("optgroup");
                            if (isOptgroup && keepRenderingFor === Multiselect.RenderingOptions.ALL) {
                                $optionOrOptgroup.children().each(function(i, optgroupOption) {
                                    setInitialPosition($(optgroupOption), i);
                                });
                            }
                            if (isOptgroup || keepRenderingFor === Multiselect.RenderingOptions.ALL) {
                                setInitialPosition($optionOrOptgroup, index);
                            }
                        });
                    }
                }
            }

            function isOnlySelects($elems) {
                if ($elems instanceof $) {
                    if ($elems.length > 0 && $elems.is("select")) {
                        return true;
                    }
                }
                return false;
            }

            function verifySingleSelect($select) {
                if (!isOnlySelects($select) || $select.length !== 1) {
                    throw new Error("A single Multiselect requires a single jQuery select element for the left side.");
                }
            }

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

            function getButtonContext($msButton) {
                // FIXME: Probably more checking necessary
                return $($msButton.data(DATA_CONTEXT));
            }

            function setButtonContext($msButton, newSelector) {
                // FIXME: Probably more checking necessary
                if ($msButton) {
                    $msButton.data(DATA_CONTEXT, newSelector);
                }
            }

            function prepareEvents(msInstance) {
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

                    var $options = getOptionsToMove(self.$left);

                    if ( $options.length ) {
                        self.moveFromAtoB(self.$left, self.$right.first(), $options);
                    }
                });

                // Attach event for pushing ENTER on options from left side
                self.$left.keydown(function(e) {
                    if (e.keyCode === KEY_ENTER) {
                        e.preventDefault();

                        var $options = getOptionsToMove(self.$left);

                        if ( $options.length ) {
                            self.moveFromAtoB(self.$left, self.$right.first(), $options);
                        }
                    }
                });

                // Attach event for double clicking on options from right side
                self.$right.dblclick('option', function(e) {
                    e.preventDefault();

                    var $options = getOptionsToMove(self.$right);

                    if ( $options.length ) {
                        self.moveFromAtoB($(e.currentTarget), self.$left, $options);
                    }
                });

                // Attach event for pushing BACKSPACE or DEL on options from right side
                self.$right.keydown(function(e) {
                    if (e.keyCode === KEY_ENTER || e.keyCode === KEY_BACKSPACE || e.keyCode === KEY_DEL) {
                        e.preventDefault();

                        var $options = getOptionsToMove(self.$right);

                        if ( $options.length ) {
                            self.moveFromAtoB($(e.currentTarget), self.$left, $options);
                        }
                    }
                });

                // dblclick support for IE (need to deselect other palette)
                if (isMS) {
                    self.$left.dblclick(function() {
                        self.actions.$rightSelected.first().click();
                    });

                    self.$right.dblclick(function(e) {
                        var $activatedSelect = $(e.currentTarget);
                        var $options = getOptionsToMove($activatedSelect);
                        if ( $options.length ) {
                            self.moveFromAtoB($activatedSelect, self.$left, $options);
                        }
                    });
                }

                self.actions.$rightSelected.click(function(e) {
                    e.preventDefault();

                    var $options = getOptionsToMove(self.$left);

                    if ( $options.length ) {
                        var $rightButton = $(e.currentTarget);
                        var $targetSelect = getButtonContext($rightButton);
                        self.moveFromAtoB(self.$left, $targetSelect, $options);
                    }

                    $(this).blur();
                });

                self.actions.$leftSelected.click(function(e) {
                    e.preventDefault();

                    var $options = getOptionsToMove(self.$right);

                    if ( $options.length ) {
                        var $leftButton = $(e.currentTarget);
                        var $sourceSelect = getButtonContext($leftButton);
                        self.moveFromAtoB($sourceSelect, self.$left, $options);
                    }

                    $(this).blur();
                });

                self.actions.$rightAll.click(function(e) {
                    e.preventDefault();
                    var $options = getOptionsToMove(self.$left, false);

                    if ( $options.length ) {
                        var $rightButton = $(e.currentTarget);
                        var $targetSelect = getButtonContext($rightButton);
                        self.moveFromAtoB(self.$left, $targetSelect, $options);
                    }

                    $(this).blur();
                });

                self.actions.$leftAll.click(function(e) {
                    e.preventDefault();

                    var $options = getOptionsToMove(self.$right, false);

                    if ( $options.length ) {
                        var $leftButton = $(e.currentTarget);
                        var $sourceSelect = getButtonContext($leftButton);
                        self.moveFromAtoB($sourceSelect, self.$left, $options);
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

                    var $targetSelect = getButtonContext($(e.currentTarget));
                    var $options = getOptionsToMove($targetSelect);

                    if ( $options.length ) {
                        self.moveUp($options, e);
                    }

                    $(this).blur();
                });

                self.actions.$moveDown.click(function(e) {
                    e.preventDefault();

                    var $targetSelect = getButtonContext($(e.currentTarget));
                    var $options = getOptionsToMove($targetSelect);

                    if ( $options.length ) {
                        self.moveDown($options, e);
                    }

                    $(this).blur();
                });
            }

            /**
             *
             * @param {SelectContent} newItems
             */
            function toContentHtml(newItems) {
                var htmlContent = "";
                var grouplessOptionCount = newItems.options.length;

                for (var i = 0; i < grouplessOptionCount; i++) {
                    var option = newItems.options[i];
                    htmlContent += toOption(option);
                }
                var optgroupCount = newItems.optgroups.length;
                for (i = 0; i < optgroupCount; i++) {
                    var optgroup = newItems.optgroups[i];
                    htmlContent += toOptgroup(optgroup);
                }
                return htmlContent;
            }

            /**
             *
             * @param {OptionRep} optionRep
             */
            function toOption(optionRep) {
                var htmlContent = "<option value=";
                var quote = chooseQuotes(optionRep.value);
                htmlContent += quote + optionRep.value + quote + ">";
                htmlContent += optionRep.name;
                htmlContent += "</option>";
                return htmlContent;
            }

            function chooseQuotes(someValue) {
                const SINGLE_QUOTE = "'";
                const DOUBLE_QUOTE = '"';
                if (typeof someValue === "number") {
                    someValue = someValue.toString();
                } else if (someValue === "") {
                    return DOUBLE_QUOTE;
                }

                var firstSingleQuoteIndex = someValue.indexOf(SINGLE_QUOTE);
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
             *
             * @param {OptgroupRep} optgroupRep
             */
            function toOptgroup(optgroupRep) {
                var htmlContent = "<optgroup label=";
                var quote = chooseQuotes(optgroupRep.label);
                htmlContent += quote + optgroupRep.label + quote + ">";
                var optionCount = optgroupRep.contents.length;
                for (var i = 0; i < optionCount; i++) {
                    htmlContent += toOption(optgroupRep.contents[i]);
                }
                htmlContent += "</optgroup>";
                return htmlContent;
            }

            /**
             *
             * @param {Multiselect} msInstance
             * @param {boolean} isUndo
             */
            function moveAndChangeStacks(msInstance, isUndo) {
                /** @type {StackElement} last */
                var sourceStack = isUndo ? msInstance.undoStack : msInstance.redoStack;
                var targetStack = isUndo ? msInstance.redoStack : msInstance.undoStack;
                var last = sourceStack.pop();
                if ( last ) {
                    targetStack.push(last);
                    var newSource = isUndo ? last.$lastDestination : last.$lastSource;
                    var newDestination = isUndo ? last.$lastSource : last.$lastDestination;
                    msInstance.moveFromAtoB(newSource, newDestination, last.$movedOptions, false, true);
                }

            }

            function moveItems($options, moveUp, beforeMoveCallback, afterMoveCallback) {
                if ( !beforeMoveCallback( $options ) ) {
                    return false;
                }
                if (moveDown) {
                    $options = $($options.get().reverse());
                }
                $options.each(function(i, optionToMove) {
                    var $option = $(optionToMove);
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

            }

            /**
             * Multiselect object constructor
             * @param {jQuery} $select
             * @param {SettingsObject} settings
             * @constructor
             */
            function Multiselect( $select, settings ) {
                verifySingleSelect($select);
                var id = $select.prop('id');
                /** @member {jQuery} */
                this.$left = $select;
                // $right can be more than one (multiple destinations) (then dblclick etc would not be usable
                /** @member {jQuery} one or more select elements */
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
                /** @member {ActionButtons} */
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
                /** @member {MultiselectOptions} */
                this.options = extractMultiselectOptions(settings);
                validateMultiselectOptions(this.options);
                /** @member {CallbackFunctions} */
                this.callbacks = extractCallbacks(settings);
                validateCallbacks(this.callbacks);

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
                // if (this.options.keepRenderingFor !== RenderingOptions.NONE && this.$right.find("option").length > 0) {
                //     throw new Error("Multiselect can't index the items properly if any are on the right side at the beginning.");
                // }
                // Create event listeners
                prepareEvents(this);
                this.init();
            }

            // public static members
            /** @type {string} This can be used to retrieve a multiselect instance.*/
            Multiselect.identifier = "crlcu.multiselect";
            /**
             * Enum for what we want to keep the option order for.
             * @readonly
             * @enum {string} RenderingOptions
             */
            Multiselect.RenderingOptions = {
                ALL: "ALL",
                OPTGROUPS: "OPTGROUPS",
                NONE: "NONE"
            };

            Multiselect.defaults = {
                actionSelector: function(id, action) {
                    return "#" + id + "_" + action;
                },
                options: {
                    keepRenderingFor: Multiselect.RenderingOptions.ALL,
                    submitAllLeft: true,
                    submitAllRight: true,
                    search: {},
                    // FIXME: ignoreDisabled is not documented online
                    ignoreDisabled: false,
                    // FIXME: matchOptgroupBy is not documented online
                    matchOptgroupBy: 'label'
                },
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
                     *      true    : continue to moveFromAToB method
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
                     *      true    : continue to moveFromAToB method
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

            // public static functions
            Multiselect.getInstance = function($select) {
                if (!($select instanceof $)) {
                    return undefined;
                }
                return $select.data(Multiselect.identifier);
            };

            Multiselect.setInstance = function($select, msInstance) {
                if (!($select instanceof $)) {
                    return undefined;
                }
                $select.data(Multiselect.identifier, msInstance);
            };

            Multiselect.isMultiselect = function($select) {
                return (Multiselect.getInstance($select) instanceof Multiselect);
            };

            Multiselect.create = function($select, options) {
                verifySingleSelect($select);
                if (!Multiselect.isMultiselect($select)) {
                    var concreteSettings = $.extend(
                        {},
                        Multiselect.defaults.callbacks,
                        $select.data(),
                        (typeof options === 'object' && options)
                    );
                    var createdMultiselect = new Multiselect($select, concreteSettings);
                    Multiselect.setInstance($select, createdMultiselect);
                }
            };

            Multiselect.prototype = {
                // public instance methods
                init: function() {
                    var self = this;
                    // initialize the undo/redo functionality
                    /** @type{Stack} self.undoStack */
                    self.undoStack = [];
                    /** @member {Stack} */
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
                    if (self.options.keepRenderingFor !== Multiselect.RenderingOptions.ALL && self.callbacks.sort) {
                        // sort seems to be a comparator function, not a sorting function
                        sortSelectItems(self.$left, self.callbacks.sort, self.options.keepRenderingFor);

                        // here we acknowledge that we could have multiple right elements
                        self.$right.each(function(i, select) {
                            sortSelectItems($(select), self.callbacks.sort, self.options.keepRenderingFor);
                        });
                    }
                    self.clearFilters();
                },

                clearFilters: function() {
                    var searchesToClear = [this.leftSearch, this.rightSearch];
                    $.each(searchesToClear, function(index, value) {
                        if (value) value.$filterInput.val("").keyup();
                    });
                },
                empty: function() {
                    this.$left.empty();
                    this.$right.empty();
                },
                /**
                 *
                 * @param {SelectContent} newOptions
                 */
                replaceItems: function(newOptions) {
                    this.empty();
                    var contentHtml = toContentHtml(newOptions);
                    this.$left.append(contentHtml);
                    this.init();
                },

                moveFromAtoB: function( $source, $destination, $options, silent, skipStack) {
                    if (skipStack === "undefined") {
                        skipStack = false;
                    }
                    if (silent === "undefined") {
                        silent = false;
                    }
                    var self = this;
                    var toLeftSide = ($destination === self.$left);
                    if (!silent) {
                        var beforeCallback = (toLeftSide ? self.callbacks.beforeMoveToLeft : self.callbacks.beforeMoveToRight);
                        if (!beforeCallback(self.$left, self.$right, $options)) {
                            return false;
                        }
                    }

                    var $changedOptgroups = $();
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
                    if ($changedOptgroups.length > 0) {
                        removeIfEmpty($changedOptgroups);
                    }
                    if (!skipStack) {
                        /** @type {StackElement} stackElement */
                        var stackElement = {
                            $lastSource: $source,
                            $lastDestination: $destination,
                            $movedOptions: $options
                        };
                        self.undoStack.push(stackElement);
                        // TODO: Do we need memory management with the new stack?
                        self.redoStack = [];
                    }
                    sortSelectItems($destination, self.callbacks.sort, self.options.keepRenderingFor);
                    if (!silent) {
                        var afterCallback = (toLeftSide ? self.callbacks.afterMoveToLeft : self.callbacks.afterMoveToRight);
                        afterCallback( self.$left, self.$right, $options );
                    }
                    if (self.options.search) {
                        var filterToClear = toLeftSide ? self.leftSearch.$filterInput : self.rightSearch.$filterInput;
                        filterToClear.val("").keyup();
                    }
                    return self;
                },

                moveUp: function($options) {
                    moveItems($options, true, self.callbacks.beforeMoveUp, self.callbacks.afterMoveUp);
                },

                moveDown: function($options) {
                    moveItems($options, false, self.callbacks.beforeMoveDown, self.callbacks.afterMoveDown);
                },

                undo: function(e) {
                    e.preventDefault();
                    moveAndChangeStacks(this, true);
                },

                redo: function(e) {
                    e.preventDefault();
                    moveAndChangeStacks(this, false);
                }
            };
            // TODO: Perhaps don't add the class to jQuery if it is used as an AMD module (or other?)
            $.Multiselect = Multiselect;
            return Multiselect;
        })($);

        // with this, you can get the Multiselect instance...
        $.fn.multiselect = function( options ) {
            return this.each(function() {
                Multiselect.create($(this), options);
            });
        };

        // this is the custom jQuery selector :search used when filtering
        $.expr[":"].search = function(elem, index, meta) {
            var regex = new RegExp(meta[3], "i");

            return $(elem).text().match(regex);
        }
    })
);