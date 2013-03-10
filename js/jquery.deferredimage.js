!function ($, undefined) {

    var prefix = 'data-', prefixLength = prefix.length;

    function newImage(el) {
        var img = document.createElement('img'), attributes = el.attributes, index, name =
            '', newName;
        for (index = 0; index < attributes.length; index++) {
            name = attributes[index].name;
            if (name.indexOf(prefix) == 0 && name != 'data-img') {
                newName = name.substr(prefixLength);
                img.setAttribute(newName, attributes[index].value);
            }
        }
        return img;
    }

    $.fn.deferredImage = function (options) {
        return this.each(function () {
            $(this).find("i[data-img]").viewed(function () {
                $(this).replaceWith(newImage(this));
            });
        });
    };

}(window.jQuery);