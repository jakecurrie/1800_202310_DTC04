const cardsPerPage = 12;
let currentPage = 1;
let allProducts;
let originalProducts;
let sliderOne;
let sliderTwo;
let sliderTrack;
let sliderMaxValue;

/*-----------------------------------------------------------------------
query product category
-----------------------------------------------------------------------*/
function queryProductCategory() {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const category = urlParams.get("category");
  const categoryHeader = $("#category-header");

  categoryHeader.html(category);

  const db = firebase.firestore();
  const productsRef = db
    .collection("products")
    .where("product_type", "==", category);
  productsRef
    .get()
    .then((querySnapshot) => {
      allProducts = querySnapshot.docs;
      originalProducts = [...allProducts];
      const priceRange = allProducts.map((doc) => doc.data().price);
      const priceMin = Math.min(...priceRange);
      const priceMax = Math.max(...priceRange);
      // console.log("min price is", priceMin);
      // console.log("max price is", priceMax);
      generatePagination();
      generateProductCards();
      populateStores();
      populateReviews();
      generatePriceRangeSlider(priceMin, priceMax);
    })
    .catch((error) => {
      console.error(error);
    });
}

/*-----------------------------------------------------------------------
pagination
-----------------------------------------------------------------------*/
function generatePagination() {
  const paginationContainer = $("#pagination-container");
  const totalPages = Math.ceil(allProducts.length / cardsPerPage);
  let paginationHTML = "";
  for (let i = 1; i <= totalPages; i++) {
    if (i === currentPage) {
      paginationHTML += `<button class="btn active pagbtn">${i}</button>`;
    } else {
      paginationHTML += `<button class="btn greyed pagbtn">${i}</button>`;
    }
  }
  paginationContainer.html(paginationHTML);

  const prevBtn = $("#prev-btn");
  const nextBtn = $("#next-btn");

  //hide the previous button on the first page
  if (currentPage === 1) {
    prevBtn.hide();
  } else {
    prevBtn.show();
  }

  //hide the next button on the last page
  if (currentPage === totalPages) {
    nextBtn.hide();
  } else {
    nextBtn.show();
  }

  paginationContainer.off().on("click", ".pagbtn", function () {
    currentPage = $(this).index() + 1;
    generateProductCards();
    generatePagination();
    window.scrollTo(0, 0);
  });
}

/*-----------------------------------------------------------------------
product card
-----------------------------------------------------------------------*/
function generateProductCards() {
  const startIndex = (currentPage - 1) * cardsPerPage;
  const endIndex = startIndex + cardsPerPage;
  const productList = $("#product-list");
  productList.empty();

  allProducts.slice(startIndex, endIndex).forEach((doc) => {
    const product = doc.data();
    const productCard = `
      <div class="col-lg-4 col-5">
        <div id="product-${doc.id}" class="single-product">
          <div class="part-1">
            <img class="card-img-top" src="${product.image_url}" alt="${product.product_name}">
            <ul>
              <li><a href="#"><i class="fa fa-heart wishlist-btn focus"></i></a></li>
              <li><a href="${product.product_url}"target="_blank"><i class="fa fa-link link-btn"></i></a></li>
            </ul>
          </div>
          <div class="part-2">
            <h3 class="product-price">$${product.price}</h3>
            <h4 class="product-title">${product.product_name}</h4>
            <h4 class="product-store">${product.store}</h4>
            <div class="d-flex flex-row">
            
                <h4 class="product-rating">${product.rating}</h4>
            
            
                <div class="star-rating" title="5 0%">
                  <div class="back-stars">
                    <i class="fa fa-star" aria-hidden="true"></i>
                    <i class="fa fa-star" aria-hidden="true"></i>
                    <i class="fa fa-star" aria-hidden="true"></i>
                    <i class="fa fa-star" aria-hidden="true"></i>
                    <i class="fa fa-star" aria-hidden="true"></i>
                    <div class="front-stars" style="width: 50%">
                      <i class="fa fa-star" aria-hidden="true"></i>
                      <i class="fa fa-star" aria-hidden="true"></i>
                      <i class="fa fa-star" aria-hidden="true"></i>
                      <i class="fa fa-star" aria-hidden="true"></i>
                      <i class="fa fa-star" aria-hidden="true"></i>
                    </div>
                  </div>
                </div>
      
            </div>
          </div>
        </div>
      </div>
    `;
    productList.append(productCard);

    //display product cards as stars
    const productCardElement = $(`#product-${doc.id}`);
    const starRatingWrapper = productCardElement.find(".star-rating");
    const frontStars = productCardElement.find(".front-stars");
    const percentage =
      parseFloat(product.rating) >= 0 ? parseFloat(product.rating) * 20 : 0;
    starRatingWrapper.attr("title", percentage + "%");
    frontStars.css("width", percentage + "%");

    //click wishlist button to bookmark item
    const wishlistBtn = $(`#product-${doc.id} .wishlist-btn`);

    wishlistBtn.on("click", (event) => {
      console.log(`product ${doc.id} clicked`);
      event.preventDefault();
      firebase.auth().onAuthStateChanged((user) => {
        if (user) {
          currentUser = db.collection("users").doc(user.uid); //global
          console.log(currentUser);
          updateBookmark(doc.id);
        } else {
          // No user is signed in.
          console.log("No user is signed in");
          window.location.href = "login.html";
        }
      });
    });
  });
  // const productCount = $("#product-count");
  // productCount.html(`(${allProducts.length} results)`);
}

