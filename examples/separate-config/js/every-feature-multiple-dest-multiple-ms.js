/**
 * Created by poggenpohlda on 23.06.2017.
 */

// FIXME: Init the two multiselects

$(document).ready(function() {
    // make code pretty
    window.prettyPrint && prettyPrint();            // Why?

    $('#multiselect').multiselect({
        right: '#multiselect_to, #multiselect_to_2',
        rightSelected: '#multiselect1_rightSelected, #multiselect2_rightSelected',
        leftSelected: '#multiselect1_leftSelected, #multiselect2_leftSelected',
        rightAll: '#multiselect1_rightAll, #multiselect_rightAll',
        leftAll: '#multiselect1_leftAll, #multiselect2_leftAll',

        search: {
            left: '<input type="text" name="q" class="form-control" placeholder="Search..." />',
            right: '<input type="text" name="q2" class="form-control" placeholder="Search..." />'
        },
        moveToRight: ownMoveToRight,
        moveToLeft: ownMoveToLeft
    });

    function ownMoveToRight(Multiselect, $options, event, silent, skipStack) {
        var button = $(event.currentTarget).attr('id');

        if (button == 'multiselect1_rightSelected') {
            var $left_options = Multiselect.$left.find('> option:selected');
            Multiselect.$right.eq(0).append($left_options);

            if ( typeof Multiselect.callbacks.sort == 'function' && !silent ) {
                Multiselect.$right.eq(0).find('> option').sort(Multiselect.callbacks.sort).appendTo(Multiselect.$right.eq(0));
            }
        } else if (button == 'multiselect1_rightAll') {
            var $left_options = Multiselect.$left.children(':visible');
            Multiselect.$right.eq(0).append($left_options);

            if ( typeof Multiselect.callbacks.sort == 'function' && !silent ) {
                Multiselect.$right.eq(0).find('> option').sort(Multiselect.callbacks.sort).appendTo(Multiselect.$right.eq(0));
            }
        } else if (button == 'multiselect2_rightSelected') {
            var $left_options = Multiselect.$left.find('> option:selected');
            Multiselect.$right.eq(1).append($left_options);

            if ( typeof Multiselect.callbacks.sort == 'function' && !silent ) {
                Multiselect.$right.eq(1).find('> option').sort(Multiselect.callbacks.sort).appendTo(Multiselect.$right.eq(1));
            }
        } else if (button == 'multiselect2_rightAll') {
            var $left_options = Multiselect.$left.children(':visible');
            Multiselect.$right.eq(1).append($left_options);

            if ( typeof Multiselect.callbacks.sort == 'function' && !silent ) {
                Multiselect.$right.eq(1).eq(1).find('> option').sort(Multiselect.callbacks.sort).appendTo(Multiselect.$right.eq(1));
            }
        }
    }

    function ownMoveToLeft(Multiselect, $options, event, silent, skipStack) {
        var button = $(event.currentTarget).attr('id');

        if (button == 'multiselect1_leftSelected') {
            var $right_options = Multiselect.$right.eq(0).find('> option:selected');
            Multiselect.$left.append($right_options);

            if ( typeof Multiselect.callbacks.sort == 'function' && !silent ) {
                Multiselect.$left.find('> option').sort(Multiselect.callbacks.sort).appendTo(Multiselect.$left);
            }
        } else if (button == 'multiselect1_leftAll') {
            var $right_options = Multiselect.$right.eq(0).children(':visible');
            Multiselect.$left.append($right_options);

            if ( typeof Multiselect.callbacks.sort == 'function' && !silent ) {
                Multiselect.$left.find('> option').sort(Multiselect.callbacks.sort).appendTo(Multiselect.$left);
            }
        } else if (button == 'multiselect2_leftSelected') {
            var $right_options = Multiselect.$right.eq(1).find('> option:selected');
            Multiselect.$left.append($right_options);

            if ( typeof Multiselect.callbacks.sort == 'function' && !silent ) {
                Multiselect.$left.find('> option').sort(Multiselect.callbacks.sort).appendTo(Multiselect.$left);
            }
        } else if (button == 'multiselect2_leftAll') {
            var $right_options = Multiselect.$right.eq(1).children(':visible');
            Multiselect.$left.append($right_options);

            if ( typeof Multiselect.callbacks.sort == 'function' && !silent ) {
                Multiselect.$left.find('> option').sort(Multiselect.callbacks.sort).appendTo(Multiselect.$left);
            }
        }
    }

});
