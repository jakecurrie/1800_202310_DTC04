function queryProductCategory() {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const category = urlParams.get("category");
  const productList = document.getElementById("product-list");
  const categoryHeader = document.getElementById("category-header");

  
  categoryHeader.innerHTML = category;

  const db = firebase.firestore();
  const productsRef = db.collection("products").where("product_type", "==", category);
  productsRef.get().then((querySnapshot) => {
    let row = document.createElement("div");
    row.classList.add("row");
    productList.appendChild(row);

    let cardCount = 0;
    querySnapshot.forEach((doc) => {
      const product = doc.data();
      const productCard = `
        <div class="col-sm-4">
          <div class="card">
            <img class="card-img-top" src="${product.image_url}" alt="${product.name}">
            <div class="card-body">
              <h5 class="card-title">${product.product_name}</h5>
              <p class="card-price">${product.price}</p>
            </div>
          </div>
        </div>
      `;
      row.innerHTML += productCard;
      cardCount++;

      if (cardCount % 3 === 0) {
        row = document.createElement("div");
        row.classList.add("row");
        productList.appendChild(row);
      }
    });
  }).catch((error) => {
    console.error(error);
  });
}


queryProductCategory()