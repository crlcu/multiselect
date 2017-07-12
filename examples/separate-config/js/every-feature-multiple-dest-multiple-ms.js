/**
 * Created by poggenpohlda on 23.06.2017.
 */


$(document).ready(function() {
    // make code pretty
    window.prettyPrint && prettyPrint();            // Why?
    var msInstanceIdPrefixes = ["#multi_d_1","#multi_d_2"];
    $(msInstanceIdPrefixes).each(function(i, prefix) {
        $(prefix).multiselect({
            keepRenderingFor: $.Multiselect.KeepInitialPositionFor.OPTGROUPS,
            right: prefix+'_to_1, ' + prefix + '_to_2',
            rightSelected: prefix+'_rightSelected_1, ' + prefix + '_rightSelected_2',
            leftSelected: prefix+'_leftSelected_1, ' + prefix + '_leftSelected_2',
            rightAll: prefix+'_rightAll_1, ' + prefix + '_rightAll_2',
            leftAll: prefix+'_leftAll_1, ' + prefix + '_leftAll_2',
            moveUp: prefix+'_moveUp_1, ' + prefix + '_moveUp_2',
            moveDown: prefix+'_moveDown_1, ' + prefix + '_moveDown_2',
            undo: prefix+'_undo',
            redo: prefix+'_redo',

            search: {
                left: '<input type="text" name="q" class="form-control" placeholder="Search..." />',
                right: '<input type="text" name="q2" class="form-control" placeholder="Search..." />'
            }
        });
    });

});
