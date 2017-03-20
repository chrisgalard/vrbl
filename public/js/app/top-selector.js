define(['jquery'], function ($) {
	var topSelector = $('.js-toggle-content');
	var episodes = $('.js-episodes');
	var shows = $('.js-shows');

	shows.hide();

	topSelector.click(function (e) {
		e.preventDefault();

		topSelector.find('.is-selected').removeClass('is-selected');

		$(e.target).addClass('is-selected');

		episodes.toggle();
		shows.toggle();
	});
});