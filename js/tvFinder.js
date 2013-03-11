!function ($) {
    var $tvs = $('#tvFinderOfferContainerId')
            .deferredImage()
            .isotope({
                itemSelector: '.tvFinderOffer', layoutMode: 'fitRows', getSortData: {
                    Featured: function ($elem) {
                        return parseInt($elem.attr('data-Featured'));
                    }, Price: function ($elem) {
                        return parseFloat($elem.attr('data-Price'));
                    }, Rating: function ($elem) {
                        return parseFloat($elem.attr('data-Rating'));
                    }, Name: function ($elem) {
                        return $elem.attr('data-Name');
                    }, Size: function ($elem) {
                        return $elem.attr('data-Size');
                    }
                }
            })
        , $sizeSlider = $("#tvFinderSizeSlider")
            .on("valuesChanged", sizeFilterUpdate)
        , $dropdowns = $('.dropdown-toggle')
            .dropdown()
            .parent()
            .find(".dropdown-menu")
        , $dropdownFilters = $dropdowns
            .filter("[data-role=filter]")
        , $matchOfferCount = $("#tvFinderMatchOfferCountId")
        , sizeBounds
        , minSize
        , maxSize
        ;
    $("#tvFinderClearFiltersId").click(function () {
        $dropdownFilters.each(function () {
            $(this)
                .prev()
                .contents()
                .eq(0)
                .replaceWith('Any ');
        });
        $sizeSlider.rangeSlider("values", sizeBounds.min, sizeBounds.max);
        dropdownFilterUpdate(undefined);
    });
    sizeBounds = $sizeSlider.rangeSlider("bounds");
    minSize = sizeBounds.min;
    maxSize = sizeBounds.max;
    // add event handler to the filter anchors
    $dropdowns
        .find("a")
        .click(function (event) {
            var $this = $(event.target)
                , value = $this.text()
                , $parent = $this.parents("ul.dropdown-menu")
                , role = $parent.attr("data-role")
                ;
            $this
                .dropdown('toggle')
            ;
            $parent
                .prev()
                .contents()
                .eq(0)
                .replaceWith(value + ' ')
            ;
            if (role === 'filter') {
                dropdownFilterUpdate($parent);
            }
            else {
                $tvs.isotope({ sortBy: value, sortAscending: $this.attr("data-asc") === 'true' });
            }
            return false;
        })
    ;

    function sizeFilterUpdate(e, data) {
        minSize = data.values.min;
        maxSize = data.values.max;
        dropdownFilterUpdate(undefined);
    }

    function getSize(el) {
        return parseInt(el.getAttribute('data-Size'));
    }

    function isInSizeRange(el) {
        var value = getSize(el);
        return minSize <= value && value <= maxSize;
    }

    function dropdownFilterUpdate($parent) {
        var selector = '.tvFinderOffer'
            , filterValues = {}
            ;

        // disable/enable filter choices based on new setting
        $dropdownFilters
            .each(function () {
                var $this = $(this)
                    , attr = $this.attr("data-attr")
                    ;
                $this
                    .prev()
                    .contents()
                    .eq(0)
                    .each(function () {
                        var $this = $(this)
                            , value = $this.text().trim()
                            ;
                        if (value !== 'Any') {
                            filterValues[attr] = value;
                            selector += '[data-' + attr + '=' + value + ']';
                        }
                    })
                ;

            })
            .each(function () {
                if (!$parent || this != $parent[0]) {
                    var $this = $(this)
                        , attr = $this.attr("data-attr")
                        , selector = '.tvFinderOffer'
                        ;
                    for (var filter in filterValues) {
                        if (filter !== attr) {
                            selector += '[data-' + filter + '=' + filterValues[filter] + ']';
                        }
                    }
                    $this.find('a').each(function () {
                        var $a = $(this)
                            , value = $a.text().trim()
                            , thisSelector
                            , thisFilteredList
                            ;
                        if (value !== 'Any') {
                            thisSelector = selector + '[data-' + attr + '=' + value + ']';
                            thisFilteredList = $tvs.find(thisSelector)
                                .filter(function () {
                                    return isInSizeRange(this);
                                })
                            ;
                            if (thisFilteredList.length > 0) {
                                $a.parent().removeClass('disabled');
                            }
                            else {
                                $a.parent().addClass('disabled');
                            }
                        }
                    })
                }
            })
        ;

        $tvs.find('.tvFinderOffer').each(function () {
            this.setAttribute('data-in-size-range', isInSizeRange(this));
        });
        selector += '[data-in-size-range=true]';
        $tvs.isotope({ filter: selector }, function ($items) {
            // update messaging
            $matchOfferCount.text($items.length);
            if ($items.length === 1) {
                $matchOfferCount.text("1 match");
            }
            else {
                $matchOfferCount.text($items.length + " matches");
            }
        });
    }
}(window.jQuery);