// =========================
// ЭЛЕМЕНТЫ
// =========================

const collection = document.getElementById("collection");

const searchInput = document.getElementById("searchInput");

const emptyMessage = document.getElementById("emptyMessage");

const filterButton =
	document.getElementById("brandFilterButton");

const filterMenu =
	document.getElementById("brandFilterMenu");


// =========================
// СОЗДАНИЕ ФИЛЬТРОВ
// =========================

function createBrandFilters() {

	// Популярные бренды
	const brands = [
		...new Set(
			cans
				.filter(can => can.category === "popular")
				.map(can => can.name)
		)
	];

	// Количество всех банок
	const totalCount = cans.length;

	// Количество банок в "Разное"
	const otherCount = cans.filter(
		can => can.category === "other"
	).length;

	filterMenu.innerHTML = "";


	// =========================
	// ВСЕ
	// =========================

	const allOption = document.createElement("div");

	allOption.className = "filter-option";

	allOption.innerHTML = `
        <input
            type="checkbox"
            id="brand-all"
            checked
        >

        <label for="brand-all">
            <span>Все</span>
            <span class="filter-count">${totalCount}</span>
        </label>
    `;

	filterMenu.appendChild(allOption);


	// =========================
	// ПОПУЛЯРНЫЕ БРЕНДЫ
	// =========================

	brands.forEach((brand, index) => {

		// Считаем количество банок этого бренда
		const brandCount = cans.filter(
			can => can.name === brand
		).length;


		const option = document.createElement("div");

		option.className = "filter-option";

		option.innerHTML = `
            <input
                type="checkbox"
                class="brand-checkbox"
                value="${brand}"
                id="brand-${index}"
            >

            <label for="brand-${index}">
                <span>${brand}</span>
                <span class="filter-count">${brandCount}</span>
            </label>
        `;

		filterMenu.appendChild(option);

	});


	// =========================
	// РАЗНОЕ
	// =========================

	if (otherCount > 0) {

		const otherOption = document.createElement("div");

		otherOption.className = "filter-option";

		otherOption.innerHTML = `
            <input
                type="checkbox"
                class="brand-checkbox"
                value="__other__"
                id="brand-other"
            >

            <label for="brand-other">
                <span>Разное</span>
                <span class="filter-count">${otherCount}</span>
            </label>
        `;

		filterMenu.appendChild(otherOption);
	}


	// =========================
	// ОБРАБОТЧИК "ВСЕ"
	// =========================

	const allCheckbox =
		document.getElementById("brand-all");

	allCheckbox.addEventListener("change", () => {

		if (allCheckbox.checked) {

			document
				.querySelectorAll(".brand-checkbox")
				.forEach(checkbox => {
					checkbox.checked = false;
				});

		}

		renderCans();

	});


	// =========================
	// ОБРАБОТЧИКИ БРЕНДОВ
	// =========================

	document
		.querySelectorAll(".brand-checkbox")
		.forEach(checkbox => {

			checkbox.addEventListener("change", () => {

				const selected =
					getSelectedBrands();

				if (selected.length > 0) {

					allCheckbox.checked = false;

				} else {

					allCheckbox.checked = true;

				}

				renderCans();

			});

		});

}


// =========================
// ПОЛУЧЕНИЕ ВЫБРАННЫХ БРЕНДОВ
// =========================

function getSelectedBrands() {

	return [
		...document.querySelectorAll(
			".brand-checkbox:checked"
		)
	].map(checkbox => checkbox.value);

}


// =========================
// ОТОБРАЖЕНИЕ БАНОК
// =========================

function renderCans() {

	const search =
		searchInput.value
			.toLowerCase()
			.trim();

	const selectedBrands =
		getSelectedBrands();


	const filteredCans = cans.filter(can => {

		// Фильтр бренда
		const matchesBrand =
			selectedBrands.length === 0 ||
			selectedBrands.includes(can.name) ||
			(
				selectedBrands.includes("__other__") &&
				can.category === "other"
			);


		// Поиск
		const searchableText = `
            ${can.name}
            ${can.line}
            ${can.flavor}
            ${can.volume}
        `.toLowerCase();


		const matchesSearch =
			searchableText.includes(search);


		return matchesBrand && matchesSearch;

	});


	collection.innerHTML = "";


	// Ничего не найдено
	if (filteredCans.length === 0) {

		emptyMessage.classList.add("active");

		return;

	}


	emptyMessage.classList.remove("active");


	// Создаём карточки
	filteredCans.forEach(can => {

		const card =
			document.createElement("article");

		card.className = "card";


		// Линейка отображается только если она есть
		const lineHTML =
			can.line
				? `<div class="card-line">${can.line}</div>`
				: "";


		card.innerHTML = `

            <div class="card-image">

                <img
                    src="${can.image}"
                    alt="${can.name} ${can.flavor}"
                    onerror="this.style.display='none'"
                >

            </div>


            <div class="card-info">

                <div class="card-name">
                    ${can.name}
                </div>

                ${lineHTML}

                <div class="card-flavor">
                    ${can.flavor}
                </div>

                <div class="card-volume">
                    ${can.volume} ml
                </div>

            </div>

        `;


		collection.appendChild(card);

	});

}


// =========================
// ПОИСК
// =========================

searchInput.addEventListener(
	"input",
	renderCans
);


// =========================
// ОТКРЫТИЕ ФИЛЬТРА
// =========================

filterButton.addEventListener(
	"click",
	() => {

		filterMenu.classList.toggle("active");

	}
);


// =========================
// ЗАКРЫТИЕ ФИЛЬТРА
// ПРИ КЛИКЕ ВНЕ НЕГО
// =========================

document.addEventListener(
	"click",
	event => {

		const filter =
			document.querySelector(".filter");

		if (!filter.contains(event.target)) {

			filterMenu.classList.remove("active");

		}

	}
);


// =========================
// ЗАПУСК
// =========================

createBrandFilters();

renderCans();