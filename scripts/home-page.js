// navbar background change and snowscraper name visible when scroll
const navbar = document.querySelector('.navbar');
const logo = document.querySelector('.navbar-logo');
const navbarTitle = document.querySelector('.navbar-title');

// Show navbar when window is at 100px
function showNavBar() {
  yPos = window.pageYOffset;
  if (yPos < 100) {
    navbar.style.backgroundColor = 'transparent';
    navbarTitle.style.display = 'none';
    logo.style.opacity = '0.5';
  } else {
    navbar.style.backgroundColor = '#263159';
    navbarTitle.style.display = 'block';
    logo.style.opacity = '1';
  }
}

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
shopBtn.addEventListener('click', scrollIntoCategory);

// clicking logo and name redirect to home page
const navbarLogoSection = document.querySelector('.logo-section');
navbarLogoSection.addEventListener('click', () => {
  window.location.replace('/home-page.html');
});

// Show user name if logged in, if else, show my account
function userLoginStatus() {
  myAccountBtn = document.querySelector('#login');
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      currentUser = db.collection('users').doc(user.uid);
      currentUser.onSnapshot((doc) => {
        myAccountBtn.innerHTML = doc.data().name;
      });
      const logoutBtn = document.querySelector('.fa-arrow-right-from-bracket');
      logoutBtn.style.display = 'block';
      //hover event listeners
      const loginText = document.querySelector('#login');
      loginText.addEventListener('mouseover', () => {
        loginText.innerHTML = 'Logout';
      });
      loginText.addEventListener('mouseout', () => {
        currentUser.onSnapshot((doc) => {
          myAccountBtn.innerHTML = doc.data().name;
        });
        //click event listener
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
      myAccountBtn.innerHTML = 'Login';
      const loginBox = document.querySelector('#refer-login');
      loginBox.setAttribute('href', './login.html');
    }
  });
}

userLoginStatus();
