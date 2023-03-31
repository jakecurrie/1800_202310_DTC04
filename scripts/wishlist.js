const navbarLogoSection = document.querySelector('.logo-section');
navbarLogoSection.addEventListener('click', () => {
  window.location.replace('/home-page.html');
});

function userLoginStatus() {
  myAccountBtn = document.querySelector('#login');
  myAccountBtnMobile = document.querySelector('#login-mobile');
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      currentUser = db.collection('users').doc(user.uid);

      // generate the cards if logged in and pass the current user as arg
      generateFavoriteCards(currentUser);
      currentUser.onSnapshot((doc) => {
        myAccountBtn.innerHTML = doc.data().name;
        myAccountBtnMobile.innerHTML = 'Logout';
        //if logged in, show their name on the title
        const welcomeTitleSpan = document.querySelector('.user-name');
        welcomeTitleSpan.innerHTML = doc.data().name;
      });
      //if logged in, show the log out button
      const logoutBtn = document.querySelector('.fa-arrow-right-from-bracket');
      logoutBtn.style.display = 'block';

      //hover event listeners
      // when hover over account name, change to the text log oout
      const loginText = document.querySelector('#login');
      loginText.addEventListener('mouseover', () => {
        loginText.innerHTML = 'Logout';
      });

      // when hover out, changes the text to the user name
      loginText.addEventListener('mouseout', () => {
        currentUser.onSnapshot((doc) => {
          myAccountBtn.innerHTML = doc.data().name;
        });

        //click event listener
        // when clicked log out, log out
        loginText.addEventListener('click', () => {
          firebase
            .auth()
            .signOut()
            .then(() => {
              console.log('logged out');
            })
            .catch((error) => {
              console.log(error);
            });
        });
      });
    } else {
      // change the account name to login if not logged in
      myAccountBtn.innerHTML = 'Login';
      myAccountBtnMobile.innerHTML = 'Login';
      // if not logged in, show the text log in and change the href attribute to login page
      const loginBox = document.querySelector('#refer-login');
      const loginBoxMobile = document.querySelector('.refer-login-mobile');
      const logoutBtn = document.querySelector('.fa-arrow-right-from-bracket');
      logoutBtn.style.display = 'none';
      loginBox.setAttribute('href', './login.html');
      loginBoxMobile.setAttribute('href', './login.html');
      // if
      const welcomeTitle = document.querySelector('.title-welcome');
      welcomeTitle.innerHTML = 'Log in to see your wishlist!';
    }
  });
}

userLoginStatus();

// Hamburger menu
const hamburger = document.querySelector('.hamburger');
hamburger.addEventListener('click', (event) => {
  let hamOrX = event.target.getAttribute('class');
  const sideNav = document.querySelector('.navbar-features-mobile');
  if (hamOrX == 'fa-solid fa-bars') {
    event.target.className = 'fa-solid fa-xmark';
    sideNav.style.boxShadow = '2px 2px 2px 2px rgba(0, 0, 0, 0.281)';
    sideNav.style.right = '0';
  } else {
    event.target.className = 'fa-solid fa-bars';
    sideNav.style.boxShadow = 'none';
    sideNav.style.right = '-125px';
  }
});

function generateFavoriteCards(currentUser) {
  const cardContainer = document.querySelector('.content-container');
  currentUser
    .get()
    .then((doc) => {
      doc.data().bookmarks.forEach((productID) => {
        db.collection('products')
          .doc(productID)
          .onSnapshot((doc) => {
            if (doc.exists) {
              product = doc.data();
              const productCard = `
          <div class="part-1">
            <img class="card-image" src="${product.image_url}" alt="${product.product_name}">
            <div id="icon-${productID}">
              <p><i id="wishlist-${productID}" class="fa fa-heart wishlist-btn"></i></p>
              <a href="${product.product_url}"target="_blank"><i class="fa fa-link link-btn"></i></a>
            </div>
          </div>
          <div class="part-2">
            <h3 class="card-price">$${product.price}</h3>
            <h4 class="card-title">${product.product_name}</h4>
            <h4 class="card-store">${product.store}</h4>
          </div>
            `;
              card = cardContainer.appendChild(document.createElement('div'));
              card.classList.add(`content-card-${productID}`);
              card.innerHTML = productCard;
              const cardDiv = document.querySelector(
                `.content-card-${productID}`
              );
              const iconDiv = document.getElementById(`icon-${productID}`);
              // Event Listener
              // When hover over card, show the icons
              card.addEventListener('mouseover', () => {
                iconDiv.style.bottom = '10px';
                iconDiv.style.opacity = '1';
              });
              // When not hover dont show the icons
              card.addEventListener('mouseout', () => {
                iconDiv.style.bottom = '0px';
                iconDiv.style.opacity = '0';
              });
              // when click heart icon...
              iconDiv.children[0].addEventListener('click', () => {
                iconDiv.children[0].style.color = 'black';
                // ...remove from bookmark
                currentUser
                  .update({
                    bookmarks:
                      firebase.firestore.FieldValue.arrayRemove(productID),
                  })
                  .then(function () {
                    cardDiv.remove();
                  });
                // remove the card div
              });
            }
          });
      });
    })
    .catch((error) => {
      console.log(error);
    });
}

// Event Listeners
