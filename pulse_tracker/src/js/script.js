// console.log("Биба");
// $(document).ready(function () {
//     $(".carousel__slider").slick({
//         speed: 1200,
//         adaptiveHeight: false,
//         prevArrow:
//             '<button type="button" class="slick-prev"><img src="img/slider/left.svg" alt="left_scroll_button"></button>',
//         nextArrow:
//             '<button type="button" class="slick-next"><img src="img/slider/right.svg" alt="right_scroll_button"></button>',
//         responsive: [
//             {
//                 breakpoint: 992,
//                 settings: {
//                     dots: true,
//                     arrows: false,
//                 },
//             },
//         ],
//     });
// });

var slider = tns({
    container: ".carousel__slider",
    items: 1,
    slideBy: "page",
    autoplay: false,
    nav: false,
    controlsText: [
        '<img src="img/slider/left.svg" alt="left_scroll_button"></img>',
        '<img src="img/slider/right.svg" alt="right_scroll_button">',
    ],
});
