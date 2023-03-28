// navbar background change and snowscraper name visible when scroll
const navbar = document.querySelector('.navbar');
const logo = document.querySelector('.navbar-logo');
const navbarTitle = document.querySelector('.navbar-title');

// Show navbar when window is at 100px
function showNavBar() {
  const body = document.getElementById("body")
  yPos = window.pageYOffset;
  if (yPos < 100) {
    navbar.style.backgroundColor = 'transparent';
    navbarTitle.style.display = 'none';
    logo.style.opacity = '0.5';
    // hide scrollbar
    body.classList.add('hidden-scrollbar');
  } else {
    navbar.style.backgroundColor = '#263159';
    navbarTitle.style.display = 'block';
    logo.style.opacity = '1';
    // show scrollbar
    body.classList.remove('hidden-scrollbar');
  }
}
// Hamburger menu 
const hamburger = document.querySelector(".hamburger")
hamburger.addEventListener('click', (event) => {
  let hamOrX = event.target.getAttribute("class")
  const sideNav = document.querySelector(".navbar-features-mobile")
  if (hamOrX == "fa-solid fa-bars") {
      event.target.className = "fa-solid fa-xmark"
      sideNav.style.boxShadow = "2px 2px 2px 2px rgba(0, 0, 0, 0.281)"
      sideNav.style.right = "0"
  } else {
      event.target.className = "fa-solid fa-bars"
      sideNav.style.boxShadow = "none"
      sideNav.style.right = "-125px"
  }
})

// when website is loaded / scrolled, call the shownavbar function
window.addEventListener('load', showNavBar);
window.addEventListener('scroll', showNavBar);

//When clicked on shop, it scrolls down to the item categories
function scrollIntoCategory() {
  document
    .querySelector('.shop-category')
    .scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
}

const shopBtn = document.querySelector('#refer-category');
const shopBtnMobile = document.querySelector('.refer-category-mobile');
shopBtn.addEventListener('click', scrollIntoCategory);
shopBtnMobile.addEventListener('click', scrollIntoCategory);

// clicking logo and name redirect to home page
const navbarLogoSection = document.querySelector('.logo-section');
navbarLogoSection.addEventListener('click', () => {
  window.location.replace('/home-page.html');
});

// Show user name if logged in, if else, show my account
function userLoginStatus() {
  myAccountBtn = document.querySelector('#login');
  myAccountBtnMobile = document.querySelector('#login-mobile');
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      currentUser = db.collection('users').doc(user.uid);
      currentUser.onSnapshot((doc) => {
        myAccountBtn.innerHTML = doc.data().name;
        myAccountBtnMobile.innerHTML = "Logout";
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
      loginBox.setAttribute('href', './login.html');
      loginBoxMobile.setAttribute('href', './login.html');
    }
  });
}

userLoginStatus();
