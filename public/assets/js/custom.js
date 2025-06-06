"use strict";
$(document).ready(function () {
    $(window).on("scroll", function () {
        $(".grid").isotope("layout");
    });

    $(".dropdown-menu").on("click", function (e) {
        e.stopPropagation();
    });
    //Set the carousel options
    $("#quote-carousel").carousel({
        pause: true,
        interval: 4000,
    });

    $(".dropdown-submenu").on("click", function () {
        $(".dropdown-submenu .drop1.open").not($(this).find(".drop1")).removeClass("open");
        $(this).find(".drop1").toggleClass("open");
    });
    $(".dropdown-toggle").on("click", function () {
        $(".dropdown-submenu .drop1").removeClass("open");
    });
    $(".dropdown-submenu").on("click", function () {
        $(".dropdown-submenu .drop2.open").not($(this).find(".drop2")).removeClass("open");
        $(this).find(".drop2").toggleClass("open");
    });
    $(".dropdown-toggle").on("click", function () {
        $(".dropdown-submenu .drop2").removeClass("open");
    });

    $("#datepicker").datepicker({
        showOn: "button",
        buttonImage: "assets/js/jqwidgets/images/icon-calendar.png",
        buttonImageOnly: true,
        buttonText: "Select date",
    });
    $("#datepicker01").datepicker({
        showOn: "button",
        buttonImage: "../../js/jqwidgets/images/icon-calendar.png",
        buttonImageOnly: true,
        buttonText: "Select date",
    });
    $("#datepicker02").datepicker({
        showOn: "button",
        buttonImage: "../../js/jqwidgets/images/icon-calendar.png",
        buttonImageOnly: true,
        buttonText: "Select date",
    });
    $("#datepicker2").datepicker({
        showOn: "button",
        buttonImage: "assets/js/jqwidgets/images/icon-calendar.png",
        buttonImageOnly: true,
        buttonText: "Select date",
    });
    $("#datepicker3").datepicker({
        showOn: "button",
        buttonImage: "assets/js/jqwidgets/images/icon-calendar.png",
        buttonImageOnly: true,
        buttonText: "Select date",
    });
    $("#datepicker4").datepicker({
        showOn: "button",
        buttonImage: "assets/js/jqwidgets/images/icon-calendar.png",
        buttonImageOnly: true,
        buttonText: "Select date",
    });
    $("#datepicker5").datepicker({
        showOn: "button",
        buttonImage: "assets/js/jqwidgets/images/icon-calendar.png",
        buttonImageOnly: true,
        buttonText: "Select date",
    });
    $("#datepicker6").datepicker({
        showOn: "button",
        buttonImage: "assets/js/jqwidgets/images/icon-calendar.png",
        buttonImageOnly: true,
        buttonText: "Select date",
    });
    $("#datepicker-headers1").datepicker({
        showOn: "button",
        buttonImage: "../../../assets/js/jqwidgets/images/icon-calendar.png",
        buttonImageOnly: true,
        buttonText: "Select date",
    });
    $("#datepicker-headers2").datepicker({
        showOn: "button",
        buttonImage: "../../../assets/js/jqwidgets/images/icon-calendar.png",
        buttonImageOnly: true,
        buttonText: "Select date",
    });
    $("#datepicker-headers4").datepicker({
        showOn: "button",
        buttonImage: "../../../../assets/js/jqwidgets/images/icon-calendar.png",
        buttonImageOnly: true,
        buttonText: "Select date",
    });
    $("#datepicker-headers3").datepicker({
        showOn: "button",
        buttonImage: "../../../../assets/js/jqwidgets/images/icon-calendar.png",
        buttonImageOnly: true,
        buttonText: "Select date",
    });
    $("#datepicker-inner-3").datepicker({
        showOn: "button",
        buttonImage: "../../../assets/js/jqwidgets/images/icon-calendar.png",
        buttonImageOnly: true,
        buttonText: "Select date",
    });
    $("#datepicker-inner-4").datepicker({
        showOn: "button",
        buttonImage: "../../../assets/js/jqwidgets/images/icon-calendar.png",
        buttonImageOnly: true,
        buttonText: "Select date",
    });

    $("#datepicker-inner-5").datepicker({
        showOn: "button",
        buttonImage: "../../../assets/js/jqwidgets/images/icon-calendar.png",
        buttonImageOnly: true,
        buttonText: "Select date",
    });
    $("#datepicker-inner-6").datepicker({
        showOn: "button",
        buttonImage: "../../../assets/js/jqwidgets/images/icon-calendar.png",
        buttonImageOnly: true,
        buttonText: "Select date",
    });
    $("#datepicker-inner-1").datepicker({
        showOn: "button",
        buttonImage: "../../../assets/js/jqwidgets/images/icon-calendar.png",
        buttonImageOnly: true,
        buttonText: "Select date",
    });
    $("#datepickerindex-1").datepicker({
        showOn: "button",
        buttonImage: "../../assets/js/jqwidgets/images/icon-calendar.png",
        buttonImageOnly: true,
        buttonText: "Select date",
    });
    $("#datepickerindex-2").datepicker({
        showOn: "button",
        buttonImage: "../../assets/js/jqwidgets/images/icon-calendar.png",
        buttonImageOnly: true,
        buttonText: "Select date",
    });

    $("#datepickerindex-3").datepicker({
        showOn: "button",
        buttonImage: "../../assets/js/jqwidgets/images/icon-calendar.png",
        buttonImageOnly: true,
        buttonText: "Select date",
    });
    $("#datepickerindex-6").datepicker({
        showOn: "button",
        buttonImage: "../../assets/js/jqwidgets/images/icon-calendar.png",
        buttonImageOnly: true,
        buttonText: "Select date",
    });
    $("#datepickerindex-4").datepicker({
        showOn: "button",
        buttonImage: "../../assets/js/jqwidgets/images/icon-calendar.png",
        buttonImageOnly: true,
        buttonText: "Select date",
    });

    $("#datepickerindex-5").datepicker({
        showOn: "button",
        buttonImage: "../../assets/js/jqwidgets/images/icon-calendar.png",
        buttonImageOnly: true,
        buttonText: "Select date",
    });

    $("#datepicker-inner-2").datepicker({
        showOn: "button",
        buttonImage: "../../../assets/js/jqwidgets/images/icon-calendar.png",
        buttonImageOnly: true,
        buttonText: "Select date",
    });
    $("#slider-range").slider({
        range: true,
        min: 0,
        max: 500,
        values: [100, 300],
        slide: function (event, ui) {
            $("#amount").html("$" + ui.values[0] + " - $" + ui.values[1]);
            $("#amount1").val(ui.values[0]);
            $("#amount2").val(ui.values[1]);
        },
    });
    $("#amount").html("$" + $("#slider-range").slider("values", 0) + " - $" + $("#slider-range").slider("values", 1));

    $("#amount1").val($("#slider-range").slider("values", 0));
    $("#amount2").val($("#slider-range").slider("values", 1));
    $("#time-range").slider({
        range: true,
        min: 1,
        max: 12,
        values: [2, 8],
        slide: function (event, ui) {
            $("#time").html(ui.values[0] + "AM - " + ui.values[1] + "AM");
            $("#amount1").val(ui.values[0]);
            $("#amount2").val(ui.values[1]);
        },
    });
    $("#time").html($("#time-range").slider("values", 0) + "AM - " + $("#time-range").slider("values", 1) + "AM");

    $("#time1").val($("#time-range").slider("values", 0));
    $("#time2").val($("#time-range").slider("values", 1));
    // slick slider script
    // $(".scroll-index3").slick({
    //     dots: false,
    //     arrows: true,
    //     infinite: true,
    //     slidesToShow: 3,
    //     autoplaySpeed: 1500,
    //     autoplay: true,
    //     slidesToScroll: 1,

    //     responsive: [
    //         {
    //             breakpoint: 992,
    //             settings: {
    //                 dots: false,
    //                 infinite: true,
    //                 slidesToShow: 2,
    //                 slidesToScroll: 2,
    //             },
    //         },
    //         {
    //             breakpoint: 768,
    //             settings: {
    //                 slidesToShow: 2,
    //                 slidesToScroll: 2,
    //             },
    //         },
    //         {
    //             breakpoint: 480,
    //             settings: {
    //                 slidesToShow: 1,
    //                 slidesToScroll: 1,
    //             },
    //         },
    //     ],
    // });
    // $(".scroll-text").slick({
    //     dots: false,
    //     arrows: false,
    //     infinite: true,
    //     slidesToShow: 1,
    //     autoplaySpeed: 2000,
    //     autoplay: true,
    //     slidesToScroll: 1,

    //     responsive: [
    //         {
    //             breakpoint: 992,
    //             settings: {
    //                 dots: false,
    //                 infinite: true,
    //                 slidesToShow: 1,
    //                 slidesToScroll: 1,
    //             },
    //         },
    //         {
    //             breakpoint: 768,
    //             settings: {
    //                 slidesToShow: 1,
    //                 slidesToScroll: 1,
    //             },
    //         },
    //         {
    //             breakpoint: 480,
    //             settings: {
    //                 slidesToShow: 1,
    //                 slidesToScroll: 1,
    //             },
    //         },
    //     ],
    // });
    // $(".scrolling-elem").slick({
    //     dots: false,
    //     arrows: true,
    //     infinite: true,
    //     slidesToShow: 3,
    //     autoplay: false,
    //     slidesToScroll: 1,

    //     responsive: [
    //         {
    //             breakpoint: 992,
    //             settings: {
    //                 dots: false,
    //                 infinite: true,
    //                 slidesToShow: 2,
    //                 slidesToScroll: 2,
    //             },
    //         },
    //         {
    //             breakpoint: 768,
    //             settings: {
    //                 slidesToShow: 1,
    //                 slidesToScroll: 1,
    //             },
    //         },
    //         {
    //             breakpoint: 480,
    //             settings: {
    //                 slidesToShow: 1,
    //                 slidesToScroll: 1,
    //             },
    //         },
    //     ],
    // });
    // $(".scroll-image").slick({
    //     dots: false,
    //     arrows: true,
    //     infinite: true,
    //     slidesToShow: 1,
    //     autoplaySpeed: 2000,
    //     autoplay: true,
    //     slidesToScroll: 1,

    //     responsive: [
    //         {
    //             breakpoint: 992,
    //             settings: {
    //                 dots: false,
    //                 infinite: true,
    //                 slidesToShow: 1,
    //                 slidesToScroll: 1,
    //             },
    //         },
    //         {
    //             breakpoint: 768,
    //             settings: {
    //                 slidesToShow: 1,
    //                 slidesToScroll: 1,
    //             },
    //         },
    //         {
    //             breakpoint: 480,
    //             settings: {
    //                 slidesToShow: 1,
    //                 slidesToScroll: 1,
    //             },
    //         },
    //     ],
    // });
    // $(".scroll-image-v2").slick({
    //     dots: false,
    //     arrows: true,
    //     infinite: true,
    //     slidesToShow: 1,
    //     autoplaySpeed: 2000,
    //     autoplay: true,
    //     slidesToScroll: 1,

    //     responsive: [
    //         {
    //             breakpoint: 992,
    //             settings: {
    //                 dots: false,
    //                 infinite: true,
    //                 slidesToShow: 1,
    //                 slidesToScroll: 1,
    //             },
    //         },
    //         {
    //             breakpoint: 768,
    //             settings: {
    //                 slidesToShow: 1,
    //                 slidesToScroll: 1,
    //             },
    //         },
    //         {
    //             breakpoint: 480,
    //             settings: {
    //                 slidesToShow: 1,
    //                 slidesToScroll: 1,
    //             },
    //         },
    //     ],
    // });
    // $(".scrolling-index2").slick({
    //     dots: false,
    //     arrows: false,
    //     infinite: true,
    //     slidesToShow: 3,
    //     autoplaySpeed: 1500,
    //     autoplay: true,
    //     slidesToScroll: 1,

    //     responsive: [
    //         {
    //             breakpoint: 992,
    //             settings: {
    //                 dots: false,
    //                 infinite: true,
    //                 slidesToShow: 2,
    //                 slidesToScroll: 2,
    //             },
    //         },
    //         {
    //             breakpoint: 768,
    //             settings: {
    //                 slidesToShow: 2,
    //                 slidesToScroll: 2,
    //             },
    //         },
    //         {
    //             breakpoint: 480,
    //             settings: {
    //                 slidesToShow: 1,
    //                 slidesToScroll: 1,
    //             },
    //         },
    //     ],
    // });
    // $(".index-two-scroll").slick({
    //     dots: false,
    //     arrows: true,
    //     infinite: true,
    //     slidesToShow: 1,
    //     autoplaySpeed: 1500,
    //     autoplay: true,
    //     slidesToScroll: 1,

    //     responsive: [
    //         {
    //             breakpoint: 992,
    //             settings: {
    //                 dots: false,
    //                 infinite: true,
    //                 slidesToShow: 1,
    //                 slidesToScroll: 1,
    //             },
    //         },
    //         {
    //             breakpoint: 768,
    //             settings: {
    //                 slidesToShow: 1,
    //                 slidesToScroll: 1,
    //             },
    //         },
    //         {
    //             breakpoint: 480,
    //             settings: {
    //                 slidesToShow: 1,
    //                 slidesToScroll: 1,
    //             },
    //         },
    //     ],
    // });
    // $(".index-twoS_bg").slick({
    //     dots: false,
    //     arrows: false,
    //     infinite: true,
    //     slidesToShow: 4,
    //     autoplaySpeed: 1500,
    //     autoplay: true,
    //     slidesToScroll: 1,

    //     responsive: [
    //         {
    //             breakpoint: 992,
    //             settings: {
    //                 dots: false,
    //                 infinite: true,
    //                 slidesToShow: 2,
    //                 slidesToScroll: 2,
    //             },
    //         },
    //         {
    //             breakpoint: 768,
    //             settings: {
    //                 slidesToShow: 2,
    //                 slidesToScroll: 2,
    //             },
    //         },
    //         {
    //             breakpoint: 480,
    //             settings: {
    //                 slidesToShow: 1,
    //                 slidesToScroll: 1,
    //             },
    //         },
    //     ],
    // });
    // $(".slider_logo").slick({
    //     dots: false,
    //     arrows: false,
    //     infinite: true,
    //     slidesToShow: 6,
    //     autoplaySpeed: 1500,
    //     autoplay: true,
    //     slidesToScroll: 1,

    //     responsive: [
    //         {
    //             breakpoint: 992,
    //             settings: {
    //                 dots: false,
    //                 infinite: true,
    //                 slidesToShow: 4,
    //                 slidesToScroll: 4,
    //             },
    //         },
    //         {
    //             breakpoint: 768,
    //             settings: {
    //                 slidesToShow: 2,
    //                 slidesToScroll: 2,
    //             },
    //         },
    //         {
    //             breakpoint: 480,
    //             settings: {
    //                 slidesToShow: 1,
    //                 slidesToScroll: 1,
    //             },
    //         },
    //     ],
    // });
    // wrapper-index
    var body = $(".wrapper-index");
    var backgrounds = [
        //'url(assets/img/plane-beach_original.jpg)',
        //'url(assets/img/website_cover1.jpg)',
        //'url(assets/img/website_cover2.jpg)'
        //'url(assets/img/2021/ulangtahun_ktmb.jpg)'
        "url(assets/img/2021/kits_bonanza1.jpg)",
    ];
    var current = 0;

    function nextBackground() {
        body.css("background", backgrounds[(current = ++current % backgrounds.length)]);

        setTimeout(nextBackground, 3000);
    }
    setTimeout(nextBackground, 3000);
    body.css("background", backgrounds[0]);

    function fadeDivs() {
        $(".wrapper-index").fadeOut(100, function () {
            $(this).fadeIn(100);
        });
        i++;
    }

    document.onreadystatechange = function () {
        var state = document.readyState;
        if (state === "complete") {
            setTimeout(function () {
                document.getElementById("loading");
            }, 2000);
        }
    };
});

// Button to move back to the top when user scroll down

//Get the button
var mybutton = document.getElementById("myBtn");

// When the user scrolls down 20px from the top of the document, show the button
window.onscroll = function () {
    scrollFunction();
};

function scrollFunction() {
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        mybutton.style.display = "block";
    } else {
        mybutton.style.display = "none";
    }
}

// When the user clicks on the button, scroll to the top of the document
function topFunction() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
}
