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
      let row = document.createElement("div");
      row.classList.add("row");
      productList.appendChild(row);

      let cardCount = 0;
      querySnapshot.forEach((doc) => {
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
        row.innerHTML += productCard;
        cardCount++;

        if (cardCount % 4 === 0) {
          row = document.createElement("div");
          row.classList.add("row");
          productList.appendChild(row);
        }
      });
    })
    .catch((error) => {
      console.error(error);
    });
}

queryProductCategory();
