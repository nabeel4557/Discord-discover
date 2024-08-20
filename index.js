// //search....

document.addEventListener("DOMContentLoaded", function () {
    const categoryButton = document.getElementById("category-button");
    const categoryDropdown = document.getElementById("category-dropdown");
    const categoryNameElement = document.querySelector(".category-name");
    const resultCountSpan = document.querySelector(
        ".result-found .no-of-results"
    );
    const searchInput = document.getElementById("search");
    const searchButton = document.querySelector(".searchButton");
    let allData = [];
    let currentCategory = "all";

    // Fetch and initialize data
    fetch("./discord_data.json")
        .then((response) => response.json())
        .then((data) => {
            allData = data.data;
            renderData(allData);
            updateCategoryCounts(allData);
            updateResultCount(allData.length);
            setupCategoryButtons(allData);
            updateDropdownCategoryCounts(allData);
        })
        .catch((error) => console.error("Error fetching data:", error));

    const categoryButtons = document.querySelectorAll(".bottom-left a");

    function setupCategoryButtons(data) {
        categoryButtons.forEach((button) => {
            button.addEventListener("click", (event) => {
                event.preventDefault();
                const category = button.dataset.category.toLowerCase();
                currentCategory = category;

                categoryButtons.forEach((btn) =>
                    btn.classList.remove("active")
                );
                button.classList.add("active");
                categoryNameElement.textContent = category;

                const filteredData =
                    category === "all"
                        ? data
                        : data.filter(
                              (item) => item.category.toLowerCase() === category
                          );

                renderData(filteredData);
                updateResultCount(filteredData.length);
            });
        });
    }

    function updateCategoryCounts(data) {
        categoryButtons.forEach((button) => {
            const category = button.dataset.category.toLowerCase();
            const count = getCategoryCount(data, category);
            button.querySelector(".explore-count").textContent = count;
        });
    }

    function updateDropdownCategoryCounts(data) {
        const dropdownButtons = document.querySelectorAll(
            "#category-dropdown a"
        );
        dropdownButtons.forEach((button) => {
            const category = button.dataset.category.toLowerCase();
            const count = getCategoryCount(data, category);
            button.querySelector(".explore-count").textContent = count;
        });
    }

    function renderData(data) {
        const resultContainer = document.querySelector(".bottom-content");
        resultContainer.innerHTML = "";

        data.forEach((item) => {
            const itemContainer = document.createElement("div");
            itemContainer.classList.add("items");

            const leftSide = document.createElement("div");
            leftSide.classList.add("left-side");

            const imageContainer = document.createElement("div");
            imageContainer.classList.add("image-container");

            const img = document.createElement("img");
            img.src = item.image;
            img.classList.add("item-image");
            img.alt = "item-image";

            imageContainer.appendChild(img);
            leftSide.appendChild(imageContainer);

            const rightSide = document.createElement("div");
            rightSide.classList.add("right-side");

            // Create a container for the title and logo
            const titleContainer = document.createElement("div");
            titleContainer.classList.add("title-container");

            // Create the logo image
            const logoImg = document.createElement("img");
            logoImg.src = item.logo;
            logoImg.classList.add("logo-image");
            logoImg.alt = "logo-image";

            const h6Title = document.createElement("h6");
            h6Title.textContent = item.title;

            const pDescription = document.createElement("p");
            pDescription.textContent = item.description;

            const spanOnline = document.createElement("span");
            spanOnline.textContent = "Online: " + item.online;

            const spanMembers = document.createElement("span");
            spanMembers.textContent = "Members: " + item.members;

            titleContainer.appendChild(logoImg);
            titleContainer.appendChild(h6Title);
            rightSide.appendChild(titleContainer);
            rightSide.appendChild(pDescription);
            rightSide.appendChild(spanOnline);
            rightSide.appendChild(spanMembers);

            itemContainer.appendChild(leftSide);
            itemContainer.appendChild(rightSide);

            resultContainer.appendChild(itemContainer);
        });
    }

    function getCategoryCount(data, category) {
        return category === "all"
            ? data.length
            : data.filter((item) => item.category.toLowerCase() === category)
                  .length;
    }

    function updateResultCount(count) {
        resultCountSpan.textContent = count;
    }

    // Category dropdown toggle
    categoryButton.addEventListener("click", function (event) {
        event.preventDefault();
        categoryDropdown.classList.toggle("show");
    });

    // Update category name and hide dropdown on selection
    const dropdownButtons = document.querySelectorAll("#category-dropdown a");
    dropdownButtons.forEach((button) => {
        button.addEventListener("click", function (event) {
            event.preventDefault();
            categoryDropdown.classList.remove("show");
            const category = button.dataset.category;
            categoryNameElement.textContent = category;
        });
    });

    // Hide dropdown when clicking outside
    window.addEventListener("click", function (event) {
        if (!event.target.closest("#category-button")) {
            categoryDropdown.classList.remove("show");
        }
    });

    // Search function
    function performSearch() {
        const searchTerm = searchInput.value.toLowerCase();

        const filteredData = allData.filter((item) => {
            const matchesSearch =
                item.title.toLowerCase().includes(searchTerm) ||
                item.description.toLowerCase().includes(searchTerm);
            const matchesCategory =
                currentCategory === "all" ||
                item.category.toLowerCase() === currentCategory;
            return matchesSearch && matchesCategory;
        });

        renderData(filteredData);
        updateResultCount(filteredData.length);
    }

    searchButton.addEventListener("click", performSearch);

    searchInput.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            performSearch();
        }
    });

    //hamburg...

    document
        .getElementById("hamburg")
        .addEventListener("click", function (event) {
            document.getElementById("menu").classList.add("open");
            document.body.classList.add("no-scroll");
            event.stopPropagation();
        });

    document
        .querySelector(".menu .close")
        .addEventListener("click", function () {
            document.getElementById("menu").classList.remove("open");
            document.body.classList.remove("no-scroll");
        });

    window.addEventListener("click", function (event) {
        if (
            !document.getElementById("menu").contains(event.target) &&
            !document.getElementById("hamburg").contains(event.target)
        ) {
            document.getElementById("menu").classList.remove("open");
        }
    });
});
