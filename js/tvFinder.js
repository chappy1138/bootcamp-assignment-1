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
        , $dropdowns = $('.dropdown-toggle')
            .dropdown()
            .parent()
            .find(".dropdown-menu")
        , $dropdownFilters = $dropdowns
            .filter("[data-role=filter]")
        ;
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
                var selector = '.tvFinderOffer', filterValues = {};
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
                        if (this != $parent[0]) {
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
                                    thisFilteredList = $tvs.find(thisSelector);
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

                $tvs.isotope({ filter: selector }, function ($items) {
                    var id = this.attr('id'),
                        len = $items.length;
                    console.log('Isotope has filtered for ' + len + ' items in #' + id);
                });
            }
            else {
                $tvs.isotope({ sortBy: value, sortAscending: $this.attr("data-asc") === 'true' });
            }
            return false;
        })
    ;
}(window.jQuery);