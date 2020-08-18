(function(window, document) {
	'use strict';

	const $toggles = document.querySelectorAll('.toggle');
	const $toggleBtn = document.getElementById('toggle-btn');

	$toggleBtn.addEventListener('click', toggleElements);

	window.addEventListener('resize', function() {
		if (window.innerWidth > 1024) {
			offElements();
		}
	})

	function toggleElements() {
		Array.from($toggles).forEach(function(toggle) {
			toggle.classList.toggle('on');
		})
	}

	function offElements() {
		Array.from($toggles).forEach(function(toggle) {
			toggle.classList.remove('on');
		})
	}
})(window, document)