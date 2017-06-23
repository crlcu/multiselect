/**
 * Created by poggenpohlda on 23.06.2017.
 */
$(document).ready(function() {
    // make code pretty
    window.prettyPrint && prettyPrint();

    function ownMoveToRight(Multiselect, $options, event, silent, skipStack) {
        var button = $(event.currentTarget).attr('id');

        if (button == 'multi_d_rightSelected') {
            var $left_options = Multiselect.$left.find('> option:selected');
            Multiselect.$right.eq(0).append($left_options);

            if ( typeof Multiselect.callbacks.sort == 'function' && !silent ) {
                Multiselect.$right.eq(0).find('> option').sort(Multiselect.callbacks.sort).appendTo(Multiselect.$right.eq(0));
            }
        } else if (button == 'multi_d_rightAll') {
            var $left_options = Multiselect.$left.children(':visible');
            Multiselect.$right.eq(0).append($left_options);

            if ( typeof Multiselect.callbacks.sort == 'function' && !silent ) {
                Multiselect.$right.eq(0).find('> option').sort(Multiselect.callbacks.sort).appendTo(Multiselect.$right.eq(0));
            }
        } else if (button == 'multi_d_rightSelected_2') {
            var $left_options = Multiselect.$left.find('> option:selected');
            Multiselect.$right.eq(1).append($left_options);

            if ( typeof Multiselect.callbacks.sort == 'function' && !silent ) {
                Multiselect.$right.eq(1).find('> option').sort(Multiselect.callbacks.sort).appendTo(Multiselect.$right.eq(1));
            }
        } else if (button == 'multi_d_rightAll_2') {
            var $left_options = Multiselect.$left.children(':visible');
            Multiselect.$right.eq(1).append($left_options);

            if ( typeof Multiselect.callbacks.sort == 'function' && !silent ) {
                Multiselect.$right.eq(1).eq(1).find('> option').sort(Multiselect.callbacks.sort).appendTo(Multiselect.$right.eq(1));
            }
        }
    }

    function ownMoveToLeft(Multiselect, $options, event, silent, skipStack) {
        var button = $(event.currentTarget).attr('id');

        if (button == 'multi_d_leftSelected') {
            var $right_options = Multiselect.$right.eq(0).find('> option:selected');
            Multiselect.$left.append($right_options);

            if ( typeof Multiselect.callbacks.sort == 'function' && !silent ) {
                Multiselect.$left.find('> option').sort(Multiselect.callbacks.sort).appendTo(Multiselect.$left);
            }
        } else if (button == 'multi_d_leftAll') {
            var $right_options = Multiselect.$right.eq(0).children(':visible');
            Multiselect.$left.append($right_options);

            if ( typeof Multiselect.callbacks.sort == 'function' && !silent ) {
                Multiselect.$left.find('> option').sort(Multiselect.callbacks.sort).appendTo(Multiselect.$left);
            }
        } else if (button == 'multi_d_leftSelected_2') {
            var $right_options = Multiselect.$right.eq(1).find('> option:selected');
            Multiselect.$left.append($right_options);

            if ( typeof Multiselect.callbacks.sort == 'function' && !silent ) {
                Multiselect.$left.find('> option').sort(Multiselect.callbacks.sort).appendTo(Multiselect.$left);
            }
        } else if (button == 'multi_d_leftAll_2') {
            var $right_options = Multiselect.$right.eq(1).children(':visible');
            Multiselect.$left.append($right_options);

            if ( typeof Multiselect.callbacks.sort == 'function' && !silent ) {
                Multiselect.$left.find('> option').sort(Multiselect.callbacks.sort).appendTo(Multiselect.$left);
            }
        }
    }

    $('#multi_d').multiselect({
        right: '#multi_d_to, #multi_d_to_2',
        rightSelected: '#multi_d_rightSelected, #multi_d_rightSelected_2',
        leftSelected: '#multi_d_leftSelected, #multi_d_leftSelected_2',
        rightAll: '#multi_d_rightAll, #multi_d_rightAll_2',
        leftAll: '#multi_d_leftAll, #multi_d_leftAll_2',

        search: {
            left: '<input type="text" name="q" class="form-control" placeholder="Search..." />',
            right: '<input type="text" name="q2" class="form-control" placeholder="Search..." />'
        },


        moveToRight: ownMoveToRight,

        moveToLeft: ownMoveToLeft
    });
});
