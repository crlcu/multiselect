/**
 * Created by poggenpohlda on 19.06.2017.
 * Separate JS file for example for better readability.
 */

$(document).ready(function() {
    "use strict";
    // make code pretty
    window.prettyPrint && prettyPrint();

    console.log(navigator.userAgent);

    // hack for iPhone 7.0.3 multiselects bug
    if(navigator.userAgent.match(/iPhone/i)) {
        $('select[multiple]').each(function(){
            /** @type {jQuery} select */
            var select = $(this).on({
                "focusout": function(){
                    /** @type {string[]|number[]} values */
                    var values = select.val() || [];
                    setTimeout(function(){
                        select.val(values.length ? values : ['']).change();
                    }, 1000);
                }
            });
            /** @type {string} firstOption */
            var firstOption = '<option value="" disabled="disabled"';
            firstOption += (select.val() || []).length > 0 ? '' : ' selected="selected"';
            firstOption += '>Select ' + (select.attr('title') || 'Options') + '';
            firstOption += '</option>';
            select.prepend(firstOption);
        });
    }

    var settings = {
        keepRenderingFor: $.Multiselect.KeepInitialPositionFor.OPTGROUPS,
        search: {
            left: '<input type="text" name="q" class="form-control" placeholder="Search..." />',
            right: '<input type="text" name="q" class="form-control" placeholder="Search..." />'
        }
    };
    var $msElement = $('#multiselect').multiselect(settings);
    /** @type {SelectContent} newOptions */
    var newOptions = {
        options:
        [
            {
                name: "Neue1",
                value: 1
            },
            {
                name: "Neue2",
                value: 2
            },
            {
                name: "Neue3",
                value: 3
            }
        ],
        optgroups:
        [
            {
                label: "Label zuerst",
                contents:
                [
                    {
                        name: "Neue5",
                        value: 5
                    },
                    {
                        name: "Neue4",
                        value: 4
                    },
                    {
                        name: "Neue6",
                        value: 6
                    }
                ]
            },
            {
                label: "Danach Label",
                contents:
                    [
                        {
                            name: "Neue5",
                            value: 5
                        },
                        {
                            name: "Neue4",
                            value: 4
                        },
                        {
                            name: "Neue6",
                            value: 6
                        }
                    ]
            }
        ]
    };
    var msInstance = $.Multiselect.getInstance($msElement);
    // msInstance.replaceItems(newOptions);
    var settingsstring = JSON.stringify(settings, null, 2);
    $("#insert-settings-here").text(settingsstring);
});