//update product cards when user clicks the previous button
$("#prev-btn").on("click", function () {
  if (currentPage > 1) {
    currentPage--;
    console.log(currentPage);
    generateProductCards();
    generatePagination();
    window.scrollTo(0, 0);
  }
});

//update product cards when user clicks the next button
$("#next-btn").on("click", function () {
  const totalPages = Math.ceil(allProducts.length / cardsPerPage);
  if (currentPage < totalPages) {
    currentPage++;
    console.log(currentPage);
    generateProductCards();
    generatePagination();
    window.scrollTo(0, 0);
  }
});

queryProductCategory();

/*-----------------------------------------------------------------------
filters
-----------------------------------------------------------------------*/

/*--filter panel - populate store--*/
function populateStores() {
  const stores = new Set();
  allProducts.forEach((doc) => {
    const product = doc.data();
    // console.log(`product.rating: ${product.rating}`);

    stores.add(product.store);
  });

  const checkboxesContainer = $("#stores-checkboxes");
  let checkboxesHTML = "";
  stores.forEach((store) => {
    const filteredProductsByStore = allProducts.filter(
      (doc) => doc.data().store === store
    );

    checkboxesHTML += `
      <div class="form-check">
        <input class="form-check-input" type="checkbox" id="${store}" checked>
        <label class="form-check-label" for="${store}">${store} (${filteredProductsByStore.length})</label>
      </div>
    `;
  });
  checkboxesContainer.html(checkboxesHTML);
}

/*--filter panel - double range price slider--*/
function generatePriceRangeSlider(priceMin, priceMax) {
  $(".double-range-slider").html(
    `<div class="wrapper">
      <div class="slider-container">
        <div class="slider-track"></div>
        <input type="range" min="${priceMin}" max="${priceMax}" value="${priceMin}" id="slider-1" />
        <input type="range" min="${priceMin}" max="${priceMax}" value="${priceMax}" id="slider-2" />
      </div>
      <div class="slider-values">
        <span id="price-min">Min $${priceMin}</span>
        <span id="price-max">Max $${priceMax}</span>
      </div>
    </div>`
  );
  sliderOne = $("#slider-1");
  sliderTwo = $("#slider-2");
  sliderTrack = $(".slider-track");
  sliderMaxValue = sliderOne.attr("max");

  slideOne();
  slideTwo();

  sliderOne.on("input", slideOne);
  sliderTwo.on("input", slideTwo);
}

//update price min when left thumb is moved
function slideOne() {
  if (parseInt(sliderTwo.val()) - parseInt(sliderOne.val()) <= 10) {
    sliderOne.val(parseInt(sliderTwo.val()) - 10);
  }
  $("#price-min").text("Min: $" + sliderOne.val());
  fillColor();
}

//update price max when right thumb is moved
function slideTwo() {
  if (parseInt(sliderTwo.val()) - parseInt(sliderOne.val()) <= 10) {
    sliderTwo.val(parseInt(sliderOne.val()) + 10);
  }
  $("#price-max").text("Max: $" + sliderTwo.val());
  fillColor();
}

//fill color of the slider tract
function fillColor() {
  percent1 = (sliderOne.val() / sliderMaxValue) * 100;
  percent2 = (sliderTwo.val() / sliderMaxValue) * 100;
  sliderTrack.css(
    "background",
    `linear-gradient(to right, #dadae5 ${percent1}% , #a3a3a3  ${percent1}% , #a3a3a3  ${percent2}%, #dadae5 ${percent2}%)`
  );
}

