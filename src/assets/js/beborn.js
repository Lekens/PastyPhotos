(function($) {
    $(window).on('load', function() {
        $('#page-loader').fadeOut('fast', function() {
            $(this).remove();
        });
    });
    // Smooth Scrolling
    $('.scrolling, .navbar-brand').on('click', function(event) {
        var $anchor = $(this);
        $('html, body').stop().animate({
            scrollTop: $($anchor.attr('href')).offset().top - 75
        }, 1000, 'easeInOutExpo');
        event.preventDefault();
    });
    $('.nav.navbar-nav > li').on('click', 'a', function(event) {
        var $anchor = $(this);
        $('html, body').stop().animate({
            scrollTop: $($anchor.attr('href')).offset().top - 75
        }, 1000, 'easeInOutExpo');
        event.preventDefault();
    });

    $(".navbar-toggler ").on('click', function() {
        console.log('Hello Man');
        if($(".navbar-collapse.collapse").hasClass('in')){
            $(".navbar-collapse.collapse").removeClass('in');
        } else {
            $(".navbar-collapse.collapse").addClass('in');
        }
    });

    //close collapse nav after select
    $(".btn-sing, .navbar-nav > li ").on('click', 'a', function() {
        console.log('Hello woMan');
        $(".navbar-collapse.collapse").removeClass('in');
    });

    /// Scroll to top
    var doc_height = $(document).height();
    $(window).on('scroll', function() {
        if ($(this).scrollTop() > (doc_height - 100)) {
            $('.scroll-top.active').removeClass('active');
            $('.scroll-top').addClass('active');
        } else {
            $('.scroll-top').removeClass('active');
        }
    });
    $('.scroll-top').on('click', function() {
        $("html, body").animate({
            scrollTop: 0
        }, 600);
        return false;
    });
}(jQuery));
