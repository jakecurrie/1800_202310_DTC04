/*-----------------------------------------------------------------------
Search bar
-----------------------------------------------------------------------*/
const searchCategories = [
  { name: "Gloves & Hand Warmers" },
  { name: "Heaters" },
  { name: "Ice Melters" },
  { name: "Shovels" },
  { name: "Snow Brushes & Ice Scrapers" },
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
    renderList(searchCategories);
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
        resultItem.append(" ", " ");
      }
      list.append(resultItem);
    }
  }
}

//error message if no results found for search input
function noResults() {
  const errorMessage = $("<li>", { class: "error-message no-hover" }).text(
    "No results found. Try another search"
  );
  $("#list").append(errorMessage);
}

//direct user to the first search result item when they hit enter on the search input
searchInput.on("keydown", (event) => {
  if (event.key === "Enter") {
    let value = searchInput.val().trim().toLowerCase();
    const results = searchCategories.filter((searchCategory) => {
      return searchCategory.name.toLowerCase().trim().includes(value);
    });
    if (results.length > 0) {
      const category = results[0].name;
      window.location.href = `products.html?category=${category}`;
    }
    event.preventDefault();
  }
});

// when user clicks outside search bar and results container
$(document).on("click", (event) => {
  const target = $(event.target);
  if (!target.is(".search-bar") && !target.is(".results-container")) {
    resultsContainer.hide(); //clear search bar functions
    searchInput.val(""); //clear search input
  }
});

/*-----------------------------------------------------------------------
Hamburger toggle
-----------------------------------------------------------------------*/
const menuIcon = document.querySelector(".menu-icon");
const hamburgerMenu = document.querySelector(".navbar-features-mobile");
menuIcon.addEventListener("click", () => {
  if (menuIcon.children[0].className === "fa-solid fa-bars") {
    menuIcon.children[0].className = "fa-solid fa-xmark";
    hamburgerMenu.style.right = "-20px";
  } else {
    menuIcon.children[0].className = "fa-solid fa-bars";
    hamburgerMenu.style.right = "-200px";
  }
});

//
const loginTitle = document.querySelector("#login-mobile");
const loginContainer = document.querySelector("#refer-login");
firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    loginTitle.innerHTML = "Logout";
    loginContainer.addEventListener("click", () => {
      firebase
        .auth()
        .signOut()
        .then(() => {
          console.log("logged out");
        })
        .catch((error) => {
          console.log(error);
        });
    });
  } else {
    const queryString = window.location.search;
    const productQuery = queryString.replace("?category=", "")

    loginTitle.innerHTML = "Login";
    loginContainer.href = `./login.html?from=${productQuery}`;
  }
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

/*-----------------------------------------------------------------------------
Filter Section
------------------------------------------------------------------------------*/
// Filter open options with click
//filter by ___ divs
const filterByPrice = document.querySelector(".filter-by-price");
const filterByStore = document.querySelector(".filter-by-store");
const filterByRating = document.querySelector(".filter-by-rating");

let filterByPriceClick = 0;
let filterByStoreClick = 0;
let filterByRatingClick = 0;

//.children[0] refers to the title of each filter function
filterByPrice.children[0].addEventListener("click", () => {
  filterByPriceClick += 1;
  if (filterByPriceClick === 1) {
    filterByPrice.style.height = "140px";
    filterByPrice.children[0].children[1].style.rotate = "180deg";
  } else {
    filterByPriceClick = 0;
    filterByPrice.style.height = "55px";
    filterByPrice.children[0].children[1].style.rotate = "0deg";
  }
});

filterByStore.children[0].addEventListener("click", () => {
  filterByStoreClick += 1;
  if (filterByStoreClick === 1) {
    filterByStore.style.height = "160px";
    filterByStore.children[0].children[1].style.rotate = "180deg";
  } else {
    filterByStoreClick = 0;
    filterByStore.style.height = "55px";
    filterByStore.children[0].children[1].style.rotate = "0deg";
  }
});

filterByRating.children[0].addEventListener("click", () => {
  filterByRatingClick += 1;
  if (filterByRatingClick === 1) {
    filterByRating.style.height = "220px";
    filterByRating.children[0].children[1].style.rotate = "180deg";
  } else {
    filterByRatingClick = 0;
    filterByRating.style.height = "55px";
    filterByRating.children[0].children[1].style.rotate = "0deg";
  }
});

// FIlter Open and Close Button
const filterButton = document.querySelector("#btn-filter");
const filterContainer = document.querySelector(".d-lg-block");

filterButton.addEventListener("click", () => {
  if (filterButton.innerHTML == "Close") {
    filterButton.innerHTML = "Filter";
    filterContainer.style.bottom = "-800px";
  } else {
    filterButton.innerHTML = "Close";
    filterContainer.style.bottom = "0px";
  }
});
