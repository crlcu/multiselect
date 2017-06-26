/**
 * Created by poggenpohlda on 23.06.2017.
 */

// FIXME: Init the two multiselects

$(document).ready(function() {
    // make code pretty
    window.prettyPrint && prettyPrint();            // Why?
    var msInstanceIdPrefixes = ["#multi_d_1","#multi_d_2"];
    $(msInstanceIdPrefixes).each(function(i, prefix) {
        $(prefix).multiselect({
            right: prefix+'_to_1, ' + prefix + '_to_2',
            rightSelected: prefix+'_rightSelected_1, ' + prefix + '_rightSelected_2',
            leftSelected: prefix+'_leftSelected_1, ' + prefix + '_leftSelected_2',
            rightAll: prefix+'_rightAll_1, ' + prefix + '_rightAll_2',
            leftAll: prefix+'_leftAll_1, ' + prefix + '_leftAll_2',
            moveUp: prefix+'_moveUp_1, ' + prefix + '_moveUp_2',
            moveDown: prefix+'_moveDown_1, ' + prefix + '_moveDown_2',

            search: {
                left: '<input type="text" name="q" class="form-control" placeholder="Search..." />',
                right: '<input type="text" name="q2" class="form-control" placeholder="Search..." />'
            },
            moveToRight: ownMoveToRight,
            moveToLeft: ownMoveToLeft
        });
    });

    function ownMoveToRight(Multiselect, $options, event, silent, skipStack) {
        var button = $(event.currentTarget).attr('id');

        var prefix = Multiselect.$left.attr("id");
        if (button == prefix+'_rightSelected_1') {
            var $left_options = Multiselect.$left.find('> option:selected');
            Multiselect.$right.eq(0).append($left_options);

            if ( typeof Multiselect.callbacks.sort == 'function' && !silent ) {
                Multiselect.$right.eq(0).find('> option').sort(Multiselect.callbacks.sort).appendTo(Multiselect.$right.eq(0));
            }
        } else if (button == prefix+'_rightAll_1') {
            var $left_options = Multiselect.$left.children(':visible');
            Multiselect.$right.eq(0).append($left_options);

            if ( typeof Multiselect.callbacks.sort == 'function' && !silent ) {
                Multiselect.$right.eq(0).find('> option').sort(Multiselect.callbacks.sort).appendTo(Multiselect.$right.eq(0));
            }
        } else if (button == prefix+'_rightSelected_2') {
            var $left_options = Multiselect.$left.find('> option:selected');
            Multiselect.$right.eq(1).append($left_options);

            if ( typeof Multiselect.callbacks.sort == 'function' && !silent ) {
                Multiselect.$right.eq(1).find('> option').sort(Multiselect.callbacks.sort).appendTo(Multiselect.$right.eq(1));
            }
        } else if (button == prefix+'_rightAll_2') {
            var $left_options = Multiselect.$left.children(':visible');
            Multiselect.$right.eq(1).append($left_options);

            if ( typeof Multiselect.callbacks.sort == 'function' && !silent ) {
                Multiselect.$right.eq(1).eq(1).find('> option').sort(Multiselect.callbacks.sort).appendTo(Multiselect.$right.eq(1));
            }
        }
    }

    function ownMoveToLeft(Multiselect, $options, event, silent, skipStack) {
        var button = $(event.currentTarget).attr('id');

        var prefix = Multiselect.$left.attr("id");
        if (button == prefix+'_leftSelected_1') {
            var $right_options = Multiselect.$right.eq(0).find('> option:selected');
            Multiselect.$left.append($right_options);

            if ( typeof Multiselect.callbacks.sort == 'function' && !silent ) {
                Multiselect.$left.find('> option').sort(Multiselect.callbacks.sort).appendTo(Multiselect.$left);
            }
        } else if (button == prefix+'_leftAll_1') {
            var $right_options = Multiselect.$right.eq(0).children(':visible');
            Multiselect.$left.append($right_options);

            if ( typeof Multiselect.callbacks.sort == 'function' && !silent ) {
                Multiselect.$left.find('> option').sort(Multiselect.callbacks.sort).appendTo(Multiselect.$left);
            }
        } else if (button == prefix+'_leftSelected_2') {
            var $right_options = Multiselect.$right.eq(1).find('> option:selected');
            Multiselect.$left.append($right_options);

            if ( typeof Multiselect.callbacks.sort == 'function' && !silent ) {
                Multiselect.$left.find('> option').sort(Multiselect.callbacks.sort).appendTo(Multiselect.$left);
            }
        } else if (button == prefix+'_leftAll_2') {
            var $right_options = Multiselect.$right.eq(1).children(':visible');
            Multiselect.$left.append($right_options);

            if ( typeof Multiselect.callbacks.sort == 'function' && !silent ) {
                Multiselect.$left.find('> option').sort(Multiselect.callbacks.sort).appendTo(Multiselect.$left);
            }
        }
    }

});
