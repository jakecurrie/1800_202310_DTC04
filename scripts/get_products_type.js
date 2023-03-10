const cardsPerPage = 12;
let currentPage = 1;
let allProducts;

function queryProductCategory() {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const category = urlParams.get("category");
  const productList = $("#product-list");
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
      generatePagination();
      generateProductCards();
      populateStores();
    })
    .catch((error) => {
      console.error(error);
    });
}

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

  if (currentPage === 1) {
    prevBtn.hide();
  } else {
    prevBtn.show();
  }

  if (currentPage === totalPages) {
    nextBtn.hide();
  } else {
    nextBtn.show();
  }

  paginationContainer.off().on("click", ".pagbtn", function () {
    currentPage = $(this).index() + 1;
    generateProductCards();
    generatePagination();
    console.log(currentPage);
  });
}

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
              <li><a href="#"><i class="fa fa-link"></i></a></li>
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

$("#prev-btn").on("click", function () {
  if (currentPage > 1) {
    currentPage--;
    console.log(currentPage);
    generateProductCards();
    generatePagination();
  }
});

$("#next-btn").on("click", function () {
  const totalPages = Math.ceil(allProducts.length / cardsPerPage);
  if (currentPage < totalPages) {
    currentPage++;
    console.log(currentPage);
    generateProductCards();
    generatePagination();
  }
});

queryProductCategory();

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
        <input class="form-check-input" type="checkbox" id="${store}">
        <label class="form-check-label" for="${store}">${store}</label>
      </div>
    `;
  });
  checkboxesContainer.html(checkboxesHTML);
}
