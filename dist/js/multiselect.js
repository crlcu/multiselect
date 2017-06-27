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
 * @property {RenderingOptions} [keepRenderingFor=ALL] - what to keep the rendering order for
 * @property {boolean} [submitAllLeft=true] - whether to submit all visible left options when a form is submitted
 * @property {boolean} [submitAllRight=true] - whether to submit all visible right options when a form is submitted
 * @property {SearchElements} [search] - the meta information used in the search elements
 * @property {boolean} [ignoreDisabled=false] - whether to ignore disabled options when moving
 * @property {string} [matchOptgroupBy='label'] - Which html attribute should be compared against when filtering
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
 * @typedef {Object} FilterRelation
 * @property {jQuery} $filterInput - the input that you enter text in so that the select is filtered
 * @property {jQuery} $filteredSelects - the select elements filtered by the input (currently always all right elements)
 */

/**
 * @typedef {Object} MoveRelation
 * @property {jQuery} $moveButton
 */

/**
 * @typedef {Object} StackElement
 * @property {jQuery} $source - the element where the options were before the move
 * @property {jQuery} $target - the element where the options were after the move
 * @property {jQuery} $options - which options were moved
 */

/**
 * @typedef {CallbackFunctions|ElementNames|MultiselectOptions} SettingsObject
 */
