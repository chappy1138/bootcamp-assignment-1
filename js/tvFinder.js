$('.dropdown-toggle')
    .dropdown()
    .parent()
    .find(".dropdown-menu")
    .find("a")
    .click(function () {
        var $this = $(this)
            , value = $this.text()
            , $parent = $this.parents("ul.dropdown-menu")
            , role = $parent.attr("data-role")
            ;
        if (role === 'filter') {
            $('#tvFinderOfferContainerId').isotope({ filter: '.tvFinderOffer[data-' + $parent.attr("data-attr") + '=' + value + ']' }, function ($items) {
                var id = this.attr('id'),
                    len = $items.length;
                console.log('Isotope has filtered for ' + len + ' items in #' + id);
            });
        }
        return false;
    })
;

$('#tvFinderOfferContainerId')
    .isotope({
        itemSelector: '.tvFinderOffer',
        layoutMode: 'fitRows'
    })
    .deferredImage()
;
