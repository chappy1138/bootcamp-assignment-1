!function ($, undefined) {
    $.fn.viewed = function (handler) {
        if (typeof handler == "function") {
            var $window = $(window)
                ;
            return this.each(function () {
                    var that = this
                        , onScrollHandler = function () {
                            var windowScrollTop = $window.scrollTop()
                                , windowHeight = $window.height()
                                , offset = $(that).offset()
                                ;
                            if (offset && windowScrollTop + windowHeight > offset.top) {
                                handler.call(that);
                                $window.unbind("scroll", onScrollHandler);
                            }
                        }
                        ;
                    $window.scroll(onScrollHandler);
                    onScrollHandler();
                }
            );
        }
        return this;
    };
}(window.jQuery);