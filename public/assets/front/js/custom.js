
// sticky header js
// $(window).scroll(function(){
//   if ($(window).scrollTop() >= 150) {
//     $('.menu').addClass('sticky-header');
//    }
//    else {
//     $('.menu').removeClass('sticky-header');
//    }
// });

// on page change add active class to link
$(function(){
  var current_page_URL = location.href;
  $( ".navbar-nav a" ).each(function() {
     if ($(this).attr("href") !== "#") {
       var target_URL = $(this).prop("href");
       if (target_URL == current_page_URL) {
          $('.navbar-nav a').parents('li').removeClass('active');
          $(this).parent('li').addClass('active');
          return false;
       }
     }
  });
});


// our-team-slider js
$('.our-team-slider').slick({
  dots: false,
  arrows: true,
  infinite: false,
  speed: 300,
  slidesToShow: 2,
  slidesToScroll: 1,
  responsive: [
    {
      breakpoint: 600,
      settings: {
        slidesToShow: 1
      }
    }
  ]
});


// homepage testimonial slider js
$('.testimonial-slider').slick({
  slidesToShow: 1,
  slidesToScroll: 1,
  arrows: false,
  asNavFor: '.testimonial-slider-nav'
});
$('.testimonial-slider-nav').slick({
  slidesToShow: 3,
  slidesToScroll: 1,
  infinite: true,
  asNavFor: '.testimonial-slider',
  arrows: true,
  dots: false,
  centerMode: true,
  centerPadding: '0px',
  focusOnSelect: true,
  responsive: [
    {
      breakpoint: 768,
      settings: {
        arrows: false
      }
    }
  ]
});

// background video close js
jQuery(document).ready(function(){
  jQuery('#video-popup').on('hide.bs.modal', function(e) {    
      var $if = jQuery(e.delegateTarget).find('iframe');
      var src = $if.attr("src");
      $if.attr("src", '/empty.html');
      $if.attr("src", src);
  });
});
