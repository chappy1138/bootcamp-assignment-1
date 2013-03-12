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
                        return parseInt($elem.attr('data-Size'));
                    }
                }
            })
        , $sizeSlider = $("#tvFinderSizeSlider")
            .slider({ change: sizeFilterUpdate })
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

    // Clear Filters Button

    $("#tvFinderClearFiltersId").click(function () {
        $dropdownFilters.each(function () {
            $(this)
                .prev()
                .contents()
                .eq(0)
                .replaceWith('Any ');
        });
        $sizeSlider
            .slider("values", sizeBounds)
            .find('.tvFinderSizeSliderLabel').each(function (index) {
                $(this).html(sizeSliderLabel(sizeBounds[index]));
            })
        ;
        dropdownFilterUpdate(undefined);
    });

    // Size Range Slider

    sizeBounds = $sizeSlider.slider("values");
    minSize = sizeBounds[0];
    maxSize = sizeBounds[1];

    $sizeSlider.find('.ui-slider-handle').each(function (index) {
        $(this).append('<span class="tvFinderSizeSliderLabel">' + sizeSliderLabel(sizeBounds[index]) + '</span>');
    });

    $sizeSlider.slider("option", "slide", function (evt, ui) {
        $(ui.handle).find('.tvFinderSizeSliderLabel').html(sizeSliderLabel(ui.value));
    });

    function sizeSliderLabel(value) {
        return Math.round(value) + '&rdquo;'
    }

    function sizeFilterUpdate(e, ui) {
        minSize = ui.values[0];
        maxSize = ui.values[1];
        dropdownFilterUpdate(undefined);
    }

    function getSize(el) {
        return parseInt(el.getAttribute('data-Size'));
    }

    function isInSizeRange(el) {
        var value = getSize(el);
        return minSize <= value && value <= maxSize;
    }

    // Other Filters

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
                            selector += '[data-' + attr + '="' + value + '"]';
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
                            selector += '[data-' + filter + '="' + filterValues[filter] + '"]';
                        }
                    }
                    $this.find('a').each(function () {
                        var $a = $(this)
                            , value = $a.text().trim()
                            , thisSelector
                            , thisFilteredList
                            ;
                        if (value !== 'Any') {
                            thisSelector = selector + '[data-' + attr + '="' + value + '"]';
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
            // update size lowMax and topMin
            var lowMax, topMin;
            $items.each(function () {
                var value = getSize(this);
                topMin = Math.min(topMin || value, value);
                lowMax = Math.max(lowMax || value, value);
            });
            $sizeSlider.slider("option", "topMin", topMin);
            $sizeSlider.slider("option", "lowMax", lowMax);
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