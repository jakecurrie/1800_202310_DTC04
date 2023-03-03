const cardsPerPage = 12;
let currentPage = 1;
let allProducts;

function displayCardsDynamically(collection) {
  db.collection(collection)
    .get()
    .then((res) => {
      allProducts = res;
      queryProductCategory();
    });
}

displayCardsDynamically("products");

function queryProductCategory() {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const category = urlParams.get("category");
  const productList = document.getElementById("product-list");
  const categoryHeader = document.getElementById("category-header");

  categoryHeader.innerHTML = category;

  const db = firebase.firestore();
  const productsRef = db
    .collection("products")
    .where("product_type", "==", category);
  productsRef
    .get()
    .then((querySnapshot) => {
      let cardCount = 0;
      let productCards = "";
      let categoryDocCount = querySnapshot.size;
      querySnapshot.forEach((doc) => {
        if (
          cardCount >= (currentPage - 1) * cardsPerPage &&
          cardCount < currentPage * cardsPerPage
        ) {
          const product = doc.data();
          const productCard = `
            <div class="col-6 col-lg-3">
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
                  <h4 class="product-store">${product.store_name}</h4>
                </div>
              </div>
            </div>
          `;
          productCards += productCard;
        }
        cardCount++;
      });
      productList.innerHTML = productCards;
      return categoryDocCount;
    })
    .then((categoryDocCount) => {
      const totalPages = Math.ceil(categoryDocCount / cardsPerPage);
      generatePagination(totalPages);
    })
    .catch((error) => {
      console.error(error);
    });
}

var prevButton = document.getElementById("prev-btn");
var nextButton = document.getElementById("next-btn");

function generatePagination(totalPages) {
  const paginationContainer = document.getElementById("pagination-container");
  let paginationHTML = "";
  for (let i = 1; i <= totalPages; i++) {
    if (i === currentPage) {
      paginationHTML += `<button class="btn btn-floating text-dark bg-light">${i}</button>`;
    } else {
      paginationHTML += `<button class="btn text-dark">${i}</button>`;
    }
  }
  paginationContainer.innerHTML = paginationHTML;

  const paginationButtons = document.querySelectorAll(
    "#pagination-container button"
  );
  paginationButtons.forEach((button, index) => {
    button.addEventListener("click", () => {
      currentPage = index + 1;
      queryProductCategory();
      generatePagination(totalPages);
    });
  });
}

function handlePrevClick() {
  if (currentPage > 1) {
    currentPage--;
    queryProductCategory();
  }
}

function handleNextClick() {
  const totalPages = Math.ceil(categoryDocCount / cardsPerPage);
  if (currentPage < totalPages) {
    currentPage++;
    queryProductCategory();
  }
}

prevButton.addEventListener("click", handlePrevClick);
nextButton.addEventListener("click", handleNextClick);
