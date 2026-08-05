function filterReleases() {
	const selectedCategory = document.querySelector('input[name="release-category"]:checked').value;
	const musicCards = document.querySelectorAll('.collection-item');

	musicCards.forEach(card => {
		const categories = card.getAttribute('data-category').split(' ');
		if (selectedCategory === 'All' || categories.includes(selectedCategory)) {
			card.style.display = 'block';
		} else {
			card.style.display = 'none';
		}
	});
}

function updateCategoryCounts() {
	const cards = document.querySelectorAll(".collection-item");

	const counts = {
		All: cards.length,
		Monster: 0,
		RedBull: 0,
		Hell: 0,
		NonStop: 0,
		Battery: 0,
		BestShot: 0
	};

	cards.forEach(card => {
		const categories = card.dataset.category.split(" ");

		categories.forEach(category => {
			if (counts.hasOwnProperty(category) && category !== "All") {
				counts[category]++;
			}
		});
	});

	for (const category in counts) {
		document.getElementById(`count-${category}`).textContent = counts[category];
	}
}

document.addEventListener("DOMContentLoaded", () => {
	filterReleases(); // Фильтруем при загрузке страницы
	updateCategoryCounts();
	const filters = document.querySelectorAll('input[name="release-category"]');
	filters.forEach(filter => {
		filter.addEventListener('change', filterReleases);
	});
});
