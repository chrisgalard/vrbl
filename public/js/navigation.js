$(function () {

	var navigationBar = $('.js-navigation');
	var navigationToggle = $('.js-navigation-toggle');

	var socialLinks = $('.js-social-links');
	var didScroll = false;

	$(window).click(function (e) {
		var target = $(e.target);

		console.log(target, target.hasClass('js-navigation-toggle'));

		if (target.hasClass('js-navigation-toggle')) {
			e.preventDefault();
			navigationBar.toggleClass('is-visible');
			navigationToggle.toggleClass('is-toggled');
		} else if (navigationBar.hasClass('is-visible')) {
			navigationBar.removeClass('is-visible');
			navigationToggle.removeClass('is-toggled');
		}
	});

	if ($(window).width() < 768) {
		$(window).scroll(function () {
			didScroll = true;
		});

		setInterval(function () {
			if (didScroll) {
				didScroll = false;

				if ($(window).scrollTop() > 200) {
					socialLinks.removeClass('is-visible');
				} else {
					socialLinks.addClass('is-visible');
				}
			}
		}, 250);
	}

});