/*--filter panel - customer review--*/
function populateReviews() {
  const checkboxesContainerRating = $("#reviews-checkboxes");
  let checkboxesHTML = "";

  for (let i = 4; i >= 0; i--) {
    const stars = starsHTML(i);
    const filteredProductsByRating = allProducts.filter((doc) => {
      const rating = parseFloat(doc.data().rating);
      console.log(`Parsed rating value: ${rating}`);

      switch (i) {
        case 0:
          return rating >= 4 && rating <= 5;
        case 1:
          return rating >= 3 && rating < 4;
        case 2:
          return rating >= 2 && rating < 3;
        case 3:
          return rating >= 1 && rating < 2;
        case 4:
          return rating == null || rating === "" || rating < 1 || isNaN(rating);
        default:
          return false;
      }
    });
    // console.log(
    //   `Rating ${i} - filteredProductsByRating:`,
    //   filteredProductsByRating
    // );

    checkboxesHTML += `
  <div class="form-check">
    <input class="form-check-input" type="checkbox" id="rating-${i}" checked>
    <label class="form-check-label" for="rating-${i}">${stars} & up (${filteredProductsByRating.length})</label>
  </div>
`;
  }

  checkboxesContainerRating.html(checkboxesHTML);
}

function starsHTML(rating) {
  const fullStars = Math.floor(rating);
  let starsHTML = "";

  //print full stars
  for (let i = 0; i < fullStars; i++) {
    starsHTML += `<i class="fa fa-star yellow"></i>`;
  }
  //then print empty stars
  const emptyStars = 5 - fullStars;
  for (let i = 0; i < emptyStars; i++) {
    starsHTML += `<i class="fa fa-star grey-stars"></i>`;
  }

  return starsHTML;
}

/*--filter panel - apply filters--*/
function applyFilter() {
  const storeCheckboxes = $(".form-check-input:checked");
  const selectedStores = [];
  storeCheckboxes.each(function () {
    selectedStores.push($(this).attr("id"));
  });

  console.log("selectedStores:", selectedStores); // log selected stores

  const ratingCheckboxes = $(".form-check-input:checked").filter(
    (index, checkbox) => {
      return parseInt(checkbox.id) > 0;
    }
  );
  const selectedRatings = ratingCheckboxes
    .map((index, checkbox) => {
      return parseInt(checkbox.id);
    })
    .get();
  allProducts = [...originalProducts];
  console.log("selectedRating:", selectedRatings); // log selected ratings
  const filteredProducts = allProducts.filter((doc) => {
    const product = doc.data();
    const productPrice = parseFloat(product.price);
    const selectedPriceMin = parseFloat($("#slider-1").val());
    const selectedPriceMax = parseFloat($("#slider-2").val());
    const productRating = parseFloat(product.rating);
    var filterStores = false;
    var filterPrices = false;
    var filterRatings = false;

    if (selectedStores.length === 0 || selectedStores.includes(product.store)) {
      filterStores = true;
    }
    if (productPrice >= selectedPriceMin && productPrice <= selectedPriceMax) {
      filterPrices = true;
    }
    if (
      selectedRatings.length === 0 ||
      selectedRatings.includes(Math.floor(productRating))
    ) {
      filterRatings = true;
    }

    return filterStores && filterPrices && filterRatings;
  });

  console.log("allProducts length before filtering:", allProducts.length);
  console.log("filteredProducts length:", filteredProducts.length);

  allProducts = filteredProducts;

  currentPage = 1;
  generatePagination();
  generateProductCards();
}

$("#apply-filter").on("click", function () {
  applyFilter();
});

document.querySelector(".navbar-logo").addEventListener("click", () => {
  window.location.href = "./home-page.html";
});

/*-----------------------------------------------------------------------
Wishlist
-----------------------------------------------------------------------*/
function updateBookmark(id) {
  currentUser.get().then(function (userDoc) {
    if (userDoc.data().bookmarks) {
      bookmarksNow = userDoc.data().bookmarks;
    } else {
      bookmarksNow = []; //if boookmarks field is undefined
    }
    console.log(bookmarksNow);

    //check if this bookmark already existed in firestore:
    if (bookmarksNow.includes(id)) {
      console.log(id);
      //if it does exist, then remove it
      currentUser
        .update({
          bookmarks: firebase.firestore.FieldValue.arrayRemove(id),
        })
        .then(function () {
          console.log(`This bookmark is removed for ${userDoc.data().name}`);
          var iconID = "save-" + id;
          console.log(iconID);
          $(`.single-product #product-${id} .wishlist-btn`).addClass(
            "bookmarked"
          );
          // $("#" + iconID).innerText = "bookmark_border";
        });
    } else {
      //if it does not exist, then add it
      currentUser
        .set(
          {
            bookmarks: firebase.firestore.FieldValue.arrayUnion(id),
          },
          { merge: true }
        )
        .then(function () {
          console.log(`This bookmark is added for ${userDoc.data().name}`);
          var iconID = "save-" + id;
          console.log(iconID);
          $(`#product-${"#" + id} .wishlist-btn`).addClass("yellogreen");
          // $("#"+iconID).innerText = "bookmark";
        });
    }
  });
}
