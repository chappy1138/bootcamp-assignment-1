!function ($, undefined) {
    "use strict";

    var superclass = $.ui.rangeSlider;
    $.widget("ui.minMaxRangeSlider", superclass, {
        _handleType: function(){
            return "minMaxRangeSliderHandle";
        }
    });
}(window.jQuery);