// FIXME: Move, keepRendering more options, replace options
// FIXME: Check if everything works when we use multiple destinations ("right" elements)
// FIXME: Provide a switch to tell what part of the select content should be sorted and what shouldn't
// FIXME: Provide a way to replace the options
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
         * @module
         */
        var Multiselect = (function($) {

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

            const A_COMES_FIRST = -1;

            const B_COMES_FIRST = 1;

            const DO_NOT_CHANGE = 0;

            const DATA_POSITION = "position";

            var isMS = isMicrosoftBrowser();

            var isSafari = isSafariBrowser();

            /**
             * Given the settings and the name for an action, looks if the settings contain the selector for the
             * action. If not, it creates its own selector using the action and the id of the left palette.
             * @param id - the id part to look for if
             * @param {ElementNames} settings
             * @param actionName
             */
            function getActionButton(id, settings, actionName) {
                var selector = "";
                if (settings[actionName]) {
                    selector = settings[actionName];
                } else {
                    selector = Multiselect.defaults.actionSelector(id, actionName);
                }
                return $(selector);
            }

            /**
             *
             * @param {string} id - id of the element for the left palette
             * @param {ElementNames} settings
             * @returns {ActionButtons}
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
             * Extracts the options for the multiselect object
             * @param {SettingsObject} settings
             * @returns {MultiselectOptions}
             */
            function extractMultiselectOptions(settings) {
                return {
                    keepRenderingSort:  chooseOption(settings.keepRenderingSort, Multiselect.defaults.options.keepRenderingSort, "boolean"),
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
             *
             * @param {SettingsObject} settings
             */
            function extractCallbacks(settings) {
                return {
                    startUp: chooseCallback(settings.startUp, Multiselect.defaults.callbacks.startUp),
                    sort: chooseCallback(settings.sort, Multiselect.defaults.callbacks.sort),
                    beforeMoveToRight: chooseCallback(settings.beforeMoveToRight, Multiselect.defaults.callbacks.beforeMoveToRight),
                    moveToRight: chooseCallback(settings.moveToRight, Multiselect.defaults.callbacks.moveToRight),
                    afterMoveToRight: chooseCallback(settings.afterMoveToRight, Multiselect.defaults.callbacks.afterMoveToRight),
                    beforeMoveToLeft: chooseCallback(settings.beforeMoveToLeft, Multiselect.defaults.callbacks.beforeMoveToLeft),
                    moveToLeft: chooseCallback(settings.moveToLeft, Multiselect.defaults.callbacks.moveToLeft),
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
             * (e.g. moveToRight is allowed to be undefined)
             * @param {CallbackFunctions} callbacks
             */
            function validateCallbacks(callbacks) {
                // FIXME: Validation criteria for callbacks
            }

            function chooseCallback(userCallback, defaultCallback) {
                return chooseOption(userCallback, defaultCallback, "function");
            }

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

            function isMicrosoftBrowser() {
                var ua = window.navigator.userAgent;
                return ( ua.indexOf(USER_AGENT_IE_UPTO_10) > -1 ||
                    ua.indexOf(USER_AGENT_IE_11) > -1 ||
                    ua.indexOf(USER_AGENT_EDGE) > -1
                );
            }

            function isSafariBrowser() {
                var ua = window.navigator.userAgent;
                return (ua.toLowerCase().indexOf(USER_AGENT_SAFARI) > -1);
            }

            // this only works with options, innerHtml of an option is its text
            // innerHtml of an optgroup is full inside html code + options + their values
            function lexicographicComparison(a, b) {
                // Elements beginning with "NA"
                // are sorted first, e.g. "NAME1" before "Item 1"?
                // compare options by their innnerHtml
                var aText = getOptionOrOptgroupText(a);
                var bText = getOptionOrOptgroupText(b);
                if (aText == null || bText == null) {
                    return DO_NOT_CHANGE;
                }
                // lexicographic comparison between strings (compare chars at same index)
                // e.g. 100 < 99
                // e.g. abc100 < abc99
                // e.g. aaa < bbb
                return (aText < bText) ? A_COMES_FIRST : B_COMES_FIRST;
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

            function renderingSortComparison(a, b) {
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
                    // FIXME: What about matchOptgroupBy?
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
                if ($select !== undefined && $select.is("select")) {
                    // sort any direct children (can be combination of options and optgroups)
                    // example: oa="aaa", ob="bbb", oc="zzz", oga="ddd", ogb="eee"
                    if (keepRenderingFor !== Multiselect.RenderingOptions.NONE) {
                        // Different approach, as following order would be possible: oa, ob, og1, og2, oc
                        var $elementsToSort = $select.children("optgroup");
                        if (keepRenderingFor === Multiselect.RenderingOptions.ALL) {
                            $elementsToSort = $elementsToSort.add($select.children("option"));
                        }
                        $elementsToSort.sort(renderingSortComparison).appendTo($select);

                        // check for optgroups, if none present we've already sorted everything
                        // if any, sort their children, i.e. all other previously unsorted options
                        if (keepRenderingFor === Multiselect.RenderingOptions.ALL) {
                            $select.find("optgroup").each(function(i, group) {
                                $(group).children().sort(renderingSortComparison).appendTo(group);
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
                if ($select instanceof $ && $select.is("select")) {
                    if (keepRenderingFor !== Multiselect.RenderingOptions.NONE) {
                        // FIXME: Check if this is ok, optgroups start at 0, and options in each group start at 0
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

            /**
             * Multiselect object constructor
             * @param {jQuery} $select
             * @param {SettingsObject} settings
             * @constructor
             */
            function Multiselect( $select, settings ) {
                if (!($select instanceof $) || $select.length !== 1 || !$select.is("select")) {
                    throw new Error("A single Multiselect requires a single jQuery select element for the left side.");
                }
                var id = $select.prop('id');
                /** @member {jQuery} */
                this.$left = $select;
                // TODO: Would be cool for performance reasons if there was a way to dynamically update the options so that you don't have to find all options first
                // $right can be more than one (multiple destinations) (then dblclick etc would not be usable
                // FIXME: switch to indicate we have more than one "right" for ambiguous actions?
                /** @member {jQuery} one or more select elements */
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
                validateActionButtons(this.actions);
                /** @member {MultiselectOptions} */
                this.options = extractMultiselectOptions(settings);
                validateMultiselectOptions(this.options);
                /** @member {CallbackFunctions} */
                this.callbacks = extractCallbacks(settings);
                validateCallbacks(this.callbacks);

                // FIXME: Check if this would be avoidable
                // FIXME: Check if we can do a union of the options in the multiselect and then index the options appropriately
                // if (this.options.keepRenderingSort && this.$right.find("option").length > 0) {
                //     throw new Error("Multiselect can't index the items properly if any are on the right side at the beginning.");
                // }
                this.init();
            }
            // FIXME: If we don't want to expose this class to the outside, i.e. never call it, can we prevent this?

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
                    keepRenderingSort: false,
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

                    /*  will be executed instead of the default action
                     * (move selected items from left to right palette)
                     *
                     *  @method moveToRight
                     *  @attribute {jQuery} $options HTML object (the option[s] which was selected to be moved)
                     *  @attribute {object} event - the event that initialised the action
                     *  @attribute {boolean} silent - that tells if you have to trigger beforeMoveToRight and afterMoveToRight
                     *  @attribute {boolean} skipStack - that tells if you have to handle the undo/redo stack
                     *  @return {object} the Multiselect object
                     **/
                    moveToRight: undefined,
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

                    /*  will be executed instead of the default action
                     * (move selected items from right to left palette)
                     *
                     *  @method moveToLeft
                     *  @attribute $right jQuery object
                     *  @attribute {jQuery} $options HTML object (the option[s] which was selected to be moved)
                     *  @attribute {object} event - the event that initialised the action
                     *  @attribute {boolean} silent - that tells if you have to trigger beforeMoveToLeft and afterMoveToLeft
                     *  @attribute {boolean} skipStack - that tells if you have to handle the undo/redo stack
                     *  @return {object} the Multiselect object
                     **/
                    moveToLeft: undefined,

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

            Multiselect.prototype = {
                init: function() {
                    var self = this;
                    // initialize the undo/redo functionality
                    /** @member {StackElement[]} */
                    self.undoStack = [];
                    /** @member {StackElement[]} */
                    self.redoStack = [];
                    if (self.options.keepRenderingSort) {
                        // decorate the options with their initial positions in the list so that it can be re-established
                        storeRenderingSortOrder(self.$left, self.options.keepRenderingFor);

                        // FIXME: This doesn't work so good, does it?
                        self.$right.each(function(i, select) {
                            storeRenderingSortOrder($(select), self.options.keepRenderingFor);
                        });
                    }

                    // startUp could be a function or false
                    // either the default is used or the function; false doesn't amount to anything
                    // startUp preprocessing function
                    // TODO: With an api, my startUp function could use that to move options around
                    self.callbacks.startUp( self.$left, self.$right );

                    // initial sort if necessary
                    if (self.options.keepRenderingFor !== self.RenderingOptions.ALL && self.callbacks.sort) {
                        // sort seems to be a comparator function, not a sorting function
                        sortSelectItems(self.$left, self.callbacks.sort, self.options.keepRenderingFor);

                        // here we acknowledge that we could have multiple right elements
                        self.$right.each(function(i, select) {
                            sortSelectItems($(select), self.callbacks.sort, self.options.keepRenderingFor);
                        });
                    }

                    if (self.options.search) {
                        // Prepend left filter above left palette
                        if (self.options.search.left) {
                            /** @member {FilterRelation} */
                            self.$leftSearch = prependSearchFilter(self.$left, self.options.search.left, self.$left);
                        }
                        // Prepend right filter above the first right palette
                        if (self.options.search.right) {
                            /** @member {FilterRelation} */
                            self.$rightSearch = prependSearchFilter(self.$right.first(), self.options.search.right, self.$right);
                        }
                    }

                    // Initialize events
                    self.events();
                },

                events: function() {
                    var self = this;

                    // Attach event to left filter
                    if (self.$leftSearch) {
                        self.$leftSearch.$filterInput.keyup(function() {
                            if (self.callbacks.fireSearch(this.value)) {
                                applyFilter(this.value, self.$leftSearch.$filteredSelects);
                            } else {
                                removeFilter(self.$leftSearch.$filteredSelects);
                            }
                        });
                    }

                    // Attach event to right filter
                    if (self.$rightSearch) {
                        self.$rightSearch.$filterInput.keyup(function() {
                            if (self.callbacks.fireSearch(this.value)) {
                                applyFilter(this.value, self.$rightSearch.$filteredSelects);
                            } else {
                                removeFilter(self.$rightSearch.$filteredSelects);
                            }
                        });
                    }

                    // Select all the options from left and right side when submitting the parent form
                    self.$right.closest('form').submit(function() {
                        // Clear left search input
                        if (self.$leftSearch) {
                            self.$leftSearch.$filterInput.val('').keyup();
                        }
                        // Clear right search input
                        if (self.$rightSearch) {
                            self.$rightSearch.$filterInput.val('').keyup();
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
                    self.$left.keydown(function(e) {
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
                        if (e.keyCode === KEY_ENTER || e.keyCode === KEY_BACKSPACE || e.keyCode === KEY_DEL) {
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

                    // FIXME: MoveUp doesn't work with multiple destinations
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
                    if (skipStack === "undefined") {
                        skipStack = false;
                    }
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
                        self.$rightSearch.$filterInput.keyup();
                        if (!skipStack) {
                            // FIXME: Does UNDO/REDO work with multiple destinations?

                            self.undoStack.push(['right', $options ]);
                            self.redoStack = [];
                        }

                        // FIXME: doNotSortRight doesn't exist
                        if (!silent) {
                            // FIXME: here only a single right element allowed?
                            // FIXME: You'd only need to sort that $select where something happened...
                            sortSelectItems(self.$right, self.callbacks.sort, self.options.keepRenderingFor);
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
                            sortSelectItems(self.$left, self.callbacks.sort, self.options.keepRenderingFor);
                            self.callbacks.afterMoveToLeft( self.$left, self.$right, $options );
                        }

                        return self;
                    }
                },

                moveFromAtoB: function( $source, $destination, $options) {
                    var self = this;

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
                    return self;
                },

                moveUp: function($options) {
                    var self = this;

                    if ( !self.callbacks.beforeMoveUp( $options ) ) {
                        return false;
                    }

                    $options.each(function(i, optionToMove) {
                        var $option = $(optionToMove);
                        var $optionPrev = $option.prev();
                        if ($optionPrev.length > 0 && $options.filter($optionPrev).length == 0) {
                            $optionPrev.before($option);
                        }
                    });

                    self.callbacks.afterMoveUp( $options );
                },

                moveDown: function($options) {
                    var self = this;

                    if ( !self.callbacks.beforeMoveDown( $options ) ) {
                        return false;
                    }

                    $options.each(function(i, optionToMove) {
                        var $option = $(optionToMove);
                        var $optionNext = $option.next();
                        if ($optionNext.length > 0 && $options.filter($optionNext).length == 0) {
                            $optionNext.after($option);
                        }
                    });

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
            $.Multiselect = Multiselect;
            return Multiselect;
        })($);


        $.fn.multiselect = function( options ) {
            return this.each(function() {
                var $this    = $(this),
                    data     = $this.data('crlcu.multiselect'),
                    settings = $.extend({}, Multiselect.defaults.callbacks, $this.data(), (typeof options === 'object' && options));

                if (!data) {
                    $this.data('crlcu.multiselect', (new Multiselect($this, settings)));
                }
            });
        };

        // this is the custom jQuery selector :search used when filtering
        $.expr[":"].search = function(elem, index, meta) {
            var regex = new RegExp(meta[3], "i");

            return $(elem).text().match(regex);
        }
    })
);