/**
 * Created by poggenpohlda on 23.06.2017.
 */
$(document).ready(function() {
    // make code pretty
    window.prettyPrint && prettyPrint();

    $('#multi_d').multiselect({
        right: '#multi_d_to_1, #multi_d_to_2',
        rightSelected: '#multi_d_rightSelected_1, #multi_d_rightSelected_2',
        leftSelected: '#multi_d_leftSelected_1, #multi_d_leftSelected_2',
        rightAll: '#multi_d_rightAll_1, #multi_d_rightAll_2',
        leftAll: '#multi_d_leftAll_1, #multi_d_leftAll_2',
        moveUp: '#multi_d_moveUp_1, #multi_d_moveUp_2',
        moveDown: '#multi_d_moveDown_1, #multi_d_moveDown_2',
        search: {
            left: '<input type="text" name="q" class="form-control" placeholder="Search..." />',
            right: '<input type="text" name="q2" class="form-control" placeholder="Search..." />'
        }
    });

});
