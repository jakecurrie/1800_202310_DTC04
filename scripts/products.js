/*-----------------------------------------------------------------------
Search bar
-----------------------------------------------------------------------*/
const searchCategories = [
  { name: "Shovels" },
  { name: "Road Salt" },
  { name: "Heaters" },
  { name: "Tire Chains" },
];

const searchInput = $(".search-bar_input");
const resultsContainer = $(".results-container");

searchInput.on("input", (input) => {
  let value = input.target.value.trim().toLowerCase();

  if (value.length > 0) {
    renderList(
      searchCategories.filter((searchCategory) => {
        return searchCategory.name.toLowerCase().trim().includes(value);
      })
    );
    resultsContainer.show();
  } else {
    resultsContainer.hide();
  }
});

function renderList(results) {
  const list = $("#list");
  list.empty();

  if (results.length === 0) {
    noResults();
  } else {
    for (const searchCategory of results) {
      const resultItem = $("<li>", { class: "result-item" }).text(
        searchCategory.name
      );
      resultItem.on("click", () => {
        const category = searchCategory.name;
        window.location.href = `products.html?category=${category}`;
      });
      if (results.indexOf(searchCategory) < results.length - 1) {
        resultItem.append(",", " ", " ");
      }
      list.append(resultItem);
    }
  }
}

function noResults() {
  const errorMessage = $("<li>", { class: "error-message" }).text(
    "No results found. Try another search"
  );
  $("#list").append(errorMessage);
}

/*-----------------------------------------------------------------------
Hamburger toggle
-----------------------------------------------------------------------*/
$(function () {
  $(".menu-icon").click(function () {
    $(".menu").toggle();
  });
});

/*-----------------------------------------------------------------------
Back to top button
-----------------------------------------------------------------------*/
const $backToTopBtn = $("#btn-back-to-top");

// When the user scrolls down 20px from the top of the document, show the button
$(window).scroll(function () {
  if ($(this).scrollTop() > 20) {
    $backToTopBtn.show();
  } else {
    $backToTopBtn.hide();
  }
});

// When the user clicks on the button, scroll to the top of the document in 0.8 sec
$backToTopBtn.click(function () {
  $("html, body").animate({ scrollTop: 0 }, 800);
});
