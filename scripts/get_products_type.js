const cardsPerPage = 12;
let currentPage = 1;
let allProducts;
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
      const priceRange = allProducts.map((doc) => doc.data().price);
      const priceMin = Math.min(...priceRange);
      const priceMax = Math.max(...priceRange);
      // console.log("min price is", priceMin);
      // console.log("max price is", priceMax);
      generatePagination();
      generateProductCards();
      populateStores();
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
              <li><a href="#"><i class="fa fa-heart"></i></a></li>
              <li><a href="${product.image_url}"target="_blank"><i class="fa fa-link"></i></a></li>
            </ul>
          </div>
          <div class="part-2">
            <h3 class="product-price">$${product.price}</h3>
            <h4 class="product-title">${product.product_name}</h4>
            <h4 class="product-store">${product.store}</h4>
          </div>
        </div>
      </div>
    `;
    productList.append(productCard);
  });
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

//filter panel - populate store
function populateStores() {
  const stores = new Set();
  allProducts.forEach((doc) => {
    const product = doc.data();
    stores.add(product.store);
  });

  const checkboxesContainer = $("#stores-checkboxes");
  let checkboxesHTML = "";
  stores.forEach((store) => {
    checkboxesHTML += `
      <div class="form-check">
        <input class="form-check-input" type="checkbox" id="${store}" checked>
        <label class="form-check-label" for="${store}">${store}</label>
      </div>
    `;
  });
  checkboxesContainer.html(checkboxesHTML);
}

//filter panel - double range price slider
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

function slideOne() {
  if (parseInt(sliderTwo.val()) - parseInt(sliderOne.val()) <= 10) {
    sliderOne.val(parseInt(sliderTwo.val()) - 10);
  }
  $("#price-min").text("Min: $" + sliderOne.val());
  fillColor();
}

function slideTwo() {
  if (parseInt(sliderTwo.val()) - parseInt(sliderOne.val()) <= 10) {
    sliderTwo.val(parseInt(sliderOne.val()) + 10);
  }
  $("#price-max").text("Max: $" + sliderTwo.val());
  fillColor();
}

function fillColor() {
  percent1 = (sliderOne.val() / sliderMaxValue) * 100;
  percent2 = (sliderTwo.val() / sliderMaxValue) * 100;
  sliderTrack.css(
    "background",
    `linear-gradient(to right, #dadae5 ${percent1}% , #3264fe ${percent1}% , #3264fe ${percent2}%, #dadae5 ${percent2}%)`
  );
}

//filter panel - apply filters
function applyFilter() {
  const storeCheckboxes = $(".form-check-input:checked");
  const selectedStores = [];
  storeCheckboxes.each(function () {
    selectedStores.push($(this).attr("id"));
  });

  const filteredProducts = allProducts.filter((doc) => {
    const product = doc.data();
    const productPrice = parseFloat(product.price);
    const selectedPriceMin = parseFloat($("#slider-1").val());
    const selectedPriceMax = parseFloat($("#slider-2").val());
    var filterStores = false;
    var filterPrices = false;

    if (selectedStores.length === 0 || selectedStores.includes(product.store)) {
      filterStores = true;
    }
    if (productPrice >= selectedPriceMin && productPrice <= selectedPriceMax) {
      filterPrices = true;
    }

    return filterStores && filterPrices;
  });

  allProducts = filteredProducts;
  currentPage = 1;
  generatePagination();
  generateProductCards();
}

$("#apply-filter").on("click", function () {
  applyFilter();
});
